import type { Publication } from "@/lib/content";

/** Renders one publication with the author highlighted and a DOI link. */
export function PublicationCard({ pub }: { pub: Publication }) {
  const parts = pub.authors.split(pub.authorHighlight);

  return (
    <a
      href={pub.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group block border-l border-white/15 py-6 pl-6 transition-colors hover:border-gfp/60"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-gfp">
          {pub.venue}
        </span>
        {pub.firstAuthor && (
          <span className="border-b border-puncta/45 pb-0.5 font-mono text-[10px] uppercase tracking-wider text-puncta">
            First author
          </span>
        )}
      </div>

      <h3 className="mt-3 font-serif text-xl leading-snug text-white group-hover:text-white">
        {pub.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-white/55">
        {parts[0]}
        <span className="text-white/90">{pub.authorHighlight}</span>
        {parts[1]}
      </p>

      <div className="mt-4 flex items-center gap-2 font-mono text-xs text-white/45">
        <span>{pub.detail}</span>
        <span aria-hidden>·</span>
        <span className="text-white/55 group-hover:text-puncta">
          doi:{pub.doi} ↗
        </span>
      </div>
    </a>
  );
}
