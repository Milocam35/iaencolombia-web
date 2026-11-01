/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS browser harness, outside the app bundle. */
/* Local browser QA. Never sends requests to production or real checkout. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("../.local-review/tools/node_modules/playwright");
const AxeBuilder =
  require("../.local-review/tools/node_modules/@axe-core/playwright").default;
const {
  MEMBERSHIP_CATEGORIES,
  MEMBERSHIP_PLANS,
} = require("../src/lib/membershipPlans.ts");
const root = path.resolve(__dirname, "..");
const base = process.env.ACIA_REVIEW_URL || "http://127.0.0.1:3200";
assert.ok(
  ["localhost", "127.0.0.1"].includes(new URL(base).hostname),
  "Solo se permite localhost.",
);
const chrome =
  process.env.ACIA_REVIEW_CHROME ||
  path.join(
    process.env.LOCALAPPDATA,
    "ms-playwright",
    "chromium-1243",
    "chrome-win64",
    "chrome.exe",
  );
const evidence = path.join(
  root,
  process.env.ACIA_REVIEW_EVIDENCE || "review-acia-opcion3/after",
);
fs.mkdirSync(evidence, { recursive: true });
const result = {
  widths: [],
  pages: [],
  checks: [],
  a11y: [],
  blocked: [],
  errors: [],
  metrics: [],
};
const check = (name, condition) => {
  assert.ok(condition, name);
  result.checks.push(name);
  console.log("PASS", name);
};
const audit = async (page, label) => {
  const a = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const violations = a.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  }));
  result.a11y.push({ label, violations });
  console.log("AXE", label, violations.length);
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chrome,
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    await context.route("**/*", (route) => {
      const req = route.request();
      const url = new URL(req.url());
      if (
        ["127.0.0.1", "localhost"].includes(url.hostname) &&
        ["GET", "HEAD"].includes(req.method())
      )
        return route.continue();
      result.blocked.push({ method: req.method(), url: req.url() });
      return route.abort();
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => result.errors.push(error.message));
    await page.addInitScript(() => {
      window.__review = { lcp: 0, cls: 0, interactions: [] };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__review.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) window.__review.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (e.interactionId) window.__review.interactions.push(e.duration);
      }).observe({ type: "event", durationThreshold: 16, buffered: true });
    });
    const home = async () => {
      await page.goto(base, { waitUntil: "networkidle" });
      await page.locator("h1").waitFor();
    };
    const overflow = () =>
      page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
    const screen = async (name, fullPage = false) =>
      page.screenshot({ path: path.join(evidence, name + ".png"), fullPage });
    for (const width of [320, 360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await home();
      check(`Sin desbordamiento portada ${width}`, !(await overflow()));
      await screen(`final-home-${width}`);
      if ([390, 1440].includes(width)) {
        await page.locator("footer").scrollIntoViewIfNeeded();
        await page.locator("#internacional").scrollIntoViewIfNeeded();
        await page.locator(".alliance-logo").first().waitFor();
        await wait(200);
        await screen(`final-alliances-${width}`);
        await page.locator("h1").scrollIntoViewIfNeeded();
        await screen(`final-home-full-${width}`, true);
      }
      result.widths.push(width);
      if ([390, 1440].includes(width)) await audit(page, `home-${width}`);
      for (const category of MEMBERSHIP_CATEGORIES) {
        await page
          .getByRole("tab", { name: category.label, exact: true })
          .click();
        check(
          `Planes ${category.id} sin desbordamiento ${width}`,
          !(await overflow()),
        );
      }
      await page.getByRole("tab", { name: "Personas", exact: true }).click();
      await page.locator("#planes").scrollIntoViewIfNeeded();
      if ([390, 1440].includes(width)) await screen(`final-plans-${width}`);
      const header = await page.locator(".header-affiliate").boundingBox();
      check(
        `Afíliate persistente ${width}`,
        header && header.y >= 0 && header.y + header.height < 100,
      );
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await home();
    if (base.endsWith(":3201"))
      check(
        "Sin reproductor ficticio en compilación local",
        (await page.locator("video").count()) === 0,
      );
    const expectedAnchors = [
      "hero",
      "pilares",
      "que-hacemos",
      "valor",
      "planes",
      "eventos",
      "internacional",
      "hoja-de-ruta",
      "conocimiento",
      "comunicados",
      "newsletters",
      "gobernanza",
      "cta",
    ];
    for (const anchor of expectedAnchors)
      check(
        `Ancla existente #${anchor}`,
        (await page.locator(`[id="${anchor}"]`).count()) === 1,
      );
    const badAnchors = await page
      .locator('a[href^="#"],a[href^="/#"]')
      .evaluateAll((links) =>
        links
          .map((a) => a.getAttribute("href").split("#")[1])
          .filter((id) => !id || !document.getElementById(id)),
      );
    check(
      "Todos los fragmentos públicos tienen destino",
      badAnchors.length === 0,
    );
    check(
      "Dos alianzas exactas",
      (await page.locator(".alliance-card").count()) === 2,
    );
    check(
      "Mi ACIA conserva destino",
      (await page.locator(".member-access").getAttribute("href")) ===
        "https://mi.iaencolombia.org",
    );
    check(
      "Admin solo en pie, destino intacto",
      (await page
        .locator('header a[href="https://admin.iaencolombia.org"]')
        .count()) === 0 &&
        (await page
          .locator('footer a[href="https://admin.iaencolombia.org"]')
          .count()) === 1,
    );
    for (const label of [
      "Conócenos",
      "Afiliación",
      "Oportunidades",
      "Conocimiento",
      "Actualidad",
    ]) {
      const summary = page
        .locator(".desktop-nav summary")
        .filter({ hasText: label });
      await summary.click();
      check(
        `Submenú ${label} abierto`,
        await summary.evaluate((el) => el.parentElement.open),
      );
      await page.keyboard.press("Escape");
      check(
        `Escape cierra ${label}`,
        !(await summary.evaluate((el) => el.parentElement.open)),
      );
    }
    for (const [label, category] of [
      ["Soy una persona", "Personas"],
      ["Represento una empresa", "Empresas"],
      ["Soy una institución", "Instituciones"],
    ]) {
      await page.getByRole("button", { name: new RegExp(label) }).click();
      check(
        `Perfil conduce a ${category}`,
        (await page
          .getByRole("tab", { name: category, exact: true })
          .getAttribute("aria-selected")) === "true",
      );
    }
    check(
      "Universo visible en navegación desktop",
      await page.locator(".desktop-nav .nav-direct").isVisible(),
    );
    check(
      "Bandas de conversión y editorial antes de planes",
      await page.evaluate(
        () =>
          document.querySelector(".op3-conversion").offsetTop <
            document.querySelector(".op3-editorial-band").offsetTop &&
          document.querySelector(".op3-editorial-band").offsetTop <
            document.querySelector("#planes").offsetTop,
      ),
    );
    for (const category of MEMBERSHIP_CATEGORIES) {
      await page
        .getByRole("tab", { name: category.label, exact: true })
        .click();
      for (const plan of MEMBERSHIP_PLANS.filter(
        (p) => p.category === category.id,
      )) {
        const card = page.locator(".plan-card").filter({
          has: page.getByRole("heading", { name: plan.name, exact: true }),
        });
        const details = card.locator("details");
        if (await details.count()) await details.locator("summary").click();
        const text = await card.innerText();
        check(
          `Beneficios íntegros ${plan.id}`,
          plan.benefits.every((benefit) => text.includes(benefit)),
        );
        check(
          `Condiciones íntegras ${plan.id}`,
          [
            plan.audience,
            plan.priceQualifier,
            plan.discount,
            plan.commercialTerms,
          ]
            .filter(Boolean)
            .every((value) => text.includes(value)),
        );
        check(
          `Valor antes de precio ${plan.id}`,
          await card.evaluate(
            (el) =>
              el.querySelector(".plan-includes").getBoundingClientRect().top <=
              el.querySelector(".plan-pricing").getBoundingClientRect().top,
          ),
        );
        check(
          `Tarifa y enlace ${plan.id}`,
          (await card.innerText()).includes(plan.price) &&
            (await card
              .locator(`a[href="/afiliate?plan=${plan.id}"]`)
              .count()) === 1,
        );
      }
    }
    await page.getByRole("tab", { name: "Comunidad", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    check(
      "Planes por flechas del teclado",
      (await page
        .getByRole("tab", { name: "Personas", exact: true })
        .getAttribute("aria-selected")) === "true",
    );
    await page.keyboard.press("End");
    check(
      "Planes tecla End",
      (await page
        .getByRole("tab", { name: "Instituciones", exact: true })
        .getAttribute("aria-selected")) === "true",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await home();
    await page.getByRole("button", { name: "Abrir menú" }).click();
    check(
      "Menú móvil modal",
      await page.locator("#mobile-navigation").evaluate((el) => el.open),
    );
    await audit(page, "mobile-menu");
    await screen("final-mobile-menu");
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      check(
        `Foco retenido en menú ${i + 1}`,
        await page
          .locator("#mobile-navigation")
          .evaluate((el) => el.contains(document.activeElement)),
      );
    }
    await page.keyboard.press("Escape");
    check(
      "Escape devuelve foco al botón",
      await page
        .getByRole("button", { name: "Abrir menú" })
        .evaluate((el) => document.activeElement === el),
    );
    await page.getByRole("button", { name: "Alianza siguiente" }).click();
    await wait(100);
    check(
      "Carrusel avanza en móvil",
      (await page.locator(".alliance-counter").innerText()) === "02 / 02",
    );
    await page.locator(".alliance-card").nth(1).getByRole("link").focus();
    await page.keyboard.press("ArrowLeft");
    await wait(100);
    check(
      "Carrusel por teclado devuelve foco",
      await page
        .locator(".alliance-card")
        .first()
        .getByRole("link")
        .evaluate((el) => document.activeElement === el),
    );
    await page.locator("#noticias").scrollIntoViewIfNeeded();
    const activeNews = () =>
      page
        .locator('.news-slides li[aria-hidden="false"] .news-title')
        .innerText();
    const firstNews = await activeNews();
    await page.clock.install();
    await page.clock.fastForward(12000);
    check("Movimiento reducido sin avance", (await activeNews()) === firstNews);
    await page.getByRole("button", { name: "Noticia siguiente" }).click();
    check(
      "Noticias manuales con movimiento reducido",
      (await activeNews()) !== firstNews,
    );
    for (let i = 0; i < 4; i++) {
      const link = page.locator('.news-slides li[aria-hidden="false"] a');
      check(
        `Titular completo en reposo ${i + 1}`,
        await link.evaluate((el) => {
          const v = el.closest(".news-viewport").getBoundingClientRect(),
            r = el.getBoundingClientRect();
          return (
            r.left >= v.left - 1 &&
            r.right <= v.right + 1 &&
            r.top >= v.top - 1 &&
            r.bottom <= v.bottom + 1
          );
        }),
      );
      check(
        `Noticia externa ${i + 1}`,
        (await link.getAttribute("href")).startsWith("https://"),
      );
      await page.getByRole("button", { name: "Noticia siguiente" }).click();
    }
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await home();
    await page.locator("#noticias").scrollIntoViewIfNeeded();
    await page.mouse.move(1, 1);
    await page.locator("h1").evaluate((el) => {
      el.tabIndex = -1;
      el.focus({ preventScroll: true });
    });
    await wait(100);
    const initial = await activeNews();
    await page.clock.fastForward(10000);
    check(
      "Noticias avanzan tras lectura de nueve segundos",
      (await activeNews()) !== initial,
    );
    await wait(1000);
    await page.locator(".news-viewport").hover();
    const hoverTitle = await activeNews();
    await page.clock.fastForward(12000);
    check("Noticias pausan con cursor", (await activeNews()) === hoverTitle);
    await page.mouse.move(1, 1);
    await page.locator('.news-slides li[aria-hidden="false"] a').focus();
    const focusTitle = await activeNews();
    await page.clock.fastForward(12000);
    check("Noticias pausan con foco", (await activeNews()) === focusTitle);
    await page.getByRole("button", { name: "Pausar noticias" }).click();
    await page
      .locator("h1")
      .evaluate((el) => el.focus({ preventScroll: true }));
    await page.mouse.move(1, 1);
    const pausedTitle = await activeNews();
    await page.clock.fastForward(12000);
    check("Control pausa noticias", (await activeNews()) === pausedTitle);
    await page.getByRole("button", { name: "Reanudar noticias" }).click();
    await page
      .locator("h1")
      .evaluate((el) => el.focus({ preventScroll: true }));
    await page.mouse.move(1, 1);
    await wait(100);
    await page.clock.fastForward(10000);
    check("Control reanuda noticias", (await activeNews()) !== pausedTitle);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const routes = [
      "/afiliate",
      "/observatorio",
      "/papers",
      "/normatividad",
      "/comunicados",
      "/comunicados/terremoto-colombia-10-agosto-2026",
      "/newsletters",
      "/newsletters/cuando-un-agente-de-ia-actua-en-nombre-de-su-empresa-21e97a325f844cbbb180007944f8bc56",
      "/newsletters/que-deberia-quedar-despues-de-un-curso-de-inteligencia-artificial-4228750506f54cf2ab45296449554d10",
      "/transparencia",
      "/politica-tratamiento-datos",
      "/equipo",
      "/afiliate/pago/resultado",
      "/comunidad/confirmar",
      "/comunidad/preferencias",
      "/newsletters/preferencias",
    ];
    for (const route of routes) {
      const response = await page.goto(base + route, {
        waitUntil: "networkidle",
      });
      check(`Ruta ${route}`, response.status() === 200);
      check(`Reflow ${route}`, !(await overflow()));
      await audit(page, route);
      result.pages.push(route);
      if (
        ["/afiliate", "/newsletters", "/observatorio", "/papers"].includes(
          route,
        )
      )
        await screen(`final-${route.slice(1)}-390`, true);
    }
    for (const plan of MEMBERSHIP_PLANS) {
      await page.goto(`${base}/afiliate?plan=${plan.id}`, {
        waitUntil: "networkidle",
      });
      check(
        `Parámetro ${plan.id} conserva selección deliberada vacía`,
        (await page.locator('[name="plan_code"]').inputValue()) === "",
      );
      check(
        `Tipo derivado ${plan.id}`,
        (await page.locator('[name="prospect_type"]:checked').inputValue()) ===
          plan.prospectType,
      );
    }
    for (const type of ["person", "company", "institution", "strategic_ally"]) {
      await page.goto(`${base}/afiliate?type=${type}`, {
        waitUntil: "networkidle",
      });
      check(
        `Tipo URL ${type}`,
        (await page.locator('[name="prospect_type"]:checked').inputValue()) ===
          type,
      );
    }
    await page.goto(base + "/afiliate?plan=invalido", {
      waitUntil: "networkidle",
    });
    check(
      "Plan desconocido conserva aviso",
      (await page
        .getByRole("alert")
        .filter({ hasText: "El plan indicado no existe" })
        .count()) === 1,
    );
    let requests = [];
    let status = 503;
    await context.route("**/public/affiliation-prospects", async (route) => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({
        status,
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(
          status === 202
            ? {
                status: "received",
                payment_context: "context_" + "a".repeat(32),
              }
            : { detail: "Prueba local" },
        ),
      });
    });
    await page.goto(base + "/afiliate", { waitUntil: "networkidle" });
    await page.locator('[name="plan_code"]').selectOption("comunidad");
    await page.locator('[name="contact_name"]').fill("Revisión local ACIA");
    await page.locator('[name="email"]').fill("revision@example.test");
    await page.locator('[name="privacy_accepted"]').check();
    await page.locator('button[type="submit"]').click();
    await page.getByText(/No pudimos registrar tus datos/).waitFor();
    check("Error de formulario simulado", requests.length === 1);
    check(
      "Consentimiento y honeypot intactos",
      requests[0].privacy_accepted === true &&
        requests[0].communications_consent === false &&
        requests[0].website === null,
    );
    status = 202;
    await page.locator('button[type="submit"]').click();
    await page.getByText(/Hemos recibido tu registro en Comunidad/).waitFor();
    check("Éxito simulado sin correo ni pago", requests.length === 2);
    await screen("final-affiliation-mock-success-390", true);
    await page.goto(base + "/afiliate?plan=profesional", {
      waitUntil: "networkidle",
    });
    await page.locator('[name="plan_code"]').selectOption("profesional");
    check(
      "Gate desactivado impide pago",
      await page.locator('button[type="submit"]').isDisabled(),
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "/afiliate", { waitUntil: "networkidle" });
    await screen("final-afiliate-1440", true);
    await audit(page, "afiliate-1440");
    await home();
    await page.getByRole("tab", { name: "Empresas", exact: true }).click();
    await page.keyboard.press("ArrowLeft");
    result.metrics.push(
      await page.evaluate(() => ({
        ...window.__review,
        navigation:
          performance.getEntriesByType("navigation")[0]?.toJSON() ??
          "Navigation timing unavailable with test clock",
        resources: performance
          .getEntriesByType("resource")
          .reduce((n, r) => n + r.transferSize, 0),
      })),
    );
    const fixture = path.join(root, ".local-review/video-contract.html");
    if (fs.existsSync(fixture)) {
      await page.setContent(fs.readFileSync(fixture, "utf8"));
      check(
        "Video inicia silenciado en HTML5",
        await page
          .locator("video")
          .evaluate(
            (v) =>
              v.muted &&
              v.defaultMuted &&
              !v.autoplay &&
              v.controls &&
              v.preload === "none",
          ),
      );
      await page.locator("video").evaluate((v) => {
        v.muted = false;
      });
      check(
        "El visitante puede activar audio",
        await page.locator("video").evaluate((v) => !v.muted),
      );
    }
    await context.close();
  } finally {
    await browser.close();
    fs.writeFileSync(
      path.join(evidence, "browser-report.json"),
      JSON.stringify(result, null, 2),
    );
  }
  const violations = result.a11y.flatMap((a) =>
    a.violations.map((v) => ({ page: a.label, ...v })),
  );
  console.log(
    JSON.stringify(
      {
        checks: result.checks.length,
        violations,
        errors: result.errors,
        blocked: result.blocked,
      },
      null,
      2,
    ),
  );
  assert.equal(result.errors.length, 0, "Sin errores de ejecución");
  assert.equal(
    violations.length,
    0,
    "Sin infracciones automatizadas WCAG A/AA",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
