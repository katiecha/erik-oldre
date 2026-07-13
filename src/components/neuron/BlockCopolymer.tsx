"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./palette";
import { scrollStore, stageWeight } from "./useScrollStage";
import type { Quality } from "./NeuronJourney";

const BLOCK_COLORS = [
  COLORS.soma,
  COLORS.gfp,
  COLORS.puncta,
  COLORS.farRed,
  COLORS.tdTomato,
];

type Bead = { pos: THREE.Vector3; color: THREE.Color; scale: number };

/**
 * Stage 03 — the material. Interwoven chiral strands standing in for a
 * self-assembled block-copolymer mesophase: multiple helices twisting around a
 * common axis with a single handedness. Instanced beads across the palette
 * suggest distinct copolymer blocks. Evokes Erik's current Wiesner Group work.
 */
export function BlockCopolymer({ quality }: { quality: Quality }) {
  const beadsPerStrand = quality === "high" ? 40 : 22;
  const strands = 6;

  const beads = useMemo<Bead[]>(() => {
    const out: Bead[] = [];
    const turns = 2.4;
    const R = 1.6; // radius of the strand bundle
    for (let s = 0; s < strands; s++) {
      const offset = (s / strands) * Math.PI * 2;
      const color = BLOCK_COLORS[s % BLOCK_COLORS.length];
      for (let i = 0; i < beadsPerStrand; i++) {
        const f = i / (beadsPerStrand - 1);
        const y = THREE.MathUtils.lerp(-2.4, 2.4, f);
        // Right-handed twist → chirality.
        const a = f * Math.PI * 2 * turns + offset;
        // The bundle itself gently precesses, tightening at the waist.
        const belt = R * (0.75 + 0.25 * Math.sin(f * Math.PI));
        out.push({
          pos: new THREE.Vector3(Math.cos(a) * belt, y, Math.sin(a) * belt),
          color,
          scale: 0.13 + 0.03 * Math.sin(f * Math.PI),
        });
      }
    }
    return out;
  }, [beadsPerStrand, strands]);

  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const applied = useRef(false);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    const g = group.current;
    if (!g || !mesh.current) return;

    if (!applied.current) {
      for (let i = 0; i < beads.length; i++) {
        dummy.position.copy(beads[i].pos);
        dummy.scale.setScalar(beads[i].scale);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
        mesh.current.setColorAt(i, beads[i].color);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
      if (mesh.current.instanceColor)
        mesh.current.instanceColor.needsUpdate = true;
      applied.current = true;
    }

    const w = stageWeight(scrollStore.progress, 3);
    g.visible = w > 0.01;
    if (!g.visible) return;

    g.rotation.y = t.current * 0.22;
    g.rotation.z = Math.sin(t.current * 0.15) * 0.08;
    if (mat.current) mat.current.opacity = w;
  });

  return (
    <group ref={group}>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, beads.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial
          ref={mat}
          transparent
          opacity={0}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
