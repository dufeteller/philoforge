"use strict";
const axioms=[
{id:"causality@1",title:"Universal causality",statement:"Every event has at least one cause.",group:"causal"},
{id:"determinism@1",title:"Deterministic evolution",statement:"A complete state and the laws of evolution determine a unique future state.",group:"causal"},
{id:"agency@1",title:"Alternative possibilities",statement:"At least one agent has more than one possible action in a given situation.",group:"agency"},
{id:"responsibility@1",title:"Responsibility requires agency",statement:"An agent can be responsible for an action only if the agent has the relevant capacity to choose.",group:"agency"}
];
axioms.push(
{id:"events@1",title:"At least one event exists",statement:"There exists at least one event.",group:"causal"},
{id:"actions-events@1",title:"Possible actions are events",statement:"The possible actions in the agency axiom are events covered by universal causality. This explicitly extends the event vocabulary to those possibilities.",group:"bridge"},
{id:"no-alternatives@1",title:"No alternative actions",statement:"No agent in any situation has more than one possible action, using the same meaning of possible action as the agency axiom.",group:"restriction"}
);
const storageKey="philoforge.universe.v1";
const library=document.querySelector("#axioms");
for(const a of axioms){const label=document.createElement("label");label.className="axiom";const check=document.createElement("input");check.type="checkbox";check.value=a.id;const body=document.createElement("div");const id=document.createElement("span");id.className="id";id.textContent=a.id.toUpperCase();const title=document.createElement("strong");title.textContent=a.title;const text=document.createElement("p");text.textContent=a.statement;body.append(id,title,text);label.append(check,body);library.append(label);check.addEventListener("change",render);}
const boxes=[...library.querySelectorAll("input")];
const name=document.querySelector("#universe-name");
const feedback=document.querySelector("#feedback");
function selected(){return axioms.filter(a=>boxes.find(b=>b.value===a.id).checked);}
function render(){const list=document.querySelector("#selected");list.replaceChildren();for(const a of selected()){const li=document.createElement("li");li.textContent=a.title;list.append(li);}document.querySelector("#count").textContent=selected().length;document.querySelector("#selection-empty").hidden=selected().length>0;document.querySelector("#export").disabled=selected().length===0;feedback.textContent="";renderConsequences();PhiloI18n.apply();}
function universe(){return {schema_version:1,display_language:PhiloI18n.language,content_language:"en",name:name.value.trim()||"Untitled universe",axioms:selected().map(a=>({id:a.id,statement:a.statement})),logic:null,formalization:null,verification:"explicit_rules_not_lean",analysis:PhiloConsequences.derive(selected().map(a=>a.id)),note:"Philosophical sketches only. No Lean verification has been performed."};}
document.querySelectorAll("[data-preset]").forEach(button=>button.addEventListener("click",()=>{for(const b of boxes){const a=axioms.find(a=>a.id===b.value);b.checked=(button.dataset.preset==="all"&&["causal","agency"].includes(a.group))||a.group===button.dataset.preset;}render();}));
document.querySelector("#save").addEventListener("click",()=>{try{localStorage.setItem(storageKey,JSON.stringify(universe()));feedback.textContent=PhiloI18n.t("Saved in this browser.");}catch{feedback.textContent=PhiloI18n.t("Browser storage is unavailable. Download JSON to keep your universe.");}});
document.querySelector("#export").addEventListener("click",()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(universe(),null,2)+"\n"],{type:"application/json"}));const link=document.createElement("a");link.href=url;link.download="philoforge-universe.json";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);feedback.textContent=PhiloI18n.t("Universe downloaded.");});
function renderConsequences(){
 const result=PhiloConsequences.derive(selected().map(a=>a.id));
 const panel=document.querySelector("#consequences-list");panel.replaceChildren();panel.classList.remove("contradiction-view");
 document.querySelector("#analysis-summary").textContent=selected().length===0?"Select axioms to explore their consequences.":`${result.consequences.length} consequences · ${result.tensions.length} explicit conflicts`;
 const conflict=PhiloConflicts.detect(selected().map(a=>a.id),'alternatives');
 if(conflict){
  document.querySelector("#analysis-summary").textContent="Known contradiction: inspect the proof below.";
  PhiloConflicts.render(panel,conflict,axioms,id=>{boxes.find(box=>box.value===id).checked=false;render();});
  document.querySelector("#analysis-questions").replaceChildren();return;
 }
 for(const [kind,items] of [["Consequence",result.consequences],["Conflict",result.tensions]])for(const item of items){
  const article=document.createElement("article");article.className="deduction"+(kind==="Conflict"?" conflict":"");
  const badge=document.createElement("div");badge.className="eyebrow";badge.textContent=kind;
  const heading=document.createElement("h3");heading.textContent=item.title;
  const text=document.createElement("p");text.textContent=item.statement;
  const deps=document.createElement("p");deps.className="dependencies";deps.textContent="Depends on: "+item.requires.map(id=>axioms.find(a=>a.id===id).title).join(" + ");
  const detail=document.createElement("details");const summary=document.createElement("summary");summary.textContent="Why does this follow?";detail.append(summary);
  const steps=document.createElement("ol");for(const step of item.steps){const li=document.createElement("li");li.textContent=step;steps.append(li);}const method=document.createElement("p");method.textContent=item.method;detail.append(steps,method);article.append(badge,heading,text,deps,detail);panel.append(article);
 }
 if(selected().length&&!result.consequences.length&&!result.tensions.length){const p=document.createElement("p");p.textContent="No additional consequence is covered by the current rule library for this selection. This is not a proof that none exist.";panel.append(p);}
 const questions=document.querySelector("#analysis-questions");questions.replaceChildren();for(const question of result.questions){const li=document.createElement("li");li.textContent=question;questions.append(li);}
}
render();try{const saved=JSON.parse(localStorage.getItem(storageKey));if(saved&&saved.schema_version===1&&typeof saved.name==="string"&&Array.isArray(saved.axioms)){name.value=saved.name.slice(0,100);const ids=saved.axioms.filter(a=>a&&typeof a.id==="string").map(a=>a.id);boxes.forEach(b=>b.checked=ids.includes(b.value));render();}}catch{feedback.textContent=PhiloI18n.t("Saved data could not be loaded. You can start a new universe.");}
