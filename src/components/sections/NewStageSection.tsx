"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CircuitPattern } from "@/components/ui/CircuitPattern";
import { NEW_STAGE } from "@/lib/constants";

export function NewStageSection() {
  return (
    <SectionWrapper id="nueva-etapa" className="overflow-hidden">
      {/* Circuit traces from all edges */}
      <CircuitPattern />

      {/* Top divider */}
      <div className="relative z-10 mb-16 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Nueva etapa
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-stretch">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl"
        >
          <Image
            src="/sections/NewStage.webp"
            alt="Nueva etapa — IA y humanidad conectadas"
            width={640}
            height={640}
            className="size-full object-cover"
          />
        </motion.div>

        {/* Right: Title + Points (no background) */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {NEW_STAGE.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {NEW_STAGE.intro}
          </p>

          <p className="mt-8 text-sm font-semibold tracking-wide text-primary uppercase">
            {NEW_STAGE.subtitle}
          </p>

          <ul className="mt-4 space-y-3">
            {NEW_STAGE.points.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-3 text-base text-foreground"
              >
                <svg
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {point}
              </motion.li>
            ))}
          </ul>

          <div className="mt-6 h-px bg-gradient-to-r from-primary/30 via-accent/15 to-transparent" />
          <p className="mt-4 text-sm font-semibold text-primary">
            {NEW_STAGE.closing}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
