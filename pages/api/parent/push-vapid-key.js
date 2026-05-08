// pages/api/parent/push-vapid-key.js
export default function handler(req, res) {
  const publicKey = process.env.VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return res.status(500).json({ error: "VAPID_PUBLIC_KEY is not configured." });
  }

  res.status(200).json({ publicKey });
}
