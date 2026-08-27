import type { ReactNode } from "react";
import { requireAuthenticatedUser } from "../../lib/supabase/guard";

export const dynamic = "force-dynamic";

export default async function ProfileBuildLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuthenticatedUser();

  return children;
}