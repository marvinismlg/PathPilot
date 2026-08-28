"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import courseOutputs from "../../data/courseoutputs.json";

type Course = {
  id: string;
  title: string;
  courseCode: string;
  department: string;
  courseDescription: string;
  credits: number;
  whyRecommended: string;
  requiredForMajorIds: string[];
  prerequisites: string[];
  isPlaceholder: boolean;
};

const courses = courseOutputs as Course[];

function splitIntoSentences(text: string) {
  return (
    text
      .trim()
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map((sentence) => sentence.trim()) ?? []
  );
}

function getThreeSentenceDescription(course: Course) {
  const descriptionSentences = splitIntoSentences(course.courseDescription);

  if (descriptionSentences.length >= 3) {
    return descriptionSentences.slice(0, 3).join(" ");
  }

  const additionalSentences = splitIntoSentences(course.whyRecommended);

  return [...descriptionSentences, ...additionalSentences]
    .slice(0, 3)
    .join(" ");
}

function shortenPrerequisite(prerequisite: string) {
  return prerequisite
    .replace(
      /written or electronic permission of the instructor/gi,
      "Instructor permission",
    )
    .replace(
      /written permission of the instructor/gi,
      "Instructor permission",
    )
    .replace(
      /must be taken previously or concurrently/gi,
      "previously or concurrently",
    )
    .replace(/must be taken concurrently/gi, "concurrent")
    .replace(
      /sophomore, junior, or senior standing/gi,
      "Sophomore standing or above",
    );
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return courses;
    }

    return courses.filter((course) =>
      [
        course.title,
        course.courseCode,
        course.department,
        course.courseDescription,
        course.requiredForMajorIds.join(" "),
        course.prerequisites.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-[#F3F3F1] pt-[112px] font-[Arial] text-[#171717]">
      <div className="mx-auto w-full max-w-[1320px] border-x border-[#111111] bg-white">
        <header className="grid border-b border-[#111111] lg:grid-cols-[220px_1fr]">
          <div className="border-b border-[#111111] bg-[#F4C542] p-6 lg:border-b-0 lg:border-r">
            <p className="font-mono text-xs font-black uppercase tracking-[0.16em]">
              PathPilot Index
            </p>
          </div>

          <div className="px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
            <Link
              href="/"
              className="text-sm font-bold text-[#0000CC] underline underline-offset-2"
            >
              Back to home
            </Link>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">
              Course Catalog
            </h1>
          </div>
        </header>

        <section className="border-b border-[#111111] bg-white px-6 py-6 sm:px-10 lg:px-14">
          <label htmlFor="course-search" className="block">
            <span className="font-mono text-[11px] font-black uppercase tracking-[0.14em]">
              Search courses
            </span>

            <div className="mt-2 flex max-w-4xl border border-[#111111] bg-white shadow-[3px_3px_0_#F4C542]">
              <span
                aria-hidden="true"
                className="flex items-center border-r border-[#111111] px-4 font-mono text-lg"
              >
                ?
              </span>

              <input
                id="course-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search course, code, department, major, or prerequisite..."
                className="min-w-0 flex-1 bg-white px-4 py-4 text-sm outline-none placeholder:text-[#6B6B6B]"
              />

              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="border-l border-[#111111] px-4 text-xs font-black uppercase hover:bg-[#F4C542]"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </label>

          <p
            aria-live="polite"
            className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.08em]"
          >
            {filteredCourses.length} courses
          </p>
        </section>

        <section
          aria-label="Course catalog results"
          className="grid lg:grid-cols-2"
        >
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <article
                key={course.id}
                className="border-b border-[#111111] bg-white lg:[&:nth-child(odd)]:border-r"
              >
                <div className="flex min-h-[118px] border-b border-[#111111]">
                  <div className="flex flex-1 flex-col justify-between bg-[#172A5A] p-5 text-white">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#F4C542]">
                      {course.courseCode}
                    </p>

                    <div>
                      <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em]">
                        {course.title}
                      </h2>

                      <p className="mt-2 text-xs font-bold">
                        {course.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-[92px] flex-col items-center justify-center border-l border-[#111111] bg-[#F4C542] text-center">
                    <span className="text-3xl font-black">
                      {course.credits}
                    </span>
                    <span className="mt-1 font-mono text-[10px] font-black uppercase tracking-[0.12em]">
                      Credits
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <section>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em]">
                      Course
                    </p>

                    <p className="mt-3 text-[14px] leading-6 text-[#303030]">
                      {getThreeSentenceDescription(course)}
                    </p>
                  </section>

                  <section className="mt-6 border-t border-[#111111] pt-5">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em]">
                      Prerequisites
                    </p>

                    <p className="mt-2 text-sm font-bold leading-6">
                      {course.prerequisites
                        .map(shortenPrerequisite)
                        .join(" • ")}
                    </p>
                  </section>

                  <section className="mt-5 border-t border-[#111111] pt-5">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em]">
                      Required for
                    </p>

                    <p className="mt-2 text-sm font-bold leading-6">
                      {course.requiredForMajorIds.length > 0
                        ? course.requiredForMajorIds.join(" • ")
                        : "No majors listed"}
                    </p>
                  </section>

                  <p className="mt-6 font-mono text-[10px] font-black tracking-[0.12em]">
                    {String(index + 1).padStart(3, "0")}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="px-6 py-20 text-center lg:col-span-2">
              <p className="text-2xl font-black tracking-[-0.03em]">
                No courses found.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-6 border border-[#111111] bg-[#F4C542] px-5 py-3 text-sm font-black"
              >
                Show all courses
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}