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
        luminanceThreshold={0.45}
        luminanceSmoothing={0.85}
        intensity={0.55}
        mipmapBlur
      />
      <Vignette offset={0.25} darkness={0.6} eskil={false} />
    </EffectComposer>
  );
}
