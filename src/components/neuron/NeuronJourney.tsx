"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "./palette";
import { prefersReducedMotion } from "./useScrollStage";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { NeuronNetwork } from "./NeuronNetwork";
import { PyramidalNeuron } from "./PyramidalNeuron";
import { ProteinSolenoid } from "./ProteinSolenoid";
import { BlockCopolymer } from "./BlockCopolymer";

/** Quality tier — lets mobile render fewer instances. */
export type Quality = "high" | "low";

/**
 * The single persistent WebGL canvas behind the whole page. Fixed, full-bleed,
 * and non-interactive so the DOM content scrolls freely on top of it.
 */
export function NeuronJourney() {
  // Start optimistic (animate) so SSR + first paint match; refine on mount.
  const [animate, setAnimate] = useState(true);
  const [quality, setQuality] = useState<Quality>("high");
  const [bloom, setBloom] = useState(true);

  useEffect(() => {
    setAnimate(!prefersReducedMotion());
    setQuality(window.innerWidth < 768 ? "low" : "high");
    // Debug: ?nobloom disables post-processing (used to isolate headless issues).
    setBloom(!new URLSearchParams(window.location.search).has("nobloom"));
  }, []);

  if (!animate) {
    return <StaticField />;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 15], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
      >
        <color attach="background" args={[PALETTE.bg]} />
        <fog attach="fog" args={[PALETTE.bg, 12, 30]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[6, 8, 10]} intensity={40} color="#88aaff" />
        <pointLight position={[-8, -4, 6]} intensity={22} color={PALETTE.gfp} />

        <CameraRig />

        <NeuronNetwork quality={quality} />
        <PyramidalNeuron quality={quality} />
        <ProteinSolenoid />
        <BlockCopolymer quality={quality} />

        {bloom && <Effects />}
      </Canvas>
    </div>
  );
}

/** Reduced-motion fallback: a calm, static microscopy-style field. */
function StaticField() {
  return (
    <div
      className="field-grain pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(ellipse at 30% 25%, rgba(59,130,246,0.16), transparent 45%), radial-gradient(ellipse at 72% 60%, rgba(45,212,191,0.12), transparent 45%), radial-gradient(ellipse at 50% 90%, rgba(52,211,153,0.12), transparent 50%), #060A0F",
      }}
    />
  );
}
