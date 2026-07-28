"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

const MULTISAMPLING = 0;
const BLOOM_LUMINANCE_THRESHOLD = 0.32;
const BLOOM_LUMINANCE_SMOOTHING = 0.9;
const BLOOM_INTENSITY = 0.72;
const VIGNETTE_OFFSET = 0.22;
const VIGNETTE_DARKNESS = 0.68;

/**
 * Post-processing that gives the scene its fluorescence-microscopy glow.
 * Bloom is what makes emissive puncta bleed light against the black field.
 * Multisampling kept at 2 per the perf guidance.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={MULTISAMPLING}>
      <Bloom
        luminanceThreshold={BLOOM_LUMINANCE_THRESHOLD}
        luminanceSmoothing={BLOOM_LUMINANCE_SMOOTHING}
        intensity={BLOOM_INTENSITY}
        mipmapBlur
      />
      <Vignette offset={VIGNETTE_OFFSET} darkness={VIGNETTE_DARKNESS} eskil={false} />
    </EffectComposer>
  );
}
