import Image from "next/image";
import Link from "next/link";
import { SECTOR_TABLES_PATH } from "@/data/sectorTables";
import styles from "@/components/sectorTables/SectorTables.module.css";

export function SectorTablesSection() {
  return (
    <section id="mesas-tecnicas-sectoriales" className={styles.home} aria-labelledby="mesas-home-title">
      <div className={`site-container ${styles.homeInner}`}>
        <div className={styles.homePhoto}>
          <Image
            src="/images/mesas-publicas/colaboracion.webp"
            alt="Profesionales colaborando en una propuesta, en una escena editorial ilustrativa."
            fill
            sizes="(max-width: 640px) 100vw, 55vw"
          />
        </div>
        <div className={styles.homeCopy}>
          <p className={styles.homeEyebrow}>Mesas técnicas sectoriales</p>
          <h2 id="mesas-home-title" className={styles.homeTitle}>De las ideas a las propuestas que Colombia necesita</h2>
          <p className={styles.homeDescription}>Participa como afiliado en las mesas técnicas sectoriales de ACIA y contribuye a construir propuestas que llevaremos ante las instituciones del Estado para impulsar políticas públicas y una inteligencia artificial al servicio de Colombia.</p>
          <Link href={SECTOR_TABLES_PATH} className={`action action-cyan ${styles.homeAction}`}>
            Conoce las seis mesas <span aria-hidden="true">→</span>
          </Link>
        </div>
        <span className={styles.homeImageNote}>Imagen ilustrativa</span>
      </div>
    </section>
  );
}
