/* Explicit rules over philosophical sketches, not a general theorem prover. */
(function (root) {
  const rules = [
    {id:'causes-exist', requires:['causality@1','events@1'], title:'At least one cause exists', statement:'There is an entity that causes an event.', steps:['The event-existence axiom supplies an event e.','Universal causality gives a cause c for that event.','Therefore at least one cause exists.'], method:'Existential instantiation and introduction'},
    {id:'unique-future', requires:['determinism@1'], title:'No two futures for the same complete state and laws', statement:'Two different future states cannot both be the determined successor of the same complete state under the same laws.', steps:['Deterministic evolution requires a unique future state.','Two distinct successors for the same state and laws would violate uniqueness.'], method:'Unpacking uniqueness'},
    {id:'agency-exists', requires:['agency@1'], title:'At least one agent exists', statement:'The universe contains at least one agent and a situation with alternative possible actions.', steps:['Alternative possibilities asserts the existence of such an agent and situation.','Dropping the additional property preserves the existence of the agent.'], method:'Existential weakening'},
    {id:'no-choice-no-responsibility', requires:['responsibility@1'], title:'Without the relevant capacity to choose, no responsibility', statement:'If an agent lacks the relevant capacity to choose for an action, that agent cannot be responsible for that action.', steps:['Responsibility implies the relevant capacity to choose.','Assume that capacity is absent.','Responsibility would imply the absent capacity, so responsibility is excluded.'], method:'Contraposition in classical logic'},
    {id:'causal-agent', requires:['causality@1','agency@1','actions-events@1'], title:'The alternative actions have causes', statement:'Each alternative action supplied by the agency axiom has a cause when it is treated as an event.', steps:['Agency supplies alternative possible actions.','The bridge axiom treats those possible actions as events in the scope of universal causality.','Universal causality then assigns each such action at least one cause.'], method:'Universal instantiation with an explicit vocabulary bridge'}
  ];
  function derive(ids) {
    const selected = new Set(ids);
    const consequences = rules.filter(r=>r.requires.every(id=>selected.has(id)));
    const tensions=[];
    if(selected.has('agency@1')&&selected.has('no-alternatives@1')) tensions.push({id:'alternatives-conflict',requires:['agency@1','no-alternatives@1'],title:'Incompatible assumptions about alternatives',statement:'One axiom supplies an agent with alternative actions; the other excludes alternatives for every agent and situation.',steps:['Agency states that some agent in some situation has alternative actions.','No alternatives states that no agent in any situation has alternative actions.','These statements cannot both hold with the same meaning of agent, situation, and possible action.'],method:'Existential assertion versus universal negation'});
    const questions=[];
    if(selected.has('causality@1')&&!selected.has('events@1'))questions.push('Universal causality alone does not imply that an event or a cause exists. Add “At least one event exists” to derive existence.');
    if(selected.has('determinism@1')&&selected.has('agency@1'))questions.push('Determinism and alternative possibilities are not automatically contradictory here. Their compatibility depends on what “possible” means and whether alternatives share the same complete state and laws.');
    if(selected.has('responsibility@1'))questions.push('Requiring agency for responsibility does not establish that anyone is responsible, or that everyone with agency is responsible.');
    return {consequences,tensions,questions,verification:'explicit_rules_not_lean',logic:'Classical reasoning over stated sketches; shared vocabulary is required.'};
  }
  root.PhiloConsequences={derive,rules};
  if(typeof module==='object'&&module.exports)module.exports=root.PhiloConsequences;
})(typeof globalThis==='object'?globalThis:this);
