"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./palette";
import { scrollStore } from "./useScrollStage";
import type { Quality } from "./NeuronJourney";

type Current = {
  geometry: THREE.TubeGeometry;
  color: THREE.Color;
  opacity: number;
  phase: number;
  speed: number;
  radius: number;
};

const currentVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const currentFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPhase;
  // spectral ramp (cyan → green → yellow → orange → red) for prismatic dispersion
  uniform vec3 uC0, uC1, uC2, uC3, uC4;

  vec3 spectral(float s) {
    float x = clamp(s, 0.0, 1.0) * 4.0;
    vec3 c = uC0;
    c = mix(c, uC1, smoothstep(0.0, 1.0, x));
    c = mix(c, uC2, smoothstep(1.0, 2.0, x));
    c = mix(c, uC3, smoothstep(2.0, 3.0, x));
    c = mix(c, uC4, smoothstep(3.0, 4.0, x));
    return c;
  }

  void main() {
    float stream = sin((vUv.x * 7.0) - uTime * 1.5 + uPhase);
    stream = smoothstep(-0.35, 1.0, stream);
    float breath = 0.62 + 0.38 * sin(uTime * 0.45 + uPhase);
    float edge = smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.78, vUv.y);
    // light slowly disperses along the ribbon like a prism
    float s = fract(vUv.x * 0.6 + uTime * 0.05 + uPhase * 0.12);
    vec3 spec = mix(spectral(s), uColor, 0.28);
    vec3 color = mix(spec * 0.5, spec, stream);
    gl_FragColor = vec4(color, uOpacity * edge * breath * (0.45 + stream * 0.55));
  }
`;

function makeCurrent(index: number): Current {
  const points: THREE.Vector3[] = [];
  const phase = index * 1.7;
  const span = 7.5 + index * 0.6;
  const vertical = index % 2 === 0 ? 1 : -1;

  const steps = 88;
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const x = THREE.MathUtils.lerp(-span, span, f);
    const y =
      Math.sin(f * Math.PI * (1.4 + index * 0.18) + phase) * (1.2 + index * 0.22) +
      vertical * THREE.MathUtils.lerp(-1.4, 1.4, f);
    const z =
      Math.cos(f * Math.PI * (2.0 + index * 0.2) + phase) * 1.4 -
      1.2 +
      index * 0.35;
    points.push(new THREE.Vector3(x, y, z));
  }

  const palette = [COLORS.soma, COLORS.tdTomato, COLORS.gfp, COLORS.farRed, COLORS.puncta];

  return {
    geometry: new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      steps,
      0.34 + index * 0.05,
      8,
      false,
    ),
    color: palette[index % palette.length],
    opacity: 0.13 + index * 0.02,
    phase,
    speed: 0.08 + index * 0.018,
    radius: 1 + index * 0.025,
  };
}

export function LightCurrents({ quality }: { quality: Quality }) {
  const count = quality === "high" ? 4 : 3;
  const currents = useMemo(() => Array.from({ length: count }, (_, i) => makeCurrent(i)), [count]);
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.ShaderMaterial[]>([]);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (!group.current) return;

    const p = scrollStore.progress;
    group.current.rotation.y = Math.sin(t.current * 0.06) * 0.18 + p * 0.9;
    group.current.rotation.z = Math.sin(t.current * 0.045 + p * 3.0) * 0.12;
    group.current.position.y = Math.sin(t.current * 0.08) * 0.28;

    for (let i = 0; i < group.current.children.length; i++) {
      const child = group.current.children[i];
      const current = currents[i];
      const pulse = 0.72 + 0.28 * Math.sin(t.current * current.speed + current.phase + p * 5.0);
      child.scale.setScalar(current.radius * (0.92 + pulse * 0.12));
      child.rotation.x = Math.sin(t.current * 0.05 + current.phase) * 0.18;
      const mat = mats.current[i];
      if (mat) {
        mat.uniforms.uTime.value = t.current;
        mat.uniforms.uOpacity.value = current.opacity * pulse;
      }
    }
  });

  return (
    <group ref={group} position={[0, 0, -2.5]} renderOrder={-0.5}>
      {currents.map((current, index) => (
        <mesh geometry={current.geometry} key={`light-current-${index}`}>
          <shaderMaterial
            ref={(material) => {
              if (material) mats.current[index] = material;
              else delete mats.current[index];
            }}
            vertexShader={currentVertexShader}
            fragmentShader={currentFragmentShader}
            uniforms={{
              uColor: { value: current.color },
              uTime: { value: 0 },
              uOpacity: { value: 0 },
              uPhase: { value: current.phase },
              uC0: { value: COLORS.soma },
              uC1: { value: COLORS.tdTomato },
              uC2: { value: COLORS.gfp },
              uC3: { value: COLORS.farRed },
              uC4: { value: COLORS.puncta },
            }}
            transparent
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
