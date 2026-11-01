import { PILLARS, CAPABILITIES, ROADMAP, GOVERNANCE } from "@/lib/constants";
export function PillarsSection() {
  return (
    <section id="pilares" className="section-space about-section">
      <div className="site-container trust-grid">
        <div>
          <p className="eyebrow">Conócenos</p>
          <h2>
            Una asociación.
            <br />
            <em>Un propósito compartido.</em>
          </h2>
          <p className="trust-intro">
            ACIA articula conocimiento, talento, empresas, Estado, academia y
            sociedad civil para impulsar una inteligencia artificial productiva,
            inclusiva, ética y sostenible.
          </p>
          <a className="text-link" href="/transparencia">
            Transparencia institucional ↗
          </a>
        </div>
        <div className="trust-details">
          <details>
            <summary>
              Nuestros pilares <span aria-hidden="true">＋</span>
            </summary>
            <div>
              {PILLARS.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </details>
          <details id="que-hacemos">
            <summary>
              Qué hacemos: líneas de acción <span aria-hidden="true">＋</span>
            </summary>
            <div>
              {CAPABILITIES.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </details>
          <details id="hoja-de-ruta">
            <summary>
              Hoja de ruta · ACIA 2046 <span aria-hidden="true">＋</span>
            </summary>
            <div>
              <p>
                Desde su fundación en 2024, ACIA proyecta una construcción
                institucional sostenida al servicio de Colombia y la región.
              </p>
              <ol>
                {ROADMAP.map((item) => (
                  <li key={item.period}>
                    <strong>
                      {item.period} · {item.title}
                    </strong>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </details>
          <details id="gobernanza">
            <summary>
              Gobernanza responsable <span aria-hidden="true">＋</span>
            </summary>
            <div>
              <h3>{GOVERNANCE.title}</h3>
              <p>{GOVERNANCE.description}</p>
              <ul>
                {GOVERNANCE.principles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
