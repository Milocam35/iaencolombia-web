import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const origin = process.env.ACIA_PUBLIC_PREVIEW_URL ?? "http://127.0.0.1:3187";
assert.equal(new URL(origin).hostname, "127.0.0.1");
const out = join(process.cwd(), ".local-review", "sector-tables");
await mkdir(out, { recursive: true });
const modulePath = process.env.ACIA_PREVIEW_PLAYWRIGHT ?? "C:/Users/Usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
const { chromium } = await import(pathToFileURL(modulePath).href);
const browser = await chromium.launch({ headless: true, executablePath: process.env.ACIA_PREVIEW_BROWSER ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const report = { scope: "local_real_Next_application_public_pages", checks: [], screenshots: [], blocked_external_origins: [], private_requests: [], browser_errors: [], home_crop: {}, SQL_EXECUTED: false, SMTP_USED: false };
const route = "/mesas-tecnicas-sectoriales";
const errors = [];
async function setup(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
  await context.route("**/*", request => {
    const url = new URL(request.request().url());
    if (/\/member\/|\/sector-tables(?:\/|$)/.test(url.pathname)) report.private_requests.push(url.pathname);
    if (url.origin === origin && ["GET", "HEAD"].includes(request.request().method())) return request.continue();
    report.blocked_external_origins.push(url.origin);
    return request.abort();
  });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  return { context, page };
}
async function ready(page) {
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator("[data-sector-accordion] img, #mesas-tecnicas-sectoriales img").all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => element.decode());
  }
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
}
async function capture(page, name) {
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
  await page.waitForFunction(() => scrollY === 0);
  await page.screenshot({ path: join(out, name + ".png"), fullPage: true });
  report.screenshots.push(name + ".png");
}
async function noOverflow(page) {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Horizontal overflow");
}
async function home(page, device) {
  await page.goto(origin, { waitUntil: "networkidle" });
  await ready(page);
  await noOverflow(page);
  const section = page.locator("#mesas-tecnicas-sectoriales");
  assert(await section.evaluate(element => element.previousElementSibling.classList.contains("op3-conversion") && element.nextElementSibling.classList.contains("op3-editorial-band")));
  assert.equal(await section.getByRole("link", { name: /Conoce las seis mesas/ }).getAttribute("href"), route);
  assert.equal(await section.getByRole("link", { name: /Conoce las seis mesas/ }).getAttribute("target"), null);
  report.home_crop[device] = await page.evaluate(() => {
    const before = document.querySelector(".op3-conversion").getBoundingClientRect();
    const after = document.querySelector(".op3-editorial-band").getBoundingClientRect();
    return { top: Math.max(0, before.top + scrollY - 20), bottom: after.top + scrollY + 260, width: innerWidth };
  });
  await capture(page, `01-inicio-completo-${device}`);
  report.checks.push(`home_order_and_context_${device}`);
}
try {
  const { context, page } = await setup({ reducedMotion: "reduce" });
  await home(page, "escritorio");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#mesas-tecnicas-sectoriales").getByRole("link", { name: /Conoce las seis mesas/ }).click();
  await page.waitForURL(origin + route);
  await ready(page);
  const cards = page.locator("[data-sector]");
  assert.equal(await cards.count(), 6);
  assert.equal(await page.locator("[data-sector][aria-expanded=true]").count(), 0);
  await noOverflow(page);
  await capture(page, "02-mesas-cerradas-escritorio");
  for (let i = 0; i < 6; i++) {
    const before = page.url();
    await cards.nth(i).click();
    assert.equal(page.url(), before);
    assert.equal(await page.locator("[data-sector][aria-expanded=true]").count(), 1);
    const id = await cards.nth(i).getAttribute("aria-controls");
    const panel = page.locator("#" + id);
    assert(await panel.isVisible());
    assert.equal(await panel.getByRole("heading", { name: "Objetivo", exact: true }).count(), 1);
    assert.equal(await panel.getByRole("heading", { name: "Impacto esperado", exact: true }).count(), 1);
    const row = Math.floor(i / 2) * 2;
    const a = await cards.nth(row).boundingBox();
    const b = await cards.nth(row + 1).boundingBox();
    const p = await panel.boundingBox();
    assert(Math.abs(a.y - b.y) < 2, "Desktop card pair must share its row");
    assert(p.y >= Math.max(a.y + a.height, b.y + b.height) - 1, "Panel must flow below both cards");
    if (i === 0) await capture(page, "03-mesa-expandida-escritorio");
    if (i === 5) await capture(page, "04-transversal-expandida-escritorio");
  }
  await cards.nth(5).click();
  assert.equal(await page.locator("[data-sector][aria-expanded=true]").count(), 0);
  await cards.first().focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  assert(await cards.first().evaluate(element => element === document.activeElement));
  assert(await cards.first().evaluate(element => getComputedStyle(element).outlineStyle !== "none"));
  await page.keyboard.press("Enter");
  assert.equal(await cards.first().getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Space");
  assert.equal(await cards.first().getAttribute("aria-expanded"), "false");
  report.checks.push("six_open_close_same_route", "single_expanded_panel", "desktop_panel_full_row_no_overlap", "keyboard_enter_space_visible_focus");
  const affiliate = page.getByRole("link", { name: /Conoce los planes y afíliate/ }).first();
  assert.equal(await affiliate.getAttribute("href"), "/afiliate");
  assert.equal(await page.getByRole("link", { name: "Ya soy afiliado: ingresar a Mi ACIA" }).first().getAttribute("href"), "https://mi.iaencolombia.org");
  await affiliate.click();
  await page.waitForURL(origin + "/afiliate");
  assert.equal((await page.request.get(origin + "/afiliate")).status(), 200);
  report.checks.push("existing_affiliation_route_and_portal_link");
  await context.close();

  const mobile = await setup({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  await home(mobile.page, "movil");
  await mobile.page.goto(origin + route);
  await ready(mobile.page);
  await capture(mobile.page, "05-mesas-cerradas-movil");
  const mobileCards = mobile.page.locator("[data-sector]");
  await mobileCards.first().tap();
  const mobilePanel = mobile.page.locator("#" + await mobileCards.first().getAttribute("aria-controls"));
  const first = await mobileCards.first().boundingBox();
  const panel = await mobilePanel.boundingBox();
  const second = await mobileCards.nth(1).boundingBox();
  assert(panel.y >= first.y + first.height - 1 && second.y >= panel.y + panel.height - 1);
  assert.equal(await mobilePanel.evaluate(element => getComputedStyle(element).animationName), "none");
  await capture(mobile.page, "06-mesa-expandida-movil");
  await mobileCards.first().tap();
  assert.equal(await mobileCards.first().getAttribute("aria-expanded"), "false");
  for (const width of [320, 360, 390, 768, 1440]) {
    await mobile.page.setViewportSize({ width, height: 844 });
    await noOverflow(mobile.page);
  }
  report.checks.push("touch_open_close", "mobile_panel_immediately_below_selected_card", "reduced_motion", "no_overflow_320_360_390_768_1440");
  assert.equal(report.private_requests.length, 0);
  assert.deepEqual(errors, []);
  report.checks.push("no_private_requests", "no_browser_page_errors");
  report.browser_errors = errors;
  await mobile.context.close();
  report.blocked_external_origins = [...new Set(report.blocked_external_origins)];
  await writeFile(join(out, "browser-evidence.json"), JSON.stringify(report, null, 2) + "\n");
  console.log("PUBLIC_SECTOR_PREVIEW_BROWSER=PASS; SCREENSHOTS=" + report.screenshots.length + "; CHECKS=" + report.checks.length + "; PRIVATE_REQUESTS=0; SQL_EXECUTED=false; SMTP_USED=false");
} finally {
  await browser.close();
}
