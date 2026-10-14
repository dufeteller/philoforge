const assert=require('node:assert/strict');
const spinoza=require('../dist/assets/spinoza.js');
const justice=require('../archive/ai-justice/data/ai-justice.json');
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
// Exhaust the original AI vocabulary for backwards compatibility, then every
// new theorem's own premise subsets. Avoid an exponential pass over unrelated
// definitions while checking both isolated and mixed-theory derivations.
let scenarios=0;
function checkSelection(selected){
 const data=api.derive(registry,selected);
 const expected=selected.includes('justice:model')?justice.results.filter(r=>r.requires.every(id=>selected.includes('justice:'+id))):[];
 assert.deepEqual(data.results.map(r=>r.localId),data.conflicts.length?[]:expected.map(r=>r.id));
 const mixed=api.derive(registry,[...selected,...registry.theories[0].ids]);
 if(data.conflicts.length)assert.equal(mixed.results.length,0);
 else assert.deepEqual(sorted(mixed.results.map(r=>r.id)),sorted([...data.results.map(r=>r.id),...spinoza.results.map(r=>'spinoza:'+r.id)]));
 scenarios++;
}
const legacy=['model','J1','J2',...Array.from({length:9},(_,i)=>'H'+(i+1))].map(id=>'justice:'+id);
for(let bits=0;bits<2**legacy.length;bits++)checkSelection(legacy.filter((id,i)=>bits&(1<<i)));
for(const result of registry.results.filter(r=>r.theory==='justice')){
 for(let bits=0;bits<2**result.requires.length;bits++)checkSelection(result.requires.filter((id,i)=>bits&(1<<i)));
}
const every=registry.entries.filter(e=>e.theory==='justice').map(e=>e.id);
checkSelection(every);
for(const omitted of every)checkSelection(every.filter(id=>id!==omitted));
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

// Public registry excludes the archived theory, including old saved/shared selections.
const publicRegistry=api.createRegistry(spinoza);
assert.deepEqual(publicRegistry.theories.map(t=>t.id),['spinoza']);
assert.ok(publicRegistry.entries.every(e=>e.theory==='spinoza'));
assert.equal(publicRegistry.results.length,spinoza.results.length);
assert.deepEqual(api.fromQuery(publicRegistry,new URLSearchParams('premises=justice:model,justice:J1,spinoza:E1-A4')),['spinoza:E1-A4']);
assert.deepEqual(api.restore(publicRegistry,storage({'philoforge.universe.v1':'["justice:model","justice:J1","spinoza:E1-A4"]'}),new URLSearchParams()),['spinoza:E1-A4']);
