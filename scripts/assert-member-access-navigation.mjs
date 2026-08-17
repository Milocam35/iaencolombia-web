import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = readFileSync(new URL("../src/lib/config.ts", import.meta.url), "utf8");
const header = readFileSync(
  new URL("../src/components/layout/Header.tsx", import.meta.url),
  "utf8",
);

assert.match(
  config,
  /export const MEMBER_PORTAL_URL = "https:\/\/mi\.iaencolombia\.org";/,
  "Mi ACIA debe usar su URL canónica exacta.",
);
assert.match(
  config,
  /export const ADMIN_PLATFORM_URL = "https:\/\/admin\.iaencolombia\.org";/,
  "El acceso administrativo debe usar su URL canónica exacta.",
);
assert.equal(
  header.match(/href=\{MEMBER_PORTAL_URL\}/g)?.length,
  2,
  "Mi ACIA debe estar disponible en escritorio y móvil.",
);
assert.equal(
  header.match(/href=\{ADMIN_PLATFORM_URL\}/g)?.length,
  2,
  "El acceso administrativo debe estar disponible como enlace en escritorio y móvil.",
);
assert.equal(
  header.match(/>\s*Mi ACIA\s*</g)?.length,
  2,
  "Mi ACIA debe ser el CTA prioritario en escritorio y móvil.",
);
const desktopAdmin = header.indexOf("href={ADMIN_PLATFORM_URL}");
const desktopActions = header.indexOf("{/* Desktop actions */}");
const mobileAdmin = header.indexOf("href={ADMIN_PLATFORM_URL}", desktopAdmin + 1);
const mobileMemberPortal = header.indexOf("href={MEMBER_PORTAL_URL}", header.indexOf("id=\"mobile-navigation\""));
assert.ok(desktopAdmin > -1 && desktopAdmin < desktopActions, "Admin debe ser un enlace normal dentro de la navegación de escritorio.");
assert.ok(mobileAdmin > -1 && mobileAdmin < mobileMemberPortal, "En móvil, Admin debe aparecer antes del bloque prioritario de Mi ACIA.");
assert.match(header, /aria-controls="mobile-navigation"/, "El menú móvil debe exponer su relación accesible.");
assert.match(header, /max-h-\[calc\(100vh-6\.5rem\)\] overflow-y-auto/, "El menú móvil debe poder desplazarse en pantallas pequeñas.");
assert.doesNotMatch(
  config,
  /admin\.iaencolombia\.org\/login/,
  "No debe conservarse el acceso administrativo antiguo con /login.",
);

console.log("Navegación pública hacia Mi ACIA verificada.");
