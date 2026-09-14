"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE, FIELD } from "./palette";

/**
 * A full-screen, animated spectral flow field - domain-warped fractal noise
 * mapped to a black→violet→magenta base with sparse hot (red→orange→amber)
 * filaments, echoing the momentum-space spectral plots of quantum materials.
 * It sits behind every structure so the scene reads as one flowing field
 * rather than separate glowing objects.
 *
 * The whole ramp is deliberately dark. White body copy sits directly on this,
 * so uMaxLuma clamps how bright any pixel is allowed to get - without it the
 * warp occasionally piles up into a pale wash that swallows the type.
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
  uniform float uMaxLuma;
  uniform vec3 cBase, cDeep, cViolet, cMagenta, cRed, cOrange, cAmber;

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

  float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  // black → deep indigo → violet → magenta: the cool half of the spectral map.
  vec3 coolRamp(float x) {
    x = clamp(x, 0.0, 1.0);
    vec3 col = mix(cBase, cDeep, smoothstep(0.0, 0.40, x));
    col = mix(col, cViolet, smoothstep(0.36, 0.78, x));
    col = mix(col, cMagenta, smoothstep(0.74, 1.0, x));
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

    vec3 col = coolRamp(f);

    // Flowing violet rivers, kept low so they read as depth, not as light.
    vec2 flowUv = uv + (q - 0.5) * 0.42;
    float riverA = smoothstep(0.52, 0.0, abs((flowUv.y - 0.54) + 0.2 * sin(flowUv.x * 1.8 + t * 2.2)));
    float riverB = smoothstep(0.44, 0.0, abs((flowUv.y - 0.42) - 0.22 * cos(flowUv.x * 1.55 - t * 1.3)));
    float riverC = smoothstep(0.38, 0.0, abs((flowUv.x - uAspect * 0.48) + 0.16 * sin(flowUv.y * 2.6 + t * 1.6)));
    col += cViolet * (riverA * 0.30 + riverB * 0.24 + riverC * 0.16);

    // Broad spectral response bands - the warm half, still well under the type.
    float bandA = smoothstep(0.46, 0.0, abs((uv.y - 0.5) + 0.18 * sin(uv.x * 1.9 + t * 1.65)));
    float bandB = smoothstep(0.36, 0.0, abs((uv.y - 0.43) - 0.22 * cos(uv.x * 1.65 - t)));
    float bandC = smoothstep(0.32, 0.0, abs((uv.y - 0.62) + 0.12 * sin(uv.x * 2.2 - t * 1.1)));
    col += (cRed * 0.6 + cOrange * 0.4) * (bandA + bandB + bandC) * 0.07;

    // Sparse hot filaments at the very top of the ramp - red → orange → amber.
    float bloom = smoothstep(0.68, 0.94, f);
    vec3 hot = mix(cRed, cOrange, smoothstep(0.62, 0.88, f));
    hot = mix(hot, cAmber, smoothstep(0.84, 1.0, f));
    col += bloom * hot * 0.22;

    // A gentle falloff, not a black frame - the corners should still read as
    // field rather than as an edge of the page.
    float vignette = smoothstep(1.25, 0.30, distance(vUv, vec2(0.5)));
    col *= 0.66 + 0.34 * vignette;

    // Hard ceiling on brightness so type never loses its ground.
    float l = luma(col);
    col *= l > uMaxLuma ? uMaxLuma / l : 1.0;

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
      uMaxLuma: { value: 0.055 },
      cBase: { value: new THREE.Color(PALETTE.bg) },
      cDeep: { value: new THREE.Color(FIELD.deep) },
      cViolet: { value: new THREE.Color(FIELD.violet) },
      cMagenta: { value: new THREE.Color(FIELD.magenta) },
      cRed: { value: new THREE.Color(PALETTE.puncta) },
      cOrange: { value: new THREE.Color(PALETTE.farRed) },
      cAmber: { value: new THREE.Color(PALETTE.gfp) },
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
