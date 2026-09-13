"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  createAffiliationProspect,
  createBoldMembershipCheckout,
  getCheckoutErrorMessage,
  type AffiliationProspectPayload,
  type BoldCheckoutResponse,
} from "@/lib/affiliationPayments";
import { loadBoldCheckoutScript, openBoldCheckout } from "@/lib/boldCheckout";
import {
  attemptPreparedBoldCheckoutOpen,
  prepareAndOpenBoldCheckout,
} from "@/lib/boldCheckoutFlow";
import {
  BOLD_MEMBERSHIP_PAYMENTS_ENABLED,
  BOLD_MEMBERSHIP_PAYMENTS_SANDBOX_NOTICE_ENABLED,
} from "@/lib/config";
import {
  getMembershipPlan,
  getMembershipSubmissionAction,
  MEMBERSHIP_PLANS,
  type MembershipPlan,
  type PlanCode,
  type ProspectType,
} from "@/lib/membershipPlans";
import {
  clearPaymentSession,
  clearPaymentToken,
  loadPreparedCheckoutForPayments,
  storePaymentToken,
  storePreparedCheckout,
} from "@/lib/paymentSession";
import { AFFILIATION_CONSENT, PRIVACY_POLICY_PATH } from "@/lib/privacyPolicy";

const TYPE_OPTIONS: Array<{
  value: ProspectType;
  label: string;
  description: string;
}> = [
  {
    value: "person",
    label: "Persona",
    description:
      "Elige Comunidad / Freemium o uno de los planes de pago para personas.",
  },
  {
    value: "company",
    label: "Empresa",
    description:
      "Elige el plan según el tamaño de tu empresa y completa los datos de la organización.",
  },
  {
    value: "institution",
    label: "Institución educativa / gremio",
    description:
      "Selecciona el plan institucional y completa los datos de tu institución o gremio.",
  },
  {
    value: "strategic_ally",
    label: "Entidad pública / embajada",
    description:
      "La vinculación como aliado estratégico se coordina directamente con el equipo de ACIA.",
  },
];

const PLAN_OPTIONS: Record<
  Exclude<ProspectType, "strategic_ally">,
  MembershipPlan[]
> = {
  person: MEMBERSHIP_PLANS.filter((plan) => plan.prospectType === "person"),
  company: MEMBERSHIP_PLANS.filter((plan) => plan.prospectType === "company"),
  institution: MEMBERSHIP_PLANS.filter(
    (plan) => plan.prospectType === "institution",
  ),
};

type FlowPhase =
  | "idle"
  | "creating_prospect"
  | "preparing_checkout"
  | "opening_checkout";

type Feedback = {
  kind: "success" | "error" | "info";
  message: string;
};

type PaymentState =
  | { kind: "idle" }
  | {
      kind: "preparation_failed";
      paymentContext: string;
      planCode: PlanCode;
    }
  | {
      kind: "prepared";
      checkout: BoldCheckoutResponse;
    };

const PREPARED_CHECKOUT_MESSAGE =
  "Tus datos están registrados y tu pago está listo. Continúa en la pasarela segura de Bold para completar el pago.";

const PAYMENT_UNAVAILABLE_MESSAGE =
  "El pago en línea no está disponible en este momento. Inténtalo más tarde para completar tu afiliación.";

function validType(value?: string): ProspectType | null {
  return TYPE_OPTIONS.some((option) => option.value === value)
    ? (value as ProspectType)
    : null;
}

export function AffiliationForm({
  initialPlan,
  initialType,
  paymentsEnabled = BOLD_MEMBERSHIP_PAYMENTS_ENABLED,
}: {
  initialPlan?: string;
  initialType?: string;
  paymentsEnabled?: boolean;
}) {
  const initialMembershipPlan = getMembershipPlan(initialPlan);
  const preselectedType =
    initialMembershipPlan?.prospectType ?? validType(initialType) ?? "person";
  const [prospectType, setProspectType] =
    useState<ProspectType>(preselectedType);
  const [planCode, setPlanCode] = useState<PlanCode | "">("");
  const [typeChanged, setTypeChanged] = useState(false);
  const [phase, setPhase] = useState<FlowPhase>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>({
    kind: "idle",
  });
  const [paymentSessionChecked, setPaymentSessionChecked] =
    useState(!paymentsEnabled);
  const submissionInFlight = useRef(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const showOrganization = prospectType !== "person";
  const plans = useMemo(
    () => (prospectType === "strategic_ally" ? [] : PLAN_OPTIONS[prospectType]),
    [prospectType],
  );
  const selectedPlan = getMembershipPlan(planCode);
  const selectedType = TYPE_OPTIONS.find(
    (option) => option.value === prospectType,
  )!;
  const submissionAction = getMembershipSubmissionAction(
    prospectType,
    planCode,
    paymentsEnabled,
  );
  const shouldContinueToPayment = submissionAction === "payment";
  const busy = phase !== "idle";
  const selectionLocked = busy || paymentState.kind === "preparation_failed";

  useEffect(() => {
    if (feedback) feedbackRef.current?.focus();
  }, [feedback]);

  useEffect(() => {
    if (!paymentsEnabled) return;

    let active = true;
    let preparedCheckout: BoldCheckoutResponse | null = null;
    try {
      preparedCheckout = loadPreparedCheckoutForPayments(paymentsEnabled);
    } catch {
      preparedCheckout = null;
    }

    queueMicrotask(() => {
      if (!active) return;
      if (preparedCheckout) {
        setPaymentState({ kind: "prepared", checkout: preparedCheckout });
        setFeedback({ kind: "info", message: PREPARED_CHECKOUT_MESSAGE });
      }
      setPaymentSessionChecked(true);
    });

    return () => {
      active = false;
    };
  }, [paymentsEnabled]);

  useEffect(() => {
    if (!shouldContinueToPayment) return;
    void loadBoldCheckoutScript().catch(() => undefined);
  }, [shouldContinueToPayment]);

  const changeType = (type: ProspectType) => {
    if (selectionLocked) return;
    setProspectType(type);
    setPlanCode("");
    setTypeChanged(true);
    setFeedback(null);
  };

  const prepareAndOpenPayment = async (
    paymentContext: string,
    selectedPlanCode: PlanCode,
  ) => {
    setPhase("preparing_checkout");
    const result = await prepareAndOpenBoldCheckout({
      paymentContext,
      planCode: selectedPlanCode,
      prepareCheckout: createBoldMembershipCheckout,
      onPrepared: (checkout) => {
        try {
          storePreparedCheckout(checkout);
        } finally {
          setPaymentState({ kind: "prepared", checkout });
          setPhase("opening_checkout");
        }
      },
      openCheckout: async (checkout) => {
        storePaymentToken(checkout.publicToken);
        await openBoldCheckout(checkout);
      },
    });

    if (result.kind === "preparation_failed") {
      setPaymentState({
        kind: "preparation_failed",
        paymentContext,
        planCode: selectedPlanCode,
      });
      setFeedback({
        kind: "error",
        message: getCheckoutErrorMessage(result.error),
      });
      return;
    }

    if (result.kind === "opening_failed") {
      clearPaymentToken();
      setFeedback({ kind: "info", message: PREPARED_CHECKOUT_MESSAGE });
      return;
    }

    setFeedback({
      kind: "info",
      message:
        "La pasarela de Bold está abierta. Completa el pago allí y espera su confirmación.",
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInFlight.current) return;

    const formElement = event.currentTarget;
    if (!formElement.reportValidity()) return;

    const submittedPlan = getMembershipPlan(planCode);
    if (
      submissionAction === "contact" ||
      submissionAction === "select_plan" ||
      !submittedPlan
    ) {
      setFeedback({
        kind: "error",
        message:
          "Selecciona un plan para tu tipo de vinculación antes de continuar.",
      });
      return;
    }
    if (submissionAction === "payment_unavailable") {
      setFeedback({ kind: "error", message: PAYMENT_UNAVAILABLE_MESSAGE });
      return;
    }
    if (paymentState.kind !== "idle") return;

    const form = new FormData(formElement);
    const nullable = (name: string) =>
      String(form.get(name) ?? "").trim() || null;
    const payload: AffiliationProspectPayload = {
      prospect_type: prospectType,
      plan_code: submittedPlan.id,
      contact_name: String(form.get("contact_name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: nullable("phone"),
      organization_name: showOrganization
        ? nullable("organization_name")
        : null,
      organization_role: showOrganization
        ? nullable("organization_role")
        : null,
      city: nullable("city"),
      message: nullable("message"),
      privacy_accepted: form.get("privacy_accepted") === "on",
      website: nullable("website"),
    };

    submissionInFlight.current = true;
    setFeedback(null);
    setPhase("creating_prospect");

    let paymentContext: string;
    try {
      const prospect = await createAffiliationProspect(payload);
      paymentContext = prospect.payment_context;
    } catch {
      setFeedback({
        kind: "error",
        message:
          "No pudimos registrar tus datos. Revisa la información e inténtalo nuevamente. Si el problema continúa, escríbenos a info@iaencolombia.org.",
      });
      setPhase("idle");
      submissionInFlight.current = false;
      return;
    }

    if (submissionAction === "payment") {
      try {
        await prepareAndOpenPayment(paymentContext, submittedPlan.id);
      } finally {
        setPhase("idle");
        submissionInFlight.current = false;
      }
      return;
    }

    setFeedback({
      kind: "success",
      message:
        "Hemos recibido tu interés en vincularte a ACIA. Te contactaremos al correo registrado para continuar el proceso.",
    });
    formElement.reset();
    setPlanCode("");
    setPhase("idle");
    submissionInFlight.current = false;
  };

  const retryPreparingPayment = async () => {
    if (
      paymentState.kind !== "preparation_failed" ||
      submissionInFlight.current
    ) {
      return;
    }
    submissionInFlight.current = true;
    setFeedback(null);
    try {
      await prepareAndOpenPayment(
        paymentState.paymentContext,
        paymentState.planCode,
      );
    } finally {
      setPhase("idle");
      submissionInFlight.current = false;
    }
  };

  const reopenPayment = async () => {
    if (
      !paymentsEnabled ||
      paymentState.kind !== "prepared" ||
      submissionInFlight.current
    ) {
      return;
    }
    submissionInFlight.current = true;
    setPhase("opening_checkout");
    setFeedback(null);
    const result = await attemptPreparedBoldCheckoutOpen(
      paymentState.checkout,
      async (checkout) => {
        storePaymentToken(checkout.publicToken);
        await openBoldCheckout(checkout);
      },
    );
    if (result.kind === "opened") {
      setFeedback({
        kind: "info",
        message:
          "La pasarela de Bold está abierta. El estado final se verificará con ACIA.",
      });
    } else {
      clearPaymentToken();
      setFeedback({ kind: "info", message: PREPARED_CHECKOUT_MESSAGE });
    }
    setPhase("idle");
    submissionInFlight.current = false;
  };

  const abandonPreparedPayment = () => {
    if (paymentState.kind !== "prepared" || submissionInFlight.current) return;
    const confirmed = window.confirm(
      "La orden de pago actual dejará de mostrarse, pero no se eliminará del sistema. ¿Quieres elegir otro plan e iniciar de nuevo?",
    );
    if (!confirmed) return;

    try {
      clearPaymentSession();
    } catch {
      // La sesión en memoria aún puede abandonarse si el navegador bloquea storage.
    }
    setPaymentState({ kind: "idle" });
    setFeedback(null);
  };

  const submitLabel = getSubmitLabel({
    phase,
    submissionAction,
    selectedPlan,
  });

  if (!paymentSessionChecked) {
    return <PaymentSessionLoading />;
  }

  if (paymentsEnabled && paymentState.kind === "prepared") {
    return (
      <PreparedCheckoutRecovery
        busy={busy}
        phase={phase}
        feedback={feedback}
        feedbackRef={feedbackRef}
        onOpen={reopenPayment}
        onAbandon={abandonPreparedPayment}
      />
    );
  }

  return (
    <form
      onSubmit={submit}
      className="min-w-0 rounded-3xl border border-border bg-white p-6 shadow-2xl shadow-primary/[0.07] sm:p-9"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-accent uppercase">
            Afiliación ACIA
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-primary">
            Elige cómo vincularte
          </h2>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
          {shouldContinueToPayment
            ? "Pago en línea"
            : selectedPlan?.paymentKind === "free"
              ? "Sin costo"
              : submissionAction === "request" || submissionAction === "contact"
                ? "Contacto con ACIA"
                : "Elige tu plan"}
        </span>
      </div>

      {paymentsEnabled && BOLD_MEMBERSHIP_PAYMENTS_SANDBOX_NOTICE_ENABLED && (
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900">
          Entorno de pruebas: no se procesarán pagos reales.
        </p>
      )}

      <fieldset className="mt-7 min-w-0" disabled={selectionLocked}>
        <legend className="text-sm font-bold text-foreground">
          Tipo de vinculación <Required />
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {TYPE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                prospectType === option.value
                  ? "border-primary bg-primary text-white shadow-md shadow-primary/15"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="prospect_type"
                value={option.value}
                checked={prospectType === option.value}
                onChange={() => changeType(option.value)}
              />
              <span
                aria-hidden="true"
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                  prospectType === option.value
                    ? "border-accent bg-accent text-primary"
                    : "border-border"
                }`}
              >
                {prospectType === option.value && (
                  <svg viewBox="0 0 20 20" fill="none" className="size-3.5">
                    <path
                      d="m5 10 3 3 7-7"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5" role="status" aria-live="polite" aria-atomic="true">
        <div
          key={prospectType}
          className="rounded-xl border-l-4 border-accent bg-secondary px-4 py-4 motion-safe:animate-[affiliation-update_450ms_ease-out]"
        >
          <p className="text-[10px] font-bold tracking-[0.16em] text-primary/65 uppercase">
            {typeChanged ? "Formulario actualizado" : "Tu tipo de vinculación"}
          </p>
          <h3 className="mt-1 text-base font-extrabold text-primary">
            {selectedType.label}
          </h3>
          <p className="mt-1 text-sm leading-6 text-primary/80">
            {selectedType.description}
          </p>
        </div>
      </div>

      {submissionAction === "contact" ? (
        <div className="mt-6 rounded-2xl border border-border p-5">
          <h3 className="text-lg font-extrabold text-primary">
            Conversemos sobre una alianza
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Escríbenos con el nombre de tu entidad y la propuesta de
            colaboración. Nuestro equipo te orientará sobre los siguientes
            pasos.
          </p>
          <a href="mailto:info@iaencolombia.org" className={submitButtonClass}>
            Contactar a ACIA
          </a>
          <p className="mt-3 break-all text-center text-sm text-muted-foreground">
            info@iaencolombia.org
          </p>
        </div>
      ) : (
        <>
          <fieldset disabled={selectionLocked} className="min-w-0">
            <div
              key={prospectType}
              className="mt-6 motion-safe:animate-[affiliation-update_450ms_ease-out]"
            >
              <Field label="Plan de interés" required>
                <select
                  name="plan_code"
                  required
                  value={planCode}
                  onChange={(event) => {
                    setPlanCode(event.target.value as PlanCode | "");
                    setFeedback(null);
                  }}
                  className={inputClass}
                  aria-describedby="membership-plan-hint"
                >
                  <option value="" disabled>
                    Selecciona un plan
                  </option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — {plan.price}
                      {plan.priceQualifier ? ` ${plan.priceQualifier}` : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <p
                id="membership-plan-hint"
                className="mt-2 text-xs leading-5 text-muted-foreground"
              >
                Selección obligatoria. Solo se muestran los planes para tu tipo
                de vinculación.
              </p>
              <PlanSummary
                plan={selectedPlan}
                paymentsEnabled={paymentsEnabled}
              />
            </div>

            <h3 className="mt-7 border-t border-border pt-6 text-base font-extrabold text-primary">
              Tus datos de contacto
            </h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Field label="Nombre del contacto" required>
                <input
                  name="contact_name"
                  required
                  maxLength={160}
                  autoComplete="name"
                  className={inputClass}
                />
              </Field>
              <Field label="Correo electrónico" required>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={320}
                  autoComplete="email"
                  className={inputClass}
                />
              </Field>
              <Field
                label="Teléfono / WhatsApp"
                hint="Opcional, pero recomendado"
              >
                <input
                  name="phone"
                  type="tel"
                  maxLength={50}
                  autoComplete="tel"
                  className={inputClass}
                />
              </Field>
              <Field label="Ciudad">
                <input
                  name="city"
                  maxLength={120}
                  autoComplete="address-level2"
                  className={inputClass}
                />
              </Field>
              {showOrganization && (
                <>
                  <Field label="Organización" required>
                    <input
                      name="organization_name"
                      required
                      maxLength={200}
                      autoComplete="organization"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Cargo">
                    <input
                      name="organization_role"
                      maxLength={160}
                      autoComplete="organization-title"
                      className={inputClass}
                    />
                  </Field>
                </>
              )}
            </div>

            <Field label="Mensaje" hint="opcional" className="mt-5">
              <textarea
                name="message"
                maxLength={2000}
                rows={4}
                className={inputClass}
                placeholder="Cuéntanos brevemente qué esperas encontrar en ACIA."
              />
            </Field>

            <div
              className="absolute -left-[10000px] top-auto size-px overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="website">Sitio web</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                maxLength={500}
              />
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-surface p-4 text-sm leading-6 text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <input
                name="privacy_accepted"
                type="checkbox"
                required
                className="mt-1 size-4 shrink-0 accent-primary"
              />
              <span>
                {AFFILIATION_CONSENT.prefix}{" "}
                <Link
                  href={PRIVACY_POLICY_PATH}
                  className="font-semibold text-primary underline decoration-accent/60 underline-offset-2 transition hover:text-accent"
                >
                  {AFFILIATION_CONSENT.linkLabel}
                </Link>
                {AFFILIATION_CONSENT.suffix} <Required />
              </span>
            </label>
          </fieldset>

          <div
            ref={feedbackRef}
            tabIndex={-1}
            aria-live="polite"
            className="focus:outline-none"
          >
            {feedback && <FeedbackMessage feedback={feedback} />}
          </div>

          {paymentState.kind === "preparation_failed" ? (
            <button
              type="button"
              onClick={retryPreparingPayment}
              disabled={busy}
              className={submitButtonClass}
            >
              {phase === "preparing_checkout"
                ? "Preparando pago…"
                : "Intentar preparar el pago nuevamente"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={
                busy ||
                submissionAction === "select_plan" ||
                submissionAction === "payment_unavailable"
              }
              className={submitButtonClass}
            >
              {busy && (
                <span
                  className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
              )}
              {submitLabel}
            </button>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Solo usaremos estos datos para atender tu interés de vinculación.
          </p>
        </>
      )}
    </form>
  );
}

function PaymentSessionLoading() {
  return (
    <section
      className="min-w-0 rounded-3xl border border-border bg-white p-7 text-center shadow-2xl shadow-primary/[0.07] sm:p-10"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="mx-auto block size-7 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
        aria-hidden="true"
      />
      <p className="mt-4 text-sm font-semibold text-primary">
        Comprobando tu sesión de pago…
      </p>
    </section>
  );
}

function PreparedCheckoutRecovery({
  busy,
  phase,
  feedback,
  feedbackRef,
  onOpen,
  onAbandon,
}: {
  busy: boolean;
  phase: FlowPhase;
  feedback: Feedback | null;
  feedbackRef: React.RefObject<HTMLDivElement | null>;
  onOpen: () => void;
  onAbandon: () => void;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-primary/15 bg-white shadow-2xl shadow-primary/[0.09]">
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="p-7 sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <svg
            className="size-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="mt-6 text-center font-mono text-[10px] font-bold tracking-[0.18em] text-primary/55 uppercase">
          Pago preparado
        </p>
        <h2 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
          Continúa con tu pago en Bold
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-6 text-muted-foreground sm:text-base">
          {PREPARED_CHECKOUT_MESSAGE}
        </p>

        <div
          ref={feedbackRef}
          tabIndex={-1}
          aria-live="polite"
          className="focus:outline-none"
        >
          {feedback && feedback.message !== PREPARED_CHECKOUT_MESSAGE && (
            <FeedbackMessage feedback={feedback} />
          )}
        </div>

        <button
          type="button"
          onClick={onOpen}
          disabled={busy}
          className={submitButtonClass}
        >
          {phase === "opening_checkout"
            ? "Abriendo pago…"
            : "Abrir pago nuevamente"}
        </button>
        <button
          type="button"
          onClick={onAbandon}
          disabled={busy}
          className="mt-4 w-full cursor-pointer text-center text-sm font-semibold text-muted-foreground underline decoration-border underline-offset-4 transition hover:text-primary focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          Elegir otro plan
        </button>
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          Puedes volver a abrir este mismo pago si cierras Bold o regresas a
          esta página.
        </p>
      </div>
    </section>
  );
}

function PlanSummary({
  plan,
  paymentsEnabled,
}: {
  plan?: MembershipPlan;
  paymentsEnabled: boolean;
}) {
  if (!plan) return null;

  const onlinePayment = paymentsEnabled && plan.paymentKind === "fixed";
  return (
    <section
      className="mt-4 overflow-hidden rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,#f6f8fc_0%,#edf2ff_100%)]"
      aria-live="polite"
      aria-label="Plan seleccionado"
    >
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-primary/55 uppercase">
            Plan seleccionado
          </p>
          <h3 className="mt-1 text-base font-extrabold text-primary">
            {plan.name}
          </h3>
        </div>
        <div className="sm:text-right">
          <p className="text-xl font-extrabold text-primary">{plan.price}</p>
          {plan.priceQualifier && (
            <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
              {plan.priceQualifier}
            </p>
          )}
        </div>
      </div>
      <p className="border-t border-primary/10 px-5 py-3 text-xs leading-5 text-primary/75">
        {onlinePayment
          ? "Al continuar, se abrirá la pasarela segura de Bold. Completa el pago para continuar tu afiliación."
          : plan.paymentKind === "free"
            ? "Este plan no requiere pago. ACIA continuará el proceso después de recibir tu solicitud."
            : plan.paymentKind === "negotiated"
              ? "Envía tu solicitud y nuestro equipo te contactará para coordinar la afiliación y el pago de este plan a medida."
              : PAYMENT_UNAVAILABLE_MESSAGE}
        {plan.paymentKind === "free" && (
          <span className="mt-2 block font-semibold">
            Este plan no incluye acceso a la plataforma Mi ACIA ni a sus
            funcionalidades.
          </span>
        )}
      </p>
    </section>
  );
}

function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  const classes = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-sky-200 bg-sky-50 text-sky-900",
  }[feedback.kind];

  return (
    <p
      className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-6 ${classes}`}
      role={feedback.kind === "error" ? "alert" : "status"}
    >
      {feedback.message}
    </p>
  );
}

function getSubmitLabel({
  phase,
  submissionAction,
  selectedPlan,
}: {
  phase: FlowPhase;
  submissionAction: ReturnType<typeof getMembershipSubmissionAction>;
  selectedPlan?: MembershipPlan;
}) {
  if (phase === "creating_prospect") return "Registrando datos…";
  if (phase === "preparing_checkout") return "Preparando pago…";
  if (phase === "opening_checkout") return "Abriendo pago…";
  if (submissionAction === "payment") return "Continuar al pago";
  if (submissionAction === "payment_unavailable")
    return "Pago en línea no disponible";
  if (submissionAction === "request" && selectedPlan?.paymentKind === "free") {
    return "Afiliarme gratis";
  }
  if (submissionAction === "request") {
    return "Enviar solicitud de afiliación";
  }
  return "Selecciona un plan para continuar";
}

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10";
const submitButtonClass =
  "mt-6 flex h-13 w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/15 transition hover:bg-[#031560] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

function Required() {
  return (
    <span className="text-red-600" aria-hidden="true">
      *
    </span>
  );
}

function Field({
  label,
  hint,
  required,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm font-bold text-foreground ${className}`}>
      {label} {required && <Required />}
      {hint && (
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          ({hint})
        </span>
      )}
      {children}
    </label>
  );
}
