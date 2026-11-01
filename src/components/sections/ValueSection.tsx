import Image from "next/image";
import { EditorialIcon } from "@/components/ui/EditorialIcon";
const benefits = [
  {
    title: "Conocimiento",
    image: "semana-conocimiento",
    icon: "book" as const,
    text: "Actualización y aprendizaje según los beneficios de tu plan.",
    href: "#planes",
    action: "Explorar planes",
  },
  {
    title: "Conexiones",
    image: "america-digital-conexiones",
    icon: "people" as const,
    text: "Acércate a personas y organizaciones del ecosistema de IA.",
    href: "#universo",
    action: "Conocer Universo",
  },
  {
    title: "Oportunidades",
    image: "oportunidades",
    icon: "spark" as const,
    text: "Encuentra espacios de participación y colaboración según tu plan.",
    href: "#oportunidades",
    action: "Explorar oportunidades",
  },
];
export function ValueSection() {
  return (
    <section id="valor" className="op3-value">
      <div className="op3-block-heading">
        <h2>Ser parte de ACIA te permite</h2>
        <p>Aprender, conectar y encontrar dónde aportar.</p>
      </div>
      <div className="op3-benefit-grid">
        {benefits.map((item) => (
          <a key={item.title} href={item.href} className="op3-benefit-card">
            <div className={`op3-benefit-photo op3-benefit-${item.image}`}>
              <Image
                src={`/images/opcion3/${item.image}.webp`}
                unoptimized={item.image !== "oportunidades"}
                alt=""
                fill
                sizes="(min-width: 1280px) 160px, (min-width: 768px) 240px, 110px"
              />
              <span className="op3-benefit-icon">
                <EditorialIcon name={item.icon} />
              </span>
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="op3-card-action">
                {item.action} <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        ))}
      </div>
      <p className="op3-photo-note">
        Conocimiento y conexiones: archivo ACIA, Foro Semana y América Digital.
        Oportunidades: imagen ilustrativa. Beneficios sujetos a cada plan.
      </p>
    </section>
  );
}
