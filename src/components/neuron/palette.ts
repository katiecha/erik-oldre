import * as THREE from "three";

/**
 * A spectral-function palette — a deep navy field with a "hot" colormap
 * (cyan → green → yellow → orange → red), echoing the momentum-space spectral
 * plots of quantum materials (Erik's field). Marks glow additively on the navy.
 */
export const PALETTE = {
  /** deep navy field */
  bg: "#0A1240",
  /** primary structure — cyan */
  soma: "#2CD8F5",
  /** hot points / synaptic puncta — red */
  puncta: "#FF3131",
  /** bright contour / primary UI accent — yellow */
  gfp: "#FFD21E",
  /** hot region — orange */
  farRed: "#FF7A1A",
  /** cool accent — spectral green */
  tdTomato: "#39D98A",
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
