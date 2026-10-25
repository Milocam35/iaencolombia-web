import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
test('public reading uses a bounded no-store request without authentication',()=>{
  const api=source('src/lib/newsletters.ts');
  assert.match(api,/\/public\/newsletters/);
  assert.match(api,/cache: 'no-store'/);
  assert.match(api,/AbortSignal.timeout\(5000\)/);
  assert.doesNotMatch(api,/Authorization|localStorage|cookie|generateStaticParams/);
});
test('public edition exposes its revision for readiness and has canonical metadata',()=>{
  const page=source('src/app/newsletters/[slug]/page.tsx');
  assert.match(page,/force-dynamic/);
  assert.match(page,/data-newsletter-revision=\{item.revision_id\}/);
  assert.match(page,/canonical: url/);
  assert.match(page,/notFound\(\)/);
  assert.match(page,/NewsletterArticle article=\{item\}/);
});
test('homepage reads backend editions rather than a new hardcoded editorial source',()=>{
  assert.match(source('src/app/page.tsx'),/<NewslettersSection/);
  assert.match(source('src/components/sections/NewslettersSection.tsx'),/listNewsletters\(3\)/);
  assert.match(source('src/lib/constants.ts'),/label: "Newsletters", href: "\/newsletters"/);
});
