"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "./palette";

/**
 * A full-screen, animated spectral flow field - domain-warped fractal noise
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
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // royal-blue → blue → cyan base (the blue end of a jet colormap).
  vec3 blueField(float x) {
    x = clamp(x, 0.0, 1.0);
    vec3 col = mix(cNavy, cBlue, smoothstep(0.0, 0.58, x));
    col = mix(col, cCyan, smoothstep(0.6, 1.0, x));
    return col;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;
    float t = uTime * 0.04;

    vec2 p = uv * 1.12;
    // single-step domain warp - cheaper than two steps, still smooth/flowing
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.1, 1.7) - t));
    float f = fbm(p + 2.4 * q);

    // Lifted floor + a touch of blue so low-density areas stay clearly blue
    // (never a near-black blob).
    vec3 col = blueField(f) * 0.74 + cBlue * 0.08;

    vec2 flowUv = uv + (q - 0.5) * 0.42;
    float riverA = smoothstep(0.52, 0.0, abs((flowUv.y - 0.54) + 0.2 * sin(flowUv.x * 1.8 + t * 2.2)));
    float riverB = smoothstep(0.44, 0.0, abs((flowUv.y - 0.42) - 0.22 * cos(flowUv.x * 1.55 - t * 1.3)));
    float riverC = smoothstep(0.38, 0.0, abs((flowUv.x - uAspect * 0.48) + 0.16 * sin(flowUv.y * 2.6 + t * 1.6)));
    vec3 coolFlow = mix(cBlue, cCyan, 0.72);
    col += coolFlow * (riverA * 0.34 + riverB * 0.28 + riverC * 0.2);

    // Broad spectral response bands, closer to light dispersion than texture.
    float bandA = smoothstep(0.46, 0.0, abs((uv.y - 0.5) + 0.18 * sin(uv.x * 1.9 + t * 1.65)));
    float bandB = smoothstep(0.36, 0.0, abs((uv.y - 0.43) - 0.22 * cos(uv.x * 1.65 - t)));
    float bandC = smoothstep(0.32, 0.0, abs((uv.y - 0.62) + 0.12 * sin(uv.x * 2.2 - t * 1.1)));
    col = mix(col, cOrange * 0.68 + cRed * 0.16 + cYellow * 0.16, (bandA + bandB + bandC) * 0.09);

    // Soft hot filaments - cyan → yellow → orange → red, reusing the field value.
    float bloom = smoothstep(0.56, 0.9, f);
    vec3 hot = mix(cYellow, cRed, smoothstep(0.4, 0.9, f));
    hot = mix(hot, cOrange, 0.3);
    col += bloom * hot * 0.16;

    // faint vignette so the corners settle into deep blue.
    float vignette = smoothstep(0.96, 0.25, distance(vUv, vec2(0.5)));
    col *= 0.78 + 0.22 * vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function SpectralField() {
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      cNavy: { value: new THREE.Color(PALETTE.bg) },
      cBlue: { value: new THREE.Color("#2B5FC9") },
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
