import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();

  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth callback error:", error.message);

      return NextResponse.redirect(
        new URL("/login?error=authentication_failed", url.origin)
      );
    }

    return NextResponse.redirect(
      new URL("/auth/continue", url.origin)
    );
  }

if (tokenHash && type) {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error || !data.session) {
    console.error(
      "Email confirmation error:",
      error?.message ?? "No session returned"
    );

    return NextResponse.redirect(
      new URL("/login?error=email_confirmation_failed", url.origin)
    );
  }

  return NextResponse.redirect(
    new URL("/profile_build", url.origin)
  );
}

  return NextResponse.redirect(
    new URL("/login?error=missing_auth_parameters", url.origin)
  );
}