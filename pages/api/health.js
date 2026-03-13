import { getAuthSecretSource } from "@/lib/auth";

function mapSecretMode(source) {
  if (source === "NEXTAUTH_SECRET" || source === "AUTH_SECRET") {
    return "explicit";
  }

  if (source === "DATABASE_URL_FALLBACK") {
    return "fallback";
  }

  return "missing";
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authSecretSource = getAuthSecretSource();

  return res.status(200).json({
    status: authSecretSource === "MISSING" ? "degraded" : "ok",
    auth: {
      secretMode: mapSecretMode(authSecretSource),
      source: authSecretSource,
    },
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasNextAuthUrl: Boolean(process.env.NEXTAUTH_URL),
      hasGoogleClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
      hasGoogleClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    },
    timestamp: new Date().toISOString(),
  });
}
