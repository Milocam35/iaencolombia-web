import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const file = await readFile(new URL('../src/lib/community.ts', import.meta.url), 'utf8');
const javascript = ts.transpileModule(file.replace("import { ACIA_API_URL } from '@/lib/config';", "const ACIA_API_URL='https://api.example.test';"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const lib = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);

test('registration message distinguishes opt-in pending and no consent without promising portal access', () => {
  assert.match(lib.communityRegistrationMessage(true), /necesita confirmar/);
  assert.match(lib.communityRegistrationMessage(false), /No has autorizado/);
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

test('community checkbox is optional and unchecked; no private benefits in its catalog entry', async () => {
  const form = await readFile(new URL('../src/components/forms/AffiliationForm.tsx', import.meta.url), 'utf8');
  const checkbox = form.match(/<input name="communications_consent"[^>]+>/)?.[0];
  assert.ok(checkbox); assert.doesNotMatch(checkbox, /required|defaultChecked|checked=/);
  const plans = await readFile(new URL('../src/lib/membershipPlans.ts', import.meta.url), 'utf8');
  const community = plans.slice(plans.indexOf('name: "Comunidad / Freemium"'), plans.indexOf('id: "afiliado"'));
  assert.doesNotMatch(community, /directorio|Universo|cursos|sesiones/i);
  assert.match(community, /suscripción voluntaria/);
});
