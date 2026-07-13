import { useRef } from "react";
import * as THREE from "three";
import { scrollStore, stageWeight } from "./useScrollStage";

const VISIBILITY_THRESHOLD = 0.01;

/** Shared "glow" material config used by every emissive mesh in the scene. */
export const GLOW_MATERIAL_PROPS = {
  transparent: true,
  opacity: 0,
  toneMapped: false,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
} as const;

/**
 * Sets an Object3D's visibility from a stage's scroll-crossfade weight.
 * Returns the weight, or `null` when the stage is effectively hidden — callers
 * should bail out of their useFrame body on `null`.
 */
export function applyStageVisibility(
  object: THREE.Object3D,
  stageIndex: number,
): number | null {
  const w = stageWeight(scrollStore.progress, stageIndex);
  object.visible = w > VISIBILITY_THRESHOLD;
  return object.visible ? w : null;
}

/**
 * Returns a function that runs `fn` on only the first call — for the
 * "apply instance transforms once" pattern inside a useFrame loop.
 */
export function useRunOnce() {
  const done = useRef(false);
  return (fn: () => void) => {
    if (done.current) return;
    fn();
    done.current = true;
  };
}
