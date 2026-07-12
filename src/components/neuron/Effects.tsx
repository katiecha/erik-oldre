"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/**
 * Post-processing that gives the scene its fluorescence-microscopy glow.
 * Bloom is what makes emissive puncta bleed light against the black field.
 * Multisampling kept at 2 per the perf guidance.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={2}>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={1.15}
        mipmapBlur
      />
      <Vignette offset={0.2} darkness={0.72} eskil={false} />
    </EffectComposer>
  );
}
