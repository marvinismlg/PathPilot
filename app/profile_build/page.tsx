"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { createClient } from "../../lib/supabase/client";

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior"] as const;

type YearOption = (typeof YEAR_OPTIONS)[number];

function normalizeClubName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export default function ProfileBuildPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [year, setYear] = useState<YearOption | "">("");
  const [clubInput, setClubInput] = useState("");
  const [clubs, setClubs] = useState<string[]>([]);
  const [clubFeedback, setClubFeedback] = useState<string | null>(null);
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const pendingClubName = normalizeClubName(clubInput);
  const isFormValid =
    trimmedFirstName.length > 0 &&
    trimmedLastName.length > 0 &&
    year.length > 0;

  const firstNameHasError = firstNameTouched && trimmedFirstName.length === 0;
  const lastNameHasError = lastNameTouched && trimmedLastName.length === 0;

  function addClub() {
    const nextClub = normalizeClubName(clubInput);

    if (!nextClub) {
      setClubFeedback("Enter a club or organization name before adding it.");
      return;
    }

    const nextClubKey = nextClub.toLowerCase();
    const isDuplicate = clubs.some((club) => club.toLowerCase() === nextClubKey);

    if (isDuplicate) {
      setClubFeedback("That club is already on your list.");
      return;
    }

    setClubs((currentClubs) => [...currentClubs, nextClub]);
    setClubInput("");
    setClubFeedback(null);
  }

  function removeClub(clubToRemove: string) {
    setClubs((currentClubs) =>
      currentClubs.filter((club) => club !== clubToRemove),
    );
    setClubFeedback(null);
  }

  function handleClubKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addClub();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    if (!isFormValid) {
      setFirstNameTouched(true);
      setLastNameTouched(true);
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Your session expired. Please sign in again.");
      }

      if (!user.email) {
        throw new Error("Your authenticated account does not have an email address.");
      }

      const { error: saveError } = await supabase.from("users").upsert(
        {
          user_id: user.id,
          email: user.email,
          first_name: trimmedFirstName,
          last_name: trimmedLastName,
          year,
          clubs,
        },
        { onConflict: "user_id" },
      );

      if (saveError) {
        throw saveError;
      }

      router.push("/test");
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "PathPilot could not save your profile. Please try again.",
      );
      setIsSaving(false);
    }
  }

return (
  <main className="relative min-h-screen overflow-hidden bg-[#F1F4F8] font-sans text-[#171717]">
    {/* Background clipart */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Graduation cap */}
      <div className="absolute left-[4%] top-[8%] rotate-[-10deg] text-[#B1B8C0]">
        <svg
          width="110"
          height="110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M2 10l10-5 10 5-10 5L2 10z" />
          <path d="M6 12.5V17c3 2 9 2 12 0v-4.5" />
          <path d="M22 10v6" />
        </svg>
      </div>

      {/* Open book */}
      <div className="absolute right-[5%] top-[9%] rotate-[8deg] text-[#B1B8C0]">
        <svg
          width="108"
          height="108"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M4 4h6a4 4 0 014 4v12a4 4 0 00-4-4H4V4z" />
          <path d="M20 4h-6a4 4 0 00-4 4v12a4 4 0 014-4h6V4z" />
        </svg>
      </div>

      {/* Pencil */}
      <div className="absolute left-[9%] top-[42%] rotate-[18deg] text-[#B1B8C0]">
        <svg
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
          <path d="M14 7l3 3" />
        </svg>
      </div>

      {/* Calculator */}
      <div className="absolute right-[8%] top-[40%] rotate-[-6deg] text-[#B1B8C0]">
        <svg
          width="95"
          height="95"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <rect x="6" y="2.5" width="12" height="19" rx="1.5" />
          <rect x="8.5" y="5" width="7" height="3" />
          <path d="M9 11h1M14 11h1M9 14h1M14 14h1M9 17h1M14 17h1" />
        </svg>
      </div>

      {/* Notebook */}
      <div className="absolute left-[5%] bottom-[16%] rotate-[-9deg] text-[#B1B8C0]">
        <svg
          width="102"
          height="102"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <rect x="5" y="3" width="14" height="18" rx="1" />
          <path d="M8 7h8M8 11h8M8 15h5" />
          <path d="M3 7h4M3 11h4M3 15h4" />
        </svg>
      </div>

      {/* Ruler */}
      <div className="absolute right-[6%] bottom-[18%] rotate-[20deg] text-[#B1B8C0]">
        <svg
          width="98"
          height="98"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M4 16L16 4l4 4-12 12H4v-4z" />
          <path d="M13 7l4 4M10 10l2 2M7 13l2 2" />
        </svg>
      </div>

      {/* Beaker */}
      <div className="absolute left-[19%] top-[20%] rotate-[12deg] text-[#B1B8C0]">
        <svg
          width="88"
          height="88"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M10 2h4M10 2v5l-5 9a3 3 0 002.6 4.5h8.8A3 3 0 0019 16L14 7V2" />
          <path d="M8 13h8" />
        </svg>
      </div>

      {/* Lightbulb */}
      <div className="absolute right-[20%] bottom-[8%] rotate-[-10deg] text-[#B1B8C0]">
        <svg
          width="86"
          height="86"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M9 18h6M10 21h4" />
          <path d="M12 3a6 6 0 00-3.8 10.6c.7.6 1.3 1.4 1.6 2.4h4.4c.3-1 .9-1.8 1.6-2.4A6 6 0 0012 3z" />
        </svg>
      </div>
    </div>

    <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-start justify-center px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
      <div className="w-full max-w-[600px] min-h-[calc(100vh+120px)] border border-[#BFC5CC] bg-white px-6 pb-32 pt-9 sm:px-8 sm:pt-10">
        {/* Header */}
        <div className="mb-10 border-b-2 border-[#171717] pb-6">

          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] text-[#171717] sm:text-[42px]">
            Setup your Pilot Profile
          </h1>

          <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#5F6670]">
            Create your profile so you can get started with the test.
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-bold text-[#171717]"
              >
                First Name
              </label>

              <input
                id="first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                onBlur={() => setFirstNameTouched(true)}
                aria-invalid={firstNameHasError}
                aria-describedby={
                  firstNameHasError ? "first-name-error" : undefined
                }
                placeholder="Jordan"
                className={`mt-3 w-full border px-4 py-3 text-[15px] font-medium text-[#171717] outline-none placeholder:text-[#A2A8AF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F4C542] ${
                  firstNameHasError
                    ? "border-[#C76B6B]"
                    : "border-[#D7DCE1]"
                }`}
              />

              <p
                id="first-name-error"
                className={`mt-2 text-xs font-semibold text-[#B45309] ${
                  firstNameHasError ? "opacity-100" : "opacity-0"
                }`}
              >
                First name is required.
              </p>
            </div>

            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-bold text-[#171717]"
              >
                Last Name
              </label>

              <input
                id="last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                onBlur={() => setLastNameTouched(true)}
                aria-invalid={lastNameHasError}
                aria-describedby={
                  lastNameHasError ? "last-name-error" : undefined
                }
                placeholder="Goggins"
                className={`mt-3 w-full border px-4 py-3 text-[15px] font-medium text-[#171717] outline-none placeholder:text-[#A2A8AF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F4C542] ${
                  lastNameHasError
                    ? "border-[#C76B6B]"
                    : "border-[#D7DCE1]"
                }`}
              />

              <p
                id="last-name-error"
                className={`mt-2 text-xs font-semibold text-[#B45309] ${
                  lastNameHasError ? "opacity-100" : "opacity-0"
                }`}
              >
                Last name is required.
              </p>
            </div>
          </div>

          {/* Year */}
          <fieldset>
            <legend className="text-sm font-bold text-[#171717]">
              Year
            </legend>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {YEAR_OPTIONS.map((option) => (
                <label key={option} className="cursor-pointer">
                  <input
                    type="radio"
                    name="year"
                    value={option}
                    checked={year === option}
                    onChange={() => setYear(option)}
                    className="peer sr-only"
                  />

                  <span className="flex min-h-[48px] items-center justify-center border border-[#BFC5CC] bg-white px-3 text-sm font-bold text-[#4F5660] transition hover:border-[#171717] peer-checked:border-[#171717] peer-checked:bg-[#F4C542] peer-checked:text-[#171717] peer-checked:shadow-[2px_2px_0_#171717] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#F4C542]">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Clubs */}
          <div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="club-input"
                className="text-sm font-bold text-[#171717]"
              >
                Clubs &amp; Organizations
              </label>

              <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#8A9199]">
                Optional
              </span>
            </div>

            <p
              id="clubs-help"
              className="mt-2 text-sm font-medium leading-6 text-[#5F6670]"
            >
              What are you involved in or interested in joining?
            </p>

            <div className="mt-4 flex items-center gap-3">
              <input
                id="club-input"
                name="clubInput"
                type="text"
                value={clubInput}
                onChange={(event) => {
                  setClubInput(event.target.value);
                  setClubFeedback(null);
                }}
                onKeyDown={handleClubKeyDown}
                aria-describedby="clubs-help clubs-feedback"
                placeholder="Chimes"
                className="w-full border border-[#D7DCE1] px-4 py-3 text-[15px] font-medium text-[#171717] outline-none placeholder:text-[#A2A8AF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F4C542]"
              />

              <button
                type="button"
                onClick={addClub}
                disabled={pendingClubName.length === 0}
                aria-label="Add club"
                className="inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center border border-[#171717] bg-[#F4C542] text-2xl font-bold text-[#171717] shadow-[2px_2px_0_#171717] transition hover:brightness-95 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>

            <p
              id="clubs-feedback"
              aria-live="polite"
              className={`mt-2 min-h-[18px] text-xs font-semibold ${
                clubFeedback ? "text-[#B45309]" : "text-[#8A9199]"
              }`}
            >
              {clubFeedback ??
                "Press Enter or + to add another organization."}
            </p>

            {clubs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {clubs.map((club) => (
                  <div
                    key={club}
                    className="inline-flex items-center gap-2 rounded-sm border border-[#171717] bg-[#F4C542] px-3 py-2 text-sm font-bold text-[#171717]"
                  >
                    <span>{club}</span>

                    <button
                      type="button"
                      onClick={() => removeClub(club)}
                      aria-label={`Remove ${club}`}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-[#171717]"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4 border-t border-[#E4E7EA] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p
              aria-live="polite"
              className="max-w-sm text-xs font-semibold leading-5 text-[#747B84]"
            >
              {isFormValid
                ? submitError ??
                  (isSaving
                    ? "Saving your student profile..."
                    : "You can update these details later.")
                : "First name, last name, and year are required."}
            </p>

            <button
              type="submit"
              disabled={!isFormValid || isSaving}
              className="inline-flex w-full items-center justify-center border-2 border-[#171717] bg-[#F4C542] px-8 py-3 text-sm font-bold text-[#171717] shadow-[3px_3px_0_#171717] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:w-auto"
            >
              {isSaving ? "Saving..." : "Continue"}
              <span aria-hidden="true" className="ml-2 text-base">
                →
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  </main>
);
}
