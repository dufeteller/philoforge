namespace PhiloForge.Spinoza

-- An explicit reconstruction of Ethics I, not an interpretation-free translation.
structure Vocabulary (Entity : Type) where
  inItself : Entity → Prop
  inOther : Entity → Entity → Prop
  depends : Entity → Entity → Prop
  causes : Entity → Entity → Prop
  common : Entity → Entity → Prop

-- E1 D3: conceptual independence is encoded as absence of dependence on
-- another entity. This is a disclosed strengthening of the prose definition.
def Substance {Entity : Type} (v : Vocabulary Entity) (x : Entity) : Prop :=
  v.inItself x ∧ ∀ y, y ≠ x → ¬ v.depends x y

-- D5: a mode exists in and is conceived through another, distinct entity.
def ModeOf {Entity : Type} (v : Vocabulary Entity) (m s : Entity) : Prop :=
  m ≠ s ∧ v.inOther m s ∧ v.depends m s

-- P1 scope: reconstruct "prior by nature" as asymmetric conceptual dependence.
-- This is a disclosed interpretation, not a temporal relation.
def ConceptuallyPrior {Entity : Type} (v : Vocabulary Entity) (s m : Entity) : Prop :=
  v.depends m s ∧ ¬ v.depends s m

theorem proposition1 {Entity : Type} (v : Vocabulary Entity)
    (s m : Entity) (hs : Substance v s) (hm : ModeOf v m s) :
    ConceptuallyPrior v s m := by
  exact ⟨hm.2.2, hs.2 m hm.1⟩

-- E1 A4: only the direction needed for the selected demonstrations.
def Axiom4 {Entity : Type} (v : Vocabulary Entity) : Prop :=
  ∀ cause effect, v.causes cause effect → v.depends effect cause

-- E1 A5: no commonality excludes conceptual dependence in both directions.
def Axiom5 {Entity : Type} (v : Vocabulary Entity) : Prop :=
  ∀ x y, ¬ v.common x y → ¬ v.depends x y ∧ ¬ v.depends y x

theorem conceptual_separation {Entity : Type} (v : Vocabulary Entity)
    (a5 : Axiom5 v) (x y : Entity) (h : ¬ v.common x y) :
    ¬ v.depends x y ∧ ¬ v.depends y x := a5 x y h

-- E1 P3: things with nothing in common cannot cause one another.
theorem proposition3 {Entity : Type} (v : Vocabulary Entity)
    (a4 : Axiom4 v) (a5 : Axiom5 v) (x y : Entity)
    (h : ¬ v.common x y) : ¬ v.causes x y ∧ ¬ v.causes y x := by
  have separated := conceptual_separation v a5 x y h
  constructor
  · intro cause
    exact separated.2 (a4 x y cause)
  · intro cause
    exact separated.1 (a4 y x cause)

-- E1 P6 corollary: its alternative demonstration uses D3 and A4.
-- Scope: external causation, not the full original ontology of production.
theorem external_cause_excluded {Entity : Type} (v : Vocabulary Entity)
    (a4 : Axiom4 v) (s cause : Entity) (hs : Substance v s)
    (external : cause ≠ s) : ¬ v.causes cause s := by
  intro causation
  exact hs.2 cause external (a4 cause s causation)

-- P6 causal specialization of the corollary's alternative argument.
-- Both entities are substances and distinct. This does not reproduce the
-- historical P2/P3/P5 argument or equate every sense of production with cause.
theorem proposition6_causal {Entity : Type} (v : Vocabulary Entity)
    (a4 : Axiom4 v) (s t : Entity) (hs : Substance v s)
    (ht : Substance v t) (distinct : s ≠ t) :
    ¬ v.causes s t ∧ ¬ v.causes t s := by
  constructor
  · exact external_cause_excluded v a4 t s ht distinct
  · exact external_cause_excluded v a4 s t hs (Ne.symm distinct)

-- A concrete two-entity model with substance, mode and nonempty causation.
-- This proves satisfiability of this finite fragment, not all of the Ethics.
def exampleVocabulary : Vocabulary Bool where
  inItself x := x = true
  inOther x y := x = false ∧ y = true
  depends x y := x = false ∧ y = true
  causes x y := x = true ∧ y = false
  common _ _ := True

theorem fragment_has_model :
    Axiom4 exampleVocabulary ∧ Axiom5 exampleVocabulary ∧
    Substance exampleVocabulary true ∧ ModeOf exampleVocabulary false true ∧
    exampleVocabulary.causes true false := by
  refine ⟨?_, ?_, ?_, ?_, ?_⟩
  · intro cause effect h
    exact ⟨h.2, h.1⟩
  · intro x y h
    exact False.elim (h True.intro)
  · constructor
    · rfl
    · intro y _ h
      exact Bool.noConfusion h.1
  · exact ⟨by decide, ⟨rfl, rfl⟩, ⟨rfl, rfl⟩⟩
  · exact ⟨rfl, rfl⟩

#print axioms proposition1
#print axioms proposition6_causal
#print axioms fragment_has_model

-- A user test assumption, not a Spinoza axiom: one counterexample to P3.
theorem proposition3_counterexample_conflict {Entity : Type}
    (v : Vocabulary Entity) (a4 : Axiom4 v) (a5 : Axiom5 v)
    (counterexample : ∃ x y, ¬ v.common x y ∧ v.causes x y) : False := by
  obtain ⟨x, y, separate, cause⟩ := counterexample
  exact (proposition3 v a4 a5 x y separate).1 cause

#print axioms conceptual_separation
#print axioms proposition3
#print axioms external_cause_excluded
#print axioms proposition3_counterexample_conflict
end PhiloForge.Spinoza
