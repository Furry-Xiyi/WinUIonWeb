import WebSocket from 'ws'
const list=await (await fetch('http://127.0.0.1:9933/json/list')).json(); const p=list.find(x=>x.type==='page'); console.log(list.map(x=>({url:x.url,id:x.id}))); if(!p) process.exit(1); const ws=new WebSocket(p.webSocketDebuggerUrl); let id=0; const pending=new Map(); ws.on('message',d=>{const m=JSON.parse(d); const q=pending.get(m.id); if(q){pending.delete(m.id);q(m)}}); const send=(method,params={})=>new Promise((resolve,reject)=>{const i=++id; pending.set(i,m=>m.error?reject(m.error):resolve(m.result)); ws.send(JSON.stringify({id:i,method,params}))}); await new Promise(r=>ws.once('open',r)); await send('Runtime.enable'); await send('Page.enable'); const ev=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result?.value;
console.log('url',p.url); console.log(await ev('location.href'));
await ev(`document.querySelector('.content-dialog-close')?.click()`);
for(let i=0;i<100;i++){const w=i%2?500:1920; await send('Emulation.setDeviceMetricsOverride',{width:w,height:900,deviceScaleFactor:1,mobile:false});}
await new Promise(r=>setTimeout(r,1000)); console.log('after',await ev(`({ready:document.readyState, frozen:!!document.querySelector('.gallery-navigation-freeze'), cls:document.querySelector('.gallery-titlebar')?.className, width:innerWidth, frames:performance.now()})`));
console.log('long',await ev(`performance.getEntriesByType('longtask').slice(-5).map(x=>({d:x.duration,s:x.startTime}))`));
ws.close()
