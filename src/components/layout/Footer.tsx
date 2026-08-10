import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

const navColumns = [
  {
    title: "Explorar",
    links: [
      { label: "Inicio", href: "/#hero" },
      { label: "Nueva Etapa", href: "/#nueva-etapa" },
      { label: "¿Qué es ACIA?", href: "/#pilares" },
      { label: "Afiliados", href: "/#valor" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { label: "Eventos", href: "/#eventos" },
      { label: "Internacional", href: "/#internacional" },
      { label: "Gobernanza", href: "/#gobernanza" },
      { label: "Afíliate", href: "/afiliate" },
      { label: "Política de Tratamiento de Datos", href: "/politica-tratamiento-datos" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-dark">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="mx-auto max-w-screen-xl px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logos/LOGO ACIA TRANSPARENTE PARA FONDO AZUL OSCURO.png"
                alt="ACIA"
                width={70}
                height={70}
                className="transition-opacity duration-200 hover:opacity-80"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              {SITE.description}
            </p>
            <p className="mt-4 text-xs font-medium italic text-accent/60">
              {SITE.tagline}
            </p>
          </div>

          {/* Navigation columns */}
          {navColumns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="text-[10px] font-bold tracking-[0.25em] text-white/30 uppercase">
                {col.title}
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div className="lg:col-span-4">
            <p className="text-[10px] font-bold tracking-[0.25em] text-white/30 uppercase">
              Contacto
            </p>
            <div className="mt-5 space-y-3">
              <a
                href={`mailto:info@${SITE.domain}`}
                className="block text-sm text-white/60 transition-colors duration-200 hover:text-accent"
              >
                info@{SITE.domain}
              </a>
              <p className="text-sm text-white/40">
                Bogotá, Colombia
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/[0.06] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} {SITE.name}
            </p>
            <p className="text-xs text-white/20">
              Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
