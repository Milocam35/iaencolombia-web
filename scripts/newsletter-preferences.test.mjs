import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile(new URL('../src/lib/newsletterPreferences.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source.replace("import { ACIA_API_URL } from '@/lib/config';","const ACIA_API_URL='https://api.example.test';"),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const lib=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
test('newsletter unsubscribe sends capability in POST body only, never URL or storage',async()=>{
 const original=globalThis.fetch;const calls=[];
 globalThis.fetch=async(...args)=>{calls.push(args);return {ok:true};};
 try{
  await lib.unsubscribeNewsletter('synthetic-non-operational-capability');
  assert.equal(calls[0][0],'https://api.example.test/public/newsletter-preferences/unsubscribe');
  assert.equal(calls[0][1].method,'POST');assert.equal(calls[0][1].cache,'no-store');
  assert.equal(calls[0][1].referrerPolicy,'no-referrer');
  assert.deepEqual(JSON.parse(calls[0][1].body),{token:'synthetic-non-operational-capability'});
 }finally{globalThis.fetch=original;}
});
test('preferences uses explicit user action and removes fragment without auto-unsubscribe',async()=>{
 const component=await readFile(new URL('../src/components/newsletter/NewsletterPreferences.tsx',import.meta.url),'utf8');
 assert.match(component,/takeCommunityToken\(\)/);assert.match(component,/onClick=\{\(\)=>void unsubscribe\(\)\}/);
 assert.doesNotMatch(component,/localStorage|sessionStorage|console\.|sendBeacon|location\.search/);
 const effect=component.slice(component.indexOf('useEffect(()=>'),component.indexOf('async function unsubscribe'));
 assert.doesNotMatch(effect,/unsubscribeNewsletter|fetch\(/);
});
