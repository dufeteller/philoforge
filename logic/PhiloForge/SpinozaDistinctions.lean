import PhiloForge.Spinoza

namespace PhiloForge.Spinoza.Distinctions

-- A qualitative reconstruction of I P2/P4/P5/P6. Attribute profiles here
-- do not silently inherit the aspect semantics of SpinozaAttributes.lean.
structure Vocabulary (Entity Attribute Modification Quality : Type)
    extends Spinoza.Vocabulary Entity where
  hasAttribute : Entity → Attribute → Prop
  hasModification : Entity → Modification → Prop
  hasQuality : Entity → Quality → Prop
  abstractEssence : Entity → Entity

def SameAttributes {E A M Q : Type} (v : Vocabulary E A M Q) (x y : E) : Prop :=
  ∀ a, v.hasAttribute x a ↔ v.hasAttribute y a

def SameModifications {E A M Q : Type} (v : Vocabulary E A M Q) (x y : E) : Prop :=
  ∀ m, v.hasModification x m ↔ v.hasModification y m

def SharesAttribute {E A M Q : Type} (v : Vocabulary E A M Q) (x y : E) : Prop :=
  ∃ a, v.hasAttribute x a ∧ v.hasAttribute y a

def AttributeDifference {E A M Q : Type} (v : Vocabulary E A M Q) (x y : E) : Prop :=
  ∃ a, ¬ (v.hasAttribute x a ↔ v.hasAttribute y a)

def ModificationDifference {E A M Q : Type} (v : Vocabulary E A M Q) (x y : E) : Prop :=
  ∃ m, ¬ (v.hasModification x m ↔ v.hasModification y m)

-- Interpretation of commonality between substances, not the converse of A5.
-- In P2, "different attributes" means disjoint profiles, not unequal profiles.
def CommonalityBridge {E A M Q : Type} (v : Vocabulary E A M Q) : Prop :=
  ∀ x y, Spinoza.Substance v.toVocabulary x → Spinoza.Substance v.toVocabulary y →
    (v.common x y ↔ SharesAttribute v x y)

-- These are general individuation and ontology principles. They are not
-- consequences of the bare substance/mode definitions in Spinoza.lean.
def QualitativeIdentity {E A M Q : Type} (v : Vocabulary E A M Q) : Prop :=
  ∀ x y, (∀ q, v.hasQuality x q ↔ v.hasQuality y q) → x = y

def QualityExhaustion {E A M Q : Type} (v : Vocabulary E A M Q) : Prop :=
  ∀ q, (∃ a, ∀ x, v.hasQuality x q ↔ v.hasAttribute x a) ∨
    (∃ m, ∀ x, v.hasQuality x q ↔ v.hasModification x m)

-- A substantive complete-essence reading of D4: a shared attribute determines
-- the whole attribute profile of substances, not their numerical identity.
def CompleteAttribute {E A M Q : Type} (v : Vocabulary E A M Q) : Prop :=
  ∀ x y a, Spinoza.Substance v.toVocabulary x → Spinoza.Substance v.toVocabulary y →
    v.hasAttribute x a → v.hasAttribute y a → SameAttributes v x y

-- Setting affections aside preserves attributes, removes modifications, and
-- preserves distinctions between substances. The last clause is substantive;
-- it is not proved by P1's asymmetric conceptual dependence alone.
def EssenceAbstraction {E A M Q : Type} (v : Vocabulary E A M Q) : Prop :=
  (∀ s, Spinoza.Substance v.toVocabulary s → SameAttributes v (v.abstractEssence s) s) ∧
  (∀ s, Spinoza.Substance v.toVocabulary s → ∀ m, ¬ v.hasModification (v.abstractEssence s) m) ∧
  (∀ s t, Spinoza.Substance v.toVocabulary s → Spinoza.Substance v.toVocabulary t →
    v.abstractEssence s = v.abstractEssence t → s = t)

theorem proposition2_disjoint_attributes {E A M Q : Type} (v : Vocabulary E A M Q)
    (meaning : CommonalityBridge v) (x y : E)
    (sx : Spinoza.Substance v.toVocabulary x) (sy : Spinoza.Substance v.toVocabulary y)
    (disjoint : ¬ SharesAttribute v x y) : ¬ v.common x y := by
  intro common
  exact disjoint ((meaning x y sx sy).1 common)

theorem profiles_determine_identity {E A M Q : Type} (v : Vocabulary E A M Q)
    (identity : QualitativeIdentity v) (exhaustion : QualityExhaustion v) (x y : E)
    (attributes : SameAttributes v x y) (modifications : SameModifications v x y) : x = y := by
  apply identity x y
  intro q
  rcases exhaustion q with ⟨a, represented⟩ | ⟨m, represented⟩
  · exact (represented x).trans ((attributes a).trans (represented y).symm)
  · exact (represented x).trans ((modifications m).trans (represented y).symm)

theorem proposition4_qualitative_distinction {E A M Q : Type} (v : Vocabulary E A M Q)
    (identity : QualitativeIdentity v) (exhaustion : QualityExhaustion v) (x y : E)
    (distinct : x ≠ y) : AttributeDifference v x y ∨ ModificationDifference v x y := by
  classical
  apply Classical.byContradiction
  intro noDifference
  apply distinct
  apply profiles_determine_identity v identity exhaustion x y
  · intro a
    apply Classical.byContradiction
    intro h
    exact noDifference (Or.inl ⟨a, h⟩)
  · intro m
    apply Classical.byContradiction
    intro h
    exact noDifference (Or.inr ⟨m, h⟩)

theorem proposition5_shared_attribute {E A M Q : Type} (v : Vocabulary E A M Q)
    (identity : QualitativeIdentity v) (exhaustion : QualityExhaustion v)
    (complete : CompleteAttribute v) (abstraction : EssenceAbstraction v) (x y : E)
    (sx : Spinoza.Substance v.toVocabulary x) (sy : Spinoza.Substance v.toVocabulary y)
    (shared : SharesAttribute v x y) : x = y := by
  classical
  obtain ⟨a, ax, ay⟩ := shared
  have same := complete x y a sx sy ax ay
  apply abstraction.2.2 x y sx sy
  apply Classical.byContradiction
  intro distinct
  rcases proposition4_qualitative_distinction v identity exhaustion
      (v.abstractEssence x) (v.abstractEssence y) distinct with ⟨b, different⟩ | ⟨m, different⟩
  · exact different ((abstraction.1 x sx b).trans ((same b).trans (abstraction.1 y sy b).symm))
  · exact different ⟨fun h => False.elim (abstraction.2.1 x sx m h),
      fun h => False.elim (abstraction.2.1 y sy m h)⟩

theorem proposition6_via_attributes {E A M Q : Type} (v : Vocabulary E A M Q)
    (identity : QualitativeIdentity v) (exhaustion : QualityExhaustion v)
    (complete : CompleteAttribute v) (abstraction : EssenceAbstraction v)
    (meaning : CommonalityBridge v)
    (a4 : Spinoza.Axiom4 v.toVocabulary) (a5 : Spinoza.Axiom5 v.toVocabulary) (x y : E)
    (sx : Spinoza.Substance v.toVocabulary x) (sy : Spinoza.Substance v.toVocabulary y)
    (distinct : x ≠ y) : ¬ v.causes x y ∧ ¬ v.causes y x := by
  have disjoint : ¬ SharesAttribute v x y := fun shared =>
    distinct (proposition5_shared_attribute v identity exhaustion complete abstraction x y sx sy shared)
  exact Spinoza.proposition3 v.toVocabulary a4 a5 x y
    (proposition2_disjoint_attributes v meaning x y sx sy disjoint)

def AttributeWitness {E A M Q : Type} (v : Vocabulary E A M Q) : Prop :=
  ∀ s, Spinoza.Substance v.toVocabulary s → ∃ a, v.hasAttribute s a

-- This predicate makes no assertion that such an entity exists. It covers
-- attributes instantiated by substances, not D6's absolute infinity.
def UniversalSubstance {E A M Q : Type} (v : Vocabulary E A M Q) (g : E) : Prop :=
  Spinoza.Substance v.toVocabulary g ∧
    ∀ s a, Spinoza.Substance v.toVocabulary s → v.hasAttribute s a → v.hasAttribute g a

-- Conditional uniqueness step toward P14. P11/existence, infinite attributes
-- and modal conceivability are deliberately not claimed here.
theorem universal_substance_unique {E A M Q : Type} (v : Vocabulary E A M Q)
    (identity : QualitativeIdentity v) (exhaustion : QualityExhaustion v)
    (complete : CompleteAttribute v) (abstraction : EssenceAbstraction v)
    (witness : AttributeWitness v) (g : E) (universal : UniversalSubstance v g) :
    ∀ s, Spinoza.Substance v.toVocabulary s → s = g := by
  intro s ss
  obtain ⟨a, ha⟩ := witness s ss
  exact proposition5_shared_attribute v identity exhaustion complete abstraction s g ss universal.1
    ⟨a, ha, universal.2 s a ss ha⟩

def Axiom1 {E A M Q : Type} (v : Vocabulary E A M Q) : Prop :=
  ∀ x, v.inItself x ∨ ∃ y, v.inOther x y

-- A1 by itself does not imply self-conception or that the other is a substance.
-- These bridges explicitly add both missing semantic links.
def ClassificationBridges {E A M Q : Type} (v : Vocabulary E A M Q) : Prop :=
  (∀ x, v.inItself x → Spinoza.Substance v.toVocabulary x) ∧
  (∀ x y, v.inOther x y → ∃ s, Spinoza.Substance v.toVocabulary s ∧ Spinoza.ModeOf v.toVocabulary x s)

theorem substance_mode_classification {E A M Q : Type} (v : Vocabulary E A M Q)
    (a1 : Axiom1 v) (bridges : ClassificationBridges v) :
    ∀ x, Spinoza.Substance v.toVocabulary x ∨
      ∃ s, Spinoza.Substance v.toVocabulary s ∧ Spinoza.ModeOf v.toVocabulary x s := by
  intro x
  rcases a1 x with self | ⟨y, other⟩
  · exact Or.inl (bridges.1 x self)
  · exact Or.inr (bridges.2 x y other)

-- Conditional step toward P15, not a proof that a universal substance exists.
theorem everything_in_universal_substance {E A M Q : Type} (v : Vocabulary E A M Q)
    (identity : QualitativeIdentity v) (exhaustion : QualityExhaustion v)
    (complete : CompleteAttribute v) (abstraction : EssenceAbstraction v)
    (witness : AttributeWitness v) (a1 : Axiom1 v) (bridges : ClassificationBridges v)
    (g : E) (universal : UniversalSubstance v g) :
    ∀ x, x = g ∨ Spinoza.ModeOf v.toVocabulary x g := by
  have unique := universal_substance_unique v identity exhaustion complete abstraction witness g universal
  intro x
  rcases substance_mode_classification v a1 bridges x with self | ⟨s, ss, mode⟩
  · exact Or.inl (unique x self)
  · have same := unique s ss
    rw [same] at mode
    exact Or.inr mode

-- Nonempty joint model: two attributes, a substance, a mode, and actual causation.
def substanceModeModel : Vocabulary Bool Bool Bool Bool where
  toVocabulary := Spinoza.exampleVocabulary
  hasAttribute s _ := s = true
  hasModification x _ := x = false
  hasQuality x q := x = q
  abstractEssence _ := true

theorem substance_mode_bridges :
    CommonalityBridge substanceModeModel ∧ QualitativeIdentity substanceModeModel ∧
    QualityExhaustion substanceModeModel ∧ CompleteAttribute substanceModeModel ∧
    EssenceAbstraction substanceModeModel ∧ AttributeWitness substanceModeModel ∧
    Axiom1 substanceModeModel ∧ ClassificationBridges substanceModeModel ∧
    UniversalSubstance substanceModeModel true ∧
    Spinoza.ModeOf substanceModeModel.toVocabulary false true ∧
    Spinoza.Axiom4 substanceModeModel.toVocabulary ∧ Spinoza.Axiom5 substanceModeModel.toVocabulary ∧
    substanceModeModel.causes true false := by
  have ss : ∀ s, Spinoza.Substance substanceModeModel.toVocabulary s → s = true := fun _ h => h.1
  have root : Spinoza.Substance substanceModeModel.toVocabulary true := Spinoza.fragment_has_model.2.2.1
  have mode : Spinoza.ModeOf substanceModeModel.toVocabulary false true := Spinoza.fragment_has_model.2.2.2.1
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, mode,
    Spinoza.fragment_has_model.1, Spinoza.fragment_has_model.2.1, Spinoza.fragment_has_model.2.2.2.2⟩
  · intro x y sx sy
    exact ⟨fun _ => ⟨true, ss x sx, ss y sy⟩, fun _ => True.intro⟩
  · intro x y same
    exact (same y).2 rfl
  · intro q
    cases q with
    | false => exact Or.inr ⟨false, fun _ => Iff.rfl⟩
    | true => exact Or.inl ⟨true, fun _ => Iff.rfl⟩
  · intro x y _ sx sy _ _ _
    exact ⟨fun _ => ss y sy, fun _ => ss x sx⟩
  · refine ⟨?_, ?_, ?_⟩
    · intro s hs _
      exact ⟨fun _ => ss s hs, fun _ => rfl⟩
    · intro _ _ _ h
      exact Bool.noConfusion h
    · intro s t hs ht _
      exact (ss s hs).trans (ss t ht).symm
  · intro s hs
    exact ⟨true, ss s hs⟩
  · intro x
    cases x with
    | false => exact Or.inr ⟨true, rfl, rfl⟩
    | true => exact Or.inl rfl
  · constructor
    · intro x hx
      change x = true at hx
      subst x
      exact root
    · intro x _ h
      change x = false ∧ _ at h
      rcases h with ⟨rfl, _⟩
      exact ⟨true, root, mode⟩
  · exact ⟨root, fun _ _ _ _ => rfl⟩

-- All bridges can hold while TWO substances exist and none is universal.
-- This independently checks that the conditional steps do not supply P11.
def pluralModel : Vocabulary Bool Bool Bool Bool where
  inItself _ := True
  inOther _ _ := False
  depends _ _ := False
  causes _ _ := False
  common x y := x = y
  hasAttribute x a := x = a
  hasModification _ _ := False
  hasQuality x q := x = q
  abstractEssence x := x

theorem plural_substance (x : Bool) : Spinoza.Substance pluralModel.toVocabulary x :=
  ⟨True.intro, fun _ _ h => h⟩

theorem all_bridges_do_not_supply_universal_substance :
    CommonalityBridge pluralModel ∧ QualitativeIdentity pluralModel ∧ QualityExhaustion pluralModel ∧
    CompleteAttribute pluralModel ∧ EssenceAbstraction pluralModel ∧ AttributeWitness pluralModel ∧
    Axiom1 pluralModel ∧ ClassificationBridges pluralModel ∧
    Spinoza.Axiom4 pluralModel.toVocabulary ∧ Spinoza.Axiom5 pluralModel.toVocabulary ∧
    Spinoza.Substance pluralModel.toVocabulary true ∧ Spinoza.Substance pluralModel.toVocabulary false ∧
    ¬ (∃ g, UniversalSubstance pluralModel g) := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, plural_substance true, plural_substance false, ?_⟩
  · intro x y _ _
    exact ⟨fun h => ⟨y, h, rfl⟩, fun ⟨_, hx, hy⟩ => hx.trans hy.symm⟩
  · intro x y same
    exact (same y).2 rfl
  · intro q
    exact Or.inl ⟨q, fun _ => Iff.rfl⟩
  · intro x y a _ _ hx hy b
    have same : x = y := hx.trans hy.symm
    rw [same]
  · exact ⟨fun _ _ _ => Iff.rfl, fun _ _ _ h => h, fun _ _ _ _ h => h⟩
  · intro s _
    exact ⟨s, rfl⟩
  · exact fun _ => Or.inl True.intro
  · exact ⟨fun x _ => plural_substance x, fun _ _ h => False.elim h⟩
  · exact fun _ _ h => h
  · exact fun _ _ _ => ⟨fun h => h, fun h => h⟩
  · intro ⟨g, universal⟩
    have ht := universal.2 true true (plural_substance true) rfl
    have hf := universal.2 false false (plural_substance false) rfl
    exact Bool.noConfusion (ht.symm.trans hf)

-- Without abstraction, qualitative identity and complete attributes still
-- permit two substances distinguished only by modifications.
def affectionModel : Vocabulary Bool Bool Bool Bool where
  inItself _ := True
  inOther _ _ := False
  depends _ _ := False
  causes _ _ := False
  common _ _ := True
  hasAttribute _ _ := True
  hasModification x m := x = m
  hasQuality x q := x = q
  abstractEssence x := x

theorem abstraction_is_needed :
    QualitativeIdentity affectionModel ∧ QualityExhaustion affectionModel ∧
    CompleteAttribute affectionModel ∧
    Spinoza.Substance affectionModel.toVocabulary true ∧
    Spinoza.Substance affectionModel.toVocabulary false ∧
    SharesAttribute affectionModel true false ∧ true ≠ false ∧
    ¬ EssenceAbstraction affectionModel := by
  refine ⟨?_, ?_, ?_, ⟨True.intro, fun _ _ h => h⟩,
    ⟨True.intro, fun _ _ h => h⟩, ⟨true, True.intro, True.intro⟩, by decide, ?_⟩
  · intro x y same
    exact (same y).2 rfl
  · intro q
    exact Or.inr ⟨q, fun _ => Iff.rfl⟩
  · exact fun _ _ _ _ _ _ _ _ => Iff.rfl
  · intro abstraction
    exact abstraction.2.1 true ⟨True.intro, fun _ _ h => h⟩ true rfl

-- Without the complete-essence reading, unequal profiles can overlap, even
-- when abstraction and qualitative individuation are both available.
def overlappingModel : Vocabulary Bool Bool Bool Bool where
  inItself _ := True
  inOther _ _ := False
  depends _ _ := False
  causes _ _ := False
  common _ _ := True
  hasAttribute s a := a = true ∨ s = true
  hasModification _ _ := False
  hasQuality s q := q = true ∨ s = true
  abstractEssence s := s

theorem complete_attribute_is_needed :
    QualitativeIdentity overlappingModel ∧ QualityExhaustion overlappingModel ∧
    EssenceAbstraction overlappingModel ∧
    Spinoza.Substance overlappingModel.toVocabulary true ∧
    Spinoza.Substance overlappingModel.toVocabulary false ∧
    SharesAttribute overlappingModel true false ∧ true ≠ false ∧
    ¬ CompleteAttribute overlappingModel := by
  have substance : ∀ s, Spinoza.Substance overlappingModel.toVocabulary s :=
    fun _ => ⟨True.intro, fun _ _ h => h⟩
  refine ⟨?_, ?_, ?_, substance true, substance false,
    ⟨true, Or.inl rfl, Or.inl rfl⟩, by decide, ?_⟩
  · intro x y same
    have iffTrue : x = true ↔ y = true := by
      constructor
      · intro h
        rcases (same false).1 (Or.inr h) with h | h
        · exact False.elim (Bool.noConfusion h)
        · exact h
      · intro h
        rcases (same false).2 (Or.inr h) with h | h
        · exact False.elim (Bool.noConfusion h)
        · exact h
    cases x <;> cases y
    · rfl
    · exact False.elim (Bool.noConfusion (iffTrue.2 rfl))
    · exact False.elim (Bool.noConfusion (iffTrue.1 rfl))
    · rfl
  · intro q
    exact Or.inl ⟨q, fun _ => Iff.rfl⟩
  · exact ⟨fun _ _ _ => Iff.rfl, fun _ _ _ h => h, fun _ _ _ _ h => h⟩
  · intro complete
    have impossible := (complete true false true (substance true) (substance false)
      (Or.inl rfl) (Or.inl rfl) false).1 (Or.inr rfl)
    rcases impossible with h | h <;> exact Bool.noConfusion h

#print axioms abstraction_is_needed
#print axioms complete_attribute_is_needed

#print axioms proposition2_disjoint_attributes
#print axioms profiles_determine_identity
#print axioms proposition4_qualitative_distinction
#print axioms proposition5_shared_attribute
#print axioms proposition6_via_attributes
#print axioms universal_substance_unique
#print axioms substance_mode_classification
#print axioms everything_in_universal_substance
#print axioms substance_mode_bridges
#print axioms all_bridges_do_not_supply_universal_substance
end PhiloForge.Spinoza.Distinctions
