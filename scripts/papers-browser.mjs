// Production-built Next UI, local public GETs only. No login or business writes.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer, connect } from 'node:net';
import { once } from 'node:events';
import { resolve, join } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'docs/review/first-paper');
await mkdir(output, { recursive: true });
await mkdir(join(root, '.local-review'), { recursive: true });
const { chromium } = await import(pathToFileURL(process.env.ACIA_MAIL_PLAYWRIGHT_MODULE).href);
const reservation = createServer(); reservation.listen(0, '127.0.0.1'); await once(reservation, 'listening');
const port = reservation.address().port; await new Promise(r => reservation.close(r));
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [resolve(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  cwd: root, stdio: 'ignore', windowsHide: true,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_ACIA_API_URL: 'https://api.example.test' },
});
const pdfPath = '/papers/gobernanza-ia-infraestructura-economica-mpra-131077.pdf';
const expectedHash = 'd061b9cd2ddc90e391181e164f4dacb057e7996d9a9cf88d9a2ef10486307aa4';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    assert.equal(server.exitCode, null);
    try { if ((await fetch(origin + '/papers')).status === 200) { ready = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  assert(ready, 'Owned Next server did not start');
  const direct = await fetch(origin + pdfPath);
  assert.equal(direct.status, 200); assert.match(direct.headers.get('content-type'), /application\/pdf/);
  assert.equal(digest(Buffer.from(await direct.arrayBuffer())), expectedHash);
  const partial = await fetch(origin + pdfPath, { headers: { Range: 'bytes=0-31' } });
  assert.equal(partial.status, 206); assert.equal((await partial.arrayBuffer()).byteLength, 32);

  browser = await chromium.launch({ executablePath: process.env.ACIA_MAIL_CHROMIUM_PATH, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  const methods = [];
  await context.route('**/*', route => {
    const request = route.request(); methods.push(request.method());
    return new URL(request.url()).origin === origin ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + '/papers');
  await page.getByRole('heading', { name: /^Gobernanza de la IA como infraestructura/ }).waitFor();
  assert.equal(await page.getByText('Aún no hay publicaciones cargadas.', { exact: false }).count(), 0);
  assert.equal(await page.locator('#research-papers article[aria-labelledby^="paper-"]').count(), 1);
  await page.getByRole('link', { name: 'Research Papers', exact: true }).click();
  assert.equal(new URL(page.url()).hash, '#research-papers');
  assert(await page.getByRole('heading', { name: 'Research Papers', level: 2 }).isVisible());
  assert(await page.getByText('ACIA-RP-2026-001', { exact: true }).isVisible());
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://www.iaencolombia.org/papers');
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), await page.getByRole('heading', { name: /^Gobernanza de la IA como infraestructura/ }).textContent());
  await page.locator('figure img').evaluate(async img => { if (!img.complete) await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; }); if (!img.naturalWidth) throw new Error('Cover did not load'); });
  await page.screenshot({ path: join(output, 'papers-desktop.png'), fullPage: true });
  await page.locator('article[aria-labelledby^="paper-"]').screenshot({ path: join(output, 'paper-desktop.png') });
  // Neutral review captures before clipboard selection/focus alters the UI.
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    await page.evaluate(() => document.fonts.ready);
    const suffix = width === 1440 ? 'desktop' : 'mobile';
    await page.screenshot({ path: join(output, `papers-${suffix}.png`), fullPage: true });
    const bounds = await page.locator('article[aria-labelledby^="paper-"]').boundingBox();
    const cdp = await context.newCDPSession(page);
    const capture = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...bounds, scale: 1 } });
    await writeFile(join(output, `paper-${suffix}.png`), Buffer.from(capture.data, 'base64'));
    await cdp.detach();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const read = page.getByRole('link', { name: 'Leer PDF (abre una pestaña nueva)', exact: true });
  assert.equal(await read.getAttribute('href'), pdfPath); assert.equal(await read.getAttribute('target'), '_blank');
  assert.equal(await page.getByRole('link', { name: /^Ver publicación en MPRA/ }).getAttribute('href'), 'https://mpra.ub.uni-muenchen.de/131077/');
  await page.getByRole('button', { name: 'Copiar referencia' }).click();
  await page.getByRole('status').filter({ hasText: 'Referencia copiada.' }).waitFor();
  const citation = await page.getByRole('textbox', { name: 'Referencia bibliográfica' }).inputValue();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), citation);
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('link', { name: 'Descargar PDF', exact: true }).click()]);
  const downloadFile = join(root, '.local-review/paper-download.pdf');
  await download.saveAs(downloadFile); assert.equal(digest(await readFile(downloadFile)), expectedHash);
  assert.equal(download.suggestedFilename(), pdfPath.split('/').at(-1));
  await page.getByRole('button', { name: 'Copiar referencia' }).focus(); await page.keyboard.press('Enter');
  assert.equal(await page.getByRole('button', { name: 'Copiar referencia' }).evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
  // Force only the optional browser clipboard API to be unavailable: verify the existing text fallback.
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
  await page.getByRole('button', { name: 'Copiar referencia' }).click();
  await page.getByRole('status').filter({ hasText: 'Referencia seleccionada.' }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: 'Referencia bibliográfica' }).evaluate(el => el.selectionEnd - el.selectionStart), citation.length);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}`);
  }
  assert.deepEqual(errors, []); assert(methods.every(method => method === 'GET' || method === 'HEAD'));
  await writeFile(join(output, 'validation.json'), JSON.stringify({ scope: 'local production-built Next; no auth; external browser network blocked', desktop: '1440x1000 PASS', mobile: '390x844 and 320x844 PASS; no horizontal overflow', direct_pdf: '200 application/pdf; original SHA256 matches', range_pdf: '206 PASS', browser_download: 'PASS; original filename and SHA256 match', collection: 'Research Papers; anchor and single grouped article PASS', institutional_identifier: 'ACIA-RP-2026-001; distinct from MPRA 131077', citation_copy: 'PASS; actual clipboard', clipboard_fallback: 'PASS; full text selected', keyboard_focus: 'PASS', console_errors: 0, business_writes: false, smtp_used: false }, null, 2) + '\n');
  console.log('PAPERS_BROWSER=PASS; PDF_DOWNLOAD_ORIGINAL_BYTES=PASS; BUSINESS_WRITES=false; SMTP_USED=false');
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
  const open = await new Promise(r => { const socket = connect({ host: '127.0.0.1', port }); socket.once('connect', () => { socket.destroy(); r(true); }); socket.once('error', () => r(false)); });
  assert.equal(open, false, 'Owned server port remains open');
  console.log('PAPERS_BROWSER_CLEANUP=PASS');
}
