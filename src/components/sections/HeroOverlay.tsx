import { PROFILE } from "@/lib/content";

export function HeroOverlay() {
  return (
    <section
      data-stage="hero"
      className="flow-section relative flex min-h-[112dvh] flex-col justify-center overflow-hidden px-6 pb-32 pt-20 sm:px-12"
    >
      <div className="flow-caption relative max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/78 sm:tracking-[0.36em]">
          {PROFILE.fellowship}
        </p>

        <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-[0.95] text-white sm:text-7xl md:text-8xl">
          {PROFILE.name}
        </h1>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/78">
          {PROFILE.affiliation}
        </p>
      </div>
    </section>
  );
}
