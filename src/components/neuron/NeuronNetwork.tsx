"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STAGE_INDEX } from "@/lib/content";
import { createSeededRandom } from "@/lib/prng";
import { COLORS } from "./palette";
import { scrollStore, stageWeight } from "./useScrollStage";
import { GLOW_MATERIAL_PROPS, useRunOnce } from "./sceneUtils";
import type { Quality } from "./NeuronJourney";

const NODE_COLORS = [COLORS.soma, COLORS.puncta, COLORS.gfp, COLORS.farRed];

type NetworkData = {
  positions: THREE.Vector3[];
  phases: number[];
  colorIdx: number[];
  lineGeometry: THREE.BufferGeometry;
};

function buildNetwork(count: number): NetworkData {
  const rand = createSeededRandom(1337);

  const positions: THREE.Vector3[] = [];
  const phases: number[] = [];
  const colorIdx: number[] = [];

  for (let i = 0; i < count; i++) {
    // Flattened ellipsoidal cloud — reads as a cortical field.
    const r = 3 + rand() * 5;
    const theta = rand() * Math.PI * 2;
    const y = (rand() - 0.5) * 7;
    positions.push(
      new THREE.Vector3(
        Math.cos(theta) * r,
        y,
        (rand() - 0.5) * 4 + Math.sin(theta) * r * 0.25,
      ),
    );
    phases.push(rand() * Math.PI * 2);
    colorIdx.push(Math.floor(rand() * NODE_COLORS.length));
  }

  // Connect each node to its 2 nearest neighbours → sparse "processes".
  const lineVerts: number[] = [];
  const lineCols: number[] = [];
  for (let i = 0; i < count; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      dists.push({ j, d: positions[i].distanceTo(positions[j]) });
    }
    dists.sort((a, b) => a.d - b.d);
    const links = Math.min(2, dists.length);
    for (let k = 0; k < links; k++) {
      const j = dists[k].j;
      if (j < i) continue; // avoid duplicate edges
      const a = positions[i];
      const b = positions[j];
      lineVerts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      const c = NODE_COLORS[colorIdx[i]];
      lineCols.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineVerts, 3),
  );
  lineGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(lineCols, 3),
  );

  return { positions, phases, colorIdx, lineGeometry };
}

/**
 * Hero + closing "cortical field": a sparse network of glowing neuron soma
 * connected by faint processes. Also softly re-echoed on the final (About)
 * stage. Instanced for a single draw call.
 */
export function NeuronNetwork({ quality }: { quality: Quality }) {
  const count = quality === "high" ? 44 : 24;
  const data = useMemo(() => buildNetwork(count), [count]);

  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const nodeMat = useRef<THREE.MeshBasicMaterial>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const t = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const runOnce = useRunOnce();

  useFrame((_, delta) => {
    t.current += delta;
    const g = group.current;
    const m = mesh.current;
    if (!g || !m) return;

    runOnce(() => {
      for (let i = 0; i < count; i++) {
        dummy.position.copy(data.positions[i]);
        const s = 0.14 + (i % 3) * 0.04;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        m.setColorAt(i, NODE_COLORS[data.colorIdx[i]]);
      }
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    });

    // Weight: full on the hero, a soft echo behind the About stage.
    const w = Math.min(
      1,
      stageWeight(scrollStore.progress, STAGE_INDEX.hero) +
        0.4 * stageWeight(scrollStore.progress, STAGE_INDEX.about),
    );
    g.visible = w > 0.01;
    if (!g.visible) return;

    g.rotation.y += delta * 0.03;
    g.rotation.x = Math.sin(t.current * 0.05) * 0.06;

    if (nodeMat.current) nodeMat.current.opacity = w * 0.26;
    if (lineMat.current) lineMat.current.opacity = w * 0.46;
  });

  return (
    <group ref={group}>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial ref={nodeMat} {...GLOW_MATERIAL_PROPS} />
      </instancedMesh>

      <lineSegments geometry={data.lineGeometry}>
        <lineBasicMaterial ref={lineMat} vertexColors {...GLOW_MATERIAL_PROPS} />
      </lineSegments>
    </group>
  );
}
