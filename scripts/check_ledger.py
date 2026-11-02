"""Validate receipt structure; never sends anything or claims remote delivery."""
import argparse,json
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__);p.add_argument('file');a=p.parse_args()
source=Path(a.file);data=json.loads(source.read_text());seen=set();errors=[]
allowed={'not_started','submitted','verified','waiting','blocked','unknown'}
for j in data['jobs']:
 key=j.get('key')
 if not key or key in seen: errors.append('Missing or duplicate key')
 seen.add(key)
 for field in ('application','message','attachment'):
  state=j.get(field,{})
  if state.get('status') not in allowed: errors.append(f'{key}: invalid {field} status')
  if state.get('status')=='verified':
   evidence=state.get('evidence',[])
   if not state.get('checked_at') or not isinstance(evidence,list) or not evidence: errors.append(f'{key}: verified {field} lacks receipt')
   else:
    for f in evidence:
     if not isinstance(f,str) or not (source.parent/f).is_file(): errors.append(f'{key}: missing evidence file')
print(json.dumps({'ok':not errors,'jobs':len(data['jobs']),'errors':errors,'remote_delivery_verified_by_this_tool':False},ensure_ascii=False))
raise SystemExit(bool(errors))
