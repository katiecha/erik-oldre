import * as THREE from "three";

/**
 * Fluorescence-microscopy palette drawn from Erik's actual imaging channels.
 * Each color maps to a real fluorophore / marker used in his neuroscience work.
 */
export const PALETTE = {
  /** near-black imaging field */
  bg: "#04040A",
  /** MATH2+ pyramidal soma (blue) */
  soma: "#3B82F6",
  /** VGLUT3+ CCK-basket synaptic puncta (magenta, Alexa 555) */
  puncta: "#FF2E88",
  /** EGFP / VGAT (green, Alexa 488) */
  gfp: "#22E39A",
  /** Alexa 647 far-red channel (violet) */
  farRed: "#D400FF",
  /** tdTomato reporter (red-orange) */
  tdTomato: "#FF5A36",
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
