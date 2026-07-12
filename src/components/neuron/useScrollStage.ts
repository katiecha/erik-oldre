"use client";

import { useEffect } from "react";

/**
 * A module-level scroll store. The DOM layer writes normalized scroll progress
 * (0 → 1 over the whole document) here; the 3D scene reads it every frame.
 * Using a plain mutable object avoids React re-renders on scroll.
 */
export const scrollStore = {
  /** normalized document scroll, 0 at top → 1 at bottom */
  progress: 0,
  /** pointer position in NDC-ish range (-1 → 1), for parallax */
  pointerX: 0,
  pointerY: 0,
};

export const STAGE_COUNT = 5;

/** Center of each stage along the 0→1 scroll axis: 0, .25, .5, .75, 1. */
export function stageCenter(index: number): number {
  return index / (STAGE_COUNT - 1);
}

/** Smootherstep easing (Ken Perlin). */
export function smootherstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * A crossfade weight for stage `index` given global progress.
 * Peaks at 1 at the stage center and falls to 0 at the neighbouring centers,
 * so adjacent stages linearly hand off to each other.
 */
export function stageWeight(progress: number, index: number): number {
  const halfWidth = 1 / (STAGE_COUNT - 1);
  const dist = Math.abs(progress - stageCenter(index));
  if (dist >= halfWidth) return 0;
  return smootherstep(0, 1, 1 - dist / halfWidth);
}

/**
 * Installs passive scroll + pointer listeners that feed {@link scrollStore}.
 * Mount once, near the root of the DOM layer.
 */
export function useScrollDriver() {
  useEffect(() => {
    let raf = 0;

    const readScroll = () => {
      // Derive stage progress from the actual [data-stage] sections so the 3D
      // visual always lines up with the text describing it, regardless of how
      // tall each section is. progress runs 0 → 1 across the 5 stage centers.
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-stage]"),
      );
      if (els.length < 2) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollStore.progress = max > 0 ? window.scrollY / max : 0;
        return;
      }

      const scrollY = window.scrollY;
      const vc = scrollY + window.innerHeight / 2;
      const centers = els.map((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top + scrollY + rect.height / 2;
      });

      const last = centers.length - 1;
      let idx: number;
      if (vc <= centers[0]) idx = 0;
      else if (vc >= centers[last]) idx = last;
      else {
        let k = 0;
        while (k < last && vc > centers[k + 1]) k++;
        const span = centers[k + 1] - centers[k] || 1;
        idx = k + (vc - centers[k]) / span;
      }
      scrollStore.progress = idx / last;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(readScroll);
    };

    const onPointer = (e: PointerEvent) => {
      scrollStore.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    readScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);
}

/** SSR-safe reduced-motion check. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
