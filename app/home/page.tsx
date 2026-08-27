"use client";

import Link from "next/link";
import Image from "next/image";



export default function HomePage() {
 return (
  <main className="min-h-screen bg-[#F3F3F1] pt-[112px] font-sans text-[#111111]">
    <div className="mx-auto w-full max-w-[1320px] bg-white">

      {/* HERO */}
      <section className="grid grid-cols-1 border-b border-[#B8B8B8] lg:grid-cols-[1fr_0.95fr]">
        {/* LEFT */}
        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-14 xl:px-16">
          <div className="w-full max-w-[620px]">

            <h1 className="max-w-xl text-[48px] font-black leading-[0.98] tracking-[-0.045em] text-[#111111] sm:text-[58px] lg:text-[66px]">
              Plan your future with{" "}
              <span className="text-[#C99B00]">
                PathPilot.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-[16px] leading-7 text-[#3F3F3F]">
              PathPilot matches your interests, intended major, and goals to realistic
              career options, then gives you a clear plan to move forward.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/studentsignup"
                className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-6 py-3 text-[15px] font-bold text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Find your path
                <span className="ml-3">→</span>
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center border border-[#8D8D8D] bg-white px-6 py-3 text-[15px] font-bold text-[#0000CC] underline underline-offset-2"
              >
                See Career Angles
              </a>
            </div>

            {/* FEATURES */}
            <div className="mt-10 grid grid-cols-1 border-y border-white sm:grid-cols-3">
              <div className="py-5 sm:pr-5">
                <p className="text-sm font-bold text-black ">
                  Career matches
                </p>

                <p className="mt-2 text-sm leading-5 text-[#555555]">
                  Options based on who you actually are.
                </p>
              </div>

              <div className="border-t border-[#C8C8C8] py-5 sm:border-l sm:border-t-0 sm:px-5">
                <p className="text-sm font-bold text-black ">
                  Skill direction
                </p>

                <p className="mt-2 text-sm leading-5 text-[#555555]">
                  See what to improve and why it matters.
                </p>
              </div>

              <div className="border-t border-[#C8C8C8] py-5 sm:border-l sm:border-t-0 sm:pl-5">
                <p className="text-sm font-bold text-black ">
                  Weekly plan
                </p>

                <p className="mt-2 text-sm leading-5 text-[#555555]">
                  Turn career goals into practical next steps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative min-h-[500px] border-l-0 border-[#B8B8B8] lg:border-l">
          <Image
            src="/images/laptop.png"
            alt="Student using a laptop"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute bottom-4 left-4 bg-[#F4C542] px-3 py-2 text-[11px] font-bold uppercase">
            Student Spotlight
          </div>
        </div>
      </section>

      


      {/* WHERE TO START */}
      <section className="border-black border-black bg-white">
        <div className="flex flex-col gap-5 px-6 py-7 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-14">
          <div>

            <h2 className="text-2xl font-black">
              Where to start
            </h2>

            <p className="mt-1 text-[15px] text-[#444444]">
              Answer a few questions and we’ll point you in the right direction.
            </p>
          </div>

          <Link
            href="/quiz"
            className="inline-flex w-fit items-center font-bold text-[#0000CC] underline underline-offset-2"
          >
            Take the quiz
            <span className="ml-2">»</span>
          </Link>
        </div>
      </section>
      {/* EXPLANATION */}
      <section className="px-6 py-24 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-[1100px] text-center">

          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-tight tracking-[-0.035em] md:text-5xl">
            Career planning made easier for students at{" "}
            <span className="text-[#479763]">
              Loyola.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-5xl text-lg leading-8 text-[#333333]">
            Not sure what major or career you want to pursue? We can help! PathPilot learns your personality,
            work type and long-term goals, then turns those results into career matches and a clear, next-step action plan.
          </p>

          <div className="mx-auto mt-12 w-full">
            <Image
              src="/images/checkmarks.png"
              alt="PathPilot career planning process"
              width={1600}
              height={700}
              className="h-auto w-full border-white border-white"
            />
          </div>
        </div>
      </section>

      {/* CAMPUS IMAGE */}
      <div
        className="relative h-80 overflow-hidden border-y border-[#B8B8B8] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/rinsed.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute left-6 top-6 bg-[#F4C542] px-4 py-3">

          <p className="mt-1 text-lg font-black">
            Built for Loyola students.
          </p>
        </div>
      </div>

      {/* FOUNDER */}
      <section
        id="about-founder"
        className="bg-[#EFEFED] px-6 py-24 sm:px-10 lg:px-14"
      >
        <div className="mx-auto max-w-[900px]">
          {/* Small retro navigation */}
          <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-[#B8B8B8] pb-4 text-sm font-bold">
            <span className="text-black">Why PathPilot?</span>
            <span className="text-black">Loyola Connection</span>
            <span className="text-black">The Student Mission</span>
          </div>


          <h2 className="text-4xl font-black tracking-[-0.035em] text-[#111111] md:text-5xl">
            Why create PathPilot?
          </h2>

          <p className="mt-7 max-w-3xl whitespace-pre-line text-lg leading-8 text-[#444444]">
            {`PathPilot is a student-built web development and data engineering project created at Loyola University Maryland to help students make clearer academic and career decisions.

The platform organizes career, course, and skill data into a structured, rule-based recommendation system that connects each student’s interests, strengths, and goals with relevant career paths and practical next steps.

Built from firsthand experience with the uncertainty of choosing a major and career, PathPilot turns scattered information into personalized guidance students can understand and use.`}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/about"
              className="inline-flex w-fit items-center border-2 border-[#111111] bg-[#F4C542] px-5 py-3 text-sm font-bold shadow-[3px_3px_0_#111111]"
            >
              More about us
            </Link>

            <Link
              href="/studentsignup"
              className="inline-flex w-fit items-center border border-[#888888] bg-white px-5 py-3 text-sm font-bold text-[#0000CC] underline"
            >
              Take the test
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#111111] bg-white">
        <div className="bg-[#172A5A] px-6 py-2 text-[11px] font-bold uppercase text-white sm:px-10 lg:px-14">
          PathPilot Student Career Portal
        </div>

        <div className="flex flex-col gap-7 px-6 py-8 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-14">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-[#F4C542]">
              <img
                src="/images/icon.png"
                alt="PathPilot logo"
                className="h-8 w-8"
              />
            </div>

            <div>
              <p className="text-lg font-black">
                PathPilot
              </p>

              <p className="text-sm text-[#555555]">
                Career direction for Loyola students.
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
            <Link href="/#about-founder" className="text-[#0000CC] underline">
              About
            </Link>

            <Link href="/#features" className="text-[#0000CC] underline">
              Features
            </Link>
            <Link href="/quiz" className="text-[#0000CC] underline">
              Take Quiz
            </Link>
          </nav>

          <p className="text-xs text-[#666666]">
            © 2026 PathPilot. Built at Loyola.
          </p>
        </div>

        <div className="border-t border-[#C4C4C4] bg-[#EEEEEC] px-6 py-3 text-center text-[11px] text-[#555555]">
          Career Matches · Skill Direction · Weekly Planning · Loyola University Maryland
        </div>
      </footer>
    </div>
  </main>
);
}