/** Built Next runtime + native image processing. Local GET only; no business writes. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer, connect } from 'node:net';
import { once } from 'node:events';
import { resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..');
const reservation=createServer();
reservation.listen(0,'127.0.0.1');
await once(reservation,'listening');
const port=reservation.address().port;
await new Promise((resolve,reject)=>reservation.close(error=>error?reject(error):resolve()));
const origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,[resolve(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)],{
  cwd:root,stdio:'ignore',windowsHide:true,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'},
});
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let stage='START_LOCAL_NEXT';
try {
  let ready=false;
  for(let i=0;i<60;i++) {
    assert.equal(server.exitCode,null,'Owned Next process exited');
    try {
      const response=await fetch(origin+'/politica-tratamiento-datos',{signal:AbortSignal.timeout(1000)});
      if(response.status===200) {ready=true;break;}
    } catch { /* bounded startup only */ }
    await pause(250);
  }
  assert(ready,'Local Next did not become ready');
  stage='READ_ONLY_ROUTE_CHECKS';
  for(const path of ['/afiliate','/afiliate/pago/resultado','/newsletters/preferencias']) {
    const response=await fetch(origin+path,{signal:AbortSignal.timeout(10000)});
    assert.equal(response.status,200);
    assert.match(response.headers.get('content-type'),/text\/html/);
  }
  stage='NATIVE_IMAGE_OPTIMIZATION';
  const image=await fetch(origin+'/_next/image?url=%2Fimages%2Fopcion3%2Fhero.webp&w=256&q=75',{
    headers:{Accept:'image/webp'},signal:AbortSignal.timeout(10000),
  });
  assert.equal(image.status,200);
  assert.match(image.headers.get('content-type'),/^image\//);
  assert((await image.arrayBuffer()).byteLength>0);
  console.log('NEXT_RUNTIME_SMOKE=PASS; local routes; native image optimization; BUSINESS_WRITES=false; SMTP_USED=false');
} catch(error) {
  console.error('NEXT_RUNTIME_SMOKE=FAIL; stage='+stage+'; error_type='+error.name);
  process.exitCode=1;
} finally {
  if(server.exitCode===null) {
    const exited=once(server,'exit');
    server.kill('SIGTERM');
    let timer;
    await Promise.race([exited,new Promise(resolve=>{timer=setTimeout(resolve,10000);})]);
    clearTimeout(timer);
    if(server.exitCode===null) {server.kill('SIGKILL');await exited;}
  }
  const open=()=>new Promise(resolve=>{
    const socket=connect({host:'127.0.0.1',port});
    socket.once('connect',()=>{socket.destroy();resolve(true);});
    socket.once('error',()=>resolve(false));
  });
  let closed=false;
  for(let i=0;i<40;i++) {if(!await open()){closed=true;break;}await pause(100);}
  assert(closed,'Owned Next listener remains open');
  console.log('NEXT_RUNTIME_CLEANUP=PASS');
}
