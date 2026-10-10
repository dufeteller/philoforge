# Spinoza: source register and formalization scope

## Complete source library

The five parts of Benedict de Spinoza's *Ethics* are indexed in `website/dist/data/ethics.json`, from R. H. M. Elwes' public-domain English translation, [Project Gutenberg eBook 3800](https://www.gutenberg.org/files/3800/3800-h/3800-h.htm). The edition, URL, normalization rules and original file SHA-256 are recorded in the JSON. Gutenberg's source notice and terms remain available through the edition link.

All 259 numbered propositions are present, with their following demonstrations, corollaries, scholia and notes: I (36), II (49), III (59), IV (73), V (42). Definitions, axioms, postulates, the seven physical lemmas, 48 definitions of emotions, prefaces and appendices are included. Supporting paragraphs follow the numbered item to which they belong in the edition. The physical interlude has repeated axiom numbering: unique `Phys-A` identifiers use encounter order and retain the printed number separately. Its unnumbered definition belongs to the surrounding interlude text.

Eight catalogue starting points are labeled `encoded-premise`; this indicates a definition or hypothesis in the reconstruction, not a proved proposition.

These are **source records**, not automatic proof rules. No unformalized proposition is promoted to an axiom. No dependency edges are guessed from textual citations. The deduction map uses only the separately maintained, proved reconstructions.

Import again with `python scripts/import_ethics.py /path/to/3800-h.htm`. The importer checks continuous numbering in all five parts, uniqueness, and applies the optional translations in `website/dist/data/ethics-fr.json`. HTML tags are removed and whitespace normalized; original spelling is retained. Do not rewrite the source text as modern paraphrases while retaining its source-text label.

## Verified reconstructions

| Starting points | Result | Lean theorem | Scope |
|---|---|---|---|
| I A5 | Conceptual separation | `conceptual_separation` | Intermediate step, not a separately numbered proposition. |
| I A4 + A5 | I P3 | `proposition3` | Causal/conceptual reconstruction. |
| I D3 + A4 | I P6 corollary, alternative demonstration | `external_cause_excluded` | External causation; **not** all of I P6. |
| III D1 | Adequate cause excludes partial cause | `Affects.adequate_not_partial` | Definitional consequence, same cause and effect. |
| III D1 + D2 | Activity excludes passivity | `Affects.active_not_passive` | Definitional consequence, same actor and event. |

Files: `logic/PhiloForge/Spinoza.lean` and `logic/PhiloForge/SpinozaAffects.lean`. Theorems take hypotheses as parameters. There are no global philosophical postulates or admitted proofs. CI compiles both modules. Lean checks the reconstruction, not its philosophical fidelity.

I D3 encodes conceptual independence as no dependence on a distinct entity, an explicitly stronger interpretation of the prose. I A4 encodes a causal-to-conceptual implication. Cause and production are not universally identified. III D1 encodes adequate causation as causation plus intelligibility through that cause alone; partial causation excludes that intelligibility. III D2 concerns an actor-event pair, not the claim that a whole person can never be active in one respect and passive in another. These last two results are not numbered propositions attributed to Spinoza.

The optional P3 counterexample is a user hypothesis, not a Spinoza axiom. Its contradiction with A4 + A5 refutes the extra hypothesis under this model; it does not establish inconsistency of Spinoza's axioms.

## French

French passages are our translations, not quotations attributed to a historical French translator. Currently 28 statement translations are stored in the optional translation register. Their untranslated demonstrations are omitted in French, with a link to the English source. Whole entries without a French statement are hidden in French mode and retained in English. Interface translations are maintained in `locales.js`.

## What remains to formalize

Full machine verification of the *Ethics* is unfinished. There is no verified proof of God's existence or monism, the conatus propositions, the theory of knowledge, intellectual love, or blessedness. Those texts remain explicitly `source-only`. I P6 now has a limited causal reconstruction using the alternative corollary argument; its historical proof via P2/P3/P5 remains unformalized.

Further work must define and review the ontological, mental, physical and affective vocabularies, examine each historical proof's implicit bridges, then prove results without treating their conclusions as hypotheses. Update proof statuses only after the exact encoded theorem compiles and its scope is documented. The bibliographic corpus and its cardinality are not evidence that all 259 propositions have been formalized.

## Website proof registry

`WebsiteChecks.lean` is generated from all proof-backed workshop results. CI first compares it against the JavaScript registry, then Lean elaborates every named proof reference and prints its axiom dependencies. The inline counterexample proof is included. This checks that each displayed proof names a real compiled theorem; it does not automatically verify fidelity of the natural-language paraphrase. Current coverage is thirteen reconstructed results, including limited versions of eight numbered propositions (I P1, P3, P5, P6, P7, P8, P9, P10), an alternative corollary and intermediate/definitional consequences. The ontology and attribute extensions depend on additional selectable scholium principles or interpretive premises. It is not 259 verified propositions.

## Extension: I P1 and I P6

`ModeOf` encodes I D5 with a distinct containing entity and conceptual dependence. `proposition1` reconstructs "prior by nature" as asymmetric conceptual dependence: the mode depends on the substance; D3 excludes dependence in the reverse direction. This is a limited interpretation of priority, not a temporal theorem or a proof of every philosophical meaning of priority.

`proposition6_causal` applies the already proved external-cause exclusion in both directions to two distinct substances. It is a causal specialization using the alternative corollary argument, not a reproduction of the historical P2/P3/P5 proof and not an identification of every meaning of production with causation.

`fragment_has_model` gives a concrete Bool model with a substance, a mode and a nonempty causal relation satisfying A4 and A5. It establishes satisfiability of the encoded I D3/D5/A4/A5 fragment, not consistency of all the Ethics. This model also prevents interpreting these proofs as mere consequences of a contradictory global context.

## Extension: same nature and essential existence

`SpinozaOntology.lean` adds actual existence, same nature, possible limitation and essence involving existence. D1 defines essential self-causation; it does not identify this with the binary causal relation. D2 is restricted to distinct actual limiters. Absence of those limiters is the encoded infinity in kind; neither cardinal infinity nor modal necessity is claimed.

Three selectable extra premises have their own categories in the workshop:

- **Existence explanation**, from I P8 scholium II, principles 3–4: an existent has an intrinsic explanation or an external cause. Identifying the intrinsic explanation with essence involving existence is a disclosed interpretation.
- **Multiplicity explanation**, from the same scholium's general rule following the twenty-men example: distinct actual individuals of the same nature require an external cause. This general rule is assumed explicitly; its preceding prose reasoning is not proved in Lean.
- **Substance limiter**, an interpretive bridge in the I P8 demonstration: a same-nature limiter of a substance is a substance. This is not a numbered axiom.

With D3/A4, the multiplicity principle proves the **same-nature version of P5** via the alternative scholium argument. It does not establish the version about sharing just one attribute. The explanation principle proves **P7 for an already existing substance**, not existence of any substance or God. P5 plus the limiting bridge proves **P8 as absence of a distinct actual same-nature limiter**. The formal model does not express its modal necessity. The causal and ontology fragments provide six numbered scoped reconstructions, not six fully faithful historical demonstrations.

The concrete Boolean model in `example_principles` satisfies all the new premises together with A4/A5 and has an existing substance, an existing mode and nonempty causation. It checks satisfiability of this extension; it is not a model of the full Ethics. With the attribute extension below, the website exposes thirteen results and keeps 251 numbered propositions unformalized.


## Fidelity dossier and candidate foundations

See [the candidate foundations and review criteria](spinoza-foundations.md). The site now exposes Latin source passages, exact generated Lean signatures, selected premises, local hypotheses and interpretation limits for every displayed result. All independent philosophical reviews remain pending. Corrected catalogue proof links resolve to the actual theorem file and declaration. The original six scoped reconstructions are retained as partial experiments; the new candidate foundations do not automatically certify or replace their interpretations.

## Extension: attributes, I P9 and I P10

`SpinozaAttributes.lean` supplies a separate typed vocabulary for things, attributes, essential aspects and external conceptual requirements. The D3 selector describes its independence reading alongside the older entity-dependence reading. No automatic correspondence between these vocabularies or the modal foundations is claimed.

- **D4** records perception of an attribute as constituting a substance’s essence. It does not itself assert all the following connections.
- **Essence representation**, a selectable interpretation of D4, connects that perception to an essential aspect expressed by the attribute, in both directions.
- **Attribute coverage**, a separate selectable interpretation, provides an attribute for each realized essential aspect. It assumes neither finiteness nor a bijection.
- **Conceptual inheritance**, the selectable interpretation used for P10, transfers an external conceptual requirement from an attribute to its substance. The fact that a requirement remains external after transfer is part of this premise.

`attributes_monotone` proves that inclusion of essential aspects preserves attributes, without using coverage. `proposition9_attribute_inclusion` then uses an additional aspect and coverage to produce an additional attribute. This is a structural reconstruction of I P9 for substances: strict set inclusion, not greater cardinality for infinite sets, and not a numerical theory of degrees of reality. `proposition10_attribute_independence` derives the absence of external requirements from the transfer principle and D3; it does not formalize P10’s whole scholium.

The historical source and encoded result remain distinct in the bilingual dossiers. The Latin references are I P9 (`sit216`) and I P10 (`sit219`) in the identified ILIESI–CNR edition; the interpretive premises cite D4 as their source context, not as a verbatim statement of those premises.

The module includes a non-vacuous model of the attribute fragment, with strictly nested reality and attribute profiles. It also proves two independence checks: omitting coverage can leave more reality without more attributes; omitting conceptual inheritance can leave an attribute requiring an external concept despite its substance’s independence. These diagnose the encoding, not errors in Spinoza. The model is not asserted to satisfy all other selectable fragments simultaneously.
