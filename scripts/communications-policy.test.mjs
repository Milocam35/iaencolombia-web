import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('policy distinguishes Community subscription from paid affiliation and preserves withdrawal', () => {
  const policy=readFileSync(new URL('../src/lib/privacyPolicy.ts',import.meta.url),'utf8');
  assert.match(policy,/newsletters y mensajes de difusión institucional/);
  assert.match(policy,/afiliados y miembros de Comunidad\/Freemium/);
  assert.match(policy,/No se exige una autorización adicional por cada mensaje dentro de ese mismo alcance/);
  assert.match(policy,/Esta autorización no es requisito para solicitar ni mantener afiliaciones de pago, Visionarios u otras vinculaciones/);
  assert.match(policy,/Su registro requiere autorización expresa mediante una casilla independiente de privacidad y sin premarcar/);
  assert.doesNotMatch(policy,/no deberá convertirse en condición obligatoria/);
  assert.match(policy,/Las bajas y supresiones se respetarán/);
  assert.match(policy,/no cancela los servicios de afiliación ni los correos operacionales/);
  assert.match(policy,/PRIVACY_POLICY_VERSION_ID = "2026-08-10-v1"/);
});

test('editorial clarification date is shown without relabeling historical consent', () => {
  const page=readFileSync(new URL('../src/app/politica-tratamiento-datos/page.tsx',import.meta.url),'utf8');
  assert.match(page,/COMMUNICATIONS_CLARIFICATION_DATE/);
  assert.match(page,/Aclaración sobre comunicaciones/);
  assert.match(page,/COMMUNITY_SUBSCRIPTION_CLARIFICATION_DATE/);
  assert.match(page,/Aclaración sobre Comunidad\/Freemium/);
});

test('approved clarification is exact and consent texts and prior dates are preserved', () => {
  const policy=readFileSync(new URL('../src/lib/privacyPolicy.ts',import.meta.url),'utf8');
  const community=readFileSync(new URL('../src/lib/community.ts',import.meta.url),'utf8');
  const approved="Comunidad/Freemium es una suscripción gratuita a newsletters y comunicaciones informativas de ACIA. Su registro requiere autorización expresa mediante una casilla independiente de privacidad y sin premarcar. Esta autorización no es requisito para solicitar ni mantener afiliaciones de pago, Visionarios u otras vinculaciones. Darse de baja de las comunicaciones no modifica esas afiliaciones ni sus beneficios.";
  assert.ok(policy.includes(JSON.stringify(approved)));
  assert.match(policy,/COMMUNICATIONS_CLARIFICATION_DATE = "1 de noviembre de 2026"/);
  assert.match(policy,/COMMUNITY_SUBSCRIPTION_CLARIFICATION_DATE = "16 de noviembre de 2026"/);
  assert.match(policy,/PRIVACY_POLICY_EFFECTIVE_DATE = "10 de agosto de 2026"/);
  assert.match(community,/community-communications-2026-11-13/);
});
