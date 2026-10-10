namespace PhiloForge.Spinoza

-- An explicit reconstruction of Ethics I, not an interpretation-free translation.
structure Vocabulary (Entity : Type) where
  inItself : Entity → Prop
  depends : Entity → Entity → Prop
  causes : Entity → Entity → Prop
  common : Entity → Entity → Prop

-- E1 D3: conceptual independence is encoded as absence of dependence on
-- another entity. This is a disclosed strengthening of the prose definition.
def Substance {Entity : Type} (v : Vocabulary Entity) (x : Entity) : Prop :=
  v.inItself x ∧ ∀ y, y ≠ x → ¬ v.depends x y

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
