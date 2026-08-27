"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CareerAngle = {
  name: string;
  summary: string;
  skills: readonly [string, string, string];
  fit: string;
};

const careerAngles: readonly CareerAngle[] = [
  {
    name: "Marketing & Advertising",
    summary:
      "Plans campaigns, studies audiences, shapes brand messages, and helps products reach the right people.",
    skills: ["Audience Research", "Campaign Strategy", "Persuasive Writing"],
    fit: "A good fit if you like psychology, trends, creative ideas, and seeing what makes people take action.",
  },
  {
    name: "Healthcare",
    summary:
      "Supports patient health through direct care, clinical operations, health services, or medical technology.",
    skills: ["Patient Communication", "Clinical Judgment", "Attention to Detail"],
    fit: "You may fit here if you care about people, stay calm under pressure, and do not mind serious responsibility.",
  },
  {
    name: "Analytics & Data",
    summary:
      "Turns raw data into clear findings that help organizations understand problems and make better decisions.",
    skills: ["Data Analysis", "Statistics", "Data Visualization"],
    fit: "A strong fit if you enjoy patterns, spreadsheets or code, and explaining what the numbers actually mean.",
  },
  {
    name: "Business Intelligence",
    summary:
      "Builds reports, dashboards, and data systems that track performance across a business.",
    skills: ["Dashboard Design", "SQL", "Business Reporting"],
    fit: "Consider this if you like data but also want your work tied closely to everyday business decisions.",
  },
  {
    name: "Business & Management",
    summary:
      "Organizes people, projects, budgets, and operations so a team or company can reach its goals.",
    skills: ["Leadership", "Project Planning", "Decision-Making"],
    fit: "This can fit you if you naturally organize group work, communicate clearly, and like being accountable for results.",
  },
  {
    name: "Cybersecurity",
    summary:
      "Protects networks, systems, and information from attacks, misuse, and security failures.",
    skills: ["Threat Analysis", "Network Security", "Incident Response"],
    fit: "A good fit if you are skeptical, detail-focused, and enjoy figuring out how systems could break or be exploited.",
  },
  {
    name: "Information Technology (IT)",
    summary:
      "Keeps an organization’s devices, networks, software, and technical services running reliably.",
    skills: ["Troubleshooting", "Systems Administration", "Technical Support"],
    fit: "You may enjoy IT if you like fixing practical tech problems and helping people without needing to build every tool yourself.",
  },
  {
    name: "Finance",
    summary:
      "Evaluates money, investments, risk, and business performance to guide financial decisions.",
    skills: ["Financial Analysis", "Valuation", "Risk Assessment"],
    fit: "A strong fit if markets, money, competition, and number-heavy decisions hold your attention.",
  },
  {
    name: "Science & Research",
    summary:
      "Uses experiments, evidence, and careful investigation to answer questions and develop new knowledge.",
    skills: ["Research Design", "Laboratory Methods", "Scientific Writing"],
    fit: "This suits students who ask why, can work patiently, and want evidence before accepting an answer.",
  },
  {
    name: "Electrical Engineering",
    summary:
      "Designs and improves circuits, electronics, power systems, signals, and communication technology.",
    skills: ["Circuit Analysis", "Signal Processing", "System Design"],
    fit: "A good fit if you enjoy physics, math, electronics, and understanding what happens inside powered devices.",
  },
  {
    name: "Mechanical & Industrial Engineering",
    summary:
      "Designs machines and improves the systems, processes, and facilities used to produce goods and services.",
    skills: ["Mechanical Design", "Process Improvement", "CAD"],
    fit: "Consider this if you like building, optimizing, and seeing how physical parts and large processes work together.",
  },
  {
    name: "Civil Engineering",
    summary:
      "Plans and maintains infrastructure such as roads, buildings, bridges, water systems, and public spaces.",
    skills: ["Structural Analysis", "Project Planning", "Technical Drawing"],
    fit: "You may fit here if you like practical design and want your work to shape places people use every day.",
  },
  {
    name: "Biomechanical Engineering",
    summary:
      "Applies mechanics and engineering design to the human body, movement, medical devices, and rehabilitation.",
    skills: ["Biomechanics", "Product Design", "Human Anatomy"],
    fit: "A strong fit if you like engineering and biology and want to build technology that works with the human body.",
  },
  {
    name: "Computer Science & Software Development",
    summary:
      "Creates software, algorithms, applications, and digital systems that solve technical or user problems.",
    skills: ["Programming", "Algorithmic Thinking", "Software Testing"],
    fit: "This may fit you if you enjoy building things with code and can tolerate debugging when the answer is not obvious.",
  },
  {
    name: "Computer Engineering",
    summary:
      "Combines hardware and software to develop processors, embedded systems, devices, and computing infrastructure.",
    skills: ["Digital Logic", "Embedded Systems", "Computer Architecture"],
    fit: "A good match if you like both coding and electronics and want to work close to the machine itself.",
  },
  {
    name: "Economics",
    summary:
      "Studies how people, businesses, and governments make choices when money and resources are limited.",
    skills: ["Economic Modeling", "Quantitative Analysis", "Policy Evaluation"],
    fit: "Consider economics if you like connecting numbers to real questions about markets, incentives, policy, and behavior.",
  },
  {
    name: "Environmental Work & Sustainability",
    summary:
      "Addresses environmental problems through science, policy, conservation, planning, or sustainable business practices.",
    skills: ["Environmental Analysis", "Sustainability Planning", "Policy Research"],
    fit: "You may fit here if environmental issues matter to you and you want practical work, not just discussion.",
  },
  {
    name: "Accounting",
    summary:
      "Records, checks, and explains financial information so organizations can report accurately and follow rules.",
    skills: ["Financial Reporting", "Auditing", "Tax Analysis"],
    fit: "A good fit if you are reliable, precise, comfortable with rules, and like making messy records line up.",
  },
  {
    name: "Mathematics & Statistics",
    summary:
      "Uses mathematical reasoning and probability to model problems, test ideas, and measure uncertainty.",
    skills: ["Mathematical Modeling", "Probability", "Statistical Inference"],
    fit: "This suits you if solving hard problems feels rewarding and you want tools that transfer across many industries.",
  },
  {
    name: "Materials Engineering",
    summary:
      "Studies and develops metals, polymers, ceramics, and other materials used in products and infrastructure.",
    skills: ["Materials Testing", "Chemistry", "Failure Analysis"],
    fit: "A strong fit if you like chemistry and physics and often wonder why one material works better than another.",
  },
  {
    name: "Education",
    summary:
      "Helps people learn through teaching, curriculum design, advising, training, or school leadership.",
    skills: ["Instruction", "Lesson Planning", "Student Communication"],
    fit: "You may belong here if you explain ideas patiently and care about helping other people make real progress.",
  },
  {
    name: "Writing & Journalism",
    summary:
      "Researches, verifies, and communicates stories or information clearly for public and specialized audiences.",
    skills: ["Reporting", "Editing", "Interviewing"],
    fit: "A good fit if you are curious, write clearly, ask direct questions, and care whether information is accurate.",
  },
  {
    name: "Politics & Public Policy",
    summary:
      "Studies public problems and works through government, campaigns, advocacy, or policy organizations to address them.",
    skills: ["Policy Analysis", "Public Speaking", "Coalition Building"],
    fit: "Consider this if current issues energize you and you want to persuade, organize, or improve how decisions get made.",
  },
  {
    name: "Legal Services",
    summary:
      "Interprets laws, builds arguments, protects rights, and helps people or organizations handle legal matters.",
    skills: ["Legal Research", "Argumentation", "Case Analysis"],
    fit: "This may fit you if you read carefully, debate with evidence, and can handle detailed rules and high-stakes decisions.",
  },
  {
    name: "Languages & International Affairs",
    summary:
      "Uses language, cultural knowledge, and global analysis in diplomacy, international business, aid, or translation.",
    skills: ["Language Fluency", "Cross-Cultural Communication", "Global Research"],
    fit: "A strong fit if you enjoy languages, travel, world events, and working with people whose experiences differ from yours.",
  },
  {
    name: "History & Cultural Heritage",
    summary:
      "Researches, preserves, and explains the people, objects, places, and events that shape cultural memory.",
    skills: ["Archival Research", "Historical Analysis", "Preservation"],
    fit: "You may enjoy this if old stories and objects pull you in and you like finding meaning through careful research.",
  },
  {
    name: "Media, Communications & Public Relations",
    summary:
      "Shapes how organizations, public figures, and ideas are presented across news, social, and public channels.",
    skills: ["Media Strategy", "Public Writing", "Reputation Management"],
    fit: "A good fit if you communicate quickly, understand audiences, and can stay composed when attention or pressure rises.",
  },
  {
    name: "Arts & Creative Industries",
    summary:
      "Creates and directs visual, musical, theatrical, film, design, and other cultural work for audiences.",
    skills: ["Creative Direction", "Visual Storytelling", "Production"],
    fit: "This fits students who need to make things, take feedback seriously, and want creativity to be part of the job.",
  },
  {
    name: "Social & Behavioral Sciences",
    summary:
      "Studies how people think, behave, form groups, and respond to institutions, environments, and social forces.",
    skills: ["Research Methods", "Behavioral Analysis", "Interviewing"],
    fit: "Consider this if people genuinely interest you and you want to study behavior with evidence instead of guesses.",
  },
  {
    name: "Religion, Ministry & Spiritual Life",
    summary:
      "Supports faith communities and explores spiritual, ethical, and theological questions through service, teaching, or scholarship.",
    skills: ["Pastoral Care", "Ethical Reasoning", "Community Leadership"],
    fit: "You may fit here if faith, service, ethics, or helping people through major life moments matters deeply to you.",
  },
] as const;

export default function CareerAnglesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCareerAngles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return careerAngles;
    }

    return careerAngles.filter((angle) =>
      [angle.name, angle.summary, angle.fit, ...angle.skills]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-[#F3F3F1] pt-[112px] font-[Arial] text-[#171717]">
      <div className="mx-auto w-full max-w-[1320px] border-x border-[#B8B8B8] bg-white">
        <header className="grid border-b border-[#111111] lg:grid-cols-[220px_1fr]">
          <div className="border-b border-[#111111] bg-[#F4C542] p-6 lg:border-b-0 lg:border-r">
            <p className="font-mono text-xs font-black uppercase tracking-[0.16em]">
              PathPilot Index
            </p>
          </div>

          <div className="px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <Link
              href="/"
              className="text-sm font-bold text-[#0000CC] underline underline-offset-2"
            >
              Back to home
            </Link>

            <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Career Angles
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#4B4B4B] sm:text-lg">
              Browse the fields PathPilot can recommend. Search by category,
              skill, or the kind of work you enjoy.
            </p>
          </div>
        </header>

        <section className="border-b border-[#B8B8B8] bg-[#FAFAF8] px-6 py-6 sm:px-10 lg:px-14">
          <label htmlFor="career-angle-search" className="block">
            <span className="font-mono text-[11px] font-black uppercase tracking-[0.14em] text-[#4B5563]">
              Search the database
            </span>

            <div className="mt-2 flex max-w-3xl border border-[#111111] bg-white shadow-[3px_3px_0_#F4C542]">
              <span
                aria-hidden="true"
                className="flex items-center border-r border-[#B8B8B8] px-4 font-mono text-lg"
              >
                ?
              </span>
              <input
                id="career-angle-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Try finance, writing, coding, healthcare..."
                className="min-w-0 flex-1 bg-white px-4 py-4 text-sm outline-none placeholder:text-[#7A7A7A] focus:bg-[#FFFDF3]"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="border-l border-[#B8B8B8] px-4 text-xs font-bold uppercase hover:bg-[#F3F3F1]"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </label>

          <p aria-live="polite" className="mt-4 text-sm font-bold text-[#4B4B4B]">
            Showing {filteredCareerAngles.length} of {careerAngles.length} career
            angles
          </p>
        </section>

        <section aria-label="Career angle results">
          {filteredCareerAngles.length > 0 ? (
            filteredCareerAngles.map((angle, index) => (
              <article
                key={angle.name}
                className="grid border-b border-[#B8B8B8] last:border-b-0 lg:grid-cols-[220px_1fr]"
              >
                <div className="border-b border-[#B8B8B8] bg-[#172A5A] p-6 text-white lg:border-b-0 lg:border-r">
                  <p className="font-mono text-xs font-black tracking-[0.14em] text-[#F4C542]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.03em]">
                    {angle.name}
                  </h2>
                </div>

                <div className="grid lg:grid-cols-2">
                  <div className="border-b border-[#B8B8B8] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#6B7280]">
                      What it is
                    </p>
                    <p className="mt-3 text-[15px] leading-7 text-[#3F3F3F]">
                      {angle.summary}
                    </p>

                    <p className="mt-7 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#6B7280]">
                      Three useful skills
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                      {angle.skills.map((skill) => (
                        <li
                          key={skill}
                          className="border border-[#B8B8B8] bg-[#FAFAF8] px-3 py-3 text-xs font-bold leading-5"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-6 sm:p-8">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#6B7280]">
                      Could this fit you?
                    </p>
                    <p className="mt-3 max-w-xl text-[15px] font-bold leading-7 text-[#2F2F2F]">
                      {angle.fit}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="px-6 py-20 text-center sm:px-10">
              <p className="text-2xl font-black tracking-[-0.03em]">
                No career angles found.
              </p>
              <p className="mt-3 text-sm text-[#5B5B5B]">
                Try a broader category, skill, or interest.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-6 border border-[#111111] bg-[#F4C542] px-5 py-3 text-sm font-bold shadow-[2px_2px_0_#111111]"
              >
                Show all career angles
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
