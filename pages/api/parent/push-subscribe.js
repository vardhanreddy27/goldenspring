import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function getSqlClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    // Optionally, you can require authentication here
    // const session = await getServerSession(req, res, authOptions);
    // if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: "Invalid subscription" });
    }
    const sql = getSqlClient();
    // Upsert subscription by endpoint
    await sql`
      INSERT INTO push_subscriptions (endpoint, p256dh, auth)
      VALUES (${endpoint}, ${keys.p256dh}, ${keys.auth})
      ON CONFLICT (endpoint) DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth
    `;
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save subscription" });
  }
}// pages/api/parent/push-subscribe.js
import { promises as fs } from 'fs';
import path from 'path';

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'subscriptions.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const subscription = req.body;
      let subscriptions = [];
      try {
        const data = await fs.readFile(SUBSCRIPTIONS_FILE, 'utf8');
        subscriptions = JSON.parse(data);
      } catch (e) {
        // File may not exist yet
      }
      subscriptions.push(subscription);
      await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save subscription' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
