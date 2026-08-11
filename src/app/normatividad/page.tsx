import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicPage";
import { REGULATORY_RECORDS, type RegulatoryCategory } from "@/data/normatividad";

export const metadata: Metadata = {
  title: "Marco de inteligencia artificial en Colombia | ACIA",
  description: "Repositorio informativo de política pública, normativa, jurisprudencia y proyectos legislativos sobre inteligencia artificial en Colombia.",
};

const categories: RegulatoryCategory[] = ["Política pública", "Normas vigentes", "Protección de datos", "Jurisprudencia", "Proyectos de ley", "Histórico legislativo"];

export default function RegulationsPage() {
  return (
    <PublicPage eyebrow="Seguimiento técnico" title="Marco de inteligencia artificial en Colombia" description="Colombia no cuenta actualmente con una única ley integral de inteligencia artificial. El marco relevante se compone de política pública, normas transversales, normas específicas, jurisprudencia y proyectos legislativos.">
      <aside className="rounded-xl border-l-4 border-accent bg-white p-6 shadow-sm">
        <p className="text-sm leading-7 text-muted-foreground">Este repositorio tiene fines informativos y de seguimiento técnico. No constituye asesoría jurídica. Para efectos legales debe consultarse el texto oficial y el estado de vigencia publicado por la autoridad competente.</p>
        <p className="mt-3 font-mono text-xs font-bold text-primary">Última verificación de fuentes: 10 de agosto de 2026.</p>
      </aside>
      <div className="mt-14 space-y-14">
        {categories.map((category) => {
          const records = REGULATORY_RECORDS.filter((record) => record.category === category);
          if (records.length === 0) return null;
          return (
            <section key={category} aria-labelledby={`category-${category.replaceAll(" ", "-")}`}>
              <div className="flex items-center gap-4">
                <h2 id={`category-${category.replaceAll(" ", "-")}`} className="text-2xl font-extrabold text-primary sm:text-3xl">{category}</h2>
                <span className="font-mono text-xs text-muted-foreground">{String(records.length).padStart(2, "0")}</span>
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {records.map((record) => (
                  <article key={record.identifier} className="flex flex-col rounded-2xl border border-border bg-white p-7 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide"><span className="rounded-full bg-primary/7 px-3 py-1 text-primary">{record.identifier}</span><span className="text-muted-foreground">{record.type}</span></div>
                    <h3 className="mt-5 text-xl font-extrabold leading-snug text-foreground">{record.title}</h3>
                    <p className="mt-3 text-xs font-semibold text-primary/70">{record.authority}</p>
                    <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{record.summary}</p>
                    <p className="mt-5 border-l-2 border-accent pl-3 text-xs font-bold text-foreground">Estado: {record.status}</p>
                    <a href={record.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent">Consultar fuente oficial <span aria-hidden="true">↗</span></a>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PublicPage>
  );
}
