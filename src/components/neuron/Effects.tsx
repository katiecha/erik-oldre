"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import type { Quality } from "./NeuronJourney";

/** MSAA on the composer target - what actually smooths the tube silhouettes. */
const MULTISAMPLING_HIGH = 4;
const MULTISAMPLING_LOW = 2;
// Bloom only for genuinely hot pixels. At a low threshold mipmapBlur smears
// the soft node sprites across the entire frame, which is what used to lift
// the background into a pale wash and kill contrast against white type.
const BLOOM_LUMINANCE_THRESHOLD = 0.62;
const BLOOM_LUMINANCE_SMOOTHING = 0.45;
const BLOOM_INTENSITY = 0.45;
/** Keeps the glow tight around its source instead of spread over the frame. */
const BLOOM_RADIUS = 0.35;
const VIGNETTE_OFFSET = 0.42;
const VIGNETTE_DARKNESS = 0.42;

/**
 * Post-processing that gives the scene its fluorescence-microscopy glow.
 * Bloom is what makes emissive puncta bleed light against the black field.
 * Multisampling is what keeps the tube silhouettes from stair-stepping; the
 * canvas-level `antialias` flag does nothing once a composer owns the output.
 *
 * The composer takes over the output pass, so the renderer's ACES tone mapping
 * no longer runs - it has to be an effect instead. Without it the composed
 * frame comes out several times brighter than the non-composer path, which is
 * what washed the field out from under the type.
 */
export function Effects({ quality }: { quality: Quality }) {
  return (
    <EffectComposer
      multisampling={quality === "high" ? MULTISAMPLING_HIGH : MULTISAMPLING_LOW}
    >
      <Bloom
        luminanceThreshold={BLOOM_LUMINANCE_THRESHOLD}
        luminanceSmoothing={BLOOM_LUMINANCE_SMOOTHING}
        intensity={BLOOM_INTENSITY}
        radius={BLOOM_RADIUS}
        mipmapBlur
      />
      <Vignette offset={VIGNETTE_OFFSET} darkness={VIGNETTE_DARKNESS} eskil={false} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
