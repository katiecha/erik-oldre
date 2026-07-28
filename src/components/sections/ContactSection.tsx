import { PROFILE } from "@/lib/content";
import { PALETTE } from "@/components/neuron/palette";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const LINKS = [
  { label: "Email", href: PROFILE.links.email, value: PROFILE.email },
  { label: "LinkedIn", href: PROFILE.links.linkedin, value: "in/erik-oldre" },
  { label: "Instagram", href: PROFILE.links.instagram, value: "@erik.oldre" },
];

export function ContactSection() {
  return (
    <section className="relative px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <SectionHeading eyebrow="Contact" title="Get in touch." accent={PALETTE.gfp} center />
        </Reveal>

        <Reveal delay={0.08} className="mt-10 flex flex-wrap justify-center gap-4">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.label === "Email" ? undefined : "_blank"}
              rel="noreferrer noopener"
              className="group flex min-w-[180px] flex-col items-center border-b border-white/15 px-6 py-5 transition-colors hover:border-gfp/60"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
                {l.label}
              </span>
              <span className="mt-1.5 text-white group-hover:text-gfp">
                {l.value}
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
