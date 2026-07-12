"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, COLORS } from "./palette";
import { scrollStore, stageWeight } from "./useScrollStage";

const REPEATS = 24; // AnkB membrane-binding domain: 24 ANK repeats

/** The coiled backbone of the ANK-repeat solenoid. */
function solenoidCurve() {
  const pts: THREE.Vector3[] = [];
  const turns = 4;
  const steps = 200;
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
 * Stage 02 — the molecule. A stylized rendering of Ankyrin B's ANK-repeat
 * solenoid (blue coil + 24 green "repeat" rungs) with the NrCAM FIGQY strand
 * (magenta) docking into a bright binding pocket (violet). Evocative of the
 * AlphaFold models in Erik's structural paper, not a literal PDB.
 */
export function ProteinSolenoid() {
  const curve = useMemo(() => solenoidCurve(), []);
  const backbone = useMemo(
    () => new THREE.TubeGeometry(curve, 200, 0.12, 8, false),
    [curve],
  );

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
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.07, 6, false);
  }, [dock]);

  // Instance transforms for the 24 repeat "rungs".
  const rungs = useMemo(() => {
    const list: { pos: THREE.Vector3; quat: THREE.Quaternion }[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < REPEATS; i++) {
      const f = (i + 0.5) / REPEATS;
      const p = curve.getPointAt(f);
      const radial = new THREE.Vector3(p.x, 0, p.z).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(up, radial);
      const pos = p.clone().add(radial.clone().multiplyScalar(0.18));
      list.push({ pos, quat });
    }
    return list;
  }, [curve]);

  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const backboneMat = useRef<THREE.MeshBasicMaterial>(null);
  const rungMat = useRef<THREE.MeshBasicMaterial>(null);
  const nrcamMat = useRef<THREE.MeshBasicMaterial>(null);
  const pocketMat = useRef<THREE.MeshBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const applied = useRef(false);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    const g = group.current;
    if (!g || !mesh.current) return;

    if (!applied.current) {
      for (let i = 0; i < REPEATS; i++) {
        dummy.position.copy(rungs[i].pos);
        dummy.quaternion.copy(rungs[i].quat);
        dummy.scale.set(1, 0.5, 1);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
      applied.current = true;
    }

    const w = stageWeight(scrollStore.progress, 2);
    g.visible = w > 0.01;
    if (!g.visible) return;

    g.rotation.y = t.current * 0.18;

    if (backboneMat.current) backboneMat.current.opacity = w * 0.85;
    if (rungMat.current) rungMat.current.opacity = w * 0.7;
    if (nrcamMat.current) nrcamMat.current.opacity = w;
    if (pocketMat.current)
      pocketMat.current.opacity = w * (0.7 + 0.3 * Math.sin(t.current * 3));
  });

  return (
    <group ref={group}>
      {/* ANK solenoid backbone */}
      <mesh geometry={backbone}>
        <meshBasicMaterial
          ref={backboneMat}
          color={PALETTE.soma}
          transparent
          opacity={0}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 24 ANK-repeat rungs */}
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, REPEATS]}
        frustumCulled={false}
      >
        <boxGeometry args={[0.5, 0.7, 0.16]} />
        <meshBasicMaterial
          ref={rungMat}
          color={PALETTE.gfp}
          transparent
          opacity={0}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>

      {/* NrCAM FIGQY strand */}
      <mesh geometry={nrcam}>
        <meshBasicMaterial
          ref={nrcamMat}
          color={PALETTE.puncta}
          transparent
          opacity={0}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Binding pocket highlight */}
      <mesh position={dock.toArray()}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          ref={pocketMat}
          color={COLORS.farRed}
          transparent
          opacity={0}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
