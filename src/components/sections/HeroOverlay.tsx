import { PROFILE, STAGES } from "@/lib/content";

const hero = STAGES[0];

export function HeroOverlay() {
  return (
    <section
      data-stage="hero"
      className="flow-section relative flex min-h-[112dvh] flex-col justify-center overflow-hidden px-6 pb-32 pt-20 sm:px-12"
    >
      <div className="flow-caption relative max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.36em] text-white/55">
          {PROFILE.fellowship}
        </p>

        <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-[0.95] text-white sm:text-7xl md:text-8xl">
          {PROFILE.name}
        </h1>

        <p className="mt-8 max-w-xl font-serif text-xl italic text-white/80 sm:text-2xl">
          {hero.title}
        </p>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55">
          {PROFILE.title}
          <br />
          {PROFILE.affiliation}
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/45">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
