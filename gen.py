# Generates ORIGINAL practice questions (not from any book) -> data/l{level}-{lang}-{n}.js
import json,random,os
C={'fruit':(['تفاح','موز','برتقال','عنب','فراولة','مشمش'],['apple','banana','orange','grape','strawberry','apricot']),
'animal':(['أسد','حصان','بقرة','ذئب','غزال','جمل'],['lion','horse','cow','wolf','deer','camel']),
'vehicle':(['سيارة','طائرة','قطار','سفينة','دراجة','حافلة'],['car','plane','train','ship','bicycle','bus']),
'veg':(['جزر','خيار','بصل','بطاطس','خس','كوسة'],['carrot','cucumber','onion','potato','lettuce','zucchini'])}
TF=[('قلم','يكتب','pen','writes'),('سكين','يقطع','knife','cuts'),('عين','ترى','eye','sees'),('أذن','تسمع','ear','hears'),('مفتاح','يفتح','key','opens'),('مكنسة','تكنس','broom','sweeps'),('إبرة','تخيط','needle','sews'),('ملعقة','تؤكل بها','spoon','is used to eat')]
def nums(r,a,ds=(1,-1,2,-2,3,10,-10)):
    c=[a];d=list(ds);r.shuffle(d)
    for x in d:
        if a+x>0 and a+x not in c:c.append(a+x)
        if len(c)==4:break
    r.shuffle(c);return [str(x) for x in c],c.index(a)
def Q(lg,ar,en,sol_ar,sol_en,o,i):return {'q':ar if lg=='ar' else en,'opts':o,'ans':i,'sol':sol_ar if lg=='ar' else sol_en}
def qs(lv,k,lg):
    r=random.Random(f'{lv}-{k}');out=[]
    def seq(step_rng,start_rng):
        st=r.randint(*step_rng);a=r.randint(*start_rng);t=[a+st*i for i in range(5)]
        o,i=nums(r,t[4],(st,-st,1,-1,2*st));s=' ، '.join(map(str,t[:4]))
        return Q(lg,f'ما العدد التالي: {s} ، ؟',f'What comes next: {s.replace(" ، ",", ")}, ?',f'الفرق ثابت = {st}',f'The constant difference is {st}.',o,i)
    def geo(f,lo,hi):
        m=r.choice(f);a=r.randint(lo,hi);t=[a*m**i for i in range(5)];o,i=nums(r,t[4],(m,-m,a,10,-10,2*m))
        s=' ، '.join(map(str,t[:4]));return Q(lg,f'ما العدد التالي: {s} ، ؟',f'What comes next: {s.replace(" ، ",", ")}, ?',f'كل عدد = السابق × {m}',f'Each term = previous × {m}.',o,i)
    def sub(lo,hi):
        a=r.randint(lo,hi);b=r.randint(2,a-1);o,i=nums(r,a-b)
        return Q(lg,f'اشترى سالم {a} ريالًا وصرف {b}. كم بقي معه؟' if False else f'مع سالم {a} ريالًا، أنفق منها {b}. كم بقي معه؟',f'Salem has {a} riyals and spends {b}. How many are left?',f'{a} − {b} = {a-b}',f'{a} − {b} = {a-b}',o,i)
    def mul(lo,hi):
        a,b=r.randint(lo,hi),r.randint(lo,hi);o,i=nums(r,a*b,(a,-a,b,-b,10,-10))
        return Q(lg,f'ما ناتج {a} × {b}؟',f'What is {a} × {b}?',f'{a} × {b} = {a*b}',f'{a} × {b} = {a*b}',o,i)
    def miss(lo,hi):
        x=r.randint(lo,hi);a=r.randint(lo,hi);o,i=nums(r,x)
        return Q(lg,f'ما قيمة ؟ إذا كان ؟ + {a} = {x+a}',f'Find ? if ? + {a} = {x+a}',f'{x+a} − {a} = {x}',f'{x+a} − {a} = {x}',o,i)
    def rect(ar_):
        a,b=r.randint(3,15),r.randint(3,15)
        if ar_:v=a*b;o,i=nums(r,v,(a,-a,b,-b,2));return Q(lg,f'مستطيل طوله {a} سم وعرضه {b} سم. ما مساحته بالسنتيمتر المربع؟',f'A rectangle is {a} cm long and {b} cm wide. What is its area in cm²?',f'{a} × {b} = {v}',f'{a} × {b} = {v}',o,i)
        v=2*(a+b);o,i=nums(r,v,(2,-2,a,-b,4,-4));return Q(lg,f'مستطيل طوله {a} سم وعرضه {b} سم. ما محيطه بالسنتيمتر؟',f'A rectangle is {a} cm long and {b} cm wide. What is its perimeter in cm?',f'2 × ({a} + {b}) = {v}',f'2 × ({a} + {b}) = {v}',o,i)
    def frac():
        d=r.choice([2,3,4,5]);n=r.randint(1,d-1);b=d*r.randint(3,12);v=b//d*n;o,i=nums(r,v,(b//d,-(b//d),n,-n,2))
        return Q(lg,f'ما قيمة {n}/{d} من {b}؟',f'What is {n}/{d} of {b}?',f'{b} ÷ {d} × {n} = {v}',f'{b} ÷ {d} × {n} = {v}',o,i)
    def pct():
        p=r.choice([10,20,25,50,15]);b=r.choice([40,80,120,200,240]);v=b*p//100;o,i=nums(r,v,(5,-5,10,-10,2))
        return Q(lg,f'ما قيمة {p}% من {b}؟',f'What is {p}% of {b}?',f'{b} × {p}/100 = {v}',f'{b} × {p}/100 = {v}',o,i)
    def lin():
        x=r.randint(2,12);a=r.randint(2,5);b=r.randint(1,9);o,i=nums(r,x)
        return Q(lg,f'إذا كان {a}س + {b} = {a*x+b} فما قيمة س؟',f'If {a}x + {b} = {a*x+b}, what is x?',f'س = ({a*x+b} − {b}) ÷ {a} = {x}',f'x = ({a*x+b} − {b}) ÷ {a} = {x}',o,i)
    def age():
        s=r.randint(4,12);S=4*s;o,i=nums(r,s)
        return Q(lg,f'عمر الأب 3 أمثال عمر ابنه، ومجموع عمريهما {S} سنة. كم عمر الابن؟',f'A father is 3 times as old as his son. Together they are {S}. How old is the son?',f'4 × العمر = {S}، فالعمر = {s}',f'4 × age = {S}, so the son is {s}.',o,i)
    def sq():
        c=r.randint(0,5);t=[n*n+c for n in range(1,6)];o,i=nums(r,t[4],(2,-2,1,-1,4,-4));s=' ، '.join(map(str,t[:4]))
        return Q(lg,f'ما العدد التالي: {s} ، ؟',f'What comes next: {s.replace(" ، ",", ")}, ?',f'الحد = ن² + {c}',f'Term = n² + {c}.',o,i)
    def odd():
        a,b=r.sample(list(C),2);ia=r.sample(range(6),3);ib=r.randrange(6);w=[(a,x) for x in ia]+[(b,ib)];r.shuffle(w)
        j=1 if lg=='en' else 0;o=[C[c][j][x] for c,x in w];i=[n for n,(c,x) in enumerate(w) if c==b][0]
        return Q(lg,'أيّ الكلمات التالية تختلف عن البقية؟','Which word does not belong with the others?','الكلمة المختلفة من تصنيف آخر','The odd one belongs to a different category.',o,i)
    def ana():
        a,b=r.sample(range(len(TF)),2);ch=[b]+r.sample([x for x in range(len(TF)) if x!=b and x!=a],3);r.shuffle(ch);j=2 if lg=='en' else 0;v=3 if lg=='en' else 1
        t=TF[a];u=TF[b]
        return Q(lg,f'{t[0]} : {t[1]} ، {u[0]} : ؟',f'{t[2]} : {t[3]} , {u[2]} : ?','لكل أداة وظيفتها','Each tool has its function.',[TF[x][v] for x in ch],ch.index(b))
    P={1:[lambda:seq((2,9),(1,20)),lambda:seq((2,6),(10,40)),lambda:sub(20,90),lambda:mul(2,9),lambda:miss(3,30),lambda:rect(False),odd,odd,ana,ana],
       2:[lambda:seq((3,15),(5,60)),lambda:geo([2,3],1,5),lambda:mul(6,15),frac,lambda:miss(10,90),lambda:rect(True),odd,odd,ana,lambda:sub(100,900)],
       3:[sq,lambda:geo([2,3,4],2,6),pct,frac,age,lin,lambda:rect(True),odd,ana,lambda:mul(12,25)]}[lv]
    return [f() if f.__name__ in('odd','ana','frac','pct','lin','age','sq') else f() for f in P]
os.makedirs('data',exist_ok=True)
LT={1:('x','المستوى الأول (من الثالث إلى الخامس الابتدائي)','Level 1 (Primary 3 to 5)'),2:('x','المستوى الثاني (السادس الابتدائي إلى الثاني المتوسط)','Level 2 (Primary 6 to Intermediate 2)'),3:('x','المستوى الثالث (الثالث المتوسط والأول الثانوي)','Level 3 (Intermediate 3 and Secondary 1)')}
for lv in(1,2,3):
  for lg in('ar','en'):
    for k in range(1,4):
      E={'id':k,'title':'اختبار موهبة التدريبي' if lg=='ar' else 'Mawhiba Practice Exam','level':LT[lv][1 if lg=='ar' else 2],'minutes':30,'questions':qs(lv,k,lg)}
      if os.path.exists(f'data/l{lv}-{lg}-{k}.js'): continue
      open(f'data/l{lv}-{lg}-{k}.js','w',encoding='utf-8').write('window.EXAM='+json.dumps(E,ensure_ascii=False,indent=1)+';')
