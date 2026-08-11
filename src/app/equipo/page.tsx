import type { Metadata } from "next";
import { EmptyState, PublicPage } from "@/components/layout/PublicPage";
import { TEAM_CATEGORIES, TEAM_MEMBERS } from "@/data/team";

export const metadata: Metadata = {
  title: "Equipo institucional | ACIA",
  description: "Estructura del equipo institucional de la Asociación Colombiana de Inteligencia Artificial.",
  robots: { index: false, follow: false },
};

export default function TeamPage() {
  return (
    <PublicPage eyebrow="Institución" title="Equipo ACIA" description="Una estructura preparada para presentar, con información verificada, a las personas que sirven a la misión institucional de ACIA.">
      <div className="grid gap-6">
        {TEAM_CATEGORIES.map((category) => {
          const members = TEAM_MEMBERS.filter((member) => member.category === category.id);
          return (
            <section key={category.id} className="rounded-2xl border border-border bg-white p-7 sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-extrabold text-primary sm:text-2xl">{category.label}</h2>
                <span className="font-mono text-xs text-muted-foreground">{members.length.toString().padStart(2, "0")}</span>
              </div>
              {members.length === 0 && <p className="mt-4 text-sm leading-6 text-muted-foreground">Los perfiles de esta categoría se publicarán cuando cuenten con información institucional verificada.</p>}
            </section>
          );
        })}
      </div>
      {TEAM_MEMBERS.length === 0 && <div className="mt-8"><EmptyState title="Perfiles en preparación"><p>Esta página no presenta personas, cargos ni fotografías de ejemplo. Su publicación pública se habilitará cuando existan perfiles autorizados.</p></EmptyState></div>}
    </PublicPage>
  );
}
