"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_GROUPS } from "@/lib/constants";
import { ADMIN_PLATFORM_URL } from "@/lib/config";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-white/90 shadow-sm backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3"
          aria-label="Navegación principal"
        >
          {/* Logo only */}
          <Link href="/" className="cursor-pointer">
            <Image
              src="/logos/LOGO ACIA TRANSPARENTE PARA FONDO BLANCO.png"
              alt="ACIA — Asociación Colombiana de Inteligencia Artificial"
              width={80}
              height={80}
              unoptimized
              className="transition-transform duration-200 hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_GROUPS.map((group) => (
              <li key={group.label} className="group relative">
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-haspopup="true"
                >
                  {group.label}
                  <svg className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div className="invisible absolute top-full left-1/2 w-56 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="rounded-xl border border-border bg-white p-2 shadow-xl">
                    {group.links.map((link) => (
                      <li key={`${group.label}-${link.href}-${link.label}`}>
                        <a href={link.href} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            {ADMIN_PLATFORM_URL && (
              <a
                href={ADMIN_PLATFORM_URL}
                className="cursor-pointer rounded-lg border border-primary/20 bg-white/70 px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:border-primary/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Acceso administrativo
              </a>
            )}
            <a
              href="/afiliate"
              className="hidden cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[#031560] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:inline-flex"
            >
              Afíliate
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-border bg-white/98 shadow-lg backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {NAV_GROUPS.map((group) => (
                <li key={group.label} className="border-b border-border/70 pb-2 last:border-0">
                  <p className="px-3 pt-2 text-[10px] font-bold tracking-[0.2em] text-primary/60 uppercase">{group.label}</p>
                  <ul className="mt-1 grid grid-cols-2 gap-1">
                    {group.links.map((link) => (
                      <li key={`${group.label}-${link.href}-${link.label}`}>
                        <a
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              <li className="mt-3 border-t border-border pt-3">
                {ADMIN_PLATFORM_URL && (
                  <a
                    href={ADMIN_PLATFORM_URL}
                    onClick={() => setMobileOpen(false)}
                    className="mb-2 block cursor-pointer rounded-lg border border-primary/20 px-4 py-2.5 text-center text-sm font-semibold text-primary transition-all duration-200 hover:border-primary/40 hover:bg-muted"
                  >
                    Acceso administrativo
                  </a>
                )}
                <a
                  href="/afiliate"
                  onClick={() => setMobileOpen(false)}
                  className="block cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[#031560]"
                >
                  Afíliate
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
