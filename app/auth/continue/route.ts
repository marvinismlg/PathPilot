import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(
      new URL("/login?error=authentication_required", url.origin)
    );
  }

  const [userRowResult, profileRowResult] =
    await Promise.all([
      supabase
        .from("users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle(),

      supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

  if (userRowResult.error || profileRowResult.error) {
    return NextResponse.redirect(
      new URL("/login?error=account_check_failed", url.origin)
    );
  }

  if (!userRowResult.data) {
    return NextResponse.redirect(
      new URL("/profile_build", url.origin)
    );
  }

  if (!profileRowResult.data) {
    return NextResponse.redirect(
      new URL("/test", url.origin)
    );
  }

  return NextResponse.redirect(
    new URL("/apphome", url.origin)
  );
}