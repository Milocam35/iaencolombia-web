export type MembershipCategoryId =
  | "comunidad"
  | "personas"
  | "empresas"
  | "instituciones";

export interface MembershipCategory {
  id: MembershipCategoryId;
  label: string;
  description: string;
}

export interface MembershipPlan {
  id: string;
  category: MembershipCategoryId;
  name: string;
  audience: string;
  price: string;
  priceQualifier?: string;
  label?: string;
  discount?: string;
  commercialTerms?: string;
  benefits: string[];
  cta: "Quiero afiliarme" | "Contáctanos";
  featured?: boolean;
}

export const MEMBERSHIP_CATEGORIES: MembershipCategory[] = [
  {
    id: "comunidad",
    label: "Comunidad",
    description: "Una puerta de entrada gratuita al ecosistema de inteligencia artificial.",
  },
  {
    id: "personas",
    label: "Personas",
    description: "Opciones para estudiantes, profesionales independientes y expertos.",
  },
  {
    id: "empresas",
    label: "Empresas",
    description: "Planes según el tamaño y las necesidades de cada organización.",
  },
  {
    id: "instituciones",
    label: "Instituciones",
    description: "Vinculación para universidades, gremios y cámaras de comercio.",
  },
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "comunidad",
    category: "comunidad",
    name: "Comunidad / Freemium",
    audience: "Cualquier persona interesada en inteligencia artificial",
    price: "$0",
    label: "Gratuito",
    benefits: [
      "Newsletter ACIA Weekly",
      "Vista parcial del directorio de afiliados",
    ],
    cta: "Quiero afiliarme",
  },
  {
    id: "afiliado",
    category: "personas",
    name: "Afiliado",
    audience: "Profesional independiente / estudiante",
    price: "$195.000",
    priceQualifier: "COP / año",
    benefits: [
      "Acceso completo a la plataforma ACIA",
      "Newsletter ACIA Weekly",
      "Sesiones de actualización con expertos",
    ],
    cta: "Quiero afiliarme",
  },
  {
    id: "estudiante",
    category: "personas",
    name: "Estudiante",
    audience: "Universitarios y recién egresados",
    price: "$97.500",
    priceQualifier: "COP / año",
    discount: "50% de descuento durante el primer año",
    benefits: [
      "Todo lo incluido en Afiliado",
      "Visibilidad ante empresas del ecosistema",
      "Oportunidades laborales",
    ],
    cta: "Quiero afiliarme",
    featured: true,
  },
  {
    id: "profesional",
    category: "personas",
    name: "Profesional",
    audience: "Consultor / experto",
    price: "$790.000",
    priceQualifier: "COP / año",
    benefits: [
      "Todo lo incluido en Afiliado",
      "Marketplace ACIA",
      "Mesas de trabajo sectoriales",
      "Acceso preferencial a eventos",
    ],
    cta: "Quiero afiliarme",
  },
  {
    id: "micro_empresa",
    category: "empresas",
    name: "Micro empresa",
    audience: "1–10 empleados",
    price: "$1.990.000",
    priceQualifier: "COP / año",
    discount: "10% en talleres especializados",
    benefits: [
      "Acceso a la plataforma",
      "Sesión de bienvenida",
      "Webinars quincenales",
      "Mesas de trabajo",
    ],
    cta: "Quiero afiliarme",
  },
  {
    id: "pequena_empresa",
    category: "empresas",
    name: "Pequeña empresa",
    audience: "11–50 empleados",
    price: "$2.990.000",
    priceQualifier: "COP / año",
    discount: "15% en talleres especializados",
    benefits: [
      "Todo lo incluido en Micro",
      "Marketplace",
      "Acceso a eventos",
    ],
    cta: "Quiero afiliarme",
  },
  {
    id: "mediana_empresa",
    category: "empresas",
    name: "Mediana empresa",
    audience: "51–200 empleados",
    price: "$5.990.000",
    priceQualifier: "COP / año",
    discount: "20% en talleres especializados",
    benefits: [
      "Todo lo incluido en Pequeña",
      "Descuentos aliados",
      "Visibilidad en eventos",
    ],
    cta: "Quiero afiliarme",
  },
  {
    id: "gran_empresa",
    category: "empresas",
    name: "Gran empresa",
    audience: "200+ empleados",
    price: "Desde $12.000.000",
    priceQualifier: "COP / año · tarifa base",
    discount: "Descuento negociado",
    commercialTerms: "Plan a medida",
    benefits: [
      "Todo lo incluido en Mediana",
      "Gerente de cuenta",
      "Co-branding en eventos",
      "Talleres in-house",
    ],
    cta: "Contáctanos",
    featured: true,
  },
  {
    id: "institucion_educativa",
    category: "instituciones",
    name: "Institución educativa / gremio",
    audience: "Universidad, gremio o cámara de comercio",
    price: "$4.500.000",
    priceQualifier: "COP / año",
    benefits: [
      "Co-branding en eventos ACIA",
      "Sesiones co-organizadas",
      "Representación en junta consultiva",
      "Conexión con talento",
    ],
    cta: "Quiero afiliarme",
  },
];

export const ENTERPRISE_NOTE =
  "Todas las empresas afiliadas tienen acceso a los webinars quincenales ACIA para su equipo. Los talleres especializados se ofrecen por separado con descuento según el plan.";

export const STRATEGIC_ALLY = {
  label: "Aliado estratégico",
  title: "¿Representas una entidad pública o embajada?",
  price: "Sin tarifa",
  description:
    "Las entidades públicas y embajadas se vinculan como aliados estratégicos. El modelo se define caso a caso.",
  cta: "Contáctanos",
} as const;
