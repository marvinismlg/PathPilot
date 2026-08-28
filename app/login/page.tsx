"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRef } from "react";

import {
  Turnstile,
  type TurnstileInstance,
} from "@marsidev/react-turnstile";

export default function LoginPage() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();
  setErrorMessage("");

  const formData = new FormData(event.currentTarget);
  const email = String(formData.get("email"))
    .trim()
    .toLowerCase();
  const password = String(formData.get("password"));

  if (!email.endsWith(".edu")) {
    setErrorMessage("Please use your .edu email address.");
    return;
  }

  if (!captchaToken) {
    setErrorMessage("Please complete the security verification.");
    return;
  }

  setLoading(true);

  const supabase = createClient();

  try {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken,
        },
      });

    if (error) {
      setErrorMessage(
        error.code === "email_not_confirmed"
          ? "Verify your email before signing in."
          : "Incorrect email or password."
      );

      return;
    }

    window.location.href = "/auth/continue";
  } catch {
    setErrorMessage(
      "PathPilot could not sign you in. Please try again."
    );
  } finally {
    turnstileRef.current?.reset();
    setCaptchaToken(null);
    setLoading(false);
  }
}

  async function handleGoogleLogin() {
    setErrorMessage("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <main
      className="min-h-screen bg-[#F1F4F8] pt-[112px] text-[#111111]"
      style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
    >
      <section className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-[1200px] items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px]">
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-[-0.035em]">
              Welcome back.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#555555]">
              Sign in to access your PathPilot profile and recommendations.
            </p>
          </div>

          <div className="border border-[#BFC5CC] bg-white p-6 shadow-[3px_3px_0_#D9DDE2] sm:p-8">
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#444444]">
                  School email
                </span>

                <input
                  required
                  type="email"
                  name="email"
                  placeholder="student@loyola.edu"
                  className="mt-2 w-full border border-[#AEB4BB] bg-white px-4 py-3 text-base outline-none placeholder:text-[#9299A2] focus:border-[#111111]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#444444]">
                  Password
                </span>

                <input
                  required
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="mt-2 w-full border border-[#AEB4BB] bg-white px-4 py-3 text-base outline-none placeholder:text-[#9299A2] focus:border-[#111111]"
                />
              </label>
<div className="flex justify-center">
  <Turnstile
    ref={turnstileRef}
    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
    onSuccess={(token) => setCaptchaToken(token)}
    onExpire={() => setCaptchaToken(null)}
    onError={() => setCaptchaToken(null)}
  />
</div>
              <button
                disabled={loading}
                type="submit"
                className="mt-2 flex w-full items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-5 py-3.5 text-sm font-bold shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <span className="ml-3">→</span>}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#CDD2D8]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7A828C]">
                Or
              </span>
              <div className="h-px flex-1 bg-[#CDD2D8]" />
            </div>

            <button
              disabled={loading}
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 border border-[#111111] bg-white px-5 py-3.5 text-sm font-bold transition hover:bg-[#F5F5F3] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue with Google
            </button>

            {errorMessage && (
              <p className="mt-5 text-sm font-semibold text-red-600">
                {errorMessage}
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-[#555555]">
            Don&apos;t have an account?{" "}
            <Link
              href="/studentsignup"
              className="font-bold text-[#111111] underline underline-offset-2"
            >
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}