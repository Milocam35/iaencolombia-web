import { ACIA_API_URL } from "@/lib/config";
import type { PlanCode, ProspectType } from "@/lib/membershipPlans";

export interface AffiliationProspectPayload {
  prospect_type: ProspectType;
  plan_code: PlanCode | null;
  contact_name: string;
  email: string;
  phone: string | null;
  organization_name: string | null;
  organization_role: string | null;
  city: string | null;
  message: string | null;
  privacy_accepted: boolean;
  website: string | null;
}

export interface AffiliationProspectResponse {
  status: "received";
  payment_context: string;
}

export interface BoldCheckoutResponse {
  apiKey: string;
  orderId: string;
  amount: number;
  currency: "COP";
  integritySignature: string;
  description: string;
  redirectionUrl: string;
  originUrl?: string;
  publicToken: string;
}

export type MembershipPaymentStatus =
  | "created"
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired";

export interface MembershipPaymentStatusResponse {
  status: MembershipPaymentStatus;
  plan_name: string;
  amount: number;
  currency: "COP";
}

export class PublicApiError extends Error {
  constructor(
    public readonly status: number | null,
    message = "public_api_request_failed",
  ) {
    super(message);
    this.name = "PublicApiError";
  }
}

const CAPABILITY_PATTERN = /^[A-Za-z0-9_-]{32,128}$/;
const ORDER_ID_PATTERN = /^[A-Za-z0-9_-]{1,60}$/;
const SIGNATURE_PATTERN = /^[a-fA-F0-9]{64}$/;
const PAYMENT_STATUSES = new Set<MembershipPaymentStatus>([
  "created",
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "expired",
]);

async function requestJson(
  path: string,
  expectedStatus: number,
  init?: RequestInit,
  fetcher: typeof fetch = fetch,
) {
  let response: Response;
  try {
    response = await fetcher(`${ACIA_API_URL}${path}`, init);
  } catch {
    throw new PublicApiError(null, "network_error");
  }

  if (!response.ok || response.status !== expectedStatus) {
    throw new PublicApiError(response.status);
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new PublicApiError(response.status, "invalid_response");
  }
}

export async function createAffiliationProspect(
  payload: AffiliationProspectPayload,
  fetcher: typeof fetch = fetch,
): Promise<AffiliationProspectResponse> {
  const data = await requestJson(
    "/public/affiliation-prospects",
    202,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    fetcher,
  );

  if (
    !isRecord(data) ||
    data.status !== "received" ||
    typeof data.payment_context !== "string" ||
    !CAPABILITY_PATTERN.test(data.payment_context)
  ) {
    throw new PublicApiError(202, "invalid_response");
  }

  return {
    status: "received",
    payment_context: data.payment_context,
  };
}

export async function createBoldMembershipCheckout(
  request: { payment_context: string; plan_code: PlanCode },
  fetcher: typeof fetch = fetch,
): Promise<BoldCheckoutResponse> {
  const data = await requestJson(
    "/public/membership-payments/bold/checkout",
    201,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
    fetcher,
  );

  if (!isValidCheckoutResponse(data)) {
    throw new PublicApiError(201, "invalid_response");
  }

  return {
    apiKey: data.apiKey,
    orderId: data.orderId,
    amount: data.amount,
    currency: data.currency,
    integritySignature: data.integritySignature,
    description: data.description,
    redirectionUrl: data.redirectionUrl,
    ...(data.originUrl ? { originUrl: data.originUrl } : {}),
    publicToken: data.publicToken,
  };
}

export async function getMembershipPaymentStatus(
  publicToken: string,
  fetcher: typeof fetch = fetch,
): Promise<MembershipPaymentStatusResponse> {
  if (!CAPABILITY_PATTERN.test(publicToken)) {
    throw new PublicApiError(404);
  }

  const data = await requestJson(
    `/public/membership-payments/${encodeURIComponent(publicToken)}`,
    200,
    { headers: { Accept: "application/json" } },
    fetcher,
  );

  if (
    !isRecord(data) ||
    typeof data.status !== "string" ||
    !PAYMENT_STATUSES.has(data.status as MembershipPaymentStatus) ||
    typeof data.plan_name !== "string" ||
    !data.plan_name.trim() ||
    typeof data.amount !== "number" ||
    !Number.isSafeInteger(data.amount) ||
    data.amount <= 0 ||
    data.currency !== "COP"
  ) {
    throw new PublicApiError(200, "invalid_response");
  }

  return data as unknown as MembershipPaymentStatusResponse;
}

export function getCheckoutErrorMessage(error: unknown) {
  const status = error instanceof PublicApiError ? error.status : null;

  if (status === 404) {
    return "Tu solicitud quedó registrada, pero no fue posible autorizar este pago. Escríbenos a info@iaencolombia.org para continuar.";
  }
  if (status === 409) {
    return "Tu solicitud quedó registrada. Este plan no se procesa mediante pago en línea; nuestro equipo continuará el proceso contigo.";
  }
  if (status === 422) {
    return "Tu solicitud quedó registrada, pero el plan no está habilitado para pago en línea en este momento.";
  }
  if (status === 429) {
    return "Tu solicitud quedó registrada. Alcanzaste el límite temporal de intentos de pago; espera unos minutos antes de consultar nuevamente.";
  }
  return "Tu solicitud quedó registrada, pero no pudimos preparar el pago. Inténtalo nuevamente o escríbenos a info@iaencolombia.org.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidCheckoutResponse(value: unknown): value is BoldCheckoutResponse {
  if (!isRecord(value)) return false;

  return (
    typeof value.apiKey === "string" &&
    value.apiKey.length > 0 &&
    typeof value.orderId === "string" &&
    ORDER_ID_PATTERN.test(value.orderId) &&
    typeof value.amount === "number" &&
    Number.isSafeInteger(value.amount) &&
    value.amount > 0 &&
    value.currency === "COP" &&
    typeof value.integritySignature === "string" &&
    SIGNATURE_PATTERN.test(value.integritySignature) &&
    typeof value.description === "string" &&
    value.description.length >= 2 &&
    typeof value.redirectionUrl === "string" &&
    isHttpUrl(value.redirectionUrl) &&
    typeof value.publicToken === "string" &&
    CAPABILITY_PATTERN.test(value.publicToken) &&
    (value.originUrl === undefined ||
      (typeof value.originUrl === "string" && isHttpUrl(value.originUrl)))
  );
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ||
      (url.protocol === "http:" && url.hostname === "localhost");
  } catch {
    return false;
  }
}
