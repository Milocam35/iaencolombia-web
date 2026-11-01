"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ALLIANCES } from "@/data/publicExperience";
import { useReducedMotion } from "./NewsTicker";
export function AlliancesSection() {
  const carousel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const move = (direction: number, focus = false) => {
    const index = (active + direction + ALLIANCES.length) % ALLIANCES.length;
    setActive(index);
    const element = carousel.current;
    const card = element?.children[index] as HTMLElement | undefined;
    if (focus) card?.querySelector("a")?.focus({ preventScroll: true });
    if (element && card)
      element.scrollTo({
        left: card.offsetLeft,
        behavior: reduced ? "instant" : "smooth",
      });
  };
  return (
    <section id="internacional" className="op3-allies alliances-section">
      <div className="site-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Conexiones institucionales</p>
            <h2>Nuestras alianzas</h2>
          </div>
          <div
            className={`alliance-navigation${ALLIANCES.length <= 2 ? " alliance-navigation-pair" : ""}`}
          >
            <span aria-live="polite" className="alliance-counter">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(ALLIANCES.length).padStart(2, "0")}
            </span>
            <button
              className="icon-button"
              type="button"
              aria-label="Alianza anterior"
              aria-controls="alliance-cards"
              onClick={() => move(-1)}
            >
              ←
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Alianza siguiente"
              aria-controls="alliance-cards"
              onClick={() => move(1)}
            >
              →
            </button>
          </div>
        </div>
        <p className="alliance-context">
          Organizaciones que amplían nuestra mirada del ecosistema.
        </p>
        <div
          ref={carousel}
          id="alliance-cards"
          className="alliance-carousel"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Alianzas confirmadas"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              move(event.key === "ArrowRight" ? 1 : -1, true);
            }
          }}
          onScroll={(event) => {
            const el = event.currentTarget;
            if (el.scrollWidth > el.clientWidth + 2) {
              const step = el.children[0].getBoundingClientRect().width + 24;
              setActive(
                Math.min(
                  ALLIANCES.length - 1,
                  Math.round(el.scrollLeft / step),
                ),
              );
            }
          }}
        >
          {ALLIANCES.map((ally, index) => (
            <article
              key={ally.name}
              className="alliance-card"
              data-active={active === index}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${ALLIANCES.length}: ${ally.name}`}
            >
              <div className="alliance-brand">
                {ally.logo ? (
                  <Image
                    src={ally.logo}
                    alt=""
                    width={ally.logoWidth}
                    height={ally.logoHeight}
                    className="alliance-logo"
                  />
                ) : (
                  <span className="typographic-partner">
                    América
                    <br />
                    <strong>Digital</strong>
                  </span>
                )}
                <span className="partner-label">Aliado institucional</span>
              </div>
              <h3>{ally.name}</h3>
              <p>{ally.description}</p>
              <a className="text-link" href={ally.url}>
                Visitar sitio oficial <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
