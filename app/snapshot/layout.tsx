import type { ReactNode } from "react";
import { requireCompletedProfile } from "../../lib/supabase/guard";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireCompletedProfile();

  return children;
}