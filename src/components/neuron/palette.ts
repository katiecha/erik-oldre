import * as THREE from "three";

/**
 * A restrained, cool palette — blues, greens, and teals only. No warm hues.
 * The keys keep their microscopy-channel names, but every value sits in the
 * blue→green range for a professional, scientific read.
 */
export const PALETTE = {
  /** deep blue-black imaging field */
  bg: "#060A0F",
  /** MATH2+ pyramidal soma (blue) */
  soma: "#3B82F6",
  /** VGLUT3+ CCK-basket synaptic puncta (cyan) */
  puncta: "#5EE9F0",
  /** EGFP / VGAT reporter (green) */
  gfp: "#34D399",
  /** structural / accent (teal) */
  farRed: "#2DD4BF",
  /** secondary accent (green-teal) */
  tdTomato: "#1FB6A6",
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
