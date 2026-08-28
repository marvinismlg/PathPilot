import Link from "next/link";

const technicalFeatures = [
  "Next.js 16, React 19, TypeScript, and Tailwind CSS web application",
  "Custom rule-based TypeScript recommendation and ranking engine",
  "Scoring that converts multi-factor compatibility into percentage-based career match rankings",
  "Weighted assessment across academic interests, skills, goals, education, salary, and work preferences",
  "Structured JSON datasets separating scoring inputs from student-facing career outputs",
  "Career Angle, job, course, skill, internship, work-location, and next-step recommendations",
  "Course resolution using recommended course IDs from category and job results",
  "Research-source tracking for career categories and Loyola course recommendations",
  "Supabase email authentication, email verification, and Google OAuth for login",
  "Server-side route protection and completed-profile access checks",
  "PostgreSQL Row Level Security restricting users to their own records",
  "Authenticated student profile and onboarding workflow",
  "JSONB recommendation snapshots with one saved profile row per student",
  "Responsive retro-inspired interface built for desktop and mobile use",
] as const;

const citedSources = [
  {
    name: "O*NET OnLine",
    description:
      "Occupational tasks, skills, knowledge, abilities, work activities, and career requirements.",
    href: "https://www.onetonline.org/",
  },
  {
    name: "U.S. Bureau of Labor Statistics",
    description:
      "Occupational Outlook Handbook data covering education, pay, work environments, and employment outlook.",
    href: "https://www.bls.gov/ooh/",
  },
  {
    name: "Loyola University Maryland Course Catalogue",
    description:
      "Official course descriptions, program requirements, prerequisites, credits, and academic policies.",
    href: "https://catalogue.loyola.edu/",
  },
  {
    name: "Loyola University Maryland Academic Programs",
    description:
      "Official department, degree, major, minor, and undergraduate program information.",
    href: "https://www.loyola.edu/academics/",
  },
] as const;

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#F3F3F1] pt-[112px] font-sans text-[#111111]">
      <div className="mx-auto w-full max-w-[1320px] border-x border-[#B8B8B8] bg-white">
        <header className="border-b border-[#B8B8B8] px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="text-sm font-bold text-[#0000CC] underline underline-offset-2"
            >
              Back to home
            </Link>
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Application Overview
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-[#3F3F3F]">
            Below lists the various technical features of the project while also
            providing a detailed summary of project purpose &amp; scope.
          </p>
        </header>

        <section className="grid border-b border-[#B8B8B8] lg:grid-cols-[220px_1fr]">
          <div className="border-b border-[#B8B8B8] bg-[#F4C542] p-6 lg:border-b-0 lg:border-r">
          </div>

          <div className="p-6 sm:p-10 lg:p-14">
            <h2 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">
              PathPilot Summary
            </h2>

            <div className="mt-7 max-w-4xl space-y-6 text-[16px] leading-8 text-[#3F3F3F]">
              <p>
                PathPilot is a Next.js and TypeScript, rule-based career
                recommendation application designed to help college students at
                Loyola turn their
                interests, intended major, skills, work preferences, education
                plans, and long-term goals into organized career direction.
                Instead of returning one generic job title, the platform builds
                a broader recommendation snapshot containing a Career Angle,
                ranked roles, relevant Loyola courses, hard and soft skills,
                internship search paths, possible work locations, and practical
                next steps.
              </p>

              <p>
                The weighted recommendation engine compares a student&apos;s assessment
                answers against independently researched category and job input
                records. Each assessment field receives a defined question
                weight, while individual career matches receive their own
                compatibility values. Categories and jobs are scored separately,
                ranked, and then connected with detailed output records stored in
                structured JSON datasets. Course recommendations are pulled from
                the course IDs attached to the winning category and recommended
                jobs rather than being independently scored.
              </p>

              <p>
                PathPilot also includes a Supabase-backed user database with
                email verification, Google authentication, server-side
                authentication, Row Level Security, and saved
                recommendation snapshots. Authenticated students can build a
                profile, complete the assessment, save one current snapshot, and
                return later to review the recommendation stored in their own
                database row.
              </p>
            </div>
          </div>
        </section>

        <section className="grid border-b border-[#B8B8B8] lg:grid-cols-[220px_1fr]">
          <div className="border-b border-[#B8B8B8] bg-[#172A5A] p-6 text-white lg:border-b-0 lg:border-r">
          </div>

          <div className="p-6 sm:p-10 lg:p-14">
            <h2 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">
              Technical Features
            </h2>

            <ul className="mt-8 grid border-l border-t border-[#B8B8B8] md:grid-cols-2">
              {technicalFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-4 border-b border-r border-[#B8B8B8] p-5 text-sm font-bold leading-6"
                >
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid border-b border-[#B8B8B8] lg:grid-cols-[220px_1fr]">
          <div className="border-b border-[#B8B8B8] bg-[#479763] p-6 text-white lg:border-b-0 lg:border-r">
          </div>

          <div className="p-6 sm:p-10 lg:p-14">
            <h2 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">
              Project Purpose
            </h2>

            <p className="mt-7 max-w-4xl text-[16px] leading-8 text-[#3F3F3F]">
              PathPilot was built as a full-stack web development, data
              engineering, and rule-based technical project. The purpose is to
              demonstrate how researched domain data, custom scoring logic,
              authentication, relational database design, access control, and
              student-focused UI/UX can be combined into one working web app. The
              project also explores how a technical system can organize messy
              academic and career data into a structured program and database.
            </p>
          </div>
        </section>

        <section className="grid border-b border-[#B8B8B8] lg:grid-cols-[220px_1fr]">
          <div className="border-b border-[#B8B8B8] bg-[#DC4D53] p-6 lg:border-b-0 lg:border-r">
          </div>

          <div className="p-6 sm:p-10 lg:p-14">
            <h2 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">
              Disclaimer
            </h2>

            <p className="mt-7 max-w-4xl text-[15px] leading-7 text-[#444444]">
              PathPilot is an independent technical and personal project and is
              NOT affiliated with, endorsed by, or sponsored by Loyola University
              Maryland. Its recommendations are informational only and should not
              be treated as definitive academic or career advice. Recommendation
              scores are generated from structured datasets, weighted rules, and
              student-provided answers; they cannot account for every personal,
              academic, financial, or labor-market factor. Students should verify
              important decisions with qualified academic advisers, career
              professionals, employers, and official university resources.
            </p>
          </div>
        </section>

        <section className="grid lg:grid-cols-[220px_1fr]">
          <div className="border-b border-[#B8B8B8] bg-[#F28C28] p-6 lg:border-b-0 lg:border-r">
          </div>

          <div className="p-6 sm:p-10 lg:p-14">
            <h2 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">
              Sources Cited
            </h2>

            <p className="mt-5 max-w-4xl text-[15px] leading-7 text-[#444444]">
              PathPilot&apos;s research dataset cites individual career,
              labor-market, course, and academic-program pages from the following
              primary sources.
            </p>

            <ul className="mt-8 grid border-l border-t border-[#B8B8B8] md:grid-cols-2">
              {citedSources.map((source) => (
                <li
                  key={source.name}
                  className="border-b border-r border-[#B8B8B8] p-5"
                >
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[15px] font-black text-[#0000CC] underline underline-offset-2"
                  >
                    {source.name} ↗
                  </a>
                  <p className="mt-2 text-sm leading-6 text-[#555555]">
                    {source.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="border-t border-[#111111] bg-[#172A5A] px-6 py-4 text-center font-mono text-[10px] font-black uppercase tracking-[0.12em] text-white sm:px-10 lg:px-14">
          PathPilot · Student Career Recommendation Project · 2026
        </footer>
      </div>
    </main>
  );
}
