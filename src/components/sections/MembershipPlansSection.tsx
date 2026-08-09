"use client";

import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  ENTERPRISE_NOTE,
  MEMBERSHIP_CATEGORIES,
  MEMBERSHIP_PLANS,
  STRATEGIC_ALLY,
  type MembershipCategoryId,
  type MembershipPlan,
} from "@/lib/membershipPlans";

const gridClasses: Record<MembershipCategoryId, string> = {
  comunidad: "mx-auto max-w-2xl",
  personas: "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
  empresas: "grid gap-5 md:grid-cols-2 xl:grid-cols-4",
  instituciones: "mx-auto max-w-2xl",
};

function BenefitIcon() {
  return (
    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-primary">
      <svg
        className="size-3"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path d="m5 10 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PlanCard({ plan, index }: { plan: MembershipPlan; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm sm:p-7 ${
        plan.featured
          ? "border-primary/30 shadow-lg shadow-primary/[0.06]"
          : "border-border"
      }`}
    >
      {plan.featured && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent" />
      )}

      <div className="flex min-h-16 items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-primary/60 uppercase">
            {plan.audience}
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-foreground">
            {plan.name}
          </h3>
        </div>
        {plan.label && (
          <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-primary">
            {plan.label}
          </span>
        )}
      </div>

      <div className="mt-7 border-y border-border py-5">
        <p className="break-words text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
          {plan.price}
        </p>
        {plan.priceQualifier && (
          <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {plan.priceQualifier}
          </p>
        )}
        {plan.discount && (
          <p className="mt-4 inline-flex rounded-md bg-secondary px-3 py-2 text-xs font-bold leading-5 text-primary">
            {plan.discount}
          </p>
        )}
        {plan.commercialTerms && (
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {plan.commercialTerms}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <p className="mt-6 text-xs font-bold tracking-[0.16em] text-foreground/50 uppercase">
          Incluye
        </p>
        <ul className="mt-4 flex-1 space-y-3">
          {plan.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-foreground/75">
              <BenefitIcon />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <Button
          href="#cta"
          variant={plan.featured ? "default" : "outline"}
          className="mt-7 w-full"
        >
          {plan.cta}
        </Button>
      </div>
    </motion.article>
  );
}

export function MembershipPlansSection() {
  const [activeCategory, setActiveCategory] =
    useState<MembershipCategoryId>("comunidad");
  const activeCategoryData = MEMBERSHIP_CATEGORIES.find(
    (category) => category.id === activeCategory,
  )!;
  const visiblePlans = MEMBERSHIP_PLANS.filter(
    (plan) => plan.category === activeCategory,
  );

  const moveTabFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % MEMBERSHIP_CATEGORIES.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (currentIndex - 1 + MEMBERSHIP_CATEGORIES.length) %
        MEMBERSHIP_CATEGORIES.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = MEMBERSHIP_CATEGORIES.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextCategory = MEMBERSHIP_CATEGORIES[nextIndex];
    setActiveCategory(nextCategory.id);
    document.getElementById(`membership-tab-${nextCategory.id}`)?.focus();
  };

  return (
    <SectionWrapper
      id="planes"
      className="scroll-mt-24 overflow-hidden border-y border-border bg-gradient-to-b from-surface to-white"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Tarifas de afiliación 2026
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Encuentra el plan ideal para ser parte de ACIA
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Personas, empresas e instituciones pueden vincularse al ecosistema ACIA de acuerdo con su perfil y necesidades.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Categorías de planes de afiliación"
        className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-2 rounded-2xl border border-border bg-white p-2 shadow-sm sm:flex sm:rounded-full"
      >
        {MEMBERSHIP_CATEGORIES.map((category, index) => {
          const active = category.id === activeCategory;
          return (
            <button
              key={category.id}
              id={`membership-tab-${category.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="membership-plans-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveCategory(category.id)}
              onKeyDown={(event) => moveTabFocus(event, index)}
              className={`min-w-0 flex-1 cursor-pointer rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:rounded-full sm:px-5 ${
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div
        id="membership-plans-panel"
        role="tabpanel"
        aria-labelledby={`membership-tab-${activeCategory}`}
        tabIndex={0}
        className="mt-9 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      >
        <p className="mx-auto mb-7 max-w-2xl text-center text-sm leading-6 text-muted-foreground">
          {activeCategoryData.description}
        </p>

        {activeCategory === "empresas" && (
          <div className="mx-auto mb-7 max-w-4xl rounded-xl border border-primary/10 bg-secondary/70 px-5 py-4 text-center text-sm leading-6 text-primary">
            {ENTERPRISE_NOTE}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={gridClasses[activeCategory]}
          >
            {visiblePlans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.aside
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="relative mt-12 overflow-hidden rounded-2xl bg-dark p-6 text-white shadow-xl sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10"
      >
        <div className="pointer-events-none absolute -top-24 right-0 size-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
            {STRATEGIC_ALLY.label}
          </p>
          <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {STRATEGIC_ALLY.title}
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/65 sm:text-base">
            {STRATEGIC_ALLY.description}
          </p>
        </div>
        <div className="relative mt-6 shrink-0 lg:mt-0 lg:text-right">
          <p className="text-2xl font-extrabold text-accent">
            {STRATEGIC_ALLY.price}
          </p>
          <Button
            href="#cta"
            variant="outline"
            className="mt-4 border-white/30 text-white hover:border-accent hover:bg-white/10 hover:text-white"
          >
            {STRATEGIC_ALLY.cta}
          </Button>
        </div>
      </motion.aside>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Precios netos. No incluyen IVA ni retenciones.
      </p>
    </SectionWrapper>
  );
}
