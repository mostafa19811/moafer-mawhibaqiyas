(function(){
// ===== إعداد حفظ البيانات =====
// ضع هنا رابط Google Apps Script (ينتهي بـ /exec) ليصل التسجيل والنتائج إلى جدول Google Sheets.
// إذا تُرك فارغًا يُرسل الموقع البيانات إلى Netlify Forms (يعمل على Netlify فقط).
const SHEET_URL='https://script.google.com/macros/s/AKfycbzHiDRRla0YpQ_9OylkWUlV5QlwmQRz6iyugN-_nPaXpP0MUzEoYRJWhoX60lsNvF4/exec';
const src=document.currentScript.src,BASE=src.slice(0,src.lastIndexOf('/')+1),K='mawhiba_student';
const F={register:['name','phone','grade','gradeLabel','lang'],results:['name','phone','grade','gradeLabel','lang','level','exam','score','total','secs']};
// grade -> level: 3-5 = 1, 6-8 = 2, 9-10 = 3
const LV={3:1,4:1,5:1,6:2,7:2,8:2,9:3,10:3};
const N={BASE,LV,
 get(){try{return JSON.parse(localStorage.getItem(K))}catch(e){return null}},
 set(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}},
 send(p){const f=p.type==='register'?'register':'results',b=new URLSearchParams({'form-name':f});
  F[f].forEach(k=>b.append(k,p[k]==null?'':p[k]));
  if(SHEET_URL){try{return fetch(SHEET_URL,{method:'POST',mode:'no-cors',keepalive:true,body:b}).catch(function(){})}catch(e){return Promise.resolve()}}
  try{return fetch(BASE,{method:'POST',keepalive:true,headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b.toString()}).catch(function(){})}catch(e){return Promise.resolve()}},
 path(s){return 'level'+LV[s.grade]+'/'+s.lang+'/'},
 guard(){let ok=true;try{localStorage.setItem('t','1');localStorage.removeItem('t')}catch(e){ok=false}if(ok&&!N.get())location.replace(BASE)}
};
window.NSMO=N;
})();
