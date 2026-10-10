# Rational preferences, version 1

The relation `r a b` means that a is at least as desirable as b. Strict preference is defined as `r a b ∧ ¬ r b a`; it is not an additional axiom. Completeness includes self-comparison. Transitivity and completeness are explicit theorem parameters, not global postulates.

The Lean source proves strict asymmetry, strict transitivity, exclusion of a strict three-cycle, reflexivity from completeness, and existence of a greatest option among three under completeness and transitivity. Ties and repeated options are allowed. No theorem for arbitrary infinite sets or utility representation is claimed.

The tree maps theorem dependencies to selectable assumptions. Inactive nodes indicate missing assumptions, not false conclusions. A failed finite example is a failure of that model, not a contradiction in the theory. The browser exhaustively evaluates the nine entries of a three-option relation; fixed symbolic proofs are checked in GitHub CI using Lean 4.34.1. It does not submit arbitrary user proofs to Lean.

## Français

Les racines de l’arbre sont la définition de préférence stricte et les axiomes sélectionnables. Les résultats intermédiaires conduisent à l’absence de cycle strict et à l’existence d’une meilleure option parmi trois. Retirer un axiome rend certaines conclusions indisponibles, sans établir leur fausseté.

Les exemples cycliques et incomparables montrent pourquoi ces hypothèses sont utiles. L’anglais est la langue de référence et les traductions françaises sont facultatives.
