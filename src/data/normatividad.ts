export type RegulatoryCategory =
  | "Política pública"
  | "Normas vigentes"
  | "Protección de datos"
  | "Jurisprudencia"
  | "Proyectos de ley"
  | "Histórico legislativo";

export interface RegulatoryRecord {
  title: string;
  identifier: string;
  year: number;
  type: string;
  authority: string;
  category: RegulatoryCategory;
  status: string;
  summary: string;
  officialUrl: string;
  verifiedAt: string;
}

const verifiedAt = "2026-08-10";

export const REGULATORY_RECORDS: RegulatoryRecord[] = [
  {
    title: "Política Nacional de Inteligencia Artificial",
    identifier: "CONPES 4144 de 2025",
    year: 2025,
    type: "Documento CONPES",
    authority: "Departamento Nacional de Planeación",
    category: "Política pública",
    status: "Política vigente / documento CONPES aprobado",
    summary: "Define la política nacional para el desarrollo y la adopción responsable de la inteligencia artificial en Colombia.",
    officialUrl: "https://colaboracion.dnp.gov.co/CDT/Conpes/Econ%C3%B3micos/4144.pdf",
    verifiedAt,
  },
  {
    title: "Política Nacional para la Transformación Digital y la Inteligencia Artificial",
    identifier: "CONPES 3975 de 2019",
    year: 2019,
    type: "Documento CONPES",
    authority: "Departamento Nacional de Planeación",
    category: "Política pública",
    status: "Antecedente de política pública",
    summary: "Antecedente de política pública sobre transformación digital e inteligencia artificial en Colombia.",
    officialUrl: "https://www.dnp.gov.co/LaEntidad_/subdireccion-general-prospectiva-desarrollo-nacional/direccion-desarrollo-digital/Paginas/Documentos-Conpes.aspx",
    verifiedAt,
  },
  {
    title: "Disposiciones generales para la protección de datos personales",
    identifier: "Ley 1581 de 2012",
    year: 2012,
    type: "Ley",
    authority: "Congreso de Colombia / SUIN-Juriscol",
    category: "Protección de datos",
    status: "Vigente",
    summary: "Establece el régimen general colombiano para la protección y el tratamiento de datos personales.",
    officialUrl: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981",
    verifiedAt,
  },
  {
    title: "Lineamientos sobre tratamiento de datos personales en sistemas de Inteligencia Artificial",
    identifier: "Circular Externa 002 de 2024",
    year: 2024,
    type: "Circular externa",
    authority: "Superintendencia de Industria y Comercio",
    category: "Protección de datos",
    status: "Expedida el 21 de agosto de 2024",
    summary: "Presenta lineamientos para el tratamiento de datos personales en sistemas de inteligencia artificial.",
    officialUrl: "https://sedeelectronica.sic.gov.co/transparencia/normativa/circular-externa-2-de-2024-de-la-superintendencia-de-industria-y-comercio-lineamientos-sobre-el-tratamiento-de-datos",
    verifiedAt,
  },
  {
    title: "Agravante de falsedad personal por uso de Inteligencia Artificial",
    identifier: "Ley 2502 de 2025",
    year: 2025,
    type: "Ley",
    authority: "Congreso de Colombia",
    category: "Normas vigentes",
    status: "Vigente",
    summary: "Modifica el artículo 296 del Código Penal e incorpora un agravante de falsedad personal cuando se utiliza inteligencia artificial.",
    officialUrl: "https://www.secretariasenado.gov.co/senado/basedoc/ley_2502_2025.html",
    verifiedAt,
  },
  {
    title: "Uso de IA generativa en procesos judiciales",
    identifier: "Sentencia T-323 de 2024",
    year: 2024,
    type: "Sentencia",
    authority: "Corte Constitucional",
    category: "Jurisprudencia",
    status: "Providencia publicada",
    summary: "Aborda la no sustitución de la racionalidad humana y principios de transparencia, responsabilidad y privacidad en el uso judicial de IA generativa.",
    officialUrl: "https://www.corteconstitucional.gov.co/relatoria/2024/t-323-24.htm",
    verifiedAt,
  },
  {
    title: "IA generativa en la elaboración y motivación de actos administrativos",
    identifier: "Sentencia T-008 de 2026",
    year: 2026,
    type: "Sentencia",
    authority: "Corte Constitucional",
    category: "Jurisprudencia",
    status: "Providencia publicada",
    summary: "Examina el uso de IA generativa en la elaboración y motivación de actos administrativos y las competencias de control judicial.",
    officialUrl: "https://www.corteconstitucional.gov.co/relatoria/2026/T-008-26.htm",
    verifiedAt,
  },
  {
    title: "Control constitucional relacionado con la Ley 2502 de 2025",
    identifier: "Comunicado 23 del 15 de julio de 2026",
    year: 2026,
    type: "Comunicado de decisión",
    authority: "Corte Constitucional",
    category: "Jurisprudencia",
    status: "Decisión divulgada",
    summary: "La Corte declaró exequible, por el cargo analizado, el agravante relacionado con el uso de IA en falsedad personal.",
    officialUrl: "https://www.corteconstitucional.gov.co/comunicados/comunicado-23-julio-15-de-2026.pdf",
    verifiedAt,
  },
  {
    title: "Por medio de la cual se regula la inteligencia artificial en Colombia para garantizar su desarrollo ético y responsable y se dictan otras disposiciones",
    identifier: "Proyecto de Ley 025/2026C",
    year: 2026,
    type: "Proyecto de ley",
    authority: "Cámara de Representantes · Comisión Sexta Constitucional Permanente",
    category: "Proyectos de ley",
    status: "RADICADO",
    summary: "Iniciativa de origen Cámara, legislatura 2026–2027, radicada el 21 de julio de 2026.",
    officialUrl: "https://www.camara.gov.co/inteligencia-artificial-2/",
    verifiedAt,
  },
  {
    title: "Proyecto legislativo sobre inteligencia artificial",
    identifier: "Proyecto 324/2025C - 043/2025S",
    year: 2025,
    type: "Proyecto de ley",
    authority: "Congreso de Colombia",
    category: "Histórico legislativo",
    status: "ARCHIVADO · artículo 190 de la Ley 5 de 1992",
    summary: "Antecedente legislativo archivado; no corresponde a un proyecto vigente.",
    officialUrl: "https://www.camara.gov.co/inteligencia-artificial/",
    verifiedAt,
  },
];
