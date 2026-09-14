import { NeuronJourney } from "@/components/neuron/NeuronJourney";
import { ScrollDriver } from "@/components/sections/ScrollDriver";
import { HeroOverlay } from "@/components/sections/HeroOverlay";
import {
  NarrativeSection,
  PaperLink,
} from "@/components/sections/NarrativeSection";
import { AboutSection } from "@/components/sections/AboutSection";
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

        {/* 01 - Synapse */}
        <NarrativeSection stage={STAGES[1]} accent={PALETTE.gfp} side="left">
          <PaperLink href={PUBLICATIONS[0].url} label="Curr. Res. Neurobiology" />
        </NarrativeSection>

        {/* 02 - Molecule */}
        <NarrativeSection stage={STAGES[2]} accent={PALETTE.puncta} side="right">
          <PaperLink href={PUBLICATIONS[1].url} label="J. Biological Chemistry" />
        </NarrativeSection>

        {/* 03 - Material */}
        <NarrativeSection stage={STAGES[3]} accent={PALETTE.farRed} side="left" />

        {/* 04 - Scientist + publications + contact. */}
        <div className="relative overflow-hidden">
          <AboutSection />
          <ContactSection />
        </div>
      </main>
    </>
  );
}
