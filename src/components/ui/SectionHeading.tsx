import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  accent = "#34D399",
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-xl">
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
