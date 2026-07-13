"use client";

import { useScrollDriver } from "@/components/neuron/useScrollStage";

/** Installs the scroll/pointer listeners that drive the 3D scene. */
export function ScrollDriver() {
  useScrollDriver();
  return null;
}
