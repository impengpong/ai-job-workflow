// Read-only adaptation of the existing CDP workflow. No profile/cookie access.
import fs from 'node:fs';
import path from 'node:path';
const args=process.argv.slice(2);
if(args.includes('--help')){console.log('node scripts/capture-page.mjs --endpoint http://127.0.0.1:9222 --platform boss|liepin|zhilian|job51|maimai --url HTTPS_URL --out private/evidence');process.exit(0)}
const arg=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const specs={boss:{domain:'zhipin.com',selectors:['.job-sec-text']},liepin:{domain:'liepin.com',selectors:['.job-description','.job-intro-container','.content.content-word']},zhilian:{domain:'zhaopin.com',selectors:['.describtion-card__detail-content','.describtion__detail-content','.job-summary']},job51:{domain:'51job.com',selectors:['.job-detail-describe','.job-description','.job_msg','.bmsg']},maimai:{domain:'maimai.cn',selectors:['.job-detail','.job-description','[class*="jobDetail"]']}};
const platform=arg('--platform'),spec=specs[platform];if(!spec)throw Error('Unsupported platform');
const url=new URL(arg('--url'));if(url.protocol!=='https:'||!(url.hostname===spec.domain||url.hostname.endsWith('.'+spec.domain))||url.username||url.password)throw Error('Expected platform HTTPS URL');
const endpoint=new URL(arg('--endpoint','http://127.0.0.1:9222'));
if(endpoint.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(endpoint.hostname)||endpoint.username||endpoint.password)throw Error('Only local CDP endpoint allowed');
const out=path.resolve(arg('--out','private/evidence'));
const v=await(await fetch(new URL('/json/version',endpoint),{signal:AbortSignal.timeout(5000)})).json();
const websocket=new URL(v.webSocketDebuggerUrl);
if(!['127.0.0.1','localhost','[::1]'].includes(websocket.hostname)||websocket.protocol!=='ws:')throw Error('CDP websocket must stay local');
const ws=new WebSocket(websocket);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
let id=0,targetId;const pending=new Map();
ws.onmessage=e=>{const d=JSON.parse(e.data);if(d.id)pending.get(d.id)?.(d)};
function call(method,params={},sessionId){return new Promise((resolve,reject)=>{const n=++id;const timer=setTimeout(()=>{pending.delete(n);reject(Error('Timeout '+method))},15000);pending.set(n,d=>{clearTimeout(timer);pending.delete(n);d.error?reject(Error(d.error.message)):resolve(d.result)});ws.send(JSON.stringify({id:n,method,params,sessionId}))})}
try{
 ({targetId}=await call('Target.createTarget',{url:'about:blank',hidden:true,background:true,focus:false}));
 const {sessionId}=await call('Target.attachToTarget',{targetId,flatten:true});
 await call('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false},sessionId);
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error('DOM read failed');return r.result.value};
 await call('Page.navigate',{url:url.href},sessionId);
 let data;
 for(let i=0;i<12;i++){
  await new Promise(r=>setTimeout(r,750));
  data=await evaluate(`(()=>{const body=document.body?.innerText||'';const matches=${JSON.stringify(spec.selectors)}.flatMap(selector=>Array.from(document.querySelectorAll(selector)).map(e=>({selector,text:e.innerText||'',client_height:e.clientHeight,scroll_height:e.scrollHeight})));return {url:location.href,title:document.title,visibility:document.visibilityState,focused:document.hasFocus(),blocked:/访问受限|操作频繁|账号.{0,8}限制|滑动验证|安全验证|确认您是真人/.test(body.slice(0,10000)),login_notice:/登录.{0,12}(查看|阅读|完整|更多)/.test(body),matches}})()`);
  if(data.visibility!=='hidden'||data.focused)throw Error('Page no longer hidden/unfocused');
  if(data.blocked||data.matches.some(x=>x.text.length>80))break;
 }
 const candidate=data.matches.sort((a,b)=>b.text.length-a.text.length)[0];
 fs.mkdirSync(out,{recursive:true,mode:0o700});
 const screenshot=await call('Page.captureScreenshot',{format:'png'},sessionId);
 fs.writeFileSync(path.join(out,'page.png'),Buffer.from(screenshot.data,'base64'),{mode:0o600});
 const report={platform,checked_at:new Date().toISOString(),...data,candidate_text:candidate?.text||'',status:data.blocked?'blocked':candidate?.text?'candidate_requires_review':'no_candidate',complete_jd_verified:false,external_actions:0};
 fs.writeFileSync(path.join(out,'page.json'),JSON.stringify(report,null,2),{mode:0o600});
 console.log(JSON.stringify({status:report.status,candidate_chars:report.candidate_text.length,complete_jd_verified:false}));
 if(report.status!=='candidate_requires_review')process.exitCode=1;
}finally{if(targetId)await call('Target.closeTarget',{targetId}).catch(()=>{});ws.close()}
