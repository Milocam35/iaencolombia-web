"use client";
import Image from "next/image";
import Link from "next/link";
import type { InstitutionalVideo as VideoResource } from "@/data/publicExperience";
function initializeMutedVideo(video: HTMLVideoElement | null) {
  if (video) {
    video.defaultMuted = true;
    video.muted = true;
  }
}
export function InstitutionalVideo({ resource }: { resource: VideoResource }) {
  const ready = Boolean(
    resource.approved &&
    resource.src &&
    resource.poster &&
    resource.captions &&
    resource.transcript,
  );
  return (
    <section id="conoce-acia" className="op3-institutional">
      <div className="op3-block-heading">
        <p className="eyebrow">La Asociación</p>
        <h2>{ready ? "La voz de ACIA" : "Conoce ACIA"}</h2>
        <p>Una inteligencia artificial con propósito en el país.</p>
      </div>
      {ready ? (
        <>
          <video
            ref={initializeMutedVideo}
            controls
            muted
            playsInline
            preload="none"
            poster={resource.poster}
            className="institutional-player"
            aria-label="Mensaje de la Presidencia de ACIA"
          >
            <source src={resource.src} type="video/mp4" />
            {resource.captions && (
              <track
                kind="captions"
                src={resource.captions}
                srcLang="es"
                label="Español"
                default
              />
            )}
            Tu navegador no admite video. Consulta la transcripción.
          </video>
          <details className="video-transcript">
            <summary>Leer la transcripción</summary>
            <p>{resource.transcript}</p>
          </details>
        </>
      ) : (
        <figure className="op3-institutional-photo">
          <Image
            src="/images/opcion3/semana-institucional.webp"
            unoptimized
            alt="Intervención en un panel del Foro Semana sobre inteligencia artificial. Archivo fotográfico de ACIA."
            fill
            sizes="(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw"
          />
          <figcaption>Foro Semana · Archivo ACIA</figcaption>
        </figure>
      )}
      <p className="op3-institutional-text">
        Articulamos conocimiento, talento, empresas, Estado, academia y sociedad
        civil para impulsar una IA productiva, inclusiva, ética y sostenible.
      </p>
      <Link href="/transparencia" className="text-link">
        Nuestra identidad y propósito <span aria-hidden="true">→</span>
      </Link>
      <a href="#pilares" className="op3-secondary-link">
        Conocer nuestros pilares →
      </a>
    </section>
  );
}
