# يولّد passwords.js (بصمات SHA-256 فقط، بلا نص صريح).
# الاستخدام:  python set-passwords.py 1=كلمة_المستوى_الأول 2=كلمة_المستوى_الثاني 3=كلمة_المستوى_الثالث
# ثم أعد رفع الموقع. لا تضع كلمات المرور الصريحة داخل مجلد الموقع.
import sys,json,hashlib,re,os
def norm(p):
    p=p.strip().translate({0x660+i:ord('0')+i for i in range(10)})
    return p.lower()
cur={}
if os.path.exists('passwords.js'):
    m=re.search(r'\{.*\}',open('passwords.js',encoding='utf-8').read())
    if m: cur=json.loads(m.group(0))
for a in sys.argv[1:]:
    l,p=a.split('=',1)
    cur[l]=hashlib.sha256(('mawhiba|L%s|%s'%(l,norm(p))).encode('utf-8')).hexdigest()
open('passwords.js','w',encoding='utf-8').write('window.NSMO_PW='+json.dumps(cur)+';')
print('تم تحديث المستويات:',', '.join(sorted(cur)))
