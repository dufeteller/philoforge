// Derive exact displayed Lean signatures and links from the actual declarations.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const {entries,results}=require('../website/dist/assets/spinoza.js');
const notes=require('../docs/spinoza-review-notes.json');
const sources=require('../website/dist/data/spinoza-sources.json');
const corpus=require('../website/dist/data/ethics.json');
assert.deepEqual(Object.keys(notes).sort(),results.map(r=>r.id).sort());
const modules={Spinoza:'logic/PhiloForge/Spinoza.lean',Affects:'logic/PhiloForge/SpinozaAffects.lean',Ontology:'logic/PhiloForge/SpinozaOntology.lean',Attributes:'logic/PhiloForge/SpinozaAttributes.lean',Distinctions:'logic/PhiloForge/SpinozaDistinctions.lean'};
const items=results.map(result=>{
 const note=notes[result.id];assert.equal(note.reviewStatus,'not-reviewed');
 for(const id of note.sourceIds)assert.ok(sources.passages[id],`Missing Latin source: ${id}`);
 const module=result.leanName.split('.').length===4?result.leanName.split('.')[2]:'Spinoza';
 const file=modules[module],content=fs.readFileSync(path.join(root,file),'utf8');
 const marker='theorem '+result.theorem+' ',start=content.indexOf(marker);assert.ok(start>=0,result.id);
 const end=content.indexOf(':=',start);assert.ok(end>start);const signature=content.slice(start,end).trim();
 const line=content.slice(0,start).split('\n').length;
 const item=corpus.items.find(i=>i.id===(result.propositionId||result.id));
 if(item?.status==='lean-checked'&&!result.propositionId)assert.equal(item.theorem,result.leanName);
 return {...note,id:result.id,title:result.title,formalStatement:result.text,exactLean:signature,leanName:result.leanName,
  proofUrl:`https://github.com/dufeteller/philoforge/blob/main/${file}#L${line}`,
  sourceStatement:item?{en:item.statement,fr:item.translations?.fr?.statement||null}:null,
  premises:result.requires.map(id=>{const e=entries.find(e=>e.id===id);assert.ok(e);return {id,title:e.title,type:e.type,interpretation:e.mapping};})};
});
const generated=JSON.stringify({reviewPolicy:'Compilation does not certify historical fidelity. Independent philosophical review is pending.',items},null,2)+'\n';
const target=path.join(root,'website/dist/data/spinoza-review.json');
if(process.argv.includes('--write'))fs.writeFileSync(target,generated);
else assert.equal(fs.readFileSync(target,'utf8'),generated,'Regenerate the source/formalization dossier');
console.log(`${items.length} exact theorem signatures, source sets and proof links checked; independent review pending.`);
