"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_GROUPS } from "@/lib/constants";
import { AFFILIATION_PATH, MEMBER_PORTAL_URL } from "@/lib/config";

export function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = () => {
    dialog.current?.close();
    setMobileOpen(false);
    toggle.current?.focus();
  };
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);
  useEffect(() => {
    const closeDropdowns = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      nav.current?.querySelectorAll("details[open]").forEach((detail) => {
        if (
          event instanceof KeyboardEvent ||
          !detail.contains(event.target as Node)
        ) {
          detail.removeAttribute("open");
          if (event instanceof KeyboardEvent)
            detail.querySelector("summary")?.focus();
        }
      });
    };
    document.addEventListener("keydown", closeDropdowns);
    document.addEventListener("click", closeDropdowns);
    const wide = window.matchMedia("(min-width: 1280px)");
    const resize = () => {
      if (wide.matches && dialog.current?.open) {
        dialog.current.close();
        setMobileOpen(false);
      }
    };
    wide.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", closeDropdowns);
      document.removeEventListener("click", closeDropdowns);
      wide.removeEventListener("change", resize);
    };
  }, []);
  return (
    <header className="site-header option3-header">
      <a
        className="skip-link"
        href="#contenido"
        onClick={() => document.querySelector("main")?.focus()}
      >
        Saltar al contenido
      </a>
      <nav className="header-inner" aria-label="Navegación principal" ref={nav}>
        <Link href="/" className="brand-link">
          <Image
            src="/logos/LOGO ACIA TRANSPARENTE PARA FONDO BLANCO.png"
            alt="ACIA — Asociación Colombiana de Inteligencia Artificial"
            width={180}
            height={72}
            priority
            className="brand-image"
          />
        </Link>
        <ul className="desktop-nav">
          {NAV_GROUPS.map((group) => (
            <li key={group.label}>
              {group.links.length === 1 ? (
                <a className="nav-direct" href={group.links[0].href}>
                  {group.label}
                </a>
              ) : (
                <details className="nav-group">
                  <summary>
                    {group.label}
                    <span aria-hidden="true">⌄</span>
                  </summary>
                  <ul>
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={(event) =>
                            event.currentTarget
                              .closest("details")
                              ?.removeAttribute("open")
                          }
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          ))}
        </ul>
        <div className="header-actions">
          <a href={MEMBER_PORTAL_URL} className="member-access">
            Mi ACIA <span aria-hidden="true">↗</span>
          </a>
          <a
            href={AFFILIATION_PATH}
            className="action action-primary header-affiliate"
          >
            Afíliate <span aria-hidden="true">↗</span>
          </a>
          <button
            ref={toggle}
            className="icon-button menu-toggle"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              dialog.current?.showModal();
              setMobileOpen(true);
            }}
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </nav>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-navigation"
        aria-labelledby="mobile-menu-title"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "a[href],button:not([disabled])",
            ),
          );
          const first = controls[0],
            last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onCancel={() => setMobileOpen(false)}
        onClose={() => setMobileOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="mobile-menu-heading">
          <span id="mobile-menu-title">Explora ACIA</span>
          <button
            type="button"
            className="icon-button"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <nav aria-label="Navegación móvil">
          <div className="mobile-menu-actions">
            <a
              href={AFFILIATION_PATH}
              className="action action-primary"
              onClick={closeMenu}
            >
              Afíliate
            </a>
            <a
              href={MEMBER_PORTAL_URL}
              className="mobile-portal"
              onClick={closeMenu}
            >
              Mi ACIA <span aria-hidden="true">↗</span>
            </a>
          </div>
          <ul>
            {NAV_GROUPS.map((group) => (
              <li className="mobile-group" key={group.label}>
                <p>{group.label}</p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} onClick={closeMenu}>
                        {link.label}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </header>
  );
}
