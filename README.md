# Erik Oldre - Personal Site

**🔗 Live site: https://katiecha.github.io/erik-oldre/**

A single-page, immersive portfolio for **Erik Oldre**, NSF Graduate Research Fellow
and Ph.D. student in Materials Science & Engineering at Cornell (Wiesner Group).

The site *artfully depicts neurons*, grounded in Erik's real science. A single WebGL
canvas plays a cinematic scroll journey through scales:

1. **Hero** - a glowing cortical neuron network
2. **The Synapse** - a pyramidal neuron wrapped by a CCK basket cell, studded with
   VGLUT3 synaptic puncta (his first-author *Current Research in Neurobiology* paper)
3. **The Molecule** - the Ankyrin B ANK-repeat solenoid docking the NrCAM FIGQY motif
   (his *Journal of Biological Chemistry* paper)
4. **The Material** - a chiral block-copolymer mesophase (his current Wiesner Group work)
5. **The Scientist** - bio, research history, publications, and contact

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- React Three Fiber, drei, `@react-three/postprocessing` (Bloom + Vignette)
- framer-motion for scroll reveals

## Architecture

- One persistent `<Canvas>` (`components/neuron/NeuronJourney.tsx`) fixed behind the DOM,
  with a capped DPR (`[1, 1.25]`) and scene fog so structures dissolve into the field.
- `components/neuron/SpectralField.tsx` draws a full-screen shader quad behind every
  structure - domain-warped fractal noise on a navy base with sparse hot filaments - so
  the scene reads as one flowing field rather than separate glowing objects.
- `components/neuron/useScrollStage.ts` holds a module-level `scrollStore`; the DOM writes
  scroll progress (derived from the `[data-stage]` section centers) and the scene reads it
  every frame - no React re-renders on scroll.
- Each stage component fades/animates itself from its `stageWeight`; `CameraRig` blends the
  camera distance across stages.
- Palette (`components/neuron/palette.ts`) is a "jet" spectral ramp on a deep royal-blue
  field (blue → cyan → yellow → orange → red), echoing the momentum-space plots of
  quantum materials. The key names (`gfp`, `tdTomato`, `farRed`) are leftovers from the
  earlier fluorophore palette; only the on-page `ChannelLegend` still labels real
  fluorophores (from `lib/content.ts`).
- Quality tiers: `NeuronJourney` drops to a `"low"` instance count on small screens
  (< 768px) or low-core machines (`hardwareConcurrency <= 4`).
- Reduced motion / SSR renders a static gradient field instead of the canvas.
- `?nobloom` disables post-processing (debug aid for headless rendering).

## Develop

```bash
pnpm install
pnpm dev      # always http://localhost:3002 - stays up, Ctrl+C stops cleanly
pnpm build    # static export to out/
pnpm lint
```

`pnpm dev` (or `npm run dev`) runs `scripts/dev.mjs`, which:

- **always uses port 3002** so the local URL never changes (override with `PORT=3003 pnpm dev`). If a stale copy of *this* project is still holding 3002, it reclaims the port; if another project has it, it tells you instead of stomping on it;
- **keeps the preview up** - restarts the dev server if it crashes;
- **shuts down cleanly** on Ctrl+C, killing the whole process tree and freeing the port (no orphaned node processes).

Use `pnpm dev:next` for the plain `next dev` if you ever want it.

Deploy target: **GitHub Pages** - `.github/workflows/deploy.yml` auto-deploys on push to
`katiecha/neuron-phd-portfolio-site`. The build is a static export (`output: "export"`);
`GITHUB_PAGES=true` adds the `/erik-oldre` basePath + asset prefix for the project site,
so a plain local `pnpm build` stays path-free.

## TODO (confirm with Erik)

- Preferred title: "Ph.D. student" vs "candidate" vs "researcher" (see `lib/content.ts`).
- Whether to add a personal statement / artist note, or any of his own microscopy images.
- Final domain. `siteUrl` in `app/layout.tsx` is set to `https://erikoldre.com` for
  metadata, but the site is actually served from GitHub Pages - point one at the other
  once the domain is decided.
