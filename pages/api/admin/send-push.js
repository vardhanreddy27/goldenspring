import webpush from "web-push";
import { neon } from "@neondatabase/serverless";

let vapidConfigured = false;

function configureVapidDetails() {
  if (vapidConfigured) return;

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured.");
  }

  webpush.setVapidDetails("mailto:admin@goldenspring.com", publicKey, privateKey);
  vapidConfigured = true;
}

function getSqlClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: "Missing title or message" });
  }

  try {
    configureVapidDetails();
  } catch (error) {
    return res.status(500).json({ error: error.message || "VAPID keys are not configured." });
  }

  let sql;
  let subscriptions = [];
  let announcement = null;
  try {
    sql = getSqlClient();
    await sql`
      CREATE TABLE IF NOT EXISTS admin_announcements (
        id BIGSERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    const inserted = await sql`
      INSERT INTO admin_announcements (title, message)
      VALUES (${title.trim()}, ${message.trim()})
      RETURNING id, title, message, created_at
    `;
    announcement = inserted?.[0] || null;

    subscriptions = await sql`SELECT endpoint, p256dh, auth FROM push_subscriptions`;
  } catch (e) {
    // If DB isn't available, continue with push send attempt against empty subscriptions.
    subscriptions = [];
  }

  const payload = JSON.stringify({ title, message });
  const results = await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
        return { success: true };
      } catch (err) {
        return { success: false, error: err?.message || String(err) };
      }
    })
  );

  const successful = results.filter((item) => item.success).length;
  const failed = results.length - successful;

  res.status(200).json({
    attempted: results.length,
    sent: successful,
    failed,
    announcement,
    results,
  });
}
