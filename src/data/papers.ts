export type PublicationType =
  | "Research Paper"
  | "Working Paper"
  | "Policy Brief"
  | "Technical Note";

export interface AciaPublication {
  title: string;
  slug: string;
  publicationType: PublicationType;
  authors: string[];
  abstract: string;
  abstractEn?: string;
  keywords: string[];
  publicationDate: string;
  version: string;
  aciaIdentifier: string;
  pdfUrl: string;
  citation: string;
  methodology?: string;
  reviewStatus: string;
  fundingStatement?: string;
  conflictOfInterestStatement?: string;
  license?: string;
}

export const PUBLICATION_TYPES: ReadonlyArray<{ label: PublicationType; prefix: string }> = [
  { label: "Research Paper", prefix: "ACIA-RP-YYYY-NNN" },
  { label: "Working Paper", prefix: "ACIA-WP-YYYY-NNN" },
  { label: "Policy Brief", prefix: "ACIA-PB-YYYY-NNN" },
  { label: "Technical Note", prefix: "ACIA-TN-YYYY-NNN" },
];

export const PUBLICATIONS: AciaPublication[] = [];
