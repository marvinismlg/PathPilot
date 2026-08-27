"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] pt-[112px]">
         <section className="mx-auto w-full max-w-[1500px] px-6 py-20 md:px-10 lg:px-16">
  <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
    <div>
      <p className="mb-4 text-sm font-semibold text-[#479763]">
        What PathPilot does
      </p>

      <h2 className="text-4xl font-bold leading-tight md:text-5xl">
        We help students turn career confusion into a structured plan.
      </h2>

      <p className="mt-8 text-xl leading-9 text-[#4A4A4A]">
        PathPilot is a career planning tool built for students at Loyola who are
        still figuring out their major, career direction, internships, and next
        steps after college. The app asks information regarding your interests, strengths, work style,
        goals, and timeline, then turns that information into career
        recommendations, skill gaps, internship opportunities, calendar-based planning, and a
        clearer path forward.
      </p>

      <p className="mt-6 text-xl leading-9 text-[#4A4A4A]">
        The goal of our tool is not to choose your life for you. The goal is to help you
        narrow your options and know what to work on next.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-3xl bg-[#FAFAFA] p-6">
        <h3 className="text-lg font-bold">Career matches</h3>
        <p className="mt-3 text-sm leading-7 text-[#555]">
          Get recommended paths based on your profile, goals, strengths, and
          preferences.
        </p>
      </div>

      <div className="rounded-3xl bg-[#FAFAFA] p-6">
        <h3 className="text-lg font-bold">General direction</h3>
        <p className="mt-3 text-sm leading-7 text-[#555]">
          See which fields, roles, and paths make the most sense for where you
          are right now.
        </p>
      </div>

      <div className="rounded-3xl bg-[#FAFAFA] p-6">
        <h3 className="text-lg font-bold">Areas of Improvement</h3>
        <p className="mt-3 text-sm leading-7 text-[#555]">
          Understand what you are missing before you start applying or changing
          your major.
        </p>
      </div>

      <div className="rounded-3xl bg-[#FAFAFA] p-6">
        <h3 className="text-lg font-bold">Weekly plan</h3>
        <p className="mt-3 text-sm leading-7 text-[#555]">
          Turn your career goal into steps for projects, outreach, resumes, and
          internship prep.
        </p>
      </div>

      <div className="rounded-3xl bg-[#FAFAFA] p-6">
        <h3 className="text-lg font-bold">Jobs and internships</h3>
        <p className="mt-3 text-sm leading-7 text-[#555]">
          Connect your career matches to real opportunities and roles worth
          exploring.
        </p>
      </div>

      <div className="rounded-3xl bg-[#1A1A1A] p-6 text-white">
        <h3 className="text-lg font-bold">Calendar and timeline</h3>
        <p className="mt-3 text-sm leading-7 text-[#EAEAEA]">
          Build a timeline for what to do this week, this semester, and before
          graduation.
        </p>
      </div>
    </div>
  </div>
</section>

<div className="relative left-1/2 w-screen -ml-[50vw] py-32">
    <Image
    src="/images/banner.png"
    alt="PathPilot career planning process"
    width={1600}
    height={700}
    className="h-auto w-full"
  />
</div>
<section className="mx-auto w-full max-w-[1700px] px-8 py-24 md:px-12 lg:px-16">
  <div className="grid items-start gap-12 lg:grid-cols-[1fr_520px]">
    {/* Left headline */}
    <div>
      <p className="mb-6 text-lg font-semibold text-[#479763]">
        My path at Loyola
      </p>

      <h2 className="max-w-5xl text-5xl font-bold leading-tight text-[#1A1A1A] md:text-7xl">
        About the founder.
      </h2>
      <h3 className="mt-6 max-w-3xl text-xl leading-9 text-[#4A4A4A]">
        Hey, I'm Marvin. Here's a little about my journey and how PathPilot came to be.
      </h3>
    </div>

    {/* Right correlation graphic */}
    <div className="relative hidden h-[260px] lg:block">
      <div className="absolute left-[60px] top-[75px] z-10 flex flex-col items-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#F4C542]">
          <img
            src="/images/icon.png"
            alt="PathPilot logo"
            className="h-20 w-20 object-contain"
          />
        </div>

        <p className="mt-3 text-4xl font-bold text-[#1A1A1A]">
          Path<span className="text-[#F4C542]">Pilot</span>
        </p>
      </div>

      <div className="absolute left-[175px] top-[95px] h-px w-[260px] origin-left rotate-[-16deg] bg-[#1A1A1A]" />

      <div className="absolute right-0 top-0 z-10 flex flex-col items-center">
        <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-[7px] border-[#F4C542] bg-white">
          <Image
            src="/images/warkill-modified.png"
            alt="Founder"
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        </div>

        <p className="mt-3 text-4xl font-bold text-[#1A1A1A]">Me</p>
      </div>
    </div>
  </div>

  {/* Timeline cards */}
  <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-[16px] bg-[#FAFAFA] p-8">
      <p className="text-lg font-semibold text-[#479763]">Start</p>

      <h3 className="mt-6 text-3xl font-bold leading-tight text-[#1A1A1A]">
        Undecided Business
      </h3>

      <p className="mt-8 text-xl leading-10 text-[#4A4A4A]">
        I entered into Loyola knowing I wanted to do something useful in business, but I did
        not know exactly which direction made sense to me yet.
      </p>
    </div>

    <div className="rounded-[16px] bg-[#FAFAFA] p-8">
      <p className="text-lg font-semibold text-[#479763]">Freshman Year</p>

      <h3 className="mt-6 text-3xl font-bold leading-tight text-[#1A1A1A]">
        Marketing and Global Studies
      </h3>

      <p className="mt-8 text-xl leading-10 text-[#4A4A4A]">
        I started exploring majors that matched my interest in people,
        communication, business, and geopolitics.
      </p>
    </div>

    <div className="rounded-[16px] bg-[#FAFAFA] p-8">
      <p className="text-lg font-semibold text-[#479763]">Sophomore Year</p>

      <h3 className="mt-6 text-3xl font-bold leading-tight text-[#1A1A1A]">
        Economics and Information Systems
      </h3>

      <p className="mt-8 text-xl leading-10 text-[#4A4A4A]">
        I realized I wanted something more analytical, technical, and
        systems-based, so I changed direction again.
      </p>
    </div>

    <div className="rounded-[16px] bg-[#1A1A1A] p-8 text-white">
      <p className="text-lg font-semibold text-[#F4C542]">Now</p>

      <h3 className="mt-6 text-3xl font-bold leading-tight">
        Quantitative Economics and Information Systems
      </h3>

      <p className="mt-8 text-xl leading-10 text-[#EAEAEA]">
        I finally found a path that connects business, data, systems, and the
        kind of problems I actually enjoy solving.
      </p>
    </div>
  </div>
</section>

      <section className="mx-auto w-full max-w-[1500px] px-6 py-16 md:px-10 lg:px-16">
  <div className="rounded-[36px] px-8 py-12 md:px-14 md:py-16">
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-4 text-sm font-semibold text-[#479763]">
        How it started
      </p>

      <h2 className="text-4xl font-bold leading-tight md:text-5xl">
        PathPilot started as an unfinished hackathon project.
      </h2>

      <p className="mt-8 text-xl leading-9 text-[#4A4A4A]">
        Before becoming a web app, PathPilot was simply an idea for the Hackhounds 2026 competition. 
        The original idea was to develop a tool to help students navigate their career paths. Later, what originally started
        as a hackathon project morphed into something more concrete as I
        began to realize that I, alonside many of my peers, were actually struggling with career decisions.
      </p>

      <p className="mt-6 text-xl leading-9 text-[#4A4A4A]">
        In the future, our goal is to build PathPilot into a useful career planning
        tool for Loyola students and explore ways it could support the work of
        the Rizzo Career Center. The hope is that PathPilot can eventually become
        an official Career Center tool that helps students make career decisions with clarity.
      </p>
    </div>
  </div>
</section>

      <footer className="mt-20 w-full border-t border-[#ECECEC] bg-black">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <Image src="/images/icon.png" alt="PathPilot Logo" width={40} height={40} />

            <div>
              <p className="text-base font-semibold text-[#ffffff]">PathPilot</p>
              <p className="text-sm text-[#ffffff]">
                Career direction for Loyola students.
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-6 text-sm font-medium text-[#ffffff]">
            <Link href="/" className="transition hover:text-[#1A1A1A]">
              Home
            </Link>

            <Link href="/profile_form" className="transition hover:text-[#1A1A1A]">
              Take Quiz
            </Link>
          </nav>

          <p className="text-sm text-[#ffffff]">
            © 2026 PathPilot. Built at Loyola.
          </p>
        </div>
      </footer>
    </main>
  );
}