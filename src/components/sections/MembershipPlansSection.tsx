"use client";
import type { KeyboardEvent } from "react";
import { BOLD_MEMBERSHIP_PAYMENTS_ENABLED } from "@/lib/config";
import {
  ENTERPRISE_NOTE,
  MEMBERSHIP_CATEGORIES,
  MEMBERSHIP_PLANS,
  STRATEGIC_ALLY,
  getMembershipPlanCta,
  type MembershipPlan,
} from "@/lib/membershipPlans";
import { useMembershipProfile } from "./MembershipProfile";
function PlanCard({ plan }: { plan: MembershipPlan }) {
  return (
    <article className={`plan-card${plan.featured ? " plan-featured" : ""}`}>
      <div className="plan-intro">
        {plan.label && <span className="plan-label">{plan.label}</span>}
        <h3>{plan.name}</h3>
        <p className="plan-audience">{plan.audience}</p>
      </div>
      <div className="plan-includes">
        <h4>Incluye</h4>
        <ul>
          {plan.benefits.slice(0, 3).map((benefit) => (
            <li key={benefit}>
              <span aria-hidden="true">✓</span>
              <span>
                {benefit}
                {/marketplace/i.test(benefit) && <small>En construcción</small>}
              </span>
            </li>
          ))}
        </ul>
        {plan.benefits.length > 3 && (
          <details className="plan-benefit-details">
            <summary>Ver todos los beneficios ({plan.benefits.length})</summary>
            <ul>
              {plan.benefits.slice(3).map((benefit) => (
                <li key={benefit}>
                  <span aria-hidden="true">✓</span>
                  <span>
                    {benefit}
                    {/marketplace/i.test(benefit) && (
                      <small>En construcción</small>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
        {plan.id === "comunidad" && (
          <p className="plan-restriction">
            No incluye acceso a la plataforma Mi ACIA ni a sus funcionalidades.
          </p>
        )}
      </div>
      <div className="plan-pricing">
        <p className="plan-price">{plan.price}</p>
        {plan.priceQualifier && <span>{plan.priceQualifier}</span>}
        {plan.discount && <p className="plan-discount">{plan.discount}</p>}
        {plan.commercialTerms && <p>{plan.commercialTerms}</p>}
      </div>
      <a
        className={`action ${plan.featured ? "action-primary" : "action-outline"}`}
        href={`/afiliate?plan=${encodeURIComponent(plan.id)}`}
      >
        {getMembershipPlanCta(plan, BOLD_MEMBERSHIP_PAYMENTS_ENABLED)}{" "}
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
export function MembershipPlansSection() {
  const { category: activeCategory, select: setActiveCategory } =
    useMembershipProfile();
  const category = MEMBERSHIP_CATEGORIES.find(
    (item) => item.id === activeCategory,
  )!;
  const plans = MEMBERSHIP_PLANS.filter(
    (plan) => plan.category === activeCategory,
  );
  const moveTabFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = MEMBERSHIP_CATEGORIES.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % (last + 1)
        : event.key === "ArrowLeft"
          ? (index + last) % (last + 1)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActiveCategory(MEMBERSHIP_CATEGORIES[next].id);
    document
      .getElementById(`membership-tab-${MEMBERSHIP_CATEGORIES[next].id}`)
      ?.focus();
  };
  return (
    <section id="planes" tabIndex={-1} className="section-space plans-section">
      <div className="site-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tarifas de afiliación 2026</p>
            <h2>Elige cómo ser parte.</h2>
          </div>
          <p>
            Compara las opciones según tu perfil. En el formulario podrás
            confirmar tu tipo de vinculación y elegir el plan.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Categorías de planes de afiliación"
          className="plan-tabs"
        >
          {MEMBERSHIP_CATEGORIES.map((item, index) => (
            <button
              key={item.id}
              id={`membership-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={activeCategory === item.id}
              aria-controls="membership-plans-panel"
              tabIndex={activeCategory === item.id ? 0 : -1}
              onClick={() => setActiveCategory(item.id)}
              onKeyDown={(event) => moveTabFocus(event, index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          id="membership-plans-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`membership-tab-${activeCategory}`}
        >
          <p className="category-description">{category.description}</p>
          {activeCategory === "empresas" && (
            <p className="enterprise-note">{ENTERPRISE_NOTE}</p>
          )}
          <div className={`plan-grid plan-grid-${activeCategory}`}>
            {plans.map((plan) => (
              <PlanCard plan={plan} key={plan.id} />
            ))}
          </div>
        </div>
        <div className="plan-terms">
          <p>Precios netos. No incluyen IVA ni retenciones.</p>
          <p>
            Marketplace ACIA está en construcción. Su disponibilidad futura se
            rige por las condiciones del plan.
          </p>
        </div>
        <details className="strategic-details">
          <summary>Entidades públicas y embajadas · Aliado estratégico</summary>
          <aside className="strategic-ally">
            <div>
              <p className="eyebrow">
                {STRATEGIC_ALLY.label} · {STRATEGIC_ALLY.price}
              </p>
              <h3>{STRATEGIC_ALLY.title}</h3>
              <p>{STRATEGIC_ALLY.description}</p>
            </div>
            <a
              href="/afiliate?type=strategic_ally"
              className="action action-outline"
            >
              {STRATEGIC_ALLY.cta} <span aria-hidden="true">↗</span>
            </a>
          </aside>
        </details>
      </div>
    </section>
  );
}
