import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const source = (relativePath) =>
  readFile(path.join(root, relativePath), "utf8");
const moduleUrl = (relativePath, cacheKey = "") => {
  const url = pathToFileURL(path.join(root, relativePath));
  if (cacheKey) url.searchParams.set("test", cacheKey);
  return url.href;
};

async function importAffiliationPayments() {
  const file = await source("src/lib/affiliationPayments.ts");
  const isolated = file.replace(
    'import { ACIA_API_URL } from "@/lib/config";',
    'const ACIA_API_URL = "https://api.acia.test";',
  );
  const output = ts.transpileModule(isolated, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return import(
    `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`
  );
}

const paymentContext = `context_${"a".repeat(32)}`;
const publicToken = `payment_${"b".repeat(32)}`;
const checkoutResponse = {
  apiKey: "test_identity_key",
  orderId: "ACIA-20260829-ABC123",
  amount: 790000,
  currency: "COP",
  integritySignature: "c".repeat(64),
  description: "Afiliación ACIA - Profesional",
  redirectionUrl: "https://iaencolombia.org/afiliate/pago/resultado",
  originUrl: "https://iaencolombia.org/afiliate",
  publicToken,
};

test("los plan_codes coinciden con el contrato backend y el gate cambia solo el CTA", async () => {
  const plans = await import(moduleUrl("src/lib/membershipPlans.ts"));
  assert.deepEqual(
    plans.MEMBERSHIP_PLANS.map((plan) => plan.id),
    [
      "comunidad",
      "afiliado",
      "estudiante",
      "profesional",
      "micro_empresa",
      "pequena_empresa",
      "mediana_empresa",
      "gran_empresa",
      "institucion_educativa",
    ],
  );
  assert.equal(
    plans.getMembershipPlanCta(plans.getMembershipPlan("comunidad"), true),
    "Afiliarme gratis",
  );
  assert.equal(
    plans.getMembershipPlanCta(plans.getMembershipPlan("profesional"), true),
    "Afiliarme y pagar",
  );
  assert.equal(
    plans.getMembershipPlanCta(plans.getMembershipPlan("gran_empresa"), true),
    "Solicitar afiliación",
  );
  assert.equal(
    plans.getMembershipPlanCta(plans.getMembershipPlan("profesional"), false),
    "Quiero afiliarme",
  );
  assert.equal(plans.getMembershipPlan("invalido"), undefined);
});

test("el feature gate es fail-closed y solo acepta true explícito", async () => {
  const previous = process.env.NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_ENABLED;
  delete process.env.NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_ENABLED;
  const disabled = await import(
    moduleUrl("src/lib/config.ts", `disabled-${Date.now()}`)
  );
  assert.equal(disabled.BOLD_MEMBERSHIP_PAYMENTS_ENABLED, false);

  process.env.NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_ENABLED = "TRUE";
  const enabled = await import(
    moduleUrl("src/lib/config.ts", `enabled-${Date.now()}`)
  );
  assert.equal(enabled.BOLD_MEMBERSHIP_PAYMENTS_ENABLED, true);

  if (previous === undefined) {
    delete process.env.NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_ENABLED;
  } else {
    process.env.NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_ENABLED = previous;
  }
});

test("el 202 captura payment_context y conserva el payload existente", async () => {
  const api = await importAffiliationPayments();
  let captured;
  const payload = {
    prospect_type: "person",
    plan_code: "profesional",
    contact_name: "Ada Lovelace",
    email: "ada@example.com",
    phone: null,
    organization_name: null,
    organization_role: null,
    city: "Bogotá",
    message: null,
    privacy_accepted: true,
    website: null,
  };
  const fetcher = async (url, init) => {
    captured = { url, init };
    return new Response(
      JSON.stringify({ status: "received", payment_context: paymentContext }),
      { status: 202, headers: { "Content-Type": "application/json" } },
    );
  };

  const response = await api.createAffiliationProspect(payload, fetcher);
  assert.equal(response.payment_context, paymentContext);
  assert.equal(
    captured.url,
    "https://api.acia.test/public/affiliation-prospects",
  );
  assert.deepEqual(JSON.parse(captured.init.body), payload);
});

test("una respuesta de prospecto distinta de 202 no inicia el flujo", async () => {
  const api = await importAffiliationPayments();
  const fetcher = async () =>
    new Response(
      JSON.stringify({ status: "received", payment_context: paymentContext }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  await assert.rejects(
    api.createAffiliationProspect(
      {
        prospect_type: "person",
        plan_code: null,
        contact_name: "Ada",
        email: "ada@example.com",
        phone: null,
        organization_name: null,
        organization_role: null,
        city: null,
        message: null,
        privacy_accepted: true,
        website: null,
      },
      fetcher,
    ),
    (error) => error.status === 200,
  );
});

test("checkout envía únicamente capability y plan_code; nunca construye amount", async () => {
  const api = await importAffiliationPayments();
  let captured;
  const fetcher = async (url, init) => {
    captured = { url, init };
    return new Response(JSON.stringify(checkoutResponse), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  };
  const response = await api.createBoldMembershipCheckout(
    { payment_context: paymentContext, plan_code: "profesional" },
    fetcher,
  );

  assert.equal(response.amount, checkoutResponse.amount);
  assert.deepEqual(JSON.parse(captured.init.body), {
    payment_context: paymentContext,
    plan_code: "profesional",
  });
  assert.equal(Object.hasOwn(JSON.parse(captured.init.body), "amount"), false);
});

test("los errores de checkout tienen mensajes seguros y accionables", async () => {
  const api = await importAffiliationPayments();
  for (const status of [404, 409, 422, 429, 503]) {
    const message = api.getCheckoutErrorMessage(new api.PublicApiError(status));
    assert.match(message, /solicitud quedó registrada/i);
    assert.doesNotMatch(message, /trace|payment_context|publicToken/i);
  }
});

test("checkout distingue rate limit y error de red sin exponer payloads", async () => {
  const api = await importAffiliationPayments();
  await assert.rejects(
    api.createBoldMembershipCheckout(
      { payment_context: paymentContext, plan_code: "profesional" },
      async () => new Response("{}", { status: 429 }),
    ),
    (error) => error.status === 429,
  );
  await assert.rejects(
    api.createBoldMembershipCheckout(
      { payment_context: paymentContext, plan_code: "profesional" },
      async () => {
        throw new TypeError("offline");
      },
    ),
    (error) =>
      error.status === null &&
      error.message === "network_error" &&
      !error.message.includes(paymentContext),
  );
});

test("el script oficial de Bold se carga una sola vez", async () => {
  const bold = await import(
    moduleUrl("src/lib/boldCheckout.ts", `loader-${Date.now()}`)
  );
  const script = new EventTarget();
  script.dataset = {};
  let appended = 0;
  globalThis.window = {};
  globalThis.document = {
    querySelector: () => null,
    createElement: () => script,
    head: {
      appendChild: () => {
        appended += 1;
      },
    },
  };

  const first = bold.loadBoldCheckoutScript();
  const second = bold.loadBoldCheckoutScript();
  class Checkout {}
  window.BoldCheckout = Checkout;
  script.dispatchEvent(new Event("load"));
  assert.equal(await first, Checkout);
  assert.equal(await second, Checkout);
  assert.equal(appended, 1);

  delete globalThis.document;
  delete globalThis.window;
});

test("BoldCheckout usa la respuesta backend, excluye publicToken y llama open", async () => {
  const bold = await import(
    moduleUrl("src/lib/boldCheckout.ts", `open-${Date.now()}`)
  );
  let config;
  let opened = 0;
  globalThis.window = {
    BoldCheckout: class {
      constructor(value) {
        config = value;
      }
      open() {
        opened += 1;
      }
    },
  };

  await bold.openBoldCheckout(checkoutResponse);
  assert.equal(opened, 1);
  assert.equal(config.amount, String(checkoutResponse.amount));
  assert.equal(config.integritySignature, checkoutResponse.integritySignature);
  assert.equal(Object.hasOwn(config, "publicToken"), false);
  assert.equal(Object.hasOwn(config, "paymentContext"), false);

  delete globalThis.window;
});

test("publicToken vive en sessionStorage y se elimina al consumirlo", async () => {
  const paymentSession = await import(
    moduleUrl("src/lib/paymentSession.ts", `session-${Date.now()}`)
  );
  const values = new Map();
  globalThis.window = {
    sessionStorage: {
      setItem: (key, value) => values.set(key, value),
      getItem: (key) => values.get(key) ?? null,
      removeItem: (key) => values.delete(key),
    },
  };

  paymentSession.storePaymentToken(publicToken);
  assert.equal(values.size, 1);
  assert.equal(paymentSession.takePaymentToken(), publicToken);
  assert.equal(values.size, 0);
  assert.equal(paymentSession.takePaymentToken(), null);

  delete globalThis.window;
});

test("polling termina al aprobar, rechazar o cancelar", async () => {
  const polling = await import(moduleUrl("src/lib/paymentPolling.ts"));
  for (const finalStatus of ["approved", "rejected", "cancelled"]) {
    const statuses = ["pending", finalStatus];
    const result = await polling.pollPaymentStatus({
      requestStatus: async () => ({
        status: statuses.shift(),
        plan_name: "Profesional",
        amount: 790000,
        currency: "COP",
      }),
      delaysMs: [0, 0, 0],
    });
    assert.equal(result.timedOut, false);
    assert.equal(result.payment.status, finalStatus);
  }
});

test("polling pendiente tiene timeout limitado y permite consulta manual", async () => {
  const polling = await import(moduleUrl("src/lib/paymentPolling.ts"));
  let calls = 0;
  const result = await polling.pollPaymentStatus({
    requestStatus: async () => {
      calls += 1;
      return {
        status: "pending",
        plan_name: "Profesional",
        amount: 790000,
        currency: "COP",
      };
    },
    delaysMs: [0, 0, 0],
  });
  assert.equal(result.timedOut, true);
  assert.equal(result.payment.status, "pending");
  assert.equal(calls, 3);
});

test("la página de resultado distingue estados sin prometer membresía activa", async () => {
  const result = await import(moduleUrl("src/lib/paymentResult.ts"));
  assert.equal(
    result.getPaymentStatusPresentation("pending").title,
    "Estamos verificando tu pago",
  );
  assert.equal(
    result.getPaymentStatusPresentation("approved").title,
    "Pago confirmado",
  );
  assert.equal(
    result.getPaymentStatusPresentation("rejected").title,
    "El pago no fue aprobado",
  );
  assert.equal(
    result.getPaymentStatusPresentation("cancelled").title,
    "El pago fue anulado",
  );

  const component = await source(
    "src/components/payments/PaymentResult.tsx",
  );
  assert.match(component, /ACIA continuará el\s+proceso de afiliación/);
  assert.doesNotMatch(component, /membresía activa|membresía ha sido activada/i);
});

test("header desktop/móvil y tarjetas convergen en el único flujo", async () => {
  const [header, config, plans] = await Promise.all([
    source("src/components/layout/Header.tsx"),
    source("src/lib/config.ts"),
    source("src/components/sections/MembershipPlansSection.tsx"),
  ]);
  assert.match(config, /AFFILIATION_PATH = "\/afiliate"/);
  assert.equal((header.match(/href=\{AFFILIATION_PATH\}/g) ?? []).length, 2);
  assert.match(plans, /\/afiliate\?plan=/);
  assert.match(plans, /getMembershipPlanCta/);
});

test("guardas de privacidad, honeypot y doble submit permanecen en el formulario", async () => {
  const files = await Promise.all([
    source("src/components/forms/AffiliationForm.tsx"),
    source("src/lib/affiliationPayments.ts"),
    source("src/lib/boldCheckout.ts"),
    source("src/lib/paymentSession.ts"),
    source("src/components/payments/PaymentResult.tsx"),
  ]);
  const form = files[0];
  assert.match(form, /name="privacy_accepted"/);
  assert.match(form, /name="website"/);
  assert.match(form, /submissionInFlight\.current/);
  assert.match(form, /if \(submissionInFlight\.current\) return/);
  assert.match(form, /aria-live="polite"/);

  const securitySurface = files.join("\n");
  assert.doesNotMatch(securitySurface, /console\.(log|info|debug|warn)/);
  assert.doesNotMatch(securitySurface, /localStorage/);
  assert.doesNotMatch(securitySurface, /bold-tx-status|bold-order-id/);
});
