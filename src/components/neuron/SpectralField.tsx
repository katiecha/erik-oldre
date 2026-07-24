"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "./palette";

/**
 * A full-screen, animated spectral flow field — domain-warped fractal noise
 * mapped to a navy→cyan base with sparse hot (yellow→orange→red) filaments,
 * echoing the momentum-space spectral plots of quantum materials. It sits
 * behind every structure so the scene reads as one flowing field rather than
 * separate glowing objects.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec3 cNavy, cBlue, cCyan, cYellow, cOrange, cRed;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // navy → blue → cyan base (kept fairly dim)
  vec3 blueField(float x) {
    x = clamp(x, 0.0, 1.0);
    vec3 col = mix(cNavy, cBlue, smoothstep(0.0, 0.55, x));
    col = mix(col, cCyan, smoothstep(0.55, 1.0, x));
    return col;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;
    float t = uTime * 0.04;

    vec2 p = uv * 3.0;
    // two-step domain warp for smooth, organic flow
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.1, 1.7) - t));
    vec2 r = vec2(
      fbm(p + 2.0 * q + vec2(1.7, 9.2) + 0.5 * t),
      fbm(p + 2.0 * q + vec2(8.3, 2.8) - 0.3 * t)
    );
    float f = fbm(p + 2.0 * r);

    vec3 col = blueField(f) * 0.85;

    // sparse hot filaments — thin bright iso-lines in the higher-density regions
    float g = fbm(p * 1.15 + 3.0 * r - t * 0.5);
    float band = abs(fract(g * 3.0) - 0.5);
    float line = smoothstep(0.055, 0.0, band);
    vec3 hot = mix(cYellow, cRed, smoothstep(0.4, 0.9, f));
    hot = mix(hot, cOrange, 0.3);
    col += line * hot * smoothstep(0.32, 0.8, f) * 0.9;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function SpectralField() {
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: size.width / size.height },
      cNavy: { value: new THREE.Color(PALETTE.bg) },
      cBlue: { value: new THREE.Color("#1E3AA8") },
      cCyan: { value: new THREE.Color(PALETTE.soma) },
      cYellow: { value: new THREE.Color(PALETTE.gfp) },
      cOrange: { value: new THREE.Color(PALETTE.farRed) },
      cRed: { value: new THREE.Color(PALETTE.puncta) },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += delta;
    matRef.current.uniforms.uAspect.value = size.width / size.height;
  });

  return (
    <ScreenQuad renderOrder={-1}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </ScreenQuad>
  );
}
