// Read-only local browser verification of the built global signature; no login or backend.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const name=JSON.parse(await readFile(join(root,'package.json'),'utf8')).name;
const app=name==='plataforma-acia'?'admin':name==='acia-member-portal'?'portal':'web';
const routes=app==='web'?['/papers','/normatividad','/comunicados','/politica-tratamiento-datos','/missing-credit-review-page']:app==='admin'?['/login','/activate-account','/restablecer-contrasena','/dashboard']:['/login','/activar','/recuperar-contrasena','/inicio'];
const {chromium}=await import(pathToFileURL(process.env.ACIA_MAIL_PLAYWRIGHT_MODULE).href);
const reserve=createServer();reserve.listen(0,'127.0.0.1');await once(reserve,'listening');const port=reserve.address().port;await new Promise(r=>reserve.close(r));
const origin=`http://127.0.0.1:${port}`;
const args=app==='web'?['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)]:['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'];
const server=spawn(process.execPath,args,{cwd:root,stdio:'ignore',windowsHide:true,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1',NEXT_PUBLIC_ACIA_API_URL:'https://api.example.test'}});
let browser;
const output=join(root,'docs/review/kpichat-credit');await mkdir(output,{recursive:true});
try{
 let ready=false;for(let i=0;i<80;i++){assert.equal(server.exitCode,null);try{if((await fetch(origin+routes[0])).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}assert(ready);
 const asset=await fetch(origin+'/brand/kpichat-blue.png');assert.equal(asset.status,200);assert.equal(createHash('sha256').update(Buffer.from(await asset.arrayBuffer())).digest('hex'),'c35d976601b061cb90ff765937aaf45e2bb02ca5a0091cf2979a9ca93b65c125');
 browser=await chromium.launch({executablePath:process.env.ACIA_MAIL_CHROMIUM_PATH,headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const external=[];await context.route('**/*',route=>{if(new URL(route.request().url()).origin!==origin){external.push(new URL(route.request().url()).hostname);return route.abort();}assert(['GET','HEAD'].includes(route.request().method()));return route.continue();});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of routes){await page.goto(origin+route);const badge=page.locator('.kpichat-signature');await badge.waitFor();assert.equal(await badge.count(),1);const link=badge.getByRole('link');assert.equal(await link.getAttribute('href'),'https://www.kpichat.ai');assert.equal(await link.getAttribute('target'),'_blank');assert.equal(await link.getAttribute('rel'),'noopener noreferrer');}
 await page.goto(origin+routes[0]);
 const badge=page.locator('.kpichat-signature');await badge.waitFor();const link=badge.getByRole('link');
 await badge.locator('img').evaluate(async img=>{if(!img.complete)await new Promise((r,j)=>{img.onload=r;img.onerror=j;});if(!img.naturalWidth||!img.naturalHeight)throw new Error('Brand asset not loaded');});
 for(const width of [1440,390,320]){await page.setViewportSize({width,height:width===1440?1000:844});const box=await badge.boundingBox();assert(box.x>=0&&box.x+box.width<=width);const styles=await badge.evaluate(el=>({position:getComputedStyle(el).position,left:getComputedStyle(el).left,bottom:getComputedStyle(el).bottom,logoHeight:getComputedStyle(el.querySelector('img')).height}));assert.equal(styles.position,'fixed');assert.equal(styles.logoHeight,width===1440?'16px':'14px');assert.equal(styles.bottom,width===1440?'18px':'64px');if(width!==320){await page.screenshot({path:join(output,width===1440?'desktop.png':'mobile.png')});await badge.screenshot({path:join(output,width===1440?'signature-desktop.png':'signature-mobile.png')});}}
 await link.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');assert(await link.evaluate(el=>el===document.activeElement));assert.equal(await link.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
 await page.evaluate(()=>{const modal=document.createElement('dialog');modal.id='credit-review-dialog';modal.textContent='Local presentation check';document.body.append(modal);modal.showModal();});assert.equal(await badge.evaluate(el=>getComputedStyle(el).visibility),'hidden');await page.evaluate(()=>document.querySelector('#credit-review-dialog').remove());assert.equal(await badge.evaluate(el=>getComputedStyle(el).visibility),'visible');
 assert.deepEqual(errors,[]);
 await writeFile(join(output,'validation.json'),JSON.stringify({app,routes,signature_count:1,reference:'https://fonomia.com/',destination:'https://www.kpichat.ai',desktop_and_mobile:'1440/390/320 PASS',local_logo_original_bytes:'PASS',keyboard_focus:'PASS',hidden_during_modal:'PASS',authentication:'no login or token injection',external_browser_requests_blocked:external,business_writes:false},null,2)+'\n');
 console.log('KPICHAT_SIGNATURE_BROWSER=PASS; APP='+app+'; BUSINESS_WRITES=false');
}finally{if(browser)await browser.close();if(server.exitCode===null){const exited=once(server,'exit');server.kill();await exited;}console.log('LOCAL_REVIEW_CLEANUP=PASS');}
