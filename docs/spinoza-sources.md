# Spinoza: source register and formalization scope

## Complete source library

The five parts of Benedict de Spinoza's *Ethics* are indexed in `website/dist/data/ethics.json`, from R. H. M. Elwes' public-domain English translation, [Project Gutenberg eBook 3800](https://www.gutenberg.org/files/3800/3800-h/3800-h.htm). The edition, URL, normalization rules and original file SHA-256 are recorded in the JSON. Gutenberg's source notice and terms remain available through the edition link.

All 259 numbered propositions are present, with their following demonstrations, corollaries, scholia and notes: I (36), II (49), III (59), IV (73), V (42). Definitions, axioms, postulates, the seven physical lemmas, 48 definitions of emotions, prefaces and appendices are included. Supporting paragraphs follow the numbered item to which they belong in the edition. The physical interlude has repeated axiom numbering: unique `Phys-A` identifiers use encounter order and retain the printed number separately. Its unnumbered definition belongs to the surrounding interlude text.

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

French passages are our translations, not quotations attributed to a historical French translator. Currently 23 statement translations are stored in the optional translation register. Their untranslated demonstrations are omitted in French, with a link to the English source. Whole entries without a French statement are hidden in French mode and retained in English. Interface translations are maintained in `locales.js`.

## What remains to formalize

Full machine verification of the *Ethics* is unfinished. There is no verified proof of God's existence or monism, the conatus propositions, the theory of knowledge, intellectual love, or blessedness. Those texts remain explicitly `source-only`. The source catalog's I P6 record remains unverified even though an alternative proof of its corollary is separately reconstructed.

Further work must define and review the ontological, mental, physical and affective vocabularies, examine each historical proof's implicit bridges, then prove results without treating their conclusions as hypotheses. Update proof statuses only after the exact encoded theorem compiles and its scope is documented. The bibliographic corpus and its cardinality are not evidence that all 259 propositions have been formalized.
