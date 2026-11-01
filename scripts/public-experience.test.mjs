import assert from "node:assert/strict";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ALLIANCES,
  NEWS,
  PRESIDENT_VIDEO,
} from "../src/data/publicExperience.ts";
const root = path.resolve(import.meta.dirname, "..");
const read = (file) =>
  readFileSync(path.join(root, file), "utf8").replace(/\r/g, "");

test("contratos, planes, pagos, consentimiento y preferencias conservan su implementación", () => {
  const manifest = JSON.parse(read("scripts/review/protected-files.json"));
  for (const [file, digest] of Object.entries(manifest.files)) {
    assert.equal(
      createHash("sha256").update(read(file)).digest("hex"),
      digest,
      file,
    );
  }
});

test("alianzas limitadas a las dos organizaciones confirmadas con recursos locales", () => {
  assert.deepEqual(
    ALLIANCES.map((x) => x.name),
    ["América Digital", "Women in Tech"],
  );
  for (const ally of ALLIANCES) {
    assert.equal(new URL(ally.url).protocol, "https:");
    assert.ok(readFileSync(path.join(root, "public", ally.logo)).length > 0);
  }
});

test("noticias editoriales tienen fecha, fuente, orden y destino público real", () => {
  assert.ok(NEWS.length >= 4 && NEWS.length <= 6);
  assert.equal(new Set(NEWS.map((x) => x.url)).size, NEWS.length);
  for (const item of NEWS) {
    assert.ok(item.title && item.source && item.order);
    assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(
      item.date <=
        new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(
          new Date(),
        ),
    );
    assert.equal(new URL(item.url).protocol, "https:");
    assert.ok(item.type);
    assert.doesNotMatch(item.url, /iaencolombia.org|\/newsletters/);
  }
});

const require = createRequire(import.meta.url);
const compiled = ts.transpileModule(
  read("src/components/sections/InstitutionalVideo.tsx"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const exports = {};
new Function("require", "exports", compiled)(require, exports);
const Video = exports.InstitutionalVideo;
const fixture = {
  approved: true,
  src: "/fixture-only.mp4",
  poster: "/fixture-only.png",
  captions: "/fixture-only.vtt",
  transcript:
    "Prueba técnica de accesibilidad. No es material audiovisual de ACIA.",
};

test("sin video autorizado se ofrece identidad institucional, sin reproductor ficticio ni aviso de pendiente", () => {
  for (const resource of [
    PRESIDENT_VIDEO,
    { ...fixture, approved: false },
    { ...fixture, transcript: "" },
    { ...fixture, poster: "" },
    { ...fixture, captions: "" },
  ]) {
    const html = renderToStaticMarkup(React.createElement(Video, { resource }));
    assert.match(html, /Conoce ACIA/);
    assert.match(html, /href="\/transparencia"/);
    assert.doesNotMatch(
      html,
      /<video|<iframe|Pendiente de material|video-placeholder|Mensaje de la Presidencia/,
    );
  }
});

test("el reproductor autorizado inicia silenciado, sin autoplay, con controles y alternativa textual", () => {
  const html = renderToStaticMarkup(
    React.createElement(Video, { resource: fixture }),
  );
  assert.match(
    html,
    /<video[^>]*controls=""[^>]*muted=""[^>]*playsInline=""[^>]*preload="none"/,
  );
  assert.doesNotMatch(html, /autoplay|<iframe|youtube/i);
  assert.match(html, /<track[^>]*kind="captions"/);
  assert.match(html, /Leer la transcripción/);
  if (process.env.ACIA_WRITE_VIDEO_FIXTURE === "1")
    writeFileSync(
      path.join(root, ".local-review/video-contract.html"),
      `<!doctype html><html lang="es"><title>Prueba técnica local</title><body>${html}</body></html>`,
    );
});

test("el plan privado no aparece en fuentes, contenido ni metadatos públicos", () => {
  const scan = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) scan(file);
      else if (/\.(tsx?|css)$/.test(file))
        assert.doesNotMatch(readFileSync(file, "utf8"), /visionarios/i, file);
    }
  };
  scan(path.join(root, "src"));
});

test("la retícula editorial conserva tres noticias únicas y fechadas con cero, una o dos ediciones", () => {
  const output = ts.transpileModule(
    read("src/components/newsletter/NewsletterLanding.tsx"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const editorialModule = {};
  new Function("require", "exports", output)(
    (id) => (id === "@/data/publicExperience" ? { NEWS } : require(id)),
    editorialModule,
  );
  const editions = [1, 2].map((n) => ({
    title: `Edición de prueba ${n}`,
    slug: `fixture-${n}`,
    edition_number: n,
    first_published_at: "2026-10-27T12:00:00-05:00",
  }));
  for (const items of [null, [], editions.slice(0, 1), editions]) {
    const html = renderToStaticMarkup(
      React.createElement(editorialModule.NewsletterLanding, { items }),
    );
    const articles = [...html.matchAll(/<a href="([^"]+)" class="op3-story/g)];
    assert.equal(articles.length, 3);
    const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(
      (x) => x[1],
    );
    assert.equal(
      new Set(images).size,
      3,
      "Fotografías editoriales distintas incluso sin ediciones",
    );
    assert.equal(new Set(articles.map((x) => x[1])).size, 3);
    assert.equal([...html.matchAll(/<time /g)].length, 3);
    assert.equal(
      html.includes("no están disponibles temporalmente"),
      items === null,
    );
  }
});
