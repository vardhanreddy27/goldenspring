import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import Head from "next/head";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

const CLIENT_CACHE_CLEANUP_VERSION = "gs-client-cache-cleanup-v2";
const INLINE_FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%231f2937'/%3E%3Ctext x='50%25' y='56%25' text-anchor='middle' fill='white' font-size='24' font-family='Arial,sans-serif'%3EGS%3C/text%3E%3C/svg%3E";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminInstallContext = router.pathname === "/Admin_login";
  const isTeacherInstallContext = router.pathname === "/Teacher_login" || router.pathname === "/Teacherdashboard";
  const isParentInstallContext = router.pathname === "/Parent_login" || router.pathname === "/Parentdashboard";
  const isStudentInstallContext =
    router.pathname === "/Student_login" ||
    router.pathname === "/Studentdashboard" ||
    router.pathname === "/Student_quiz";
  const appTitle = isAdminInstallContext
    ? "Nava Chaitanya Bharathi ADMIN"
    : isTeacherInstallContext
      ? "Nava Chaitanya Bharathi TEACHERS"
      : isParentInstallContext || isStudentInstallContext
        ? "Nava Chaitanya Bharathi Parents"
      : "Nava Chaitanya Bharathi ";
  const manifestPath = isAdminInstallContext
    ? "/manifest-admin.webmanifest"
    : isTeacherInstallContext
      ? "/manifest-teacher.webmanifest"
      : isParentInstallContext
        ? "/manifest-parent.webmanifest"
        : isStudentInstallContext
          ? "/manifest-student.webmanifest"
      : "/manifest.webmanifest";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // One-time cleanup to remove stale cached assets/cookies after branding changes.
    if (!window.localStorage.getItem(CLIENT_CACHE_CLEANUP_VERSION)) {
      const runCleanup = async () => {
        try {
          if ("serviceWorker" in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map((registration) => registration.unregister()));
          }

          if ("caches" in window) {
            const cacheKeys = await window.caches.keys();
            await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
          }

          if (typeof document !== "undefined" && document.cookie) {
            document.cookie.split(";").forEach((cookie) => {
              const eqPos = cookie.indexOf("=");
              const name = (eqPos > -1 ? cookie.slice(0, eqPos) : cookie).trim();
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            });
          }
        } finally {
          window.localStorage.setItem(CLIENT_CACHE_CLEANUP_VERSION, "done");
        }
      };

      runCleanup();
    }

    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      return;
    }

    const registerServiceWorker = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Ignore registration errors silently in production.
      });
    };

    window.addEventListener("load", registerServiceWorker);

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>{appTitle}</title>
        <meta name="application-name" content={appTitle} />
        <meta
          name="description"
          content="Nava Chaitanya Bharathi  progressive web app"
        />
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={appTitle} />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href={manifestPath} />
        <link rel="icon" href={INLINE_FAVICON} />
        <link rel="shortcut icon" href={INLINE_FAVICON} />
        <link rel="apple-touch-icon" href={INLINE_FAVICON} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
