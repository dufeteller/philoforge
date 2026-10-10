import PhiloForge.Spinoza

namespace PhiloForge.Spinoza.Ontology

-- Actual existence is distinct from membership in the domain of discourse.
structure Vocabulary (Entity : Type) extends Spinoza.Vocabulary Entity where
  actual : Entity → Prop
  sameNature : Entity → Entity → Prop
  canLimit : Entity → Entity → Prop
  essenceInvolvesExistence : Entity → Prop

-- E1 D1: this is essential self-causation, not the relation causes x x.
def SelfCaused {E : Type} (v : Vocabulary E) (x : E) : Prop :=
  v.essenceInvolvesExistence x

-- E1 D2, limited interpretation: a distinct actual thing of the same nature
-- can limit x. Potential limiters outside actual existence are not represented.
def FiniteInKind {E : Type} (v : Vocabulary E) (x : E) : Prop :=
  ∃ y, v.actual y ∧ y ≠ x ∧ v.sameNature x y ∧ v.canLimit y x

def InfiniteInKind {E : Type} (v : Vocabulary E) (x : E) : Prop :=
  ¬ FiniteInKind v x

-- E1 P8, scholium II, numbered principles 3 and 4:
-- an existent has an explanation in its own nature or an external cause.
-- Identifying an intrinsic explanation with essential existence is explicit.
def ExistenceExplanation {E : Type} (v : Vocabulary E) : Prop :=
  ∀ x, v.actual x → v.essenceInvolvesExistence x ∨
    ∃ c, c ≠ x ∧ v.causes c x

-- E1 P8, scholium II, the general rule following the twenty-men exampleOntology.
-- This is a separately selected philosophical premise, NOT derived from A1-A7.
def MultiplicityExplanation {E : Type} (v : Vocabulary E) : Prop :=
  ∀ x y, v.actual x → v.actual y → x ≠ y → v.sameNature x y →
    ∃ c, c ≠ x ∧ v.causes c x

-- Interpretive bridge in the P8 proof: the same-kind limiter of a substance
-- is itself a substance. sameNature alone has no such property by definition.
def SubstanceLimiter {E : Type} (v : Vocabulary E) : Prop :=
  ∀ x y, Spinoza.Substance v.toVocabulary x →
    v.sameNature x y → v.canLimit y x → Spinoza.Substance v.toVocabulary y

-- E1 P5: SAME NATURE, using the alternative argument in P8 scholium II.
-- This does not prove the stronger shared-single-attribute formulation.
theorem proposition5_same_nature {E : Type} (v : Vocabulary E)
    (a4 : Spinoza.Axiom4 v.toVocabulary) (multiplicity : MultiplicityExplanation v)
    (x y : E) (hx : v.actual x) (hy : v.actual y)
    (sx : Spinoza.Substance v.toVocabulary x)
    (_sy : Spinoza.Substance v.toVocabulary y) (same : v.sameNature x y) : x = y := by
  classical
  by_cases equal : x = y
  · exact equal
  · obtain ⟨c, external, cause⟩ := multiplicity x y hx hy equal same
    exact False.elim (Spinoza.external_cause_excluded v.toVocabulary a4 x c sx external cause)

-- E1 P7: existing substances have essential existence, conditional on the
-- explicit explanation principle above. No existence witness is manufactured.
theorem proposition7_existing_substance {E : Type} (v : Vocabulary E)
    (a4 : Spinoza.Axiom4 v.toVocabulary) (explanation : ExistenceExplanation v)
    (x : E) (hx : v.actual x) (sx : Spinoza.Substance v.toVocabulary x) :
    SelfCaused v x := by
  rcases explanation x hx with intrinsic | ⟨c, external, cause⟩
  · exact intrinsic
  · exact False.elim
      (Spinoza.external_cause_excluded v.toVocabulary a4 x c sx external cause)

-- E1 P8: no actual same-kind limiter under the disclosed bridge.
-- Neither modal necessity nor absolute/cardinal infinity is concluded.
theorem proposition8_no_limiter {E : Type} (v : Vocabulary E)
    (a4 : Spinoza.Axiom4 v.toVocabulary) (multiplicity : MultiplicityExplanation v)
    (limiter : SubstanceLimiter v) (x : E) (hx : v.actual x)
    (sx : Spinoza.Substance v.toVocabulary x) : InfiniteInKind v x := by
  intro finite
  obtain ⟨y, hy, distinct, same, limits⟩ := finite
  have sy := limiter x y sx same limits
  -- The intermediate substance classification is kept explicit as in P8.
  have equality : x = y := proposition5_same_nature v a4 multiplicity x y hx hy sx sy same
  exact distinct equality.symm

-- Concrete satisfiability witness: a substance, a distinct mode, and causation.
def exampleOntology : Vocabulary Bool where
  toVocabulary := Spinoza.exampleVocabulary
  actual _ := True
  sameNature x y := x = y
  canLimit _ _ := False
  essenceInvolvesExistence x := x = true

theorem example_principles :
    Spinoza.Axiom4 exampleOntology.toVocabulary ∧ Spinoza.Axiom5 exampleOntology.toVocabulary ∧
    ExistenceExplanation exampleOntology ∧ MultiplicityExplanation exampleOntology ∧
    SubstanceLimiter exampleOntology ∧
    (exampleOntology.actual true ∧ Spinoza.Substance exampleOntology.toVocabulary true) ∧
    (exampleOntology.actual false ∧ Spinoza.ModeOf exampleOntology.toVocabulary false true) ∧
    exampleOntology.causes true false := by
  refine ⟨Spinoza.fragment_has_model.1, Spinoza.fragment_has_model.2.1,
    ?_, ?_, ?_, ?_, ?_, ?_⟩
  · intro x _
    cases x with
    | false => exact Or.inr ⟨true, by decide, rfl, rfl⟩
    | true => exact Or.inl rfl
  · intro x y _ _ distinct same
    exact False.elim (distinct same)
  · intro _ _ _ _ h
    exact False.elim h
  · exact ⟨True.intro, Spinoza.fragment_has_model.2.2.1⟩
  · exact ⟨True.intro, Spinoza.fragment_has_model.2.2.2.1⟩
  · exact ⟨rfl, rfl⟩

#print axioms proposition5_same_nature
#print axioms proposition7_existing_substance
#print axioms proposition8_no_limiter
#print axioms example_principles
end PhiloForge.Spinoza.Ontology
