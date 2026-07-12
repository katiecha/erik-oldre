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
    "Self-assembly and structure, across scales.",
  email: "eno23@cornell.edu",
  links: {
    linkedin: "https://www.linkedin.com/in/erik-oldre-5385b0234/",
    instagram: "https://www.instagram.com/erik.oldre/",
    email: "mailto:eno23@cornell.edu",
  },
} as const;

export const BIO = {
  lead: "NSF Graduate Research Fellow and first-year Ph.D. student in Materials Science & Engineering at Cornell University.",
  paragraphs: [
    "Erik Oldre is an NSF Graduate Research Fellow and first-year Ph.D. student in Materials Science & Engineering at Cornell University, where he works in the Wiesner Group. His research studies homochiral evolution in the self-assembly of block copolymers and the use of chiral block copolymer phases to engineer mesostructured quantum materials.",
    "He earned his B.S. in Chemistry from the University of North Carolina at Chapel Hill, graduating with Highest Distinction and as a member of Phi Beta Kappa.",
    "His prior research spans neuroscience and energy materials — from the molecular basis of synaptic cell adhesion to phase-transition behavior in fluoride-ion battery anodes — connected by an interest in how structure and self-organization govern function.",
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
      "Studying homochiral evolution in the self-assembly of block copolymers and the use of chiral block copolymer phases to engineer mesostructured quantum materials.",
  },
  {
    lab: "Maness Lab",
    institution: "UNC School of Medicine",
    period: "2022 — 2025",
    summary:
      "Investigated the synaptic proteins NrCAM and Ankyrin B and their role in autism spectrum disorder (ASD) and spine/synaptic pruning. Led experimentation of mouse NrCAM- and Ankyrin B-null models, employing immunofluorescence staining with confocal and STED microscopy to quantify changes in interneuron connectivity, and utilized AlphaFold and molecular dynamics to model protein interactions.",
  },
  {
    lab: "Warren Lab",
    institution: "UNC Chapel Hill",
    period: "2024 — 2025",
    summary:
      "Researched the thermochemical and kinetic properties of the fluoride-ion battery (FIB) anode material yttrium carbide (Y₂C). Characterized fluorination-induced structural transformations by X-ray crystallography, and simulated fluoride behavior with a machine-learning-trained interatomic potential for molecular dynamics.",
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
    title: "Self-assembly and structure, across scales.",
    body: "NSF Graduate Research Fellow · Materials Science & Engineering, Cornell University.",
  },
  {
    id: "synapse",
    index: 1,
    eyebrow: "01 — Neuroscience",
    title: "Cell adhesion at the perisomatic synapse.",
    body: "Investigated the cell adhesion molecule NrCAM and the scaffold protein Ankyrin B in the regulation of perisomatic synapses formed by cholecystokinin (CCK) basket interneurons onto pyramidal neurons of the medial prefrontal cortex. Using immunofluorescence with confocal microscopy in NrCAM- and Ankyrin B-null mouse models, quantified a selective reduction in CCK basket cell synaptic puncta — implicating NrCAM–Ankyrin B adhesion in the excitatory/inhibitory balance relevant to autism spectrum disorder.",
  },
  {
    id: "molecule",
    index: 2,
    eyebrow: "02 — Structural Biology",
    title: "Structural modeling of the Ankyrin B complex.",
    body: "Employed AlphaFold to model the interactions of the Ankyrin B membrane-binding domain — a solenoid of 24 ANK repeats — with the NrCAM cytoplasmic FIGQY motif and with β2-spectrin. Validated the predicted interfaces by site-directed mutagenesis and co-immunoprecipitation, and related autism-linked missense mutations in Ankyrin B to disrupted binding and impaired Semaphorin 3F-induced spine pruning.",
  },
  {
    id: "materials",
    index: 3,
    eyebrow: "03 — Materials Science",
    title: "Chiral block copolymer self-assembly.",
    body: "In the Wiesner Group at Cornell, studying homochiral evolution in the self-assembly of block copolymers and the use of chiral block copolymer phases to engineer mesostructured quantum materials — working at the interface of polymer science and solid-state chemistry.",
  },
  {
    id: "about",
    index: 4,
    eyebrow: "About",
    title: "Erik Oldre",
    body: BIO.lead,
  },
];

/** Fluorophore legend rendered on the synapse stage. */
export const CHANNEL_LEGEND = [
  { label: "MATH2⁺ soma", color: "#3B82F6", note: "pyramidal neuron" },
  { label: "VGLUT3⁺ puncta", color: "#5EE9F0", note: "CCK-basket synapse" },
  { label: "EGFP / VGAT", color: "#34D399", note: "reporter channel" },
] as const;
