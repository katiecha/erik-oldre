# Erik Oldre — Personal Site

**🔗 Live site: https://katiecha.github.io/erik-oldre/**

A single-page, immersive portfolio for **Erik Oldre**, NSF Graduate Research Fellow
and Ph.D. student in Materials Science & Engineering at Cornell (Wiesner Group).

The site *artfully depicts neurons*, grounded in Erik's real science. A single WebGL
canvas plays a cinematic scroll journey through scales:

1. **Hero** — a glowing cortical neuron network
2. **The Synapse** — a pyramidal neuron wrapped by a CCK basket cell, studded with
   VGLUT3 synaptic puncta (his first-author *Current Research in Neurobiology* paper)
3. **The Molecule** — the Ankyrin B ANK-repeat solenoid docking the NrCAM FIGQY motif
   (his *Journal of Biological Chemistry* paper)
4. **The Material** — a chiral block-copolymer mesophase (his current Wiesner Group work)
5. **The Scientist** — bio, research history, publications, and contact

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- React Three Fiber, drei, `@react-three/postprocessing` (Bloom + Vignette)
- framer-motion for scroll reveals

## Architecture

- One persistent `<Canvas>` (`components/neuron/NeuronJourney.tsx`) fixed behind the DOM.
- `components/neuron/useScrollStage.ts` holds a module-level `scrollStore`; the DOM writes
  scroll progress (derived from the `[data-stage]` section centers) and the scene reads it
  every frame — no React re-renders on scroll.
- Each stage component fades/animates itself from its `stageWeight`; `CameraRig` blends the
  camera distance across stages.
- Palette (`components/neuron/palette.ts`) uses Erik's actual fluorophore colors.
- Reduced motion / SSR renders a static gradient field instead of the canvas.
- `?nobloom` disables post-processing (debug aid for headless rendering).

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
```

Deploy target: **Vercel**.

## TODO (confirm with Erik)

- Preferred title: "Ph.D. student" vs "candidate" vs "researcher" (see `lib/content.ts`).
- Whether to add a personal statement / artist note, or any of his own microscopy images.
- Final domain (metadata `siteUrl` in `app/layout.tsx` currently a placeholder).
