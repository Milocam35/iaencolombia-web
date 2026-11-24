import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PUBLIC_SECTOR_TABLES } from "../src/data/sectorTables.ts";

const root = process.cwd();
const out = join(root, ".local-review", "sector-tables");
const escape = text => String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const report = JSON.parse(await readFile(join(out, "browser-evidence.json"), "utf8"));
report.build_id = (await readFile(join(root, ".next/BUILD_ID"), "utf8")).trim();
report.base_revision = "bad97b43b990f5894882ef4560a382c7ef2f6fce";
const sources = ["src/app/page.tsx", "src/app/mesas-tecnicas-sectoriales/page.tsx", "src/components/sections/SectorTablesSection.tsx", "src/components/sectorTables/SectorTablesAccordion.tsx", "src/components/sectorTables/SectorTablesCallToAction.tsx", "src/components/sectorTables/SectorTables.module.css", "src/data/sectorTables.ts", "src/components/layout/Header.tsx", "src/components/layout/Footer.tsx", "package.json", "package-lock.json"];
report.source_sha256 = Object.fromEntries(await Promise.all(sources.map(async file => [file, createHash("sha256").update(await readFile(join(root, file))).digest("hex")])));
await writeFile(join(out, "browser-evidence.json"), JSON.stringify(report, null, 2) + "\n");

const shots = [
  ["01-inicio-contexto-escritorio.png", "Inicio · contexto de escritorio", "El bloque anterior completo, la nueva sección y el comienzo de la franja editorial posterior."],
  ["01-inicio-contexto-movil.png", "Inicio · contexto móvil", "La sección se sitúa después de beneficios, selector de perfil y Universo; conserva su orden."],
  ["02-mesas-cerradas-escritorio.png", "Seis mesas · escritorio", "Dos columnas, seis tarjetas cerradas y llamados a afiliación existentes."],
  ["03-mesa-expandida-escritorio.png", "Una mesa expandida · escritorio", "Objetivo e impacto se despliegan debajo de la fila completa, sin huecos entre tarjetas."],
  ["05-mesas-cerradas-movil.png", "Seis mesas · móvil", "Una columna, nombres completos y fotografías en sus recortes reales."],
  ["06-mesa-expandida-movil.png", "Una mesa expandida · móvil", "El contenido aparece inmediatamente debajo de la tarjeta seleccionada."],
  ["04-transversal-expandida-escritorio.png", "Gobernanza y ética · Transversal", "La sexta mesa queda identificada como transversal, también para tecnología asistiva."],
];
const editorial = PUBLIC_SECTOR_TABLES.map((table, index) => `
  <article class="editorial"><h3>${index + 1}. ${escape(table.name)}${table.transversal ? " · Transversal" : ""}</h3>
  <dl><dt>Objetivo</dt><dd>${escape(table.objective)}</dd><dt>Impacto esperado</dt><dd>${escape(table.expectedImpact)}</dd></dl></article>`).join("");
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ACIA · revisión de Mesas técnicas sectoriales</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#08294e;font:15px/1.7 system-ui,sans-serif}header{padding:44px 24px;background:#081f54;color:white}header>div,main{max-width:1180px;margin:auto}h1{font-size:clamp(28px,4vw,42px);line-height:1.15;letter-spacing:-.04em}h2{margin:36px 0 18px;font-size:25px}h3{line-height:1.3}p{max-width:880px}.badge{color:#7cdefc;font-size:12px;letter-spacing:.13em;text-transform:uppercase}main{padding:20px 24px 60px}a{color:#041d77;text-underline-offset:4px}.links{display:flex;gap:12px;flex-wrap:wrap}.links a{background:#4ec7f0;color:#061c43;padding:10px 18px;border-radius:7px;text-decoration:none;font-weight:700}.note{padding:20px 24px;border:1px solid #ccdaeb;border-radius:12px;background:white}.shots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.shot{min-width:0;background:white;border:1px solid #dce3ef;border-radius:12px;overflow:hidden}.shot img{display:block;width:100%;height:310px;object-fit:cover;object-position:top;background:#e6edf7}.shot div{padding:16px 20px}.shot h3{margin:0 0 8px}.shot p{font-size:13px;color:#48617a;margin:0}.editorial{padding:20px 24px;margin:16px 0;background:white;border:1px solid #dce3ef;border-radius:12px}dt{font-weight:750;font-size:13px;margin-top:12px}dd{margin:3px 0 0;color:#415b76}.security{border-left:4px solid #d39b26}.checks{color:#48617a;font-size:13px}code{overflow-wrap:anywhere}footer{margin-top:32px;font-size:13px;color:#48617a}@media(max-width:650px){.shots{grid-template-columns:1fr}.links{flex-direction:column}.links a{text-align:center}}</style></head>
<body><header><div><p class="badge">Propuesta local · sin publicación</p><h1>Mesas técnicas sectoriales</h1><p>Revisión de la interfaz real de la web: nueva sección en el inicio, página pública navegable, imágenes y textos editoriales.</p></div></header>
<main><section class="note"><h2 style="margin-top:0">Abrir la propuesta funcional</h2><p>Ejecuta <strong>VER-PROPUESTA-MESAS.cmd</strong> en la raíz del worktree. Mantén su ventana abierta y usa los enlaces siguientes. <strong>Ctrl+C</strong> detiene el servidor. Las capturas de esta galería se abren sin iniciar el servidor.</p>
<div class="links"><a href="http://127.0.0.1:3187/#mesas-tecnicas-sectoriales">Inicio real con la nueva sección →</a><a href="http://127.0.0.1:3187/mesas-tecnicas-sectoriales">Explorar las seis mesas →</a></div><p class="checks">Solo loopback. No hay conexiones a endpoints privados, SQL ni SMTP. La API pública existente apunta a un destino local sin servicio durante la revisión; esta propuesta no incluye nuevos registros.</p></section>
<h2>Capturas de la aplicación</h2><div class="shots">${shots.map(([file, title, caption]) => `<article class="shot"><a href="${escape(file)}"><img src="${escape(file)}" alt="${escape(title)}" loading="lazy"></a><div><h3><a href="${escape(file)}">${escape(title)}</a></h3><p>${escape(caption)}</p></div></article>`).join("")}</div>
<p><a href="01-inicio-completo-escritorio.png">Inicio completo de escritorio</a> · <a href="01-inicio-completo-movil.png">Inicio completo de móvil</a> · <a href="browser-evidence.json">Evidencia de comprobaciones</a></p>
<h2>Textos propuestos para revisión editorial</h2><p>Objetivos adaptados de la implementación privada revisada. Los impactos son expectativas editoriales; no describen resultados alcanzados ni garantizan adopción de propuestas.</p>${editorial}
<h2>Validación y límites</h2><section class="note"><p>63 pruebas de repositorio aprobadas; TypeScript y build local completados; lint sin errores (un aviso preexistente en NewsletterArticle). Navegador real: ${report.checks.length} comprobaciones aprobadas, seis aperturas/cierres, una sola mesa expandida, teclado, tacto, movimiento reducido y reflow de 320 a 1440 px.</p><p>Encabezado, navegación, pie, planes, formulario, newsletters, consentimientos y módulo privado se conservan. Las siete imágenes son ilustrativas, generadas con image_gen; sus recursos WebP optimizados suman aproximadamente 1,1 MB.</p></section>
<h2>Pendiente antes de publicar</h2><section class="note security"><p>Aprobación de diseño, imágenes y textos. npm audit también identifica avisos moderados preexistentes en Next 16.4.4 y propone 16.4.6; la actualización requiere una revisión separada. Las dependencias no fueron modificadas y no se certifica un release productivo con esa versión.</p></section>
<footer>Base revisada: bad97b43b990f5894882ef4560a382c7ef2f6fce. No se hizo push, PR, merge, despliegue ni cambio de producción. Fotos del módulo privado intactas.</footer></main></body></html>`;
await writeFile(join(out, "index.html"), html);
const markdown = "# Mesas técnicas sectoriales: textos públicos propuestos\n\nPropuesta editorial para aprobación visual; impactos esperados, sin resultados atribuidos ni garantía de adopción institucional.\n\n" + PUBLIC_SECTOR_TABLES.map((table, index) => `## ${index + 1}. ${table.name}${table.transversal ? " — Transversal" : ""}\n\n**Objetivo:** ${table.objective}\n\n**Impacto esperado:** ${table.expectedImpact}\n`).join("\n");
await writeFile(join(root, "docs/public-sector-tables-editorial.md"), markdown);
console.log("REVIEW_GALLERY=PASS; EDITORIAL_TEXTS=6; CAPTURE_LINKS=" + shots.length);
