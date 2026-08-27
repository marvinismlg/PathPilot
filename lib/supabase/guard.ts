import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function requireAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return {
    supabase,
    userId: user.id,
  };
}

export async function requireCompletedProfile() {
  const { supabase, userId } = await requireAuthenticatedUser();

  const { data: userRow, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to verify profile completion.");
  }

  if (!userRow) {
    redirect("/profile_build");
  }

  return { supabase, userId };
}