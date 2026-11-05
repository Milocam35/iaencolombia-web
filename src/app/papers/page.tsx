import type { Metadata } from "next";
import { EmptyState, PublicPage } from "@/components/layout/PublicPage";
import { PUBLICATIONS, PUBLICATION_TYPES } from "@/data/papers";
import { PublicationCard } from "@/components/papers/PublicationCard";

export const metadata: Metadata = {
  title: "Papers y publicaciones ACIA",
  description: "Repositorio institucional de investigación, análisis técnico y documentos de política pública de ACIA.",
  alternates: { canonical: "https://www.iaencolombia.org/papers" },
  openGraph: {
    type: "website",
    title: PUBLICATIONS[0]?.title ?? "Papers y publicaciones ACIA",
    description: PUBLICATIONS[0]?.abstract ?? "Publicaciones de ACIA.",
    url: "https://www.iaencolombia.org/papers",
    siteName: "ACIA",
    locale: "es_CO",
    images: [{ url: "https://www.iaencolombia.org/papers/gobernanza-ia-infraestructura-economica-portada.png", alt: "Portada original del paper de ACIA" }],
  },
  twitter: {
    card: "summary",
    title: PUBLICATIONS[0]?.title ?? "Papers y publicaciones ACIA",
    description: "Gobernanza de IA, riesgos sistémicos y confianza en los mercados. Paper de ACIA disponible en MPRA.",
    images: ["https://www.iaencolombia.org/papers/gobernanza-ia-infraestructura-economica-portada.png"],
  },
};

export default function PapersPage() {
  return (
    <PublicPage eyebrow="Conocimiento ACIA" title="Papers y publicaciones ACIA" description="Repositorio institucional para investigación, análisis técnico y documentos orientados a fortalecer las decisiones sobre inteligencia artificial.">
      <section aria-labelledby="publication-types-title">
        <h2 id="publication-types-title" className="text-2xl font-extrabold text-primary sm:text-3xl">Colecciones editoriales</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PUBLICATION_TYPES.map((type, index) => {
            const count = PUBLICATIONS.filter(publication => publication.publicationType === type.label).length;
            return (
            <article key={type.label} className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <span className="font-mono text-xs font-bold text-accent">0{index + 1}</span>
              <h3 className="mt-4 font-bold text-primary">{count > 0 ? <a href={`#${type.slug}`} className="underline decoration-accent underline-offset-4">{type.label}s</a> : `${type.label}s`}</h3>
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">{type.prefix}</p>
              <p className="mt-3 text-xs text-muted-foreground">{count === 1 ? "1 publicación" : `${count} publicaciones`}</p>
            </article>
          ); })}
        </div>
      </section>
      {PUBLICATION_TYPES.map(type => {
        const publications = PUBLICATIONS.filter(publication => publication.publicationType === type.label);
        return publications.length > 0 && <section id={type.slug} aria-labelledby={`${type.slug}-title`} key={type.slug} className="mt-14 space-y-6">
          <h2 id={`${type.slug}-title`} className="text-2xl font-extrabold text-primary sm:text-3xl">{type.label}s</h2>
          {publications.map(publication => <PublicationCard key={publication.slug} publication={publication} />)}
        </section>;
      })}
      {PUBLICATIONS.some(publication => !publication.publicationType) && <section aria-label="Otros papers de ACIA" className="mt-14 space-y-8">
        {PUBLICATIONS.filter(publication => !publication.publicationType).map(publication => <PublicationCard key={publication.slug} publication={publication} />)}
      </section>}
      {PUBLICATIONS.length === 0 && <div className="mt-12"><EmptyState title="Repositorio institucional en preparación"><p>Aún no hay publicaciones cargadas. Los documentos aparecerán aquí con autoría, resumen, versión, identificador ACIA y condiciones de revisión claramente indicadas.</p></EmptyState></div>}
    </PublicPage>
  );
}
