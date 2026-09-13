import type { ReactNode } from "react";
import type { Stage } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Shared layout for the three narrative stages (synapse / molecule / material).
 * Copy behaves like a figure annotation suspended in the light field.
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
      className={`flow-section relative flex min-h-[100dvh] items-center overflow-hidden px-6 py-24 sm:px-12 ${
        side === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <Reveal
        className={`flow-caption relative w-full max-w-xl ${
          side === "right" ? "flow-caption-right" : "flow-caption-left"
        }`}
      >
        <SectionHeading eyebrow={stage.eyebrow} title={stage.title} accent={accent}>
          <p>{stage.body}</p>
        </SectionHeading>
        {children && <div className="mt-8">{children}</div>}
      </Reveal>
    </section>
  );
}

/**
 * A small inline link to a paper, styled as a scientific citation chip.
 *
 * The chip carries its own near-black ground on purpose: the accent colours are
 * saturated rather than bright, and at 12px they disappear when a lit part of
 * the field drifts behind them.
 */
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
      className="inline-flex items-center gap-2 rounded-full border bg-[#06020E]/80 px-4 py-2 font-mono text-xs uppercase tracking-wider backdrop-blur-[2px] transition-colors hover:text-white"
      style={{ borderColor: `${accent}55`, color: accent }}
    >
      {label} ↗
    </a>
  );
}
