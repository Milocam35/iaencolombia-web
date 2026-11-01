import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const config = source("src/lib/config.ts"),
  header = source("src/components/layout/Header.tsx"),
  footer = source("src/components/layout/Footer.tsx");
assert.match(
  config,
  /export const MEMBER_PORTAL_URL = "https:\/\/mi\.iaencolombia\.org";/,
);
assert.match(
  config,
  /export const ADMIN_PLATFORM_URL = "https:\/\/admin\.iaencolombia\.org";/,
);
assert.equal(
  header.match(/href=\{MEMBER_PORTAL_URL\}/g)?.length,
  2,
  "Mi ACIA permanece en escritorio y móvil.",
);
assert.equal(
  header.match(/href=\{AFFILIATION_PATH\}/g)?.length,
  2,
  "Afiliación disponible en ambos menús.",
);
assert.doesNotMatch(
  header,
  /ADMIN_PLATFORM_URL/,
  "Administración queda fuera del encabezado.",
);
assert.match(
  footer,
  /href=\{ADMIN_PLATFORM_URL\}/,
  "Administración conserva su enlace en el pie.",
);
assert.match(header, /aria-controls="mobile-navigation"/);
assert.match(header, /<dialog/);
assert.match(header, /showModal/);
assert.doesNotMatch(config, /admin\.iaencolombia\.org\/login/);
console.log(
  "Afiliación prioritaria, acceso Mi ACIA y administración discreta verificados.",
);
