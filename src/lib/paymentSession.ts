import type {
  BoldCheckoutResponse,
  MembershipPaymentStatus,
} from "@/lib/affiliationPayments";

const PAYMENT_TOKEN_SESSION_KEY = "acia.membership-payment.public-token.v1";
const PREPARED_CHECKOUT_SESSION_KEY =
  "acia.membership-payment.prepared-checkout.v1";
const PUBLIC_TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,128}$/;
const API_KEY_PATTERN = /^[A-Za-z0-9_-]{1,256}$/;
const ORDER_ID_PATTERN = /^[A-Za-z0-9_-]{1,60}$/;
const SIGNATURE_PATTERN = /^[a-fA-F0-9]{64}$/;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_URL_LENGTH = 2_048;
const MAX_CLOCK_SKEW_MS = 60_000;

export const PREPARED_CHECKOUT_TTL_MS = 30 * 60 * 1_000;

interface PreparedCheckoutEnvelope {
  version: 1;
  storedAt: number;
  checkout: BoldCheckoutResponse;
}

export function storePaymentToken(publicToken: string) {
  if (!PUBLIC_TOKEN_PATTERN.test(publicToken)) {
    throw new Error("invalid_public_payment_token");
  }
  window.sessionStorage.setItem(PAYMENT_TOKEN_SESSION_KEY, publicToken);
}

export function getPaymentToken() {
  const publicToken = window.sessionStorage.getItem(PAYMENT_TOKEN_SESSION_KEY);
  if (!publicToken) return null;
  if (PUBLIC_TOKEN_PATTERN.test(publicToken)) return publicToken;

  window.sessionStorage.removeItem(PAYMENT_TOKEN_SESSION_KEY);
  return null;
}

export function clearPaymentToken() {
  window.sessionStorage.removeItem(PAYMENT_TOKEN_SESSION_KEY);
}

export function storePreparedCheckout(
  checkout: BoldCheckoutResponse,
  storedAt = Date.now(),
) {
  const safeCheckout = copyValidCheckout(checkout, false);
  if (!safeCheckout || !Number.isSafeInteger(storedAt) || storedAt <= 0) {
    throw new Error("invalid_prepared_checkout");
  }

  const envelope: PreparedCheckoutEnvelope = {
    version: 1,
    storedAt,
    checkout: safeCheckout,
  };
  window.sessionStorage.setItem(
    PREPARED_CHECKOUT_SESSION_KEY,
    JSON.stringify(envelope),
  );
}

export function loadPreparedCheckout(now = Date.now()) {
  const serialized = window.sessionStorage.getItem(
    PREPARED_CHECKOUT_SESSION_KEY,
  );
  if (!serialized) return null;

  let value: unknown;
  try {
    value = JSON.parse(serialized);
  } catch {
    clearPaymentSession();
    return null;
  }

  if (!isValidEnvelope(value, now)) {
    clearPaymentSession();
    return null;
  }

  return copyValidCheckout(value.checkout);
}

export function loadPreparedCheckoutForPayments(
  paymentsEnabled: boolean,
  now = Date.now(),
) {
  return paymentsEnabled ? loadPreparedCheckout(now) : null;
}

export function clearPreparedCheckout() {
  window.sessionStorage.removeItem(PREPARED_CHECKOUT_SESSION_KEY);
}

export function clearPaymentSession() {
  clearPaymentToken();
  clearPreparedCheckout();
}

export function reconcilePaymentSessionForStatus(
  status: MembershipPaymentStatus,
) {
  if (status === "created" || status === "pending") return false;
  clearPaymentSession();
  return true;
}

function isValidEnvelope(
  value: unknown,
  now: number,
): value is PreparedCheckoutEnvelope {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ["version", "storedAt", "checkout"]) ||
    value.version !== 1 ||
    typeof value.storedAt !== "number" ||
    !Number.isSafeInteger(value.storedAt) ||
    value.storedAt <= 0 ||
    value.storedAt > now + MAX_CLOCK_SKEW_MS ||
    now - value.storedAt >= PREPARED_CHECKOUT_TTL_MS
  ) {
    return false;
  }

  return copyValidCheckout(value.checkout) !== null;
}

function copyValidCheckout(
  value: unknown,
  requireExactKeys = true,
): BoldCheckoutResponse | null {
  if (!isRecord(value)) return null;

  const requiredKeys = [
    "apiKey",
    "orderId",
    "amount",
    "currency",
    "integritySignature",
    "description",
    "redirectionUrl",
    "publicToken",
  ];
  if (
    (requireExactKeys &&
      !hasExactKeys(
        value,
        value.originUrl === undefined
          ? requiredKeys
          : [...requiredKeys, "originUrl"],
      )) ||
    typeof value.apiKey !== "string" ||
    !API_KEY_PATTERN.test(value.apiKey) ||
    typeof value.orderId !== "string" ||
    !ORDER_ID_PATTERN.test(value.orderId) ||
    typeof value.amount !== "number" ||
    !Number.isSafeInteger(value.amount) ||
    value.amount <= 0 ||
    value.currency !== "COP" ||
    typeof value.integritySignature !== "string" ||
    !SIGNATURE_PATTERN.test(value.integritySignature) ||
    typeof value.description !== "string" ||
    value.description.length < 2 ||
    value.description.length > MAX_DESCRIPTION_LENGTH ||
    typeof value.redirectionUrl !== "string" ||
    !isHttpsUrl(value.redirectionUrl) ||
    typeof value.publicToken !== "string" ||
    !PUBLIC_TOKEN_PATTERN.test(value.publicToken) ||
    (value.originUrl !== undefined &&
      (typeof value.originUrl !== "string" || !isHttpsUrl(value.originUrl)))
  ) {
    return null;
  }

  return {
    apiKey: value.apiKey,
    orderId: value.orderId,
    amount: value.amount,
    currency: value.currency,
    integritySignature: value.integritySignature,
    description: value.description,
    redirectionUrl: value.redirectionUrl,
    ...(value.originUrl ? { originUrl: value.originUrl } : {}),
    publicToken: value.publicToken,
  };
}

function hasExactKeys(value: Record<string, unknown>, expectedKeys: string[]) {
  const actualKeys = Object.keys(value);
  return (
    actualKeys.length === expectedKeys.length &&
    expectedKeys.every((key) => actualKeys.includes(key))
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHttpsUrl(value: string) {
  if (value.length > MAX_URL_LENGTH) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
