import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AffiliationForm } from "@/components/forms/AffiliationForm";

export const metadata: Metadata = {
  title: "Afíliate a ACIA | Asociación Colombiana de Inteligencia Artificial",
  description: "Registra tu interés en vincularte a la comunidad ACIA.",
};

export default async function AffiliationPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[]; type?: string | string[] }>;
}) {
  const params = await searchParams;
  const plan = typeof params.plan === "string" ? params.plan : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-surface pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 gradient-mesh" />
        <div className="pointer-events-none absolute top-24 -right-36 size-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-screen-xl gap-10 px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
          <section className="lg:sticky lg:top-32">
            <Link href="/#planes" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent">
              <span aria-hidden="true">←</span> Ver planes y beneficios
            </Link>
            <p className="mt-10 font-mono text-xs font-bold tracking-[0.22em] text-primary/60 uppercase">Vinculación ACIA</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              Quiero ser parte de <span className="text-primary">ACIA</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Déjanos tus datos y te contactaremos para continuar el proceso de vinculación.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[["01", "Cuéntanos quién eres"], ["02", "Elige tu plan de interés"], ["03", "Nuestro equipo continuará el proceso"]].map(([number, text]) => (
                <div key={number} className="flex items-center gap-4 rounded-xl border border-primary/10 bg-white/70 p-4 backdrop-blur">
                  <span className="font-mono text-xs font-bold text-accent">{number}</span><span className="text-sm font-semibold text-primary">{text}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs leading-5 text-muted-foreground">Este formulario registra una solicitud de contacto. No crea una membresía ni genera cobros.</p>
          </section>
          <AffiliationForm initialPlan={plan} initialType={type} />
        </div>
      </main>
      <Footer />
    </>
  );
}
