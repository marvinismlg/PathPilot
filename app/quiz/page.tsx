"use client";


import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  buildMiniQuizResult,
  careerFieldClusterIds,
  majorClusterIds,
  quizAggregateFieldLabels,
  quizQuestions,
  type CareerFieldClusterId,
  type MajorClusterId,
  type SkillsClusterId,
  type QuizAggregateField,
  type MiniQuizResult,
  type QuizSelections,
  skillsCluster,
} from "../../lib/quizengine";


const loyolaInsightFields: QuizAggregateField[] = [
  "careerClarity",
  "internshipReadiness",
  "majorInterest",
  "biggestWorry",
  "loyolaMotivation",
];

const majorClusterCircleColors: Record<MajorClusterId, string> = {
  Sciences: "bg-[#f4c542] text-black font-sans font-bold",
  Tech: "bg-[#f4c542] text-black font-sans font-bold",
  Humanities: "bg-[#f4c542] text-black font-sans font-bold",
  Business: "bg-[#f4c542] text-black font-sans font-bold",
  Engineering: "bg-[#f4c542] text-black font-sans font-bold",
};

const majorClusterPopupBorders: Record<MajorClusterId, string> = {
  Sciences: "border-[#f4c542]",
  Tech: "border-[#f4c542]",
  Humanities: "border-[#f4c542]",
  Business: "border-[#f4c542]",
  Engineering: "border-[#f4c542]",
};
function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function QuizPage() {
  const [hasStartedPreview, setHasStartedPreview] = useState(false);

const [previewFirstName, setPreviewFirstName] = useState("");
const [previewLastName, setPreviewLastName] = useState("");
const [previewClass, setPreviewClass] = useState("");
const [previewGender, setPreviewGender] = useState("");
  const [openCareerCluster, setOpenCareerCluster] =
  useState<CareerFieldClusterId>("Technology & Data");
  const [openMajorCluster, setOpenMajorCluster] = useState<MajorClusterId | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<QuizSelections>({});
  const [result, setResult] = useState<MiniQuizResult | null>(null);
  const [softWarning, setSoftWarning] = useState<string | null>(null);
  const [isBuildingRecommendations, setIsBuildingRecommendations] =
  useState(false);

const [loadingProgress, setLoadingProgress] = useState(0);
  const quizSectionRef = useRef<HTMLElement | null>(null);
  const resultsSectionRef = useRef<HTMLElement | null>(null);

  const totalQuestions = quizQuestions.length;
  const configuredQuestionsCount = quizQuestions.filter(
    (question) => question.answerOptions.length > 0,
  ).length;
  const answeredCount = quizQuestions.reduce((count, question) => {
    const selectedAnswerId = selectedAnswers[question.id];
    if (!selectedAnswerId) {
      return count;
    }

    const hasSelectedAnswer = question.answerOptions.some(
      (answerOption) => answerOption.id === selectedAnswerId,
    );

    return hasSelectedAnswer ? count + 1 : count;
  }, 0);
  const isQuizComplete = answeredCount === totalQuestions;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const hasConfiguredAnswerChoices = configuredQuestionsCount > 0;

  useEffect(() => {
    if (!result) {
      return;
    }

    resultsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [result]);

  const canBeginPreview =
  previewFirstName.trim() !== "" &&
  previewLastName.trim() !== "" &&
  previewClass !== "" &&
  previewGender !== "";

  function scrollToQuiz() {
    quizSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleAnswerSelect(questionId: string, answerId: string) {
    setSoftWarning(null);

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: answerId,
    }));
  }

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!isQuizComplete) {
    setSoftWarning(
      `Please answer all ${totalQuestions} questions before viewing your results.`,
    );
    return;
  }

  setSoftWarning(null);

  const nextResult = buildMiniQuizResult(selectedAnswers);

  // Keep the remainder of your existing handleSubmit code here.

  setResult(null);
  setIsBuildingRecommendations(true);
  setLoadingProgress(12);

  const scoringDelay = randomDelay(500, 800);
  const buildingDelay = scoringDelay + randomDelay(650, 900);
  const finishDelay = buildingDelay + randomDelay(700, 1000);

  setTimeout(() => {
    setLoadingProgress(52);
  }, scoringDelay);

  setTimeout(() => {
    setLoadingProgress(84);
  }, buildingDelay);

  setTimeout(() => {
    setLoadingProgress(100);

    setTimeout(() => {
      setResult(nextResult);
      setIsBuildingRecommendations(false);
      setLoadingProgress(0);
    }, 250);
  }, finishDelay);
}

  function handleRetakeQuiz() {
    setSelectedAnswers({});
    setResult(null);
    setSoftWarning(null);
    scrollToQuiz();
  }

  if (!hasStartedPreview) {
  return (
    <main className="min-h-screen bg-[#F4F5F3] pt-[112px] font-[Arial] text-[#171717]">
      <section className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-[900px] items-center px-5 py-12 md:px-8">
        <div className="w-full border border-[#BFC5CC] bg-white shadow-[3px_3px_0_#D9DDE2]">
          
          {/* Header */}
          <div className="border-b border-[#D5D9DE] bg-[#FAFAF8] px-6 py-6 md:px-8">

            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.025em] text-[#171717] md:text-4xl">
              Before you begin your preview quiz, enter some basic info about yourself.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
              This helps us understand who is using the project and makes the
              insights from the preview more useful.
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-7 md:px-8 md:py-8">
            <div className="grid gap-6 sm:grid-cols-2">

              {/* First name */}
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#4B5563]">
                  First Name
                </span>

                <input
                  type="text"
                  value={previewFirstName}
                  onChange={(event) =>
                    setPreviewFirstName(event.target.value)
                  }
                  placeholder="First name"
                  className="mt-2 w-full border border-[#AEB4BB] bg-white px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
                />
              </label>

              {/* Last name */}
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#4B5563]">
                  Last Name
                </span>

                <input
                  type="text"
                  value={previewLastName}
                  onChange={(event) =>
                    setPreviewLastName(event.target.value)
                  }
                  placeholder="Last name"
                  className="mt-2 w-full border border-[#AEB4BB] bg-white px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
                />
              </label>

              {/* Class */}
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#4B5563]">
                  Class
                </span>

                <select
                  value={previewClass}
                  onChange={(event) =>
                    setPreviewClass(event.target.value)
                  }
                  className="mt-2 w-full border border-[#AEB4BB] bg-white px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
                >
                  <option value="">Select class</option>
                  <option value="First Year">First Year</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </label>

              {/* Gender */}
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#4B5563]">
                  Identified Gender
                </span>

                <select
                  value={previewGender}
                  onChange={(event) =>
                    setPreviewGender(event.target.value)
                  }
                  className="mt-2 w-full border border-[#AEB4BB] bg-white px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </label>
            </div>

            {/* Bottom action */}
            <div className="mt-8 flex flex-col gap-4 border-t border-[#D5D9DE] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-[#667085]">
                All four fields are required to begin the preview.
              </p>

              <button
                type="button"
                disabled={!canBeginPreview}
                onClick={() => setHasStartedPreview(true)}
                className="inline-flex items-center justify-center border border-[#111111] bg-[#F4C542] px-7 py-3 text-sm font-bold text-[#171717] shadow-[2px_2px_0_#111111] transition hover:bg-[#F1C33B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#BFC5CC] disabled:bg-[#E4E6E8] disabled:text-[#9299A2] disabled:shadow-none"
              >
                Begin Preview Quiz
                <span className="ml-3">→</span>
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-3 border border-[#BFC5CC] bg-[#FAFAF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <p className="text-sm font-bold text-[#171717]">
      Want your full career recommendations?
    </p>

    <p className="mt-1 text-xs text-[#667085]">
      Create an account and take the complete PathPilot assessment.
    </p>
  </div>

  <Link
    href="/studentsignup"
    className="shrink-0 text-sm font-bold text-[#0000CC] underline underline-offset-2"
  >
    Sign up and take the full test →
  </Link>
</div>
          </div>
        </div>
      </section>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#F4F5F3] font-[Arial] text-[#171717]">
      <section className="border-b border-[#D5D9DE] bg-white pt-[112px]">
  <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center md:px-6 md:py-24">
    <div className="mx-auto max-w-3xl">

      <h1 className="mt-4 font-[Arial] text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-[#171717] md:text-6xl">
        Find Your Career Direction - PathPilot Preview
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#4B5563] md:text-lg">
        Take a 20-minute PathPilot preview quiz before making an account. The full PathPilot
        experience unlocks deeper role matches, planning tools, saved recommendations, and
        more personalized next steps. Do not leave or X out of this page
      </p>

      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={scrollToQuiz}
          className="rounded-[2px] border border-[#111111] bg-[#F4C542] px-6 py-4 font-[Arial] text-base font-bold text-[#171717] shadow-[2px_2px_0_#111111] transition hover:bg-[#F1C33B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          Begin Quiz
        </button>

        <Link
          href="/studentsignup"
          className="rounded-[2px] border border-[#BFC5CC] bg-white px-6 py-4 text-center font-[Arial] text-base font-bold text-[#173F8A] transition hover:border-[#111111] hover:bg-[#F7F7F5]"
        >
          Create Account Instead
        </Link>
      </div>
    </div>
  </div>
</section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6 md:py-14">
        <section ref={quizSectionRef}>
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-7xl space-y-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                </div>

              </div>

              {!hasConfiguredAnswerChoices && (
                <div className="mt-5 rounded-[2px] border border-[#D8C46B] bg-[#FFF9E8] px-4 py-3 text-sm leading-7 text-[#4B5563]">
                  This quiz page is live, but answer choices still need to be added in the quiz
                  engine before students can make selections.
                </div>
              )}

            {quizQuestions.map((question, index) => {
              const selectedAnswerId = selectedAnswers[question.id];

              return (
                <section
                  key={question.id}
                  className="rounded-[3px] border border-[#D5D9DE] bg-white p-6 shadow-[2px_2px_0_#E2E5E9] md:p-7"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-3xl">
                      <p className="font-[Arial] text-[10px] font-bold uppercase tracking-[0.16em] text-[#667085]">
                        Question {index + 1}
                      </p>
                      <h3 className="mt-2 font-[Arial] text-3xl font-bold leading-tight tracking-[-0.025em] text-black">
                        {question.questionText}
                      </h3>
                    </div>

                    <div className="rounded-[2px] border border-[#D8C46B] bg-[#F4C542] px-3 py-1 font-[Arial] text-[10px] font-bold uppercase tracking-[0.08em] text-[#5B4B00]">
                      One answer
                    </div>
                  </div>

{question.answerOptions.length > 0 ? (
  question.id === "major_interest" ? (
    <div className="mt-16">
      <div className="flex flex-wrap justify-center gap-6">
        {majorClusterIds.map((cluster) => {
          const clusterMajors = question.answerOptions.filter(
            (answerOption) => answerOption.majorCluster === cluster
          );

          if (clusterMajors.length === 0) {
            return null;
          }

          return (
            <button
              key={cluster}
              type="button"
              onClick={() =>
                setOpenMajorCluster(
                  openMajorCluster === cluster ? null : cluster
                )
              }
              className={`flex h-32 w-32 items-center justify-center rounded-full border-2 border-[#333333] text-lg font-bold shadow-[2px_2px_0_#BFC5CC] transition hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                majorClusterCircleColors[cluster]
              }`}
            >
              {cluster}
            </button>
          );
        })}
      </div>

      {openMajorCluster && (
        <div
          className={`mx-auto mt-8 max-w-3xl rounded-[3px] border bg-white p-6 shadow-[2px_2px_0_#D9DDE2] ${
            majorClusterPopupBorders[openMajorCluster]
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <h4 className="font-[Arial] text-xl font-bold tracking-[-0.015em] text-[#171717]">
              {openMajorCluster} Majors
            </h4>

            <button
              type="button"
              onClick={() => setOpenMajorCluster(null)}
              className="rounded-[2px] border border-[#BFC5CC] bg-white px-3 py-1 text-sm font-[Arial] font-bold text-[#173F8A] hover:border-[#111111]"
            >
              Close
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {question.answerOptions
              .filter(
                (answerOption) =>
                  answerOption.majorCluster === openMajorCluster
              )
              .map((answerOption) => {
                const isSelected =
                  selectedAnswerId === answerOption.id;

                return (
                  <button
                    key={answerOption.id}
                    type="button"
                    onClick={() => {
                      handleAnswerSelect(
                        question.id,
                        answerOption.id
                      );
                      setOpenMajorCluster(null);
                    }}
                    aria-pressed={isSelected}
                    className={`flex min-h-[54px] w-full items-center justify-between gap-4 border px-4 py-3 text-left font-[Arial] text-sm font-semibold transition ${
                      isSelected
                        ? "border-[#111111] bg-[#F4C542] text-[#171717] shadow-[1px_1px_0_#111111]"
                        : "border-[#D1D5DB] bg-white text-[#171717] hover:border-[#8E949C] hover:bg-[#FAFAF8]"
                    }`}
                  >
                    <span className="leading-6">
                      {answerOption.label}
                    </span>

                    <span
                      className={`h-4 w-4 shrink-0 rounded-full border ${
                        isSelected
                          ? "border-white bg-white"
                          : "border-[#9CA3AF]"
                      }`}
                    />
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  ) : question.id === "curious_career_field" ? (
    <div className="mt-10 grid items-start gap-3 md:grid-cols-2 xl:grid-cols-4">
      {careerFieldClusterIds.map((cluster) => {
        const clusterAnswers = question.answerOptions.filter(
          (answerOption) =>
            answerOption.careerCluster === cluster
        );

        if (clusterAnswers.length === 0) {
          return null;
        }

        const selectedClusterAnswer = clusterAnswers.find(
          (answerOption) =>
            answerOption.id === selectedAnswerId
        );

        return (
          <details
            key={cluster}
            className="group overflow-hidden rounded-[3px] border border-[#C9CDD2] bg-white shadow-[1px_1px_0_#E3E6E9]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-[Arial] text-sm font-bold text-[#171717]">
                  {cluster}
                </p>

                {selectedClusterAnswer && (
                  <p className="mt-1 truncate text-xs font-medium text-[#667085]">
                    {selectedClusterAnswer.label}
                  </p>
                )}
              </div>

              <span className="text-xs font-bold text-[#667085] transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>

            <div className="border-t border-[#E1E4E8] bg-[#FAFAF8] p-3">
              <div className="space-y-2">
                {clusterAnswers.map((answerOption) => {
                  const isSelected =
                    selectedAnswerId === answerOption.id;

                  return (
                    <button
                      key={answerOption.id}
                      type="button"
                      onClick={() =>
                        handleAnswerSelect(
                          question.id,
                          answerOption.id
                        )
                      }
                      aria-pressed={isSelected}
                      className={`flex w-full items-center justify-between gap-3 border px-3 py-2 text-left font-[Arial] text-sm font-semibold transition ${
                        isSelected
                          ? "border-[#111111] bg-[#F4C542] text-[#171717] shadow-[1px_1px_0_#111111]"
                          : "border-[#D1D5DB] bg-white text-[#171717] hover:border-[#8E949C] hover:bg-[#FAFAF8]"
                      }`}
                    >
                      <span className="leading-5">
                        {answerOption.label}
                      </span>

                      <span
                        className={`h-3.5 w-3.5 shrink-0 rounded-full border ${
                          isSelected
                            ? "border-[#111111] bg-[#111111]"
                            : "border-[#AFAFAF] bg-white"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </details>
        );
      })}
    </div>
) : question.id === "skill_gaps" ? (
  <div className="mt-10 grid gap-3 sm:grid-cols-2">
{skillsCluster.map((cluster) => {
  const clusterAnswers = question.answerOptions.filter(
    (answerOption) =>
      answerOption.skillsCluster === cluster
  );

  if (clusterAnswers.length === 0) {
    return null;
  }

return (
  <details
    key={cluster}
    className="group overflow-hidden rounded-[3px] border border-[#D1D5DB] bg-white shadow-[1px_1px_0_#E3E6E9] transition hover:border-[#9DA3AA]"
  >
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-transparent px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-[#B6A34A] bg-[#FFF1A8] text-lg font-[Arial] font-bold text-[#171717]">
          {cluster.charAt(0)}
        </div>

        <span className="font-[Arial] text-sm font-bold text-[#171717]">
          {cluster}
        </span>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-[#BFC5CC] bg-white text-sm font-[Arial] font-bold text-[#4B5563] transition-transform duration-200 group-open:rotate-45">
        +
      </div>
    </summary>

    <div className="border-t border-[#E1E4E8] bg-[#FAFAF8] p-4">
      <div className="space-y-3">
        {clusterAnswers.map((answerOption) => {
          const isSelected =
            answerOption.id === selectedAnswerId;

          return (
            <button
              key={answerOption.id}
              type="button"
              onClick={() =>
                handleAnswerSelect(
                  question.id,
                  answerOption.id
                )
              }
              aria-pressed={isSelected}
              className={`flex min-h-[54px] w-full items-center justify-between gap-4 border px-4 py-3 text-left font-[Arial] text-sm font-semibold transition ${
                isSelected
                  ? "border-[#111111] bg-[#F4C542] text-[#171717] shadow-[1px_1px_0_#111111]"
                  : "border-[#D1D5DB] bg-white text-[#171717] hover:border-[#8E949C] hover:bg-[#FAFAF8]"
              }`}
            >
              <span className="leading-6">
                {answerOption.label}
              </span>

              <span
                className={`h-4 w-4 shrink-0 rounded-full border ${
                  isSelected
                    ? "border-white bg-white"
                    : "border-[#9CA3AF]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  </details>
);
})}
  </div>
) : (
  <div className="mt-10 grid gap-3 sm:grid-cols-2">
    {question.answerOptions.map((answerOption) => {
      const isSelected =
        selectedAnswerId === answerOption.id;

      return (
        <button
          key={answerOption.id}
          type="button"
          onClick={() =>
            handleAnswerSelect(
              question.id,
              answerOption.id
            )
          }
          aria-pressed={isSelected}
          className={`flex min-h-[54px] w-full items-center justify-between gap-4 border px-4 py-3 text-left font-[Arial] text-sm font-semibold transition ${
            isSelected
              ? "border-[#111111] bg-[#F4C542] text-[#171717] shadow-[1px_1px_0_#111111]"
              : "border-[#D1D5DB] bg-white text-[#171717] hover:border-[#8E949C] hover:bg-[#FAFAF8]"
          }`}
        >
          <span className="leading-6">
            {answerOption.label}
          </span>

          <span
            className={`h-4 w-4 shrink-0 rounded-full border ${
              isSelected
                ? "border-white bg-white"
                : "border-[#9CA3AF]"
            }`}
          />
        </button>
      );
    })}
  </div>
)
) : (
  <div className="mt-6 border border-dashed border-[#D1D5DB] bg-[#F4F5F3] p-5">
    <p className="font-[Arial] text-sm font-bold text-[#374151]">
      Answer choices coming soon
    </p>

    <p className="mt-2 text-sm leading-7 text-[#667085]">
      Add options in the quiz engine.
    </p>
  </div>
)}
            </section>
          );
        })}

        <section className="rounded-[3px] border border-[#C9CDD2] bg-white p-6 shadow-[2px_2px_0_#D9DDE2] md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-[Arial] text-xl font-bold tracking-[-0.015em] text-[#171717]">
                Ready to preview your results?
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#4B5563]">
                When you submit, PathPilot uses the current mini quiz engine to generate a safe
                preview of top categories, matching jobs, and insight placeholders.
              </p>
            </div>

            <button
              type="submit"
              disabled={!isQuizComplete || isBuildingRecommendations}
              className="inline-flex items-center justify-center rounded-[2px] border border-[#111111] bg-[#F4C542] px-6 py-4 font-[Arial] text-sm font-bold text-[#171717] shadow-[2px_2px_0_#111111] transition hover:bg-[#F1C33B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#667085] disabled:shadow-none disabled:hover:bg-[#D9DDE2] disabled:active:translate-x-0 disabled:active:translate-y-0"
            >
              See My Results
            </button>
          </div>

          {softWarning && (
            <div
              aria-live="polite"
              className="mt-5 rounded-[2px] border border-[#D8C46B] bg-[#FFF8DD] px-4 py-3 text-sm font-medium leading-7 text-[#665500]"
            >
              {softWarning}
            </div>
          )}
        </section>
</form>
</section>

{isBuildingRecommendations && (
  <section className="mx-auto w-full max-w-3xl py-10">
    <div className="border border-[#BFC5CC] bg-white p-6 shadow-[2px_2px_0_#D9DDE2]">
      <div className="flex items-center justify-between gap-4">
        <div>

          <h2 className="mt-2 font-[Arial] text-xl font-bold text-[#171717]">
            {loadingProgress < 45
              ? "Reviewing your answers..."
              : loadingProgress < 80
                ? "Scoring career matches..."
                : "Building recommendations..."}
          </h2>
        </div>

        <span className="font-mono text-sm font-bold text-[#667085]">
          {loadingProgress}%
        </span>
      </div>

      <div className="mt-6 h-4 border border-[#111111] bg-[#ECEEEB] p-[2px]">
        <div
          className="h-full bg-[#F4C542] transition-all duration-500"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-[#8A9098]">
        Processing student career profile...
      </p>
    </div>
  </section>
)}

{result && (
  <section
    ref={resultsSectionRef}
    className="space-y-8"
  >
    <div className="flex flex-col gap-3">
      <p className="font-[Arial] text-xs font-bold uppercase tracking-[0.16em] text-[#667085]">
        Your Career Profile
      </p>

      <h2 className="font-[Arial] text-3xl font-bold leading-tight tracking-[-0.025em] text-[#171717] md:text-4xl">
        Your Top Career Recommendations
      </h2>

      <p className="max-w-2xl text-sm leading-7 text-[#4B5563]">
        Explore each recommendation to see how your answers connect to possible career paths.
      </p>
    </div>

    {result.topCategories.map((category, index) => (
      <article
        key={category.categoryId}
        className="overflow-hidden rounded-[3px] border border-[#BFC5CC] bg-white shadow-[3px_3px_0_#D9DDE2]"
      >
        <div className="border-b border-[#D9DDE2] bg-[#FAFAF8] px-6 py-6 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-[Arial] text-[10px] font-bold uppercase tracking-[0.16em] text-[#667085]">
                Career Category {index + 1}
              </p>

              <h3 className="mt-2 font-[Arial] text-3xl font-bold tracking-[-0.025em] text-[#171717]">
                {category.displayName}
              </h3>

              <div className="mt-3 h-1 w-20 bg-[#F4C542]" />
            </div>

            <div className="rounded-[2px] border border-[#D8C46B] bg-white px-4 py-2 text-sm font-bold text-[#5B4B00]">
              Match {index + 1} of {result.topCategories.length}
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[280px_minmax(260px,1fr)_340px]">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            <div className="rounded-[2px] border border-[#D5D9DE] bg-white p-5">
              <p className="font-[Arial] text-[10px] font-bold uppercase tracking-[0.14em] text-[#667085]">
                Match Score
              </p>

              <div className="mt-3 flex items-end gap-2">
                <span className="font-[Arial] text-5xl font-bold tracking-[-0.03em] text-[#171717]">
                  {category.score > 0
                    ? category.score.toFixed(2)
                    : "—"}
                </span>

                {category.score > 0 && (
                  <span className="mb-1 text-sm font-semibold text-[#667085]">
                    pts
                  </span>
                )}
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-[1px] bg-[#E6E8EB]">
                <div
                  className="h-full bg-[#F4C542]"
                  style={{
                    width: `${Math.min(
                      Math.max(category.score * 10, 8),
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-[#111111]">
                Strong career direction
              </p>

              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Based on your quiz responses and current interests.
              </p>
            </div>

            <div className="rounded-[2px] border border-[#D5D9DE] bg-[#F7F7F5] p-5">
              <p className="font-[Arial] text-[10px] font-bold uppercase tracking-[0.14em] text-[#667085]">
                Why This Fits
              </p>

              <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                {category.shortDescription}
              </p>
            </div>
          </div>

          {/* CENTER AVATAR */}
          <div className="flex min-h-[390px] flex-col items-center justify-center rounded-[3px] border border-[#D5D9DE] bg-[#FAFAF8] px-6 py-8 shadow-[1px_1px_0_#E3E6E9]">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F4C542]" />
              <span className="h-2 w-2 rounded-full bg-[#F4C542]" />
              <span className="h-2 w-2 rounded-full bg-[#F4C542]" />
            </div>

            <svg
              viewBox="0 0 240 300"
              className="h-[270px] w-[220px]"
              aria-label="Career profile figure using a laptop"
              role="img"
            >
              <circle
                cx="120"
                cy="52"
                r="30"
                fill="white"
                stroke="#111111"
                strokeWidth="5"
              />

              <path
                d="M82 102 C82 82 158 82 158 102 L158 190 C158 204 147 214 134 214 H106 C93 214 82 204 82 190 Z"
                fill="white"
                stroke="#111111"
                strokeWidth="5"
              />

              <path
                d="M101 214 L98 280"
                stroke="#111111"
                strokeWidth="6"
                strokeLinecap="round"
              />

              <path
                d="M139 214 L142 280"
                stroke="#111111"
                strokeWidth="6"
                strokeLinecap="round"
              />

              <path
                d="M84 122 L55 172"
                stroke="#111111"
                strokeWidth="6"
                strokeLinecap="round"
              />

              <path
                d="M156 121 L176 156"
                stroke="#111111"
                strokeWidth="6"
                strokeLinecap="round"
              />

              <rect
                x="124"
                y="143"
                width="82"
                height="55"
                rx="0"
                fill="white"
                stroke="#111111"
                strokeWidth="5"
                transform="rotate(-5 124 143)"
              />

              <circle
                cx="165"
                cy="169"
                r="5"
                fill="#F4C542"
              />

              <ellipse
                cx="120"
                cy="289"
                rx="73"
                ry="9"
                fill="#F1F1F1"
              />
            </svg>

            <div className="mt-2 rounded-[2px] border border-[#D8C46B] bg-[#FFF7D6] px-4 py-2">
              <p className="text-center font-[Arial] text-sm font-semibold text-[#171717]">
                {category.displayName}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-3">
            <details className="group overflow-hidden rounded-[3px] border border-[#D5D9DE] bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-[#D8C46B] bg-[#FFF1A8] font-[Arial] font-bold text-[#171717]">
                    &lt;/&gt;
                  </div>

                  <div>
                    <p className="font-[Arial] text-sm font-bold text-[#171717]">
                      Skills Required
                    </p>

                    <p className="mt-1 text-xs text-[#667085]">
                      Core skills required for your career field
                    </p>
                  </div>
                </div>

                <span className="text-lg text-[#667085] transition-transform group-open:rotate-90">
                  ›
                </span>
              </summary>

<div className="border-t border-[#E1E4E8] bg-[#FAFAF8] px-4 py-3">
  <div className="space-y-2">
    {category.skills.map((skill) => (
      <div
        key={skill}
        className="border border-[#C7CCD2] bg-[#F4F5F3] px-3 py-2 text-sm font-bold text-[#333333]"
      >
        {skill}
      </div>
    ))}
  </div>
</div>
            </details>

            <details className="group overflow-hidden rounded-[3px] border border-[#D5D9DE] bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-[#D8C46B] bg-[#FFF1A8] font-[Arial] text-lg font-bold text-[#171717]">
                    ◫
                  </div>

                  <div>
                    <p className="font-[Arial] text-sm font-bold text-[#171717]">
                      Recommended Courses
                    </p>

                    <p className="mt-1 text-xs text-[#667085]">
                      Courses at Loyola to explore
                    </p>
                  </div>
                </div>

                <span className="text-lg text-[#667085] transition-transform group-open:rotate-90">
                  ›
                </span>
              </summary>

<div className="border-t border-[#E1E4E8] bg-[#FAFAF8] px-4 py-3">
  <div className="space-y-2">
    {category.courses.map((course) => (
      <div
        key={course}
        className="border border-[#C7CCD2] bg-[#F4F5F3] px-3 py-2 text-sm font-bold text-[#333333]"
      >
        {course}
      </div>
    ))}
  </div>
</div>
            </details>

            <details className="group overflow-hidden rounded-[3px] border border-[#D5D9DE] bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-[#D8C46B] bg-[#FFF1A8] font-[Arial] text-lg font-bold text-[#171717]">
                    ◇
                  </div>

                  <div>
                    <p className="font-[Arial] text-sm font-bold text-[#171717]">
                      Possible Jobs
                    </p>

                    <p className="mt-1 text-xs text-[#667085]">
                      Common roles within this path
                    </p>
                  </div>
                </div>

                <span className="text-lg text-[#667085] transition-transform group-open:rotate-90">
                  ›
                </span>
              </summary>

              <div className="max-h-52 overflow-y-auto border-t border-[#E1E4E8] bg-[#FAFAF8] px-4 py-3">
                {category.jobs.length > 0 ? (
                  <ul className="space-y-2">
                    {category.jobs.map((job) => (
                      <li
                        key={`${category.categoryId}-${job.title}`}
                        className="border border-[#C7CCD2] bg-[#F4F5F3] px-3 py-2 text-sm font-bold text-[#333333]"
                      >
                        {job.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#667085]">
                    Jobs will be added soon.
                  </p>
                )}
              </div>
            </details>

            <div className="rounded-[3px] border border-[#D5D9DE] bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-[#D8C46B] bg-[#FFF1A8] font-[Arial] text-lg font-bold text-[#171717]">
                  ◎
                </div>

                <div className="min-w-0">
                  <p className="font-[Arial] text-sm font-bold text-[#171717]">
                    Internship Types
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#667085]">
                    Discover internships connected to this career direction.
                  </p>

                  <Link
                    href="/studentsignup"
                    className="mt-3 inline-flex rounded-[2px] border border-[#111111] bg-[#F4C542] px-3 py-2 text-xs font-bold text-[#171717] shadow-[1px_1px_0_#111111] transition hover:bg-[#F1C33B]"
                  >
                    Create an account to see possible internships
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-[#111111] bg-[#F4F5F3] px-6 py-5 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-[Arial] text-base font-bold text-[#171717]">
                Keep exploring.
              </p>

              <p className="mt-1 text-sm text-[#667085]">
                Your profile can become more detailed as you build your full PathPilot plan.
              </p>
            </div>

            <Link
              href="/studentsignup"
              className="inline-flex items-center justify-center rounded-[2px] border border-[#111111] bg-[#F4C542] px-5 py-3 font-[Arial] text-sm font-bold text-[#171717] shadow-[2px_2px_0_#111111] transition hover:bg-[#F1C33B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              View Full Report
            </Link>
          </div>
        </div>
      </article>
    ))}

    <div className="flex justify-center pt-2">
      <button
        type="button"
        onClick={handleRetakeQuiz}
        className="rounded-[2px] border border-[#BFC5CC] bg-white px-5 py-3 font-[Arial] text-sm font-bold text-[#173F8A] transition hover:border-[#111111] hover:bg-[#F7F7F5]"
      >
        Retake Quiz
      </button>
    </div>
  </section>
)}
      </div>
    </main>
  );
}