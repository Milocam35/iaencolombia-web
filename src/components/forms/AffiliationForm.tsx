"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  createAffiliationProspect,
  createBoldMembershipCheckout,
  getCheckoutErrorMessage,
  type AffiliationProspectPayload,
  type BoldCheckoutResponse,
} from "@/lib/affiliationPayments";
import { openBoldCheckout } from "@/lib/boldCheckout";
import {
  BOLD_MEMBERSHIP_PAYMENTS_ENABLED,
  BOLD_MEMBERSHIP_PAYMENTS_SANDBOX_NOTICE_ENABLED,
} from "@/lib/config";
import {
  getMembershipPlan,
  MEMBERSHIP_PLANS,
  type MembershipPlan,
  type PlanCode,
  type ProspectType,
} from "@/lib/membershipPlans";
import { clearPaymentToken, storePaymentToken } from "@/lib/paymentSession";
import { AFFILIATION_CONSENT, PRIVACY_POLICY_PATH } from "@/lib/privacyPolicy";

const TYPE_OPTIONS: Array<{ value: ProspectType; label: string }> = [
  { value: "person", label: "Persona" },
  { value: "company", label: "Empresa" },
  { value: "institution", label: "Institución educativa / gremio" },
  { value: "strategic_ally", label: "Entidad pública / embajada" },
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
  const preselectedPlan =
    initialMembershipPlan?.prospectType === preselectedType
      ? initialMembershipPlan.id
      : "";
  const [prospectType, setProspectType] =
    useState<ProspectType>(preselectedType);
  const [planCode, setPlanCode] = useState<PlanCode | "">(preselectedPlan);
  const [phase, setPhase] = useState<FlowPhase>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [paymentRetry, setPaymentRetry] = useState<{
    paymentContext: string;
    planCode: PlanCode;
  } | null>(null);
  const [paymentReady, setPaymentReady] =
    useState<BoldCheckoutResponse | null>(null);
  const submissionInFlight = useRef(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const showOrganization = prospectType !== "person";
  const plans = useMemo(
    () =>
      prospectType === "strategic_ally" ? [] : PLAN_OPTIONS[prospectType],
    [prospectType],
  );
  const selectedPlan = getMembershipPlan(planCode);
  const shouldContinueToPayment =
    paymentsEnabled && selectedPlan?.paymentKind === "fixed";
  const busy = phase !== "idle";

  useEffect(() => {
    if (feedback) feedbackRef.current?.focus();
  }, [feedback]);

  const changeType = (type: ProspectType) => {
    setProspectType(type);
    setPlanCode("");
    setFeedback(null);
  };

  const prepareAndOpenPayment = async (
    paymentContext: string,
    selectedPlanCode: PlanCode,
  ) => {
    setPhase("preparing_checkout");
    const checkout = await createBoldMembershipCheckout({
      payment_context: paymentContext,
      plan_code: selectedPlanCode,
    });
    storePaymentToken(checkout.publicToken);
    try {
      await openBoldCheckout(checkout);
    } catch (error) {
      clearPaymentToken();
      throw error;
    }
    setPaymentRetry(null);
    setPaymentReady(checkout);
    setFeedback({
      kind: "info",
      message:
        "La pasarela de Bold está abierta. ACIA confirmará el resultado únicamente con el estado informado por nuestro backend.",
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInFlight.current) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const nullable = (name: string) =>
      String(form.get(name) ?? "").trim() || null;
    const submittedPlan = getMembershipPlan(planCode);
    const payload: AffiliationProspectPayload = {
      prospect_type: prospectType,
      plan_code:
        prospectType === "strategic_ally" ? null : submittedPlan?.id ?? null,
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
          "No pudimos enviar tu solicitud. Revisa los datos e inténtalo nuevamente. Si el problema continúa, escríbenos a info@iaencolombia.org.",
      });
      setPhase("idle");
      submissionInFlight.current = false;
      return;
    }

    if (paymentsEnabled && submittedPlan?.paymentKind === "fixed") {
      try {
        await prepareAndOpenPayment(paymentContext, submittedPlan.id);
      } catch (error) {
        setPaymentRetry({
          paymentContext,
          planCode: submittedPlan.id,
        });
        setFeedback({ kind: "error", message: getCheckoutErrorMessage(error) });
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
    if (!paymentRetry || submissionInFlight.current) return;
    submissionInFlight.current = true;
    setFeedback(null);
    try {
      await prepareAndOpenPayment(
        paymentRetry.paymentContext,
        paymentRetry.planCode,
      );
    } catch (error) {
      setFeedback({ kind: "error", message: getCheckoutErrorMessage(error) });
    } finally {
      setPhase("idle");
      submissionInFlight.current = false;
    }
  };

  const reopenPayment = async () => {
    if (!paymentReady || submissionInFlight.current) return;
    submissionInFlight.current = true;
    setPhase("opening_checkout");
    setFeedback(null);
    try {
      storePaymentToken(paymentReady.publicToken);
      await openBoldCheckout(paymentReady);
      setFeedback({
        kind: "info",
        message:
          "La pasarela de Bold está abierta. El estado final se verificará con ACIA.",
      });
    } catch {
      clearPaymentToken();
      setFeedback({
        kind: "error",
        message:
          "No pudimos abrir la pasarela. Revisa tu conexión e inténtalo nuevamente.",
      });
    } finally {
      setPhase("idle");
      submissionInFlight.current = false;
    }
  };

  const submitLabel = getSubmitLabel({
    phase,
    shouldContinueToPayment,
    selectedPlan,
    paymentsEnabled,
  });

  return (
    <form
      onSubmit={submit}
      className="min-w-0 rounded-3xl border border-border bg-white p-6 shadow-2xl shadow-primary/[0.07] sm:p-9"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-accent uppercase">
            Solicitud de vinculación
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-primary">
            Tus datos de contacto
          </h2>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
          {shouldContinueToPayment ? "Solicitud + pago" : "Solicitud segura"}
        </span>
      </div>

      {paymentsEnabled && BOLD_MEMBERSHIP_PAYMENTS_SANDBOX_NOTICE_ENABLED && (
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900">
          Entorno de pruebas: no se procesarán pagos reales.
        </p>
      )}

      <fieldset className="mt-7">
        <legend className="text-sm font-bold text-foreground">
          Tipo de vinculación <Required />
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {TYPE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border p-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                prospectType === option.value
                  ? "border-primary bg-secondary text-primary ring-1 ring-primary"
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
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
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
        <Field label="Teléfono / WhatsApp" hint="Opcional, pero recomendado">
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

      {prospectType !== "strategic_ally" && (
        <Field label="Plan de interés" className="mt-5">
          <select
            value={planCode}
            onChange={(event) => {
              setPlanCode(event.target.value as PlanCode | "");
              setFeedback(null);
            }}
            className={inputClass}
          >
            <option value="">No estoy seguro todavía</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <PlanSummary plan={selectedPlan} paymentsEnabled={paymentsEnabled} />

      <Field label="Mensaje" className="mt-5">
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

      <div
        ref={feedbackRef}
        tabIndex={-1}
        aria-live="polite"
        className="focus:outline-none"
      >
        {feedback && <FeedbackMessage feedback={feedback} />}
      </div>

      {paymentReady ? (
        <button
          type="button"
          onClick={reopenPayment}
          disabled={busy}
          className={submitButtonClass}
        >
          {phase === "opening_checkout"
            ? "Abriendo pago…"
            : "Abrir pago nuevamente"}
        </button>
      ) : paymentRetry ? (
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
          disabled={busy}
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
    </form>
  );
}

function PlanSummary({
  plan,
  paymentsEnabled,
}: {
  plan?: MembershipPlan;
  paymentsEnabled: boolean;
}) {
  if (!plan) {
    return (
      <p className="mt-4 rounded-xl border border-dashed border-border bg-surface/60 px-4 py-3 text-sm text-muted-foreground">
        Elige un plan para ver el valor y el siguiente paso antes de enviar.
      </p>
    );
  }

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
          ? "Después de registrar tu solicitud, continuarás a la pasarela segura de Bold. El valor final será validado por ACIA antes de abrir el pago."
          : plan.paymentKind === "free"
            ? "Este plan no requiere pago. ACIA continuará el proceso después de recibir tu solicitud."
            : plan.paymentKind === "negotiated"
              ? "Este plan requiere gestión comercial. No se mostrará ni cobrará un valor automático."
              : "ACIA continuará el proceso de vinculación después de recibir tu solicitud."}
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
  shouldContinueToPayment,
  selectedPlan,
  paymentsEnabled,
}: {
  phase: FlowPhase;
  shouldContinueToPayment: boolean;
  selectedPlan?: MembershipPlan;
  paymentsEnabled: boolean;
}) {
  if (phase === "creating_prospect") return "Registrando solicitud…";
  if (phase === "preparing_checkout") return "Preparando pago…";
  if (phase === "opening_checkout") return "Abriendo pago…";
  if (shouldContinueToPayment) return "Continuar al pago";
  if (paymentsEnabled && selectedPlan?.paymentKind === "free") {
    return "Afiliarme gratis";
  }
  if (paymentsEnabled && selectedPlan?.paymentKind === "negotiated") {
    return "Solicitar afiliación";
  }
  return "Enviar mi solicitud";
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
