import Image from "next/image";
import Link from "next/link";
import { SITE, NAV_GROUPS } from "@/lib/constants";
import { ADMIN_PLATFORM_URL, MEMBER_PORTAL_URL } from "@/lib/config";
import { PUBLIC_CONTACT } from "@/data/publicExperience";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div>
            <Link href="/">
              <Image
                src="/logos/LOGO ACIA TRANSPARENTE PARA FONDO AZUL OSCURO.png"
                alt="ACIA"
                width={180}
                height={80}
                className="footer-logo"
              />
            </Link>
            <p>{SITE.name}</p>
            <span>Donde la IA se convierte en desarrollo.</span>
          </div>
          <div className="footer-contact">
            <span>Conversemos</span>
            <a href={`mailto:${PUBLIC_CONTACT}`}>
              {PUBLIC_CONTACT} <span aria-hidden="true">↗</span>
            </a>
            <p>Bogotá, Colombia</p>
          </div>
        </div>
        <nav
          className="footer-navigation"
          aria-label="Enlaces del pie de página"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <h2>{group.label}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} ACIA. Todos los derechos reservados.
          </p>
          <div>
            <a href="/politica-tratamiento-datos">
              Política de tratamiento de datos
            </a>
            <a href={MEMBER_PORTAL_URL}>Mi ACIA</a>
            <a href={ADMIN_PLATFORM_URL}>Acceso administrativo</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
