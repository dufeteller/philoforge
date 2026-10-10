(function(root){
 const source='https://www.gutenberg.org/cache/epub/919/pg919.html';
 const proofSource='https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Spinoza.lean';
 const entries=[
 {id:'E1-D3',type:'Definition',title:'Substance',text:'A substance is in itself and conceived through itself.',reference:'Ethics I, Definition III',original:'By substance I mean that which is in itself, and is conceived through itself.',mapping:'Formal convention: the causal fragment excludes dependence on distinct entities. The attribute fragment excludes external conceptual requirements. Both interpret the explanatory clause of Definition III; their vocabularies are not silently identified.'},
 {id:'E1-A4',type:'Axiom',title:'Knowledge of effect and cause',text:'Knowing an effect depends on knowing its cause.',reference:'Ethics I, Axiom IV',original:'The knowledge of an effect depends on and involves the knowledge of a cause.',mapping:'Formal convention: if c causes e, the conception of e depends on c. Only the direction needed by the selected proofs is encoded.'},
 {id:'E1-A5',type:'Axiom',title:'Nothing in common',text:'Things with nothing in common cannot be conceived through one another.',reference:'Ethics I, Axiom V',original:'Things which have nothing in common cannot be understood, the one by means of the other.',mapping:'Formal convention: absence of commonality excludes conceptual dependence in both directions.'}
 ];
 entries.push({id:'E1-D5',type:'Definition',title:'Modes of substance',text:'A mode exists in and is conceived through another entity.',reference:'Ethics I, Definition V',original:'By mode, I mean the modifications of substance, or that which exists in, and is conceived through, something other than itself.',mapping:'ModeOf m s means that m is distinct from s, is in s and depends conceptually on s. The qualitative modification profiles used in P4/P5 are a separate primitive relation; they are not automatically derived from ModeOf. Priority in P1 means asymmetric conceptual dependence.'});
 entries.push(
 {id:'E3-D1',type:'Definition',title:'Adequate and partial causes',text:'An adequate cause makes its effect understandable through itself alone; a partial cause does not.',reference:'Ethics III, Definition I',source:'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap03',original:'I call that an adequate cause, whose effect can be clearly and distinctly perceived through it.',mapping:'Formal convention: adequacy includes causation and intelligibility through this cause alone. Partial causation includes causation and excludes that intelligibility.'},
 {id:'E3-D2',type:'Definition',title:'Activity and passivity',text:'We act when we are the adequate cause of an event; we are passive when we are only a partial cause.',reference:'Ethics III, Definition II',source:'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap03',original:'I say that we act when anything takes place, either within us or externally to us, whereof we are the adequate cause.',mapping:'Formal convention: activity and passivity are relative to the same actor and event. This does not exclude a person being active in one respect and passive in another.'}
 );
 const results=[
 {id:'conceptual-separation',title:'No conceptual dependence',text:'If two things have nothing in common, neither is conceived through the other.',reference:'Intermediate step in Ethics I, Proposition III',requires:['E1-A5'],parents:['E1-A5'],level:1,theorem:'conceptual_separation',steps:['Assume x and y have nothing in common.','Apply Axiom V in both directions.','Neither conception depends on the other.']},
 {id:'E1-P3',title:'No causation without commonality',text:'Things with nothing in common cannot cause one another.',reference:'Ethics I, Proposition III',requires:['E1-A4','E1-A5'],parents:['E1-A4','conceptual-separation'],level:2,theorem:'proposition3',steps:['Axiom V excludes conceptual dependence between things with nothing in common.','Suppose one caused the other. Axiom IV would require conceptual dependence.','That contradicts the preceding step, so neither can cause the other.']},
 {id:'E1-P6-C',title:'No external cause of substance',text:'A substance cannot be produced by a cause external to itself, in the reconstructed causal vocabulary.',reference:'Ethics I, Proposition VI, Corollary — alternative demonstration',requires:['E1-D3','E1-A4'],parents:['E1-D3','E1-A4'],level:1,theorem:'external_cause_excluded',steps:['Definition III encodes conceptual independence from distinct entities.','An external cause would make the conception of the substance depend on that cause, by Axiom IV.','This contradicts the encoded independence. External causation is excluded.']}
 ];
 results.push(
 {id:'adequate-not-partial',title:'An adequate cause is not partial',text:'For the same effect, a cause cannot be both adequate and partial in this encoding.',reference:'Definitional consequence of Ethics III, Definition I',requires:['E3-D1'],parents:['E3-D1'],level:1,theorem:'adequate_not_partial',source:'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap03',proofSource:'https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAffects.lean',steps:['Adequacy asserts that this effect is understood through this cause alone.','Partial causation denies the same intelligibility.','These conditions cannot hold together for the same cause and effect.']},
 {id:'active-not-passive',title:'Activity excludes passivity for this event',text:'For one actor and one event, activity and passivity exclude one another in the reconstructed definitions.',reference:'Definitional consequence of Ethics III, Definitions I–II',requires:['E3-D1','E3-D2'],parents:['adequate-not-partial','E3-D2'],level:2,theorem:'active_not_passive',source:'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap03',proofSource:'https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAffects.lean',steps:['Activity means being the adequate cause of this event.','Passivity means being its partial cause.','The adequate-not-partial result excludes simultaneous activity and passivity for this event.']}
 );
 results.push(
 {id:'E1-P1',title:'Substance is prior to its modes',text:'A mode depends conceptually on its substance; the substance does not depend on that distinct mode. This reconstructs priority as asymmetric conceptual dependence.',reference:'Ethics I, Proposition I — conceptual reconstruction',requires:['E1-D3','E1-D5'],parents:['E1-D3','E1-D5'],level:1,theorem:'proposition1',steps:['Definition V supplies a mode conceived through a distinct substance.','Definition III excludes dependence of that substance on the distinct mode.','Conceptual dependence runs in one direction: this is the explicit interpretation of priority used here.']},
 {id:'E1-P6',title:'Distinct substances cannot cause each other',text:'In the causal encoding, neither of two distinct substances causes the other. This uses the corollary’s alternative argument, not Spinoza’s full historical proof of Proposition VI.',reference:'Ethics I, Proposition VI — causal reconstruction',requires:['E1-D3','E1-A4'],parents:['E1-P6-C','E1-D3'],level:2,theorem:'proposition6_causal',steps:['The external-cause result excludes a cause distinct from a substance.','Apply it to the first substance with the second as the proposed external cause.','Apply it in the reverse direction. Both causal relations are excluded.']}
 );

 entries.push(...[{"id": "E1-D1", "type": "Definition", "title": "Essential self-causation", "text": "Self-caused means that essence involves existence.", "reference": "Ethics I, Definition I", "original": "By that which is self-caused, I mean that of which the essence involves existence.", "mapping": "Essential self-causation is distinct from a thing causing itself in the causal relation. Actual existence is recorded separately.", "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01", "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaOntology.lean"}, {"id": "E1-D2", "type": "Definition", "title": "Finitude in its kind", "text": "A finite thing can be limited by another thing of the same nature.", "reference": "Ethics I, Definition II", "original": "A thing is called finite after its kind, when it can be limited by another thing of the same nature.", "mapping": "Limited reconstruction: a limiter is distinct and actually exists. Infinity in kind means absence of such a limiter; it is not cardinal infinity or modal necessity.", "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01", "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaOntology.lean"}, {"id": "E1-P8-S2-existence", "type": "Scholium principle", "title": "An explanation of existence", "text": "An existing thing has an explanation in its own nature or an external cause.", "reference": "Ethics I, Proposition VIII, Scholium II — principles 3–4", "original": "There is necessarily for each individual existent thing a cause why it should exist.", "mapping": "Additional selected premise from the scholium. The intrinsic explanation is interpreted as essence involving existence. This premise is not derived from the seven axioms.", "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01", "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaOntology.lean"}, {"id": "E1-P8-S2-multiplicity", "type": "Scholium principle", "title": "Multiplicity requires an external cause", "text": "Distinct existing individuals of the same nature require an external cause.", "reference": "Ethics I, Proposition VIII, Scholium II — multiplicity argument", "original": "Everything which may consist of several individuals must have an external cause.", "mapping": "Additional selected premise from the scholium, not a theorem proved here. It applies to same-nature individuals generally. The resulting Proposition V concerns same nature, not the sharing of just one attribute.", "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01", "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaOntology.lean"}, {"id": "E1-P8-limiter-bridge", "type": "Interpretive premise", "title": "A substance has a substance as limiter", "text": "A same-nature limiter of a substance is itself a substance.", "reference": "Interpretation of Ethics I, Proposition VIII — demonstration", "original": "It would then be limited by something else of the same kind, which would also necessarily exist.", "mapping": "Explicit interpretive bridge, not one of Spinoza’s numbered axioms. Same nature and the limiting relation do not imply this classification automatically.", "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01", "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaOntology.lean"}]);
 results.push(...[{"id": "E1-P5", "title": "Uniqueness within the same nature", "text": "Two existing substances of the same nature are identical, assuming the scholium’s multiplicity principle. This does not establish uniqueness from sharing only one attribute.", "reference": "Ethics I, Proposition V — alternative same-nature reconstruction", "requires": ["E1-D3", "E1-A4", "E1-P8-S2-multiplicity"], "parents": ["E1-D3", "E1-A4", "E1-P8-S2-multiplicity"], "level": 1, "theorem": "proposition5_same_nature", "steps": ["Suppose two existing substances of the same nature are distinct.", "The selected multiplicity principle supplies an external cause.", "Axiom IV and Definition III exclude that cause. The two substances cannot be distinct."], "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01", "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaOntology.lean"}, {"id": "E1-P7", "title": "Essential existence of an existing substance", "text": "An existing substance has essence involving existence, assuming the selected explanation principle. This does not prove that a substance exists.", "reference": "Ethics I, Proposition VII — conditional reconstruction", "requires": ["E1-D1", "E1-D3", "E1-A4", "E1-P8-S2-existence"], "parents": ["E1-P6-C", "E1-D1", "E1-P8-S2-existence"], "level": 2, "theorem": "proposition7_existing_substance", "steps": ["For an existing substance, the selected principle gives an intrinsic explanation or an external cause.", "The external-cause result excludes the second possibility.", "The intrinsic explanation is interpreted as essence involving existence, the sense of self-causation in Definition I."], "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01", "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaOntology.lean"}, {"id": "E1-P8", "title": "No same-nature limiter of substance", "text": "An existing substance has no distinct actual limiter of the same nature, under the selected multiplicity principle and limiter bridge. This is a limited sense of infinity, without modal necessity.", "reference": "Ethics I, Proposition VIII — limited infinity-in-kind reconstruction", "requires": ["E1-D2", "E1-D3", "E1-A4", "E1-P8-S2-multiplicity", "E1-P8-limiter-bridge"], "parents": ["E1-P5", "E1-D2", "E1-P8-limiter-bridge"], "level": 2, "theorem": "proposition8_no_limiter", "steps": ["Suppose a distinct actual thing of the same nature limits the substance.", "The selected bridge identifies that limiter as another substance.", "The same-nature uniqueness result identifies both substances, contradicting the distinctness required by Definition II."], "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01", "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaOntology.lean"}]);
 entries.push(...[
  {
    "id": "E1-D4",
    "type": "Definition",
    "title": "Attribute",
    "text": "An attribute is what the intellect perceives as constituting the essence of substance.",
    "reference": "Ethics I, Definition IV",
    "original": "By attribute, I mean that which the intellect perceives as constituting the essence of substance.",
    "mapping": "The aspect vocabulary distinguishes perception, essential aspects and conceptual requirements. The qualitative vocabulary uses attribute profiles. Definition IV alone does not identify these readings or supply their additional, separately selectable interpretations.",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAttributes.lean"
  },
  {
    "id": "E1-D4-representation",
    "type": "Interpretive premise",
    "title": "Attributes represent essential aspects",
    "text": "An attribute is perceived as constituting an essence exactly when the substance has the aspect it expresses.",
    "reference": "Interpretation of Ethics I, Definition IV — representation",
    "original": "By attribute, I mean that which the intellect perceives as constituting the essence of substance.",
    "mapping": "Selected interpretation: each attribute expresses one aspect, and perception agrees with possession of that aspect. This is stronger than the primitive perception relation in Definition IV. More reality is interpreted as inclusion of essential aspects.",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAttributes.lean"
  },
  {
    "id": "E1-D4-coverage",
    "type": "Interpretive premise",
    "title": "Every essential aspect has an attribute",
    "text": "Every essential aspect possessed by a substance is expressed by at least one attribute.",
    "reference": "Interpretation of Ethics I, Definition IV — completeness",
    "original": "By attribute, I mean that which the intellect perceives as constituting the essence of substance.",
    "mapping": "Selected completeness premise, not a numbered axiom. No finiteness or one-to-one correspondence is assumed. A Lean countermodel shows that representation without completeness does not ensure an additional attribute.",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAttributes.lean"
  },
  {
    "id": "E1-D4-conception",
    "type": "Interpretive premise",
    "title": "Transfer of conceptual requirements",
    "text": "An external conceptual requirement of an attribute is also an external requirement of the substance whose essence it constitutes.",
    "reference": "Interpretation of Ethics I, Proposition X — conceptual bridge",
    "original": "An attribute is that which the intellect perceives of substance, as constituting its essence.",
    "mapping": "Selected interpretation of the step from Definition IV to Definition III in P10. External requirements are relative to each conception. Their transfer is assumed explicitly; it is not proved by the perception relation alone.",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAttributes.lean"
  }
]);
 results.push(...[
  {
    "id": "attribute-inclusion",
    "title": "Essential inclusion preserves attributes",
    "text": "If a substance includes all the essential aspects of another, it has all of its attributes under the selected representation principle.",
    "reference": "Intermediate step in Ethics I, Proposition IX",
    "requires": [
      "E1-D3",
      "E1-D4",
      "E1-D4-representation"
    ],
    "parents": [
      "E1-D3",
      "E1-D4",
      "E1-D4-representation"
    ],
    "level": 1,
    "theorem": "attributes_monotone",
    "steps": [
      "Take an attribute of the substance with fewer essential aspects.",
      "The representation principle gives its expressed aspect; the inclusion hypothesis transfers that aspect to the other substance.",
      "Apply the representation principle in reverse to recover the same attribute."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAttributes.lean"
  },
  {
    "id": "E1-P9",
    "title": "More essential aspects, an additional attribute",
    "text": "For two substances, strict inclusion of essential aspects implies strict inclusion of attributes, assuming representation and completeness. This is a structural reading of more reality, not a comparison of infinite cardinalities.",
    "reference": "Ethics I, Proposition IX — inclusion reconstruction",
    "requires": [
      "E1-D3",
      "E1-D4",
      "E1-D4-representation",
      "E1-D4-coverage"
    ],
    "parents": [
      "attribute-inclusion",
      "E1-D4-coverage"
    ],
    "level": 2,
    "theorem": "proposition9_attribute_inclusion",
    "steps": [
      "The intermediate result preserves every attribute of the substance with fewer essential aspects.",
      "Strict reality inclusion supplies an additional essential aspect. Completeness supplies an attribute expressing it.",
      "That attribute cannot belong to the other substance: representation would give it the supposedly absent aspect."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAttributes.lean"
  },
  {
    "id": "E1-P10",
    "title": "Attributes need no external concept",
    "text": "An attribute of a substance has no external conceptual requirement, assuming the selected transfer of requirements to that substance. This is the encoded reading of conceived through itself.",
    "reference": "Ethics I, Proposition X — conceptual reconstruction",
    "requires": [
      "E1-D3",
      "E1-D4",
      "E1-D4-conception"
    ],
    "parents": [
      "E1-D3",
      "E1-D4",
      "E1-D4-conception"
    ],
    "level": 1,
    "theorem": "proposition10_attribute_independence",
    "steps": [
      "Suppose that conceiving an attribute requires an external concept.",
      "The selected bridge transfers this external requirement to the substance whose essence the attribute constitutes.",
      "Definition III excludes that requirement for the substance. The initial supposition is impossible."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAttributes.lean"
  }
]);
 entries.push(...[
  {
    "id": "E1-commonality-bridge",
    "title": "Shared attributes and commonality",
    "text": "For substances, having something in common means sharing at least one attribute.",
    "reference": "Interpretation of Ethics I, Proposition II — commonality",
    "original": "Two substances, whose attributes are different, have nothing in common.",
    "mapping": "Explicit semantic interpretation, not the converse of Axiom V. Different attributes in this proof means no shared attribute; merely unequal attribute profiles is insufficient. Definition III alone does not establish this bridge.",
    "type": "Interpretive premise",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "E1-qualitative-identity",
    "title": "Qualities determine identity",
    "text": "Things with exactly the same qualities are identical.",
    "reference": "Interpretation of Ethics I, Proposition IV — individuation",
    "original": "Two or more distinct things are distinguished one from the other, either by the difference of the attributes of the substances, or by the difference of their modifications.",
    "mapping": "An explicit principle of qualitative individuation. It excludes primitive numerical distinctions invisible to every quality. This additional principle is not proved by the mere classification into substances and modes.",
    "type": "Interpretive premise",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "E1-quality-exhaustion",
    "title": "Qualities are attributes or modifications",
    "text": "Every quality is represented by an attribute or a modification.",
    "reference": "Interpretation of Ethics I, Proposition IV — qualitative vocabulary",
    "original": "Two or more distinct things are distinguished one from the other, either by the difference of the attributes of the substances, or by the difference of their modifications.",
    "mapping": "Each quality has exactly the same instances as some attribute or modification. Together with qualitative identity, this supplies a distinguishing witness. This interpretation of P4’s argument is stronger than Axiom I alone.",
    "type": "Interpretive premise",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "E1-complete-attribute",
    "title": "One attribute expresses the complete essence",
    "text": "Substances sharing one attribute have the same complete attribute profile.",
    "reference": "Interpretation of Ethics I, Definitions IV and Proposition V",
    "original": "By attribute, I mean that which the intellect perceives as constituting the essence of substance.",
    "mapping": "A substantive complete-essence interpretation. It equates attribute profiles, not the substances themselves. It is distinct from the aspect-based vocabulary used for P9. A compiled overlapping-profile countermodel demonstrates why this extra premise matters.",
    "type": "Interpretive premise",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "E1-essence-abstraction",
    "title": "Set modifications aside",
    "text": "Considering a substance without modifications preserves its attributes and preserves distinctions between substances.",
    "reference": "Interpretation of Ethics I, Proposition V — abstraction",
    "original": "If by the difference of their modifications—as substance is naturally prior to its modifications (Prop. i.),—it follows that setting the modifications aside, and considering substance in itself, that is truly, (Deff. iii. and vi.), there cannot be conceived one substance different from another,—that is (by Prop. iv.), there cannot be granted several substances, but one substance only. Q.E.D.",
    "mapping": "An abstraction operation preserves attributes, removes modifications and is injective on substances. Preserving distinctions is an explicit commitment, not a consequence already proved by P1. A countermodel without this commitment admits distinct substances with the same attributes.",
    "type": "Interpretive premise",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "E1-attribute-witness",
    "title": "Every substance has an attribute",
    "text": "Every substance has at least one attribute.",
    "reference": "Interpretation of Ethics I, Definition IV — attribute witness",
    "original": "By attribute, I mean that which the intellect perceives as constituting the essence of substance.",
    "mapping": "A separate existence requirement for attributes of a given substance. A primitive attribute relation alone need not provide any attribute. This does not assert that a substance exists.",
    "type": "Interpretive premise",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "E1-A1",
    "title": "In itself or in another",
    "text": "Everything is either in itself or in another thing.",
    "reference": "Ethics I, Axiom I",
    "original": "Everything which exists, exists either in itself or in something else.",
    "mapping": "The quantifier ranges over the entities of this vocabulary. In-itself and in-another are primitive relations; the separate classification bridges supply the links to conceptual independence and modes.",
    "type": "Axiom",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "E1-classification-bridges",
    "title": "From in-itself and in-another to substance and mode",
    "text": "An entity in itself is a substance; an entity in another is a mode of some substance.",
    "reference": "Interpretation of Ethics I, Axiom I and Definitions III–V",
    "original": "Everything which exists, exists either in itself or in something else.",
    "mapping": "Two explicit bridges add conceptual independence in the first case, and a distinct substance with inherence and conceptual dependence in the second. Neither bridge follows from the disjunction of Axiom I alone.",
    "type": "Interpretive premise",
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  }
]);
 results.push(...[
  {
    "id": "E1-P2",
    "title": "Disjoint attributes exclude commonality",
    "text": "Two substances sharing no attribute have nothing in common, under the selected meaning of commonality. Unequal profiles alone do not suffice.",
    "reference": "Ethics I, Proposition II — disjoint-attribute reconstruction",
    "requires": [
      "E1-D3",
      "E1-D4",
      "E1-commonality-bridge"
    ],
    "parents": [
      "E1-D3",
      "E1-D4",
      "E1-commonality-bridge"
    ],
    "level": 1,
    "theorem": "proposition2_disjoint_attributes",
    "steps": [
      "Suppose two substances share no attribute.",
      "The selected bridge would turn commonality into a shared attribute.",
      "This contradicts disjointness, so commonality is excluded."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "E1-P4",
    "title": "A distinction has a qualitative witness",
    "text": "Two distinct entities differ on an attribute or a modification, assuming qualitative identity and the selected classification of qualities.",
    "reference": "Ethics I, Proposition IV — qualitative reconstruction",
    "requires": [
      "E1-D4",
      "E1-D5",
      "E1-qualitative-identity",
      "E1-quality-exhaustion"
    ],
    "parents": [
      "E1-D4",
      "E1-D5",
      "E1-qualitative-identity",
      "E1-quality-exhaustion"
    ],
    "level": 1,
    "theorem": "proposition4_qualitative_distinction",
    "steps": [
      "Suppose no attribute and no modification distinguishes the two entities.",
      "Every quality is represented by one of these, so every quality agrees.",
      "Qualitative identity identifies the entities, contradicting their distinctness. A distinguishing witness must exist."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "E1-P5-attributes",
    "title": "Sharing an attribute identifies substances",
    "text": "Two substances sharing an attribute are identical, under the complete-essence interpretation, qualitative individuation and the abstraction principle.",
    "reference": "Ethics I, Proposition V — attribute route",
    "requires": [
      "E1-D4",
      "E1-D5",
      "E1-qualitative-identity",
      "E1-quality-exhaustion",
      "E1-D3",
      "E1-complete-attribute",
      "E1-essence-abstraction"
    ],
    "parents": [
      "E1-P4",
      "E1-D3",
      "E1-complete-attribute",
      "E1-essence-abstraction"
    ],
    "level": 2,
    "theorem": "proposition5_shared_attribute",
    "steps": [
      "The shared attribute gives equal complete attribute profiles.",
      "Abstracting from modifications preserves those profiles and leaves no modification that could distinguish the abstractions.",
      "The qualitative-distinction result forces the abstractions to be identical. Injectivity of abstraction then identifies the original substances."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean",
    "propositionId": "E1-P5"
  },
  {
    "id": "E1-P6-attributes",
    "title": "From attributes to exclusion of causation",
    "text": "Distinct substances cannot cause one another: the new attribute route combines V, II and III under its disclosed interpretations. Production is read as causation.",
    "reference": "Ethics I, Proposition VI — route through V, II and III",
    "requires": [
      "E1-D4",
      "E1-D5",
      "E1-qualitative-identity",
      "E1-quality-exhaustion",
      "E1-D3",
      "E1-complete-attribute",
      "E1-essence-abstraction",
      "E1-commonality-bridge",
      "E1-A4",
      "E1-A5"
    ],
    "parents": [
      "E1-P5-attributes",
      "E1-P2",
      "E1-P3"
    ],
    "level": 3,
    "theorem": "proposition6_via_attributes",
    "steps": [
      "If the distinct substances shared an attribute, the attribute version of V would identify them.",
      "Their attributes are therefore disjoint; II excludes commonality.",
      "III, already checked from Axioms IV and V, excludes causation in both directions."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean",
    "propositionId": "E1-P6"
  },
  {
    "id": "universal-substance-unique",
    "title": "If a universal substance exists, it is unique",
    "text": "If a substance has every attribute possessed by any substance, every substance is identical to it. This proves a conditional step toward XIV, not that such a substance exists.",
    "reference": "Conditional step toward Ethics I, Proposition XIV",
    "requires": [
      "E1-D4",
      "E1-D5",
      "E1-qualitative-identity",
      "E1-quality-exhaustion",
      "E1-D3",
      "E1-complete-attribute",
      "E1-essence-abstraction",
      "E1-attribute-witness"
    ],
    "parents": [
      "E1-P5-attributes",
      "E1-attribute-witness"
    ],
    "level": 3,
    "theorem": "universal_substance_unique",
    "steps": [
      "Assume a substance with every attribute instantiated by substances. Its existence is a local hypothesis.",
      "Take any substance and obtain one of its attributes from the selected witness premise.",
      "The proposed universal substance shares that attribute. The attribute version of V identifies them."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean",
    "type": "Conditional step"
  },
  {
    "id": "substance-mode-classification",
    "title": "Every entity is a substance or a mode",
    "text": "Every entity is a substance or a mode of some substance, using Axiom I and the two explicit classification bridges.",
    "reference": "Classification used in Ethics I, Propositions IV and XV",
    "requires": [
      "E1-A1",
      "E1-D3",
      "E1-D5",
      "E1-classification-bridges"
    ],
    "parents": [
      "E1-A1",
      "E1-D3",
      "E1-D5",
      "E1-classification-bridges"
    ],
    "level": 1,
    "theorem": "substance_mode_classification",
    "steps": [
      "Axiom I gives the alternatives: in itself or in another.",
      "The first selected bridge identifies the in-itself case as substance.",
      "The second supplies a substance and the relations required for being its mode."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean"
  },
  {
    "id": "everything-in-universal-substance",
    "title": "If it exists, every other entity is its mode",
    "text": "Given a universal substance, every entity is either that substance or one of its modes, in it and conceptually dependent on it. This conditional classification does not establish the full statement of XV.",
    "reference": "Conditional step toward Ethics I, Proposition XV",
    "requires": [
      "E1-D4",
      "E1-D5",
      "E1-qualitative-identity",
      "E1-quality-exhaustion",
      "E1-D3",
      "E1-complete-attribute",
      "E1-essence-abstraction",
      "E1-attribute-witness",
      "E1-A1",
      "E1-classification-bridges"
    ],
    "parents": [
      "universal-substance-unique",
      "substance-mode-classification"
    ],
    "level": 4,
    "theorem": "everything_in_universal_substance",
    "steps": [
      "The classification result gives either a substance or a mode of some substance.",
      "Conditional uniqueness identifies that substance with the assumed universal substance.",
      "In the mode case, substitute the identical substance; inherence and conceptual dependence are preserved."
    ],
    "source": "https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap01",
    "proofSource": "https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaDistinctions.lean",
    "type": "Conditional step"
  }
]);
 function derive(ids){const set=new Set(ids);return {results:results.filter(r=>r.requires.every(id=>set.has(id))),conflict:set.has('E1-A4')&&set.has('E1-A5')&&set.has('test-counterexample'),roots:entries.filter(e=>set.has(e.id))};}
 for(const result of results)result.leanName='PhiloForge.Spinoza.'+(result.proofSource?.includes('SpinozaAffects')?'Affects.':result.proofSource?.includes('SpinozaOntology')?'Ontology.':result.proofSource?.includes('SpinozaAttributes')?'Attributes.':result.proofSource?.includes('SpinozaDistinctions')?'Distinctions.':'')+result.theorem;
 root.SpinozaTheory={entries,results,derive};if(typeof module==='object'&&module.exports)module.exports=root.SpinozaTheory;
 if(typeof document==='undefined'||!document.querySelector('#spinoza-library'))return;
 const selected=new Set();try{const saved=JSON.parse(localStorage.getItem('philoforge.spinoza.v1'));if(Array.isArray(saved))for(const id of saved)if([...entries.map(e=>e.id),'test-counterexample'].includes(id))selected.add(id);}catch{}
 const library=document.querySelector('#spinoza-library'),graph=document.querySelector('#spinoza-tree');
 function add(parent,tag,text){const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;}
 function cite(parent,entry){const a=add(parent,'a',entry.reference);a.href=entry.source||source;a.target='_blank';a.rel='noopener';a.className='source-citation';}
 const groups=[];
 function createGroup(parent,title,ids,key,open=false){
  const section=add(parent,'section','');section.className='selection-group';
  const row=add(section,'div','');row.className='selection-group-row';
  const toggle=add(row,'button','');toggle.type='button';toggle.className='selection-toggle';
  const arrow=add(toggle,'span',open?'▾':'▸');arrow.setAttribute('aria-hidden','true');arrow.dataset.localised='true';add(toggle,'span',title);
  const body=add(section,'div','');body.id='selection-'+key;body.className='selection-children';body.hidden=!open;
  toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-controls',body.id);
  toggle.addEventListener('click',()=>{body.hidden=!body.hidden;toggle.setAttribute('aria-expanded',String(!body.hidden));arrow.textContent=body.hidden?'▸':'▾';});
  const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.dataset.selectionGroup=key;checkbox.setAttribute('aria-label','Select all: '+title);row.append(checkbox);
  checkbox.addEventListener('change',()=>{for(const id of ids)checkbox.checked?selected.add(id):selected.delete(id);render();});
  groups.push({checkbox,ids});return body;
 }
 const theory=createGroup(library,'Ethics — Spinoza',entries.map(e=>e.id),'spinoza',true);
 for(const type of ['Definition','Axiom','Scholium principle','Interpretive premise']){
  const members=entries.filter(e=>e.type===type);
  const group=createGroup(theory,({'Definition':'Definitions','Axiom':'Axioms','Scholium principle':'Principles from the scholium','Interpretive premise':'Interpretive premises'})[type],members.map(e=>e.id),type.toLowerCase().replaceAll(' ','-'));
  for(const entry of members){
   const card=add(group,'article','');card.className='source-axiom compact-starting-point';
   const label=add(card,'label','');add(label,'strong',entry.title);const input=document.createElement('input');input.type='checkbox';input.checked=selected.has(entry.id);input.dataset.axiom=entry.id;label.append(input);
   const details=add(card,'details','');add(details,'summary','Source and formalization');
   add(details,'p',entry.text);cite(details,entry);add(details,'blockquote',entry.original);add(details,'p','English translation: R. H. M. Elwes. French text on this site is our translation.');add(details,'p',entry.mapping);
   input.addEventListener('change',()=>{input.checked?selected.add(entry.id):selected.delete(entry.id);render();});
  }
 }

 const test=document.querySelector('#test-counterexample');test.checked=selected.has('test-counterexample');test.addEventListener('change',()=>{test.checked?selected.add('test-counterexample'):selected.delete('test-counterexample');render();});
 function render(){
  for(const input of library.querySelectorAll('[data-axiom]'))input.checked=selected.has(input.dataset.axiom);
  for(const {checkbox,ids} of groups){const count=ids.filter(id=>selected.has(id)).length;checkbox.checked=count===ids.length;checkbox.indeterminate=count>0&&count<ids.length;}
  const data=derive([...selected]);graph.replaceChildren();
  graph.hidden=!data.conflict;
  document.querySelector('#map-link').hidden=true;graph.className=data.conflict?'contradiction-view':'proof-tree';
  document.querySelector('#spinoza-empty').hidden=data.roots.length>0;
  document.querySelector('#generate-map').disabled=data.roots.length===0;
  document.querySelector('.tree-caption').hidden=!!data.conflict;
  if(data.conflict){renderConflict();}else{
   for(let level=Math.max(0,...data.results.map(r=>r.level));level>=0;level--){const row=add(graph,'div','');row.className='proof-level';const nodes=level===0?data.roots:data.results.filter(r=>r.level===level);
    if(!nodes.length){row.remove();continue;}
    for(const node of nodes){const card=add(row,'article','');card.className='proof-node';card.dataset.node=node.id;add(card,'div',level===0?node.type:'Consequence').className='eyebrow';add(card,'h3',node.title);add(card,'p',node.text);cite(card,node);
     if(node.theorem){const details=add(card,'details','');add(details,'summary','Read the reasoning');const list=add(details,'ol','');node.steps.forEach(step=>add(list,'li',step));const link=add(card,'a','Lean-checked reconstruction ↗');link.href=node.proofSource||proofSource;}
    }
   }
  }
  try{localStorage.setItem('philoforge.spinoza.v1',JSON.stringify([...selected]));}catch{}
  PhiloI18n.apply();requestAnimationFrame(drawEdges);
 }
 function renderConflict(){const box=add(graph,'article','');box.className='contradiction-proof';add(box,'div','COUNTEREXAMPLE TEST — NOT A SPINOZA AXIOM').className='eyebrow';add(box,'h3','Axiom IV + Axiom V conflict with this counterexample');
  const branches=add(box,'div','');branches.className='conflict-branches';const left=add(branches,'div','');left.className='conflict-branch';add(left,'h4','Spinoza’s Proposition III');add(left,'p','Axioms IV and V imply that things with nothing in common cannot cause one another.');const right=add(branches,'div','');right.className='conflict-branch';add(right,'h4','Your test assumption');add(right,'p','There are two things with nothing in common, yet one causes the other.');
  const clash=add(box,'div','');clash.className='conflict-clash';add(clash,'span','⊥').setAttribute('aria-hidden','true');add(clash,'strong','Contradiction');
  const list=add(box,'ol','');['The test supplies x and y with no commonality and with x causing y.','Proposition III, derived from Axioms IV and V, excludes that causal relation.','The same causal relation is asserted and denied.'].forEach(step=>add(list,'li',step));const link=add(box,'a','Lean-checked contradiction proof ↗');link.href=proofSource;
  add(box,'p','This refutes the added counterexample under the selected formal assumptions; it does not show that Spinoza’s axioms contradict one another.');const button=add(box,'button','Remove the test assumption');button.className='secondary';button.addEventListener('click',()=>{selected.delete('test-counterexample');test.checked=false;render();});
 }
 function drawEdges(){graph.querySelector('svg')?.remove();if(derive([...selected]).conflict)return;const origin=graph.getBoundingClientRect();const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('proof-edges');svg.setAttribute('aria-hidden','true');svg.setAttribute('viewBox',`0 0 ${graph.clientWidth} ${graph.scrollHeight}`);
  for(const node of derive([...selected]).results){const target=graph.querySelector(`[data-node="${node.id}"]`);if(!target||target.hidden)continue;const t=target.getBoundingClientRect();for(const id of node.parents){const sourceNode=graph.querySelector(`[data-node="${id}"]`);if(!sourceNode||sourceNode.hidden)continue;const s=sourceNode.getBoundingClientRect();const x=s.left+s.width/2-origin.left,y=s.top-origin.top,tx=t.left+t.width/2-origin.left,ty=t.bottom-origin.top;const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',`M ${x} ${y} C ${x} ${(y+ty)/2}, ${tx} ${(y+ty)/2}, ${tx} ${ty}`);svg.append(path);}}
  graph.prepend(svg);
 }
 document.querySelector('#generate-map').addEventListener('click',()=>{
  const data=derive([...selected]);
  if(data.conflict){render();graph.scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(!data.roots.length)return;
  const url=new URL('/philoforge/map/',location.origin);url.searchParams.set('axioms',[...selected].join(','));url.searchParams.set('lang',PhiloI18n.language);
  const opened=window.open(url.toString(),'_blank');if(opened)opened.opener=null;
  const fallback=document.querySelector('#map-link');fallback.href=url.toString();fallback.hidden=false;
});
document.querySelector('#select-spinoza').addEventListener('click',()=>{entries.forEach(e=>selected.add(e.id));library.querySelectorAll('input').forEach(i=>i.checked=true);render();});
 document.querySelector('#clear-spinoza').addEventListener('click',()=>{selected.clear();library.querySelectorAll('input').forEach(i=>i.checked=false);test.checked=false;render();});
 document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(drawEdges)));window.addEventListener('resize',drawEdges);render();
})(globalThis);
