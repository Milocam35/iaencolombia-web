"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getMembershipPaymentStatus,
  type MembershipPaymentStatusResponse,
} from "@/lib/affiliationPayments";
import { isFinalPaymentStatus, pollPaymentStatus } from "@/lib/paymentPolling";
import { getPaymentStatusPresentation } from "@/lib/paymentResult";
import {
  getPaymentToken,
  loadPreparedCheckout,
  reconcilePaymentSessionForStatus,
} from "@/lib/paymentSession";

type ResultState =
  | { kind: "verifying" }
  | {
      kind: "payment";
      payment: MembershipPaymentStatusResponse;
      timedOut: boolean;
    }
  | { kind: "error" };

export function PaymentResult() {
  const paymentToken = useRef<string | null | undefined>(undefined);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ResultState>({ kind: "verifying" });

  useEffect(() => {
    if (paymentToken.current === undefined) {
      try {
        const preparedCheckout = loadPreparedCheckout();
        paymentToken.current =
          getPaymentToken() ?? preparedCheckout?.publicToken ?? null;
      } catch {
        paymentToken.current = null;
      }
    }

    const token = paymentToken.current;
    if (!token) {
      let active = true;
      queueMicrotask(() => {
        if (active) setState({ kind: "error" });
      });
      return () => {
        active = false;
      };
    }

    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) setState({ kind: "verifying" });
    });
    void pollPaymentStatus({
      requestStatus: () => getMembershipPaymentStatus(token),
      signal: controller.signal,
    })
      .then((result) => {
        if (!controller.signal.aborted && result.payment) {
          if (isFinalPaymentStatus(result.payment.status)) {
            try {
              reconcilePaymentSessionForStatus(result.payment.status);
            } catch {
              // El resultado verificado del backend prevalece si storage no está disponible.
            }
          }
          setState({
            kind: "payment",
            payment: result.payment,
            timedOut: result.timedOut,
          });
        }
      })
      .catch((error: unknown) => {
        if (
          !controller.signal.aborted &&
          !(error instanceof DOMException && error.name === "AbortError")
        ) {
          setState({ kind: "error" });
        }
      });

    return () => controller.abort();
  }, [attempt]);

  return (
    <div
      className="overflow-hidden rounded-3xl border border-border bg-white shadow-2xl shadow-primary/[0.08]"
      aria-live="polite"
      aria-busy={state.kind === "verifying"}
    >
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="p-7 sm:p-10">
        {state.kind === "verifying" && <VerifyingState />}
        {state.kind === "error" && <ErrorState onRetry={() => setAttempt((value) => value + 1)} />}
        {state.kind === "payment" && (
          <PaymentState
            payment={state.payment}
            timedOut={state.timedOut}
            onRetry={() => setAttempt((value) => value + 1)}
          />
        )}
      </div>
    </div>
  );
}

function VerifyingState() {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary">
        <span
          className="size-7 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
          aria-hidden="true"
        />
      </div>
      <p className="mt-7 font-mono text-[10px] font-bold tracking-[0.2em] text-primary/55 uppercase">
        Confirmación segura
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Estamos verificando tu pago
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
        Consultamos directamente el estado registrado por ACIA. Esto puede
        tardar unos segundos mientras recibimos la confirmación.
      </p>
    </div>
  );
}

function PaymentState({
  payment,
  timedOut,
  onRetry,
}: {
  payment: MembershipPaymentStatusResponse;
  timedOut: boolean;
  onRetry: () => void;
}) {
  const presentation = getPaymentStatusPresentation(payment.status);
  const pending = payment.status === "created" || payment.status === "pending";

  return (
    <div className="text-center">
      <div
        className={`mx-auto flex size-16 items-center justify-center rounded-full ${presentation.iconClass}`}
        aria-hidden="true"
      >
        <StatusIcon kind={presentation.icon} />
      </div>
      <p className="mt-7 font-mono text-[10px] font-bold tracking-[0.2em] text-primary/55 uppercase">
        Estado informado por ACIA
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {presentation.title}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
        {presentation.description}
      </p>

      <dl className="mx-auto mt-8 grid max-w-lg gap-px overflow-hidden rounded-2xl border border-border bg-border text-left sm:grid-cols-2">
        <div className="bg-surface p-4">
          <dt className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
            Plan
          </dt>
          <dd className="mt-1 text-sm font-extrabold text-primary">
            {payment.plan_name}
          </dd>
        </div>
        <div className="bg-surface p-4">
          <dt className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
            Valor
          </dt>
          <dd className="mt-1 text-sm font-extrabold text-primary">
            {formatAmount(payment.amount, payment.currency)}
          </dd>
        </div>
      </dl>

      <div className="mt-7 rounded-2xl border border-primary/10 bg-secondary/60 px-5 py-4 text-left">
        <p className="text-sm font-bold text-primary">Siguiente paso</p>
        <p className="mt-1 text-sm leading-6 text-primary/75">
          Tu solicitud de vinculación quedó registrada. ACIA continuará el
          proceso de afiliación.
        </p>
      </div>

      {pending && timedOut && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-7 inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-[#031560] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Consultar nuevamente
        </button>
      )}

      {!pending && (
        <Link
          href="/"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-xl border border-primary/20 px-6 text-sm font-bold text-primary transition hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Volver al inicio
        </Link>
      )}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50 text-red-700">
        <StatusIcon kind="error" />
      </div>
      <p className="mt-7 font-mono text-[10px] font-bold tracking-[0.2em] text-primary/55 uppercase">
        Verificación no disponible
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        No pudimos verificar el estado del pago
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
        Si acabas de completar el pago, espera un momento e inténtalo otra vez.
        No realizaremos una confirmación basándonos únicamente en la
        redirección de Bold.
      </p>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-[#031560] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Consultar nuevamente
        </button>
        <Link
          href="/afiliate"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-primary/20 px-6 text-sm font-bold text-primary transition hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Volver a afiliación
        </Link>
      </div>
    </div>
  );
}

function StatusIcon({
  kind,
}: {
  kind: "success" | "error" | "cancelled" | "pending";
}) {
  if (kind === "success") {
    return (
      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "pending") {
    return (
      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  return (
    <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M8 8l8 8M16 8l-8 8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function formatAmount(amount: number, currency: "COP") {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
