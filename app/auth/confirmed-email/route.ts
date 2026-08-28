import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const tokenHash = String(
    formData.get("token_hash") ?? ""
  ).trim();

  const type = String(
    formData.get("type") ?? ""
  ).trim();

  if (!tokenHash || type !== "email") {
    return NextResponse.redirect(
      new URL("/login?error=missing_confirmation_token", request.url),
      303
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  });

  if (error || !data.session || !data.user) {
    console.error(
      "Email confirmation failed:",
      error?.message ?? "No session returned"
    );

    return NextResponse.redirect(
      new URL("/login?error=email_confirmation_failed", request.url),
      303
    );
  }

  return NextResponse.redirect(
    new URL("/profile_build", request.url),
    303
  );
}