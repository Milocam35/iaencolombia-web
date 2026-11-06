/* eslint-disable @typescript-eslint/no-require-imports -- Standalone browser QA, outside the application bundle. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const toolsRoot =
  process.env.ACIA_REVIEW_TOOLS ||
  path.resolve(__dirname, "../.local-review/tools/node_modules");
const { chromium } = require(path.join(toolsRoot, "playwright"));
const AxeBuilder = require(
  path.join(toolsRoot, "@axe-core/playwright"),
).default;
const base = process.env.ACIA_REVIEW_URL || "http://127.0.0.1:3301";
assert.ok(
  ["localhost", "127.0.0.1"].includes(new URL(base).hostname) ||
    new URL(base).hostname.endsWith(".vercel.app"),
  "Review only; no production mutations.",
);
const evidence =
  process.env.ACIA_REVIEW_EVIDENCE ||
  "review-acia-opcion3/universo-video-20261106";
const report = {
  base,
  checks: [],
  audits: [],
  layouts: [],
  playback: [],
  network: [],
  errors: [],
};
const youtubeHost = (host) =>
  [
    "youtube.com",
    "youtube-nocookie.com",
    "ytimg.com",
    "googlevideo.com",
    "googleusercontent.com",
    "ggpht.com",
    "doubleclick.net",
    "googlesyndication.com",
    "googleadservices.com",
  ].some((domain) => host === domain || host.endsWith("." + domain));
function check(name, ok) {
  assert.ok(ok, name);
  report.checks.push(name);
  console.log("PASS", name);
}
async function audit(page, name) {
  const result = await new AxeBuilder({ page })
    .include("#universo")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const providerNode = (node) =>
    node.target.length > 1 && String(node.target[0]).includes("iframe");
  const scopeRules = (isProvider) =>
    result.violations
      .map((rule) => ({
        ...rule,
        nodes: rule.nodes.filter((node) => providerNode(node) === isProvider),
      }))
      .filter((rule) => rule.nodes.length);
  const violations = scopeRules(false);
  const providerViolations = scopeRules(true);
  report.audits.push({ name, violations, providerViolations });
  check(`Axe del bloque ACIA ${name}`, violations.length === 0);
}
async function contract(page, width) {
  const media = await page.locator(".op3-universe-video").boundingBox();
  check(`16:9 ${width}`, Math.abs(media.width / media.height - 16 / 9) < 0.015);
  check(
    `Reflow ${width}`,
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  );
  check(
    `CTA original ${width}`,
    (await page
      .getByRole("link", { name: "Conoce Universo ACIA", exact: false })
      .getAttribute("href")) === "https://mi.iaencolombia.org",
  );
  check(
    `Condiciones y capacidades ${width}`,
    await page
      .locator("#universo")
      .innerText()
      .then((text) =>
        [
          "Descubre perfiles",
          "Explora intereses",
          "Encuentra conexiones",
          "Comunidad / Freemium no incluye",
        ].every((s) => text.includes(s)),
      ),
  );
  return media;
}
(async () => {
  fs.mkdirSync(evidence, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.ACIA_REVIEW_CHROME ||
      path.join(
        process.env.LOCALAPPDATA,
        "ms-playwright/chromium-1248/chrome-win64/chrome.exe",
      ),
  });
  try {
    // Ordinary motion: nothing from YouTube above the block; autoplay is muted on entry.
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 820 },
        reducedMotion: "no-preference",
      });
      const requests = [];
      await context.route("**/*", (route) => {
        const req = route.request(),
          host = new URL(req.url()).hostname;
        if (!["GET", "HEAD"].includes(req.method()) && !youtubeHost(host))
          return route.abort();
        return route.continue();
      });
      context.on("request", (req) => {
        const url = new URL(req.url());
        if (youtubeHost(url.hostname))
          requests.push({
            host: url.hostname,
            path: url.pathname,
            method: req.method(),
            type: req.resourceType(),
            ...(url.hostname === "www.youtube-nocookie.com" &&
            url.pathname.startsWith("/embed/")
              ? { referrer: req.headers().referer }
              : {}),
          });
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => report.errors.push(e.message));
      await page.goto(base, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(800);
      check(
        `Sin iframe antes de entrar al bloque ${width}`,
        (await page.locator("#universo iframe").count()) === 0,
      );
      check(
        `Sin conexiones YouTube antes del bloque ${width}`,
        requests.length === 0,
      );
      await page.locator(".header-affiliate").focus();
      const before = await page.locator(".op3-universe-video").boundingBox();
      await page.locator(".op3-universe-video").scrollIntoViewIfNeeded();
      const iframe = page.locator("#universo iframe");
      await iframe.waitFor({ state: "visible" });
      const src = new URL(await iframe.getAttribute("src"));
      check(
        `Autoplay silenciado ${width}`,
        src.origin === "https://www.youtube-nocookie.com" &&
          src.pathname === "/embed/fDKVNBuN9zw" &&
          src.searchParams.get("autoplay") === "1" &&
          src.searchParams.get("mute") === "1" &&
          src.searchParams.get("playsinline") === "1" &&
          src.searchParams.get("controls") === "1" &&
          !src.searchParams.has("si"),
      );
      check(
        `Referrer y pantalla completa ${width}`,
        (await iframe.getAttribute("referrerpolicy")) ===
          "strict-origin-when-cross-origin" &&
          (await iframe.getAttribute("allowfullscreen")) !== null,
      );
      check(
        `Autoplay no roba foco ${width}`,
        await page
          .locator(".header-affiliate")
          .evaluate((el) => document.activeElement === el),
      );
      const after = await contract(page, width);
      check(
        `Sin salto del espacio de video ${width}`,
        Math.abs(after.height - before.height) < 1 &&
          Math.abs(after.width - before.width) < 1,
      );
      report.layouts.push({ width, mode: "automatic", before, after });
      let playback = { width, verified: false };
      try {
        const frame = await iframe.contentFrame();
        await frame
          .locator("video")
          .waitFor({ state: "attached", timeout: 15000 });
        await frame.locator("body").evaluate(
          () =>
            new Promise((resolve, reject) => {
              const poll = setInterval(() => {
                const video = document.querySelector("video");
                if (video && !video.paused && video.currentTime > 0) {
                  clearInterval(poll);
                  clearTimeout(timer);
                  resolve();
                }
              }, 150);
              const timer = setTimeout(() => {
                clearInterval(poll);
                reject(
                  new Error(
                    "Video did not start within the observation window",
                  ),
                );
              }, 15000);
            }),
        );
        const initial = await frame.locator("video").evaluate((v) => ({
          time: v.currentTime,
          muted: v.muted || v.volume === 0,
          volume: v.volume,
          paused: v.paused,
          readyState: v.readyState,
        }));
        await page.waitForTimeout(1800);
        const final = await frame.locator("video").evaluate((v) => ({
          time: v.currentTime,
          muted: v.muted || v.volume === 0,
          volume: v.volume,
          paused: v.paused,
        }));
        playback = {
          width,
          verified: final.time > initial.time && final.muted && !final.paused,
          initial,
          final,
        };
      } catch (error) {
        playback.limitation = error.message.split("\n")[0];
        try {
          playback.sample = await iframe
            .contentFrame()
            .locator("video")
            .evaluate((v) => ({
              time: v.currentTime,
              muted: v.muted,
              volume: v.volume,
              paused: v.paused,
              readyState: v.readyState,
            }));
        } catch {}
        const frame = await iframe.contentFrame();
        try {
          playback.playerMessage = (
            await frame.locator("body").innerText({ timeout: 2000 })
          ).slice(0, 350);
        } catch {}
      }
      report.playback.push(playback);
      await iframe.hover();
      report.network.push({ width, requests });
      await page.waitForTimeout(2000);
      await page
        .locator("#universo")
        .screenshot({
          path: `${evidence}/player-${width}.png`,
          style:
            ".site-header, .site-header *, .skip-link, .kpichat-signature { visibility: hidden !important; }",
        });
      await audit(page, `player-${width}`);
      await context.close();
    }
    // Reduced motion: stable local cover, no third-party request until manual activation.
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const requests = [];
      context.on("request", (req) => {
        if (youtubeHost(new URL(req.url()).hostname)) requests.push(req.url());
      });
      await context.route("**/*", (r) =>
        !["GET", "HEAD"].includes(r.request().method()) &&
        !youtubeHost(new URL(r.request().url()).hostname)
          ? r.abort()
          : r.continue(),
      );
      const page = await context.newPage();
      page.on("pageerror", (e) => report.errors.push(e.message));
      await page.goto(base, { waitUntil: "networkidle" });
      await page.locator(".op3-universe-video").scrollIntoViewIfNeeded();
      await page.locator(".op3-universe-video img").evaluate((i) => i.decode());
      await page.waitForTimeout(600);
      check(
        `Movimiento reducido conserva portada sin YouTube ${width}`,
        requests.length === 0 &&
          (await page.locator("#universo iframe").count()) === 0,
      );
      const media = await contract(page, width);
      report.layouts.push({ width, mode: "manual-cover", media });
      await page.locator("#universo").evaluate((el) => {
        el.tabIndex = -1;
        el.focus({ preventScroll: true });
      });
      await page.keyboard.press("Tab");
      const play = page.getByRole("button", {
        name: "Reproducir presentación de Mi ACIA",
        exact: true,
      });
      check(
        `Botón accesible por Tab ${width}`,
        await play.evaluate((el) => document.activeElement === el),
      );
      await page
        .locator("#universo")
        .screenshot({
          path: `${evidence}/cover-${width}.png`,
          style:
            ".site-header, .site-header *, .skip-link, .kpichat-signature { visibility: hidden !important; }",
        });
      await audit(page, `cover-${width}`);
      if (width === 390 || width === 1440) {
        await play.press("Enter");
        const iframe = page.locator("#universo iframe");
        await iframe.waitFor();
        check(
          `Enter transfiere foco al reproductor ${width}`,
          await iframe.evaluate((el) => document.activeElement === el),
        );
        check(
          `Inicio manual también silenciado ${width}`,
          new URL(await iframe.getAttribute("src")).searchParams.get("mute") ===
            "1",
        );
        const final = await iframe.boundingBox();
        check(
          `Iframe completo en espacio reservado ${width}`,
          Math.abs(final.width - (media.width - 2)) < 2 &&
            Math.abs(final.height - (media.height - 2)) < 2,
        );
        check(
          `Alternativa YouTube ${width}`,
          (await page
            .getByRole("link", { name: "Ver en YouTube", exact: false })
            .getAttribute("href")) ===
            "https://www.youtube.com/watch?v=fDKVNBuN9zw",
        );
      }
      await context.close();
    }
    check(
      "Sin errores JavaScript de la aplicación",
      report.errors.length === 0,
    );
  } finally {
    await browser.close();
    fs.writeFileSync(
      `${evidence}/browser-report.json`,
      JSON.stringify(report, null, 2),
    );
  }
  console.log(
    JSON.stringify(
      {
        checks: report.checks.length,
        audits: report.audits.length,
        playback: report.playback,
        errors: report.errors,
      },
      null,
      2,
    ),
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
