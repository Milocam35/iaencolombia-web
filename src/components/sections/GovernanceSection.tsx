"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CircuitPattern } from "@/components/ui/CircuitPattern";
import { GOVERNANCE } from "@/lib/constants";

export function GovernanceSection() {
  return (
    <motion.section
      id="gobernanza"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden bg-dark px-4 py-32 sm:px-6 lg:px-8"
    >
      <CircuitPattern />

      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.25em] text-accent uppercase"
          >
            Gobernanza responsable
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {GOVERNANCE.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
          >
            {GOVERNANCE.description}
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-12 h-px w-48 origin-center bg-gradient-to-r from-transparent via-accent/40 to-transparent"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-xs font-medium tracking-widest text-white/40 uppercase"
          >
            {GOVERNANCE.subtitle}
          </motion.p>

          {/* Principles — typographic grid, no icons */}
          <div className="mt-10 grid grid-cols-1 gap-0 sm:grid-cols-2">
            {GOVERNANCE.principles.map((principle, i) => (
              <motion.div
                key={principle}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
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
