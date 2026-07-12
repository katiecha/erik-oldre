import { PROFILE } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

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
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#34D399]">
            Contact
          </p>
          <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
            Get in touch.
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 flex flex-wrap justify-center gap-4">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.label === "Email" ? undefined : "_blank"}
              rel="noreferrer noopener"
              className="group flex min-w-[180px] flex-col items-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
                {l.label}
              </span>
              <span className="mt-1.5 text-white group-hover:text-[#34D399]">
                {l.value}
              </span>
            </a>
          ))}
        </Reveal>

        <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.3em] text-white/25">
          {PROFILE.fullName} · {PROFILE.affiliation}
        </p>
      </div>
    </section>
  );
}
