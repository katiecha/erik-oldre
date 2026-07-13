import { PROFILE, STAGES } from "@/lib/content";

const hero = STAGES[0];

export function HeroOverlay() {
  return (
    <section
      data-stage="hero"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
    >
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/55">
        {PROFILE.fellowship}
      </p>

      <h1 className="mt-6 font-serif text-6xl leading-[0.95] text-white sm:text-7xl md:text-8xl">
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

      <div className="pointer-events-none absolute bottom-10 flex flex-col items-center gap-2 text-white/45">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
