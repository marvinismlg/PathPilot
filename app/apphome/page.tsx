import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

async function logoutAction() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

function Sidebar() {
  const navItems = [
    { href: "/apphome", label: "Home", code: "01", active: true },
    { href: "/profile", label: "Profile", code: "02", active: false },
    { href: "/snapshot", label: "Snapshot", code: "03", active: false },
    { href: "/share", label: "Share", code: "04", active: false },
  ];

  return (
    <aside className="flex w-full flex-col border-b-2 border-[#111111] bg-white lg:w-[270px] lg:shrink-0 lg:border-b-0 lg:border-r-2">
      <div className="border-b-2 border-[#111111] px-6 py-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#667085]">
          Student Portal
        </p>
        <Link
          href="/apphome"
          className="mt-2 block text-2xl font-black tracking-[-0.04em]"
        >
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

      <form action={logoutAction} className="mt-auto border-t-2 border-[#111111] p-4">
        <button
          type="submit"
          className="flex w-full items-center justify-between border-2 border-[#111111] bg-[#111111] px-4 py-3 text-sm font-black text-white transition hover:bg-[#333333]"
        >
          Logout
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </aside>
  );
}

export default async function AppHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main
      className="min-h-screen bg-[#F1F4F8] pt-[112px] text-[#111111]"
      style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-[1440px] flex-col border-x border-[#D5D9DE] lg:flex-row">
        <Sidebar />

        <section className="flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-[760px] border-[3px] border-[#111111] bg-white p-8 shadow-[7px_7px_0_#111111] sm:p-12">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#667085]">
              Dashboard / Coming Soon
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-6xl">
              Tasks, Plans and Schedule, coming soon.
            </h1>
          </div>
        </section>
      </div>
    </main>
  );
}
