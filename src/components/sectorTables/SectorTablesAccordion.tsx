"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { PUBLIC_SECTOR_TABLES } from "@/data/sectorTables";
import styles from "./SectorTables.module.css";

export function SectorTablesAccordion() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const pairs = [PUBLIC_SECTOR_TABLES.slice(0, 2), PUBLIC_SECTOR_TABLES.slice(2, 4), PUBLIC_SECTOR_TABLES.slice(4, 6)];

  return (
    <div className={styles.pairs} data-sector-accordion>
      {pairs.map((pair, row) => (
        <div className={styles.pair} key={pair[0].slug}>
          {pair.map((table, column) => {
            const open = expanded === table.slug;
            const panelId = `detalle-${table.slug}`;
            const titleId = `nombre-${table.slug}`;
            return (
              <Fragment key={table.slug}>
                <article className={`${styles.card} ${column === 0 ? styles.first : styles.second}`}>
                  <h2>
                    <button
                      type="button"
                      className={styles.cardButton}
                      aria-expanded={open}
                      aria-controls={panelId}
                      aria-labelledby={titleId}
                      aria-describedby={table.transversal ? `tipo-${table.slug}` : undefined}
                      onClick={() => setExpanded(open ? null : table.slug)}
                      data-sector={table.slug}
                    >
                      <Image src={table.image} alt={table.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 600px" style={{ objectPosition: table.imagePosition }} />
                      <span className={styles.cardNumber} aria-hidden="true">0{row * 2 + column + 1}</span>
                      {table.transversal && <span id={`tipo-${table.slug}`} className={styles.transversal}>Transversal</span>}
                      <span className={styles.cardCopy}>
                        <span id={titleId} className={styles.cardTitle}>{table.name}</span>
                        <span className={styles.expandIndicator} aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                        </span>
                      </span>
                    </button>
                  </h2>
                </article>
                <section id={panelId} className={styles.panel} hidden={!open} aria-labelledby={titleId}>
                  <div><h3>Objetivo</h3><p>{table.objective}</p></div>
                  <div><h3>Impacto esperado</h3><p>{table.expectedImpact}</p></div>
                </section>
              </Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
}
