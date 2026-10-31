(function(){
if(window.NSMO)NSMO.guard();
const BASE=document.currentScript.src.replace(/exam\.js.*$/,'');
const E=window.EXAM,$=s=>document.querySelector(s),AR=(document.documentElement.lang==='ar');
const T=AR?{sc:'القسم',ns:'القسم التالي',ss:'درجات الأقسام',tl:'الوقت المتبقي',q:'السؤال',of:'من',fl:'علّم للمراجعة',nx:'التالي',pv:'السابق',qs:'الأسئلة',a:'مُجاب',m:'معلّم',u:'غير مُجاب',sb:'تسليم الاختبار',un:n=>`لديك ${n} سؤالًا بلا إجابة. هل تريد التسليم؟`,cf:'هل تريد تسليم الاختبار؟',rs:'نتيجتك',ya:'إجابتك',ca:'الصحيحة',sol:'الحل',re:'إعادة الاختبار',all:'كل الاختبارات',wip:'هذا الاختبار قيد الإعداد',bk:'العودة إلى قائمة الاختبارات'}
:{sc:'Section',ns:'Next section',ss:'Section scores',tl:'Time left',q:'Question',of:'of',fl:'Flag for review',nx:'Next',pv:'Previous',qs:'Questions',a:'Answered',m:'Flagged',u:'Unanswered',sb:'Submit exam',un:n=>`You have ${n} unanswered question(s). Submit anyway?`,cf:'Submit the exam?',rs:'Your result',ya:'Your answer',ca:'Correct',sol:'Solution',re:'Retake',all:'All exams',wip:'This exam is being prepared',bk:'Back to the exam list'};
if(!E||!E.questions.length){$('#app').innerHTML=`<div class="wrap"><div class="panel res"><h2>${T.wip}</h2><p><a href="../">${T.bk}</a></p></div></div>`;return}
const Q=E.questions,N=Q.length,L=AR?'أبجد':'ABCD',ans=Array(N).fill(null),flag=Array(N).fill(false);let cur=0,left=(E.minutes||60)*60,tm,done=false;
const mmss=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
// sections (optional): E.sections=[{title,n}] ; the sum of n must equal the number of questions
let SI=null,SB=[];if(Array.isArray(E.sections)&&E.sections.length&&E.sections.reduce((a,s)=>a+s.n,0)===N){SI=[];E.sections.forEach((s,k)=>{SB.push(SI.length);for(let j=0;j<s.n;j++)SI.push(k)})}
const lastOfSec=i=>SI&&i<N-1&&SI[i+1]!==SI[i],secRes=k=>{let c=0,t=0;Q.forEach((q,i)=>{if(SI[i]===k){t++;if(ans[i]===q.ans)c++}});return c+' / '+t};
const img=(s,m)=>`<img class="qi" src="${BASE}${s}" alt="" style="max-width:100%;${m?'max-height:'+m+'px;':''}height:auto">`;
const opt=o=>typeof o==='object'?(o.t?`<span>${o.t}</span>`:'')+(o.img?`<div style="margin-top:6px">${img(o.img,180)}</div>`:''):/^img:/.test(o)?img(o.slice(4),180):o;
// question body: text + optional image (ipos: above|below|left|right ; ialign: start|center|end for stacked images)
function qbody(q){const t=`<div class="${AR?'qar':'qen'}" style="font-size:1.1em">${q.q||''}</div>`;if(!q.img)return t;const p=q.ipos||'below',al={start:'start',center:'center',end:'end'}[q.ialign]||'center';
 if(p==='left'||p==='right'){const i=`<div style="flex:0 1 42%">${img(q.img)}</div>`,x=`<div style="flex:1 1 110px;direction:${AR?'rtl':'ltr'}">${t}</div>`;return `<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;direction:ltr">${p==='left'?i+x:x+i}</div>`}
 const i=`<div style="display:flex;justify-content:${al==='start'?'flex-start':al==='end'?'flex-end':'center'};margin:12px 0;direction:ltr">${img(q.img)}</div>`;return p==='above'?i+t:t+i}
$('#app').innerHTML=`<div class="bar"><div class="brand"><img class="mini" src="${BASE}logo.jpeg" alt=""><div class="bt"><b id="bt1">${E.title}</b><small id="bt2">${E.level}</small></div></div><div class="timer"><small>${T.tl}</small><b id="tm"></b></div></div>
<div class="exam" id="ex"><main><div class="head"><span class="cnt">${T.q} <b id="n"></b> ${T.of} ${N}</span><button class="flag" id="fl">${T.fl}</button></div><div class="panel" id="q"></div><div class="nav"><button class="btn pri" id="nx">${T.nx}</button><button class="btn" id="pv">${T.pv}</button></div></main>
<aside class="panel side"><div class="t"><h2>${T.qs}</h2><div class="lg"><span><i style="background:var(--ind)"></i>${T.a}</span><span><i style="border:2px solid var(--amber)"></i>${T.m}</span><span><i style="border:2px solid var(--line)"></i>${T.u}</span></div></div><div class="grid" id="gr"></div><button class="sub-btn" id="sb">${T.sb}</button></aside></div>`;
function draw(){const q=Q[cur];$('#n').textContent=cur+1;$('#fl').classList.toggle('on',flag[cur]);
 $('#q').innerHTML=`${qbody(q)}<div class="opts">${q.opts.map((o,i)=>`<button class="opt ${ans[cur]===i?'sel':''}" data-i="${i}"><i>${L[i]}</i><span>${opt(o)}</span></button>`).join('')}</div>`;
 $('#pv').disabled=cur===0;$('#nx').disabled=cur===N-1;$('#nx').textContent=lastOfSec(cur)?T.ns:T.nx;
 if(SI){$('#bt1').textContent=E.sections[SI[cur]].title;$('#bt2').textContent=`${T.sc} ${SI[cur]+1} ${T.of} ${E.sections.length} · ${E.title}`}
 $('#gr').innerHTML=Q.map((_,i)=>(SI&&SB.includes(i)?`<div style="grid-column:1/-1;font-weight:700;font-size:.85em;margin-top:6px">${E.sections[SI[i]].title}</div>`:'')+`<button class="g ${flag[i]?'f':ans[i]!==null?'a':''} ${i===cur?'cur':''}" data-g="${i}">${i+1}</button>`).join('')}
$('#q').onclick=e=>{const b=e.target.closest('.opt');if(!b||done)return;const i=+b.dataset.i;ans[cur]=ans[cur]===i?null:i;draw()};
$('#gr').onclick=e=>{const b=e.target.closest('.g');if(b){cur=+b.dataset.g;draw()}};
$('#nx').onclick=()=>{cur++;draw()};$('#pv').onclick=()=>{cur--;draw()};$('#fl').onclick=()=>{flag[cur]=!flag[cur];draw()};
$('#sb').onclick=()=>{const un=ans.filter(a=>a===null).length;if(confirm(un?T.un(un):T.cf))finish()};
function finish(){if(done)return;done=true;clearInterval(tm);let s=0;Q.forEach((q,i)=>{if(ans[i]===q.ans)s++});
 if(window.NSMO)NSMO.send(Object.assign({type:'result',level:E.level,exam:E.id,score:s,total:N,secs:SI?E.sections.map((x,k)=>x.title+': '+secRes(k)).join(' | '):''},NSMO.get()||{}));
 $('#ex').outerHTML=`<div class="wrap"><div class="panel res"><h2>${T.rs}</h2><div class="score">${s} / ${N}</div><p>${Math.round(s/N*100)}%</p>${SI?`<div style="margin:10px 0"><b>${T.ss}</b>${E.sections.map((x,k)=>`<div>${x.title}: <b>${secRes(k)}</b></div>`).join('')}</div>`:''}<div class="rv">${Q.map((q,i)=>(SI&&SB.includes(i)?`<h3 style="margin:14px 0 6px">${E.sections[SI[i]].title}</h3>`:'')+`<div class="${ans[i]===q.ans?'y':'n'}"><b>${i+1}.</b> ${qbody(q)}<p>${T.ya}: ${ans[i]===null?'—':L[ans[i]]} — ${T.ca}: ${L[q.ans]}</p>${q.sol||q.solimg?`<p>${T.sol}: ${q.sol||''}</p>${q.solimg?img(q.solimg,260):''}`:''}</div>`).join('')}</div><p><a class="btn pri" style="display:inline-block;margin:14px 6px" href="">${T.re}</a><a class="btn" style="display:inline-block" href="../">${T.all}</a></p></div></div>`}
function tick(){$('#tm').textContent=mmss(left);if(left--<=0)finish()}
tick();tm=setInterval(tick,1000);draw();
})();
