"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRef  } from "react";
import {
  Turnstile,
  type TurnstileInstance,
} from "@marsidev/react-turnstile";
export default function StudentSignupPage() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  async function handleEmailSignup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"))
      .trim()
      .toLowerCase();
    const password = String(formData.get("password"));

    if (!email.endsWith(".edu")) {
      setErrorMessage("Please use a valid .edu email address.");
      return;
    }
const hasMinimumLength = password.length >= 12;
const hasLowercase = /[a-z]/.test(password);
const hasUppercase = /[A-Z]/.test(password);
const hasNumber = /[0-9]/.test(password);
const hasSymbol = /[^A-Za-z0-9]/.test(password);
if (!captchaToken) {
  setErrorMessage("Please compl.");
  return;
}
if (
  !hasMinimumLength ||
  !hasLowercase ||
  !hasUppercase ||
  !hasNumber ||
  !hasSymbol
) {
  setErrorMessage(
    "Password must be at least 12 characters and include uppercase, lowercase, a number, and a symbol."
  );
  return;
}
    if (password.length < 8) {
      setErrorMessage("Your password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
    captchaToken,
  },
});
turnstileRef.current?.reset();
setCaptchaToken(null);
if (data.session) {
  window.location.href = "/profile_build";
  return;
}

setSuccessMessage(
  "Check your email and verify your account before signing in."
);
    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.session) {
      window.location.href = "/";
      return;
    }

    setSuccessMessage(
      "Check your .edu inbox/junk mail and click the confirmation link."
    );
  }

  async function handleGoogleSignup() {
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
            <h1 className="mt-3 text-4xl font-black tracking-[-0.035em]">
              Create your account.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#555555]">
              Save your career matches, recommendations, and PathPilot profile.
            </p>
          </div>

          <div className="border border-[#BFC5CC] bg-white p-6 shadow-[3px_3px_0_#D9DDE2] sm:p-8">
            <form onSubmit={handleEmailSignup} className="space-y-5">
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
                  minLength={12}
                  type="password"
                  name="password"
                  placeholder="Create a password"
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
                {loading ? "Connecting..." : "Create Student Account"}
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
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-3 border border-[#111111] bg-white px-5 py-3.5 text-sm font-bold transition hover:bg-[#F5F5F3] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 3-4.2 3-7.1Z"
                />
                <path
                  fill="#34A853"
                  d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.1-2.4c-.9.6-2 1-3.5 1-2.6 0-4.8-1.7-5.6-4.1H3.2v2.5C4.9 19.8 8.2 22 12 22Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.4 14.1c-.2-.6-.3-1.3-.3-2.1s.1-1.4.3-2.1V7.4H3.2C2.4 8.8 2 10.4 2 12s.4 3.2 1.2 4.6l3.2-2.5Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.9 14.7 2 12 2 8.2 2 4.9 4.2 3.2 7.4l3.2 2.5C7.2 7.5 9.4 5.8 12 5.8Z"
                />
              </svg>

              Continue with Google
            </button>

            {errorMessage && (
              <p className="mt-5 text-sm font-semibold text-red-600">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="mt-5 text-sm font-semibold text-green-700">
                {successMessage}
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-[#555555]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#111111] underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}