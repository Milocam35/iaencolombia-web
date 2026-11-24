import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicPage";
import { SectorTablesAccordion } from "@/components/sectorTables/SectorTablesAccordion";
import { SectorTablesCallToAction } from "@/components/sectorTables/SectorTablesCallToAction";
import styles from "@/components/sectorTables/SectorTables.module.css";

export const metadata: Metadata = {
  title: "Mesas técnicas sectoriales | ACIA",
  description: "Seis espacios para aportar conocimiento, construir propuestas y contribuir al desarrollo responsable de la inteligencia artificial en Colombia.",
  alternates: { canonical: "https://www.iaencolombia.org/mesas-tecnicas-sectoriales" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Mesas técnicas sectoriales | ACIA",
    description: "Seis espacios para aportar conocimiento, construir propuestas y contribuir al desarrollo responsable de la inteligencia artificial en Colombia.",
    url: "https://www.iaencolombia.org/mesas-tecnicas-sectoriales",
    siteName: "ACIA",
    locale: "es_CO",
    type: "website",
    images: [{ url: "https://www.iaencolombia.org/images/mesas-publicas/colaboracion.webp", width: 1400, height: 788, alt: "Escena ilustrativa de profesionales colaborando en una propuesta." }],
  },
};

export default function SectorTablesPublicPage() {
  return (
    <div className={styles.page}>
      <PublicPage
        eyebrow="Conocimiento que se convierte en propuestas"
        title="Mesas técnicas sectoriales"
        description="Seis espacios para aportar conocimiento, construir propuestas y contribuir al desarrollo responsable de la inteligencia artificial en Colombia."
      >
        <SectorTablesCallToAction />
        <div className={styles.sectionHeading}>
          <h2>Encuentra dónde aportar</h2>
          <p>Abre una mesa para conocer su objetivo e impacto esperado.</p>
        </div>
        <SectorTablesAccordion />
        <p className={styles.photoNote}>Imágenes ilustrativas generadas con IA. No representan participantes reales ni respaldo institucional.</p>
        <p className={styles.scope}>Los impactos descritos son expectativas de trabajo. La presentación de propuestas ante las instituciones no implica su adopción ni garantiza cambios normativos.</p>
        <SectorTablesCallToAction final />
      </PublicPage>
    </div>
  );
}
