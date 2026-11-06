"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type UniverseVideoProps = {
  posterSrc: string;
  posterAlt: string;
  illustrative: boolean;
};

export function UniverseVideo({
  posterSrc,
  posterAlt,
  illustrative,
}: UniverseVideoProps) {
  const [playback, setPlayback] = useState<"idle" | "automatic" | "manual">(
    "idle",
  );
  const media = useRef<HTMLElement>(null);
  const player = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (
      !media.current ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25,
          )
        ) {
          setPlayback((current) =>
            current === "idle" ? "automatic" : current,
          );
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(media.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (playback === "manual") player.current?.focus({ preventScroll: true });
  }, [playback]);

  return (
    <>
      <figure
        ref={media}
        className={`op3-universe-video ${illustrative ? "op3-universe-photo" : "op3-universe-product"}`}
      >
        {playback !== "idle" ? (
          <iframe
            ref={player}
            src="https://www.youtube-nocookie.com/embed/fDKVNBuN9zw?autoplay=1&mute=1&playsinline=1&controls=1&rel=0"
            title="Presentación de Mi ACIA: tu puerta de entrada al ecosistema de IA en Colombia"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={0}
          />
        ) : (
          <>
            <Image
              src={posterSrc}
              alt={posterAlt}
              fill
              sizes="(min-width: 1280px) 440px, (min-width: 768px) 50vw, 100vw"
            />
            <button
              type="button"
              className="op3-universe-play"
              aria-label="Reproducir presentación de Mi ACIA"
              onClick={() => setPlayback("manual")}
            >
              <span className="op3-universe-play-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 5.5v13l10-6.5z" />
                </svg>
              </span>
              <span>Reproducir presentación</span>
            </button>
            {illustrative && <figcaption>Imagen ilustrativa</figcaption>}
          </>
        )}
      </figure>
      <p className="op3-universe-video-link">
        <a
          href="https://www.youtube.com/watch?v=fDKVNBuN9zw"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver en YouTube <span aria-hidden="true">↗</span>
        </a>
      </p>
      <p className="sr-only" role="status">
        {playback === "manual" ? "Presentación de Mi ACIA abierta." : ""}
      </p>
    </>
  );
}
