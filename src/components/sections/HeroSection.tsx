"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FloatingDots } from "@/components/ui/FloatingDots";
import { HERO, NEW_STAGE } from "@/lib/constants";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative bg-surface flex min-h-screen flex-col overflow-hidden px-4 pt-24 pb-6 sm:px-6 lg:px-8"
    >
      {/* Background */}
      <FloatingDots />
      <div className="pointer-events-none absolute inset-0 gradient-mesh" />
      <div className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[440px] rounded-full bg-accent/4 blur-[100px]" />

      {/* ── Brand block — centered, dominant ── */}
      <div className="relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease }}
        >
          <Image
            src="/logos/LOGO ACIA TRANSPARENTE PARA FONDO BLANCO.png"
            alt="ACIA"
            width={280}
            height={280}
            className="mx-auto"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
        >
          <div className="m-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Nueva etapa 2026
          </div>
          <h1 className="mx-auto max-w-2xl text-2xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Asociación Colombiana de{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Inteligencia Artificial
            </span>
          </h1>
        </motion.div>
      </div>

      {/* ── Split: Image + Nueva etapa ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease }}
        className="relative mx-auto mt-8 grid w-full max-w-screen-xl flex-1 grid-cols-1 items-center gap-6 sm:mt-10 lg:grid-cols-2 lg:gap-12"
      >
        {/* Image */}
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl shadow-2xl shadow-primary/8 lg:max-w-none">
          <Image
            src="/sections/NewStage.webp"
            alt="Nueva etapa — IA en Colombia"
            width={600}
            height={500}
            className="size-full object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
        </div>

        {/* Text + CTAs */}
        <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {NEW_STAGE.title.split("IA").map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}<span className="text-accent">IA</span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            {NEW_STAGE.intro}
          </p>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {NEW_STAGE.points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <svg
                    className="size-2.5 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
            {HERO.cta.map((btn) => (
              <Button key={btn.label} href={btn.href} variant={btn.variant} size="default">
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Tagline ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative mt-auto flex items-center justify-center gap-3 pt-10"
      >
        <div className="h-px w-10 bg-border" />
        <p className="text-[10px] font-medium tracking-widest text-muted-foreground/60 uppercase">
          {HERO.footer}
        </p>
        <div className="h-px w-10 bg-border" />
      </motion.div>
    </section>
  );
}