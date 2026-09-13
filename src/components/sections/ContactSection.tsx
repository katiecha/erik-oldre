import { PROFILE } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

const LINKS = [
  { label: "Email", href: PROFILE.links.email, external: false },
  { label: "LinkedIn", href: PROFILE.links.linkedin, external: true },
  { label: "Instagram", href: PROFILE.links.instagram, external: true },
];

export function ContactSection() {
  return (
    // Extra bottom room: Reveal only fires 15% inside the viewport, so the
    // links would never animate in if they sat at the very end of the page.
    <section className="relative px-6 pb-40 pt-24 sm:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <div className="glass-pill mx-auto inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-full px-7 py-4 font-mono text-sm text-white/80">
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
