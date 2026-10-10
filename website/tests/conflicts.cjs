const assert=require('node:assert/strict');
const {detect,proofs}=require('../dist/assets/conflicts.js');
assert.equal(detect(['transitivity','completeness'],'preference'),null);
assert.equal(detect(['cycle'],'preference'),null);
assert.equal(detect(['transitivity','cycle'],'preference').theorem,'transitivity_cycle_conflict');
assert.equal(detect(['agency@1'],'alternatives'),null);
assert.equal(detect(['agency@1','no-alternatives@1','causality@1'],'alternatives').axioms.length,2);
for(const [kind,p] of Object.entries(proofs))for(const id of p.axioms)assert.equal(detect(p.axioms.filter(a=>a!==id),kind),null);
console.log('Conflict dependency and axiom-removal checks passed.');
