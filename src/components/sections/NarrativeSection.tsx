import type { ReactNode } from "react";
import type { Stage } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PALETTE } from "@/components/neuron/palette";

/**
 * Shared layout for the three narrative stages (synapse / molecule / material).
 * Copy sits on a frosted panel floating in the light field.
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
        <div className="glass-card">
          <SectionHeading eyebrow={stage.eyebrow} title={stage.title} accent={accent}>
            <p>{stage.body}</p>
          </SectionHeading>
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Reveal>
    </section>
  );
}

/**
 * A small inline link to a paper. Every citation uses the same crimson accent -
 * the papers are one category, so they should not read as colour-coded by stage.
 *
 * The chip carries its own frosted ground on purpose: the accent is saturated
 * rather than bright, and at 12px it disappears when a lit part of the field
 * drifts behind it.
 */
export function PaperLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="type-label type-label-sm glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors hover:text-white"
      style={{ borderColor: `${PALETTE.puncta}55`, color: PALETTE.puncta }}
    >
      {label} ↗
    </a>
  );
}
