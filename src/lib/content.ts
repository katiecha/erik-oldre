/**
 * All site copy in one place. Facts here are drawn only from Erik's LinkedIn,
 * the Wiesner Group page, and his two publications. Anything Erik should
 * confirm is marked with a TODO comment rather than invented.
 */

import { PALETTE } from "@/components/neuron/palette";

export const PROFILE = {
  name: "Erik Oldre",
  fullName: "Erik N. Oldre",
  pronouns: "He/Him",
  // TODO(erik): confirm preferred title — "Ph.D. student", "Ph.D. candidate", or "researcher".
  title: "Ph.D. Researcher, Materials Science & Engineering",
  affiliation: "Cornell University · Wiesner Group",
  fellowship: "NSF Graduate Research Fellow",
  location: "Ithaca, New York",
  tagline:
    "Self-assembly and structure, across scales.",
  email: "eno23@cornell.edu",
  links: {
    linkedin: "https://www.linkedin.com/in/erik-oldre-5385b0234/",
    instagram: "https://www.instagram.com/erik.oldre/",
    email: "mailto:eno23@cornell.edu",
  },
} as const;

export const BIO = {
  lead: "NSF Graduate Research Fellow, Materials Science & Engineering, Cornell University.",
  paragraphs: [
    "Ph.D. student in the Wiesner Group at Cornell. Studying homochiral block copolymer self-assembly toward mesostructured quantum materials.",
    "B.S. Chemistry, UNC Chapel Hill — Highest Distinction, Phi Beta Kappa. Prior work in synaptic cell adhesion and fluoride-ion battery materials.",
  ],
} as const;

export type ResearchEntry = {
  lab: string;
  institution: string;
  period: string;
  summary: string;
};

export const RESEARCH_HISTORY: ResearchEntry[] = [
  {
    lab: "Wiesner Group",
    institution: "Cornell University",
    period: "2025 — Present",
    summary:
      "Studying homochiral block copolymer self-assembly; chiral phases for mesostructured quantum materials.",
  },
  {
    lab: "Warren Lab",
    institution: "UNC Chapel Hill",
    period: "2024 — 2025",
    summary:
      "Researched fluorination of the Y₂C fluoride-ion battery anode; X-ray crystallography and ML molecular dynamics.",
  },
  {
    lab: "Maness Lab",
    institution: "UNC School of Medicine",
    period: "2022 — 2025",
    summary:
      "Investigated NrCAM and Ankyrin B in synaptic pruning and ASD; mouse knockouts, confocal/STED imaging, AlphaFold modeling.",
  },
];

export type Publication = {
  title: string;
  authors: string;
  authorHighlight: string;
  venue: string;
  detail: string;
  year: string;
  doi: string;
  url: string;
  firstAuthor?: boolean;
};

export const PUBLICATIONS: Publication[] = [
  {
    title:
      "Regulation of perisomatic synapses from cholecystokinin basket interneurons through NrCAM and Ankyrin B",
    authors:
      "Erik N. Oldre, Barrett D. Webb, Justin E. Sperringer, Patricia F. Maness",
    authorHighlight: "Erik N. Oldre",
    venue: "Current Research in Neurobiology",
    detail: "Volume 8, 2025, 100150",
    year: "2025",
    doi: "10.1016/j.crneur.2025.100150",
    url: "https://doi.org/10.1016/j.crneur.2025.100150",
    firstAuthor: true,
  },
  {
    title: "Structural interactions of ankyrin B with NrCAM and β2 spectrin",
    authors:
      "Venkat R. Chirasani, Victoria A. Haberman, Erik N. Oldre, Barrett D. Webb, Ernest B. Pereira, Wonsuk Yang, Patricia F. Maness",
    authorHighlight: "Erik N. Oldre",
    venue: "Journal of Biological Chemistry",
    detail: "Volume 301, Issue 12, 2025, 110872",
    year: "2025",
    doi: "10.1016/j.jbc.2025.110872",
    url: "https://doi.org/10.1016/j.jbc.2025.110872",
  },
];

/** The five scroll stages, in order. Offsets are used to drive the 3D camera. */
export type StageId = "hero" | "synapse" | "molecule" | "materials" | "about";

export type Stage = {
  id: StageId;
  index: number;
  /** Camera distance from the origin while this stage is centered (see CameraRig). */
  cameraZ: number;
  eyebrow: string;
  title: string;
  body?: string;
};

export const STAGES: Stage[] = [
  {
    id: "hero",
    index: 0,
    cameraZ: 15,
    eyebrow: "Erik Oldre",
    title: "Self-assembly and structure, across scales",
    body: "NSF Graduate Research Fellow · Materials Science & Engineering, Cornell University.",
  },
  {
    id: "synapse",
    index: 1,
    cameraZ: 7,
    eyebrow: "01 — Neuroscience",
    title: "Perisomatic synaptic adhesion",
    body: "NrCAM and Ankyrin B build perisomatic synapses from CCK basket interneurons onto pyramidal neurons.",
  },
  {
    id: "molecule",
    index: 2,
    cameraZ: 4.6,
    eyebrow: "02 — Structural Biology",
    title: "The Ankyrin B complex",
    body: "AlphaFold modeling of the Ankyrin B–NrCAM–β2-spectrin interface, validated by co-immunoprecipitation.",
  },
  {
    id: "materials",
    index: 3,
    cameraZ: 10,
    eyebrow: "03 — Materials Science",
    title: "Chiral block copolymer self-assembly",
    body: "Homochiral evolution toward mesostructured quantum materials.",
  },
  {
    id: "about",
    index: 4,
    cameraZ: 13.5,
    eyebrow: "About",
    title: "Erik Oldre",
    body: BIO.lead,
  },
];

/** Stage index lookup by id, so 3D components reference a stage instead of a bare integer. */
export const STAGE_INDEX: Record<StageId, number> = Object.fromEntries(
  STAGES.map((s) => [s.id, s.index]),
) as Record<StageId, number>;

/** Fluorophore legend rendered on the synapse stage. */
export const CHANNEL_LEGEND = [
  { label: "MATH2⁺ soma", color: PALETTE.soma, note: "pyramidal neuron" },
  { label: "VGLUT3⁺ puncta", color: PALETTE.puncta, note: "CCK-basket synapse" },
  { label: "EGFP / VGAT", color: PALETTE.gfp, note: "reporter channel" },
] as const;
