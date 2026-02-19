export const SITE = {
  name: "Asociación Colombiana de Inteligencia Artificial",
  shortName: "ACIA",
  domain: "iaencolombia.org",
  tagline: "Donde la IA se convierte en desarrollo.",
  description:
    "Articulamos el ecosistema de inteligencia artificial en Colombia para impulsar desarrollo, competitividad y gobernanza responsable.",
} as const;

export const NAV_LINKS = [
  { label: "Inicio", href: "#hero" },
  { label: "Nueva Etapa", href: "#nueva-etapa" },
  { label: "¿Qué es ACIA?", href: "#pilares" },
  { label: "Afiliados", href: "#valor" },
  { label: "Eventos", href: "#eventos" },
  { label: "Internacional", href: "#internacional" },
  { label: "Gobernanza", href: "#gobernanza" },
] as const;

export const HERO = {
  title: "Asociación Colombiana de Inteligencia Artificial",
  subtitle:
    "Articulamos el ecosistema de inteligencia artificial en Colombia para impulsar desarrollo, competitividad y gobernanza responsable.",
  cta: [
    { label: "Afíliate a ACIA", href: "#cta", variant: "default" as const },
    { label: "Conoce la nueva visión", href: "#nueva-etapa", variant: "secondary" as const },
    { label: "Oportunidades y eventos", href: "#eventos", variant: "outline" as const },
  ],
  footer: "Donde la IA se convierte en desarrollo.",
} as const;

export const NEW_STAGE = {
  title: "Una nueva etapa para la IA en Colombia",
  intro:
    "La inteligencia artificial está redefiniendo industrias, economías y gobiernos. Colombia necesita una asociación fuerte, técnica y articuladora.",
  subtitle:
    "La ACIA inicia una etapa de fortalecimiento institucional orientada a:",
  points: [
    "Generar más oportunidades para sus afiliados",
    "Conectar empresas, talento y academia",
    "Impulsar proyectos estratégicos de impacto",
    "Promover una IA responsable y centrada en el ser humano",
  ],
  closing:
    "Este es el nuevo comienzo de la Asociación Colombiana de Inteligencia Artificial.",
} as const;

export const PILLARS = [
  {
    icon: "brain" as const,
    title: "Pensamiento y Gobernanza",
    description:
      "Promovemos principios de ética, transparencia y reducción de sesgos en sistemas de IA.",
    image: "/sections/Gobernanza.webp",
  },
  {
    icon: "handshake" as const,
    title: "Ecosistema y Oportunidades",
    description:
      "Facilitamos el relacionamiento estratégico entre empresas, profesionales, academia y sector público.",
    image: "/sections/Ecosistema.webp",
  },
  {
    icon: "rocket" as const,
    title: "Proyectos Estratégicos",
    description:
      "Articulamos iniciativas colaborativas y promovemos el desarrollo de proyectos de alto impacto en inteligencia artificial.",
    image: "/sections/Proyectos.webp",
  },
] as const;

export const VALUE_PROPOSITION = {
  title: "Ser parte de la ACIA es potenciar tus oportunidades.",
  description:
    "La Asociación Colombiana de Inteligencia Artificial es una plataforma de articulación y desarrollo para el ecosistema nacional.",
  subtitle: "Nuestros afiliados acceden a:",
  benefits: [
    "Mesas sectoriales estratégicas",
    "Ruedas de conexión empresarial",
    "Convocatorias internas para proyectos colaborativos",
    "Visibilidad institucional",
    "Acceso a espacios binacionales e internacionales",
    "Informes técnicos y análisis especializados",
  ],
  cta: { label: "Conoce los beneficios", href: "#cta" },
} as const;

export const EVENTS = {
  title: "Conectando talento y oportunidades en IA.",
  categories: [
    "Convocatorias activas",
    "Próximos eventos",
    "Mesas técnicas",
    "Iniciativas internacionales",
  ],
} as const;

export const INTERNATIONAL = {
  title: "Colombia conectada con el mundo",
  description:
    "La ACIA promueve alianzas estratégicas internacionales para fortalecer el ecosistema nacional de inteligencia artificial, facilitando cooperación académica, empresarial y técnica.",
} as const;

export const GOVERNANCE = {
  title: "Inteligencia Artificial con propósito en el país",
  description:
    "Creemos en una IA que combine innovación, competitividad y respeto por los derechos fundamentales.",
  subtitle: "Promovemos:",
  principles: [
    "Transparencia algorítmica",
    "Reducción de sesgos",
    "Gobernanza responsable",
    "Impacto productivo sostenible",
  ],
} as const;

export const CTA_FINAL = {
  title: "Fortalezcamos juntos el ecosistema de IA en Colombia.",
  cta: [
    { label: "Afíliate ahora", href: "#", variant: "default" as const },
    { label: "Contáctanos", href: "#", variant: "outline" as const },
  ],
  closing: "Donde la IA se convierte en desarrollo.",
} as const;
