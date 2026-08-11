export type TeamCategory =
  | "presidencia"
  | "junta-directiva"
  | "equipo-institucional"
  | "investigadores-expertos"
  | "comites-tecnicos";

export interface TeamMember {
  slug: string;
  fullName: string;
  aciaRole: string;
  currentPosition: string;
  currentOrganization: string;
  shortBio: string;
  expertise: string[];
  education: string[];
  linkedinUrl: string;
  orcidUrl?: string;
  googleScholarUrl?: string;
  publicEmail?: string;
  photo: string;
  category: TeamCategory;
  committees?: string[];
}

export const TEAM_CATEGORIES: ReadonlyArray<{ id: TeamCategory; label: string }> = [
  { id: "presidencia", label: "Presidencia" },
  { id: "junta-directiva", label: "Junta Directiva" },
  { id: "equipo-institucional", label: "Equipo institucional" },
  { id: "investigadores-expertos", label: "Investigadores y expertos" },
  { id: "comites-tecnicos", label: "Comités técnicos" },
];

export const TEAM_MEMBERS: TeamMember[] = [];
