import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PublicPage } from "@/components/layout/PublicPage";
import { COMMUNICATIONS, formatCommunicationDate } from "@/data/communications";

export const metadata: Metadata = {
  title: "Comunicados oficiales | ACIA",
  description: "Comunicados institucionales, pronunciamientos técnicos y posiciones públicas de ACIA.",
};

export default function CommunicationsPage() {
  const communications = [...COMMUNICATIONS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PublicPage eyebrow="Actualidad" title="Comunicados ACIA" description="Canal oficial para comunicados institucionales, pronunciamientos técnicos, posiciones públicas e información dirigida a nuestra comunidad.">
      {communications.length === 0 ? (
        <EmptyState title="Archivo oficial"><p>No hay comunicados publicados en este momento. Este espacio mostrará únicamente contenidos institucionales formalmente emitidos por ACIA.</p></EmptyState>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {communications.map((item) => <article key={item.slug} className="rounded-2xl border border-border bg-white p-7"><p className="font-mono text-xs font-bold text-accent">{formatCommunicationDate(item.date)}</p><h2 className="mt-4 text-xl font-extrabold text-primary">{item.title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{item.summary}</p><Link href={`/comunicados/${item.slug}`} className="mt-6 inline-flex text-sm font-bold text-primary">Leer comunicado →</Link></article>)}
        </div>
      )}
    </PublicPage>
  );
}
