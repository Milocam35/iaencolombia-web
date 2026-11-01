import { GOVERNANCE } from "@/lib/constants";
export function GovernanceSection() {
  return (
    <section id="gobernanza" className="governance-section">
      <div className="site-container">
        <div>
          <p className="eyebrow">Gobernanza responsable</p>
          <h2>{GOVERNANCE.title}</h2>
          <p>{GOVERNANCE.description}</p>
        </div>
        <ul>
          {GOVERNANCE.principles.map((principle) => (
            <li key={principle}>
              <span aria-hidden="true">↗</span>
              {principle}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
