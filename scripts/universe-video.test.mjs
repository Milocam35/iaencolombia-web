import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(
  new URL("../src/components/sections/UniverseVideo.tsx", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const videoModule = {};
new Function("require", "exports", compiled)(require, videoModule);

test("el HTML inicial reserva una portada local y alternativa accesible, sin cargar YouTube", () => {
  const html = renderToStaticMarkup(
    React.createElement(videoModule.UniverseVideo, {
      posterSrc: "/images/opcion3/conexiones.webp",
      posterAlt: "Escena ilustrativa de una conversación profesional.",
      illustrative: true,
    }),
  );
  assert.match(html, /aria-label="Reproducir presentación de Mi ACIA"/);
  assert.match(html, /<button[^>]+type="button"/);
  assert.match(html, /conexiones[.]webp/);
  assert.match(html, /Imagen ilustrativa/);
  assert.match(
    html,
    /href="https:\/\/www[.]youtube[.]com\/watch\?v=fDKVNBuN9zw"/,
  );
  assert.match(html, /Ver en YouTube/);
  assert.doesNotMatch(
    html,
    /<iframe|<script|rel="(?:preconnect|dns-prefetch)"/,
  );
  assert.doesNotMatch(html, /src="https:\/\/|youtube-nocookie[.]com/);
});
