import { neon } from "@neondatabase/serverless";
import webpush from "web-push";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "YOUR_PUBLIC_KEY";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "YOUR_PRIVATE_KEY";

webpush.setVapidDetails(
  "mailto:admin@goldenspring.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

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

  let subscriptions = [];
  try {
    const sql = getSqlClient();
    subscriptions = await sql`SELECT endpoint, p256dh, auth FROM push_subscriptions`;
  } catch (error) {
    return res.status(500).json({ error: "Failed to load subscriptions" });
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
      } catch (error) {
        return { success: false, error: error.message };
      }
    })
  );

  res.status(200).json({ sent: results.length, results });
}
