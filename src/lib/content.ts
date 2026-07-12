/**
 * All site copy in one place. Facts here are drawn only from Erik's LinkedIn,
 * the Wiesner Group page, and his two publications. Anything Erik should
 * confirm is marked with a TODO comment rather than invented.
 */

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
    "From single molecules to living circuits to self-assembled quantum matter.",
  email: "eno23@cornell.edu",
  links: {
    linkedin: "https://www.linkedin.com/in/erik-oldre-5385b0234/",
    instagram: "https://www.instagram.com/erik.oldre/",
    email: "mailto:eno23@cornell.edu",
  },
} as const;

export const BIO = {
  lead: "Erik studies how order emerges across scales — from the proteins that wire a neuron, to the block copolymers that fold themselves into new quantum materials.",
  paragraphs: [
    "Erik Oldre is an NSF Graduate Research Fellow and Ph.D. researcher in Materials Science & Engineering at Cornell University, working in the Wiesner Group. His current research explores chiral quantum materials created through block-copolymer self-assembly — engineering mesostructured matter by letting molecules organize themselves.",
    "He grew up in North Carolina and earned his B.S. in Chemistry from the University of North Carolina at Chapel Hill, graduating with Highest Distinction and as a member of Phi Beta Kappa.",
    "Before materials science, Erik spent years at the bench in neuroscience and battery research — work that still shapes how he sees structure, self-organization, and the quiet machinery of living systems.",
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
      "Studying homochiral evolution in the self-assembly of block copolymers, and using chiral block-copolymer phases to engineer mesostructured quantum materials.",
  },
  {
    lab: "Maness Lab",
    institution: "UNC School of Medicine",
    period: "2022 — 2025",
    summary:
      "Investigated the synaptic proteins NrCAM and Ankyrin B and their role in synaptic pruning and autism spectrum disorder — quantifying interneuron connectivity with confocal and STED microscopy, and modeling protein interactions with AlphaFold and molecular dynamics.",
  },
  {
    lab: "Warren Lab",
    institution: "UNC Chapel Hill",
    period: "2024 — 2025",
    summary:
      "Researched the fluoride-ion battery anode material yttrium carbide (Y₂C) — characterizing fluorination-driven phase transitions with X-ray crystallography and machine-learning-driven molecular dynamics.",
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
  eyebrow: string;
  title: string;
  body?: string;
};

export const STAGES: Stage[] = [
  {
    id: "hero",
    index: 0,
    eyebrow: "Erik Oldre",
    title: "Order, across every scale.",
    body: "NSF Graduate Research Fellow · Materials Science & Engineering, Cornell University.",
  },
  {
    id: "synapse",
    index: 1,
    eyebrow: "01 — The Synapse",
    title: "How a neuron learns who to hold onto.",
    body: "In the prefrontal cortex, cholecystokinin basket cells wrap the soma of pyramidal neurons, studding it with inhibitory synapses. Erik's first-author work shows that the adhesion molecule NrCAM and the scaffold protein Ankyrin B are required to build and keep those perisomatic contacts — a link between molecular adhesion and the circuits behind mood, memory, and autism.",
  },
  {
    id: "molecule",
    index: 2,
    eyebrow: "02 — The Molecule",
    title: "The handshake that holds a synapse together.",
    body: "Zooming in further: Ankyrin B is a solenoid of 24 ANK repeats. Using AlphaFold and biochemistry, Erik and colleagues mapped exactly how it grips NrCAM's conserved FIGQY motif and β2-spectrin — and how single autism-linked mutations loosen that grip.",
  },
  {
    id: "materials",
    index: 3,
    eyebrow: "03 — The Material",
    title: "Letting molecules build themselves.",
    body: "Today, in the Wiesner Group at Cornell, Erik works where polymer science meets solid-state physics — coaxing block copolymers to self-assemble into chiral, mesostructured phases, and using that emergent order to engineer new quantum materials.",
  },
  {
    id: "about",
    index: 4,
    eyebrow: "04 — The Scientist",
    title: "Erik Oldre",
    body: BIO.lead,
  },
];

/** Fluorophore legend rendered on the synapse stage. */
export const CHANNEL_LEGEND = [
  { label: "MATH2⁺ soma", color: "#3B82F6", note: "pyramidal neuron" },
  { label: "VGLUT3⁺ puncta", color: "#FF2E88", note: "CCK-basket synapse" },
  { label: "EGFP / VGAT", color: "#22E39A", note: "reporter channel" },
] as const;
