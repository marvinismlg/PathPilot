"use client";

import Link from "next/link";

type ComingSoonPageProps = {
  title: string;
  description: string;
};

export default function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC] px-4">
      <section className="w-full max-w-2xl rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
          PathPilot
        </p>
        <h1 className="mt-4 text-3xl font-bold text-[#111827]">{title}</h1>
        <p className="mt-3 text-base leading-7 text-[#4B5563]">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/home"
            className="rounded-2xl bg-[#F4C542] px-5 py-3 font-semibold text-[#1A1A1A]"
          >
            Back Home
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-[#D1D5DB] px-5 py-3 font-semibold text-[#1A1A1A]"
          >
            Go To Login
          </Link>
        </div>
      </section>
    </main>
  );
}
