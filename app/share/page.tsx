"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

function Sidebar({ onLogout, isLoggingOut }: { onLogout: () => void; isLoggingOut: boolean }) {
  const navItems = [
    { href: "/apphome", label: "Home", code: "01", active: false },
    { href: "/profile", label: "Profile", code: "02", active: false },
    { href: "/snapshot", label: "Snapshot", code: "03", active: false },
    { href: "/share", label: "Share", code: "04", active: true },
  ];

  return (
    <aside className="flex w-full flex-col border-b-2 border-[#111111] bg-white lg:w-[270px] lg:shrink-0 lg:border-b-0 lg:border-r-2">
      <div className="border-b-2 border-[#111111] px-6 py-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#667085]">
          Student Portal
        </p>
        <Link href="/apphome" className="mt-2 block text-2xl font-black tracking-[-0.04em]">
          PathPilot<span className="text-[#D9A900]">.</span>
        </Link>
      </div>

      <nav aria-label="Student dashboard" className="grid gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={`flex items-center gap-4 border-2 border-[#111111] px-4 py-3 text-sm font-black transition ${
              item.active
                ? "bg-[#F4C542] shadow-[3px_3px_0_#111111]"
                : "bg-white hover:bg-[#F6F4EE]"
            }`}
          >
            <span className="font-mono text-[10px]">{item.code}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t-2 border-[#111111] p-4">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-between border-2 border-[#111111] bg-[#111111] px-4 py-3 text-sm font-black text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:text-[#AEB4BB]"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>
  );
}

export default function SharePage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    setShareUrl("https://path-pilot-sable.vercel.app/");

    async function verifySession() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setIsCheckingSession(false);
    }

    void verifySession();
  }, [router]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F1F4F8] text-[#111111]">
        <p className="border-2 border-[#111111] bg-white px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111]">
          Checking session...
        </p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#F1F4F8] pt-[112px] text-[#111111]"
      style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-[1440px] flex-col border-x border-[#D5D9DE] lg:flex-row">
        <Sidebar onLogout={handleLogout} isLoggingOut={isLoggingOut} />

        <section className="flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-[720px] border-[3px] border-[#111111] bg-white p-8 text-center shadow-[7px_7px_0_#111111] sm:p-12">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#667085]">
              Share / PathPilot
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
              Share PathPilot with a friend.
            </h1>

            <div className="mt-8 border-2 border-[#111111] bg-[#F6F4EE] px-4 py-3 text-left font-mono text-xs font-bold">
              <span className="block truncate">{shareUrl}</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!shareUrl}
              className="mt-5 inline-flex min-w-[230px] items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-6 py-3.5 text-sm font-black shadow-[4px_4px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:bg-[#D9DDE2]"
            >
              {copyStatus === "copied" ? "Link Copied ✓" : "Copy PathPilot Link"}
            </button>

            {copyStatus === "error" && (
              <p className="mt-4 text-sm font-bold text-[#8B1E1E]">
                Your browser blocked clipboard access. Copy the displayed link manually.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
