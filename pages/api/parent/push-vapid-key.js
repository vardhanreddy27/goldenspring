// pages/api/parent/push-vapid-key.js
export default function handler(req, res) {
  // You should set this in your .env file
  const publicKey = process.env.VAPID_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
  res.status(200).json({ publicKey });
}
