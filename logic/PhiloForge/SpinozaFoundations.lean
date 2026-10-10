import PhiloForge.Spinoza

namespace PhiloForge.Spinoza.Foundations

-- A candidate semantics, not a certified interpretation of the whole Ethics.
-- World indexes admissible situations, not time. No existence witness is built in.
structure Model (Thing Attribute World : Type) where
  accessible : World → World → Prop
  existsAt : World → Thing → Prop
  essenceAt : World → Thing → Prop
  inSelf : World → Thing → Prop
  inOther : World → Thing → Thing → Prop
  perSe : Thing → Prop
  conceivedThrough : Thing → Thing → Prop
  conceptRequires : Thing → Thing → Prop
  perceivedAsEssence : Attribute → Thing → Prop
  attributeContent : World → Attribute → Prop
  causes : World → Thing → Thing → Prop
  common : Thing → Thing → Prop

-- D3's positive clause and its explanatory clause remain distinguishable.
def Independent {T A W : Type} (m : Model T A W) (x : T) : Prop :=
  ∀ y, y ≠ x → ¬ m.conceptRequires x y

def Substance {T A W : Type} (m : Model T A W) (w : W) (x : T) : Prop :=
  m.inSelf w x ∧ m.perSe x

def D3Explanation {T A W : Type} (m : Model T A W) : Prop :=
  ∀ x, m.perSe x ↔ Independent m x

-- D5: the other thing is explicitly distinct. Substance of the bearer is a
-- separate premise when a result speaks of a mode OF A SUBSTANCE.
def ModeOf {T A W : Type} (m : Model T A W) (w : W) (x y : T) : Prop :=
  x ≠ y ∧ m.inOther w x y ∧ m.conceivedThrough x y

-- A disclosed bridge: conception through something requires its concept.
def ConceptionBridge {T A W : Type} (m : Model T A W) : Prop :=
  ∀ x y, m.conceivedThrough x y → m.conceptRequires x y

-- D4: the intellect perceives something as constituting a substance's essence.
-- Perception is not silently identified with an extensional essence condition.
def AttributeOf {T A W : Type} (m : Model T A W) (w : W) (a : A) (x : T) : Prop :=
  Substance m w x ∧ m.perceivedAsEssence a x

def ExpressesEssence {T A W : Type} (m : Model T A W) (a : A) (x : T) : Prop :=
  ∀ w, m.attributeContent w a ↔ m.essenceAt w x

def SharesAttribute {T A W : Type} (m : Model T A W) (w : W) (x y : T) : Prop :=
  ∃ a, AttributeOf m w a x ∧ AttributeOf m w a y

def SameAttributes {T A W : Type} (m : Model T A W) (w : W) (x y : T) : Prop :=
  ∀ a, AttributeOf m w a x ↔ AttributeOf m w a y

-- Candidate D1 reading: truth-preservation from essential conditions to
-- existence across situations. This does not yet capture hyperintensional essence.
def EssenceEntailsExistence {T A W : Type} (m : Model T A W) (x : T) : Prop :=
  ∀ w, m.essenceAt w x → m.existsAt w x

def NecessaryExistence {T A W : Type} (m : Model T A W) (w : W) (x : T) : Prop :=
  ∀ u, m.accessible w u → m.existsAt u x

-- Interpretations of A4 and A5; the conceptual reading of knowledge is explicit.
def CausalKnowledge {T A W : Type} (m : Model T A W) : Prop :=
  ∀ w c e, m.causes w c e → m.conceptRequires e c

def NoCommonConcept {T A W : Type} (m : Model T A W) : Prop :=
  ∀ x y, ¬ m.common x y → ¬ m.conceptRequires x y ∧ ¬ m.conceptRequires y x

-- A translation back to the old fragment, with its extra D3 interpretation
-- made an explicit assumption of the correspondence theorem below.
def legacyAt {T A W : Type} (m : Model T A W) (w : W) : Spinoza.Vocabulary T where
  inItself := m.inSelf w
  inOther := m.inOther w
  depends := m.conceptRequires
  causes := m.causes w
  common := m.common

theorem substance_correspondence {T A W : Type} (m : Model T A W)
    (d3 : D3Explanation m) (w : W) (x : T) :
    Substance m w x ↔ Spinoza.Substance (legacyAt m w) x := by
  constructor
  · intro h
    exact ⟨h.1, (d3 x).1 h.2⟩
  · intro h
    exact ⟨h.1, (d3 x).2 h.2⟩

theorem mode_requires_bearer {T A W : Type} (m : Model T A W)
    (bridge : ConceptionBridge m) (w : W) (x y : T) (h : ModeOf m w x y) :
    m.conceptRequires x y := bridge x y h.2.2

-- P1's conceptual reading, with the bridge no longer hidden in ModeOf.
theorem conceptual_priority {T A W : Type} (m : Model T A W)
    (d3 : D3Explanation m) (bridge : ConceptionBridge m)
    (w : W) (s mode : T) (hs : Substance m w s) (hm : ModeOf m w mode s) :
    m.conceptRequires mode s ∧ ¬ m.conceptRequires s mode := by
  exact ⟨mode_requires_bearer m bridge w mode s hm, (d3 s).1 hs.2 mode hm.1⟩

theorem no_common_cause {T A W : Type} (m : Model T A W)
    (a4 : CausalKnowledge m) (a5 : NoCommonConcept m)
    (w : W) (x y : T) (h : ¬ m.common x y) :
    ¬ m.causes w x y ∧ ¬ m.causes w y x := by
  exact ⟨fun hc => (a5 x y h).2 (a4 w x y hc),
    fun hc => (a5 x y h).1 (a4 w y x hc)⟩

theorem no_external_cause {T A W : Type} (m : Model T A W)
    (d3 : D3Explanation m) (a4 : CausalKnowledge m)
    (w : W) (s c : T) (hs : Substance m w s) (hne : c ≠ s) :
    ¬ m.causes w c s := by
  intro hc
  exact (d3 s).1 hs.2 c hne (a4 w c s hc)

-- A conditional implication, not an ontological proof: essence must be
-- instantiated throughout the accessible situations to infer necessity.
theorem necessary_of_essential_conditions {T A W : Type} (m : Model T A W)
    (w : W) (x : T) (essential : EssenceEntailsExistence m x)
    (realized : ∀ u, m.accessible w u → m.essenceAt u x) :
    NecessaryExistence m w x := by
  intro u hu
  exact essential u (realized u hu)

theorem actual_of_necessary {T A W : Type} (m : Model T A W)
    (w : W) (x : T) (reflexive : m.accessible w w)
    (necessary : NecessaryExistence m w x) : m.existsAt w x :=
  necessary w reflexive

-- Finite model with two distinguishable attribute profiles sharing one attribute.
-- Its purpose is to keep the two formulations of P5 distinct, not refute P5.
def profileModel : Model Bool Bool Bool where
  accessible _ _ := True
  existsAt w _ := w = true
  essenceAt _ _ := False
  inSelf _ _ := True
  inOther _ _ _ := False
  perSe _ := True
  conceivedThrough _ _ := False
  conceptRequires _ _ := False
  perceivedAsEssence a x := a = false ∨ x = true
  attributeContent _ _ := False
  causes _ _ _ := False
  common _ _ := True

theorem sharing_is_not_same_profile :
    SharesAttribute profileModel true true false ∧
    ¬ SameAttributes profileModel true true false := by
  constructor
  · exact ⟨false, ⟨⟨True.intro, True.intro⟩, Or.inl rfl⟩,
      ⟨⟨True.intro, True.intro⟩, Or.inl rfl⟩⟩
  · intro equal
    have h := (equal true).1 ⟨⟨True.intro, True.intro⟩, Or.inr rfl⟩
    cases h.2 with
    | inl h => exact Bool.noConfusion h
    | inr h => exact Bool.noConfusion h

theorem essence_implication_does_not_supply_existence :
    EssenceEntailsExistence profileModel true ∧ ¬ profileModel.existsAt false true := by
  exact ⟨fun _ h => False.elim h, fun h => Bool.noConfusion h⟩

theorem actual_is_not_necessary :
    profileModel.existsAt true true ∧ ¬ NecessaryExistence profileModel true true := by
  exact ⟨rfl, fun h => Bool.noConfusion (h false True.intro)⟩

-- No existential commitment about substance follows just from D3's definition.
def emptyModel : Model Bool Bool Bool := { profileModel with
  existsAt := fun _ _ => False
  inSelf := fun _ _ => False }

theorem definitions_allow_no_existing_substance :
    D3Explanation emptyModel ∧ ConceptionBridge emptyModel ∧
    CausalKnowledge emptyModel ∧ NoCommonConcept emptyModel ∧
    ¬ (∃ w x, emptyModel.existsAt w x ∧ Substance emptyModel w x) := by
  refine ⟨?_, ?_, ?_, ?_, ?_⟩
  · intro _
    exact ⟨fun _ _ _ h => h, fun _ => True.intro⟩
  · intro _ _ h
    exact False.elim h
  · intro _ _ _ h
    exact False.elim h
  · intro _ _ h
    exact False.elim (h True.intro)
  · intro ⟨_, _, h, _⟩
    exact h

-- A nonempty model also realizes the reconstructed P1/P3 setting.
def substanceModeModel : Model Bool Bool Bool where
  accessible _ _ := True
  existsAt _ _ := True
  essenceAt _ x := x = true
  inSelf _ x := x = true
  inOther _ x y := x = false ∧ y = true
  perSe x := x = true
  conceivedThrough x y := x = false ∧ y = true
  conceptRequires x y := x = false ∧ y = true
  perceivedAsEssence _ x := x = true
  attributeContent _ _ := True
  causes _ c e := c = true ∧ e = false
  common _ _ := True

theorem foundations_have_substance_and_mode :
    D3Explanation substanceModeModel ∧ ConceptionBridge substanceModeModel ∧
    CausalKnowledge substanceModeModel ∧ NoCommonConcept substanceModeModel ∧
    Substance substanceModeModel true true ∧ ModeOf substanceModeModel true false true ∧
    substanceModeModel.existsAt true true ∧ substanceModeModel.existsAt true false ∧
    substanceModeModel.causes true true false := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, True.intro, True.intro, ?_⟩
  · intro x
    cases x with
    | false =>
      constructor
      · intro h
        exact False.elim (Bool.noConfusion h)
      · intro h
        exact False.elim (h true (by decide) ⟨rfl, rfl⟩)
    | true =>
      constructor
      · intro _ y _ h
        exact Bool.noConfusion h.1
      · intro _
        rfl
  · intro _ _ h
    exact h
  · intro _ _ _ h
    exact ⟨h.2, h.1⟩
  · intro _ _ h
    exact False.elim (h True.intro)
  · exact ⟨rfl, rfl⟩
  · exact ⟨by decide, ⟨rfl, rfl⟩, ⟨rfl, rfl⟩⟩
  · exact ⟨rfl, rfl⟩

-- P2 attempt: even disjoint attribute profiles do not connect the currently
-- primitive commonality relation to D3/D4. A5 does not give its converse.
def disjointAttributeModel : Model Bool Bool Bool := { profileModel with
  perceivedAsEssence := fun a s => a = s }

theorem disjoint_attributes_do_not_yet_exclude_commonality :
    D3Explanation disjointAttributeModel ∧ ConceptionBridge disjointAttributeModel ∧
    CausalKnowledge disjointAttributeModel ∧ NoCommonConcept disjointAttributeModel ∧
    Substance disjointAttributeModel true true ∧ Substance disjointAttributeModel true false ∧
    ¬ SharesAttribute disjointAttributeModel true true false ∧
    disjointAttributeModel.common true false := by
  refine ⟨?_, fun _ _ h => h, fun _ _ _ h => h, ?_,
    ⟨True.intro, True.intro⟩, ⟨True.intro, True.intro⟩, ?_, True.intro⟩
  · intro _
    exact ⟨fun _ _ _ h => h, fun _ => True.intro⟩
  · intro _ _ h
    exact False.elim (h True.intro)
  · intro ⟨a, left, right⟩
    exact Bool.noConfusion (left.2.symm.trans right.2)

-- P4 attempt: distinct things may have the same attribute and mode profiles
-- in the primitive model. A principle about identity/discernibility is missing.
def indiscernibleModel : Model Bool Bool Bool := { profileModel with
  perceivedAsEssence := fun _ _ => True }

theorem distinct_things_can_have_identical_profiles :
    D3Explanation indiscernibleModel ∧ ConceptionBridge indiscernibleModel ∧
    CausalKnowledge indiscernibleModel ∧ NoCommonConcept indiscernibleModel ∧
    indiscernibleModel.existsAt true true ∧ indiscernibleModel.existsAt true false ∧
    Substance indiscernibleModel true true ∧ Substance indiscernibleModel true false ∧
    (true : Bool) ≠ false ∧ SameAttributes indiscernibleModel true true false ∧
    (∀ z, ModeOf indiscernibleModel true z true ↔ ModeOf indiscernibleModel true z false) := by
  refine ⟨?_, fun _ _ h => h, fun _ _ _ h => h, ?_, rfl, rfl,
    ⟨True.intro, True.intro⟩, ⟨True.intro, True.intro⟩, by decide, fun _ => Iff.rfl, ?_⟩
  · intro _
    exact ⟨fun _ _ _ h => h, fun _ => True.intro⟩
  · intro _ _ h
    exact False.elim (h True.intro)
  · intro _
    exact ⟨fun h => False.elim h.2.1, fun h => False.elim h.2.1⟩

#print axioms disjoint_attributes_do_not_yet_exclude_commonality
#print axioms distinct_things_can_have_identical_profiles
#print axioms foundations_have_substance_and_mode

#print axioms substance_correspondence
#print axioms conceptual_priority
#print axioms no_common_cause
#print axioms no_external_cause
#print axioms necessary_of_essential_conditions
#print axioms actual_of_necessary
#print axioms sharing_is_not_same_profile
#print axioms essence_implication_does_not_supply_existence
#print axioms actual_is_not_necessary
#print axioms definitions_allow_no_existing_substance
end PhiloForge.Spinoza.Foundations
