/** Public editorial proposal. No private API or membership data is consumed. */
export const SECTOR_TABLES_PATH = "/mesas-tecnicas-sectoriales";

export interface PublicSectorTable {
  slug: string;
  name: string;
  objective: string;
  expectedImpact: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  transversal?: boolean;
}

export const PUBLIC_SECTOR_TABLES: PublicSectorTable[] = [
  {
    slug: "estado-justicia-seguridad",
    name: "Estado, justicia y seguridad",
    objective: "Proponer usos responsables de IA que fortalezcan las instituciones públicas, la justicia y la seguridad, con respeto por los derechos.",
    expectedImpact: "Esperamos aportar criterios técnicos que ayuden a evaluar servicios públicos más confiables, transparentes y accesibles.",
    image: "/images/mesas-publicas/estado-justicia-seguridad.webp",
    imageAlt: "Representación ilustrativa de arquitectura institucional colombiana, con una fachada de piedra y la bandera del país.",
    imagePosition: "50% 48%",
  },
  {
    slug: "economia-industria-productividad",
    name: "Economía, industria y productividad",
    objective: "Identificar oportunidades y condiciones para una adopción productiva y responsable de la IA en empresas y sectores económicos.",
    expectedImpact: "Buscamos orientar propuestas que fortalezcan las capacidades productivas y la competitividad, considerando sus efectos en el empleo.",
    image: "/images/mesas-publicas/economia-industria-productividad.webp",
    imageAlt: "Profesional de ingeniería inspeccionando una línea de producción industrial con apoyo de herramientas digitales.",
    imagePosition: "50% 45%",
  },
  {
    slug: "desarrollo-humano-social",
    name: "Desarrollo humano y social",
    objective: "Promover aplicaciones de IA que contribuyan a la educación, la salud y la inclusión social.",
    expectedImpact: "Esperamos aportar recomendaciones para ampliar oportunidades y reducir barreras de acceso, con las personas como prioridad.",
    image: "/images/mesas-publicas/desarrollo-humano-social.webp",
    imageAlt: "Educadora y estudiante trabajando juntos en una actividad de aprendizaje con una tableta.",
    imagePosition: "50% 45%",
  },
  {
    slug: "territorio-infraestructura-sostenibilidad",
    name: "Territorio, infraestructura y sostenibilidad",
    objective: "Explorar aplicaciones responsables de IA para territorios, infraestructura y sostenibilidad.",
    expectedImpact: "Buscamos aportar criterios para planificar la movilidad y la infraestructura, cuidar los recursos y responder a necesidades de las regiones.",
    image: "/images/mesas-publicas/territorio-infraestructura-sostenibilidad.webp",
    imageAlt: "Transporte por cable integrado al paisaje de una ciudad andina colombiana y sus laderas verdes.",
    imagePosition: "50% 46%",
  },
  {
    slug: "ciencia-tecnologia-innovacion",
    name: "Ciencia, tecnología e innovación",
    objective: "Fortalecer el intercambio entre investigación y aplicación de IA para desarrollar capacidades tecnológicas en Colombia.",
    expectedImpact: "Esperamos facilitar propuestas de cooperación entre academia, empresas e instituciones que acerquen la investigación a necesidades concretas del país.",
    image: "/images/mesas-publicas/ciencia-tecnologia-innovacion.webp",
    imageAlt: "Ingeniera probando un prototipo de robot con sensores y componentes electrónicos en un laboratorio de desarrollo.",
    imagePosition: "50% 50%",
  },
  {
    slug: "gobernanza-etica-ia",
    name: "Gobernanza y ética de la IA",
    objective: "Aportar criterios de gobernanza y ética de la IA al trabajo de las seis mesas.",
    expectedImpact: "Buscamos formular recomendaciones sobre transparencia, privacidad y supervisión humana que orienten decisiones y usos responsables de la IA.",
    image: "/images/mesas-publicas/gobernanza-etica-ia.webp",
    imageAlt: "Especialista evaluando un sistema de decisiones algorítmicas y contrastando sus resultados con una lista de revisión.",
    imagePosition: "50% 45%",
    transversal: true,
  },
];
