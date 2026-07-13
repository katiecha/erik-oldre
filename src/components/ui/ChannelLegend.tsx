import { CHANNEL_LEGEND } from "@/lib/content";

/** Fluorophore key, mirroring how Erik's confocal figures are labelled. */
export function ChannelLegend() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      {CHANNEL_LEGEND.map((c) => (
        <li key={c.label} className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: c.color, boxShadow: `0 0 10px ${c.color}` }}
          />
          <span className="text-sm text-white/90">{c.label}</span>
          <span className="font-mono text-[11px] text-white/45">{c.note}</span>
        </li>
      ))}
    </ul>
  );
}
