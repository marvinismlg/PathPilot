"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  scoreAssessment,
  type AssessmentAnswers,
  type AssessmentScoringResult,
} from "../../lib/engine";
import courseOutputsData from "../../data/courseoutputs.json";
import { createClient } from "../../lib/supabase/client";
import { MAJOR_CATEGORIES, 
GENERAL_TALENTS,
SOLO_OR_PEOPLE,
EMPLOYEE_TYPE,
GRAD_OR_NO,
EDUCATION,
DESIRED_FIELDS,
HARD_SKILLS,
SOFT_SKILLS, 
WORK_LOCATION,
WORK_ENVIRONMENT,
WORK_INTENSITY,
SALARY_OPTIONS, 
DESIRED_OUTCOMES
} from "../../lib/answers";


const RECOMMENDATION_LOADING_STEPS = [
  "Reading your career priorities...",
  "Scoring your preferences...",
  "Comparing career criteria...",
  "Ranking career matches...",
  "Building your recommendations...",
  "Fetching categoryoutputs.json...",
  "Gathering jobs from joboutputs.json...",
  "Searching through coursesoutputs.json...",
  "Generating full recommendation..."
] as const;

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 5)) + min;
}

const MAX_WORK_ENVIRONMENTS = 3;
const TOTAL_QUESTIONS = 16;
const MAX_MAJORS = 2;
const MAX_EMPLOYEE_TYPES = 2;
const MAX_HARD_SKILLS = 5;
const MAX_SOFT_SKILLS = 5;
const MAX_WORK_LOCATIONS = 3;

type ResultView =
  | "web"
  | "category"
  | "jobs"
  | "courses"
  | "skills"
  | "internships"
  | "next"
  | "locations";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface InternshipOutput {
  internshipId: string;
  internshipTitle: string;
  reasons?: string[];
  preparationSteps?: string[];
  suggestedSearchTerms?: string[];
  isPlaceholder?: boolean;
}

interface JobOutput {
  id: string;
  title?: string;
  categoryId?: string;
  sourceCategory?: string;
  shortDescription?: string;
  keyStrengths?: string[];
  soft_skillset?: string[];
  hard_skillset?: string[];
  possibleSkillGaps?: string[];
  recommendedCourseIds?: string[];
  usual_employers?: string[];
  internships?: Record<string, InternshipOutput>;
  score: number;
  rank: number;
}

interface CategoryOutput {
  id: string;
  tagline?: string;
  overview?: string;
  career_themes?: string[];
  typical_tasks?: string[];
  core_skills?: {
    hard_skills?: string[];
    soft_skills?: string[];
    general_talents?: string[];
  };
  education?: {
    common_entry_levels?: string[];
    graduate_school_value?: string;
    graduate_school_note?: string;
    licensing_or_certification?: string;
  };
  salary?: {
    band?: string;
    typical_range?: {
      minimum?: number;
      maximum?: number;
    };
    variability_note?: string;
  };
  work_profile?: {
    common_environments?: string[];
    people_balance?: string;
    intensity?: string;
    location_flexibility?: string;
  };
  advantages?: string[];
  tradeoffs?: string[];
  recommended_course_ids?: string[];
  student_next_steps?: string[];
  sources?: string[];
  last_researched?: string;
  score: number;
  rank: number;
}

interface CourseOutput {
  id: string;
  title: string;
  courseCode?: string;
  department?: string;
  courseDescription?: string;
  credits?: number;
  whyRecommended?: string;
  relatedCareers?: string[];
  skillsDeveloped?: string[];
  requiredForMajorIds?: string[];
  prerequisites?: string[];
  isPlaceholder?: boolean;
}

interface InternshipRecommendation extends InternshipOutput {
  sourceJobId: string;
  sourceJobTitle: string;
}

interface NextStepRecommendation {
  id: string;
  text: string;
  source: "Career angle" | "Job pathway" | "Loyola course";
}

interface ResultPageShellProps {
  code: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  children: ReactNode;
  onBack: () => void;
}

const COURSE_OUTPUTS = courseOutputsData as CourseOutput[];

function normalizeLookupValue(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function uniqueStrings(values: Array<string | null | undefined>) {
  const seen = new Set<string>();

  return values.filter((value): value is string => {
    if (!value?.trim()) {
      return false;
    }

    const normalizedValue = normalizeLookupValue(value);

    if (seen.has(normalizedValue)) {
      return false;
    }

    seen.add(normalizedValue);
    return true;
  });
}

function humanizeValue(value?: string) {
  if (!value) {
    return "Not specified";
  }

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sourceHost(source: string) {
  try {
    return new URL(source).hostname.replace(/^www\./, "");
  } catch {
    return source;
  }
}

function formatSalary(value?: number) {
  if (typeof value !== "number") {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function resolveRecommendedCourses(
  category: CategoryOutput | undefined,
  jobs: JobOutput[],
) {
  const courseByKey = new Map<string, CourseOutput>();

  COURSE_OUTPUTS.forEach((course) => {
    [course.id, course.title, course.courseCode].forEach((candidate) => {
      if (candidate) {
        courseByKey.set(normalizeLookupValue(candidate), course);
      }
    });
  });

  const requestedCourseIds = uniqueStrings([
    ...jobs.flatMap((job) => job.recommendedCourseIds ?? []),
    ...(category?.recommended_course_ids ?? []),
  ]);

  const resolved: CourseOutput[] = [];
  const resolvedIds = new Set<string>();

  requestedCourseIds.forEach((requestedId) => {
    const requestedKey = normalizeLookupValue(requestedId);
    let course = courseByKey.get(requestedKey);

    if (!course && requestedKey.length >= 6) {
      course = COURSE_OUTPUTS.find((candidate) => {
        const candidateKeys = [candidate.id, candidate.title]
          .map(normalizeLookupValue)
          .filter(Boolean);

        return candidateKeys.some(
          (candidateKey) =>
            candidateKey === requestedKey ||
            candidateKey.includes(requestedKey) ||
            requestedKey.includes(candidateKey),
        );
      });
    }

    if (course && !resolvedIds.has(course.id)) {
      resolved.push(course);
      resolvedIds.add(course.id);
    }
  });

  if (resolved.length < 5) {
    const jobTitleKeys = jobs
      .map((job) => normalizeLookupValue(job.title ?? ""))
      .filter(Boolean);

    COURSE_OUTPUTS.forEach((course) => {
      const supportsRecommendedJob = (course.relatedCareers ?? []).some(
        (career) => {
          const careerKey = normalizeLookupValue(career);

          return jobTitleKeys.some(
            (jobKey) =>
              careerKey === jobKey ||
              careerKey.includes(jobKey) ||
              jobKey.includes(careerKey),
          );
        },
      );

      if (supportsRecommendedJob && !resolvedIds.has(course.id)) {
        resolved.push(course);
        resolvedIds.add(course.id);
      }
    });
  }

  return resolved.slice(0, 5);
}

function ResultPageShell({
  code,
  eyebrow,
  title,
  subtitle,
  accent,
  children,
  onBack,
}: ResultPageShellProps) {
  return (
    <article className="mx-auto w-full max-w-[1120px]">
      <div className="flex items-start justify-between gap-6 border-b-2 border-[#111111] pb-5">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-10 min-w-10 items-center justify-center border-2 border-[#111111] px-2 font-mono text-xs font-black"
            style={{ backgroundColor: accent }}
          >
            {code}
          </span>

          <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-[#667085]">
            {eyebrow}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          aria-label="Close this recommendation and return to all recommendations"
          className="flex h-10 w-10 items-center justify-center border-2 border-[#111111] bg-white text-2xl font-black leading-none transition hover:bg-[#111111] hover:text-white"
        >
          ×
        </button>
      </div>

      <header className="max-w-4xl py-10 sm:py-14">
        <h1 className="text-3xl font-black leading-[1.08] tracking-[-0.035em] text-[#111111] sm:text-5xl">
          {title}
        </h1>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#555555] sm:text-base">
          {subtitle}
        </p>
      </header>

      {children}

      <div className="mt-12 border-t-2 border-[#111111] pt-7">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center border-2 border-[#111111] bg-white px-6 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition hover:bg-[#F6F4EE] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <span className="mr-3 text-lg">←</span>
          Back to Recommendations
        </button>
      </div>
    </article>
  );
}

function TagList({
  values,
  emptyMessage = "No items returned.",
}: {
  values: string[];
  emptyMessage?: string;
}) {
  if (values.length === 0) {
    return <p className="text-sm text-[#667085]">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="border border-[#111111] bg-[#F6F4EE] px-3 py-1.5 text-xs font-bold text-[#111111]"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function SourceList({
  sources,
  emptyMessage,
}: {
  sources: string[];
  emptyMessage: string;
}) {
  return (
    <section className="mt-12 border-t-2 border-[#111111] pt-7">
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#667085]">
            Research trail
          </p>
          <h2 className="mt-2 text-xl font-black text-[#111111]">Sources</h2>
        </div>

        {sources.length > 0 ? (
          <ol className="grid gap-2">
            {sources.map((source, index) => (
              <li key={source}>
                <a
                  href={source}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 border border-[#BFC5CC] bg-white px-4 py-3 text-sm text-[#333333] transition hover:border-[#111111]"
                >
                  <span className="font-mono text-[10px] font-black text-[#667085]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 break-all">
                    <span className="font-black text-[#111111] group-hover:underline">
                      {sourceHost(source)}
                    </span>
                    <span className="mt-1 block text-xs text-[#667085]">
                      {source}
                    </span>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <div className="border border-dashed border-[#AEB4BB] bg-white px-5 py-4 text-sm leading-6 text-[#555555]">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}

function RecommendationResults({
  results,
  answers,
  onDiscard,
}: {
  results: AssessmentScoringResult;
  answers: AssessmentAnswers;
  onDiscard: () => void;
}) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ResultView>("web");
  const [pendingView, setPendingView] = useState<ResultView | null>(null);
  const [isViewVisible, setIsViewVisible] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const topCategory = results.categories.results[0] as unknown as
    | CategoryOutput
    | undefined;

  const topJobs = useMemo(
    () =>
      (results.jobs.results.slice(0, 4) as unknown as JobOutput[]).map(
        (job, index) => ({
          ...job,
          rank: job.rank ?? index + 1,
          score: job.score ?? 0,
        }),
      ),
    [results.jobs.results],
  );

  const recommendedCourses = useMemo(
    () => resolveRecommendedCourses(topCategory, topJobs),
    [topCategory, topJobs],
  );

  const hardSkills = useMemo(
    () =>
      uniqueStrings([
        ...(topCategory?.core_skills?.hard_skills ?? []),
        ...topJobs.flatMap((job) => job.hard_skillset ?? []),
        ...(Array.isArray(answers.hard_skills) ? answers.hard_skills : []),
      ]).slice(0, 4),
    [answers.hard_skills, topCategory, topJobs],
  );

  const softSkills = useMemo(
    () =>
      uniqueStrings([
        ...(topCategory?.core_skills?.soft_skills ?? []),
        ...topJobs.flatMap((job) => job.soft_skillset ?? []),
        ...(Array.isArray(answers.soft_skills) ? answers.soft_skills : []),
      ]).slice(0, 4),
    [answers.soft_skills, topCategory, topJobs],
  );

  const internships = useMemo(() => {
    const collected: InternshipRecommendation[] = [];
    const seen = new Set<string>();

    topJobs.forEach((job) => {
      Object.values(job.internships ?? {}).forEach((internship) => {
        const key = normalizeLookupValue(
          internship.internshipId || internship.internshipTitle,
        );

        if (!seen.has(key)) {
          seen.add(key);
          collected.push({
            ...internship,
            sourceJobId: job.id,
            sourceJobTitle: job.title ?? job.id,
          });
        }
      });
    });

    return collected.slice(0, 4);
  }, [topJobs]);

  const workLocations = useMemo(() => {
    const selectedLocations = Array.isArray(answers.work_locations)
      ? answers.work_locations
      : typeof answers.work_locations === "string"
        ? [answers.work_locations]
        : [];

    return uniqueStrings([
      ...selectedLocations,
      ...(topCategory?.work_profile?.common_environments ?? []),
    ]).slice(0, 3);
  }, [answers.work_locations, topCategory]);

  const nextSteps = useMemo(() => {
    const categorySteps = topCategory?.student_next_steps ?? [];
    const jobSteps = internships.flatMap(
      (internship) => internship.preparationSteps ?? [],
    );
    const courseSteps = recommendedCourses.map((course) => {
      const proof = course.skillsDeveloped?.[0];

      return `Prioritize ${course.title}${
        course.courseCode ? ` (${course.courseCode})` : ""
      } and save a strong project${
        proof ? ` that demonstrates ${proof}` : " for your portfolio"
      }.`;
    });

    const preferredOrder: NextStepRecommendation[] = [
      categorySteps[0]
        ? {
            id: "category-1",
            text: categorySteps[0],
            source: "Career angle",
          }
        : null,
      jobSteps[0]
        ? { id: "job-1", text: jobSteps[0], source: "Job pathway" }
        : null,
      courseSteps[0]
        ? {
            id: "course-1",
            text: courseSteps[0],
            source: "Loyola course",
          }
        : null,
      categorySteps[1]
        ? {
            id: "category-2",
            text: categorySteps[1],
            source: "Career angle",
          }
        : null,
      jobSteps[1]
        ? { id: "job-2", text: jobSteps[1], source: "Job pathway" }
        : null,
    ].filter((step): step is NextStepRecommendation => step !== null);

    const fillSteps: NextStepRecommendation[] = [
      ...categorySteps.slice(2).map((text, index) => ({
        id: `category-fill-${index}`,
        text,
        source: "Career angle" as const,
      })),
      ...jobSteps.slice(2).map((text, index) => ({
        id: `job-fill-${index}`,
        text,
        source: "Job pathway" as const,
      })),
      ...courseSteps.slice(1).map((text, index) => ({
        id: `course-fill-${index}`,
        text,
        source: "Loyola course" as const,
      })),
    ];

    const seen = new Set<string>();

    return [...preferredOrder, ...fillSteps]
      .filter((step) => {
        const key = normalizeLookupValue(step.text);

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .slice(0, 5);
  }, [internships, recommendedCourses, topCategory]);

  const categorySources = uniqueStrings(topCategory?.sources ?? []);
  const loyolaCourseSources = categorySources.filter((source) =>
    source.toLowerCase().includes("loyola"),
  );

  const recommendationPayload = useMemo(
    () => ({
      schemaVersion: 1,
      careerAngle: topCategory
        ? {
            id: topCategory.id,
            tagline: topCategory.tagline ?? null,
            overview: topCategory.overview ?? null,
            score: topCategory.score,
            sources: categorySources,
          }
        : null,
      jobs: topJobs.map((job) => ({
        id: job.id,
        title: job.title ?? job.id,
        score: job.score,
        rank: job.rank,
        categoryId: job.categoryId ?? null,
        sourceCategory: job.sourceCategory ?? null,
        shortDescription: job.shortDescription ?? null,
        keyStrengths: job.keyStrengths ?? [],
        hardSkills: job.hard_skillset ?? [],
        softSkills: job.soft_skillset ?? [],
        possibleSkillGaps: job.possibleSkillGaps ?? [],
        recommendedCourseIds: job.recommendedCourseIds ?? [],
        usualEmployers: job.usual_employers ?? [],
      })),
      courses: recommendedCourses,
      skills: {
        hard: hardSkills,
        soft: softSkills,
      },
      internships,
      workLocations,
      nextSteps,
      courseSources: loyolaCourseSources,
    }),
    [
      categorySources,
      hardSkills,
      internships,
      loyolaCourseSources,
      nextSteps,
      recommendedCourses,
      softSkills,
      topCategory,
      topJobs,
      workLocations,
    ],
  );

  useEffect(() => {
    if (!pendingView || pendingView === activeView) {
      return;
    }

    const switchTimer = setTimeout(() => {
      setActiveView(pendingView);
      setPendingView(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 170);

    return () => clearTimeout(switchTimer);
  }, [activeView, pendingView]);

  useEffect(() => {
    if (pendingView !== null || isViewVisible) {
      return;
    }

    const showTimer = setTimeout(() => {
      setIsViewVisible(true);
    }, 30);

    return () => clearTimeout(showTimer);
  }, [activeView, isViewVisible, pendingView]);

  function navigateTo(nextView: ResultView) {
    if (nextView === activeView) {
      setIsViewVisible(true);
      return;
    }

    setIsViewVisible(false);
    setPendingView(nextView);
  }

  async function handleSaveRecommendation() {
    if (saveStatus === "saving") {
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("Saving your recommendation...");

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Please sign in again before saving this recommendation.");
      }

      const savedAt = new Date().toISOString();
      const { error: saveError } = await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          recommendation: recommendationPayload,
          saved_at: savedAt,
        },
        { onConflict: "user_id" },
      );

      if (saveError) {
        throw saveError;
      }

      setSaveStatus("saved");
      setSaveMessage("Recommendation saved to your profile.");
      router.push("/snapshot");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "PathPilot could not save this recommendation. Please try again.";

      setSaveStatus("error");
      setSaveMessage(message);
    }
  }

  function confirmDiscard() {
    const shouldDiscard = window.confirm(
      "Are you sure? You will lose this recommendation unless you save it first.",
    );

    if (shouldDiscard) {
      onDiscard();
    }
  }

  const recommendationNodes: Array<{
    view: Exclude<ResultView, "web" | "category">;
    code: string;
    title: string;
    meta: string;
    color: string;
    shape: string;
    desktopPosition: string;
  }> = [
    {
      view: "next",
      code: "06",
      title: "What's Next",
      meta: `${nextSteps.length} focused steps`,
      color: "#F6B26B",
      shape: "44% 56% 48% 52% / 55% 43% 57% 45%",
      desktopPosition: "left-1/2 top-0 h-[145px] w-[230px] -translate-x-1/2",
    },
    {
      view: "jobs",
      code: "02",
      title: "Job Recommendations",
      meta: `${topJobs.length} ranked roles`,
      color: "#F6A6B2",
      shape: "52% 48% 43% 57% / 45% 52% 48% 55%",
      desktopPosition: "right-0 top-[92px] h-[205px] w-[270px]",
    },
    {
      view: "courses",
      code: "03",
      title: "Courses at Loyola to focus on",
      meta: `${recommendedCourses.length} courses`,
      color: "#8EC5FF",
      shape: "43% 57% 52% 48% / 52% 45% 55% 48%",
      desktopPosition: "bottom-[70px] right-0 h-[190px] w-[260px]",
    },
    {
      view: "locations",
      code: "07",
      title: "Work locations for you",
      meta: `${workLocations.length} settings`,
      color: "#C4A7E7",
      shape: "50% 50% 42% 58% / 48% 54% 46% 52%",
      desktopPosition: "bottom-0 left-1/2 h-[150px] w-[245px] -translate-x-1/2",
    },
    {
      view: "skills",
      code: "04",
      title: "Skills to practice or begin developing",
      meta: "4 hard + 4 soft",
      color: "#A8D5A2",
      shape: "55% 45% 51% 49% / 43% 54% 46% 57%",
      desktopPosition: "bottom-[70px] left-0 h-[190px] w-[260px]",
    },
    {
      view: "internships",
      code: "05",
      title: "Internships to search for",
      meta: `${internships.length} search paths`,
      color: "#F4C542",
      shape: "47% 53% 56% 44% / 56% 47% 53% 44%",
      desktopPosition: "left-0 top-[92px] h-[185px] w-[255px]",
    },
  ];

  function renderWeb() {
    return (
      <article className="mx-auto w-full max-w-[1180px]">
        <header className="border-b-2 border-[#111111] pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="border border-[#111111] bg-white px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em]">
              Analysis complete
            </p>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-6xl">
            Your recommendations, connected.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#555555] sm:text-base">
            Start with your Career Angle, then open any connected result to see
            the evidence and actions behind your PathPilot match. Do not close or X out of this page
          </p>
        </header>

        <div className="py-10 lg:hidden">
          <button
            type="button"
            onClick={() => navigateTo("category")}
            className="mx-auto flex min-h-[190px] w-full max-w-[430px] flex-col items-center justify-center border-[3px] border-[#111111] bg-[#F4C542] px-8 py-7 text-center shadow-[5px_5px_0_#111111] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            style={{ borderRadius: "46% 54% 49% 51% / 53% 45% 55% 47%" }}
          >
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.15em]">
              01 / Career Angle
            </span>
            <span className="mt-3 text-2xl font-black leading-tight">
              {topCategory?.id ?? "Career direction"}
            </span>
            <span className="mt-3 text-xs font-bold">
              {Math.round(topCategory?.score ?? 0)}% category match →
            </span>
          </button>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recommendationNodes.map((node) => (
              <button
                key={node.view}
                type="button"
                onClick={() => navigateTo(node.view)}
                className="min-h-[150px] border-2 border-[#111111] px-6 py-5 text-left shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                style={{
                  backgroundColor: node.color,
                  borderRadius: node.shape,
                }}
              >
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.13em]">
                  {node.code} / {node.meta}
                </span>
                <span className="mt-3 block text-lg font-black leading-tight">
                  {node.title}
                </span>
                {node.view === "jobs" && (
                  <span className="mt-3 block text-[11px] font-bold leading-4">
                    {topJobs
                      .slice(0, 3)
                      .map((job) => job.title ?? job.id)
                      .join(" · ")}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[760px] lg:block">
          <svg
            viewBox="0 0 1000 760"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <g stroke="#111111" strokeWidth="7" strokeLinecap="round">
              <line x1="500" y1="380" x2="500" y2="96" />
              <line x1="500" y1="380" x2="865" y2="190" />
              <line x1="500" y1="380" x2="860" y2="575" />
              <line x1="500" y1="380" x2="500" y2="686" />
              <line x1="500" y1="380" x2="140" y2="575" />
              <line x1="500" y1="380" x2="135" y2="190" />
            </g>
          </svg>

          {recommendationNodes.map((node) => (
            <button
              key={node.view}
              type="button"
              onClick={() => navigateTo(node.view)}
              className={`absolute z-10 flex flex-col justify-center border-[3px] border-[#111111] px-7 py-5 text-left shadow-[5px_5px_0_#111111] transition hover:-translate-y-1 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${node.desktopPosition}`}
              style={{
                backgroundColor: node.color,
                borderRadius: node.shape,
              }}
            >
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.13em]">
                {node.code} / {node.meta}
              </span>
              <span className="mt-2 block text-xl font-black leading-tight">
                {node.title}
              </span>
              {node.view === "jobs" && (
                <span className="mt-3 space-y-0.5 text-[10px] font-bold leading-4">
                  {topJobs.slice(0, 3).map((job, index) => (
                    <span key={job.id} className="block truncate">
                      {index + 1}. {job.title ?? job.id}
                    </span>
                  ))}
                </span>
              )}
            </button>
          ))}

          <button
            type="button"
            onClick={() => navigateTo("category")}
            className="absolute left-1/2 top-1/2 z-20 flex h-[225px] w-[300px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border-[4px] border-[#111111] bg-[#F4C542] px-8 py-7 text-center shadow-[7px_7px_0_#111111] transition hover:-translate-y-[52%] active:shadow-none"
            style={{ borderRadius: "46% 54% 49% 51% / 53% 45% 55% 47%" }}
          >
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em]">
              01 / Career Angle
            </span>
            <span className="mt-3 text-2xl font-black leading-tight">
              {topCategory?.id ?? "Career direction"}
            </span>
            <span className="mt-4 border-t border-[#111111] pt-2 text-xs font-black">
              {Math.round(topCategory?.score ?? 0)}% match · Open →
            </span>
          </button>
        </div>

        <section className="mt-4 border-2 border-[#111111] bg-white p-6 shadow-[4px_4px_0_#D5D9DE] sm:p-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.025em]">
                Keep this recommendation?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#555555]">
                Saving your recommendation finalizes Pilot account creation
                Nothing is written to the profiles table until you click Save
                Recommendation.
              </p>

              {saveMessage && (
                <p
                  role="status"
                  className={`mt-4 border-l-4 px-4 py-2 text-sm font-bold ${
                    saveStatus === "error"
                      ? "border-[#D64545] bg-[#FFF0F0] text-[#8B1E1E]"
                      : "border-[#4F8A5B] bg-[#EFF8F0] text-[#235B2E]"
                  }`}
                >
                  {saveMessage}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={confirmDiscard}
                className="inline-flex items-center justify-center border-2 border-[#111111] bg-white px-6 py-3 text-sm font-black transition hover:bg-[#F6F4EE]"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={handleSaveRecommendation}
                disabled={saveStatus === "saving" || saveStatus === "saved"}
                className="inline-flex min-w-[210px] items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-6 py-3 text-sm font-black shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:bg-[#D9DDE2] disabled:text-[#667085] disabled:shadow-none"
              >
                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                    ? "Saved ✓"
                    : "Take a Snapshot"}
              </button>
            </div>
          </div>
        </section>

        <p className="mx-auto mt-6 max-w-4xl text-center font-mono text-[10px] font-bold uppercase leading-5 tracking-[0.08em] text-[#7A828C]">
          Disclaimer: PathPilot is an independent technical and personal project
          and is not affiliated with, endorsed by, or sponsored by Loyola
          University Maryland. Its recommendations are informational only and
          should not be treated as definitive academic or career advice. Verify
          important decisions with qualified academic and career professionals.
        </p>
      </article>
    );
  }

  function renderCategory() {
    const minimumSalary = formatSalary(
      topCategory?.salary?.typical_range?.minimum,
    );
    const maximumSalary = formatSalary(
      topCategory?.salary?.typical_range?.maximum,
    );

    return (
      <ResultPageShell
        code="01"
        eyebrow="Career Angle"
        title={topCategory?.id ?? "Your Career Angle"}
        subtitle={
          topCategory?.tagline ??
          "The category that best connects your interests, strengths, and preferred way of working."
        }
        accent="#F4C542"
        onBack={() => navigateTo("web")}
      >
        <div className="grid gap-5 lg:grid-cols-[1.5fr_0.5fr]">
          <section className="border-2 border-[#111111] bg-white p-6 shadow-[4px_4px_0_#111111] sm:p-8">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.15em] text-[#667085]">
              Why this angle fits
            </p>
            <p className="mt-4 text-base leading-8 text-[#333333]">
              {topCategory?.overview ??
                "PathPilot did not receive an overview for this category."}
            </p>
          </section>

          <aside className="border-2 border-[#111111] bg-[#111111] p-6 text-white">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.15em] text-[#D5D9DE]">
              Category match
            </p>
            <p className="mt-3 text-5xl font-black">
              {Math.round(topCategory?.score ?? 0)}%
            </p>
            <p className="mt-6 border-t border-[#555555] pt-4 text-xs leading-5 text-[#E5E8EC]">
              Ranked #{topCategory?.rank ?? 1} across the category engine.
            </p>
          </aside>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <section className="border border-[#111111] bg-[#F6B26B] p-6">
            <h2 className="text-xl font-black">Career themes</h2>
            <ul className="mt-5 space-y-3">
              {(topCategory?.career_themes ?? []).slice(0, 5).map((theme) => (
                <li key={theme} className="flex gap-3 text-sm leading-6">
                  <span className="font-mono font-black">→</span>
                  <span>{theme}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-[#111111] bg-white p-6">
            <h2 className="text-xl font-black">What the work looks like</h2>
            <ul className="mt-5 space-y-3">
              {(topCategory?.typical_tasks ?? []).slice(0, 5).map((task) => (
                <li key={task} className="flex gap-3 text-sm leading-6">
                  <span className="font-mono font-black">□</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-7 border-2 border-[#111111] bg-white">
          <div className="grid divide-y-2 divide-[#111111] sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
            <div className="p-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                Work intensity
              </p>
              <p className="mt-2 font-black">
                {humanizeValue(topCategory?.work_profile?.intensity)}
              </p>
            </div>
            <div className="p-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                Location flexibility
              </p>
              <p className="mt-2 font-black">
                {humanizeValue(
                  topCategory?.work_profile?.location_flexibility,
                )}
              </p>
            </div>
            <div className="p-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                Typical salary range
              </p>
              <p className="mt-2 font-black">
                {minimumSalary && maximumSalary
                  ? `${minimumSalary} to ${maximumSalary}`
                  : "Varies by role"}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <section className="border border-[#111111] bg-[#A8D5A2] p-6">
            <h2 className="text-xl font-black">Advantages</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6">
              {(topCategory?.advantages ?? []).slice(0, 3).map((advantage) => (
                <li key={advantage}>+ {advantage}</li>
              ))}
            </ul>
          </section>

          <section className="border border-[#111111] bg-[#F6A6B2] p-6">
            <h2 className="text-xl font-black">Tradeoffs to know</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6">
              {(topCategory?.tradeoffs ?? []).slice(0, 3).map((tradeoff) => (
                <li key={tradeoff}>− {tradeoff}</li>
              ))}
            </ul>
          </section>
        </div>

        <SourceList
          sources={categorySources}
          emptyMessage="No source URLs were returned in this category output. Add sources[] to categoryoutputs.json before launch."
        />
      </ResultPageShell>
    );
  }

  function renderJobs() {
    return (
      <ResultPageShell
        code="02"
        eyebrow="Recommended Jobs"
        title="Based on what you've told us, here are the jobs that fit you best."
        subtitle="Open each compact resume card to see the strengths, skills, gaps, courses, and employers behind the match."
        accent="#F6A6B2"
        onBack={() => navigateTo("web")}
      >
        <div className="mx-auto max-w-4xl space-y-5">
          {topJobs.map((job, index) => (
            <details
              key={job.id}
              className="group border-[3px] border-[#111111] bg-white shadow-[5px_5px_0_#D5D9DE]"
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#111111] font-mono text-xs font-black"
                  style={{
                    backgroundColor: ["#F6A6B2", "#8EC5FF", "#A8D5A2", "#F6B26B"][
                      index % 4
                    ],
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-black leading-tight sm:text-2xl">
                    {job.title ?? job.id}
                  </span>
                  <span className="mt-2 block font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[#667085]">
                    {Math.round(job.score)}% match · {job.sourceCategory ?? "Uncategorized source"}
                  </span>
                </span>

                <span className="shrink-0 border border-[#111111] px-3 py-2 font-mono text-[10px] font-black">
                  <span className="group-open:hidden">OPEN +</span>
                  <span className="hidden group-open:inline">CLOSE −</span>
                </span>
              </summary>

              <div className="max-h-[560px] overflow-y-auto border-t-2 border-[#111111] p-5 sm:p-7">
                <div className="grid gap-6 md:grid-cols-[1fr_220px]">
                  <div>
                    <div className="grid gap-3 border-b border-[#BFC5CC] pb-5 text-xs sm:grid-cols-2">
                      <p>
                        <span className="block font-mono text-[9px] font-black uppercase tracking-[0.13em] text-[#667085]">
                          Source category
                        </span>
                        <span className="mt-1 block font-black">
                          {job.sourceCategory ?? "Not supplied"}
                        </span>
                      </p>
                      <p>
                        <span className="block font-mono text-[9px] font-black uppercase tracking-[0.13em] text-[#667085]">
                          Category ID
                        </span>
                        <span className="mt-1 block font-black">
                          {job.categoryId ?? "Not supplied"}
                        </span>
                      </p>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-[#333333]">
                      {job.shortDescription ??
                        "No role description was returned for this job."}
                    </p>

                    <div className="mt-6">
                      <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                        Core strengths
                      </h3>
                      <div className="mt-3">
                        <TagList values={job.keyStrengths ?? []} />
                      </div>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                          Hard skillset
                        </h3>
                        <div className="mt-3">
                          <TagList values={job.hard_skillset ?? []} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                          Soft skillset
                        </h3>
                        <div className="mt-3">
                          <TagList values={job.soft_skillset ?? []} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-6 border-t-2 border-[#111111] pt-5 md:border-l-2 md:border-t-0 md:pl-6 md:pt-0">
                    <div>
                      <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                        Skill gaps to close
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm leading-5">
                        {(job.possibleSkillGaps ?? []).map((gap) => (
                          <li key={gap}>□ {gap}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                        Course IDs
                      </h3>
                      <ul className="mt-3 space-y-2 text-xs leading-5">
                        {(job.recommendedCourseIds ?? []).map((courseId) => (
                          <li key={courseId}>{humanizeValue(courseId)}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                        Usual employers
                      </h3>
                      <ul className="mt-3 space-y-2 text-xs leading-5">
                        {(job.usual_employers ?? []).map((employer) => (
                          <li key={employer}>→ {employer}</li>
                        ))}
                      </ul>
                    </div>
                  </aside>
                </div>
              </div>
            </details>
          ))}
        </div>

        <section className="mx-auto mt-12 max-w-4xl border-t-2 border-[#111111] pt-7">
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#667085]">
                Engine provenance
              </p>
              <h2 className="mt-2 text-xl font-black">Source categories</h2>
            </div>
            <ol className="grid gap-2 sm:grid-cols-2">
              {topJobs.map((job, index) => (
                <li
                  key={job.id}
                  className="border border-[#BFC5CC] bg-white px-4 py-3 text-sm"
                >
                  <span className="font-mono text-[10px] font-black text-[#667085]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ml-3 font-black">
                    {job.sourceCategory ?? "Not supplied"}
                  </span>
                  <span className="mt-1 block pl-7 text-xs text-[#667085]">
                    {job.title ?? job.id}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </ResultPageShell>
    );
  }

  function renderCourses() {
    return (
      <ResultPageShell
        code="03"
        eyebrow="Loyola Courses"
        title="Here are the courses you should focus on. Gather teacher recommendations, build strong coursework projects, and make sure you shoot for As on these transcripts."
        subtitle="Jobs and internships often request your transcripts. These are the courses your career field and recommended jobs value most."
        accent="#8EC5FF"
        onBack={() => navigateTo("web")}
      >
        <div className="space-y-4">
          {recommendedCourses.length > 0 ? (
            recommendedCourses.map((course, index) => (
              <details
                key={course.id}
                className="group border-2 border-[#111111] bg-white shadow-[3px_3px_0_#D5D9DE]"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden sm:p-6">
                  <span className="font-mono text-xs font-black text-[#667085]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-black sm:text-xl">
                      {course.title}
                    </span>
                    <span className="mt-1 block text-xs font-bold text-[#667085]">
                      {course.courseCode ?? "Course code pending"} · {course.department ?? "Department pending"} · {course.credits ?? "?"} credits
                    </span>
                  </span>
                  <span className="border border-[#111111] px-3 py-2 font-mono text-[10px] font-black">
                    <span className="group-open:hidden">VIEW +</span>
                    <span className="hidden group-open:inline">CLOSE −</span>
                  </span>
                </summary>

                <div className="border-t-2 border-[#111111] p-5 sm:p-7">
                  <div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                        Course description
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#333333]">
                        {course.courseDescription ?? "No course description returned."}
                      </p>

                      <h3 className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                        Why PathPilot recommends it
                      </h3>
                      <p className="mt-3 border-l-4 border-[#8EC5FF] bg-[#F1F7FF] px-4 py-3 text-sm leading-7 text-[#333333]">
                        {course.whyRecommended ?? "No recommendation rationale returned."}
                      </p>
                    </div>

                    <aside className="space-y-6 border-t border-[#BFC5CC] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                      <div>
                        <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                          Skills developed
                        </h3>
                        <div className="mt-3">
                          <TagList values={course.skillsDeveloped ?? []} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                          Related careers
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs leading-5">
                          {(course.relatedCareers ?? []).map((career) => (
                            <li key={career}>→ {career}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                          Prerequisites
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs leading-5">
                          {(course.prerequisites ?? ["No prerequisite returned."]).map(
                            (prerequisite) => (
                              <li key={prerequisite}>□ {prerequisite}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    </aside>
                  </div>
                </div>
              </details>
            ))
          ) : (
            <div className="border-2 border-dashed border-[#AEB4BB] bg-white p-7 text-sm leading-7 text-[#555555]">
              No course records matched the recommendedCourseIds returned by
              the top jobs. See the engine notes included with this build.
            </div>
          )}
        </div>

        <SourceList
          sources={loyolaCourseSources}
          emptyMessage="No source URL containing the word 'loyola' was returned by this category. Add a Loyola catalogue URL to this category's sources[] field."
        />
      </ResultPageShell>
    );
  }

  function renderSkills() {
    const skillColumns = [
      { title: "Hard Skills", values: hardSkills, color: "#8EC5FF" },
      { title: "Soft Skills", values: softSkills, color: "#A8D5A2" },
    ];

    return (
      <ResultPageShell
        code="04"
        eyebrow="Skills to Develop"
        title="Here are the skills you should start developing for internships and roles in your career."
        subtitle="Employers in your industry value these skills the most. Start developing them now to build your skillset."
        accent="#A8D5A2"
        onBack={() => navigateTo("web")}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {skillColumns.map((column) => (
            <section
              key={column.title}
              className="border-[3px] border-[#111111] bg-white shadow-[5px_5px_0_#111111]"
            >
              <div
                className="border-b-[3px] border-[#111111] px-6 py-4"
                style={{ backgroundColor: column.color }}
              >
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em]">
                  4 selected skills
                </p>
                <h2 className="mt-1 text-2xl font-black">{column.title}</h2>
              </div>

              <ol className="divide-y divide-[#BFC5CC]">
                {column.values.map((skill, index) => (
                  <li
                    key={skill}
                    className="grid grid-cols-[46px_1fr] items-center gap-4 px-5 py-5"
                  >
                    <span className="flex h-10 w-10 items-center justify-center border-2 border-[#111111] font-mono text-xs font-black">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-lg font-black">{skill}</p>
                      <p className="mt-1 text-xs leading-5 text-[#667085]">
                        Practice it in coursework, clubs, projects, or an internship.
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </ResultPageShell>
    );
  }

  function renderInternships() {
    return (
      <ResultPageShell
        code="05"
        eyebrow="Internship Search Paths"
        title="Based on your target job and industry, here are internships you could pursue while still in college to gain relevant experience."
        subtitle="Use these search titles and preparation steps to turn each pathway into a focused internship search before graduation."
        accent="#F4C542"
        onBack={() => navigateTo("web")}
      >
        <div className="space-y-5">
          {internships.map((internship, index) => (
            <details
              key={`${internship.sourceJobId}-${internship.internshipId}`}
              className="group border-2 border-[#111111] bg-white shadow-[4px_4px_0_#D5D9DE]"
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 p-5 [&::-webkit-details-marker]:hidden sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#111111] bg-[#F4C542] font-mono text-xs font-black">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-black sm:text-xl">
                    {internship.internshipTitle}
                  </span>
                  <span className="mt-2 block text-xs font-bold text-[#667085]">
                    Pulled from {internship.sourceJobTitle}
                  </span>
                </span>
                <span className="border border-[#111111] px-3 py-2 font-mono text-[10px] font-black">
                  <span className="group-open:hidden">OPEN +</span>
                  <span className="hidden group-open:inline">CLOSE −</span>
                </span>
              </summary>

              <div className="border-t-2 border-[#111111] p-5 sm:p-7">
                <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr]">
                  <div>
                    <p className="inline-block border border-[#111111] bg-[#F6F4EE] px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.13em]">
                      {internship.isPlaceholder
                        ? "Search pathway"
                        : "Listed opportunity"}
                    </p>

                    <h3 className="mt-5 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                      Why this helps
                    </h3>
                    <div className="mt-3 space-y-3 text-sm leading-7 text-[#333333]">
                      {(internship.reasons ?? []).map((reason) => (
                        <p key={reason}>{reason}</p>
                      ))}
                    </div>

                    <h3 className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#667085]">
                      Search terms
                    </h3>
                    <div className="mt-3">
                      <TagList values={internship.suggestedSearchTerms ?? []} />
                    </div>
                  </div>

                  <div className="border-t-2 border-[#111111] pt-6 lg:border-l-2 lg:border-t-0 lg:pl-7 lg:pt-0">
                    <h3 className="text-lg font-black">Preparation steps</h3>
                    <ol className="mt-5 space-y-4">
                      {(internship.preparationSteps ?? []).map((step, stepIndex) => (
                        <li
                          key={step}
                          className="grid grid-cols-[34px_1fr] gap-3 text-sm leading-7"
                        >
                          <span className="flex h-8 w-8 items-center justify-center border-2 border-[#111111] font-mono text-[10px] font-black">
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </ResultPageShell>
    );
  }

  function renderNextSteps() {
    return (
      <ResultPageShell
        code="06"
        eyebrow="What's Next"
        title="Here's what's next in your Pilot journey."
        subtitle="These five actions connect your career angle, recommended jobs, and Loyola coursework into a practical plan you can begin now."
        accent="#F6B26B"
        onBack={() => navigateTo("web")}
      >
        <ol className="relative space-y-4 before:absolute before:bottom-8 before:left-[26px] before:top-8 before:w-[3px] before:bg-[#111111] sm:before:left-[34px]">
          {nextSteps.map((step, index) => (
            <li
              key={step.id}
              className="relative grid grid-cols-[54px_1fr] gap-4 border-2 border-[#111111] bg-white p-4 shadow-[3px_3px_0_#D5D9DE] sm:grid-cols-[70px_1fr] sm:gap-6 sm:p-6"
            >
              <span className="z-10 flex h-12 w-12 items-center justify-center border-2 border-[#111111] bg-[#F6B26B] font-mono text-sm font-black sm:h-16 sm:w-16">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="inline-block border border-[#111111] bg-[#F6F4EE] px-2 py-1 font-mono text-[9px] font-black uppercase tracking-[0.12em]">
                  {step.source}
                </span>
                <p className="mt-3 text-sm font-bold leading-7 sm:text-base">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </ResultPageShell>
    );
  }

  function renderLocations() {
    return (
      <ResultPageShell
        code="07"
        eyebrow="Work Locations"
        title="These work locations fit the way you want to build your career."
        subtitle="Treat these as your strongest location or work-setting filters when you search for internships and entry-level roles."
        accent="#C4A7E7"
        onBack={() => navigateTo("web")}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {workLocations.map((location, index) => (
            <section
              key={location}
              className="flex min-h-[230px] flex-col border-[3px] border-[#111111] bg-white p-6 shadow-[5px_5px_0_#111111]"
            >
              <span className="font-mono text-xs font-black text-[#667085]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-8 text-2xl font-black leading-tight">
                {humanizeValue(location)}
              </h2>
              <p className="mt-auto border-t border-[#BFC5CC] pt-4 text-xs leading-5 text-[#667085]">
                Use this phrase as a filter on internship and job boards.
              </p>
            </section>
          ))}
        </div>

        <div className="mt-7 border-2 border-[#111111] bg-[#C4A7E7] p-6">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em]">
            Category work profile
          </p>
          <p className="mt-3 text-sm font-bold leading-6">
            Location flexibility: {humanizeValue(
              topCategory?.work_profile?.location_flexibility,
            )}. People balance: {humanizeValue(
              topCategory?.work_profile?.people_balance,
            )}.
          </p>
        </div>
      </ResultPageShell>
    );
  }

  let viewContent: ReactNode;

  switch (activeView) {
    case "category":
      viewContent = renderCategory();
      break;
    case "jobs":
      viewContent = renderJobs();
      break;
    case "courses":
      viewContent = renderCourses();
      break;
    case "skills":
      viewContent = renderSkills();
      break;
    case "internships":
      viewContent = renderInternships();
      break;
    case "next":
      viewContent = renderNextSteps();
      break;
    case "locations":
      viewContent = renderLocations();
      break;
    default:
      viewContent = renderWeb();
  }

  return (
    <div
      className={`w-full transition-all duration-200 ease-out ${
        isViewVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-1 opacity-0"
      }`}
    >
      {viewContent}
    </div>
  );
}

export default function TestPage() {
  // -------------------------
  // STATE
  // -------------------------
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
const [loadingProgress, setLoadingProgress] = useState(6);
  const [openDesiredFieldCategory, setOpenDesiredFieldCategory] =
    useState<string | null>(null);

  const [showTrajectoryIntro, setShowTrajectoryIntro] = useState(false);
  const [isTrajectoryTransitionActive, setIsTrajectoryTransitionActive] =
  useState(false);

  // Which question is currently being shown.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedSalaryPoint, setSelectedSalaryPoint] =
    useState<string>("");

  // All quiz answers live here until the assessment is finished.
  const [answers, setAnswers] = useState<AssessmentAnswers>({});

  // Category selected while answering the major-interest question.
  const [selectedMajorCategory, setSelectedMajorCategory] = useState(
    MAJOR_CATEGORIES[0]?.id ?? "",
  );

  const [selectedGeneralTalents, setSelectedGeneralTalents] =
    useState<string[]>([]);

  // Final scoring result. Remains null until the last question is submitted.
  const [results, setResults] =
    useState<AssessmentScoringResult | null>(null);

  // Prevent repeated clicks while changing questions / scoring.
  const [isSubmitting, setIsSubmitting] = useState(false);


  // -------------------------
  // EFFECTS
  // -------------------------

useEffect(() => {
  if (!isTrajectoryTransitionActive) {
    setShowTrajectoryIntro(false);
    return;
  }

  // Fade in.
  const fadeInTimer = setTimeout(() => {
    setShowTrajectoryIntro(true);
  }, 100);

  // Stay visible, then begin fading out near the end.
  const fadeOutTimer = setTimeout(() => {
    setShowTrajectoryIntro(false);
  }, 14200);

  // Move to the majors question after 15 seconds total.
  const nextQuestionTimer = setTimeout(() => {
    setCurrentQuestionIndex(3);
    setIsTrajectoryTransitionActive(false);
  }, 15000);

  return () => {
    clearTimeout(fadeInTimer);
    clearTimeout(fadeOutTimer);
    clearTimeout(nextQuestionTimer);
  };
}, [isTrajectoryTransitionActive]);


// Loading screen effect
useEffect(() => {
  if (currentQuestionIndex !== 15 || results) {
    return;
  }

  let cancelled = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  setIsSubmitting(true);
  setLoadingStepIndex(0);
  setLoadingProgress(6);

  function runStep(stepIndex: number) {
    if (cancelled) {
      return;
    }

    const isFinalStep =
      stepIndex === RECOMMENDATION_LOADING_STEPS.length - 1;

    const delay = randomDelay(700, 1350);

    timeoutId = setTimeout(() => {
      if (cancelled) {
        return;
      }

      if (isFinalStep) {
        setLoadingProgress(94);

        const finalDelay = randomDelay(650, 1100);

        timeoutId = setTimeout(() => {
          if (cancelled) {
            return;
          }

          const scoredResults = scoreAssessment(answers);

          setResults(scoredResults);
          setLoadingProgress(100);
          setIsSubmitting(false);
        }, finalDelay);

        return;
      }

      const nextStep = stepIndex + 1;

      setLoadingStepIndex(nextStep);

      const baseProgress = Math.round(
        (nextStep / RECOMMENDATION_LOADING_STEPS.length) * 82,
      );

      const randomizedProgress =
        baseProgress + Math.floor(Math.random() * 7);

      setLoadingProgress(
        Math.min(randomizedProgress, 90),
      );

      runStep(nextStep);
    }, delay);
  }

  runStep(0);

  return () => {
    cancelled = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [currentQuestionIndex, answers, results]);


// -------------------------
// DERIVED VALUES
// -------------------------

  // -------------------------
  // DERIVED VALUES
  // -------------------------

  const isFirstQuestion = currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex === TOTAL_QUESTIONS - 1;

  const activeMajorCategory = MAJOR_CATEGORIES.find(
    (category) => category.id === selectedMajorCategory,
  );

  const selectedMajors = Array.isArray(answers.major_interest)
    ? answers.major_interest
    : typeof answers.major_interest === "string"
      ? [answers.major_interest]
      : [];

  const MAX_GENERAL_TALENTS = 3;

  const selectedSoloOrPeople =
    typeof answers.solo_or_people === "string"
      ? answers.solo_or_people
      : "";

  const selectedEmployeeTypes = Array.isArray(answers.employee_type)
    ? answers.employee_type
    : [];

  const selectedGradOrNo =
    typeof answers.grad_or_no === "string"
      ? answers.grad_or_no
      : "";

  const selectedEducation =
    typeof answers.education_requirement === "string"
      ? answers.education_requirement
      : "";

  const selectedDesiredField =
    typeof answers.desired_field === "string"
      ? answers.desired_field
      : "";

  const selectedHardSkills = Array.isArray(answers.hard_skills)
    ? answers.hard_skills
    : [];

  const selectedSoftSkills = Array.isArray(answers.soft_skills)
    ? answers.soft_skills
    : [];

const selectedWorkLocations = Array.isArray(answers.work_locations)
  ? answers.work_locations
  : typeof answers.work_locations === "string"
    ? [answers.work_locations]
    : [];

  const selectedWorkEnvironments = Array.isArray(answers.work_environment)
    ? answers.work_environment
    : typeof answers.work_environment === "string"
      ? [answers.work_environment]
      : [];

  const selectedWorkIntensity =
    typeof answers.work_intensity === "string"
      ? answers.work_intensity
      : "";

  const selectedSalaryOption = SALARY_OPTIONS.find(
    (option) => option.id === selectedSalaryPoint,
  );
const selectedDesiredOutcome =
  typeof answers.desired_outcomes === "string"
    ? answers.desired_outcomes
    : "";

  // -------------------------
  // GENERAL QUIZ FUNCTIONS
  // -------------------------

  function updateAnswer(
    field: keyof AssessmentAnswers,
    value: string | string[],
  ) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [field]: value,
    }));
  }

  function handleBack() {
    if (isFirstQuestion) {
      return;
    }

    setCurrentQuestionIndex((currentIndex) => currentIndex - 1);
  }

  function handleNext() {
    if (isSubmitting) {
      return;
    }

    if (!isLastQuestion) {
      setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
      return;
    }

    finishAssessment();
  }

  function finishAssessment() {
    setIsSubmitting(true);

    try {
      const scoredResults = scoreAssessment(answers);

      setResults(scoredResults);
    } finally {
      setIsSubmitting(false);
    }
  }


  // -------------------------
  // QUESTION-SPECIFIC FUNCTIONS
  // -------------------------

  function selectSalaryPoint(
    salaryId: string,
    salaryBand: string,
  ) {
    setSelectedSalaryPoint(salaryId);
    updateAnswer("salary_band", salaryBand);
  }

  const toggleGeneralTalent = (value: string) => {
    let nextTalents: string[];

    if (selectedGeneralTalents.includes(value)) {
      nextTalents = selectedGeneralTalents.filter(
        (selectedTalent) => selectedTalent !== value,
      );
    } else {
      if (selectedGeneralTalents.length >= MAX_GENERAL_TALENTS) {
        return;
      }

      nextTalents = [...selectedGeneralTalents, value];
    }

    setSelectedGeneralTalents(nextTalents);
    updateAnswer("general_talents", nextTalents);
  };

  function toggleEmployeeType(value: string) {
    const isSelected = selectedEmployeeTypes.includes(value);

    if (isSelected) {
      updateAnswer(
        "employee_type",
        selectedEmployeeTypes.filter((item) => item !== value),
      );
      return;
    }

    if (selectedEmployeeTypes.length >= MAX_EMPLOYEE_TYPES) {
      return;
    }

    updateAnswer("employee_type", [
      ...selectedEmployeeTypes,
      value,
    ]);
  }

  function toggleHardSkill(value: string) {
    const isSelected = selectedHardSkills.includes(value);

    if (isSelected) {
      updateAnswer(
        "hard_skills",
        selectedHardSkills.filter((skill) => skill !== value),
      );
      return;
    }

    if (selectedHardSkills.length >= MAX_HARD_SKILLS) {
      return;
    }

    updateAnswer("hard_skills", [...selectedHardSkills, value]);
  }

  function toggleMajor(value: string) {
    const isSelected = selectedMajors.includes(value);

    if (isSelected) {
      updateAnswer(
        "major_interest",
        selectedMajors.filter((major) => major !== value),
      );
      return;
    }

    if (selectedMajors.length >= MAX_MAJORS) {
      return;
    }

    updateAnswer("major_interest", [...selectedMajors, value]);
  }

  function toggleSoftSkill(value: string) {
    const isSelected = selectedSoftSkills.includes(value);

    if (isSelected) {
      updateAnswer(
        "soft_skills",
        selectedSoftSkills.filter((skill) => skill !== value),
      );
      return;
    }

    if (selectedSoftSkills.length >= MAX_SOFT_SKILLS) {
      return;
    }

    updateAnswer("soft_skills", [...selectedSoftSkills, value]);
  }

  function toggleWorkLocation(value: string) {
    const isSelected = selectedWorkLocations.includes(value);

    if (isSelected) {
      updateAnswer(
        "work_locations",
        selectedWorkLocations.filter(
          (location) => location !== value,
        ),
      );
      return;
    }

    if (selectedWorkLocations.length >= MAX_WORK_LOCATIONS) {
      return;
    }

    updateAnswer("work_locations", [
      ...selectedWorkLocations,
      value,
    ]);
  }

  function toggleWorkEnvironment(value: string) {
    const isSelected = selectedWorkEnvironments.includes(value);

    if (isSelected) {
      updateAnswer(
        "work_environment",
        selectedWorkEnvironments.filter(
          (environment) => environment !== value,
        ),
      );
      return;
    }

    if (
      selectedWorkEnvironments.length >= MAX_WORK_ENVIRONMENTS
    ) {
      return;
    }

    updateAnswer("work_environment", [
      ...selectedWorkEnvironments,
      value,
    ]);
    
  }

function renderWorkLocationIcon(locationId: string) {
  switch (locationId) {
    case "East Coast":

      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 4c3 1 5 4 5 8s-2 7-5 8" />
          <path d="M15 5l3 2-3 2" />
        </svg>
      );

    case "West Coast":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4c-3 1-5 4-5 8s2 7 5 8" />
          <path d="M9 5L6 7l3 2" />
        </svg>
      );

    case "Midwest":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="7" y="5" width="10" height="14" />
          <path d="M12 5v14" />
        </svg>
      );

    case "South":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v10" />
          <path d="M8 11l4 4 4-4" />
        </svg>
      );

    case "Northeast":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7" />
          <path d="M11 7h6v6" />
        </svg>
      );

    case "Major City / Urban":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="10" width="5" height="10" />
          <rect x="10" y="6" width="5" height="14" />
          <rect x="16" y="12" width="4" height="8" />
        </svg>
      );

    case "Suburban":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 11l8-6 8 6" />
          <path d="M6 10v9h12v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      );

    case "Rural":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 18h16" />
          <path d="M7 18V10l5-4 5 4v8" />
          <path d="M12 6V3" />
        </svg>
      );

    case "Remote":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="5" width="16" height="10" />
          <path d="M10 19h4" />
          <path d="M12 15v4" />
          <path d="M8 10h8" />
        </svg>
      );

    case "Hybrid":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="8" height="6" />
          <path d="M15 8h6" />
          <path d="M4 17h6" />
          <rect x="13" y="13" width="8" height="6" />
        </svg>
      );

    case "International":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16" />
          <path d="M12 4c2.5 2.5 2.5 13.5 0 16" />
          <path d="M12 4c-2.5 2.5-2.5 13.5 0 16" />
        </svg>
      );

    case "Flexible / Anywhere":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </svg>
      );

    default:
      return null;
  }
}
if (isTrajectoryTransitionActive) {
  return (
    <main
      className="min-h-screen bg-[#F1F4F8] pt-[112px] text-[#111111]"
      style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
    >
      <section className="relative flex min-h-[calc(100vh-112px)] w-full items-center justify-center px-6">
        <div
          className={`max-w-4xl text-center transition-all duration-700 ease-in-out ${
            showTrajectoryIntro
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          }`}
        >

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-5xl">
            Now let's look at your academic trajectory.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#444444] sm:text-base">
            The next few questions focus on your education plans and the
            direction you want to take after Loyola.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowTrajectoryIntro(false);
            setCurrentQuestionIndex(3);
            setIsTrajectoryTransitionActive(false);
          }}
          className="absolute bottom-8 right-8 text-sm font-bold text-[#111111] hover:underline"
        >
          Skip →
        </button>
      </section>
    </main>
  );
}
return (
  <main
  className="min-h-screen bg-[#F1F4F8] pt-[112px] text-[#111111]"
  style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
>
    <section className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-[1280px] flex-col px-6 py-10 sm:px-10 lg:px-14">

      {currentQuestionIndex === 3 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
          Question 4
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
          What academic program are you currently studying or leaning towards
          studying at Loyola?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        One answer
      </p>
    </div>

    {/* Category navigation */}
    <div className="mt-14">
      <p className="mb-4 text-sm font-black text-[#333333]">
        Choose up to two majors
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {MAJOR_CATEGORIES.map((category) => {
          const isSelected = selectedMajorCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedMajorCategory(category.id)}
              className={`min-h-[82px] border-2 px-5 py-4 text-center text-base font-black transition ${
                isSelected
                  ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[3px_3px_0_#111111]"
                  : "border-[#C8CDD3] bg-white text-[#333333] hover:border-[#111111]"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>

    {/* Majors */}
    {activeMajorCategory && (
      <div className="mt-12">
        <div className="flex items-center justify-between border-b border-[#CDD2D8] pb-3">
          <h2 className="text-lg font-black text-[#111111]">
            {activeMajorCategory.label}
          </h2>

          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#7A828C]">
            Select your major
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeMajorCategory.majors.map((major) => {
            const isSelected = selectedMajors.includes(major.label);

            const selectionLimitReached =
              selectedMajors.length >= MAX_MAJORS && !isSelected;

            return (
              <button
                key={major.id}
                type="button"
                disabled={selectionLimitReached}
                onClick={() => toggleMajor(major.label)}
                className={`min-h-[58px] border px-4 py-3 text-left text-sm font-semibold transition ${
                  isSelected
                    ? "border-[#111111] bg-[#F4C542] text-[#111111]"
                    : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
                }`}
              >
                <span className="flex items-center justify-between gap-4">
                  <span>{major.label}</span>

                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="text-base font-black"
                    >
                      ✓
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    )}

    {/* Bottom navigation */}
    <div className="mt-auto flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <div>
        {selectedMajors.length > 0 && (
          <p className="text-sm text-[#555555]">
            Selected:{" "}
            <span className="font-black text-[#111111]">
              {selectedMajors.join(", ")}
            </span>
          </p>
        )}
      </div>

<button
  type="button"
  onClick={handleNext}
  disabled={selectedMajors.length === 0}
        className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
      >
        Next
        <span className="ml-3 text-lg">→</span>
      </button>
    </div>
  </>
)}

      {currentQuestionIndex === 0 && (
        <>
          {/* Question header */}
          <div className="flex items-start justify-between gap-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
                Question 1
              </p>

              <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
                What are your general talents? (Things you are naturally
                good at)
              </h1>
            </div>

            <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
              Choose up to {MAX_GENERAL_TALENTS}
            </p>
          </div>

          {/* General talents */}
          <div className="mt-14">
            <div className="flex items-center justify-between border-b border-[#CDD2D8] pb-3">
              <h2 className="text-lg font-black text-[#111111]">
                Select your talents
              </h2>

              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#7A828C]">
                {selectedGeneralTalents.length} of {MAX_GENERAL_TALENTS} selected
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {GENERAL_TALENTS.map((talent) => {
                const isSelected = selectedGeneralTalents.includes(talent.value);

                const selectionLimitReached =
                  selectedGeneralTalents.length >= MAX_GENERAL_TALENTS &&
                  !isSelected;

                return (
                  <button
                    key={talent.id}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={selectionLimitReached}
                    onClick={() => toggleGeneralTalent(talent.value)}
                    className={`min-h-[64px] border px-4 py-3 text-left text-sm font-semibold transition ${
                      isSelected
                        ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[2px_2px_0_#111111]"
                        : selectionLimitReached
                          ? "cursor-not-allowed border-[#D5D9DE] bg-[#E7EAEE] text-[#9299A2]"
                          : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span>{talent.label}</span>

                      <span
                        aria-hidden="true"
                        className={`flex size-5 shrink-0 items-center justify-center border ${
                          isSelected
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-[#AEB4BB] bg-white"
                        }`}
                      >
                        {isSelected && "✓"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedGeneralTalents.length >= MAX_GENERAL_TALENTS && (
              <p className="mt-4 text-sm font-medium text-[#667085]">
                You selected three talents. Remove one to choose another.
              </p>
            )}
          </div>

          {/* Bottom navigation */}
          <div className="mt-auto flex items-center justify-between border-t border-[#CDD2D8] pt-7">
            <p className="text-sm text-[#555555]">
              {selectedGeneralTalents.length > 0
                ? `${selectedGeneralTalents.length} selected`
                : "Select at least one talent"}
            </p>

            <button
              type="button"
              onClick={handleNext}
              disabled={selectedGeneralTalents.length === 0}
              className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
            >
              Next
              <span className="ml-3 text-lg">→</span>
            </button>
          </div>
        </>
      )}

{currentQuestionIndex === 2 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
          Question 3
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
          Do you prefer solo work or working with people?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        One answer
      </p>
    </div>

    {/* Answer cards */}
    <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {SOLO_OR_PEOPLE.map((option) => {
        const isSelected = selectedSoloOrPeople === option.value;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => updateAnswer("solo_or_people", option.value)}
            className={`flex min-h-[320px] flex-col justify-between border-2 bg-white p-6 text-left transition ${
              isSelected
                ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[4px_4px_0_#111111]"
                : "border-[#CDD2D8] text-[#333333] hover:border-[#111111]"
            }`}
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#667085]">
                Work Style
              </p>

              <h2 className="mt-3 text-2xl font-black text-[#111111]">
                {option.label}
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#444444]">
                {option.id === "solo"
                  ? "You enjoy focusing independently, working through tasks on your own, and having personal space to think."
                  : "You enjoy collaboration, discussion, teamwork, and being around others while getting work done."}
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between gap-6">
              {/* Clipart */}
              <div className="flex-1">
                {option.id === "solo" ? (
                  <svg
                    viewBox="0 0 220 160"
                    className="h-[150px] w-full max-w-[260px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* desk */}
                    <line x1="40" y1="110" x2="175" y2="110" stroke="currentColor" strokeWidth="3" />
                    <line x1="55" y1="110" x2="55" y2="140" stroke="currentColor" strokeWidth="3" />
                    <line x1="160" y1="110" x2="160" y2="140" stroke="currentColor" strokeWidth="3" />

                    {/* laptop */}
                    <rect x="110" y="82" width="32" height="22" stroke="currentColor" strokeWidth="3" />
                    <line x1="106" y1="104" x2="146" y2="104" stroke="currentColor" strokeWidth="3" />

                    {/* head */}
                    <circle cx="85" cy="58" r="13" stroke="currentColor" strokeWidth="3" />

                    {/* body */}
                    <line x1="85" y1="71" x2="85" y2="98" stroke="currentColor" strokeWidth="3" />
                    <line x1="85" y1="80" x2="105" y2="90" stroke="currentColor" strokeWidth="3" />
                    <line x1="85" y1="80" x2="72" y2="93" stroke="currentColor" strokeWidth="3" />
                    <line x1="85" y1="98" x2="72" y2="118" stroke="currentColor" strokeWidth="3" />
                    <line x1="85" y1="98" x2="96" y2="118" stroke="currentColor" strokeWidth="3" />

                    {/* chair */}
                    <line x1="67" y1="100" x2="55" y2="100" stroke="currentColor" strokeWidth="3" />
                    <line x1="57" y1="100" x2="57" y2="122" stroke="currentColor" strokeWidth="3" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 220 160"
                    className="h-[150px] w-full max-w-[260px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* center person */}
                    <circle cx="110" cy="65" r="13" stroke="currentColor" strokeWidth="3" />
                    <line x1="110" y1="78" x2="110" y2="105" stroke="currentColor" strokeWidth="3" />
                    <line x1="110" y1="86" x2="90" y2="96" stroke="currentColor" strokeWidth="3" />
                    <line x1="110" y1="86" x2="130" y2="96" stroke="currentColor" strokeWidth="3" />
                    <line x1="110" y1="105" x2="96" y2="126" stroke="currentColor" strokeWidth="3" />
                    <line x1="110" y1="105" x2="124" y2="126" stroke="currentColor" strokeWidth="3" />

                    {/* surrounding heads */}
                    <circle cx="60" cy="48" r="10" stroke="currentColor" strokeWidth="3" />
                    <circle cx="160" cy="48" r="10" stroke="currentColor" strokeWidth="3" />
                    <circle cx="55" cy="102" r="10" stroke="currentColor" strokeWidth="3" />
                    <circle cx="165" cy="102" r="10" stroke="currentColor" strokeWidth="3" />

                    {/* connecting lines */}
                    <line x1="71" y1="54" x2="96" y2="62" stroke="currentColor" strokeWidth="3" />
                    <line x1="149" y1="54" x2="124" y2="62" stroke="currentColor" strokeWidth="3" />
                    <line x1="66" y1="98" x2="90" y2="92" stroke="currentColor" strokeWidth="3" />
                    <line x1="154" y1="98" x2="130" y2="92" stroke="currentColor" strokeWidth="3" />
                  </svg>
                )}
              </div>

              {isSelected && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl font-black"
                >
                  ✓
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>

    {/* Bottom navigation */}
    <div className="mt-auto flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <p className="text-sm text-[#555555]">
        {selectedSoloOrPeople
          ? `Selected: ${selectedSoloOrPeople}`
          : "Select one option"}
      </p>

      <button
        type="button"
        onClick={() => setIsTrajectoryTransitionActive(true)}
        disabled={!selectedSoloOrPeople}
        className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
      >
        Next
        <span className="ml-3 text-lg">→</span>
        
      </button>
      
    </div>
  </>
)}
{currentQuestionIndex === 1 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
          Question 2
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
          What kind of employee type describes you best?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        Choose up to 2
      </p>
    </div>

    {/* Employee types */}
    <div className="mt-14">
      <div className="flex items-center justify-between border-b border-[#CDD2D8] pb-3">
        <h2 className="text-lg font-black text-[#111111]">
          Select two employee types
        </h2>

        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#7A828C]">
          {selectedEmployeeTypes.length} of {MAX_EMPLOYEE_TYPES} selected
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EMPLOYEE_TYPE.map((option) => {
          const isSelected = selectedEmployeeTypes.includes(option.id);

          const selectionLimitReached =
            selectedEmployeeTypes.length >= MAX_EMPLOYEE_TYPES &&
            !isSelected;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              disabled={selectionLimitReached}
              onClick={() => toggleEmployeeType(option.id)}
              className={`min-h-[72px] border px-4 py-3 text-left text-sm font-semibold transition ${
                isSelected
                  ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[2px_2px_0_#111111]"
                  : selectionLimitReached
                    ? "cursor-not-allowed border-[#D5D9DE] bg-[#E7EAEE] text-[#9299A2]"
                    : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
              }`}
            >
              <span className="flex items-center justify-between gap-4">
                <span>{option.id}</span>

                <span
                  aria-hidden="true"
                  className={`flex size-5 shrink-0 items-center justify-center border ${
                    isSelected
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-[#AEB4BB] bg-white"
                  }`}
                >
                  {isSelected && "✓"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selectedEmployeeTypes.length >= MAX_EMPLOYEE_TYPES && (
        <p className="mt-4 text-sm font-medium text-[#667085]">
          You selected two employee types. Remove one to choose another.
        </p>
      )}
    </div>

    {/* Bottom navigation */}
    <div className="mt-auto flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <p className="text-sm text-[#555555]">
        {selectedEmployeeTypes.length > 0
          ? `${selectedEmployeeTypes.length} selected`
          : "Select at least one employee type"}
      </p>

      <button
        type="button"
        onClick={handleNext}
        disabled={selectedEmployeeTypes.length === 0}
        className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
      >
        Next
        <span className="ml-3 text-lg">→</span>
      </button>
    </div>
  </>
)}

{currentQuestionIndex === 4 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
          Question 4
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
          Are you considering higher education after Loyola?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        One answer
      </p>
    </div>

    {/* Grad options */}
    <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {GRAD_OR_NO.map((option) => {
        const isSelected = selectedGradOrNo === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => updateAnswer("grad_or_no", option.id)}
            className={`flex min-h-[320px] flex-col justify-between border-2 bg-white p-6 text-left transition ${
              isSelected
                ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[4px_4px_0_#111111]"
                : "border-[#CDD2D8] text-[#333333] hover:border-[#111111]"
            }`}
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#667085]">
                Education Path
              </p>

              <h2 className="mt-3 text-2xl font-black text-[#111111]">
                {option.label}
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#444444]">
                {option.id === "yes_grad"
                  ? "You are open to graduate school or some form of higher education after your undergraduate degree."
                  : option.id === "no_grad"
                    ? "You would rather move directly into the workforce without more formal schooling."
                    : "You are still exploring your options and have not decided yet."}
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between gap-6">
              <div className="flex-1">
                {option.id === "yes_grad" ? (
                  <svg
                    viewBox="0 0 220 160"
                    className="h-[150px] w-full max-w-[220px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M30 62L110 28L190 62L110 96L30 62Z" stroke="currentColor" strokeWidth="4" />
                    <path d="M58 78V112C82 126 138 126 162 112V78" stroke="currentColor" strokeWidth="4" />
                    <path d="M190 62V102" stroke="currentColor" strokeWidth="4" />
                    <circle cx="190" cy="112" r="6" fill="currentColor" />
                  </svg>
                ) : option.id === "no_grad" ? (
                  <svg
                    viewBox="0 0 220 160"
                    className="h-[150px] w-full max-w-[220px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="48" y="58" width="124" height="68" stroke="currentColor" strokeWidth="4" />
                    <path d="M84 58V44C84 34 92 26 102 26H118C128 26 136 34 136 44V58" stroke="currentColor" strokeWidth="4" />
                    <path d="M48 84H172" stroke="currentColor" strokeWidth="4" />
                    <rect x="102" y="76" width="16" height="16" stroke="currentColor" strokeWidth="4" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 220 160"
                    className="h-[150px] w-full max-w-[220px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="110" cy="38" r="14" stroke="currentColor" strokeWidth="4" />
                    <line x1="110" y1="52" x2="110" y2="94" stroke="currentColor" strokeWidth="4" />
                    <line x1="110" y1="66" x2="78" y2="82" stroke="currentColor" strokeWidth="4" />
                    <line x1="110" y1="66" x2="142" y2="82" stroke="currentColor" strokeWidth="4" />
                    <line x1="110" y1="94" x2="88" y2="126" stroke="currentColor" strokeWidth="4" />
                    <line x1="110" y1="94" x2="132" y2="126" stroke="currentColor" strokeWidth="4" />
                    <path d="M74 82L62 72" stroke="currentColor" strokeWidth="4" />
                    <path d="M146 82L158 72" stroke="currentColor" strokeWidth="4" />
                  </svg>
                )}
              </div>

              {isSelected && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl font-black"
                >
                  ✓
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>

    {/* Bottom navigation */}
    <div className="mt-auto flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <p className="text-sm text-[#555555]">
        {selectedGradOrNo
          ? `Selected: ${GRAD_OR_NO.find((option) => option.id === selectedGradOrNo)?.label ?? ""}`
          : "Select one option"}
      </p>

      <button
        type="button"
        onClick={handleNext}
        disabled={!selectedGradOrNo}
        className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
      >
        Next
        <span className="ml-3 text-lg">→</span>
      </button>
    </div>
  </>
)}
{currentQuestionIndex === 5 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
          Question 5
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
          What level of education are you willing to pursue for your career?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        One answer
      </p>
    </div>

    {/* Education options */}
    <div className="mt-14">
      <div className="flex items-center justify-between border-b border-[#CDD2D8] pb-3">
        <h2 className="text-lg font-black text-[#111111]">
          Select an education level
        </h2>

        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#7A828C]">
          Choose one
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {EDUCATION.map((option) => {
          const isSelected = selectedEducation === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                updateAnswer("education_requirement", option.id)
              }
              className={`min-h-[92px] border-2 px-5 py-4 text-left transition ${
                isSelected
                  ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[3px_3px_0_#111111]"
                  : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
              }`}
            >
              <span className="flex items-center justify-between gap-4">
                <span className="text-base font-black">
                  {option.label}
                </span>

                <span
                  aria-hidden="true"
                  className={`flex size-5 shrink-0 items-center justify-center border ${
                    isSelected
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-[#AEB4BB] bg-white"
                  }`}
                >
                  {isSelected && "✓"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>

    {/* Bottom navigation */}
    <div className="mt-auto flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-black text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <button
        type="button"
        onClick={handleNext}
        disabled={!selectedEducation}
        className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
      >
        Next
        <span className="ml-3 text-lg">→</span>
      </button>
    </div>
  </>
)}
{currentQuestionIndex === 6 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
          Question 6
        </p>

        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
          Which career field are you most interested in going into after college?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        One answer
      </p>
    </div>

    {/* Career field dropdowns */}
    <div className="mt-14">
      <div className="flex items-center justify-between border-b border-[#CDD2D8] pb-3">
        <h2 className="text-lg font-black text-[#111111]">
          Choose a career area
        </h2>

        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#7A828C]">
          Select one field
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {DESIRED_FIELDS.map((category) => {
          const isOpen =
            openDesiredFieldCategory === category.category;

          const selectedInsideCategory = category.fields.some(
            (field) => field.id === selectedDesiredField,
          );

          return (
            <div
              key={category.category}
              className="border border-[#BFC5CC] bg-white"
            >
              {/* Dropdown header */}
              <button
                type="button"
                onClick={() =>
                  setOpenDesiredFieldCategory(
                    isOpen ? null : category.category,
                  )
                }
                className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                  selectedInsideCategory
                    ? "bg-[#F4C542]"
                    : "bg-white hover:bg-[#FFF8D8]"
                }`}
              >
                <div>
                  <p className="text-base font-black text-[#111111]">
                    {category.category}
                  </p>

                  {selectedInsideCategory && (
                    <p className="mt-1 text-xs font-semibold text-[#4B4B4B]">
                      {selectedDesiredField}
                    </p>
                  )}
                </div>

                <span
                  aria-hidden="true"
                  className="ml-5 text-lg font-black text-[#111111]"
                >
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Dropdown contents */}
              {isOpen && (
                <div className="border-t border-[#111111] bg-[#F7F8FA] p-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {category.fields.map((field) => {
                      const isSelected =
                        selectedDesiredField === field.id;

                      return (
                        <button
                          key={field.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() =>
                            updateAnswer("desired_field", field.id)
                          }
                          className={`flex min-h-[58px] items-center justify-between gap-4 border px-4 py-3 text-left text-sm font-semibold transition ${
                            isSelected
                              ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[2px_2px_0_#111111]"
                              : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
                          }`}
                        >
                          <span>{field.label}</span>

                          <span
                            aria-hidden="true"
                            className={`flex size-5 shrink-0 items-center justify-center border ${
                              isSelected
                                ? "border-[#111111] bg-[#111111] text-white"
                                : "border-[#AEB4BB] bg-white"
                            }`}
                          >
                            {isSelected && "✓"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

    {/* Bottom navigation */}
    <div className="mt-auto flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-black text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <button
        type="button"
        onClick={handleNext}
        disabled={!selectedDesiredField}
        className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
      >
        Next
        <span className="ml-3 text-lg">→</span>
      </button>
    </div>
  </>
)}
{currentQuestionIndex === 7 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
          Question 8
        </p>

        <h1 className="mt-3 max-w-5xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
          What hard skills do you currently possess or are willing to develop
          for your desired career field?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        Select all that apply
      </p>
    </div>

    {/* Hard skills */}
    <div className="mt-12">
      <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
        <h2 className="text-lg font-black text-[#111111]">
          Hard Skills Directory
        </h2>

        <p className="text-xs font-black uppercase tracking-[0.08em] text-[#667085]">
          {selectedHardSkills.length} of {MAX_HARD_SKILLS} selected
        </p>
      </div>

      <div className="divide-y divide-[#CDD2D8]">
        {HARD_SKILLS.map((category) => (
          <div
            key={category.category}
            className="grid grid-cols-1 gap-5 py-6 lg:grid-cols-[210px_1fr] lg:gap-8"
          >
            {/* Category label */}
            <div className="lg:border-r lg:border-[#CDD2D8] lg:pr-6">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#667085]">
                Skill Category
              </p>

              <h3 className="mt-2 text-lg font-black leading-tight text-[#111111]">
                {category.category}
              </h3>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {category.skills.map((skill) => {
                const isSelected = selectedHardSkills.includes(skill.id);

const selectionLimitReached =
  selectedHardSkills.length >= MAX_HARD_SKILLS && !isSelected;

return (
<button
  key={skill.id}
  type="button"
  aria-pressed={isSelected}
  disabled={selectionLimitReached}
  onClick={() => toggleHardSkill(skill.id)}
  className={`flex min-h-[54px] items-center justify-between gap-4 border px-4 py-3 text-left text-sm font-semibold transition ${
    isSelected
      ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[2px_2px_0_#111111]"
      : selectionLimitReached
        ? "cursor-not-allowed border-[#D5D9DE] bg-[#E7EAEE] text-[#9299A2]"
        : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
  }`}
>
                    <span>{skill.label}</span>

                    <span
                      aria-hidden="true"
                      className={`flex size-5 shrink-0 items-center justify-center border ${
                        isSelected
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#AEB4BB] bg-white"
                      }`}
                    >
                      {isSelected && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom navigation */}
    <div className="mt-8 flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-black text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <div className="flex items-center gap-5">
        <p className="hidden text-sm text-[#555555] sm:block">
          {selectedHardSkills.length > 0
            ? `${selectedHardSkills.length} skills selected`
            : "Select at least one skill"}
        </p>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedHardSkills.length === 0}
          className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
        >
          Next
          <span className="ml-3 text-lg">→</span>
        </button>
      </div>
    </div>
  </>
)}
{currentQuestionIndex === 8 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
          Question 8
        </p>

        <h1 className="mt-3 max-w-5xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
          What hard skills do you currently possess or are willing to develop
          for your desired career field?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        Select all that apply
      </p>
    </div>

    {/* Hard skills */}
    <div className="mt-12">
      <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
        <h2 className="text-lg font-black text-[#111111]">
          Hard Skills Directory
        </h2>

        <p className="text-xs font-black uppercase tracking-[0.08em] text-[#667085]">
          {selectedHardSkills.length} of {MAX_HARD_SKILLS} selected
        </p>
      </div>

      <div className="divide-y divide-[#CDD2D8]">
        {HARD_SKILLS.map((category) => (
          <div
            key={category.category}
            className="grid grid-cols-1 gap-5 py-6 lg:grid-cols-[210px_1fr] lg:gap-8"
          >
            {/* Category label */}
            <div className="lg:border-r lg:border-[#CDD2D8] lg:pr-6">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#667085]">
                Skill Category
              </p>

              <h3 className="mt-2 text-lg font-black leading-tight text-[#111111]">
                {category.category}
              </h3>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {category.skills.map((skill) => {
                const isSelected = selectedHardSkills.includes(skill.id);

                return (
                  <button
                    key={skill.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleHardSkill(skill.id)}
                    className={`flex min-h-[54px] items-center justify-between gap-4 border px-4 py-3 text-left text-sm font-semibold transition ${
                      isSelected
                        ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[2px_2px_0_#111111]"
                        : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
                    }`}
                  >
                    <span>{skill.label}</span>

                    <span
                      aria-hidden="true"
                      className={`flex size-5 shrink-0 items-center justify-center border ${
                        isSelected
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#AEB4BB] bg-white"
                      }`}
                    >
                      {isSelected && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom navigation */}
    <div className="mt-8 flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-black text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <div className="flex items-center gap-5">
        <p className="hidden text-sm text-[#555555] sm:block">
          {selectedHardSkills.length > 0
            ? `${selectedHardSkills.length} skills selected`
            : "Select at least one skill"}
        </p>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedHardSkills.length === 0}
          className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-black text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
        >
          Next
          <span className="ml-3 text-lg">→</span>
        </button>
      </div>
    </div>
  </>
)}
{currentQuestionIndex === 9 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
          Question 9
        </p>

        <h1 className="mt-3 max-w-5xl text-3xl font-black leading-tight tracking-[-0.03em] text-[#111111] sm:text-4xl">
          What soft skills do you currently possess or are willing to develop
          for your desired career field?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        Choose up to {MAX_SOFT_SKILLS}
      </p>
    </div>

    {/* Soft skills */}
    <div className="mt-12">
      <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
        <h2 className="text-lg font-black text-[#111111]">
          Soft Skills Directory
        </h2>

        <p className="text-xs font-black uppercase tracking-[0.08em] text-[#667085]">
          {selectedSoftSkills.length} of {MAX_SOFT_SKILLS} selected
        </p>
      </div>

      <div className="divide-y divide-[#CDD2D8]">
        {SOFT_SKILLS.map((category) => (
          <div
            key={category.category}
            className="grid grid-cols-1 gap-5 py-6 lg:grid-cols-[210px_1fr] lg:gap-8"
          >
            {/* Category label */}
            <div className="lg:border-r lg:border-[#CDD2D8] lg:pr-6">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#667085]">
                Skill Category
              </p>

              <h3 className="mt-2 text-lg font-black leading-tight text-[#111111]">
                {category.category}
              </h3>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {category.skills.map((skill) => {
                const isSelected = selectedSoftSkills.includes(skill.id);

                const selectionLimitReached =
                  selectedSoftSkills.length >= MAX_SOFT_SKILLS &&
                  !isSelected;

                return (
                  <button
                    key={skill.id}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={selectionLimitReached}
                    onClick={() => toggleSoftSkill(skill.id)}
                    className={`flex min-h-[54px] items-center justify-between gap-4 border px-4 py-3 text-left text-sm font-semibold transition ${
                      isSelected
                        ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[2px_2px_0_#111111]"
                        : selectionLimitReached
                          ? "cursor-not-allowed border-[#D5D9DE] bg-[#E7EAEE] text-[#9299A2]"
                          : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
                    }`}
                  >
                    <span>{skill.label}</span>

                    <span
                      aria-hidden="true"
                      className={`flex size-5 shrink-0 items-center justify-center border ${
                        isSelected
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#AEB4BB] bg-white"
                      }`}
                    >
                      {isSelected && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedSoftSkills.length >= MAX_SOFT_SKILLS && (
        <p className="mt-4 text-sm font-medium text-[#667085]">
          You selected seven soft skills. Remove one to choose another.
        </p>
      )}
    </div>

    {/* Bottom navigation */}
    <div className="mt-8 flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-black text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <div className="flex items-center gap-5">
        <p className="hidden text-sm text-[#555555] sm:block">
          {selectedSoftSkills.length > 0
            ? `${selectedSoftSkills.length} skills selected`
            : "Select at least one skill"}
        </p>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedSoftSkills.length === 0}
          className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-bold text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
        >
          Next
          <span className="ml-3 text-lg">→</span>
        </button>
      </div>
    </div>
  </>
)}
{currentQuestionIndex === 10 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#667085]">
          Question 10
        </p>

        <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight tracking-[-0.035em] text-[#111111] sm:text-5xl">
          Where would you ideally like to work?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        One answer
      </p>
    </div>

    {/* Work location options */}
    <div className="mt-12">
      <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
        <h2 className="text-lg font-bold text-[#111111]">
          Which work location appeals to you most?
        </h2>

        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#667085]">
          Select Three
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {WORK_LOCATION.map((option) => {
          const isSelected = selectedWorkLocations.includes(option.id);

const selectionLimitReached =
  selectedWorkLocations.length >= MAX_WORK_LOCATIONS &&
  !isSelected;

          return (
<button
  key={option.id}
  type="button"
  aria-pressed={isSelected}
  disabled={selectionLimitReached}
  onClick={() => toggleWorkLocation(option.id)}
className={`flex min-h-[64px] items-center justify-between gap-4 border px-4 py-3 text-left text-sm font-semibold transition ${
  isSelected
    ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[2px_2px_0_#111111]"
    : selectionLimitReached
      ? "cursor-not-allowed border-[#D5D9DE] bg-[#E7EAEE] text-[#9299A2]"
      : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
}`}
            >
              <span className="flex items-center gap-3">
                <span className="shrink-0 text-[#111111]">
                  {renderWorkLocationIcon(option.id)}
                </span>

                <span>{option.label}</span>
              </span>

              <span
                aria-hidden="true"
                className={`flex size-5 shrink-0 items-center justify-center border ${
                  isSelected
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#AEB4BB] bg-white"
                }`}
              >
                {isSelected && "✓"}
              </span>
            </button>
          );
        })}
      </div>
    </div>

    {/* Bottom navigation */}
    <div className="mt-8 flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <div className="flex items-center gap-5">
        <p className="hidden text-sm text-[#555555] sm:block">
{selectedWorkLocations.length > 0
  ? `${selectedWorkLocations.length} selected`
  : "Select at least one location preference"}
        </p>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedWorkLocations.length === 0}
          className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-bold text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
        >
          Next
          <span className="ml-3 text-lg">→</span>
        </button>
      </div>
    </div>
  </>
)}
{currentQuestionIndex === 11 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#667085]">
          Question 11
        </p>

        <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight tracking-[-0.035em] text-[#111111] sm:text-5xl">
          What kind of workplace environment do you prefer?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        Choose up to 3
      </p>
    </div>

    {/* Workplace environments */}
    <div className="mt-12">
      <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
            Workplace Preferences
          </p>

          <h2 className="mt-1 text-lg font-black text-[#111111]">
            Select your preferred environments
          </h2>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#667085]">
          {selectedWorkEnvironments.length} of {MAX_WORK_ENVIRONMENTS} selected
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WORK_ENVIRONMENT.map((option, index) => {
          const isSelected =
            selectedWorkEnvironments.includes(option.id);

          const selectionLimitReached =
            selectedWorkEnvironments.length >= MAX_WORK_ENVIRONMENTS &&
            !isSelected;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              disabled={selectionLimitReached}
              onClick={() => toggleWorkEnvironment(option.id)}
              className={`flex min-h-[76px] items-center gap-4 border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[2px_2px_0_#111111]"
                  : selectionLimitReached
                    ? "cursor-not-allowed border-[#D5D9DE] bg-[#E7EAEE] text-[#9299A2]"
                    : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
              }`}
            >
              {/* Retro option number */}
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center border text-[11px] font-black ${
                  isSelected
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#AEB4BB] bg-[#F4F4F2] text-[#666666]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex-1 text-sm font-bold leading-5">
                {option.label}
              </span>

              <span
                aria-hidden="true"
                className={`flex size-5 shrink-0 items-center justify-center border ${
                  isSelected
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#AEB4BB] bg-white"
                }`}
              >
                {isSelected && "✓"}
              </span>
            </button>
          );
        })}
      </div>

      {selectedWorkEnvironments.length >= MAX_WORK_ENVIRONMENTS && (
        <p className="mt-4 text-sm font-medium text-[#667085]">
          You selected three workplace environments. Remove one to choose
          another.
        </p>
      )}
    </div>

    {/* Bottom navigation */}
    <div className="mt-8 flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <div className="flex items-center gap-5">
        <p className="hidden text-sm text-[#555555] sm:block">
          {selectedWorkEnvironments.length > 0
            ? `${selectedWorkEnvironments.length} selected`
            : "Select at least one environment"}
        </p>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedWorkEnvironments.length === 0}
          className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-bold text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
        >
          Next
          <span className="ml-3 text-lg">→</span>
        </button>
      </div>
    </div>
  </>
)}
{currentQuestionIndex === 12 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#667085]">
          Question 12
        </p>

        <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight tracking-[-0.035em] text-[#111111] sm:text-5xl">
          What level of work intensity are you comfortable with?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        One answer
      </p>
    </div>

    {/* Work intensity */}
    <div className="mt-12">
      <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
            Career Workload
          </p>

          <h2 className="mt-1 text-lg font-black text-[#111111]">
            Select your preferred intensity
          </h2>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#667085]">
          Choose one
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WORK_INTENSITY.map((option) => {
          const isSelected = selectedWorkIntensity === option.id;

          let hourBadge = "";

          if (option.id.startsWith("Light / Low Demand")) {
            hourBadge = "<40";
          } else if (option.id.startsWith("Standard / Moderate")) {
            hourBadge = "40";
          } else if (option.id.startsWith("Moderately Demanding")) {
            hourBadge = "40–50";
          } else if (option.id.startsWith("High Intensity")) {
            hourBadge = "50–60";
          } else if (option.id.startsWith("Very High Intensity")) {
            hourBadge = "60+";
          } else if (option.id.startsWith("Seasonal / Periodic")) {
            hourBadge = "S";
          } else if (option.id.startsWith("Variable / Unpredictable")) {
            hourBadge = "S";
          } else if (option.id.startsWith("Extreme / Competitive")) {
            hourBadge = "60+";
          }

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                updateAnswer("work_intensity", option.id)
              }
              className={`flex min-h-[92px] items-center gap-5 border px-5 py-4 text-left transition ${
                isSelected
                  ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[3px_3px_0_#111111]"
                  : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
              }`}
            >
              {/* Retro hour badge */}
              <span
                className={`flex h-11 min-w-[58px] shrink-0 items-center justify-center border-2 px-2 text-sm font-black ${
                  isSelected
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#111111] bg-[#F4C542] text-[#111111]"
                }`}
              >
                {hourBadge}
              </span>

              <span className="flex-1 text-sm font-bold leading-6">
                {option.label}
              </span>

            </button>
          );
        })}
      </div>
    </div>

    {/* Bottom navigation */}
    <div className="mt-8 flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <div className="flex items-center gap-5">
        <p className="hidden text-sm text-[#555555] sm:block">
          {selectedWorkIntensity
            ? "Work intensity selected"
            : "Select one intensity"}
        </p>

        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedWorkIntensity}
          className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-bold text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
        >
          Next
          <span className="ml-3 text-lg">→</span>
        </button>
      </div>
    </div>
  </>
)}
{currentQuestionIndex === 13 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#667085]">
          Question 13
        </p>

        <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight tracking-[-0.035em] text-[#111111] sm:text-5xl">
          What annual salary would you ideally like your career to eventually provide?
        </h1>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        Choose one
      </p>
    </div>

    {/* Salary slider */}
    <div className="mt-14">
      <div className="border-b-2 border-[#111111] pb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
          Long-Term Salary Target
        </p>

        <div className="mt-1 flex items-end justify-between gap-6">
          <h2 className="text-lg font-black text-[#111111]">
            Select your ideal salary
          </h2>

          <p className="text-sm font-bold text-[#111111]">
            {selectedSalaryOption
              ? selectedSalaryOption.label
              : "No salary selected"}
          </p>
        </div>
      </div>

      <div className="mt-10 border border-[#BFC5CC] bg-white px-6 py-10 sm:px-10">
        {/* Slider rail */}
        <div className="relative mx-auto max-w-5xl">
          {/* Background line */}
          <div className="absolute left-[5%] right-[5%] top-[21px] h-[3px] bg-[#111111]" />

          {/* Salary points */}
          <div className="relative z-10 grid grid-cols-5">
            {SALARY_OPTIONS.map((option) => {
              const isSelected =
                selectedSalaryPoint === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    selectSalaryPoint(
                      option.id,
                      option.value,
                    )
                  }
                  className="group flex flex-col items-center"
                >
                  {/* Slider point */}
                  <span
                    className={`flex h-11 w-11 items-center justify-center border-2 border-[#111111] transition ${
                      isSelected
                        ? "scale-110 bg-[#F4C542] shadow-[3px_3px_0_#111111]"
                        : "bg-white group-hover:bg-[#FFF4C2]"
                    }`}
                  >
                    <span
                      className={`h-3 w-3 border border-[#111111] ${
                        isSelected
                          ? "bg-[#111111]"
                          : "bg-white"
                      }`}
                    />
                  </span>

                  {/* Salary */}
                  <span
                    className={`mt-4 text-sm font-black sm:text-base ${
                      isSelected
                        ? "text-[#111111]"
                        : "text-[#555555]"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected salary readout */}
        <div className="mx-auto mt-10 max-w-5xl border-t border-[#CDD2D8] pt-5">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                Your Target
              </p>

              <p className="mt-1 text-xl font-black text-[#111111]">
                {selectedSalaryOption
                  ? selectedSalaryOption.label
                  : "—"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#667085]">
                Annual Salary
              </p>

              <p className="mt-1 text-sm font-bold text-[#555555]">
                Long-term career goal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom navigation */}
    <div className="mt-8 flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <div className="flex items-center gap-5">
        <p className="hidden text-sm text-[#555555] sm:block">
          {selectedSalaryOption
            ? `Target: ${selectedSalaryOption.label}`
            : "Select a salary target"}
        </p>

        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedSalaryPoint}
          className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-bold text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
        >
          Next
          <span className="ml-3 text-lg">→</span>
        </button>
      </div>
    </div>
  </>
)}
{currentQuestionIndex === 14 && (
  <>
    {/* Question header */}
    <div className="flex items-start justify-between gap-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#667085]">
          Question 14
        </p>

        <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight tracking-[-0.035em] text-[#111111] sm:text-5xl">
          What is your primary career goal?
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-[#555555]">
          Choose the one outcome you would prioritize above the others.
        </p>
      </div>

      <p className="hidden pt-1 text-sm font-medium text-[#444444] sm:block">
        Choose one
      </p>
    </div>

    {/* Desired outcomes */}
    <div className="mt-12">
      <div className="flex items-end justify-between border-b-2 border-[#111111] pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">
            Career Priority
          </p>

          <h2 className="mt-1 text-lg font-black text-[#111111]">
            Select your primary outcome
          </h2>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#667085]">
          Primary Goal / 01
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DESIRED_OUTCOMES.map((option, index) => {
          const isSelected = selectedDesiredOutcome === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                updateAnswer("desired_outcomes", option.id)
              }
              className={`group flex min-h-[82px] items-stretch border text-left transition ${
                isSelected
                  ? "border-[#111111] bg-[#F4C542] text-[#111111] shadow-[3px_3px_0_#111111]"
                  : "border-[#CDD2D8] bg-white text-[#333333] hover:border-[#111111]"
              }`}
            >
              {/* Retro reference number */}
              <span
                className={`flex w-12 shrink-0 items-center justify-center border-r font-mono text-[11px] font-bold ${
                  isSelected
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#CDD2D8] bg-[#F3F3F1] text-[#667085]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Option */}
              <span className="flex flex-1 items-center px-4 py-4">
                <span className="text-sm font-bold leading-5">
                  {option.label}
                </span>
              </span>

              {/* Selected marker */}
              {isSelected && (
                <span className="flex w-9 shrink-0 items-center justify-center border-l border-[#111111] bg-[#F4C542] font-black">
                  →
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current priority */}
      {selectedDesiredOutcome && (
        <div className="mt-6 border-l-4 border-[#F4C542] bg-white px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#667085]">
            Your Primary Career Goal
          </p>

          <p className="mt-1 text-sm font-black text-[#111111]">
            {selectedDesiredOutcome}
          </p>
        </div>
      )}
    </div>

    {/* Bottom navigation */}
    <div className="mt-8 flex items-center justify-between border-t border-[#CDD2D8] pt-7">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center justify-center border border-[#111111] bg-white px-6 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#F1F1F1]"
      >
        <span className="mr-3 text-lg">←</span>
        Back
      </button>

      <div className="flex items-center gap-5">
        <p className="hidden text-sm text-[#555555] sm:block">
          {selectedDesiredOutcome
            ? "Primary outcome selected"
            : "Select one outcome"}
        </p>

        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedDesiredOutcome}
          className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#F4C542] px-8 py-3 text-sm font-bold text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:border-[#AEB4BB] disabled:bg-[#D9DDE2] disabled:text-[#8B929A] disabled:shadow-none"
        >
          Begin Scoring
          <span className="ml-3 text-lg">→</span>
        </button>
      </div>
    </div>
  </>
)}
{currentQuestionIndex === 15 && (
  results ? (
    <RecommendationResults
      results={results}
      answers={answers}
      onDiscard={() => {
        setResults(null);
        setLoadingStepIndex(0);
        setLoadingProgress(6);
        setIsSubmitting(false);
        setCurrentQuestionIndex(14);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  ) : (
  <div className="flex min-h-[calc(100vh-190px)] items-center justify-center">
    <div className="w-full max-w-3xl">
      {/* Top status */}
      <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
        <div>
        </div>
      </div>

      {/* Main processing area */}
      <div className="mt-8 border border-[#BFC5CC] bg-white p-7 shadow-[3px_3px_0_#D5D9DE] sm:p-10">
        <div className="flex items-start gap-5">
          {/* Retro processing symbol */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[#111111] bg-[#F4C542] font-mono text-lg font-black text-[#111111]">
            {results ? "✓" : ">>"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#667085]">
              {results ? "Analysis Complete" : "Currently Processing"}
            </p>

            <h1
              key={loadingStepIndex}
              className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#111111] sm:text-3xl"
            >
              {results
                ? "Your recommendations are ready."
                : RECOMMENDATION_LOADING_STEPS[
                    loadingStepIndex
                  ]}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#555555]">
              {results
                ? "PathPilot has finished comparing your responses against career and category scoring criteria."
                : "We're comparing your quiz responses against PathPilot's career matching criteria."}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-10">
          <div className="mb-3 flex items-end justify-between">

            <p className="font-mono text-sm font-black text-[#111111]">
              {loadingProgress}%
            </p>
          </div>

          <div className="h-5 border-2 border-[#111111] bg-[#E5E8EC] p-[2px]">
            <div
              className="h-full bg-[#F4C542] transition-all duration-500 ease-out"
              style={{
                width: `${loadingProgress}%`,
              }}
            />
          </div>

          {/* Retro tick marks */}
          <div className="mt-2 grid grid-cols-5 text-center font-mono text-[9px] font-bold text-[#9299A2]">
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>
        </div>

        {/* Processing log */}
        {!results && (
          <div className="mt-8 border-t border-[#CDD2D8] pt-5">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse bg-[#F4C542]" />

              <p className="font-mono text-xs text-[#667085]">
                PROCESSING CAREER PROFILE...
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-xs text-[#7A828C]">
        Keep this page open while PathPilot builds your matches.
      </p>
    </div>
  </div>
  )
)}
    </section>
  </main>
);
}
