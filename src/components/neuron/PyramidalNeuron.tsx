"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "./palette";
import { scrollStore, stageWeight } from "./useScrollStage";
import { SynapticPuncta } from "./SynapticPuncta";
import type { Quality } from "./NeuronJourney";

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function tube(points: THREE.Vector3[], radius: number, seg = 40) {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, seg, radius, 6, false);
}

/** A basket-cell axon winding around the soma as a helix (the "basket"). */
function basketGeometry() {
  const pts: THREE.Vector3[] = [];
  const turns = 3.2;
  const steps = 160;
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const a = f * Math.PI * 2 * turns;
    const y = THREE.MathUtils.lerp(-1.15, 1.05, f);
    // radius bulges around the soma's midriff
    const belt = 1.05 + 0.28 * Math.sin(f * Math.PI);
    const wobble = 0.08 * Math.sin(a * 2.3);
    pts.push(
      V(Math.cos(a) * (belt + wobble), y, Math.sin(a) * (belt + wobble)),
    );
  }
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(pts),
    220,
    0.035,
    6,
    false,
  );
}

/**
 * Stage 01 — the synapse. A pyramidal neuron (blue soma + apical / basal
 * dendrites) embraced by a CCK basket-cell axon (green), with VGLUT3 puncta
 * (magenta) glowing at perisomatic contacts. Faithful to Erik's confocal work.
 */
export function PyramidalNeuron({ quality }: { quality: Quality }) {
  const somaMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(PALETTE.soma),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  const dendriteMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(PALETTE.soma),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  const basketMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(PALETTE.gfp),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  const dendrites = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    // Apical trunk rising from the soma apex, with two branches.
    geos.push(
      tube([V(0, 1.0, 0), V(0.1, 2.4, 0.15), V(-0.1, 3.8, -0.1), V(0.05, 4.9, 0.1)], 0.06),
    );
    geos.push(tube([V(0, 3.6, 0), V(0.7, 4.4, 0.2), V(1.15, 5.0, 0.35)], 0.035));
    geos.push(tube([V(0, 3.9, 0), V(-0.6, 4.6, -0.15), V(-1.0, 5.3, -0.3)], 0.035));
    // Basal dendrites splaying from the base.
    const basal = [
      [V(-0.6, -1.0, 0.2), V(-1.6, -1.8, 0.5), V(-2.4, -2.2, 0.7)],
      [V(0.6, -1.0, -0.2), V(1.7, -1.7, -0.4), V(2.5, -2.1, -0.6)],
      [V(0.1, -1.1, 0.6), V(0.3, -2.0, 1.5), V(0.5, -2.4, 2.3)],
      [V(-0.2, -1.1, -0.5), V(-0.4, -2.0, -1.4), V(-0.6, -2.5, -2.1)],
    ];
    basal.forEach((p) => geos.push(tube(p, 0.045)));
    return geos;
  }, []);

  const basket = useMemo(() => basketGeometry(), []);

  const group = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    const g = group.current;
    if (!g) return;

    const w = stageWeight(scrollStore.progress, 1);
    g.visible = w > 0.01;
    if (!g.visible) return;

    g.rotation.y = Math.sin(t.current * 0.12) * 0.35 + t.current * 0.06;

    somaMat.opacity = w * 0.42;
    dendriteMat.opacity = w * 0.6;
    basketMat.opacity = w * 0.85;
  });

  return (
    <group ref={group}>
      {/* Soma — pyramidal cell body */}
      <mesh material={somaMat}>
        <coneGeometry args={[0.95, 2.2, 32]} />
      </mesh>

      {/* Dendrites */}
      {dendrites.map((geo, i) => (
        <mesh key={i} geometry={geo} material={dendriteMat} />
      ))}

      {/* Basket-cell axon wrapping the soma */}
      <mesh geometry={basket} material={basketMat} />

      {/* Perisomatic synaptic puncta */}
      <SynapticPuncta
        count={quality === "high" ? 96 : 44}
        radius={[1.05, 1.15, 1.05]}
      />
    </group>
  );
}
