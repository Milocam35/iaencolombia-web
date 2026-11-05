import Image from "next/image";
import type { AciaPublication } from "@/data/papers";
import { PublicationCitation } from "./PublicationCitation";

const depositDate = (date: string) => new Intl.DateTimeFormat("es-CO", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

export function PublicationCard({ publication }: { publication: AciaPublication }) {
  const titleId = `paper-${publication.slug}`;
  return <article aria-labelledby={titleId} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
    <div className="h-1.5 bg-accent" />
    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12 lg:p-10">
      <div className="min-w-0">
        <p className="font-mono text-xs font-bold leading-6 tracking-wide text-primary">{publication.publicationType ?? "Paper de ACIA"} · Disponible en MPRA</p>
        <h3 id={titleId} className="mt-4 text-2xl font-extrabold leading-snug tracking-tight text-primary sm:text-3xl">{publication.title}</h3>
        <p className="mt-5 text-sm font-semibold leading-7 text-foreground">{publication.authors.join(" · ")}</p>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">{publication.institution}</p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-sm">
          {publication.aciaIdentifier && <div><dt className="text-xs font-semibold text-muted-foreground">Identificador ACIA</dt><dd className="mt-1 font-mono font-semibold text-primary">{publication.aciaIdentifier}</dd></div>}
          <div><dt className="text-xs font-semibold text-muted-foreground">Año</dt><dd className="mt-1 font-semibold text-primary">{publication.year}</dd></div>
          <div><dt className="text-xs font-semibold text-muted-foreground">Idioma</dt><dd className="mt-1 text-foreground">{publication.language}</dd></div>
          <div><dt className="text-xs font-semibold text-muted-foreground">Depósito en MPRA</dt><dd className="mt-1 text-foreground"><time dateTime={publication.depositedAt}>{depositDate(publication.depositedAt)}</time></dd></div>
        </dl>
        <p className="mt-5 text-sm font-bold text-primary">{publication.repository.identifier}</p>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">{publication.repository.name}</p>
        <h3 className="mt-7 text-sm font-bold text-primary">Resumen</h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">{publication.abstract}</p>
        <ul aria-label="Temas del paper" className="mt-6 flex flex-wrap gap-2">
          {publication.keywords.map(keyword => <li key={keyword} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary">{keyword}</li>)}
        </ul>
        <nav aria-label={`Acceso al documento: ${publication.title}`} className="mt-8 flex flex-wrap items-center gap-3">
          <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#031560]">Leer PDF<span className="sr-only"> (abre una pestaña nueva)</span></a>
          <a href={publication.pdfUrl} download className="rounded-lg border border-primary/20 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary">Descargar PDF</a>
          <a href={publication.repository.url} target="_blank" rel="noopener noreferrer" className="rounded-lg px-2 py-3 text-sm font-semibold text-primary underline decoration-accent underline-offset-4">Ver publicación en MPRA<span className="sr-only"> (abre una pestaña nueva)</span></a>
        </nav>
        <PublicationCitation citation={publication.citation} />
      </div>
      {publication.coverUrl && <figure className="mx-auto w-full max-w-[240px] self-start lg:sticky lg:top-28">
        <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-border bg-white shadow-sm" aria-label="Leer PDF desde su portada (abre una pestaña nueva)">
          <Image src={publication.coverUrl} alt={`Portada interna del documento original: ${publication.title}`} width={640} height={906} sizes="240px" className="h-auto w-full rounded-lg" />
        </a>
        <figcaption className="mt-3 text-center text-xs leading-5 text-muted-foreground">Portada del documento original</figcaption>
      </figure>}
    </div>
  </article>;
}
