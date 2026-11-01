import Image from "next/image";
import { MEMBER_PORTAL_URL } from "@/lib/config";
import { EditorialIcon } from "@/components/ui/EditorialIcon";
import { UNIVERSE_PREVIEW } from "@/data/publicExperience";
export function UniverseSection() {
  const ready =
    UNIVERSE_PREVIEW.approved && UNIVERSE_PREVIEW.src && UNIVERSE_PREVIEW.alt;
  return (
    <section id="universo" className="op3-universe">
      <div className="op3-block-heading">
        <p className="op3-live-label">Disponible en Mi ACIA</p>
        <h2>Universo ACIA</h2>
        <p>El punto de encuentro de nuestros afiliados.</p>
      </div>
      <figure className={ready ? "op3-universe-product" : "op3-universe-photo"}>
        <Image
          src={ready ? UNIVERSE_PREVIEW.src : "/images/opcion3/conexiones.webp"}
          alt={
            ready
              ? UNIVERSE_PREVIEW.alt
              : "Escena ilustrativa de una conversación profesional; no es una captura de Universo ACIA."
          }
          fill
          sizes="(min-width: 1280px) 440px, (min-width: 768px) 50vw, 100vw"
        />
        {!ready && <figcaption>Imagen ilustrativa</figcaption>}
      </figure>
      <ul className="op3-universe-capabilities">
        <li>
          <EditorialIcon name="person" />
          Descubre perfiles
        </li>
        <li>
          <EditorialIcon name="search" />
          Explora intereses
        </li>
        <li>
          <EditorialIcon name="link" />
          Encuentra conexiones
        </li>
      </ul>
      <a className="action op3-action-light" href={MEMBER_PORTAL_URL}>
        Conoce Universo ACIA <span aria-hidden="true">→</span>
      </a>
      <p className="op3-access-note">
        Acceso desde Mi ACIA, según tu plan. Comunidad / Freemium no incluye
        acceso a la plataforma.
      </p>
    </section>
  );
}
