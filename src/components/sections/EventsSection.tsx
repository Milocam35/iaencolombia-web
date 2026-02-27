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

      <div className="relative z-10 mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
