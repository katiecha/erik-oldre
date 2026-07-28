"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STAGE_INDEX } from "@/lib/content";
import { PALETTE, COLORS } from "./palette";
import { applyStageVisibility, GLOW_MATERIAL_PROPS } from "./sceneUtils";

/** The coiled backbone of the ANK-repeat solenoid. */
function solenoidCurve() {
  const pts: THREE.Vector3[] = [];
  const turns = 4;
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const a = f * Math.PI * 2 * turns;
    const y = THREE.MathUtils.lerp(-1.7, 1.7, f);
    const r = 1.15;
    pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
  }
  return new THREE.CatmullRomCurve3(pts);
}

/**
 * Stage 02 — the molecule as flowing light: a translucent solenoid ribbon with
 * a faint docking strand, evocative of structure without becoming a separate
 * object pasted over the field.
 */
export function ProteinSolenoid() {
  const curve = useMemo(() => solenoidCurve(), []);
  const backbone = useMemo(
    () => new THREE.TubeGeometry(curve, 120, 0.16, 8, false),
    [curve],
  );

  const fieldRibbon = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 2.2;
    const steps = 112;
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const a = f * Math.PI * 2 * turns + Math.sin(f * Math.PI * 4) * 0.5;
      const y = THREE.MathUtils.lerp(-2.3, 2.3, f);
      const r = 1.85 + 0.3 * Math.sin(f * Math.PI * 3);
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), steps, 0.34, 10, false);
  }, []);

  // NrCAM FIGQY strand docking at ~ANK repeat R11 (≈ 45% up the coil).
  const dock = useMemo(() => curve.getPointAt(0.46), [curve]);
  const nrcam = useMemo(() => {
    const base = dock.clone();
    const out = base.clone().normalize();
    const pts = [
      base.clone().add(out.clone().multiplyScalar(2.6)).add(new THREE.Vector3(0.4, 0.6, 0)),
      base.clone().add(out.clone().multiplyScalar(1.6)).add(new THREE.Vector3(-0.2, 0.2, 0.3)),
      base.clone().add(out.clone().multiplyScalar(0.8)),
      base.clone().add(out.clone().multiplyScalar(0.35)),
    ];
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 36, 0.07, 6, false);
  }, [dock]);

  const group = useRef<THREE.Group>(null);
  const backboneMat = useRef<THREE.MeshBasicMaterial>(null);
  const ribbonMat = useRef<THREE.MeshBasicMaterial>(null);
  const nrcamMat = useRef<THREE.MeshBasicMaterial>(null);
  const pocketMat = useRef<THREE.MeshBasicMaterial>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    const g = group.current;
    if (!g) return;

    const w = applyStageVisibility(g, STAGE_INDEX.molecule);
    if (w === null) return;

    g.rotation.y = t.current * 0.12;
    g.rotation.z = Math.sin(t.current * 0.16) * 0.12;

    if (ribbonMat.current) ribbonMat.current.opacity = w * 0.52;
    if (backboneMat.current) backboneMat.current.opacity = w * 0.16;
    if (nrcamMat.current) nrcamMat.current.opacity = w * 0.12;
    if (pocketMat.current)
      pocketMat.current.opacity = w * (0.22 + 0.12 * Math.sin(t.current * 3));
  });

  return (
    <group ref={group}>
      <mesh geometry={fieldRibbon}>
        <meshBasicMaterial ref={ribbonMat} color={COLORS.soma} {...GLOW_MATERIAL_PROPS} />
      </mesh>

      {/* ANK solenoid backbone */}
      <mesh geometry={backbone}>
        <meshBasicMaterial ref={backboneMat} color={PALETTE.soma} {...GLOW_MATERIAL_PROPS} />
      </mesh>

      {/* NrCAM FIGQY strand */}
      <mesh geometry={nrcam}>
        <meshBasicMaterial ref={nrcamMat} color={PALETTE.puncta} {...GLOW_MATERIAL_PROPS} />
      </mesh>

      {/* Binding pocket highlight */}
      <mesh position={dock.toArray()}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshBasicMaterial ref={pocketMat} color={COLORS.farRed} {...GLOW_MATERIAL_PROPS} />
      </mesh>
    </group>
  );
}
