import type {
  MembershipPaymentStatusResponse,
} from "@/lib/affiliationPayments";

export const PAYMENT_POLL_DELAYS_MS = [0, 1_000, 2_000, 4_000, 5_000] as const;

export function isFinalPaymentStatus(
  status: MembershipPaymentStatusResponse["status"],
) {
  return ["approved", "rejected", "cancelled", "expired"].includes(status);
}

export async function pollPaymentStatus({
  requestStatus,
  signal,
  delaysMs = PAYMENT_POLL_DELAYS_MS,
}: {
  requestStatus: () => Promise<MembershipPaymentStatusResponse>;
  signal?: AbortSignal;
  delaysMs?: readonly number[];
}) {
  let latest: MembershipPaymentStatusResponse | null = null;

  for (const delayMs of delaysMs) {
    if (delayMs > 0) await wait(delayMs, signal);
    if (signal?.aborted) throw abortError();
    latest = await requestStatus();
    if (isFinalPaymentStatus(latest.status)) {
      return { timedOut: false, payment: latest } as const;
    }
  }

  return { timedOut: true, payment: latest } as const;
}

function wait(milliseconds: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = globalThis.setTimeout(resolve, milliseconds);
    signal?.addEventListener(
      "abort",
      () => {
        globalThis.clearTimeout(timeout);
        reject(abortError());
      },
      { once: true },
    );
  });
}

function abortError() {
  return new DOMException("The operation was aborted.", "AbortError");
}
