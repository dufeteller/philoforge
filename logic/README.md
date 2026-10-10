# Spinoza formal reconstruction

Run `lake build` here using the toolchain in `lean-toolchain`. The only imported theory is `PhiloForge.Spinoza`.

Source: Spinoza, Ethics I, Definition III, Axioms IV and V, Proposition III, and the alternative demonstration of Proposition VI's corollary. English edition: R. H. M. Elwes, Project Gutenberg eBook 919, https://www.gutenberg.org/cache/epub/919/pg919.html .

`Substance` encodes being in itself and conceptual independence from distinct entities. This is an explicit strengthened reading of Definition III. `Axiom4` extracts the causal-to-conceptual implication required by the demonstrations; `Axiom5` excludes conceptual dependence in both directions when nothing is shared.

These assumptions are theorem parameters. Lean proves conditional claims within the reconstruction, not historical fidelity or metaphysical truth. The source contains no admitted proofs or global philosophical axioms. `#print axioms` audits each theorem.
