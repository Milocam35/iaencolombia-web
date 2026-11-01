import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('policy names institutional diffusion and preserves voluntary participation and withdrawal', () => {
  const policy=readFileSync(new URL('../src/lib/privacyPolicy.ts',import.meta.url),'utf8');
  assert.match(policy,/newsletters y mensajes de difusión institucional/);
  assert.match(policy,/afiliados y miembros de Comunidad\/Freemium/);
  assert.match(policy,/No se exige una autorización adicional por cada mensaje dentro de ese mismo alcance/);
  assert.match(policy,/no deberá convertirse en condición obligatoria/);
  assert.match(policy,/Las bajas y supresiones se respetarán/);
  assert.match(policy,/no cancela los servicios de afiliación ni los correos operacionales/);
  assert.match(policy,/PRIVACY_POLICY_VERSION_ID = "2026-08-10-v1"/);
});

test('editorial clarification date is shown without relabeling historical consent', () => {
  const page=readFileSync(new URL('../src/app/politica-tratamiento-datos/page.tsx',import.meta.url),'utf8');
  assert.match(page,/COMMUNICATIONS_CLARIFICATION_DATE/);
  assert.match(page,/Aclaración sobre comunicaciones/);
});
