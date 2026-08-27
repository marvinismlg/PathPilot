import Link from "next/link";

export default function TopBar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#111111] bg-white">

      {/* Main navigation */}
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-12">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border border-[#111111] bg-[#F4C542]">
            <img
              src="/images/icon.png"
              alt="PathPilot logo"
              className="h-8 w-8"
            />
          </div>

          <div>
            <p className="text-lg font-black leading-none text-[#111111]">
              PathPilot
            </p>

            <p className="mt-1 hidden text-xs text-[#555555] sm:block">
              Career direction for Loyola students.
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-bold md:flex">

          <Link
            href="/features"
            className="text-[#0000CC] underline underline-offset-2"
          >
            Overview
          </Link>

          <Link
            href="/career_angles"
            className="text-[#0000CC] underline underline-offset-2"
          >
            Career Angles
          </Link>

          <Link
            href="/academic_database"
            className="text-[#0000CC] underline underline-offset-2"
          >
            Academic Database
          </Link>
        </nav>

        {/* Account actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden border border-[#777777] bg-white px-4 py-2 text-sm font-bold text-[#0000CC] underline underline-offset-2 sm:inline-flex"
          >
            Log in
          </Link>

          <Link
            href="/quiz"
            className="inline-flex items-center border-2 border-[#111111] bg-[#F4C542] px-5 py-2 text-sm font-bold text-[#111111] shadow-[3px_3px_0_#111111] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Take Quiz
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}