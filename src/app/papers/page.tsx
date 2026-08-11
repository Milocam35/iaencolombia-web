import type { Metadata } from "next";
import { EmptyState, PublicPage } from "@/components/layout/PublicPage";
import { PUBLICATIONS, PUBLICATION_TYPES } from "@/data/papers";

export const metadata: Metadata = {
  title: "Papers y publicaciones ACIA",
  description: "Repositorio institucional de investigación, análisis técnico y documentos de política pública de ACIA.",
};

export default function PapersPage() {
  return (
    <PublicPage eyebrow="Conocimiento ACIA" title="Papers y publicaciones ACIA" description="Repositorio institucional para investigación, análisis técnico y documentos orientados a fortalecer las decisiones sobre inteligencia artificial.">
      <section aria-labelledby="publication-types-title">
        <h2 id="publication-types-title" className="text-2xl font-extrabold text-primary sm:text-3xl">Colecciones editoriales</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PUBLICATION_TYPES.map((type, index) => (
            <article key={type.label} className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <span className="font-mono text-xs font-bold text-accent">0{index + 1}</span>
              <h3 className="mt-4 font-bold text-primary">{type.label}s</h3>
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">{type.prefix}</p>
            </article>
          ))}
        </div>
      </section>
      {PUBLICATIONS.length === 0 && <div className="mt-12"><EmptyState title="Repositorio institucional en preparación"><p>Aún no hay publicaciones cargadas. Los documentos aparecerán aquí con autoría, resumen, versión, identificador ACIA y condiciones de revisión claramente indicadas.</p></EmptyState></div>}
    </PublicPage>
  );
}
