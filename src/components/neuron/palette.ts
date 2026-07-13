import * as THREE from "three";

/**
 * A monochrome palette — black, white, and shades of grey only. The keys
 * keep their microscopy-channel names, but every value is neutral grayscale
 * for a stark, minimal read.
 */
export const PALETTE = {
  /** near-black imaging field */
  bg: "#050505",
  /** MATH2+ pyramidal soma (brightest) */
  soma: "#F2F2F2",
  /** VGLUT3+ CCK-basket synaptic puncta */
  puncta: "#BFBFBF",
  /** EGFP / VGAT reporter (primary UI accent) */
  gfp: "#DCDCDC",
  /** structural / accent */
  farRed: "#8C8C8C",
  /** secondary accent */
  tdTomato: "#A6A6A6",
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
