"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STAGE_INDEX } from "@/lib/content";
import { COLORS } from "./palette";
import { applyStageVisibility, GLOW_MATERIAL_PROPS } from "./sceneUtils";
import type { Quality } from "./NeuronJourney";

const BLOCK_COLORS = [
  COLORS.soma,
  COLORS.gfp,
  COLORS.puncta,
  COLORS.farRed,
  COLORS.tdTomato,
];

type Strand = { geometry: THREE.TubeGeometry; color: THREE.Color };

/**
 * Stage 03 — the material. Interwoven chiral strands standing in for a
 * self-assembled block-copolymer mesophase: multiple helices twisting around a
 * common axis with a single handedness. Instanced beads across the palette
 * suggest distinct copolymer blocks. Evokes Erik's current Wiesner Group work.
 */
export function BlockCopolymer({ quality }: { quality: Quality }) {
  const strands = quality === "high" ? 5 : 4;

  const strandGeometries = useMemo<Strand[]>(() => {
    const out: Strand[] = [];
    const turns = 2.25;
    const R = 1.65;
    for (let s = 0; s < strands; s++) {
      const offset = (s / strands) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      const steps = quality === "high" ? 120 : 84;
      for (let i = 0; i <= steps; i++) {
        const f = i / steps;
        const y = THREE.MathUtils.lerp(-2.7, 2.7, f);
        const a = f * Math.PI * 2 * turns + offset + Math.sin(f * Math.PI * 5 + offset) * 0.22;
        const belt = R * (0.66 + 0.34 * Math.sin(f * Math.PI));
        pts.push(new THREE.Vector3(Math.cos(a) * belt, y, Math.sin(a) * belt));
      }
      out.push({
        geometry: new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(pts),
          steps,
          0.2,
          10,
          false,
        ),
        color: BLOCK_COLORS[s % BLOCK_COLORS.length],
      });
    }
    return out;
  }, [quality, strands]);

  const group = useRef<THREE.Group>(null);
  const strandMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    const g = group.current;
    if (!g) return;

    const w = applyStageVisibility(g, STAGE_INDEX.materials);
    if (w === null) return;

    g.rotation.y = t.current * 0.22;
    g.rotation.z = Math.sin(t.current * 0.15) * 0.08;
    for (const strandMat of strandMats.current) {
      strandMat.opacity = w * 0.5;
    }
  });

  return (
    <group ref={group}>
      {strandGeometries.map((strand, index) => (
        <mesh
          geometry={strand.geometry}
          key={`flow-strand-${index}`}
          rotation={[0, 0, Math.sin(index) * 0.08]}
        >
          <meshBasicMaterial
            ref={(material) => {
              if (material) strandMats.current[index] = material;
              else delete strandMats.current[index];
            }}
            color={strand.color}
            {...GLOW_MATERIAL_PROPS}
          />
        </mesh>
      ))}

    </group>
  );
}
