(function(){
// ===== إعداد حفظ البيانات =====
// ضع هنا رابط Google Apps Script (ينتهي بـ /exec) ليصل التسجيل والنتائج إلى جدول Google Sheets.
// إذا تُرك فارغًا يُرسل الموقع البيانات إلى Netlify Forms (يعمل على Netlify فقط).
const SHEET_URL='';
const src=document.currentScript.src,BASE=src.slice(0,src.lastIndexOf('/')+1),K='mawhiba_student';
const F={register:['name','phone','grade','gradeLabel','lang'],results:['name','phone','grade','gradeLabel','lang','level','exam','score','total','secs']};
// grade -> level: 3-5 = 1, 6-8 = 2, 9-10 = 3
const LV={3:1,4:1,5:1,6:2,7:2,8:2,9:3,10:3};
// ===== كلمات مرور المستويات (تُحفظ كبصمة SHA-256 وليس نصًا صريحًا) — تُولَّد بالأمر: python set-passwords.py 1=... 2=... 3=... =====
function sha256(ascii){function rr(v,a){return(v>>>a)|(v<<(32-a))}var mp=Math.pow,mw=mp(2,32),i,j,result='',words=[],al=ascii.length*8,hash=sha256.h=sha256.h||[],k=sha256.k=sha256.k||[],pc=k.length,ic={};
for(var c=2;pc<64;c++){if(!ic[c]){for(i=0;i<313;i+=c)ic[i]=c;hash[pc]=(mp(c,.5)*mw)|0;k[pc++]=(mp(c,1/3)*mw)|0}}
ascii+='\x80';while(ascii.length%64-56)ascii+='\x00';
for(i=0;i<ascii.length;i++){j=ascii.charCodeAt(i);words[i>>2]|=j<<((3-i)%4)*8}
words[words.length]=((al/mw)|0);words[words.length]=al;
for(j=0;j<words.length;){var w=words.slice(j,j+=16),oh=hash;hash=hash.slice(0,8);
for(i=0;i<64;i++){var w15=w[i-15],w2=w[i-2],a=hash[0],e=hash[4];
var t1=hash[7]+(rr(e,6)^rr(e,11)^rr(e,25))+((e&hash[5])^((~e)&hash[6]))+k[i]+(w[i]=(i<16)?w[i]:(w[i-16]+(rr(w15,7)^rr(w15,18)^(w15>>>3))+w[i-7]+(rr(w2,17)^rr(w2,19)^(w2>>>10)))|0);
var t2=(rr(a,2)^rr(a,13)^rr(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
hash=[(t1+t2)|0].concat(hash);hash[4]=(hash[4]+t1)|0}
for(i=0;i<8;i++)hash[i]=(hash[i]+oh[i])|0}
for(i=0;i<8;i++)for(j=3;j+1;j--){var b=(hash[i]>>(j*8))&255;result+=((b<16)?'0':'')+b.toString(16)}return result}
const PWH=window.NSMO_PW||{},UK='mawhiba_unlock';
function norm(p){return String(p).trim().replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632}).toLowerCase()}
function hp(l,p){return sha256(unescape(encodeURIComponent('mawhiba|L'+l+'|'+norm(p))))}
function ugot(){try{return JSON.parse(sessionStorage.getItem(UK))||{}}catch(e){return{}}}
const N={BASE,LV,
 get(){try{return JSON.parse(localStorage.getItem(K))}catch(e){return null}},
 set(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}},
 send(p){const f=p.type==='register'?'register':'results',b=new URLSearchParams({'form-name':f});
  F[f].forEach(k=>b.append(k,p[k]==null?'':p[k]));
  if(SHEET_URL){try{return fetch(SHEET_URL,{method:'POST',mode:'no-cors',keepalive:true,body:b}).catch(function(){})}catch(e){return Promise.resolve()}}
  try{return fetch(BASE,{method:'POST',keepalive:true,headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b.toString()}).catch(function(){})}catch(e){return Promise.resolve()}},
 path(s){return 'level'+LV[s.grade]+'/'+s.lang+'/'},
 level(){const m=location.pathname.match(/level(\d)\//);return m?+m[1]:0},
 lang(){const m=location.pathname.match(/level\d\/(ar|en)\//);return m?m[1]:'ar'},
 open(l){return !!PWH[l]&&ugot()[l]===PWH[l]},
 unlock(l,p){const h=hp(l,p);if(!PWH[l]||h!==PWH[l])return false;const u=ugot();u[l]=h;try{sessionStorage.setItem(UK,JSON.stringify(u))}catch(e){}return true},
 guard(x){let ok=true;try{localStorage.setItem('t','1');localStorage.removeItem('t')}catch(e){ok=false}if(!ok)return true;
  if(!N.get()){location.replace(BASE);return false}
  if(x&&!N.open(N.level())){location.replace(BASE+'level'+N.level()+'/'+N.lang()+'/');return false}return true}
};
window.NSMO=N;
})();
