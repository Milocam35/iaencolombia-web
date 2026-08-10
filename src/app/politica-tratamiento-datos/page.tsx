import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  PRIVACY_POLICY,
  PRIVACY_POLICY_DOCUMENT_VERSION,
  PRIVACY_POLICY_EFFECTIVE_DATE,
} from "@/lib/privacyPolicy";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales | ACIA",
  description:
    "Política de Tratamiento de Datos Personales de la Asociación Colombiana de Inteligencia Artificial – ACIA.",
  alternates: { canonical: "/politica-tratamiento-datos" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-surface pt-28 pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[linear-gradient(135deg,#041D77_0%,#06113d_64%,#080820_100%)]" />
        <div className="pointer-events-none absolute top-20 right-[8%] size-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute top-52 right-[18%] size-2 rounded-full bg-accent shadow-[0_0_35px_10px_rgba(78,199,240,0.25)]" />

        <header className="relative mx-auto max-w-screen-xl px-6 pt-12 pb-24 text-white sm:pt-16 sm:pb-28">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition hover:text-accent">
            <span aria-hidden="true">←</span> Volver a iaencolombia.org
          </Link>
          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <p className="font-mono text-xs font-bold tracking-[0.24em] text-accent uppercase">Documento institucional</p>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{PRIVACY_POLICY.title}</h1>
              <p className="mt-6 text-lg leading-8 text-white/65 sm:text-xl">{PRIVACY_POLICY.subtitle}</p>
            </div>
            <dl className="grid min-w-64 grid-cols-2 gap-x-7 gap-y-5 border-l border-white/15 pl-6 text-sm">
              <div><dt className="text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">Versión</dt><dd className="mt-1 font-semibold text-white">{PRIVACY_POLICY_DOCUMENT_VERSION}</dd></div>
              <div><dt className="text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">Vigencia</dt><dd className="mt-1 font-semibold text-white">{PRIVACY_POLICY_EFFECTIVE_DATE}</dd></div>
            </dl>
          </div>
        </header>

        <div className="relative mx-auto grid max-w-screen-xl gap-10 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
          <aside className="self-start lg:sticky lg:top-28">
            <nav aria-label="Contenido de la política" className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="mb-4 text-[10px] font-bold tracking-[0.2em] text-primary/50 uppercase">Contenido</p>
              <ol className="space-y-1.5">
                {PRIVACY_POLICY.sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="group flex gap-3 rounded-lg px-2 py-1.5 text-xs leading-5 text-muted-foreground transition hover:bg-secondary hover:text-primary">
                      <span className="font-mono text-[10px] font-bold text-accent">{String(index + 1).padStart(2, "0")}</span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="rounded-3xl border border-border bg-white px-6 py-10 shadow-xl shadow-primary/[0.04] sm:px-10 lg:px-14 lg:py-14">
            <div className="space-y-12">
              {PRIVACY_POLICY.sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-border pb-12 last:border-b-0 last:pb-0">
                  <div className="grid gap-4 sm:grid-cols-[48px_minmax(0,1fr)]">
                    <span className="font-mono text-sm font-bold text-accent" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-primary sm:text-2xl">{section.title}</h2>
                      <div className="mt-5 space-y-4">
                        {section.paragraphs.map((paragraph) => <p key={paragraph} className="text-[15px] leading-7 text-foreground/75 sm:text-base sm:leading-8">{paragraph}</p>)}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
