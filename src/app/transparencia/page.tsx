import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PublicPage } from "@/components/layout/PublicPage";

export const metadata: Metadata = {
  title: "Transparencia institucional | ACIA",
  description: "Información pública sobre la naturaleza, el propósito y el gobierno institucional de ACIA.",
};

export default function TransparencyPage() {
  return (
    <PublicPage eyebrow="ACIA institucional" title="Transparencia" description="Información pública para comprender la naturaleza, el propósito y los principios generales de gobierno de ACIA.">
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-white p-8">
          <h2 className="text-2xl font-extrabold text-primary">Naturaleza y propósito</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">La Asociación Colombiana de Inteligencia Artificial articula conocimiento, talento, empresas, Estado, academia y sociedad civil para impulsar una inteligencia artificial productiva, inclusiva, ética y sostenible.</p>
        </article>
        <article className="rounded-2xl border border-border bg-white p-8">
          <h2 className="text-2xl font-extrabold text-primary">Gobierno institucional</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">ACIA orienta su actuación mediante principios de transparencia, responsabilidad, participación y respeto por los derechos fundamentales.</p>
        </article>
      </div>
      <div className="mt-8 rounded-2xl bg-dark p-8 sm:p-10">
        <p className="text-sm leading-7 text-white/65">Consulta la información vigente sobre recolección, uso, circulación y protección de datos personales.</p>
        <Link href="/politica-tratamiento-datos" className="mt-5 inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-bold text-dark transition-colors hover:bg-white">Política de Tratamiento de Datos Personales</Link>
      </div>
      <div className="mt-8"><EmptyState title="Informes públicos"><p>Este espacio está estructurado para futuros informes formalmente aprobados y publicados. No contiene documentos internos, borradores ni información administrativa reservada.</p></EmptyState></div>
    </PublicPage>
  );
}
