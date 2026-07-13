import type { ReactNode } from "react";
import type { Stage } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Shared layout for the three narrative stages (synapse / molecule / material).
 * Text sits in a translucent panel to one side so the 3D scene reads through.
 */
export function NarrativeSection({
  stage,
  accent,
  side = "left",
  children,
}: {
  stage: Stage;
  accent: string;
  side?: "left" | "right";
  children?: ReactNode;
}) {
  return (
    <section
      data-stage={stage.id}
      className={`relative flex min-h-[100dvh] items-center px-6 py-24 sm:px-12 ${
        side === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <Reveal className="w-full max-w-xl rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-8 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md sm:p-10">
        <SectionHeading eyebrow={stage.eyebrow} title={stage.title} accent={accent}>
          <p>{stage.body}</p>
        </SectionHeading>
        {children && <div className="mt-8">{children}</div>}
      </Reveal>
    </section>
  );
}

/** A small inline link to a paper, styled as a scientific citation chip. */
export function PaperLink({
  href,
  label,
  accent,
}: {
  href: string;
  label: string;
  accent: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-white/5"
      style={{ borderColor: `${accent}66`, color: accent }}
    >
      {label} ↗
    </a>
  );
}
