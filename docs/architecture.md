# Architecture

An axiom is a versioned proposition with prose, formalization, authorship, and explicit definitions. A theory references exact axiom versions. A universe selects theory versions and optional axioms; it records shared vocabulary and the chosen logic.

Changing definitions can change meaning. Composition must reject incompatible vocabularies rather than silently treating similarly named predicates as identical. Claims proved under one set of assumptions cannot automatically transfer to another.

Proofs reference an immutable universe version. The future Lean worker must distinguish assumptions from proved propositions, report admitted statements, and avoid claiming semantic consistency from successful compilation alone.

GitHub hosts source code and review history. GitHub login within the application is a separate future integration.
