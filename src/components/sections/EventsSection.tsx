import Link from "next/link";
import { EVENTS } from "@/lib/constants";
import { PUBLIC_CONTACT } from "@/data/publicExperience";
export function EventsSection() {
  return (
    <section id="eventos" className="opportunities-section">
      <div className="site-container opportunity-band">
        <div id="oportunidades">
          <p className="eyebrow">Oportunidades y encuentros</p>
          <h2>Encuentra dónde participar.</h2>
          <p>
            No hay convocatorias públicas activas en esta selección. Consulta
            los comunicados o conversa con ACIA sobre la agenda y las mesas
            técnicas de tu plan.
          </p>
        </div>
        <div className="opportunity-links">
          <Link className="text-link" href="/comunicados">
            Consultar comunicados ↗
          </Link>
          <a className="text-link" href={`mailto:${PUBLIC_CONTACT}`}>
            Consultar agenda ↗
          </a>
          <a className="text-link" href="#planes">
            Mesas técnicas: ver planes ↗
          </a>
        </div>
        <details className="event-archive">
          <summary>
            Archivo de eventos · América Digital, septiembre 2026{" "}
            <span aria-hidden="true">＋</span>
          </summary>
          <div>
            <span className="availability-badge">Actividad finalizada</span>
            <h3>{EVENTS.featured.title}</h3>
            <p>{EVENTS.featured.details}</p>
            <p>{EVENTS.featured.description}</p>
            <a className="text-link" href={EVENTS.featured.href}>
              Sitio oficial del organizador ↗
            </a>
          </div>
        </details>
      </div>
    </section>
  );
}
