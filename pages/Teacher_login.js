import React, { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function Teacher_login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleTeacherLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await signIn("teacher-credentials", {
      userId,
      password,
      redirect: false,
      callbackUrl: "/Teacherdashboard",
    });

    setIsSubmitting(false);

    if (result?.error) {
      setErrorMessage(result.error);
      Swal.fire({
        icon: "error",
        title: "Sign in failed",
        text: result.error,
        confirmButtonColor: "#f2b705",
      });
      return;
    }

    window.location.href = result?.url || "/Teacherdashboard";
  }

  async function handleGoogleLogin() {
    setErrorMessage("");
    setIsSubmitting(true);

    const googleResult = await signIn("google", {
      redirect: false,
      callbackUrl: "/Teacherdashboard",
    });

    if (googleResult?.error) {
      setIsSubmitting(false);
      const errorText = "Google sign in failed. Please try again.";
      setErrorMessage(errorText);
      Swal.fire({
        icon: "error",
        title: "Google sign in failed",
        text: errorText,
        confirmButtonColor: "#f2b705",
      });
      return;
    }

    const session = await getSession();
    setIsSubmitting(false);

    if (session?.user?.userType === "teacher") {
      window.location.href = "/Teacherdashboard";
      return;
    }

    if (session?.user?.userType === "admin") {
      window.location.href = "/Admindashboard";
      return;
    }

    window.location.href = googleResult?.url || "/Teacherdashboard";
  }

  return (
    <div className="min-h-dvh w-full bg-white md:min-h-screen md:bg-gray-100 md:flex md:items-center md:justify-center md:p-6">
      <div className="grid min-h-dvh w-full grid-rows-[0.92fr_1.08fr] bg-white px-6 pb-[calc(env(safe-area-inset-bottom)+1.75rem)] pt-[calc(env(safe-area-inset-top)+1.75rem)] md:hidden">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-4xl bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.16)] ring-1 ring-slate-200">
              <Image src="/logo.png" alt="School Logo" width={58} height={58} className="object-contain" priority />
            </div>
            <h1 className="mt-5 text-[2rem] font-semibold tracking-tight text-slate-950">NMS Teacher Login</h1>
            <p className="mt-2 text-sm text-slate-500">Secure sign in for teachers</p>
          </div>
        </div>

        <div className="flex items-start justify-center">
          <form className="w-full max-w-sm rounded-4xl bg-white p-5" onSubmit={handleTeacherLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="teacher-user-id" className="text-sm font-medium text-slate-600">User ID</label>
                <input
                  id="teacher-user-id"
                  type="text"
                  placeholder="Enter your user id"
                  className="mt-1.5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
                  autoComplete="username"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="teacher-password" className="text-sm font-medium text-slate-600">Password</label>
                <input
                  id="teacher-password"
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1.5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}

              <button
                type="submit"
                className="w-full rounded-full bg-[#f2b705] py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-22px_rgba(242,183,5,0.8)] hover:bg-[#d9a300] focus:outline-none focus:ring-4 focus:ring-[#f7e2a3] disabled:cursor-not-allowed disabled:bg-[#f3da84]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full rounded-full border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                Continue with Google
              </button>

              <p className="text-center text-xs text-slate-500">Secure access for authorized teachers only.</p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden w-full overflow-hidden bg-white shadow-none md:grid md:min-h-162.5 md:max-w-6xl md:grid-cols-2 md:rounded-3xl md:border md:border-slate-200 md:shadow-[0_24px_70px_-44px_rgba(15,23,42,0.22)]">
        <div className="relative overflow-hidden bg-white px-6 pb-14 pt-10 text-slate-900 sm:px-8 md:flex md:items-center md:px-10 md:py-14">
          <div className="relative z-10 mx-auto max-w-70 text-center">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-4xl bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.16)] ring-1 ring-slate-200">
              <Image src="/logo.png" alt="School Logo" width={60} height={60} className="object-contain" priority />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Nagarjuna Model School</h1>
            <p className="mt-4 text-sm/6 text-slate-600">Teacher app access for classes, attendance and academic planning.</p>
          </div>
        </div>

        <div className="px-5 pb-8 pt-6 sm:px-7 md:flex md:items-center md:px-10 md:py-12">
          <form className="w-full space-y-4" onSubmit={handleTeacherLogin}>
            <div className="mb-1">
              <h2 className="text-2xl font-semibold text-slate-900">Teacher Sign In</h2>
              <p className="mt-1 text-sm text-slate-500">Welcome back.</p>
            </div>

            <div>
              <label htmlFor="teacher-user-id-desktop" className="text-sm font-medium text-slate-600">User ID</label>
              <input
                id="teacher-user-id-desktop"
                type="text"
                placeholder="Enter your user id"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
                autoComplete="username"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="teacher-password-desktop" className="text-sm font-medium text-slate-600">Password</label>
              <input
                id="teacher-password-desktop"
                type="password"
                placeholder="Enter your password"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {errorMessage ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[#f2b705] py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-22px_rgba(242,183,5,0.75)] hover:bg-[#d9a300] focus:outline-none focus:ring-4 focus:ring-[#f7e2a3] disabled:cursor-not-allowed disabled:bg-[#f3da84]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full rounded-full border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              Continue with Google
            </button>

            <p className="text-center text-xs text-slate-500 md:text-sm">Secure access for authorized teachers only.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session?.user?.userType === "teacher") {
    return {
      redirect: {
        destination: "/Teacherdashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
