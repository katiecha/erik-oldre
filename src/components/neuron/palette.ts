import * as THREE from "three";

/**
 * A "jet" spectral-function palette on a deep royal-blue field - blue → cyan →
 * yellow → orange → red, matching the momentum-space plots of quantum materials
 * (Erik's field). No purple; the hot end is warm, the base is saturated blue.
 */
export const PALETTE = {
  /** deep royal-blue field */
  bg: "#0B1E63",
  /** primary structure - cyan */
  soma: "#2FCFE6",
  /** hot points / synaptic puncta - red */
  puncta: "#F5352A",
  /** bright contour / primary UI accent - yellow */
  gfp: "#FFDE3D",
  /** hot region - orange */
  farRed: "#FF922E",
  /** cool accent - spectral green */
  tdTomato: "#57D14A",
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
