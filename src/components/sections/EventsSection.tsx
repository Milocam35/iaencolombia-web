"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FloatingDots } from "@/components/ui/FloatingDots";
import { EVENTS } from "@/lib/constants";

const categoryData = [
  {
    image: "/sections/Convocatorias1.webp",
    description: "Participa en convocatorias exclusivas para afiliados.",
  },
  {
    image: "/sections/Eventos.webp",
    description: "Conferencias, talleres y encuentros del ecosistema.",
  },
  {
    image: "/sections/Mesas.webp",
    description: "Espacios de trabajo técnico y análisis sectorial.",
  },
  {
    image: "/sections/International.webp",
    description: "Cooperación bilateral y conexiones globales.",
  },
];

export function EventsSection() {
  return (
    <SectionWrapper id="eventos" className="overflow-hidden bg-surface">
      <FloatingDots />

      <div className="relative z-10 text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Oportunidades
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {EVENTS.title}
        </h2>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 mt-12 overflow-hidden rounded-3xl bg-dark shadow-2xl shadow-primary/10 ring-1 ring-white/10"
      >
        <div className="pointer-events-none absolute -top-32 -left-24 size-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-32 size-80 rounded-full bg-primary/50 blur-3xl" />

        <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-10 lg:p-10">
          <div className="flex flex-col items-start">
            <div className="mb-6 h-px w-16 bg-accent" />
            <p className="text-xs font-bold tracking-[0.18em] text-accent uppercase">
              {EVENTS.featured.eyebrow}
            </p>
            <h3 className="mt-4 max-w-lg text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              {EVENTS.featured.title}
            </h3>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              {EVENTS.featured.description}
            </p>
            <p className="mt-5 border-l-2 border-accent pl-4 text-sm font-semibold leading-6 text-white">
              {EVENTS.featured.details}
            </p>
            <a
              href={EVENTS.featured.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-dark transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
            >
              Conoce el Congreso
              <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {[
              {
                src: "/events/america-digital-invitacion.jpg",
                alt: "Invitación de ACIA al Congreso Latinoamericano América Digital 2026",
              },
              {
                src: "/events/america-digital-beneficio.jpg",
                alt: "Beneficio del 40 por ciento para delegaciones afiliadas a ACIA",
              },
            ].map((piece, index) => (
              <motion.figure
                key={piece.src}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15 + index * 0.12 }}
                className={`relative aspect-[4/5] overflow-hidden rounded-xl bg-white/5 shadow-xl ring-1 ring-white/15 ${
                  index === 1 ? "mt-6 sm:mt-10" : "mb-6 sm:mb-10"
                }`}
              >
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 28vw"
                />
              </motion.figure>
            ))}
          </div>
        </div>
      </motion.article>

      <div className="relative z-10 mt-16 text-center">
        <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
          Más oportunidades ACIA
        </p>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EVENTS.categories.map((category, i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md"
          >
            {/* Card image header */}
            <div className="relative h-40 overflow-hidden">
              <Image
                src={categoryData[i].image}
                alt={category}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Card body */}
            <div className="p-5">
              <h3 className="text-sm font-bold text-foreground">
                {category}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {categoryData[i].description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Próximamente
                <svg className="size-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
