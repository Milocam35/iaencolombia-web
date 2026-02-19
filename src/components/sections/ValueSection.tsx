"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CircuitPattern } from "@/components/ui/CircuitPattern";
import { Button } from "@/components/ui/Button";
import { VALUE_PROPOSITION } from "@/lib/constants";

function TypewriterLine({
  text,
  delay,
  speed = 30,
  started,
}: {
  text: string;
  delay: number;
  speed?: number;
  started: boolean;
}) {
  const [displayed, setDisplayed] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(timeout);
  }, [started, delay]);

  useEffect(() => {
    if (!active) return;
    if (displayed.length >= text.length) return;
    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [active, displayed, text, speed]);

  if (!active) return null;

  return (
    <div className="flex items-start gap-3 font-mono text-sm">
      <span className="select-none text-accent/60">&gt;</span>
      <span className="text-white">
        {displayed}
        {displayed.length < text.length && (
          <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent align-middle" />
        )}
      </span>
    </div>
  );
}

export function ValueSection() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(terminalRef, { once: true, margin: "-100px" });

  return (
    <SectionWrapper id="valor" className="overflow-hidden">
      <CircuitPattern />

      <div className="relative z-10 grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Left: Content */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Para afiliados
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {VALUE_PROPOSITION.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {VALUE_PROPOSITION.description}
          </p>
          <div className="mt-8">
            <Button href={VALUE_PROPOSITION.cta.href} size="lg">
              {VALUE_PROPOSITION.cta.label}
            </Button>
          </div>
        </div>

        {/* Right: Terminal-style benefits */}
        <motion.div
          ref={terminalRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border bg-dark shadow-lg"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="size-3 rounded-full bg-red-400/80" />
            <span className="size-3 rounded-full bg-yellow-400/80" />
            <span className="size-3 rounded-full bg-green-400/80" />
            <span className="ml-3 text-xs font-medium text-white/40 font-mono">
              beneficios_acia.sh
            </span>
          </div>

          {/* Terminal body */}
          <div className="space-y-3 p-6 text-white/90">
            <div className="mb-4 font-mono text-xs text-accent/70">
              # {VALUE_PROPOSITION.subtitle}
            </div>
            {VALUE_PROPOSITION.benefits.map((benefit, i) => (
              <TypewriterLine
                key={benefit}
                text={benefit}
                delay={i * 800}
                speed={25}
                started={isInView}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
