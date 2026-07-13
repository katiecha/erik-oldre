"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STAGE_INDEX } from "@/lib/content";
import { createSeededRandom } from "@/lib/prng";
import { COLORS } from "./palette";
import { applyStageVisibility, GLOW_MATERIAL_PROPS } from "./sceneUtils";

type Punctum = {
  base: THREE.Vector3;
  phase: number;
  size: number;
};

/**
 * VGLUT3+ perisomatic synaptic puncta — the glowing synaptic dots that Erik
 * literally counts in his confocal images. Distributed over the soma surface,
 * each pulses on its own phase and "ignites" as the synapse stage arrives.
 */
export function SynapticPuncta({
  count,
  radius,
}: {
  count: number;
  radius: [number, number, number];
}) {
  const puncta = useMemo<Punctum[]>(() => {
    const rand = createSeededRandom(909);
    const out: Punctum[] = [];
    for (let i = 0; i < count; i++) {
      // Fibonacci-ish sphere sampling, biased toward the perisomatic belt.
      const u = rand();
      const v = rand();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi) * 0.8,
        Math.sin(phi) * Math.sin(theta),
      );
      out.push({
        base: new THREE.Vector3(
          dir.x * radius[0],
          dir.y * radius[1],
          dir.z * radius[2],
        ),
        phase: rand() * Math.PI * 2,
        size: 0.05 + rand() * 0.06,
      });
    }
    return out;
  }, [count, radius]);

  const mesh = useRef<THREE.InstancedMesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (!mesh.current) return;

    const w = applyStageVisibility(mesh.current, STAGE_INDEX.synapse);
    if (w === null) return;

    for (let i = 0; i < puncta.length; i++) {
      const p = puncta[i];
      const pulse = 0.65 + 0.35 * Math.sin(t.current * 2.4 + p.phase);
      dummy.position.copy(p.base);
      dummy.scale.setScalar(p.size * pulse * (0.4 + 0.6 * w));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mat.current) mat.current.opacity = w;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial ref={mat} color={COLORS.puncta} {...GLOW_MATERIAL_PROPS} />
    </instancedMesh>
  );
}
