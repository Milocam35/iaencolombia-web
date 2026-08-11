import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicPage";

export const metadata: Metadata = {
  title: "Observatorio IA Colombia | ACIA",
  description: "Capacidad pública en desarrollo para producir información accionable sobre el ecosistema colombiano de inteligencia artificial.",
};

const lines = ["Adopción de IA", "Talento", "Investigación", "Inversión y emprendimiento", "Política pública y regulación", "Casos de uso", "Riesgos y gobernanza", "Territorios", "Inclusión", "Sostenibilidad"];
const products = ["Informe IA Colombia", "Boletines sectoriales", "Radar tecnológico", "Radar normativo", "Mapa de actores", "Datos e indicadores públicos"];

export default function ObservatoryPage() {
  return (
    <PublicPage eyebrow="Capacidad en desarrollo" title="Observatorio IA Colombia" description="ACIA está desarrollando una capacidad pública para producir información accionable sobre el ecosistema colombiano de inteligencia artificial.">
      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <p className="font-mono text-xs font-bold tracking-[0.2em] text-primary/60 uppercase">Líneas previstas</p>
          <h2 className="mt-3 text-3xl font-extrabold text-primary">Una lectura integral del ecosistema</h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {lines.map((line, index) => <li key={line} className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground"><span className="font-mono text-[10px] text-accent">{String(index + 1).padStart(2, "0")}</span>{line}</li>)}
          </ol>
        </section>
        <section className="rounded-2xl bg-dark p-8 text-white sm:p-10">
          <p className="font-mono text-xs font-bold tracking-[0.2em] text-accent uppercase">Productos proyectados</p>
          <h2 className="mt-3 text-3xl font-extrabold">Productos del Observatorio</h2>
          <p className="mt-4 text-sm leading-7 text-white/60">Estas líneas orientan el desarrollo futuro. No representan productos ya publicados ni datos disponibles.</p>
          <ul className="mt-8 divide-y divide-white/10">{products.map((product) => <li key={product} className="flex items-center gap-3 py-4 text-sm font-semibold"><span className="size-1.5 rounded-full bg-accent" />{product}</li>)}</ul>
        </section>
      </div>
    </PublicPage>
  );
}
