/* eslint-disable @typescript-eslint/no-require-imports -- Local visual and accessibility evidence, outside application code. */
const fs = require("node:fs");
const assert = require("node:assert/strict");
const { chromium } = require("../.local-review/tools/node_modules/playwright");
const AxeBuilder =
  require("../.local-review/tools/node_modules/@axe-core/playwright").default;
const root = "review-acia-opcion3",
  base = "http://127.0.0.1:3201";
const report = {
  checks: [],
  layouts: [],
  audits: [],
  links: [],
  focus: { positions: 0, failures: [] },
};
function check(label, ok) {
  assert.ok(ok, label);
  report.checks.push(label);
  console.log("PASS", label);
}
const gate = (r) =>
  ["localhost", "127.0.0.1"].includes(new URL(r.request().url()).hostname) &&
  ["GET", "HEAD"].includes(r.request().method())
    ? r.continue()
    : r.abort();
(async () => {
  fs.mkdirSync(`${root}/after`, { recursive: true });
  const b = await chromium.launch({
    headless: true,
    executablePath:
      process.env.ACIA_REVIEW_CHROME ||
      "C:/Users/Usuario/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe",
  });
  try {
    const c = await b.newContext({ reducedMotion: "reduce" });
    await c.route("**/*", gate);
    const p = await c.newPage();
    for (const width of [320, 360, 390, 768, 1024, 1280, 1440]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(base, { waitUntil: "networkidle" });
      for (const selector of [
        ".op3-hero",
        ".op3-conversion",
        ".op3-editorial-band",
        "footer",
      ])
        await p.locator(selector).scrollIntoViewIfNeeded();
      await p
        .locator("img")
        .evaluateAll((images) =>
          Promise.all(images.map((img) => img.decode())),
        );
      await p.evaluate(() => scrollTo(0, 0));
      const layout = await p.evaluate(
        (width) => ({
          width,
          height: document.documentElement.scrollHeight,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          heroHeight: document
            .querySelector(".op3-hero")
            .getBoundingClientRect().height,
          conversionColumns: getComputedStyle(
            document.querySelector(".op3-conversion"),
          ).gridTemplateColumns.split(" ").length,
          editorialColumns: getComputedStyle(
            document.querySelector(".op3-editorial-columns"),
          ).gridTemplateColumns.split(" ").length,
        }),
        width,
      );
      report.layouts.push(layout);
      check(`Sin desbordamiento ${width}`, !layout.overflow);
      check(
        `Composición de columnas ${width}`,
        layout.conversionColumns ===
          (width >= 1280 ? 3 : width >= 768 ? 2 : 1) &&
          layout.editorialColumns === layout.conversionColumns,
      );
      check(
        `Hero fotográfico cargado ${width}`,
        await p
          .locator(".op3-hero-photo img")
          .evaluate(
            (i) =>
              i.complete &&
              i.naturalWidth > 0 &&
              i.getAttribute("src").includes("hero.webp"),
          ),
      );
      check(
        `Afiliación persistente ${width}`,
        await p.locator(".header-affiliate").evaluate((e) => {
          const r = e.getBoundingClientRect();
          return r.top >= 0 && r.bottom < 90;
        }),
      );
      await p.screenshot({ path: `${root}/after/hero-${width}.png` });
      if ([390, 768, 1024, 1440].includes(width))
        await p.screenshot({
          path: `${root}/after/home-${width}.png`,
          fullPage: true,
        });
      if ([390, 1440].includes(width)) {
        for (const [selector, name] of [
          [".op3-conversion", "conversion"],
          ["#valor", "beneficios"],
          ["#perfiles", "perfiles"],
          ["#planes", "planes"],
          ["#universo", "universo"],
          ["#noticias", "ticker"],
          [".op3-editorial-band", "editorial"],
          ["#conoce-acia", "institucional"],
          ["#internacional", "alianzas"],
          ["#newsletters", "actualidad"],
        ]) {
          await p.locator(selector).scrollIntoViewIfNeeded();
          await p
            .locator(selector)
            .screenshot({
              path: `${root}/after/${name}-${width}.png`,
              style:
                ".site-header, .site-header *, .skip-link { visibility: hidden !important; }",
            });
        }
        for (const [label, category] of [
          ["Soy una persona", "Personas"],
          ["Represento una empresa", "Empresas"],
          ["Soy una institución", "Instituciones"],
        ]) {
          await p.getByRole("button", { name: new RegExp(label) }).click();
          await p.waitForFunction(
            (category) =>
              document.activeElement === document.querySelector("#planes") &&
              [...document.querySelectorAll('[role="tab"]')].some(
                (el) =>
                  el.textContent.trim() === category &&
                  el.getAttribute("aria-selected") === "true",
              ),
            category,
          );
          check(
            `Perfil conduce a plan y foco ${category} ${width}`,
            (await p
              .getByRole("tab", { name: category, exact: true })
              .getAttribute("aria-selected")) === "true" &&
              (await p
                .locator("#planes")
                .evaluate((e) => document.activeElement === e)),
          );
        }
        const axe = await new AxeBuilder({ page: p })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        report.audits.push({ width, violations: axe.violations });
        check(`Axe perfil instituciones ${width}`, axe.violations.length === 0);
      }
      if (width >= 1280) {
        check(
          `Navegación desktop ${width}`,
          await p.locator(".desktop-nav").isVisible(),
        );
        check(
          `Dos alianzas sin desplazamiento artificial ${width}`,
          await p.locator(".alliance-navigation").isHidden(),
        );
      }
      for (let i = 0; i < 4; i++) {
        await p.locator("#noticias").scrollIntoViewIfNeeded();
        check(
          `Titular íntegro ${i + 1} ${width}`,
          await p
            .locator('.news-slides li[aria-hidden="false"] a')
            .evaluate((el) => {
              const v = el.closest(".news-viewport").getBoundingClientRect(),
                r = el.getBoundingClientRect();
              return (
                r.left >= v.left - 1 &&
                r.right <= v.right + 1 &&
                r.top >= v.top - 1 &&
                r.bottom <= v.bottom + 1 &&
                el.scrollWidth <= el.clientWidth + 1
              );
            }),
        );
        await p.getByRole("button", { name: "Noticia siguiente" }).click();
      }
    }
    check(
      "Alternativa institucional sin falso video",
      (await p
        .locator("#conoce-acia")
        .innerText()
        .then(
          (t) =>
            t.includes("Conoce ACIA") &&
            !/pendiente|video del presidente/i.test(t),
        )) && (await p.locator("video,iframe").count()) === 0,
    );
    check(
      "Universo ilustrativo identificado",
      (await p.locator(".op3-universe-photo figcaption").innerText()) ===
        "Imagen ilustrativa",
    );
    check(
      "Tres fotografías de beneficios diferentes",
      new Set(
        await p
          .locator(".op3-benefit-photo img")
          .evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src"))),
      ).size === 3,
    );
    check(
      "Editorial con pieza destacada y dos secundarias",
      (await p.locator(".op3-story-featured").count()) === 1 &&
        (await p.locator(".op3-story-list .op3-story").count()) >= 2,
    );
    report.links = await p
      .locator("a[href]")
      .evaluateAll((els) => [
        ...new Set(els.map((e) => e.getAttribute("href"))),
      ]);
    for (const width of [390, 1440])
      for (const route of ["/", "/afiliate"]) {
        await p.setViewportSize({ width, height: 844 });
        await p.goto(base + route, { waitUntil: "networkidle" });
        for (let i = 0; i < 80; i++) {
          await p.keyboard.press("Tab");
          const item = await p.evaluate(() => {
            const el = document.activeElement;
            if (el === document.body) return null;
            const r = el.getBoundingClientRect();
            return {
              role: el.getAttribute("role"),
              text: el.textContent.trim().slice(0, 70),
              top: r.top,
              bottom: r.bottom,
              header: !!el.closest(".site-header"),
              headerHeight: document
                .querySelector(".site-header")
                .getBoundingClientRect().bottom,
              viewport: innerHeight,
            };
          });
          if (item) {
            report.focus.positions++;
            if (
              !item.header &&
              ((item.top < item.headerHeight - 1 && item.role !== "tabpanel") ||
                (item.bottom > item.viewport + 1 && item.role !== "tabpanel"))
            )
              report.focus.failures.push({ width, route, index: i, ...item });
          }
        }
      }
    check(
      "Foco visible fuera de la cabecera fija",
      report.focus.failures.length === 0,
    );
    for (const [width, dpr] of [
      [720, 2],
      [320, 4],
    ]) {
      const zoom = await b.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: dpr,
        reducedMotion: "reduce",
      });
      await zoom.route("**/*", gate);
      const z = await zoom.newPage();
      await z.goto(base, { waitUntil: "networkidle" });
      check(
        `Reflow equivalente zoom DPR ${dpr}`,
        await z.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      await z.getByRole("button", { name: "Abrir menú" }).click();
      check(
        `Menú en densidad ${dpr}`,
        await z.locator("#mobile-navigation").evaluate((e) => e.open),
      );
      await z.screenshot({ path: `${root}/after/zoom-${dpr}.png` });
      await zoom.close();
    }
    for (const plan of ["comunidad", "profesional"]) {
      await p.setViewportSize({ width: 390, height: 1000 });
      await p.goto(`${base}/afiliate?plan=${plan}`, {
        waitUntil: "networkidle",
      });
      check(
        `Preselección previa ${plan}`,
        (await p.locator('[name="plan_code"]').inputValue()) === "",
      );
      await p.screenshot({
        path: `${root}/after/preseleccion-${plan}.png`,
        fullPage: true,
      });
    }
    await c.close();
    const tour = await b.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
      recordVideo: {
        dir: `${root}/video`,
        size: { width: 1440, height: 1000 },
      },
    });
    await tour.route("**/*", gate);
    const q = await tour.newPage();
    await q.goto(base, { waitUntil: "networkidle" });
    await q.waitForTimeout(2500);
    for (const selector of [".op3-conversion", ".op3-editorial-band"]) {
      await q.locator(selector).scrollIntoViewIfNeeded();
      await q.waitForTimeout(3000);
    }
    await q.getByRole("button", { name: /Represento una empresa/ }).click();
    await q.waitForTimeout(3000);
    for (const selector of ["#conocimiento", "#pilares", "#cta"]) {
      await q.locator(selector).scrollIntoViewIfNeeded();
      await q.waitForTimeout(2000);
    }
    const video = q.video();
    await tour.close();
    await video.saveAs(`${root}/recorrido-opcion3.webm`);
  } finally {
    await b.close();
    fs.writeFileSync(
      `${root}/visual-report.json`,
      JSON.stringify(report, null, 2),
    );
  }
  console.log(
    JSON.stringify(
      {
        checks: report.checks.length,
        focus: report.focus,
        layouts: report.layouts,
        audits: report.audits.map((a) => ({
          width: a.width,
          violations: a.violations.length,
        })),
      },
      null,
      2,
    ),
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
