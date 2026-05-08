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

  let subscriptions = [];
  try {
    const sql = getSqlClient();
    subscriptions = await sql`SELECT endpoint, p256dh, auth FROM push_subscriptions`;
  } catch (e) {
    // If DB isn't available or no subscriptions, continue with empty list
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

  res.status(200).json({ sent: results.length, results });
}
