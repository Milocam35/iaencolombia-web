/* eslint-disable @typescript-eslint/no-require-imports -- Local browser review, outside the app bundle. */
const fs = require("node:fs");
const assert = require("node:assert/strict");
const { chromium } = require("../.local-review/tools/node_modules/playwright");
const AxeBuilder =
  require("../.local-review/tools/node_modules/@axe-core/playwright").default;
const { MEMBERSHIP_PLANS } = require("../src/lib/membershipPlans.ts");
const output = ".local-review/iteration-2";
const checks = [],
  layouts = [],
  audits = [],
  links = new Map();
const check = (name, ok) => {
  assert.ok(ok, name);
  checks.push(name);
};
const gate = (route) =>
  ["127.0.0.1", "localhost"].includes(
    new URL(route.request().url()).hostname,
  ) && ["GET", "HEAD"].includes(route.request().method())
    ? route.continue()
    : route.abort();
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.ACIA_REVIEW_CHROME ||
      "C:/Users/Usuario/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe",
  });
  try {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await context.route("**/*", gate);
    const page = await context.newPage();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("http://127.0.0.1:3101", { waitUntil: "networkidle" });
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.locator("#internacional").scrollIntoViewIfNeeded();
      await page
        .locator(".alliance-logo")
        .evaluateAll((images) =>
          Promise.all(images.map((img) => img.decode())),
        );
      await page.locator(".footer-logo").evaluate((img) => img.decode());
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `${output}/after/home-${width}.png`,
        fullPage: true,
      });
      await page.screenshot({ path: `${output}/after/hero-${width}.png` });
      layouts.push(
        await page.evaluate(
          (width) => ({
            width,
            height: document.documentElement.scrollHeight,
            plansTop: document.querySelector("#planes").offsetTop,
            overflow: document.documentElement.scrollWidth > innerWidth,
          }),
          width,
        ),
      );
      for (const [selector, name] of [
        ["#noticias", "noticias"],
        ["#perfiles", "perfiles"],
        ["#valor", "beneficios"],
        ["#planes", "planes"],
        ["#universo", "universo"],
        ["#internacional", "alianzas"],
        ["#newsletters", "editorial"],
      ]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page
          .locator(selector)
          .screenshot({ path: `${output}/after/${name}-${width}.png` });
      }
      for (const [profile, category, example] of [
        ["Soy una persona", "Personas", "afiliado"],
        ["Represento una empresa", "Empresas", "micro_empresa"],
        [
          "Soy institución o academia",
          "Instituciones",
          "institucion_educativa",
        ],
      ]) {
        await page.getByRole("button", { name: new RegExp(profile) }).click();
        const benefits = await page.locator("#profile-benefits").innerText();
        check(
          `Beneficios verificables ${category} ${width}`,
          MEMBERSHIP_PLANS.find((p) => p.id === example)
            .benefits.slice(0, 3)
            .every((b) => benefits.includes(b)),
        );
        await page.locator("#profile-benefits a").click();
        check(
          `Dos interacciones conducen a ${category} ${width}`,
          (await page
            .getByRole("tab", { name: category, exact: true })
            .getAttribute("aria-selected")) === "true",
        );
        check(
          `Foco en destino de planes ${category} ${width}`,
          await page
            .locator("#planes")
            .evaluate((el) => document.activeElement === el),
        );
      }
      for (const plan of MEMBERSHIP_PLANS) {
        const category = {
          comunidad: "Comunidad",
          personas: "Personas",
          empresas: "Empresas",
          instituciones: "Instituciones",
        }[plan.category];
        await page.getByRole("tab", { name: category, exact: true }).click();
        const a = page.locator(
          `.plan-card a[href='/afiliate?plan=${plan.id}']`,
        );
        links.set(await a.getAttribute("href"), {
          kind: "plan",
          text: plan.name,
        });
      }
      if (width === 1440)
        check(
          "Ambas alianzas visibles sin controles redundantes",
          await page.locator(".alliance-navigation").isHidden(),
        );
      for (const a of await page
        .locator("a[href]")
        .evaluateAll((els) =>
          els.map((el) => ({
            href: el.getAttribute("href"),
            text: el.textContent.trim(),
          })),
        ))
        links.set(a.href, {
          kind: a.href.startsWith("https://") ? "external" : "internal",
          text: a.text,
        });
      await page.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
      await page.locator("#conoce-acia").scrollIntoViewIfNeeded();
      await page
        .locator("#conoce-acia")
        .screenshot({ path: `${output}/after/video-pendiente-${width}.png` });
      check(
        `Video pendiente visible local ${width}`,
        await page
          .getByText("Pendiente de material oficial", { exact: true })
          .isVisible(),
      );
      check(
        `Sin reproductor ficticio ${width}`,
        (await page
          .locator("#conoce-acia video, #conoce-acia iframe")
          .count()) === 0,
      );
      const a = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      audits.push({
        width,
        mode: "local-development",
        violations: a.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      });
      check(`Axe con video pendiente ${width}`, a.violations.length === 0);
    }
    // Every edition, including narrow screens, remains fully inside its viewport when at rest.
    for (const width of [320, 360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("http://127.0.0.1:3101", { waitUntil: "networkidle" });
      for (let i = 0; i < 4; i++) {
        check(
          `Titular íntegro ${i + 1} a ${width}`,
          await page
            .locator('.news-slides li[aria-hidden="false"] a')
            .evaluate((el) => {
              const v = el.closest(".news-viewport").getBoundingClientRect(),
                r = el.getBoundingClientRect();
              return (
                r.left >= v.left - 1 &&
                r.right <= v.right + 1 &&
                r.bottom <= v.bottom + 1 &&
                r.top >= v.top - 1 &&
                el.scrollWidth <= el.clientWidth + 1
              );
            }),
        );
        await page.getByRole("button", { name: "Noticia siguiente" }).click();
      }
    }
    // Existing preselection behavior, with evidence; no form submission.
    for (const plan of ["comunidad", "profesional"]) {
      await page.setViewportSize({ width: 390, height: 1000 });
      await page.goto(`http://127.0.0.1:3101/afiliate?plan=${plan}`, {
        waitUntil: "networkidle",
      });
      check(
        `Preselección pendiente ${plan}`,
        (await page.locator('[name="plan_code"]').inputValue()) === "",
      );
      await page.screenshot({
        path: `${output}/after/preseleccion-${plan}-390.png`,
        fullPage: true,
      });
    }
    await context.close();
    const tour = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: {
        dir: `${output}/video`,
        size: { width: 1440, height: 900 },
      },
      reducedMotion: "reduce",
    });
    await tour.route("**/*", gate);
    const p = await tour.newPage();
    await p.goto("http://127.0.0.1:3100", { waitUntil: "networkidle" });
    await p.waitForTimeout(3000);
    await p.locator("#perfiles").scrollIntoViewIfNeeded();
    await p.getByRole("button", { name: /Represento una empresa/ }).click();
    await p.waitForTimeout(2500);
    await p.locator("#valor").scrollIntoViewIfNeeded();
    await p.waitForTimeout(2500);
    await p.locator("#conoce-acia").scrollIntoViewIfNeeded();
    await p.waitForTimeout(2500);
    await p.locator("#profile-benefits a").click();
    await p.waitForTimeout(3000);
    for (const selector of [
      "#universo",
      "#internacional",
      "#newsletters",
      "#pilares",
    ]) {
      await p.locator(selector).scrollIntoViewIfNeeded();
      await p.waitForTimeout(2500);
    }
    await p.locator("#hoja-de-ruta summary").click();
    await p.waitForTimeout(2000);
    await p.locator("#cta").scrollIntoViewIfNeeded();
    await p.waitForTimeout(2000);
    const video = p.video();
    await tour.close();
    await video.saveAs(`${output}/recorrido-local.webm`);
  } finally {
    await browser.close();
    fs.writeFileSync(
      `${output}/supplement-report.json`,
      JSON.stringify(
        {
          checks,
          layouts,
          audits,
          links: [...links].map(([href, rest]) => ({ href, ...rest })),
        },
        null,
        2,
      ),
    );
  }
  console.log(
    JSON.stringify({ checks: checks.length, layouts, audits }, null, 2),
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
