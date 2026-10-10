const assert=require('node:assert/strict');
const corpus=require('../dist/data/ethics.json');
const translations=require('../dist/data/ethics-fr.json');
const ids=new Set(corpus.items.map(i=>i.id));
assert.equal(ids.size,corpus.items.length);
for(const [part,count] of [[1,36],[2,49],[3,59],[4,73],[5,42]]){
 const propositions=corpus.items.filter(i=>i.part===part&&i.kind==='Proposition');
 assert.deepEqual(propositions.map(i=>i.number),Array.from({length:count},(_,i)=>i+1));
 for(const p of propositions)assert.ok(p.statement.length&&p.source.endsWith(`#chap0${part}`));
}
assert.equal(corpus.items.filter(i=>i.kind==='Proposition').length,259);
assert.equal(corpus.items.filter(i=>i.kind==='Lemma').length,7);
assert.equal(corpus.items.filter(i=>i.kind==='Definition of an emotion').length,48);
assert.equal(corpus.items.filter(i=>i.kind==='Postulate').length,8);
assert.deepEqual(corpus.items.filter(i=>i.status==='lean-checked').map(i=>i.id),['E1-P1','E1-P3','E1-P5','E1-P6','E1-P7','E1-P8','E1-P9','E1-P10']);
assert.ok(corpus.items.find(i=>i.id==='E1-P6').formalScope.includes('historical')); // no claim of reproducing its historical proof
for(const item of corpus.items){
 assert.ok(['source-only','lean-checked','encoded-premise'].includes(item.status));
 if(item.status==='lean-checked')assert.ok(item.theorem&&item.formalScope);
 if(item.translations?.fr)assert.deepEqual(item.translations.fr,translations[item.id]);
 assert.ok(!item.paragraphs.some(p=>p.startsWith('End of the Ethics')));
}
for(const id of Object.keys(translations))assert.ok(ids.has(id));
assert.equal(corpus.items.find(i=>i.id==='E2-P1').translations,undefined); // no fallback invented in French
assert.ok(corpus.items.find(i=>i.id==='E5-P42').paragraphs.some(p=>p.includes('excellent')));
console.log('Complete numbering, supporting texts, source scope and optional translations checked.');
