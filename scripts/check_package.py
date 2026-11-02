"""Offline publication hygiene checks. Not a complete secrets detector."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
excluded={'.git','private','output','node_modules','__pycache__'}
patterns={
 'home_path':r'/(?:Users|home)/[A-Za-z][^\s/]+/',
 'private_key':r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
 'github_token':r'gh[pousr]_[A-Za-z0-9]{25,}',
 'api_token':r'\bsk-[A-Za-z0-9_-]{20,}',
 'phone':r'(?<!\d)1[3-9]\d{9}(?!\d)',
 'email':r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b',
}
issues=[];files=[]
for p in ROOT.rglob('*'):
 if not p.is_file() or any(s in excluded for s in p.relative_to(ROOT).parts):continue
 files.append(str(p.relative_to(ROOT)))
 if p.suffix.lower() in {'.png','.jpg','.jpeg','.mov','.mp4','.pdf','.sqlite','.db','.zip'}:issues.append({'file':files[-1],'type':'unexpected_binary'});continue
 try:text=p.read_text()
 except UnicodeDecodeError:issues.append({'file':files[-1],'type':'binary'});continue
 if p.name=='check_package.py':continue # detector patterns are not secrets
 for name,pattern in patterns.items():
  if re.search(pattern,text):issues.append({'file':files[-1],'type':name})
print(json.dumps({'ok':not issues,'files':len(files),'issues':issues,'scope':'public text files only; ignored runtime data excluded; manual review still required'},ensure_ascii=False,indent=2))
raise SystemExit(bool(issues))
