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
  uniform vec3 cNavy, cBlue, cPurple, cCyan, cYellow, cOrange, cRed;

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
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // navy → blue/purple → cyan base, tuned as soft optical density.
  vec3 blueField(float x) {
    x = clamp(x, 0.0, 1.0);
    vec3 col = mix(cNavy, cBlue, smoothstep(0.0, 0.55, x));
    col = mix(col, cPurple, smoothstep(0.34, 0.68, x) * 0.55);
    col = mix(col, cCyan, smoothstep(0.64, 1.0, x));
    return col;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;
    float t = uTime * 0.04;

    vec2 p = uv * 1.12;
    // two-step domain warp for smooth, organic flow
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.1, 1.7) - t));
    vec2 r = vec2(
      fbm(p + 2.0 * q + vec2(1.7, 9.2) + 0.5 * t),
      fbm(p + 2.0 * q + vec2(8.3, 2.8) - 0.3 * t)
    );
    float f = fbm(p + 2.6 * r);

    vec3 col = blueField(f) * 0.62;

    vec2 flowUv = uv + (r - 0.5) * 0.42;
    float riverA = smoothstep(0.52, 0.0, abs((flowUv.y - 0.54) + 0.2 * sin(flowUv.x * 1.8 + t * 2.2)));
    float riverB = smoothstep(0.44, 0.0, abs((flowUv.y - 0.42) - 0.22 * cos(flowUv.x * 1.55 - t * 1.3)));
    float riverC = smoothstep(0.38, 0.0, abs((flowUv.x - uAspect * 0.48) + 0.16 * sin(flowUv.y * 2.6 + t * 1.6)));
    vec3 coolFlow = mix(cBlue, cCyan, 0.72);
    col += coolFlow * (riverA * 0.4 + riverB * 0.34 + riverC * 0.24);

    // Broad spectral response bands, closer to light dispersion than texture.
    float bandA = smoothstep(0.46, 0.0, abs((uv.y - 0.5) + 0.18 * sin(uv.x * 1.9 + t * 1.65)));
    float bandB = smoothstep(0.36, 0.0, abs((uv.y - 0.43) - 0.22 * cos(uv.x * 1.65 - t)));
    float bandC = smoothstep(0.32, 0.0, abs((uv.y - 0.62) + 0.12 * sin(uv.x * 2.2 - t * 1.1)));
    col = mix(col, cOrange * 0.68 + cRed * 0.16 + cYellow * 0.16, (bandA + bandB + bandC) * 0.09);

    // Soft hot density blooms. Keep these broad so the field reads as flow,
    // not as contour-map squiggles.
    float g = fbm(p * 1.05 + 2.4 * r - t * 0.5);
    float bloom = smoothstep(0.62, 0.92, g) * smoothstep(0.26, 0.86, f);
    vec3 hot = mix(cYellow, cRed, smoothstep(0.4, 0.9, f));
    hot = mix(hot, cOrange, 0.3);
    col += bloom * hot * 0.12;

    // faint paper-figure vignette, so white text can sit directly in the field.
    float vignette = smoothstep(0.96, 0.25, distance(vUv, vec2(0.5)));
    col *= 0.72 + 0.28 * vignette;

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
      cBlue: { value: new THREE.Color("#1E3AA8") },
      cPurple: { value: new THREE.Color("#7200D7") },
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
