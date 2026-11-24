import Link from "next/link";
import { AFFILIATION_PATH, MEMBER_PORTAL_URL } from "@/lib/config";
import styles from "./SectorTables.module.css";

export function SectorTablesCallToAction({ final = false }: { final?: boolean }) {
  return (
    <section className={`${styles.cta} ${final ? styles.ctaFinal : ""}`} aria-label="Participar en las mesas de ACIA">
      <div>
        <h2>Afíliate e incide en el desarrollo de la IA en Colombia</h2>
        <p>Aporta tu experiencia y participa en la construcción de propuestas para el país.</p>
      </div>
      <div className={styles.ctaLinks}>
        <Link href={AFFILIATION_PATH} className={`action ${final ? "action-cyan" : "action-primary"} ${styles.primaryLink}`}>
          Conoce los planes y afíliate <span aria-hidden="true">→</span>
        </Link>
        <a href={MEMBER_PORTAL_URL} className={styles.portalLink}>Ya soy afiliado: ingresar a Mi ACIA</a>
        <p className={styles.planNote}>Participación en las mesas según los beneficios de tu plan.</p>
      </div>
    </section>
  );
}
