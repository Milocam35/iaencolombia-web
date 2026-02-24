"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CircuitPattern } from "@/components/ui/CircuitPattern";
import { CTA_FINAL } from "@/lib/constants";

export function CTASection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-dark px-4 pt-16 pb-16 sm:px-6 lg:px-8"
    >
      <CircuitPattern />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          {CTA_FINAL.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {CTA_FINAL.cta.map((btn) => (
            <Button
              key={btn.label}
              href={btn.href}
              variant={btn.variant === "default" ? "secondary" : "outline"}
              size="lg"
              className={
                btn.variant === "outline"
                  ? "border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50 hover:text-white"
                  : "bg-white text-primary hover:bg-white/90"
              }
            >
              {btn.label}
            </Button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-24 flex items-center justify-center gap-3"
        >
          <div className="h-px w-16 bg-accent/30" />
          <p className="text-xs font-medium tracking-widest text-accent/70 uppercase">
            {CTA_FINAL.closing}
          </p>
          <div className="h-px w-16 bg-accent/30" />
        </motion.div>
      </div>
    </section>
  );
}
