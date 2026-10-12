const assert=require('node:assert/strict');
const spinoza=require('../dist/assets/spinoza.js');
const justice=require('../dist/data/ai-justice.json');
const api=require('../dist/assets/theories.js');
const registry=api.createRegistry(spinoza,justice);
const ids=registry.theories.flatMap(t=>t.ids);
assert.equal(new Set([...registry.entries,...registry.results].map(e=>e.id)).size,registry.entries.length+registry.results.length);
assert.deepEqual(registry.theories.map(t=>t.id),['spinoza','justice']);
assert.equal(registry.bridges.length,0,'Do not imply a cross-theory theorem without a registered Lean proof');
assert.equal(api.derive(registry,ids).conflicts.length,0,'Both complete theories must be selectable together');
const sorted=values=>[...values].sort();
for(const result of registry.results){
 assert.equal(result.id,`${result.theory}:${result.localId}`);
 const leaves=new Set(),path=new Set();
 function visit(id){
  assert.ok(!path.has(id),'Dependency cycle: '+id);path.add(id);
  const node=registry.nodes.get(id);assert.ok(node,'Unknown node '+id);
  assert.equal(node.theory,result.theory,'No implicit cross-theory dependency');
  if(node.parents)node.parents.forEach(visit);else leaves.add(id);
  path.delete(id);
 }
 result.parents.forEach(visit);
 assert.deepEqual(sorted(leaves),sorted(result.requires),result.id+' exact visible proof premises');
 assert.equal(result.level,1+Math.max(...result.parents.map(id=>registry.nodes.get(id).level||0)));
 assert.ok(api.derive(registry,result.requires).results.some(r=>r.id===result.id));
 for(const omitted of result.requires)assert.ok(!api.derive(registry,result.requires.filter(id=>id!==omitted)).results.some(r=>r.id===result.id));
 if(result.theory==='justice')assert.ok(result.requires.includes('justice:model'));
}
// Exhaust every AI selection and compare isolated/mixed derivation. Spinoza's
// own exhaustive-per-theorem suite covers its larger starting-point registry.
let scenarios=0;
for(let bits=0;bits<2**(justice.premises.length+1);bits++){
 const selected=['justice:model',...justice.premises.map(p=>'justice:'+p.id)].filter((id,i)=>bits&(1<<i));
 const data=api.derive(registry,selected);
 const expected=selected.includes('justice:model')?justice.results.filter(r=>r.requires.every(id=>selected.includes('justice:'+id))):[];
 assert.deepEqual(data.results.map(r=>r.localId),data.conflicts.length?[]:expected.map(r=>r.id));
 const mixed=api.derive(registry,[...selected,...registry.theories[0].ids]);
 if(data.conflicts.length)assert.equal(mixed.results.length,0);
 else assert.deepEqual(sorted(mixed.results.map(r=>r.id)),sorted([...data.results.map(r=>r.id),...spinoza.results.map(r=>'spinoza:'+r.id)]));
 scenarios++;
}
for(const result of spinoza.results){
 const selected=result.requires;
 assert.deepEqual(api.derive(registry,selected.map(id=>'spinoza:'+id)).results.map(r=>r.localId),spinoza.derive(selected).results.map(r=>r.id));
}
const tests=registry.entries.filter(e=>e.test).map(e=>e.id);
const contradictory=api.derive(registry,[...ids,...tests]);
assert.equal(contradictory.conflicts.length,2);assert.equal(contradictory.results.length,0);
assert.equal(api.derive(registry,ids.filter(id=>id!=='justice:model')).results.filter(r=>r.theory==='justice').length,0);
const storage=values=>({getItem:key=>values[key]??null});
const query=new URLSearchParams();
assert.deepEqual(api.restore(registry,storage({}),query),[]);
assert.deepEqual(api.restore(registry,storage({[api.KEY]:'[]','philoforge.spinoza.v1':'["E1-A4"]'}),query),[],'Saved empty selection wins');
assert.deepEqual(api.restore(registry,storage({'philoforge.spinoza.v1':'["E1-A4"]','philoforge.ai-justice.v1':'["J1"]'}),query),['spinoza:E1-A4','justice:model','justice:J1']);
assert.deepEqual(api.restore(registry,storage({[api.KEY]:'broken'}),query),[]);
const url=new URL(api.mapURL(registry,[...ids,ids[0],'bogus'], 'https://example.com','fr'));
assert.equal(url.pathname,'/philoforge/map/');assert.equal(url.searchParams.get('lang'),'fr');
assert.deepEqual(api.fromQuery(registry,url.searchParams),api.sanitize(registry,ids));
assert.deepEqual(api.fromQuery(registry,new URLSearchParams('axioms=E1-A4,E1-A5,bogus')),['spinoza:E1-A4','spinoza:E1-A5']);
assert.deepEqual(api.restore(registry,storage({[api.KEY]:JSON.stringify(ids)}),new URLSearchParams('premises=')),[],'Explicit empty URL wins over saved state');
assert.deepEqual(api.fromQuery(registry,new URLSearchParams('premises=justice:E1-A4,spinoza:J1')),[],'Unrelated vocabularies cannot substitute for one another');
require('../dist/assets/locales.js');const {canDisplay}=require('../dist/assets/i18n.js');
for(const node of [...registry.entries,...registry.results,...registry.conflicts])for(const key of ['title','text','reference','type','mapping','limit'])if(node[key])assert.ok(canDisplay(node[key],'fr'),node.id+' untranslated '+key);
console.log(`${registry.results.length} namespaced proofs, ${scenarios} mixed selections, exact ancestry, conflicts and persistence checked.`);
