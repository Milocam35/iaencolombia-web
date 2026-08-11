"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CAPABILITIES, ROADMAP } from "@/lib/constants";
import { ACIA_OBSERVATORIO_URL, ACIA_PAPERS_URL } from "@/lib/config";
import { COMMUNICATIONS, formatCommunicationDate } from "@/data/communications";

export function CapabilitiesSection() {
  return (
    <SectionWrapper id="que-hacemos" className="bg-dark text-white">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-accent uppercase">Qué hacemos</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Articulamos capacidades para transformar la IA en desarrollo.</h2>
          <p className="mt-6 text-base leading-8 text-white/60">Reunimos conocimiento, talento, empresas, Estado, academia y sociedad civil para impulsar una inteligencia artificial productiva, inclusiva, ética y sostenible.</p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
          {CAPABILITIES.map((capability, index) => (
            <motion.article key={capability.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="bg-dark p-6 sm:p-7">
              <span className="font-mono text-[10px] font-bold text-accent/70">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-base font-bold text-white">{capability.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{capability.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export function RoadmapSection() {
  return (
    <SectionWrapper id="hoja-de-ruta" className="overflow-hidden bg-surface">
      <div className="max-w-3xl">
        <p className="text-xs font-bold tracking-[0.24em] text-primary/60 uppercase">ACIA 2046</p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">Nuestra hoja de ruta</h2>
        <p className="mt-5 text-base leading-7 text-muted-foreground">Desde su fundación en 2024, ACIA proyecta una construcción institucional sostenida al servicio de Colombia y la región.</p>
      </div>
      <ol className="relative mt-12 grid gap-5 lg:grid-cols-5 lg:gap-0">
        <div className="absolute top-5 right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-primary/10 via-accent to-primary/10 lg:block" aria-hidden="true" />
        {ROADMAP.map((phase, index) => (
          <li key={phase.period} className="relative rounded-xl border border-border bg-white p-6 shadow-sm lg:border-0 lg:bg-transparent lg:px-4 lg:shadow-none">
            <span className="relative z-10 flex size-10 items-center justify-center rounded-full border-4 border-surface bg-primary font-mono text-xs font-bold text-white">{index + 1}</span>
            <p className="mt-5 font-mono text-xs font-bold text-accent">{phase.period}</p>
            <h3 className="mt-2 text-lg font-extrabold text-primary">{phase.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{phase.description}</p>
          </li>
        ))}
      </ol>
    </SectionWrapper>
  );
}

const knowledgeLinks = [
  { number: "01", title: "Observatorio IA Colombia", description: "Una capacidad pública en desarrollo para comprender el ecosistema nacional.", href: ACIA_OBSERVATORIO_URL },
  { number: "02", title: "Papers y publicaciones", description: "Investigación y análisis técnico con trazabilidad editorial institucional.", href: ACIA_PAPERS_URL },
  { number: "03", title: "Marco de IA en Colombia", description: "Seguimiento informativo a política pública, normas y jurisprudencia.", href: "/normatividad" },
];

export function KnowledgeSection() {
  return (
    <SectionWrapper id="conocimiento" className="bg-white">
      <div className="max-w-3xl">
        <p className="text-xs font-bold tracking-[0.24em] text-primary/60 uppercase">Conocimiento ACIA</p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">Conocimiento para tomar mejores decisiones sobre IA</h2>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {knowledgeLinks.map((item) => (
          <a key={item.title} href={item.href} className="group rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
            <span className="font-mono text-xs font-bold text-accent">{item.number}</span>
            <h3 className="mt-10 text-xl font-extrabold text-primary group-hover:text-accent">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            <span className="mt-8 inline-flex text-sm font-bold text-primary">Explorar <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></span>
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function CommunicationsSection() {
  const latest = [...COMMUNICATIONS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <SectionWrapper id="comunicados" className="bg-surface">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.24em] text-primary/60 uppercase">Actualidad</p><h2 className="mt-4 text-3xl font-extrabold text-primary sm:text-4xl">Comunicados ACIA</h2><p className="mt-4 text-base leading-7 text-muted-foreground">Consulta los pronunciamientos y la información oficial emitida por la Asociación.</p></div>
        <Link href="/comunicados" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-primary/20 px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white">Consultar comunicados oficiales</Link>
      </div>
      {latest.length > 0 && <div className="mt-10 grid gap-5 md:grid-cols-3">{latest.map((item) => <Link key={item.slug} href={`/comunicados/${item.slug}`} className="group rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"><p className="font-mono text-xs font-bold text-accent">{formatCommunicationDate(item.date)}</p><h3 className="mt-4 font-extrabold text-primary">{item.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{item.summary}</p><span className="mt-6 inline-flex text-sm font-bold text-primary">Leer comunicado <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></span></Link>)}</div>}
    </SectionWrapper>
  );
}
