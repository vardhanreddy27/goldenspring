import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

function getSqlClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

async function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword) {
    return false;
  }

  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  return inputPassword === storedPassword;
}

export function isGoogleAuthEnabled() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function getAuthSecretSource() {
  if (process.env.NEXTAUTH_SECRET) {
    return "NEXTAUTH_SECRET";
  }

  if (process.env.AUTH_SECRET) {
    return "AUTH_SECRET";
  }

  if (process.env.DATABASE_URL) {
    return "DATABASE_URL_FALLBACK";
  }

  return "MISSING";
}

function resolveAuthSecret() {
  const source = getAuthSecretSource();

  if (source === "NEXTAUTH_SECRET") {
    return process.env.NEXTAUTH_SECRET;
  }

  if (source === "AUTH_SECRET") {
    return process.env.AUTH_SECRET;
  }

  if (source === "DATABASE_URL_FALLBACK") {
    // Stable fallback for production deployments when explicit secret is missing.
    return crypto.createHash("sha256").update(process.env.DATABASE_URL).digest("hex");
  }

  return undefined;
}

async function findAdminById(userId) {
  const sql = getSqlClient();
  const rows = await sql`
    SELECT id, name, email, role, number, password
    FROM admin
    WHERE CAST(id AS text) = ${userId}
    LIMIT 1
  `;

  return rows[0] || null;
}

async function findAdminByEmail(email) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const sql = getSqlClient();
  const rows = await sql`
    SELECT id, name, email, role, number
    FROM admin
    WHERE LOWER(email) = ${normalizedEmail}
    LIMIT 1
  `;

  return rows[0] || null;
}

async function findTeacherById(userId) {
  const normalizedUserId = userId?.trim();

  if (!normalizedUserId) {
    return null;
  }

  const sql = getSqlClient();
  const rows = await sql`
    SELECT id, email, role, password
    FROM users
    WHERE CAST(id AS text) = ${normalizedUserId}
    LIMIT 1
  `;

  return rows[0] || null;
}

async function findTeacherByEmail(email) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const sql = getSqlClient();
  const rows = await sql`
    SELECT id, email, role
    FROM users
    WHERE LOWER(email) = ${normalizedEmail}
    LIMIT 1
  `;

  return rows[0] || null;
}

const providers = [
  CredentialsProvider({
    name: "Admin Login",
    credentials: {
      userId: { label: "User ID", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const userId = credentials?.userId?.trim();
      const password = credentials?.password;

      if (!userId || !password) {
        throw new Error("Enter your user ID and password.");
      }

      const admin = await findAdminById(userId);

      if (!admin) {
        throw new Error("Invalid user ID or password.");
      }

      const passwordMatches = await verifyPassword(password, admin.password);

      if (!passwordMatches) {
        throw new Error("Invalid user ID or password.");
      }

      return {
        id: String(admin.id),
        name: admin.name ? String(admin.name) : String(admin.id),
        role: admin.role ? String(admin.role) : "principal",
        userType: "admin",
        phone: admin.number ? String(admin.number) : "",
        email: admin.email ? String(admin.email) : "",
      };
    },
  }),
  CredentialsProvider({
    id: "teacher-credentials",
    name: "Teacher Login",
    credentials: {
      userId: { label: "User ID", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const userId = credentials?.userId?.trim();
      const password = credentials?.password;

      if (!userId || !password) {
        throw new Error("Enter your user ID and password.");
      }

      const teacher = await findTeacherById(userId);

      if (!teacher) {
        throw new Error("Invalid user ID or password.");
      }

      const passwordMatches = await verifyPassword(password, teacher.password);

      if (!passwordMatches) {
        throw new Error("Invalid user ID or password.");
      }

      const fallbackEmail = teacher.email ? String(teacher.email) : "";
      const fallbackName = (fallbackEmail.split("@")[0] || `Teacher ${teacher.id}`).replace(/[._-]+/g, " ");
      const formattedName = fallbackName
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

      return {
        id: String(teacher.id),
        name: formattedName || "Teacher",
        role: teacher.role ? String(teacher.role) : "teacher",
        userType: "teacher",
        phone: "",
        email: fallbackEmail,
      };
    },
  }),
];

if (isGoogleAuthEnabled()) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  secret: resolveAuthSecret(),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/Admin_login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user?.email?.toLowerCase();

      if (!email) {
        return "/Admin_login?error=UnauthorizedEmail";
      }

      const admin = await findAdminByEmail(email);
      if (admin) {
        return true;
      }

      const teacher = await findTeacherByEmail(email);
      return teacher ? true : "/Admin_login?error=UnauthorizedEmail";
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role || "admin";
        token.userType = user.userType || "admin";
        token.name = user.name || "";
        token.phone = user.phone || "";
        token.email = user.email || "";
      }

      if (account?.provider === "google" && token.email) {
        const admin = await findAdminByEmail(token.email);

        if (admin) {
          token.userId = String(admin.id);
          token.role = admin.role ? String(admin.role) : "principal";
          token.userType = "admin";
          token.name = admin.name ? String(admin.name) : token.name || "";
          token.phone = admin.number ? String(admin.number) : "";
          token.email = admin.email ? String(admin.email) : token.email;
        } else {
          const teacher = await findTeacherByEmail(token.email);

          if (teacher) {
            const fallbackName = (String(teacher.email || "").split("@")[0] || `Teacher ${teacher.id}`).replace(/[._-]+/g, " ");
            const formattedName = fallbackName
              .split(" ")
              .filter(Boolean)
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(" ");

            token.userId = String(teacher.id);
            token.role = teacher.role ? String(teacher.role) : "teacher";
            token.userType = "teacher";
            token.name = formattedName || "Teacher";
            token.phone = "";
            token.email = teacher.email ? String(teacher.email) : token.email;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.userType = token.userType || "admin";
        session.user.name = token.name || session.user.name || "";
        session.user.phone = token.phone || "";
        session.user.email = token.email || session.user.email || "";
      }

      return session;
    },
  },
};

export function nextAuthHandler(req, res) {
  return NextAuth(req, res, authOptions);
}
