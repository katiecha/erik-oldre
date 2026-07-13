import { PUBLICATIONS } from "@/lib/content";
import { PALETTE } from "@/components/neuron/palette";
import { PublicationCard } from "@/components/ui/PublicationCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PublicationsSection() {
  return (
    <section className="relative px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="Publications"
            title="Peer-reviewed work"
            accent={PALETTE.soma}
          />
        </Reveal>

        <div className="mt-10 space-y-5">
          {PUBLICATIONS.map((pub, i) => (
            <Reveal key={pub.doi} delay={i * 0.08}>
              <PublicationCard pub={pub} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
