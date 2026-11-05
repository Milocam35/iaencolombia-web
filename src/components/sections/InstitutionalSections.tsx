import Link from "next/link";
import { ROADMAP } from "@/lib/constants";
import { ACIA_OBSERVATORIO_URL, ACIA_PAPERS_URL } from "@/lib/config";
import { COMMUNICATIONS, formatCommunicationDate } from "@/data/communications";
export function RoadmapSection() {
  return (
    <section id="hoja-de-ruta" className="section-space roadmap-section">
      <div className="site-container">
        <p className="eyebrow">Una visión de largo plazo · ACIA 2046</p>
        <h2>
          Construir hoy.
          <br />
          Dejar un legado mañana.
        </h2>
        <p className="roadmap-intro">
          Desde su fundación en 2024, ACIA proyecta una construcción
          institucional sostenida al servicio de Colombia y la región.
        </p>
        <ol className="roadmap-list">
          {ROADMAP.map((phase, index) => (
            <li key={phase.period}>
              <span className="roadmap-marker" aria-hidden="true">
                0{index + 1}
              </span>
              <p className="roadmap-period">{phase.period}</p>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
export function KnowledgeSection() {
  return (
    <section id="conocimiento" className="knowledge-section">
      <div className="site-container knowledge-band">
        <div>
          <p className="eyebrow">Recursos públicos</p>
          <h2>Conocimiento para decidir.</h2>
        </div>
        <div>
          <a href="/normatividad" className="knowledge-feature">
            <strong>Marco de IA en Colombia</strong>
            <span>Consulta normatividad y política pública ↗</span>
          </a>
          <div className="knowledge-secondary">
            <a href={ACIA_OBSERVATORIO_URL}>
              Observatorio <span>En desarrollo ↗</span>
            </a>
            <a href={ACIA_PAPERS_URL}>
              Papers <span>Ver publicaciones ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export function CommunicationsSection() {
  return (
    <section id="comunicados" className="communications-strip">
      <div className="site-container">
        <div>
          <p className="eyebrow">La voz de la Asociación</p>
          <h2>Comunicados oficiales</h2>
          <Link className="text-link" href="/comunicados">
            Ver todos los comunicados ↗
          </Link>
        </div>
        {[...COMMUNICATIONS]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 1)
          .map((item) => (
            <a
              className="communication-item"
              href={`/comunicados/${item.slug}`}
              key={item.slug}
            >
              <time dateTime={item.date}>
                {formatCommunicationDate(item.date)}
              </time>
              <h3>{item.title}</h3>
              <span className="text-link">Leer comunicado ↗</span>
            </a>
          ))}
      </div>
    </section>
  );
}
