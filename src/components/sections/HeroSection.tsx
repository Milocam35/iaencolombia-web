"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FloatingDots } from "@/components/ui/FloatingDots";
import { HERO } from "@/lib/constants";

function TypewriterText({
  text,
  delay = 0,
  speed = 40,
  className,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [started, displayed, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-primary align-middle animate-pulse ml-0.5" />
      )}
    </span>
  );
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8"
    >
      {/* Animated floating dots background */}
      <FloatingDots />

      {/* Soft radial gradients */}
      <div className="pointer-events-none absolute inset-0 gradient-mesh" />

      {/* Soft blue orbs */}
      <div className="pointer-events-none absolute -top-32 -right-32 size-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-[400px] rounded-full bg-accent/4 blur-[80px]" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
        >
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Nueva etapa institucional 2026
        </motion.div>

        {/* Logo — large, transparent background blends with white */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <Image
            src="/logos/LOGO ACIA TRANSPARENTE PARA FONDO BLANCO.png"
            alt="ACIA — Asociación Colombiana de Inteligencia Artificial"
            width={320}
            height={320}
            className="mx-auto"
            priority
          />
        </motion.div>

        {/* Title — typewriter effect, smaller than logo */}
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          <TypewriterText
            text="Asociación Colombiana de "
            delay={600}
            speed={45}
          />
          <TypewriterText
            text="Inteligencia Artificial"
            delay={1800}
            speed={45}
            className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 3.2 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {HERO.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 3.5 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {HERO.cta.map((btn) => (
            <Button key={btn.label} href={btn.href} variant={btn.variant} size="lg">
              {btn.label}
            </Button>
          ))}
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 4 }}
        className="absolute bottom-8 flex items-center gap-3"
      >
        <div className="h-px w-12 bg-border" />
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {HERO.footer}
        </p>
        <div className="h-px w-12 bg-border" />
      </motion.div>
    </section>
  );
}
