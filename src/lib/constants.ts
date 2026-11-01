export const SITE = {
  name: "Asociación Colombiana de Inteligencia Artificial",
  shortName: "ACIA",
  domain: "iaencolombia.org",
  tagline: "Donde la IA se convierte en desarrollo.",
  description:
    "Articulamos el ecosistema de inteligencia artificial en Colombia para impulsar desarrollo, competitividad y gobernanza responsable.",
} as const;

export const NAV_GROUPS = [
  { label: "Conócenos", links: [{ label: "Qué es ACIA", href: "/#pilares" }, { label: "Hoja de ruta", href: "/#hoja-de-ruta" }, { label: "Transparencia", href: "/transparencia" }] },
  { label: "Afiliación", links: [{ label: "Beneficios", href: "/#valor" }, { label: "Tarifas y planes", href: "/#planes" }, { label: "Universo ACIA", href: "/#universo" }] },
  { label: "Universo ACIA", links: [{ label: "Descubre Universo ACIA", href: "/#universo" }] },
  { label: "Oportunidades", links: [{ label: "Eventos", href: "/#eventos" }, { label: "Mesas técnicas y convocatorias", href: "/#oportunidades" }, { label: "Alianzas", href: "/#internacional" }] },
  { label: "Conocimiento", links: [{ label: "Normatividad", href: "/normatividad" }, { label: "Observatorio", href: "/observatorio" }, { label: "Papers y publicaciones", href: "/papers" }] },
  { label: "Actualidad", links: [{ label: "Últimas noticias", href: "/#noticias" }, { label: "ACIA al día", href: "/newsletters" }, { label: "Comunicados", href: "/comunicados" }] },
] as const;

export const HERO = {
  title: "Asociación Colombiana de Inteligencia Artificial",
  subtitle:
    "Articulamos el ecosistema de inteligencia artificial en Colombia para impulsar desarrollo, competitividad y gobernanza responsable.",
  cta: [
    { label: "Conoce ACIA", href: "#pilares", variant: "secondary" as const },
    { label: "Afíliate", href: "/afiliate", variant: "default" as const },
    { label: "Explora nuestro conocimiento", href: "#conocimiento", variant: "outline" as const },
  ],
  footer: "Donde la IA se convierte en desarrollo.",
} as const;

export const NEW_STAGE = {
  title: "Una nueva etapa para la IA en Colombia",
  intro:
    "Colombia necesita una asociación fuerte, técnica y articuladora. La ACIA inicia su fortalecimiento institucional.",
  points: [
    "Más oportunidades para afiliados",
    "Conexión empresa, talento y academia",
    "Proyectos estratégicos de impacto",
    "IA responsable y centrada en el ser humano",
  ],
} as const;

export const CAPABILITIES = [
  { title: "Comunidad y articulación", description: "Conectamos actores y capacidades del ecosistema nacional." },
  { title: "Conocimiento e investigación", description: "Promovemos evidencia y análisis para orientar decisiones." },
  { title: "Talento y formación", description: "Impulsamos capacidades para crear y adoptar IA responsable." },
  { title: "Innovación aplicada", description: "Acercamos la inteligencia artificial a retos productivos y sociales." },
  { title: "Política pública y gobernanza", description: "Aportamos criterio técnico al debate y a la construcción institucional." },
  { title: "Inclusión y sostenibilidad", description: "Trabajamos por una IA que amplíe oportunidades y genere valor duradero." },
] as const;

export const ROADMAP = [
  { period: "2024–2027", title: "Fundación y legitimidad", description: "Consolidar bases institucionales y confianza en el ecosistema." },
  { period: "2028–2030", title: "Escalamiento nacional", description: "Ampliar la articulación y las capacidades en Colombia." },
  { period: "2031–2035", title: "Referencia colombiana", description: "Fortalecer el aporte técnico y científico al país." },
  { period: "2036–2040", title: "Liderazgo regional", description: "Proyectar conocimiento y cooperación en América Latina." },
  { period: "2041–2046", title: "Institución de legado", description: "Construir una institución sostenible para las nuevas generaciones." },
] as const;

export const PILLARS = [
  {
    icon: "brain" as const,
    title: "Pensamiento y Gobernanza",
    description:
      "Promovemos principios de ética, transparencia y reducción de sesgos en sistemas de IA.",
    image: "/sections/Gobernanza1.webp",
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
  cta: { label: "Conoce los beneficios", href: "#planes" },
} as const;

export const EVENTS = {
  title: "Conectando talento y oportunidades en IA.",
  featured: {
    eyebrow: "Alianza ACIA × América Digital",
    title: "Congreso Latinoamericano América Digital 2026",
    description:
      "Actividad finalizada. La alianza contempló un beneficio para afiliados en la edición de septiembre de 2026. No es una convocatoria abierta.",
    details: "9 y 10 de septiembre de 2026 · Espacio Riesco, Santiago de Chile",
    href: "https://congreso.america-digital.com/",
  },
  categories: [
    "Convocatorias",
    "Eventos",
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
    { label: "Afíliate ahora", href: "/afiliate", variant: "default" as const },
    { label: "Contáctanos", href: "mailto:contacto@iaencolombia.org", variant: "outline" as const },
  ],
  closing: "Donde la IA se convierte en desarrollo.",
} as const;
