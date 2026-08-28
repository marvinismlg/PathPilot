import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

interface CareerAngleSnapshot {
  id?: string;
  tagline?: string | null;
  overview?: string | null;
  score?: number;
  sources?: string[];
}

interface JobSnapshot {
  id?: string;
  title?: string;
  score?: number;
  rank?: number;
  categoryId?: string | null;
  sourceCategory?: string | null;
  shortDescription?: string | null;
  keyStrengths?: string[];
  hardSkills?: string[];
  softSkills?: string[];
  possibleSkillGaps?: string[];
  usualEmployers?: string[];
}

interface CourseSnapshot {
  id?: string;
  title?: string;
  courseCode?: string;
  department?: string;
  courseDescription?: string;
  credits?: number;
  whyRecommended?: string;
  skillsDeveloped?: string[];
  prerequisites?: string[];
}

interface InternshipSnapshot {
  internshipId?: string;
  internshipTitle?: string;
  sourceJobTitle?: string;
  reasons?: string[];
  preparationSteps?: string[];
  suggestedSearchTerms?: string[];
}

interface NextStepSnapshot {
  id?: string;
  text?: string;
  source?: string;
}

interface RecommendationSnapshot {
  schemaVersion?: number;
  careerAngle?: CareerAngleSnapshot | null;
  jobs?: JobSnapshot[];
  courses?: CourseSnapshot[];
  skills?: {
    hard?: string[];
    soft?: string[];
  };
  internships?: InternshipSnapshot[];
  workLocations?: string[];
  nextSteps?: NextStepSnapshot[];
  courseSources?: string[];
  jobSources?: string[];
}

async function logoutAction() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

function Sidebar() {
  const navItems = [
    { href: "/apphome", label: "Home", code: "01", active: false },
    { href: "/profile", label: "Profile", code: "02", active: false },
    { href: "/snapshot", label: "Snapshot", code: "03", active: true },
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

function safeStrings(values: string[] | undefined) {
  return (values ?? []).filter((value) => typeof value === "string" && Boolean(value.trim()));
}

function Tags({ values, empty = "Not included in this snapshot" }: { values: string[] | undefined; empty?: string }) {
  const cleanValues = safeStrings(values);

  if (cleanValues.length === 0) {
    return <p className="text-sm text-[#667085]">{empty}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {cleanValues.map((value) => (
        <span key={value} className="border border-[#111111] bg-[#F6F4EE] px-3 py-1.5 text-xs font-bold">
          {value}
        </span>
      ))}
    </div>
  );
}

function formatSavedAt(value: unknown) {
  if (typeof value !== "string" || !value) {
    return "Save time unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Save time unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function SnapshotPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("recommendation, saved_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const recommendation = (data?.recommendation ?? null) as unknown as RecommendationSnapshot | null;
  const jobs = recommendation?.jobs ?? [];
  const courses = recommendation?.courses ?? [];
  const internships = recommendation?.internships ?? [];
  const nextSteps = recommendation?.nextSteps ?? [];
  const sources = Array.from(
    new Set([
      ...safeStrings(recommendation?.careerAngle?.sources),
      ...safeStrings(recommendation?.jobSources),
      ...safeStrings(recommendation?.courseSources),
    ]),
  );

  return (
    <main
      className="min-h-screen bg-[#F1F4F8] pt-[112px] text-[#111111]"
      style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-[1440px] flex-col border-x border-[#D5D9DE] lg:flex-row">
        <Sidebar />

        <section className="min-w-0 flex-1 p-6 sm:p-10 lg:p-14">
          <header className="border-b-2 border-[#111111] pb-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#667085]">
                  Saved Recommendation / Snapshot
                </p>
                <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                  Your PathPilot snapshot.
                </h1>
              </div>
              {recommendation && (
                <p className="border-2 border-[#111111] bg-white px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em]">
                  Saved {formatSavedAt(data?.saved_at ?? null)}
                </p>
              )}
            </div>
          </header>

          {error ? (
            <div className="mt-8 border-[3px] border-[#B42318] bg-[#FFF0F0] p-6 text-[#8B1E1E]">
              <h2 className="text-xl font-black">Snapshot could not be loaded.</h2>
              <p className="mt-2 text-sm">Refresh once. If this remains, check the profiles SELECT policy.</p>
            </div>
          ) : !recommendation ? (
            <div className="mt-8 border-[3px] border-[#111111] bg-white p-8 shadow-[6px_6px_0_#111111]">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.15em] text-[#667085]">
                No saved payload
              </p>
              <h2 className="mt-3 text-3xl font-black">You have not saved a recommendation yet.</h2>
              <Link
                href="/test"
                className="mt-7 inline-flex border-2 border-[#111111] bg-[#F4C542] px-6 py-3 text-sm font-black shadow-[3px_3px_0_#111111]"
              >
                Start PathPilot →
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              <section className="grid gap-5 lg:grid-cols-[1fr_220px]">
                <div className="border-[3px] border-[#111111] bg-[#F4C542] p-7 shadow-[5px_5px_0_#111111]">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em]">Career Angle</p>
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                    {recommendation.careerAngle?.id ?? "Career direction"}
                  </h2>
                  {recommendation.careerAngle?.tagline && (
                    <p className="mt-3 text-sm font-black leading-6">{recommendation.careerAngle.tagline}</p>
                  )}
                  {recommendation.careerAngle?.overview && (
                    <p className="mt-5 max-w-3xl border-t-2 border-[#111111] pt-5 text-sm leading-7">
                      {recommendation.careerAngle.overview}
                    </p>
                  )}
                </div>
                <div className="flex flex-col justify-center border-[3px] border-[#111111] bg-[#111111] p-6 text-white">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#CDD2D8]">Match score</p>
                  <p className="mt-3 text-5xl font-black">{Math.round(recommendation.careerAngle?.score ?? 0)}%</p>
                </div>
              </section>

              <section>
                <div className="mb-5 flex items-end justify-between border-b-2 border-[#111111] pb-3">
                  <h2 className="text-2xl font-black">Job recommendations</h2>
                  <span className="font-mono text-[10px] font-black">{jobs.length} SAVED</span>
                </div>
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <details key={job.id ?? `${job.title}-${index}`} className="group border-2 border-[#111111] bg-white shadow-[3px_3px_0_#D5D9DE]">
                      <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                        <span className="flex h-10 w-10 items-center justify-center border-2 border-[#111111] bg-[#F6A6B2] font-mono text-xs font-black">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xl font-black">{job.title ?? job.id ?? "Recommended role"}</span>
                          <span className="mt-1 block font-mono text-[9px] font-black uppercase tracking-[0.1em] text-[#667085]">
                            {Math.round(job.score ?? 0)}% match · {job.sourceCategory ?? job.categoryId ?? "Source unavailable"}
                          </span>
                        </span>
                        <span className="font-mono text-xs font-black group-open:hidden">OPEN +</span>
                        <span className="hidden font-mono text-xs font-black group-open:inline">CLOSE −</span>
                      </summary>
                      <div className="grid gap-6 border-t-2 border-[#111111] p-6 lg:grid-cols-2">
                        <div>
                          <p className="text-sm leading-7 text-[#333333]">{job.shortDescription ?? "No description saved."}</p>
                          <h3 className="mt-5 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#667085]">Key strengths</h3>
                          <div className="mt-3"><Tags values={job.keyStrengths} /></div>
                          <h3 className="mt-5 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#667085]">Possible skill gaps</h3>
                          <div className="mt-3"><Tags values={job.possibleSkillGaps} /></div>
                        </div>
                        <div className="space-y-5 lg:border-l-2 lg:border-[#111111] lg:pl-6">
                          <div><h3 className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#667085]">Hard skills</h3><div className="mt-3"><Tags values={job.hardSkills} /></div></div>
                          <div><h3 className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#667085]">Soft skills</h3><div className="mt-3"><Tags values={job.softSkills} /></div></div>
                          <div><h3 className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#667085]">Usual employers</h3><div className="mt-3"><Tags values={job.usualEmployers} /></div></div>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-5 flex items-end justify-between border-b-2 border-[#111111] pb-3">
                  <h2 className="text-2xl font-black">Loyola courses</h2>
                  <span className="font-mono text-[10px] font-black">{courses.length} SAVED</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {courses.map((course, index) => (
                    <article key={course.id ?? `${course.title}-${index}`} className="border-2 border-[#111111] bg-white p-5 shadow-[3px_3px_0_#8EC5FF]">
                      <p className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-[#667085]">
                        {course.courseCode ?? `Course ${index + 1}`} · {course.department ?? "Department unavailable"}
                      </p>
                      <h3 className="mt-2 text-xl font-black">{course.title ?? course.id ?? "Recommended course"}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#555555]">{course.whyRecommended ?? course.courseDescription ?? "No course explanation saved."}</p>
                      <div className="mt-4"><Tags values={course.skillsDeveloped} /></div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="grid gap-5 md:grid-cols-2">
                <div className="border-2 border-[#111111] bg-[#A8D5A2] p-6">
                  <h2 className="text-2xl font-black">Hard skills</h2>
                  <div className="mt-5"><Tags values={recommendation.skills?.hard} /></div>
                </div>
                <div className="border-2 border-[#111111] bg-[#F6A6B2] p-6">
                  <h2 className="text-2xl font-black">Soft skills</h2>
                  <div className="mt-5"><Tags values={recommendation.skills?.soft} /></div>
                </div>
              </section>

              <section>
                <div className="mb-5 flex items-end justify-between border-b-2 border-[#111111] pb-3">
                  <h2 className="text-2xl font-black">Internship search paths</h2>
                  <span className="font-mono text-[10px] font-black">{internships.length} SAVED</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {internships.map((internship, index) => (
                    <article key={internship.internshipId ?? `${internship.internshipTitle}-${index}`} className="border-2 border-[#111111] bg-white p-5">
                      <p className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-[#667085]">From {internship.sourceJobTitle ?? "recommended role"}</p>
                      <h3 className="mt-2 text-xl font-black">{internship.internshipTitle ?? "Internship pathway"}</h3>
                      <div className="mt-4 space-y-2 text-sm leading-6 text-[#444444]">
                        {safeStrings(internship.reasons).map((reason) => <p key={reason}>{reason}</p>)}
                      </div>
                      <h4 className="mt-5 font-mono text-[9px] font-black uppercase tracking-[0.12em] text-[#667085]">Preparation</h4>
                      <ol className="mt-3 space-y-3 text-sm leading-6">
                        {safeStrings(internship.preparationSteps).map((step, stepIndex) => <li key={step}><span className="mr-2 font-mono font-black">{String(stepIndex + 1).padStart(2, "0")}</span>{step}</li>)}
                      </ol>
                      <div className="mt-5"><Tags values={internship.suggestedSearchTerms} /></div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="grid gap-5 lg:grid-cols-[1fr_0.55fr]">
                <div className="border-2 border-[#111111] bg-white p-6">
                  <h2 className="text-2xl font-black">What&apos;s next</h2>
                  <ol className="mt-5 space-y-4">
                    {nextSteps.map((step, index) => (
                      <li key={step.id ?? `${step.text}-${index}`} className="flex gap-4 border-t border-[#CDD2D8] pt-4 first:border-t-0 first:pt-0">
                        <span className="font-mono text-xs font-black">{String(index + 1).padStart(2, "0")}</span>
                        <div><p className="text-sm font-bold leading-6">{step.text ?? "Next step unavailable"}</p><p className="mt-1 font-mono text-[9px] font-black uppercase text-[#667085]">{step.source ?? "PathPilot"}</p></div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="border-2 border-[#111111] bg-[#C4A7E7] p-6">
                  <h2 className="text-2xl font-black">Work locations</h2>
                  <div className="mt-5"><Tags values={recommendation.workLocations} /></div>
                </div>
              </section>

              {sources.length > 0 && (
                <section className="border-t-2 border-[#111111] pt-7">
                  <h2 className="text-2xl font-black">Saved sources</h2>
                  <ol className="mt-5 grid gap-2">
                    {sources.map((source, index) => (
                      <li key={source}>
                        <a href={source} target="_blank" rel="noreferrer" className="flex gap-3 border border-[#111111] bg-white p-4 text-sm hover:bg-[#F6F4EE]">
                          <span className="font-mono text-[10px] font-black">{String(index + 1).padStart(2, "0")}</span>
                          <span className="min-w-0 flex-1 break-all font-bold underline underline-offset-2">{source}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              <p className="mx-auto max-w-4xl border-t border-[#BFC5CC] pt-6 text-center font-mono text-[10px] font-bold uppercase leading-5 tracking-[0.08em] text-[#7A828C]">
                Disclaimer: PathPilot is an independent technical and personal project and is not affiliated with, endorsed by, or sponsored by Loyola University Maryland. Its recommendations are informational only and should not be treated as definitive academic or career advice.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
