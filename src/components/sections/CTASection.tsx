import Image from "next/image";
export function CTASection() {
  return (
    <section id="cta" className="op3-close">
      <div className="site-container op3-close-inner">
        <div>
          <p className="eyebrow">Tu siguiente conversación empieza aquí</p>
          <h2>
            Hay un lugar para ti
            <br />
            en el futuro de la IA.
          </h2>
          <a className="action action-cyan" href="/afiliate">
            Afíliate a ACIA <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="op3-close-photo">
          <Image
            src="/images/opcion3/semana-comunidad.webp"
            unoptimized
            alt="Participantes reunidos en el Foro Semana sobre inteligencia artificial. Archivo fotográfico de ACIA."
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <span>Foro Semana · Archivo ACIA</span>
        </div>
      </div>
    </section>
  );
}
