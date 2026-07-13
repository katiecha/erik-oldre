"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore, stageWeight, STAGE_COUNT } from "./useScrollStage";

/** Per-stage camera distance from the origin (the scene zooms in, then out). */
const STAGE_Z = [15, 7, 4.6, 10, 13.5];

/**
 * Drives the single camera from scroll progress. Each stage contributes a
 * weighted target position; we blend them and lerp smoothly every frame.
 * Pointer position adds a gentle parallax. No React state — refs only.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const target = useRef(new THREE.Vector3(0, 0, 15));

  useFrame((_, delta) => {
    const p = scrollStore.progress;

    // Weighted blend of stage camera distances.
    let z = 0;
    let wSum = 0;
    for (let i = 0; i < STAGE_COUNT; i++) {
      const w = stageWeight(p, i);
      z += STAGE_Z[i] * w;
      wSum += w;
    }
    if (wSum > 0) z /= wSum;
    else z = STAGE_Z[0];

    // Gentle parallax that eases off as we scroll past the hero.
    const parallax = 1 - Math.min(1, p * 2.2);
    const px = scrollStore.pointerX * 1.1 * parallax;
    const py = -scrollStore.pointerY * 0.7 * parallax;

    target.current.set(px, py, z);

    // Frame-rate independent smoothing.
    const k = 1 - Math.pow(0.0016, delta);
    camera.position.lerp(target.current, k);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
