import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { PUBLIC_SECTOR_TABLES, SECTOR_TABLES_PATH } from "../src/data/sectorTables.ts";

const root = path.resolve(import.meta.dirname, "..");
const read = name => readFileSync(path.join(root, name), "utf8");

test("inicio conserva todas las secciones y añade Mesas después del bloque completo", () => {
  const home = read("src/app/page.tsx");
  const components = [...home.matchAll(/<([A-Z][A-Za-z]+)\b/g)].map(match => match[1]);
  assert.deepEqual(components.filter(name => name !== "SectorTablesSection"), [
    "Header", "HeroSection", "NewsTicker", "MembershipProfileProvider", "ValueSection",
    "ProfileSelector", "UniverseSection", "InstitutionalVideo", "AlliancesSection",
    "Suspense", "NewslettersSection", "MembershipPlansSection", "EventsSection",
    "KnowledgeSection", "CommunicationsSection", "PillarsSection", "CTASection", "Footer",
  ]);
  assert.match(home, /<UniverseSection\s*\/>\s*<\/div>\s*<SectorTablesSection\s*\/>\s*<div className="op3-editorial-band">/);
});

test("catálogo público conserva las seis mesas en orden y solo la sexta es transversal", () => {
  assert.deepEqual(PUBLIC_SECTOR_TABLES.map(table => table.slug), [
    "estado-justicia-seguridad", "economia-industria-productividad", "desarrollo-humano-social",
    "territorio-infraestructura-sostenibilidad", "ciencia-tecnologia-innovacion", "gobernanza-etica-ia",
  ]);
  assert.deepEqual(PUBLIC_SECTOR_TABLES.filter(table => table.transversal).map(table => table.slug), ["gobernanza-etica-ia"]);
  assert.equal(SECTOR_TABLES_PATH, "/mesas-tecnicas-sectoriales");
});

test("datos públicos limitados a contenido editorial, sin información privada ni promesas de resultados", () => {
  const allowed = new Set(["slug", "name", "objective", "expectedImpact", "image", "imageAlt", "imagePosition", "transversal"]);
  for (const table of PUBLIC_SECTOR_TABLES) {
    assert(Object.keys(table).every(key => allowed.has(key)));
    assert(table.objective.length <= 250 && table.objective.length > 30);
    assert(table.expectedImpact.length <= 250);
    assert.match(table.expectedImpact, /^(Esperamos|Buscamos) /);
    assert.doesNotMatch(JSON.stringify(table), /Visionarios|account_id|member_count|connection_url|@[a-z]/i);
  }
});

test("imágenes generadas se guardan localmente optimizadas con procedencia y bytes verificables", () => {
  const images = JSON.parse(read("docs/public-sector-tables-image-manifest.json"));
  const prompts = JSON.parse(read("docs/public-sector-tables-image-prompts.json"));
  assert.equal(images.length, 7);
  assert.equal(prompts.assets.length, 7);
  assert(images.reduce((sum, image) => sum + image.bytes, 0) < 1_500_000);
  for (const image of images) {
    const bytes = readFileSync(path.join(root, image.asset));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.equal(createHash("sha256").update(bytes).digest("hex"), image.sha256);
    assert(image.dimensions[0] <= 1400);
    assert(image.bytes < 350_000);
  }
  for (const table of PUBLIC_SECTOR_TABLES) {
    assert(existsSync(path.join(root, "public", table.image)));
    assert(table.imageAlt.length > 30);
  }
});

test("página pública reutiliza encabezado y pie y no consulta endpoints privados", () => {
  const page = read("src/app/mesas-tecnicas-sectoriales/page.tsx");
  assert.match(page, /<PublicPage/);
  assert.match(page, /robots: \{ index: true, follow: true \}/);
  assert.match(page, /canonical: "https:\/\/www\.iaencolombia\.org\/mesas-tecnicas-sectoriales"/);
  assert.doesNotMatch(page, /Propuesta local para revisión|generadas para esta propuesta/);
  for (const file of [
    "src/data/sectorTables.ts", "src/components/sections/SectorTablesSection.tsx",
    "src/components/sectorTables/SectorTablesAccordion.tsx", "src/components/sectorTables/SectorTablesCallToAction.tsx",
    "src/app/mesas-tecnicas-sectoriales/page.tsx",
  ]) {
    assert.doesNotMatch(read(file), /fetch\(|\/member\/|sector-meetings|sector-products|useMemberAuth|Authorization:|Visionarios/);
  }
});

test("controles accesibles, sin navegación al desplegar y con movimiento reducido", () => {
  const accordion = read("src/components/sectorTables/SectorTablesAccordion.tsx");
  assert.match(accordion, /<button/);
  for (const attribute of ["aria-expanded", "aria-controls", "aria-labelledby", "hidden={!open}"]) assert(accordion.includes(attribute));
  assert.doesNotMatch(accordion, /<a\b|href=|router\.|<dialog|createPortal/);
  assert.match(accordion, /useState<string \| null>\(null\)/);
  const css = read("src/components/sectorTables/SectorTables.module.css");
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.panel\[hidden\] \{ display: none; \}/);
  assert.match(css, /\.pair \{ display: flex; flex-direction: column/);
});

test("CTA utiliza las rutas existentes y no crea un formulario de afiliación o inscripción", () => {
  const cta = read("src/components/sectorTables/SectorTablesCallToAction.tsx");
  assert.match(cta, /href=\{AFFILIATION_PATH\}/);
  assert.match(cta, /href=\{MEMBER_PORTAL_URL\}/);
  assert.match(cta, /Participación en las mesas según los beneficios de tu plan/);
  assert.doesNotMatch(cta, /<form|<input|target=/);
  const home = read("src/components/sections/SectorTablesSection.tsx");
  assert.match(home, /href=\{SECTOR_TABLES_PATH\}/);
  assert.doesNotMatch(home, /target=/);
});
