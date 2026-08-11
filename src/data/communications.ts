export type CommunicationCategory =
  | "Comunicado institucional"
  | "Pronunciamiento técnico"
  | "Posición pública"
  | "Información a la comunidad";

export interface Communication {
  title: string;
  slug: string;
  date: string;
  category: CommunicationCategory;
  summary: string;
  content: string;
  authorName?: string;
  authorRole?: string;
  pdfUrl?: string;
  editorialNote?: string;
}

export function formatCommunicationDate(date: string) {
  const [year, month, day] = date.split("-");
  const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  return `${day} ${months[Number(month) - 1]} ${year}`;
}

export const COMMUNICATIONS: Communication[] = [
  {
    title: "Terremoto registrado en Colombia - 10 de agosto de 2026",
    slug: "terremoto-colombia-10-agosto-2026",
    date: "2026-08-10",
    category: "Comunicado institucional",
    summary: "La Asociación Colombiana de Inteligencia Artificial (ACIA) expresa su solidaridad con las personas, familias y comunidades afectadas por el terremoto registrado en Colombia el 10 de agosto de 2026 y hace un llamado al uso responsable de la tecnología y la inteligencia artificial durante la emergencia.",
    content: `COMUNICADO A LA OPINIÓN PÚBLICA

Bogotá, D. C., 10 de agosto de 2026

La Asociación Colombiana de Inteligencia Artificial (ACIA) expresa su solidaridad con las personas, familias y comunidades afectadas por el fuerte terremoto registrado en Colombia durante la mañana de este lunes 10 de agosto de 2026. De acuerdo con los reportes conocidos hasta el momento, el evento alcanzó una magnitud de 7,4 y tuvo su epicentro en San José del Palmar, Chocó, con afectaciones reportadas en distintas regiones del país.

Lamentamos profundamente la pérdida de vidas humanas y las afectaciones que empiezan a conocerse, y acompañamos a quienes hoy enfrentan momentos de incertidumbre, dolor o emergencia. Reconocemos igualmente la labor de los organismos de socorro, autoridades, personal de salud, Fuerza Pública, voluntarios y ciudadanos que participan en las acciones de atención y rescate.

En una situación de emergencia como esta, la tecnología y la inteligencia artificial deben estar al servicio de la vida, la información confiable y la coordinación.

Por ello, desde la ACIA hacemos un llamado especial a la ciudadanía, medios, creadores de contenido y comunidad tecnológica a:

- Consultar y compartir únicamente información proveniente de autoridades y fuentes verificadas.
- Evitar difundir imágenes, audios, videos o mensajes manipulados o generados con inteligencia artificial que puedan causar alarma, desinformación o interferir con las labores de emergencia.
- Utilizar las herramientas digitales de manera responsable para facilitar la ubicación de personas, la coordinación de ayudas y la difusión de instrucciones oficiales.

La ACIA pone a disposición de las autoridades y del ecosistema nacional de tecnología su capacidad de articulación para apoyar iniciativas que, mediante el uso responsable de datos e inteligencia artificial, puedan contribuir a la respuesta, recuperación y prevención frente a este tipo de emergencias.

Colombia necesita en este momento solidaridad, prudencia y cooperación. La tecnología debe ayudarnos a cuidar vidas, no a aumentar la incertidumbre.`,
    authorName: "Gustavo Adolfo Velandia Camacho",
    authorRole: "Presidente de la Asociación Colombiana de Inteligencia Artificial - ACIA",
    pdfUrl: "/comunicados/Comunicado_ACIA_Terremoto_10_Agosto_2026.pdf",
    editorialNote: "Información pública consultada con corte aproximado a las 11:15 a. m. del 10 de agosto de 2026. Las cifras y afectaciones pueden cambiar conforme avancen los reportes oficiales.",
  },
];
