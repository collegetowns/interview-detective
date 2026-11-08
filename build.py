import base64,os,json
SYN=json.dumps(open('src/synonyms.txt').read())
t=open('src/student-template-src.html').read()
t=t.replace('/*__SYNONYMS__*/""',SYN)
t=t.replace('/*CSS*/',open('src/student-base.css.html').read().replace('.notebook{padding:22px 22px 24px;position:sticky;top:16px}','.notebook{padding:22px 22px 24px}'))
for a,b in [('.status{font-family','.st{font-family'),('.status.m','.st.m'),('.status.p','.st.p'),('.status.x','.st.x'),('.status.w','.st.w')]: t=t.replace(a,b)
assert '/*__CONFIG__*/null' in t and 'img/e' not in t


b=open('src/builder-src.html').read().replace('/*__SYNONYMS__*/""',SYN).replace('/*__TEMPLATE__*/','const TEMPLATE_B64="'+base64.b64encode(t.encode()).decode()+'";')
open('index.html','w').write(b)
print(len(t)//1024,'KB template;',len(b)//1024,'KB builder')
