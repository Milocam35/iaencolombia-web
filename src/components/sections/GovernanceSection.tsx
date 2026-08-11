"use client";

import { motion } from "framer-motion";
import { CircuitPattern } from "@/components/ui/CircuitPattern";
import { INTERNATIONAL, GOVERNANCE } from "@/lib/constants";

export function GovernanceSection() {
  return (
    <motion.section
      id="gobernanza"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative overflow-hidden bg-dark px-4 pt-24 pb-0 sm:px-6 sm:pt-32 lg:px-8"
    >
      <CircuitPattern />

      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl">

        {/* ── Internacional ── */}
        <div id="internacional" className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-accent uppercase">
            Proyección global
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {INTERNATIONAL.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/60">
            {INTERNATIONAL.description}
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="mx-auto mt-16 flex max-w-lg items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[10px] font-semibold tracking-[0.25em] text-white/25 uppercase">
            Gobernanza
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* ── Gobernanza ── */}
        <div className="mx-auto mt-16 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {GOVERNANCE.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
          >
            {GOVERNANCE.description}
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 text-xs font-medium tracking-widest text-white/40 uppercase"
          >
            {GOVERNANCE.subtitle}
          </motion.p>

          {/* Principles grid */}
          <div className="mt-8 grid grid-cols-1 gap-0 sm:grid-cols-2">
            {GOVERNANCE.principles.map((principle, i) => (
              <motion.div
                key={principle}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="group relative border-white/[0.06] py-6 sm:px-8"
                style={{
                  borderTopWidth: i < 2 ? 0 : 1,
                  borderLeftWidth: i % 2 === 0 ? 0 : 1,
                }}
              >
                <span className="block text-[10px] font-bold tracking-[0.3em] text-accent/50 uppercase">
                  0{i + 1}
                </span>
                <p className="mt-2 text-base font-semibold text-white/90 transition-colors duration-300 group-hover:text-accent">
                  {principle}
                </p>
              </motion.div>
            ))}
          </div>


        </div>
      </div>
    </motion.section>
  );
}
