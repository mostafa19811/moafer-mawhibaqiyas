import os,json
H='<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0f3d2e"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;800&display=swap">'
FT={'ar':'نماذج تدريبية غير رسمية من أكاديمية معافر','en':'Unofficial practice exams from Moafer Academy'}
PJ={'ar':'المشروع الوطني للتعرف على الموهوبين (مقياس موهبة)','en':'National Project for Identifying Gifted Students (Mawhiba Scale)'}
LV={1:('x',{'ar':'المستوى الأول (من الثالث إلى الخامس الابتدائي)','en':'Level 1 (Primary 3 to 5)'}),2:('x',{'ar':'المستوى الثاني (السادس الابتدائي إلى الثاني المتوسط)','en':'Level 2 (Primary 6 to Intermediate 2)'}),3:('x',{'ar':'المستوى الثالث (الثالث المتوسط والأول الثانوي)','en':'Level 3 (Intermediate 3 and Secondary 1)'})}
NEXAMS=3
def w(p,t):
    os.makedirs(os.path.dirname(p) or '.',exist_ok=True);open(p,'w',encoding='utf-8').write(t)
for lv in LV:
  for lg in('ar','en'):
    d='ltr' if lg=='en' else 'rtl'; t=LV[lv][1][lg]
    items=''.join(f'<li><a href="{k}/"><span class="num">{k}</span><div><b>{"الاختبار التدريبي" if lg=="ar" else "Practice exam"} {k}</b></div></a></li>' for k in range(1,NEXAMS+1))
    GL={'ar':('كلمة مرور هذا المستوى','أدخل كلمة المرور التي حصلت عليها من أكاديمية معافر للدخول إلى اختبارات هذا المستوى.','دخول','كلمة المرور غير صحيحة، حاول مرة أخرى','اكتب كلمة المرور'),'en':('Level password','Enter the password you received from Moafer Academy to access this level\'s exams.','Enter','Incorrect password, please try again','Enter the password')}[lg]
    gate=f'<form class="form gate" id="gt" novalidate><div class="lock" aria-hidden="true">&#128274;</div><p style="margin:0;color:var(--mut)">{GL[1]}</p><div><label for="pw">{GL[0]}</label><input id="pw" type="password" autocomplete="off" dir="ltr" style="text-align:center"><div class="err" id="e-pw"></div></div><button type="submit">{GL[2]}</button></form>'
    gjs=f'var L=NSMO.level(),gt=document.getElementById("gt"),ls=document.getElementById("ls"),pw=document.getElementById("pw"),ep=document.getElementById("e-pw");function show(){{gt.hidden=true;ls.hidden=false;document.getElementById("intro").hidden=false}}if(NSMO.open(L))show();else document.getElementById("intro").hidden=true;gt.onsubmit=function(ev){{ev.preventDefault();if(!pw.value.trim()){{ep.textContent="{GL[4]}";pw.classList.add("bad");return}}if(NSMO.unlock(L,pw.value))show();else{{ep.textContent="{GL[3]}";pw.classList.add("bad");pw.value="";pw.focus()}}}};'
    back='← تعديل بياناتي' if lg=='ar' else '← Edit my details'
    intro='ستظهر نتيجتك فور التسليم مع الإجابات الصحيحة.' if lg=='ar' else 'Your result appears right after you submit, with the correct answers.'
    w(f'level{lv}/{lg}/index.html',f'<!doctype html><html lang="{lg}" dir="{d}"><head>{H}<title>{t}</title><link rel="stylesheet" href="../../style.css"></head><body><div class="bar slim"><a class="proj" href="../../">{PJ[lg]}</a></div><main class="wrap hero"><h1>{t}</h1><p class="hi" id="hi"></p>{gate}<p id="intro" hidden>{intro}</p><ul class="list" id="ls" hidden>{items}</ul><p><a href="../../">{back}</a></p></main><footer>{FT[lg]}</footer><script src="../../passwords.js"></script><script src="../../nsmo.js"></script><script>NSMO.guard();var s=NSMO.get();if(s)document.getElementById("hi").textContent=s.name+" — "+(s.gradeLabel||s.grade);{gjs}</script></body></html>')
    for k in range(1,NEXAMS+1):
      w(f'level{lv}/{lg}/{k}/index.html',f'<!doctype html><html lang="{lg}" dir="{d}"><head>{H}<meta name="robots" content="noindex"><title>{t} #{k}</title><link rel="stylesheet" href="../../../style.css"></head><body><div id="app"></div><script src="../../../data/l{lv}-{lg}-{k}.js"></script><script src="../../../passwords.js"></script><script src="../../../nsmo.js"></script><script src="../../../exam.js"></script></body></html>')
