import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CircuitPattern } from "@/components/ui/CircuitPattern";

interface PublicPageProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function PublicPage({ eyebrow, title, description, children }: PublicPageProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface pt-24">
        <section className="relative overflow-hidden bg-dark px-6 py-20 sm:py-24">
          <CircuitPattern />
          <div className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative mx-auto max-w-screen-xl">
            <Link href="/" className="text-xs font-semibold tracking-wide text-accent transition-colors hover:text-white">← Volver al inicio</Link>
            <p className="mt-10 font-mono text-xs font-bold tracking-[0.24em] text-accent uppercase">{eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 sm:text-lg">{description}</p>
          </div>
        </section>
        <div className="mx-auto max-w-screen-xl px-6 py-16 sm:py-20">{children}</div>
      </main>
      <Footer />
    </>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-8 shadow-sm sm:p-10">
      <div className="h-1 w-14 rounded-full bg-accent" />
      <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-primary">{title}</h2>
      <div className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{children}</div>
    </div>
  );
}
