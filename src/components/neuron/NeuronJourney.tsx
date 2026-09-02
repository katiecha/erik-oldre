"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "./palette";
import { prefersReducedMotion } from "./useScrollStage";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { SpectralField } from "./SpectralField";
import { NeuronNetwork } from "./NeuronNetwork";
import { PyramidalNeuron } from "./PyramidalNeuron";
import { ProteinSolenoid } from "./ProteinSolenoid";
import { BlockCopolymer } from "./BlockCopolymer";

/** Quality tier - lets mobile render fewer instances. */
export type Quality = "high" | "low";

const CAMERA_START = { position: [0, 0, 15] as [number, number, number], fov: 50, near: 0.1, far: 100 };
const FOG_NEAR = 12;
const FOG_FAR = 30;

/**
 * The single persistent WebGL canvas behind the whole page. Fixed, full-bleed,
 * and non-interactive so the DOM content scrolls freely on top of it.
 *
 * Everything is unlit (meshBasicMaterial / shaders), so there are no lights -
 * the whole look comes from the flow-field shader plus additive glow + bloom.
 */
export function NeuronJourney() {
  // Start optimistic (animate) so SSR + first paint match; refine on mount.
  const [animate, setAnimate] = useState(true);
  const [quality, setQuality] = useState<Quality>("high");
  const [bloom, setBloom] = useState(true);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setAnimate(!prefersReducedMotion());
      // Lighter tier on small screens and lower-DPR / low-core machines.
      const small = window.innerWidth < 768;
      const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
      setQuality(small || weak ? "low" : "high");
      // Debug: ?nobloom disables post-processing.
      setBloom(!new URLSearchParams(window.location.search).has("nobloom"));
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!animate) {
    return <StaticField />;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        // Static, capped DPR - no dynamic resizing (which caused hitches).
        dpr={[1, 1.25]}
        camera={CAMERA_START}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
      >
        <color attach="background" args={[PALETTE.bg]} />
        <fog attach="fog" args={[PALETTE.bg, FOG_NEAR, FOG_FAR]} />

        <SpectralField />
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

/** Reduced-motion fallback: a calm, static spectral-field still. */
function StaticField() {
  return (
    <div
      className="field-grain pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(ellipse at 32% 28%, rgba(47,207,230,0.16), transparent 46%), radial-gradient(ellipse at 72% 62%, rgba(255,146,46,0.12), transparent 46%), radial-gradient(ellipse at 50% 92%, rgba(245,53,42,0.10), transparent 52%), #0B1E63",
      }}
    />
  );
}
