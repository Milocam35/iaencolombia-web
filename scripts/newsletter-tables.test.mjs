import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const source=readFileSync(new URL('../src/components/newsletter/NewsletterArticle.tsx',import.meta.url),'utf8').replace(/import '\.\/newsletter-article\.css';/,'');
let compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext}}).outputText;
compiled=compiled.replace(/from (["'])([^"']+)\1/g,(_,quote,name)=>'from '+quote+import.meta.resolve(name)+quote);
const {NewsletterArticle}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const table="| Índice o empresa | Variación diaria al cierre del 30 de octubre |\n| --- | --- |\n| Nasdaq Composite | −2,86% |\n| S&P 500 | −1,82% |\n| Dow Jones | −1,09% |\n| Intel | −28,6% |\n| AMD | −10,9% |\n| NVIDIA | −4,2% |";
const render=(content_markdown,extra={})=>renderToStaticMarkup(createElement(NewsletterArticle,{article:{title:'Prueba',summary:null,content_markdown,...extra}}));
test('actual public article renders the supplied table with two headers and six rows',()=>{
 const html=render(table);
 assert.equal((html.match(/<th[ >]/g)||[]).length,2);
 assert.equal((html.match(/<tr[ >]/g)||[]).length,7);
 assert.match(html,/<table>/);assert.match(html,/−28,6%/);assert.match(html,/S&amp;P 500/);
 assert.match(html,/role="region" aria-label="Tabla del newsletter" tabindex="0"/);
});
test('tables keep unsafe HTML, tracking images and unsafe links disabled',()=>{
 const html=render('| Celda |\n| --- |\n| <script>alert(1)</script> ![pixel](https://example.test/pixel) [Mal](javascript:alert(1)) |');
 assert.doesNotMatch(html,/<script|<img|<iframe|href="javascript:/);
});
test('public cover uses the authoritative field and alternative text',()=>{
 assert.match(render('Texto',{image_url:'https://example.test/public/newsletter-images/test',image_alt:'Portada ACIA'}),/alt="Portada ACIA"/);
});
