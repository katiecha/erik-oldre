import type { ReactNode } from "react";
import { PALETTE } from "@/components/neuron/palette";

export function SectionHeading({
  eyebrow,
  title,
  accent = PALETTE.gfp,
  center = false,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  /** Center the heading (and its children) instead of the default left alignment. */
  center?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={center ? "mx-auto max-w-xl text-center" : "max-w-xl"}>
      <p
        className="font-mono text-xs uppercase tracking-[0.35em]"
        style={{ color: accent }}
      >
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-4xl leading-tight text-white sm:text-5xl">
        {title}
      </h2>
      {children && (
        <div className="mt-6 text-base leading-relaxed text-white/70">
          {children}
        </div>
      )}
    </div>
  );
}
