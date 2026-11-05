export type PublicationType =
  | "Research Paper"
  | "Working Paper"
  | "Policy Brief"
  | "Technical Note";

export interface AciaPublication {
  title: string;
  slug: string;
  publicationType?: PublicationType;
  authors: string[];
  abstract: string;
  abstractEn?: string;
  keywords: string[];
  institution: string;
  year: number;
  language: string;
  depositedAt: string;
  repository: { name: string; url: string; identifier: string };
  coverUrl?: string;
  publicationDate?: string;
  version?: string;
  aciaIdentifier?: string;
  pdfUrl: string;
  citation: string;
  methodology?: string;
  reviewStatus?: string;
  fundingStatement?: string;
  conflictOfInterestStatement?: string;
  license?: string;
}

export const PUBLICATION_TYPES: ReadonlyArray<{ label: PublicationType; prefix: string; slug: string }> = [
  { label: "Research Paper", prefix: "ACIA-RP-YYYY-NNN", slug: "research-papers" },
  { label: "Working Paper", prefix: "ACIA-WP-YYYY-NNN", slug: "working-papers" },
  { label: "Policy Brief", prefix: "ACIA-PB-YYYY-NNN", slug: "policy-briefs" },
  { label: "Technical Note", prefix: "ACIA-TN-YYYY-NNN", slug: "technical-notes" },
];

export const PUBLICATIONS: AciaPublication[] = [
  {
    title: "Gobernanza de la IA como infraestructura económica: riesgos sistémicos, intermediación institucional y confianza en los mercados",
    slug: "gobernanza-ia-infraestructura-economica",
    publicationType: "Research Paper",
    aciaIdentifier: "ACIA-RP-2026-001",
    authors: ["Angel Varela", "Alejandro Colmenares", "Juan Camilo Cortes"],
    institution: "Asociación Colombiana de Inteligencia Artificial — ACIA",
    year: 2026,
    language: "Español",
    abstract: "Este documento analiza la gobernanza de la inteligencia artificial como una infraestructura económica que transforma los mercados, las instituciones y la toma de decisiones. A partir de marcos internacionales y del contexto colombiano, examina oportunidades y riesgos de su adopción, con especial atención a los mercados financieros. Plantea la importancia de la supervisión, la auditoría algorítmica, la trazabilidad y la interoperabilidad para fortalecer la confianza y la capacidad institucional.",
    keywords: ["Gobernanza de IA", "Economía", "Riesgos sistémicos", "Mercados financieros", "Colombia"],
    depositedAt: "2026-09-30",
    repository: {
      name: "Munich Personal RePEc Archive — MPRA",
      url: "https://mpra.ub.uni-muenchen.de/131077/",
      identifier: "MPRA Paper n.º 131077",
    },
    pdfUrl: "/papers/gobernanza-ia-infraestructura-economica-mpra-131077.pdf",
    coverUrl: "/papers/gobernanza-ia-infraestructura-economica-portada.png",
    citation: "Varela, A., Colmenares, A., y Cortes, J. C. (2026). Gobernanza de la IA como infraestructura económica: riesgos sistémicos, intermediación institucional y confianza en los mercados. Asociación Colombiana de Inteligencia Artificial — ACIA. ACIA-RP-2026-001. MPRA Paper n.º 131077. https://mpra.ub.uni-muenchen.de/131077/",
  },
];
