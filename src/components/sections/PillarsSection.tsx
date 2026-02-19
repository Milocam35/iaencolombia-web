"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FloatingDots } from "@/components/ui/FloatingDots";
import { PILLARS } from "@/lib/constants";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export function PillarsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current],
  );

  const next = useCallback(() => go((current + 1) % PILLARS.length), [current, go]);
  const prev = useCallback(
    () => go((current - 1 + PILLARS.length) % PILLARS.length),
    [current, go],
  );

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const pillar = PILLARS[current];

  return (
    <SectionWrapper id="pilares" className="overflow-hidden bg-surface">
      <FloatingDots />
      <div className="relative z-10 text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Nuestra esencia
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          ¿Qué es ACIA?
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative z-10 mt-16">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                  {current + 1} / {PILLARS.length}
                </span>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {pillar.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-3 -translate-y-1/2 flex size-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-card hover:shadow-md"
          aria-label="Anterior"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-3 -translate-y-1/2 flex size-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-card hover:shadow-md"
          aria-label="Siguiente"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {PILLARS.map((p, i) => (
            <button
              key={p.title}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Ir a ${p.title}`}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
