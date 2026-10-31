طريقة إضافة الأسئلة / How to add questions
==========================================
Each exam = one file in data/ named l{level}-{lang}-{n}.js  (e.g. data/l2-ar-3.js = Level 2, Arabic, exam 3).
Format:
window.EXAM={"id":3,"title":"...","level":"...","minutes":60,"questions":[
 {"q":"question text","img":"img/q1.png","opts":["A","B","img:img/q1-b.png","D"],"ans":1,"sol":"optional explanation"}
]};
- "img" (optional): an image shown under the question (put the file in an img/ folder).
- an option starting with "img:" is shown as an image.
- "ans" is the index of the correct option (0 = first).
- A missing file shows "This exam is being prepared".
Only add questions you own or are licensed to publish.
gen.py created the original practice questions; build.py creates the pages. Re-running gen.py overwrites data/*.js.
Deploy: drag the folder to Netlify (registrations and results are collected by Netlify Forms).
Grades: Primary 3-5 -> Level 1; Primary 6, Intermediate 1-2 -> Level 2; Intermediate 3, Secondary 1 -> Level 3. Each level has 3 exams per language.

Image position fields (optional, per question): "ipos": above|below|left|right ; "ialign": start|center|end (for above/below).
An option can be a plain string, "img:path", or {"t":"text","img":"img/x.jpg"}.
Easiest way to create exams: use exam-editor.html (kept outside the site folder), then copy the exported data/ and img/ folders here.
Solution image: optional "solimg":"img/x.jpg" next to "sol" (text).
