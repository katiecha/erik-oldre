import { PUBLICATIONS } from "@/lib/content";
import { PublicationCard } from "@/components/ui/PublicationCard";
import { Reveal } from "@/components/ui/Reveal";

export function PublicationsSection() {
  return (
    <section className="relative px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#3B82F6]">
            Publications
          </p>
          <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
            Peer-reviewed work
          </h2>
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
