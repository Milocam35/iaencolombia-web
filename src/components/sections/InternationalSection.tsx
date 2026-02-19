"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CircuitPattern } from "@/components/ui/CircuitPattern";
import { INTERNATIONAL } from "@/lib/constants";

const allies = ["Aliado 1", "Aliado 2", "Aliado 3", "Aliado 4", "Aliado 5", "Aliado 6", "Aliado 7", "Aliado 8"];

function AllyCard({ name }: { name: string }) {
  return (
    <div className="flex h-14 w-36 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground shadow-sm transition-colors duration-200 hover:border-primary/20 hover:text-foreground">
      {name}
    </div>
  );
}

export function InternationalSection() {
  return (
    <SectionWrapper id="internacional" className="overflow-hidden">
      <CircuitPattern />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Proyección global
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {INTERNATIONAL.title}
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          {INTERNATIONAL.description}
        </p>
      </div>

      {/* Marquee row */}
      <div className="relative z-10 mt-14 overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {/* Render list twice for seamless loop */}
          {[...allies, ...allies].map((ally, i) => (
            <AllyCard key={`${ally}-${i}`} name={ally} />
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
