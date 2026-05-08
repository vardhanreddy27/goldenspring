import { neon } from "@neondatabase/serverless";

function getSqlClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = getSqlClient();
    await sql`
      CREATE TABLE IF NOT EXISTS admin_announcements (
        id BIGSERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    const announcements = await sql`
      SELECT id, title, message, created_at
      FROM admin_announcements
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return res.status(200).json({ announcements });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load announcements", announcements: [] });
  }
}
