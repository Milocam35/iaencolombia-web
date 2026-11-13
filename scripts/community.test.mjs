import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const file = await readFile(new URL('../src/lib/community.ts', import.meta.url), 'utf8');
const javascript = ts.transpileModule(file.replace("import { ACIA_API_URL } from '@/lib/config';", "const ACIA_API_URL='https://api.example.test';"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const lib = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);

test('registration message preserves withdrawals without claiming verification or portal access', () => {
  assert.match(lib.communityRegistrationMessage(), /No necesitas confirmar/);
  assert.match(lib.communityRegistrationMessage(), /baja o supresión/);
  assert.match(lib.communityRegistrationMessage(true), /no incluye acceso/);
});

test('token is taken from fragment and removed without requests or storage', () => {
  const old = globalThis.window;
  const token = 'x'.repeat(43);
  const replaced = [];
  globalThis.window = { location: { hash: `#token=${token}`, pathname: '/comunidad/confirmar' }, history: { replaceState: (...args) => replaced.push(args) } };
  try { assert.equal(lib.takeCommunityToken(), token); assert.equal(replaced[0][2], '/comunidad/confirmar'); }
  finally { globalThis.window = old; }
});

test('state-changing operations are explicit POSTs, tokens never enter the URL', async () => {
  const old = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (...args) => { calls.push(args); return { ok: true, json: async () => ({ message: 'Completado' }) }; };
  try {
    assert.equal(await lib.communityRequest('unsubscribe', { token: 'x'.repeat(43) }), 'Completado');
    assert.equal(calls[0][0], 'https://api.example.test/public/community/unsubscribe');
    assert.equal(calls[0][1].method, 'POST');
    assert.equal(calls[0][1].cache, 'no-store');
  } finally { globalThis.fetch = old; }
});

test('community checkbox is required but unchecked, with accessible explanation; no private benefits', async () => {
  const form = await readFile(new URL('../src/components/forms/AffiliationForm.tsx', import.meta.url), 'utf8');
  const checkbox = form.match(/<input name="communications_consent"[^>]+>/)?.[0];
  assert.ok(checkbox); assert.match(checkbox, /required/); assert.doesNotMatch(checkbox, /defaultChecked|checked=/);
  assert.match(checkbox, /aria-describedby="community-help community-requirement"/);
  assert.match(form, /id="community-requirement"/);
  assert.match(form, /planCode === 'comunidad' && !communityFormValid/);
  const plans = await readFile(new URL('../src/lib/membershipPlans.ts', import.meta.url), 'utf8');
  const community = plans.slice(plans.indexOf('name: "Comunidad / Freemium"'), plans.indexOf('id: "afiliado"'));
  assert.doesNotMatch(community, /directorio|Universo|cursos|sesiones/i);
  assert.match(community, /Suscripción gratuita/);
});
