"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NEWS } from "@/data/publicExperience";
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}
export function NewsTicker() {
  const viewport = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false),
    [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false),
    [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const entries = [...NEWS].sort((a, b) => a.order - b.order);
  useEffect(() => {
    const element = viewport.current;
    if (
      !element ||
      paused ||
      hovered ||
      focused ||
      reduced ||
      entries.length < 2
    )
      return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let visible = false;
    const update = () => {
      clearInterval(timer);
      if (visible && !document.hidden)
        timer = setInterval(
          () => setActive((i) => (i + 1) % entries.length),
          9000,
        );
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [paused, hovered, focused, reduced, entries.length]);
  const move = (direction: number) => {
    setPaused(true);
    setActive((i) => (i + direction + entries.length) % entries.length);
  };
  return (
    <section
      id="noticias"
      className="news-ticker"
      aria-label="Últimas noticias"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="news-label">
        <span className="status-dot" />
        <h2>Últimas noticias</h2>
      </div>
      <div
        ref={viewport}
        className="news-viewport"
        id="news-headlines"
        aria-live={paused || reduced ? "polite" : "off"}
        aria-atomic="true"
      >
        <ul
          className="news-slides"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {entries.map((item, index) => (
            <li
              key={item.url}
              aria-hidden={index !== active}
              inert={index !== active}
            >
              <a href={item.url} tabIndex={index === active ? 0 : -1}>
                <span className="news-meta">
                  <span className="news-type">{item.type}</span> ·{" "}
                  <time dateTime={item.date}>
                    {new Intl.DateTimeFormat("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "America/Bogota",
                    }).format(new Date(item.date + "T12:00:00-05:00"))}
                  </time>{" "}
                  · {item.source}
                </span>
                <span className="news-title">
                  {item.title} <span aria-hidden="true">↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="news-controls">
        <span className="news-counter" aria-hidden="true">
          {active + 1}/{entries.length}
        </span>
        <button
          type="button"
          className="icon-button"
          aria-label="Noticia anterior"
          aria-controls="news-headlines"
          onClick={() => move(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className="news-pause"
          aria-label={paused ? "Reanudar noticias" : "Pausar noticias"}
          aria-pressed={paused}
          aria-controls="news-headlines"
          disabled={reduced}
          onClick={() => setPaused(!paused)}
        >
          {reduced ? "Manual" : paused ? "Reanudar" : "Pausar"}
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Noticia siguiente"
          aria-controls="news-headlines"
          onClick={() => move(1)}
        >
          →
        </button>
      </div>
    </section>
  );
}
