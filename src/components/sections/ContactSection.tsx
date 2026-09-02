import { PROFILE } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

const LINKS = [
  { label: "Email", href: PROFILE.links.email, external: false },
  { label: "LinkedIn", href: PROFILE.links.linkedin, external: true },
  { label: "Instagram", href: PROFILE.links.instagram, external: true },
];

export function ContactSection() {
  return (
    <section className="relative px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-serif text-2xl text-white sm:text-3xl">
            Get in touch
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-sm text-white/75">
            {LINKS.map((l, i) => (
              <span key={l.label} className="flex items-center gap-x-5">
                {i > 0 && <span className="text-white/25">·</span>}
                <a
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer noopener" : undefined}
                  className="transition-colors hover:text-gfp"
                >
                  {l.label}
                </a>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
