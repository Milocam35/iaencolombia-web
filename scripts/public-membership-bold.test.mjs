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

function createSessionStorage() {
  const values = new Map();
  return {
    values,
    storage: {
      setItem: (key, value) => values.set(key, value),
      getItem: (key) => values.get(key) ?? null,
      removeItem: (key) => values.delete(key),
    },
  };
}

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
  assert.equal(plans.getMembershipPlan("comunidad").paymentKind, "free");
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

test("un plan vacío, desconocido o de otro tipo no permite enviar solicitudes", async () => {
  const { getMembershipSubmissionAction } = await import(
    moduleUrl("src/lib/membershipPlans.ts"),
  );
  for (const paymentsEnabled of [true, false]) {
    for (const prospectType of ["person", "company", "institution"]) {
      for (const planCode of ["", "no_estoy_seguro", "invalido"]) {
        assert.equal(
          getMembershipSubmissionAction(prospectType, planCode, paymentsEnabled),
          "select_plan",
        );
      }
    }
    for (const [prospectType, planCode] of [
      ["person", "micro_empresa"],
      ["company", "comunidad"],
      ["institution", "gran_empresa"],
    ]) {
      assert.equal(
        getMembershipSubmissionAction(prospectType, planCode, paymentsEnabled),
        "select_plan",
      );
    }
  }
});

test("solo Comunidad/Freemium y Gran empresa terminan en una solicitud sin pago", async () => {
  const { MEMBERSHIP_PLANS, getMembershipSubmissionAction } = await import(
    moduleUrl("src/lib/membershipPlans.ts"),
  );
  for (const paymentsEnabled of [true, false]) {
    const requestPlans = MEMBERSHIP_PLANS.filter(
      (plan) => getMembershipSubmissionAction(
        plan.prospectType,
        plan.id,
        paymentsEnabled,
      ) === "request",
    );
    assert.deepEqual(requestPlans.map((plan) => plan.id), ["comunidad", "gran_empresa"]);
    assert.equal(
      getMembershipSubmissionAction("strategic_ally", "", paymentsEnabled),
      "contact",
    );
  }
});

test("los siete planes de pago requieren checkout y nunca se degradan a solicitud", async () => {
  const { getMembershipSubmissionAction } = await import(
    moduleUrl("src/lib/membershipPlans.ts"),
  );
  for (const [prospectType, planCode] of [
    ["person", "afiliado"],
    ["person", "estudiante"],
    ["person", "profesional"],
    ["company", "micro_empresa"],
    ["company", "pequena_empresa"],
    ["company", "mediana_empresa"],
    ["institution", "institucion_educativa"],
  ]) {
    assert.equal(getMembershipSubmissionAction(prospectType, planCode, true), "payment");
    assert.equal(getMembershipSubmissionAction(prospectType, planCode, false), "payment_unavailable");
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
    return new Response(JSON.stringify({
      ...checkoutResponse,
      payment_context: paymentContext,
      email: "ada@example.com",
      BOLD_SECRET_KEY: "must-not-reach-state",
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  };
  const response = await api.createBoldMembershipCheckout(
    { payment_context: paymentContext, plan_code: "profesional" },
    fetcher,
  );

  assert.equal(response.amount, checkoutResponse.amount);
  assert.deepEqual(response, checkoutResponse);
  assert.equal(Object.hasOwn(response, "payment_context"), false);
  assert.equal(Object.hasOwn(response, "email"), false);
  assert.equal(Object.hasOwn(response, "BOLD_SECRET_KEY"), false);
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
    assert.match(message, /datos quedaron registrados/i);
    assert.doesNotMatch(message, /solicitud|nuestro equipo continuará/i);
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

test("el 201 persiste checkout antes de open y un fallo conserva estado y storage", async () => {
  const flow = await import(
    moduleUrl("src/lib/boldCheckoutFlow.ts", `open-failure-${Date.now()}`)
  );
  const paymentSession = await import(
    moduleUrl("src/lib/paymentSession.ts", `prepared-${Date.now()}`)
  );
  const { values, storage } = createSessionStorage();
  globalThis.window = { sessionStorage: storage };

  let paymentState = { kind: "idle" };
  let checkoutPosts = 0;
  let opens = 0;
  const unsafeBackendResponse = {
    ...checkoutResponse,
    payment_context: paymentContext,
    email: "ada@example.com",
    BOLD_SECRET_KEY: "must-not-persist",
  };

  const result = await flow.prepareAndOpenBoldCheckout({
    paymentContext,
    planCode: "afiliado",
    prepareCheckout: async (request) => {
      checkoutPosts += 1;
      assert.deepEqual(request, {
        payment_context: paymentContext,
        plan_code: "afiliado",
      });
      return checkoutResponse;
    },
    onPrepared: (checkout) => {
      paymentSession.storePreparedCheckout(checkout, 1_000_000);
      paymentState = { kind: "prepared", checkout };
      assert.equal(opens, 0);
      assert.equal(values.size, 1);
    },
    openCheckout: async () => {
      opens += 1;
      assert.equal(paymentState.kind, "prepared");
      assert.equal(values.size, 1);
      throw new Error("popup_blocked");
    },
  });

  assert.equal(result.kind, "opening_failed");
  assert.equal(paymentState.kind, "prepared");
  assert.equal(Object.hasOwn(paymentState.checkout, "payment_context"), false);
  assert.equal(checkoutPosts, 1);
  assert.equal(opens, 1);

  const persistedAfterFailure = [...values.values()].join("\n");
  assert.match(persistedAfterFailure, new RegExp(checkoutResponse.orderId));

  paymentSession.storePreparedCheckout(unsafeBackendResponse, 1_000_000);
  const serialized = [...values.values()].join("\n");
  const envelope = JSON.parse(serialized);
  assert.equal(envelope.version, 1);
  assert.equal(envelope.storedAt, 1_000_000);
  assert.deepEqual(Object.keys(envelope.checkout).sort(), [
    "amount",
    "apiKey",
    "currency",
    "description",
    "integritySignature",
    "orderId",
    "originUrl",
    "publicToken",
    "redirectionUrl",
  ]);
  assert.doesNotMatch(serialized, /payment_context|ada@example|must-not-persist/);

  delete globalThis.window;
});

test("un error anterior al 201 sí permite reintentar la preparación", async () => {
  const flow = await import(
    moduleUrl("src/lib/boldCheckoutFlow.ts", `prepare-retry-${Date.now()}`)
  );
  let checkoutPosts = 0;
  const prepareCheckout = async () => {
    checkoutPosts += 1;
    if (checkoutPosts === 1) throw new Error("network_error");
    return checkoutResponse;
  };

  const failed = await flow.prepareAndOpenBoldCheckout({
    paymentContext,
    planCode: "afiliado",
    prepareCheckout,
    onPrepared: () => assert.fail("no debe guardar checkout sin un 201"),
    openCheckout: () => assert.fail("no debe abrir checkout sin un 201"),
  });
  assert.equal(failed.kind, "preparation_failed");

  let preparedCheckout = null;
  const retried = await flow.prepareAndOpenBoldCheckout({
    paymentContext,
    planCode: "afiliado",
    prepareCheckout,
    onPrepared: (checkout) => {
      preparedCheckout = checkout;
    },
    openCheckout: async () => undefined,
  });

  assert.equal(retried.kind, "opened");
  assert.equal(preparedCheckout, checkoutResponse);
  assert.equal(checkoutPosts, 2);
});

test("un script Bold fallido se descarta y el loader puede reintentarlo", async () => {
  const bold = await import(
    moduleUrl("src/lib/boldCheckout.ts", `loader-retry-${Date.now()}`)
  );
  let activeScript = null;
  let appended = 0;
  globalThis.window = {};
  globalThis.document = {
    querySelector: () => activeScript,
    createElement: () => {
      const script = new EventTarget();
      script.dataset = {};
      script.remove = () => {
        if (activeScript === script) activeScript = null;
      };
      return script;
    },
    head: {
      appendChild: (script) => {
        appended += 1;
        activeScript = script;
      },
    },
  };

  const first = bold.loadBoldCheckoutScript();
  const rejected = assert.rejects(first, /bold_checkout_script_failed/);
  activeScript.dispatchEvent(new Event("error"));
  await rejected;
  assert.equal(activeScript, null);

  const second = bold.loadBoldCheckoutScript();
  class Checkout {}
  window.BoldCheckout = Checkout;
  activeScript.dispatchEvent(new Event("load"));
  assert.equal(await second, Checkout);
  assert.equal(appended, 2);

  delete globalThis.document;
  delete globalThis.window;
});

test("remount rehidrata prepared y tres reaperturas no repiten ningún POST", async () => {
  const paymentSession = await import(
    moduleUrl("src/lib/paymentSession.ts", `remount-${Date.now()}`)
  );
  const flow = await import(
    moduleUrl("src/lib/boldCheckoutFlow.ts", `remount-flow-${Date.now()}`)
  );
  const { values, storage } = createSessionStorage();
  globalThis.window = { sessionStorage: storage };

  paymentSession.storePreparedCheckout(checkoutResponse, 2_000_000);
  let paymentState = { kind: "idle" };

  const rehydrated = paymentSession.loadPreparedCheckoutForPayments(
    true,
    2_001_000,
  );
  if (rehydrated) paymentState = { kind: "prepared", checkout: rehydrated };

  const prospectPosts = 0;
  const checkoutPosts = 0;
  let opens = 0;
  for (let retry = 0; retry < 3; retry += 1) {
    const retryResult = await flow.attemptPreparedBoldCheckoutOpen(
      paymentState.checkout,
      async () => {
        opens += 1;
      },
    );
    assert.equal(retryResult.kind, "opened");
  }

  assert.equal(paymentState.kind, "prepared");
  assert.equal(paymentState.checkout.orderId, checkoutResponse.orderId);
  assert.equal(prospectPosts, 0);
  assert.equal(checkoutPosts, 0);
  assert.equal(opens, 3);
  assert.equal(values.size, 1);

  delete globalThis.window;
});

test("checkout expirado se elimina junto con el token público", async () => {
  const paymentSession = await import(
    moduleUrl("src/lib/paymentSession.ts", `expired-${Date.now()}`)
  );
  const { values, storage } = createSessionStorage();
  globalThis.window = { sessionStorage: storage };

  const storedAt = 3_000_000;
  paymentSession.storePreparedCheckout(checkoutResponse, storedAt);
  paymentSession.storePaymentToken(publicToken);
  assert.equal(values.size, 2);
  assert.equal(
    paymentSession.loadPreparedCheckout(
      storedAt + paymentSession.PREPARED_CHECKOUT_TTL_MS,
    ),
    null,
  );
  assert.equal(values.size, 0);

  delete globalThis.window;
});

test("payload preparado alterado o inválido se elimina inmediatamente", async () => {
  const paymentSession = await import(
    moduleUrl("src/lib/paymentSession.ts", `tampered-${Date.now()}`)
  );
  const { values, storage } = createSessionStorage();
  globalThis.window = { sessionStorage: storage };
  const now = 4_000_000;
  const mutations = [
    (envelope) => { envelope.checkout.orderId = "orden inválida"; },
    (envelope) => { envelope.checkout.amount = 0; },
    (envelope) => { envelope.checkout.currency = "USD"; },
    (envelope) => { envelope.checkout.integritySignature = "altered"; },
    (envelope) => { envelope.checkout.publicToken = "short"; },
    (envelope) => { envelope.checkout.redirectionUrl = "http://example.com"; },
    (envelope) => { envelope.checkout.originUrl = "javascript:alert(1)"; },
    (envelope) => { envelope.checkout.email = "ada@example.com"; },
  ];

  for (const mutate of mutations) {
    values.clear();
    paymentSession.storePreparedCheckout(checkoutResponse, now);
    paymentSession.storePaymentToken(publicToken);
    const preparedEntry = [...values.entries()].find(([, value]) =>
      value.startsWith('{"version":1'),
    );
    assert.ok(preparedEntry);
    const [key, serialized] = preparedEntry;
    const envelope = JSON.parse(serialized);
    mutate(envelope);
    values.set(key, JSON.stringify(envelope));

    assert.equal(paymentSession.loadPreparedCheckout(now + 1), null);
    assert.equal(values.size, 0);
  }

  delete globalThis.window;
});

test("approved y demás estados terminales limpian; pending conserva la reapertura", async () => {
  const paymentSession = await import(
    moduleUrl("src/lib/paymentSession.ts", `terminal-${Date.now()}`)
  );
  const { values, storage } = createSessionStorage();
  globalThis.window = { sessionStorage: storage };

  for (const status of ["approved", "rejected", "cancelled", "expired"]) {
    paymentSession.storePreparedCheckout(checkoutResponse, 5_000_000);
    paymentSession.storePaymentToken(publicToken);
    assert.equal(
      paymentSession.reconcilePaymentSessionForStatus("created"),
      false,
    );
    assert.equal(
      paymentSession.reconcilePaymentSessionForStatus("pending"),
      false,
    );
    assert.equal(values.size, 2);
    assert.equal(paymentSession.reconcilePaymentSessionForStatus(status), true);
    assert.equal(values.size, 0);
  }

  delete globalThis.window;
});

test("feature flag false no lee checkout ni habilita apertura Bold", async () => {
  const paymentSession = await import(
    moduleUrl("src/lib/paymentSession.ts", `gate-off-${Date.now()}`)
  );
  let storageReads = 0;
  let opens = 0;
  globalThis.window = {
    sessionStorage: {
      setItem: () => undefined,
      getItem: () => {
        storageReads += 1;
        return null;
      },
      removeItem: () => undefined,
    },
  };

  const rehydrated = paymentSession.loadPreparedCheckoutForPayments(false);
  if (rehydrated) opens += 1;
  assert.equal(rehydrated, null);
  assert.equal(storageReads, 0);
  assert.equal(opens, 0);

  delete globalThis.window;
});

test("publicToken permanece disponible para reload hasta limpieza terminal", async () => {
  const paymentSession = await import(
    moduleUrl("src/lib/paymentSession.ts", `token-${Date.now()}`)
  );
  const { values, storage } = createSessionStorage();
  globalThis.window = { sessionStorage: storage };

  paymentSession.storePaymentToken(publicToken);
  assert.equal(values.size, 1);
  assert.equal(paymentSession.getPaymentToken(), publicToken);
  assert.equal(paymentSession.getPaymentToken(), publicToken);
  assert.equal(values.size, 1);

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
    source("src/lib/boldCheckoutFlow.ts"),
  ]);
  const form = files[0];
  assert.match(form, /name="privacy_accepted"/);
  assert.match(form, /name="website"/);
  assert.match(form, /submissionInFlight\.current/);
  assert.match(form, /if \(submissionInFlight\.current\) return/);
  assert.match(form, /aria-live="polite"/);
  assert.match(form, /kind: "prepared"/);
  assert.match(form, /loadPreparedCheckoutForPayments\(paymentsEnabled\)/);
  assert.match(form, /storePreparedCheckout\(checkout\)/);
  assert.match(form, /Abrir pago nuevamente/);
  assert.match(form, /Elegir otro plan/);
  assert.match(form, /Intentar preparar el pago nuevamente/);
  assert.match(
    form,
    /Tus datos están registrados y tu pago está listo\. Continúa en la pasarela segura de Bold para completar el pago\./,
  );
  assert.doesNotMatch(form, /pago (fue|ha sido) (rechazado|no fue aprobado)/i);
  assert.match(form, /if \(!shouldContinueToPayment\) return/);

  const resultPage = files[4];
  assert.match(resultPage, /reconcilePaymentSessionForStatus/);
  assert.doesNotMatch(resultPage, /takePaymentToken/);

  const securitySurface = files.join("\n");
  assert.doesNotMatch(securitySurface, /console\.(log|info|debug|warn)/);
  assert.doesNotMatch(securitySurface, /localStorage/);
  assert.doesNotMatch(securitySurface, /bold-tx-status|bold-order-id/);
  assert.doesNotMatch(securitySurface, /BOLD_SECRET_KEY/);
  assert.doesNotMatch(securitySurface, /analytics/i);
});
