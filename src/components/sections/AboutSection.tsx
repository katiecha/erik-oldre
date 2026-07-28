import Image from "next/image";
import { PROFILE, BIO, RESEARCH_HISTORY, STAGES } from "@/lib/content";
import { PALETTE } from "@/components/neuron/palette";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const about = STAGES[4];

export function AboutSection() {
  return (
    <section
      data-stage="about"
      className="flow-section relative flex min-h-[100dvh] items-center overflow-hidden px-6 py-28 sm:px-12"
    >
      <div className="mx-auto grid w-full max-w-5xl gap-12 md:grid-cols-[300px_1fr] md:items-start">
        <Reveal className="flex flex-col items-center gap-5 md:sticky md:top-28">
          <div className="relative h-56 w-56 overflow-hidden border border-white/15 bg-[#071033]/20">
            <Image
              src="/erik.jpg"
              alt="Erik Oldre"
              fill
              sizes="224px"
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <p className="font-serif text-xl text-white">{PROFILE.fullName}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-white/45">
              {PROFILE.pronouns} · {PROFILE.location}
            </p>
          </div>
        </Reveal>

        <div className="flow-caption">
          <Reveal>
            <SectionHeading
              eyebrow={about.eyebrow}
              title={about.title}
              accent={PALETTE.soma}
            />
          </Reveal>

          <Reveal delay={0.05} className="mt-6 space-y-4 text-white/70">
            {BIO.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
              Research history
            </p>
            <ul className="mt-6 space-y-6 border-l border-white/10 pl-6">
              {RESEARCH_HISTORY.map((r) => (
                <li key={r.lab} className="relative">
                  <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-gfp shadow-[0_0_10px_var(--color-gfp)]" />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-serif text-lg text-white">
                      {r.lab}
                      <span className="text-white/55"> · {r.institution}</span>
                    </h3>
                    <span className="font-mono text-xs text-white/45">
                      {r.period}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                    {r.summary}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
