const assert=require('node:assert/strict');
const {analyze,nodes}=require('../dist/assets/preferences.js');
for(let mask=0;mask<512;mask++){
 const m=Array.from({length:3},(_,a)=>Array.from({length:3},(_,b)=>!!(mask&(1<<(3*a+b)))));
 const result=analyze(m);
 if(result.transitive)assert.equal(result.cycle,false);
 if(result.complete)assert.ok(m.every((row,i)=>row[i]));
 if(result.transitive&&result.complete)assert.ok(result.greatest.length>0);
}
assert.equal(analyze([[1,1,0],[0,1,1],[1,0,1]]).cycle,true);
assert.equal(analyze([[1,0,0],[0,1,0],[0,0,1]]).complete,false);
assert.equal(new Set(nodes.map(n=>n.id)).size,nodes.length);
for(const n of nodes)for(const p of n.parents||[])assert.ok(nodes.some(parent=>parent.id===p&&parent.level<n.level));
console.log('All 512 three-option relations and deduction graph dependencies checked.');
