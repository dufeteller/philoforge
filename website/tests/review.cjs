const assert=require('node:assert/strict'),fs=require('node:fs');
const review=require('../dist/data/spinoza-review.json');
const sources=require('../dist/data/spinoza-sources.json');
const corpus=require('../dist/data/ethics.json');
const {results,entries}=require('../dist/assets/spinoza.js');
require('../dist/assets/locales.js');const {canDisplay}=require('../dist/assets/i18n.js');
for(const r of review.items){
 const result=results.find(x=>x.id===r.id);assert.ok(result);
 assert.equal(r.reviewStatus,'not-reviewed');assert.equal(r.formalStatement,result.text);
 assert.deepEqual(r.premises.map(p=>p.id),result.requires);
 for(const id of r.sourceIds)assert.ok(sources.passages[id]?.latin.length);
 for(const field of ['title','formalStatement','local','limit'])assert.ok(canDisplay(r[field],'fr'),r.id+' '+field);
 assert.ok(r.exactLean.startsWith('theorem '+result.theorem+' '));
 assert.match(r.proofUrl,/#L\d+$/);
 if(r.sourceStatement)assert.ok(r.sourceStatement.fr);
}
for(const r of review.items.filter(r=>['E1-P5','E1-P7','E1-P8'].includes(r.id)))assert.ok(r.proofUrl.includes('/SpinozaOntology.lean#L'));
for(const r of review.items.filter(r=>['attribute-inclusion','E1-P9','E1-P10'].includes(r.id)))assert.ok(r.proofUrl.includes('/SpinozaAttributes.lean#L'));
assert.equal(review.items.length,results.length);
for(const item of corpus.items.filter(i=>i.status==='lean-checked'))assert.ok(review.items.some(r=>r.id===item.id));
for(const entry of entries)assert.ok(sources.passages[entry.id]);
const source=fs.readFileSync('website/dist/assets/ethics.js','utf8');
assert.ok(source.includes('proof.href=record.proofUrl'));
assert.ok(!source.includes("proof.href='https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Spinoza.lean'"));
console.log('Exact dossier coverage, explicit review status, proof destinations and optional French dossiers checked.');

for(const result of results.filter(r=>r.leanName.includes('.Distinctions.'))){
 const dossier=review.items.find(r=>r.id===result.id);
 assert.ok(dossier.proofUrl.includes('/SpinozaDistinctions.lean#L'));
 if(result.propositionId){
  const item=corpus.items.find(i=>i.id===result.propositionId);
  assert.equal(dossier.sourceStatement.en,item.statement);
  assert.equal(dossier.sourceStatement.fr,item.translations.fr.statement);
 }
}
for(const id of ['universal-substance-unique','everything-in-universal-substance']){
 const dossier=review.items.find(r=>r.id===id);
 assert.equal(dossier.sourceStatement,null);
 assert.ok(dossier.local.includes('substance'));
 assert.ok(dossier.limit.includes('not'));
}
