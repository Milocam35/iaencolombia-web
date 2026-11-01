// Edición manual. Fuentes y proceso de actualización: docs/REVISION-LOCAL.md.
export const PUBLIC_CONTACT = "contacto@iaencolombia.org";
// Titulares resumidos por ACIA. Fecha = publicación de la fuente, verificada 2026-10-30.
export const NEWS = [
  {
    title: "Almaty reúne educación superior, arte e IA",
    date: "2026-10-28",
    source: "UNESCO",
    type: "Mundo",
    url: "https://www.unesco.org/en/articles/almaty-brings-global-experts-together-explore-future-higher-education-arts-and-ai",
    order: 1,
  },
  {
    title: "Una guía para integrar IA en la formación técnica",
    date: "2026-10-21",
    source: "UNESCO-UNEVOC",
    type: "Publicación",
    url: "https://www.unevoc.unesco.org/en/articles/integrating-ai-tvet-practical-guide-institutions-0",
    order: 2,
  },
  {
    title: "América Latina debate cómo formar docentes para la IA",
    date: "2026-10-20",
    source: "UNESCO",
    type: "Región",
    url: "https://www.unesco.org/en/articles/faculties-education-latin-america-address-how-prepare-future-teachers-age-artificial-intelligence",
    order: 3,
  },
  {
    title: "Colombia y Microsoft avanzan en formación en IA",
    date: "2026-10-14",
    source: "Radio Nacional de Colombia",
    type: "Colombia",
    url: "https://www.radionacional.co/actualidad/tecnologia/microsoft-acuerdo",
    order: 4,
  },
] as const;
export const ALLIANCES = [
  {
    name: "América Digital",
    url: "https://congreso.america-digital.com/",
    description:
      "Encuentros de tecnología, inteligencia artificial y negocios en América Latina.",
    logo: "/alliances/america-digital.png",
    logoWidth: 240,
    logoHeight: 100,
    note: "Consulta la información del organizador.",
  },
  {
    name: "Women in Tech",
    url: "https://women-in-tech.org/colombia/",
    description:
      "Una comunidad internacional que impulsa la participación de las mujeres en tecnología.",
    logo: "/alliances/women-in-tech-colombia.png",
    logoWidth: 160,
    logoHeight: 160,
    note: "Conoce su capítulo oficial en Colombia.",
  },
] as const;
export interface InstitutionalVideo {
  approved: boolean;
  src: string;
  poster: string;
  captions: string;
  transcript: string;
}
// Activar únicamente con archivo, portada y alternativa textual autorizados por ACIA.
export const PRESIDENT_VIDEO: InstitutionalVideo = {
  approved: false,
  src: "",
  poster: "",
  captions: "",
  transcript: "",
};
export const BENEFITS = [
  {
    number: "01",
    title: "Encuentra tu comunidad",
    description:
      "Conecta con profesionales, empresas y academia alrededor de la inteligencia artificial.",
    detail: "Relacionamiento y articulación",
  },
  {
    number: "02",
    title: "Amplía tu perspectiva",
    description:
      "Accede a las comunicaciones de ACIA y explora espacios de actualización según tu plan.",
    detail: "Conocimiento y aprendizaje",
  },
  {
    number: "03",
    title: "Participa y aporta",
    description:
      "Conoce las mesas sectoriales, los encuentros y las oportunidades de colaboración de la Asociación.",
    detail: "Participación en el ecosistema",
  },
] as const;
export const PROFILES = [
  {
    category: "personas",
    title: "Soy una persona",
    description: "Quiero aprender, conectar y aportar.",
    icon: "person",
  },
  {
    category: "empresas",
    title: "Represento una empresa",
    description: "Busco conexiones para mi organización.",
    icon: "company",
  },
  {
    category: "instituciones",
    title: "Soy una institución",
    description: "Quiero acercar conocimiento y capacidades.",
    icon: "institution",
  },
] as const;

// Incorporar solo una captura oficial, anonimizada y autorizada. Nunca usar la UI ilustrativa de la referencia.
export const UNIVERSE_PREVIEW: { approved: boolean; src: string; alt: string } =
  { approved: false, src: "", alt: "" };
