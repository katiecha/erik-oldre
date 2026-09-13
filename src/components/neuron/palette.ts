import * as THREE from "three";

/**
 * An inferno/plasma spectral-function palette - near-black → deep violet →
 * magenta → red → orange → amber, matching the momentum-space spectral plots
 * of quantum materials (Erik's field). The base is almost black on purpose:
 * white body copy has to stay readable wherever the field happens to land.
 */
export const PALETTE = {
  /** near-black violet field */
  bg: "#0A0412",
  /** primary structure - vivid violet */
  soma: "#A961FF",
  /** hot points / synaptic puncta - crimson */
  puncta: "#FF2D55",
  /** bright contour / primary UI accent - amber */
  gfp: "#FFB020",
  /** hot region - orange */
  farRed: "#FF6A13",
  /** cool accent - magenta */
  tdTomato: "#E838C8",
} as const;

/** Field-only tones. Too dark to put type on, so they live outside PALETTE. */
export const FIELD = {
  /** the low end of the ramp, just above the background */
  deep: "#180730",
  /** mid ramp - saturated indigo-violet */
  violet: "#3B1580",
  /** upper cool ramp, where violet turns magenta */
  magenta: "#5C1148",
} as const;

export type PaletteKey = keyof typeof PALETTE;

/** Memo-friendly THREE.Color instances (module-level singletons). */
export const COLORS = {
  bg: new THREE.Color(PALETTE.bg),
  soma: new THREE.Color(PALETTE.soma),
  puncta: new THREE.Color(PALETTE.puncta),
  gfp: new THREE.Color(PALETTE.gfp),
  farRed: new THREE.Color(PALETTE.farRed),
  tdTomato: new THREE.Color(PALETTE.tdTomato),
} as const;
