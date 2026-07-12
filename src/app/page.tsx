import { NeuronJourney } from "@/components/neuron/NeuronJourney";
import { ScrollDriver } from "@/components/sections/ScrollDriver";
import { HeroOverlay } from "@/components/sections/HeroOverlay";
import {
  NarrativeSection,
  PaperLink,
} from "@/components/sections/NarrativeSection";
import { ChannelLegend } from "@/components/ui/ChannelLegend";
import { AboutSection } from "@/components/sections/AboutSection";
import { PublicationsSection } from "@/components/sections/PublicationsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { PALETTE } from "@/components/neuron/palette";
import { STAGES, PUBLICATIONS } from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* Persistent WebGL scene behind everything */}
      <NeuronJourney />
      <ScrollDriver />

      <main className="relative z-10">
        <HeroOverlay />

        {/* 01 — Synapse */}
        <NarrativeSection stage={STAGES[1]} accent={PALETTE.puncta} side="left">
          <div className="space-y-6">
            <ChannelLegend />
            <PaperLink
              href={PUBLICATIONS[0].url}
              label="Read the paper — Curr. Res. Neurobiology"
              accent={PALETTE.puncta}
            />
          </div>
        </NarrativeSection>

        {/* 02 — Molecule */}
        <NarrativeSection stage={STAGES[2]} accent={PALETTE.farRed} side="right">
          <PaperLink
            href={PUBLICATIONS[1].url}
            label="Read the paper — J. Biological Chemistry"
            accent={PALETTE.farRed}
          />
        </NarrativeSection>

        {/* 03 — Material */}
        <NarrativeSection stage={STAGES[3]} accent={PALETTE.tdTomato} side="left">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/70">
            Wiesner Group · Cornell MSE
          </p>
        </NarrativeSection>

        {/* 04 — Scientist + publications + contact.
            A scrim calms the field so the long-form reading content stays legible. */}
        <div className="relative bg-[#04040A]/78 backdrop-blur-[2px]">
          <AboutSection />
          <PublicationsSection />
          <ContactSection />
        </div>
      </main>
    </>
  );
}
