# Spinoza: candidate foundations and fidelity review

## Status

This is an implemented research foundation, not a certification of the complete Ethics. `PhiloForge/SpinozaFoundations.lean` compiles alongside the existing reconstructions. The six numbered reconstructions retain their restricted scope; no new numbered proposition is counted. Independent philosophical review has not occurred.

The website's [comparison dossier](https://dufetelle.com/philoforge/review/) distinguishes the historical statement, the encoded conclusion, local hypotheses, selected definitions/premises, interpretation limits, and the exact Lean theorem declaration. The latter and its source link are generated from the actual Lean file, with CI detecting drift. Compilation does not validate the natural-language interpretation.

## Reference edition

Primary Latin: ILIESI–CNR, *Archivio Testi e Studi Spinoziani*, [Ethica ordine geometrico demonstrata](https://www.iliesi.cnr.it/spinoza/ethica/ethica_xhtml.html). The digital edition identifies its source as *Opera*, ed. Carl Gebhardt, Heidelberg, 1972, vol. II, pp. 41–308. This is the selected reference, not a claim of a new critical edition.

`website/dist/data/spinoza-sources.json` records that identification, the fetched HTML SHA-256 and 20 located Latin excerpts. The excerpts were checked against the downloaded text after collapsing whitespace, preserving spelling and punctuation. Punctuation or transcription problems remain subject to philological review. The checksum identifies the downloaded version, not a guarantee about future remote contents. Reproduce the offline check with `python scripts/check-latin-sources.py /path/to/ethica_xhtml.html`.

English passages remain the public-domain Elwes translation already catalogued. French source statements and explanatory prose are our translations, never attributed to a historical translator. French entries remain optional and are hidden when the corresponding translation is absent. Latin is displayed deliberately as the comparison text, never as an unnoticed French fallback.

## Conceptual structure

The candidate separates three types: things, attributes and admissible situations. Situations do not represent time. The accessibility relation is supplied by the interpretation; neither reflexivity nor any other modal law is silently imposed.

| Concept | Representation | What is still a choice or unresolved |
| --- | --- | --- |
| Actual existence | `existsAt w x` | Domain membership does not imply actual existence. |
| Essence | `essenceAt w x` | A condition across situations; this is not yet a full theory of essence or hyperintensional meaning. |
| Substance, D3 | `inSelf w x ∧ perSe x` | Positive conception through self remains distinct from independence. |
| D3 explanatory clause | `D3Explanation`: per-se conception iff no requirement of another concept | An explicitly supplied interpretation of “hoc est”; not silently folded into the primitive vocabulary. |
| Mode, D5 | Distinct bearer, inherence, conception through bearer | Substance of the bearer is separately required by statements about a substance's mode. |
| Conception/dependence | `ConceptionBridge` | Conception through something implies needing its concept; the bridge is visible. |
| Attribute, D4 | Substance plus `perceivedAsEssence a x` | Perception is still primitive. It is not automatically identified with the truth of an essence condition. |
| Expressing an essence | Agreement of attribute content and essence condition across situations | This extensional relation is separate from D4's perception relation. |
| Shared attribute | One attribute possessed by both | Does not mean equality of all attributes. |
| Same attribute profile | Agreement on every attribute | Not identified with “same nature” and not assumed to imply identity of substances. |
| Essence entails existence, candidate D1 | Every realization of essential conditions entails existence | May hold vacuously when essential conditions are unrealized. It is not asserted equivalent to all senses of D1. |
| Necessary existence | Existence in every accessible situation | Actual existence follows only with an explicit reflexivity premise; existence in one situation does not establish necessity. |

Definitions D2, D6, D7 and D8 and the full A1–A7 system are not claimed to have been reconstructed by this new candidate module. In particular, infinity, God, freedom and eternity remain work to do.

## Compiled results and checks

- `substance_correspondence` proves equivalence between candidate substance and the older encoded substance **under D3Explanation**. It exposes the interpretation needed to connect them.
- `conceptual_priority` reconstructs P1's conceptual reading with both D3Explanation and ConceptionBridge explicit.
- `no_common_cause` reconstructs P3's causal implication from the disclosed conceptual readings of A4 and A5.
- `no_external_cause` gives the corollary's causal exclusion with the D3 explanation explicit.
- `necessary_of_essential_conditions` isolates the missing realization assumption: an essence/existence implication alone supplies no necessarily existing entity.
- `actual_of_necessary` exposes the modal frame assumption required to pass from necessity to actuality.
- `sharing_is_not_same_profile` provides an explicit model where two things share an attribute but differ in their full profiles.
- `essence_implication_does_not_supply_existence`, `actual_is_not_necessary`, and `definitions_allow_no_existing_substance` prevent accidental inference of existence from a definition or conflation of actuality and necessity.
- `foundations_have_substance_and_mode` constructs a model with an actual substance, an actual mode and nonempty causation satisfying the candidate D3 explanation, conception bridge and A4/A5 readings. Thus the core reconstructed arguments are not validated only by an empty or contradictory context.

These are results about the candidate model. None is a counterexample to the complete historical Ethics. The build prints their foundational assumptions and rejects missing-proof placeholders.

## Audit of the previous numbered reconstructions

Each dossier records the premise origins and the actual theorem signature. This does not automatically certify that its prose is faithful to Lean: that comparison remains reviewable work. In particular:

- P5 uses the later scholium's multiplicity principle as a premise; its original demonstration is not reconstructed.
- P7 uses primitive essential existence and assumes actual existence of a substance. The new candidate semantics is not silently substituted into that older theorem.
- P8 omits modal necessity. Its selected limiter classification is a premise used by the chosen proof route, but the older P5 theorem never uses its second substance hypothesis (`_sy`). Therefore this route must not be advertised as a minimal dependency analysis. Removing an input hides the available registered proof; it does not establish non-derivability by another proof.

## Criteria before calling a historical demonstration faithfully reconstructed

1. Identify the complete source passage and the precise statement to be represented.
2. Give every formal concept a reviewed interpretation, including quantification, identity, existence and modality.
3. List explicit source premises, implicit interpretive bridges and local hypotheses separately. No target conclusion can enter as an unacknowledged assumption.
4. Compile the proof and inspect its actual assumptions. Document weakened conclusions, stronger premises and alternative proof routes.
5. Check satisfiability or appropriate models where available, and use countermodels to test alleged implications. Do not present a countermodel of a fragment as refutation of the work.
6. Obtain attributable independent reviews of philosophical fidelity and formal reasoning, recording disagreements. A model-generated summary or a green CI result is not such a review.

No dossier presently satisfies the independent-review criterion. No person has been contacted or represented as having approved the interpretation.
