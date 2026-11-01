import Image from "next/image";
export function HeroSection() {
  return (
    <section id="hero" className="op3-hero">
      <div className="op3-hero-photo">
        <Image
          src="/images/opcion3/hero.webp"
          alt="Escena ilustrativa de profesionales conversando en un espacio de colaboración."
          fill
          sizes="100vw"
          priority
        />
      </div>
      <div className="op3-hero-shade" aria-hidden="true" />
      <div className="site-container op3-hero-content">
        <p className="eyebrow light">
          Conocimiento · Conexiones · Oportunidades
        </p>
        <h1>
          Conectamos el talento que transforma la inteligencia artificial en
          Colombia.
        </h1>
        <p className="op3-hero-description">
          ACIA, la Asociación Colombiana de Inteligencia Artificial, reúne
          personas, empresas e instituciones para impulsar el desarrollo
          responsable de la IA en el país.
        </p>
        <div className="action-row">
          <a className="action action-cyan" href="/afiliate">
            Quiero afiliarme <span aria-hidden="true">→</span>
          </a>
          <a className="action op3-action-light" href="#valor">
            Explorar beneficios
          </a>
        </div>
      </div>
      <p className="op3-image-credit">Imagen ilustrativa</p>
    </section>
  );
}
