import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

type ConfirmedEmailPageProps = {
  searchParams: Promise<{
    token_hash?: string;
    type?: string;
  }>;
};

export default async function ConfirmedEmailPage({
  searchParams,
}: ConfirmedEmailPageProps) {
  const { token_hash: tokenHash, type } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If a valid session already exists, continue onboarding.
  if (user) {
    redirect("/profile_build");
  }

  // A confirmation token is required to establish the session.
  if (!tokenHash || type !== "email") {
    redirect("/login?error=missing_confirmation_token");
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[#F1F4F8] px-6 text-[#111111]"
      style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
    >
      <section className="w-full max-w-[460px] border-2 border-[#111111] bg-white p-8 shadow-[5px_5px_0_#111111]">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#667085]">
          PathPilot / Email Verification
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">
          Confirm your email.
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#555555]">
          Click below to verify your school email and continue building your
          profile.
        </p>

        <form action="/auth/confirm-email" method="post" className="mt-7">
          <input
            type="hidden"
            name="token_hash"
            value={tokenHash}
          />

          <input
            type="hidden"
            name="type"
            value="email"
          />

          <button
            type="submit"
            className="flex w-full items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-5 py-3.5 text-sm font-black shadow-[3px_3px_0_#111111]"
          >
            Confirm Email →
          </button>
        </form>
      </section>
    </main>
  );
}