const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { derive, cleanSelection, conflicts, simulate } = require('../dist/assets/ai-justice.js');
const data = require('../dist/data/ai-justice.json');
require('../dist/assets/locales.js');
const {canDisplay} = require('../dist/assets/i18n.js');
const all = data.premises.map(p=>p.id);
assert.equal(data.premises.filter(p=>p.kind==='principle').length,3);
assert.equal(data.premises.filter(p=>p.kind==='definition').length,8);
assert.ok(data.defaultSelection.includes('J3'));
assert.ok(!data.defaultSelection.includes('J2'),'Maximin must remain optional');
const core=derive(data,data.defaultSelection);
assert.equal(core.find(r=>r.id==='sufficiency-exclusion').available,true);
assert.equal(core.find(r=>r.id==='needs-from-justice').available,false);
assert.equal(core.find(r=>r.id==='unjust-exclusion').available,false);
assert.equal(core.find(r=>r.id==='unique-justice').available,false);
for(const result of data.results){
  assert.equal(derive(data,all).find(r=>r.id===result.id).available,true);
  for(const premise of result.requires){
    assert.equal(derive(data,all.filter(id=>id!==premise)).find(r=>r.id===result.id).available,false,`${result.id} requires ${premise}`);
  }
  assert.ok(result.proof.code.startsWith('theorem '+result.leanName.split('.').pop()+' '));
  for(const text of [result.title,result.text,result.limit,...result.steps])assert.ok(canDisplay(text,'fr'),text);
}
for(const p of data.premises)for(const text of [p.title,p.text])assert.ok(canDisplay(text,'fr'),text);
assert.deepEqual(cleanSelection(data,['J1','unknown','J1']),['J1']);
assert.deepEqual(cleanSelection(data,null),data.defaultSelection);
assert.deepEqual(cleanSelection(data,[]),[]);
assert.equal(conflicts(data,['H3','H9']).length,1);
assert.equal(conflicts(data,['H3']).length,0);
assert.equal(conflicts(data,['H9']).length,0);
assert.equal(conflicts(data,data.defaultSelection).length,0);
for(const conflict of data.conflicts)for(const text of [conflict.title,conflict.text,conflict.limit,...conflict.steps])assert.ok(canDisplay(text,'fr'),text);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const original=simulate();
assert.equal(original.losers,90);assert.equal(original.deprived,90);assert.equal(original.improved,90);
close(original.groups[0].before,.8);close(original.groups[0].after,.1);close(original.groups[1].after,19.1);
const repaired=simulate({sharing:100*13/38});
close(repaired.groups[0].after,.75);assert.equal(repaired.deprived,0);
assert.equal(simulate({collective:0}).commonDeprived,100);
assert.equal(simulate({owners:100}).groups.length,1);
assert.equal(simulate({owners:100}).losers,0);
assert.equal(simulate({sharing:100}).deprived,0);
assert.throws(()=>simulate({owners:0}),RangeError);
assert.throws(()=>simulate({labor:NaN}),RangeError);
for(const output of [50,75,100,200,400])for(const labor of [0,5,50,100])for(const owners of [1,10,50,100])for(const sharing of [0,25,100])for(const collective of [0,50,100,150]){
  const s=simulate({output,labor,owners,sharing,collective});
  close(s.groups.reduce((sum,g)=>sum+g.count*g.after,0),output);
  close(s.groups.reduce((sum,g)=>sum+g.count*g.before,0),100);
  close(s.groups.reduce((sum,g)=>sum+g.count*g.common,0),s.collectiveOutput);
  assert.ok(s.score>=0);
  const nonowner=s.groups.find(g=>g.id==='nonowners');
  if(nonowner)assert.equal(nonowner.common>nonowner.after+1e-9,collective/100>s.threshold+1e-9);
}
for(const section of data.foundation)for(const key of ['title','text'])assert.ok(canDisplay(section[key],'fr'));
assert.equal(new Set(data.foundation.map(s=>s.id)).size,data.foundation.length);
for(const item of data.coverage){
 assert.ok(data.foundation.some(s=>s.id===item.section));
 for(const key of ['title','status','text'])assert.ok(canDisplay(item[key],'fr'));
 for(const id of item.results)assert.ok(data.results.some(r=>r.id===id),'Unknown coverage link '+id);
}
const history=data.coverage.find(item=>item.section==='intelligence');
assert.ok(history);assert.deepEqual(history.results,[],'Historical framing is not a Lean theorem');
assert.ok(!/OpenAI|ChatGPT|mathematical progress/i.test(JSON.stringify(data.foundation)));
const html=fs.readFileSync(path.join(__dirname,'../dist/philoforge/ai-justice/index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length);
for(const id of ['justice-definitions','justice-foundation-text','justice-coverage','justice-select-all','justice-principles','justice-hypotheses','justice-results','sim-output','sim-sharing','justice-sim-body'])assert.ok(ids.includes(id));
for(const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]+)(?:[?#][^"]*)?"/g)){
  let target=path.join(__dirname,'../dist',match[1]);if(target.endsWith('/'))target+='index.html';
  assert.ok(fs.existsSync(target),target);
}
console.log('AI justice: premise dependencies and conflict, bilingual results, exact example, redistribution boundary, 960 distribution scenarios and local links checked.');
