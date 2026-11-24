import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicPage";
import { SectorTablesAccordion } from "@/components/sectorTables/SectorTablesAccordion";
import { SectorTablesCallToAction } from "@/components/sectorTables/SectorTablesCallToAction";
import styles from "@/components/sectorTables/SectorTables.module.css";

export const metadata: Metadata = {
  title: "Mesas técnicas sectoriales | ACIA",
  description: "Seis espacios para aportar conocimiento, construir propuestas y contribuir al desarrollo responsable de la inteligencia artificial en Colombia.",
  robots: { index: false, follow: false },
};

export default function SectorTablesPublicPage() {
  return (
    <div className={styles.page}>
      <PublicPage
        eyebrow="Conocimiento que se convierte en propuestas"
        title="Mesas técnicas sectoriales"
        description="Seis espacios para aportar conocimiento, construir propuestas y contribuir al desarrollo responsable de la inteligencia artificial en Colombia."
      >
        <p className={styles.reviewNote}><span className={styles.reviewDot} aria-hidden="true" />Propuesta local para revisión visual y editorial</p>
        <SectorTablesCallToAction />
        <div className={styles.sectionHeading}>
          <h2>Encuentra dónde aportar</h2>
          <p>Abre una mesa para conocer su objetivo e impacto esperado.</p>
        </div>
        <SectorTablesAccordion />
        <p className={styles.photoNote}>Imágenes ilustrativas generadas para esta propuesta. No representan participantes reales ni respaldo institucional.</p>
        <p className={styles.scope}>Los impactos descritos son expectativas de trabajo. La presentación de propuestas ante las instituciones no implica su adopción ni garantiza cambios normativos.</p>
        <SectorTablesCallToAction final />
      </PublicPage>
    </div>
  );
}
