import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PUBLICATIONS, PUBLICATION_TYPES } from '../src/data/papers.ts';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const source = file => readFileSync(resolve(root, file), 'utf8');
function compile(file, dependencies = {}) {
  const output = ts.transpileModule(source(file), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022, esModuleInterop: true,
  } }).outputText;
  const exports = {};
  new Function('require', 'exports', output)(name => dependencies[name] ?? require(name), exports);
  return exports;
}
const citation = compile('src/components/papers/PublicationCitation.tsx');
const { PublicationCard } = compile('src/components/papers/PublicationCard.tsx', { './PublicationCitation': citation });
const { default: PapersPage, metadata } = compile('src/app/papers/page.tsx', {
  '@/components/layout/PublicPage': {
    PublicPage: ({ children }) => React.createElement('main', null, children),
    EmptyState: ({ title }) => React.createElement('p', null, title),
  },
  '@/data/papers': { PUBLICATIONS, PUBLICATION_TYPES },
  '@/components/papers/PublicationCard': { PublicationCard },
});
const paper = PUBLICATIONS[0];

test('el primer paper conserva autoría interna y depósito, sin datos editoriales inventados', () => {
  assert.equal(PUBLICATIONS.length, 1);
  assert.deepEqual(paper.authors, ['Angel Varela', 'Alejandro Colmenares', 'Juan Camilo Cortes']);
  assert.equal(paper.year, 2026);
  assert.equal(paper.depositedAt, '2026-09-30');
  assert.equal(paper.language, 'Español');
  assert.equal(paper.repository.identifier, 'MPRA Paper n.º 131077');
  assert.equal(paper.publicationType, 'Research Paper');
  assert.equal(paper.aciaIdentifier, 'ACIA-RP-2026-001');
  assert.match(paper.aciaIdentifier, /^ACIA-RP-2026-\d{3}$/);
  for (const key of ['version', 'license', 'reviewStatus', 'publicationDate']) assert.equal(paper[key], undefined);
  assert.equal(new Set(PUBLICATIONS.map(item => item.slug)).size, PUBLICATIONS.length);
  assert.equal(new Set(PUBLICATIONS.map(item => item.repository.url)).size, PUBLICATIONS.length);
});

test('la copia pública conserva todos los bytes del PDF original de MPRA', () => {
  const bytes = readFileSync(resolve(root, 'public', paper.pdfUrl.slice(1)));
  assert.equal(bytes.subarray(0, 8).toString(), '%PDF-1.7');
  assert.equal(bytes.length, 1137472);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'd061b9cd2ddc90e391181e164f4dacb057e7996d9a9cf88d9a2ef10486307aa4');
  assert(readFileSync(resolve(root, 'public', paper.coverUrl.slice(1))).length > 0);
});

test('ficha pública ofrece lectura, descarga real en el mismo origen y registro externo seguro', () => {
  const html = renderToStaticMarkup(React.createElement(PublicationCard, { publication: paper }));
  assert.match(html, /Research Paper.*Disponible en MPRA/);
  assert.match(html, /Depósito en MPRA/);
  assert.match(html, /<time dateTime="2026-09-30">30 de septiembre de 2026<\/time>/);
  assert.match(html, /href="\/papers\/gobernanza-ia-infraestructura-economica-mpra-131077.pdf" download=""/);
  assert.match(html, /href="https:\/\/mpra.ub.uni-muenchen.de\/131077\/" target="_blank" rel="noopener noreferrer"/);
  assert(html.includes(`alt="Portada interna del documento original: ${paper.title}"`));
  assert.match(html, /Leer PDF/);
  assert.match(html, /Descargar PDF/);
  assert(html.indexOf('Angel Varela') < html.indexOf('Alejandro Colmenares'));
  assert(html.indexOf('Alejandro Colmenares') < html.indexOf('Juan Camilo Cortes'));
});

test('la referencia es seleccionable sin JavaScript y el botón ofrece fallback de portapapeles', () => {
  const html = renderToStaticMarkup(React.createElement(citation.PublicationCitation, { citation: paper.citation }));
  assert.match(html, /<textarea[^>]*readOnly/);
  assert.match(html, /ACIA-RP-2026-001/);
  assert.match(html, /MPRA Paper n.º 131077/);
  assert.match(html, /Copiar referencia/);
  assert.match(html, /role="status"/);
  assert.match(source('src/components/papers/PublicationCitation.tsx'), /reference.current\?\.select\(\)/);
});

test('papers renderiza la publicación una sola vez y conserva las cuatro colecciones sin estado vacío', () => {
  const html = renderToStaticMarkup(React.createElement(PapersPage));
  assert.equal((html.match(/<article aria-labelledby="paper-/g) ?? []).length, 1);
  assert.doesNotMatch(html, /Repositorio institucional en preparación|Aún no hay publicaciones cargadas/);
  for (const type of PUBLICATION_TYPES) assert(html.includes(`${type.label}s`));
  assert.match(html, /href="#research-papers"/);
  assert.match(html, /id="research-papers"[\s\S]*<h2[^>]*>Research Papers<\/h2>[\s\S]*<article aria-labelledby="paper-/);
  assert.match(html, /1 publicación/);
  assert.equal(new Set(PUBLICATIONS.map(item => item.aciaIdentifier).filter(Boolean)).size, PUBLICATIONS.filter(item => item.aciaIdentifier).length);
});

test('SEO público describe el paper sin fecha de despliegue ni DOI, licencia o revisión ficticios', () => {
  assert.equal(metadata.alternates.canonical, 'https://www.iaencolombia.org/papers');
  assert.equal(metadata.openGraph.title, paper.title);
  assert.equal(metadata.twitter.title, paper.title);
  assert.equal(new URL(metadata.openGraph.images[0].url).protocol, 'https:');
  assert.doesNotMatch(JSON.stringify(metadata), /datePublished|publishedTime|peer.review|doi.org|Creative Commons/i);
});

test('la incorporación usa contenido versionado sin APIs de correo, escrituras o autenticación', () => {
  const code = ['src/data/papers.ts', 'src/app/papers/page.tsx', 'src/components/papers/PublicationCard.tsx', 'src/components/papers/PublicationCitation.tsx'].map(source).join('\n');
  assert.doesNotMatch(code, /fetch\(|sendEmail|newsletter|outbox|localStorage|sessionStorage|authorization|useSession|memberRequest/);
});
