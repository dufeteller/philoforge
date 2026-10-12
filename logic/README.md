# Spinoza formal reconstruction

Run `lake build` here using the toolchain in `lean-toolchain`. The main target imports the Spinoza reconstruction and `PhiloForge.AIJustice`, including website proof audits.

Source: Spinoza, Ethics I, Definition III, Axioms IV and V, Proposition III, and the alternative demonstration of Proposition VI's corollary. English edition: R. H. M. Elwes, Project Gutenberg eBook 919, https://www.gutenberg.org/cache/epub/919/pg919.html .

`Substance` encodes being in itself and conceptual independence from distinct entities. This is an explicit strengthened reading of Definition III. `Axiom4` extracts the causal-to-conceptual implication required by the demonstrations; `Axiom5` excludes conceptual dependence in both directions when nothing is shared.

These assumptions are theorem parameters. Lean proves conditional claims within the reconstruction, not historical fidelity or metaphysical truth. The source contains no admitted proofs or global philosophical axioms. `#print axioms` audits each theorem.

The source library now indexes all five parts of the Ethics. It does **not** mean all proofs are formalized. `SpinozaAffects.lean` adds two definitional consequences of III D1-D2 concerning one actor and one event. Full proof coverage and interpretation limits are recorded in `docs/spinoza-sources.md`.

`AIJustice.lean` formalizes the separate two-principle justice framework over exact rationals, economic comparisons and concrete examples. `AIJusticeChecks.lean` audits all 21 theorem declarations. See `docs/ai-justice.md` at the repository root.
