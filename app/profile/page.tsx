import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

type DatabaseRow = Record<string, unknown>;

async function logoutAction() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

function Sidebar() {
  const navItems = [
    { href: "/apphome", label: "Home", code: "01", active: false },
    { href: "/profile", label: "Profile", code: "02", active: true },
    { href: "/snapshot", label: "Snapshot", code: "03", active: false },
    { href: "/share", label: "Share", code: "04", active: false },
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

function toText(value: unknown, fallback = "Not added yet") {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

function toTextList(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter(
      (entry): entry is string => typeof entry === "string" && Boolean(entry.trim()),
    );
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function savedDate(value: unknown) {
  if (typeof value !== "string") {
    return "No snapshot saved";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "No snapshot saved";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [studentResponse, profileResponse] = await Promise.all([
    supabase.from("users").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  const student = (studentResponse.data ?? null) as unknown as DatabaseRow | null;
  const profile = (profileResponse.data ?? null) as unknown as DatabaseRow | null;
  const loadFailed = Boolean(studentResponse.error || profileResponse.error);

  const clubs = toTextList(student?.clubs);
  const skillGroups = [
    { label: "General talents", values: toTextList(profile?.general_talents) },
    { label: "Hard skills", values: toTextList(profile?.hard_skills) },
    { label: "Soft skills", values: toTextList(profile?.soft_skills) },
  ];

  const careerFields = [
    { label: "Selected major", value: profile?.major },
    { label: "Desired field", value: profile?.desired_field },
    { label: "Desired outcome", value: profile?.desired_outcome },
    { label: "Employee type", value: profile?.employee_type },
    { label: "Work environment", value: profile?.work_environment },
    { label: "Preferred location", value: profile?.desired_location },
  ];

  return (
    <main
      className="min-h-screen bg-[#F1F4F8] pt-[112px] text-[#111111]"
      style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-[1440px] flex-col border-x border-[#D5D9DE] lg:flex-row">
        <Sidebar />

        <section className="min-w-0 flex-1 p-6 sm:p-10 lg:p-14">
          <header className="border-b-2 border-[#111111] pb-7">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#667085]">
              Account / Profile
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
              Your Pilot profile.
            </h1>
          </header>

          {loadFailed && (
            <p className="mt-7 border-2 border-[#B42318] bg-[#FFF0F0] p-4 text-sm font-bold text-[#8B1E1E]">
              PathPilot could not load all profile fields. Refresh once before changing any data.
            </p>
          )}

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="border-[3px] border-[#111111] bg-white shadow-[5px_5px_0_#111111]">
              <div className="border-b-2 border-[#111111] bg-[#F4C542] px-6 py-4">
                <h2 className="text-xl font-black">Student information</h2>
              </div>
              <dl className="grid sm:grid-cols-2">
                {[
                  { label: "First name", value: student?.first_name },
                  { label: "Last name", value: student?.last_name },
                  { label: "Email", value: student?.email ?? user.email },
                  { label: "Class year", value: student?.year },
                ].map((field) => (
                  <div key={field.label} className="border-b border-[#CDD2D8] p-5 sm:odd:border-r">
                    <dt className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#667085]">
                      {field.label}
                    </dt>
                    <dd className="mt-2 break-words text-sm font-black">
                      {toText(field.value)}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="p-5">
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#667085]">
                  Clubs and organizations
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {clubs.length > 0 ? (
                    clubs.map((club) => (
                      <span key={club} className="border border-[#111111] bg-[#F6F4EE] px-3 py-1.5 text-xs font-bold">
                        {club}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#667085]">Not added yet</span>
                  )}
                </div>
              </div>
            </section>

            <section className="border-[3px] border-[#111111] bg-[#111111] p-6 text-white shadow-[5px_5px_0_#F4C542]">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#CDD2D8]">
                Latest snapshot
              </p>
              <p className="mt-4 text-2xl font-black">
                {profile?.recommendation ? "Snapshot available" : "No snapshot yet"}
              </p>
              <p className="mt-3 text-sm text-[#D5D9DE]">
                {savedDate(profile?.saved_at)}
              </p>
              <Link
                href="/snapshot"
                className="mt-8 inline-flex border-2 border-white bg-[#F4C542] px-5 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#FFFFFF]"
              >
                View Snapshot →
              </Link>
            </section>
          </div>

          <section className="mt-8 border-2 border-[#111111] bg-white">
            <div className="border-b-2 border-[#111111] px-6 py-4">
              <h2 className="text-xl font-black">Career profile</h2>
            </div>
            <dl className="grid sm:grid-cols-2 xl:grid-cols-3">
              {careerFields.map((field) => (
                <div key={field.label} className="border-b border-r border-[#CDD2D8] p-5">
                  <dt className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#667085]">
                    {field.label}
                  </dt>
                  <dd className="mt-2 text-sm font-black">{toText(field.value)}</dd>
                </div>
              ))}
            </dl>

            <div className="grid gap-6 p-6 md:grid-cols-3">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <h3 className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#667085]">
                    {group.label}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.values.length > 0 ? (
                      group.values.map((value) => (
                        <span key={value} className="border border-[#111111] px-3 py-1.5 text-xs font-bold">
                          {value}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[#667085]">Not added yet</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
