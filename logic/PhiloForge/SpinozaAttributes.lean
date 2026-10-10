namespace PhiloForge.Spinoza.Attributes

-- A scoped interpretation of I D3/D4 and I P9/P10. "More reality" is
-- strict inclusion of essential aspects, not a numerical or cardinal measure.
-- The predicates needsOther name requirements EXTERNAL to the respective
-- conception; identifying these requirements across substance/attribute is
-- an explicit premise, not part of the definition of AttributeOf.
structure Vocabulary (Thing Attribute Aspect Concept : Type) where
  inItself : Thing → Prop
  substanceNeedsOther : Thing → Concept → Prop
  perceivedAsEssence : Attribute → Thing → Prop
  attributeNeedsOther : Attribute → Concept → Prop
  realityAspect : Thing → Aspect → Prop
  expressedAspect : Attribute → Aspect

def Substance {T A R C : Type} (v : Vocabulary T A R C) (s : T) : Prop :=
  v.inItself s ∧ ∀ c, ¬ v.substanceNeedsOther s c

def AttributeOf {T A R C : Type} (v : Vocabulary T A R C) (a : A) (s : T) : Prop :=
  Substance v s ∧ v.perceivedAsEssence a s

def ConceivedThroughItself {T A R C : Type} (v : Vocabulary T A R C) (a : A) : Prop :=
  ∀ c, ¬ v.attributeNeedsOther a c

-- Interpretive D4 bridge: the intellect's perception corresponds exactly
-- to the essential aspect expressed by the attribute. No completeness follows.
def EssenceRepresentation {T A R C : Type} (v : Vocabulary T A R C) : Prop :=
  ∀ a s, v.perceivedAsEssence a s ↔ v.realityAspect s (v.expressedAspect a)

-- Separate completeness premise: every realized essential aspect has some
-- attribute expressing it. No finiteness or one-to-one correspondence is assumed.
def AttributeCoverage {T A R C : Type} (v : Vocabulary T A R C) : Prop :=
  ∀ s r, v.realityAspect s r → ∃ a, v.expressedAspect a = r

-- Interpretive D4 bridge for P10: an external requirement of an attribute's
-- conception is an external requirement of its substance's conception too.
def ConceptualInheritance {T A R C : Type} (v : Vocabulary T A R C) : Prop :=
  ∀ a s c, v.perceivedAsEssence a s →
    v.attributeNeedsOther a c → v.substanceNeedsOther s c

def RealityIncludes {T A R C : Type} (v : Vocabulary T A R C) (more less : T) : Prop :=
  ∀ r, v.realityAspect less r → v.realityAspect more r

def MoreReality {T A R C : Type} (v : Vocabulary T A R C) (more less : T) : Prop :=
  RealityIncludes v more less ∧
    ∃ r, v.realityAspect more r ∧ ¬ v.realityAspect less r

def MoreAttributes {T A R C : Type} (v : Vocabulary T A R C) (more less : T) : Prop :=
  (∀ a, AttributeOf v a less → AttributeOf v a more) ∧
    ∃ a, AttributeOf v a more ∧ ¬ AttributeOf v a less

-- A genuine intermediate step: coverage is NOT needed to preserve attributes.
theorem attributes_monotone {T A R C : Type} (v : Vocabulary T A R C)
    (representation : EssenceRepresentation v) (more less : T)
    (substance : Substance v more) (includes : RealityIncludes v more less) :
    ∀ a, AttributeOf v a less → AttributeOf v a more := by
  intro a ha
  exact ⟨substance, (representation a more).2
    (includes (v.expressedAspect a) ((representation a less).1 ha.2))⟩

-- I P9: a structural reconstruction for substances under the selected D4
-- interpretation. Strict set inclusion is not a claim of greater infinite cardinality.
theorem proposition9_attribute_inclusion {T A R C : Type} (v : Vocabulary T A R C)
    (representation : EssenceRepresentation v) (coverage : AttributeCoverage v)
    (more less : T) (hm : Substance v more) (_hl : Substance v less)
    (reality : MoreReality v more less) : MoreAttributes v more less := by
  constructor
  · exact attributes_monotone v representation more less hm reality.1
  · obtain ⟨r, present, absent⟩ := reality.2
    obtain ⟨a, expresses⟩ := coverage more r present
    refine ⟨a, ⟨hm, (representation a more).2 ?_⟩, ?_⟩
    · rw [expresses]
      exact present
    · intro ha
      have h := (representation a less).1 ha.2
      rw [expresses] at h
      exact absent h

-- I P10: D3 excludes the external requirement that the disclosed bridge
-- would transmit from an attribute. No independence conclusion is assumed.
theorem proposition10_attribute_independence {T A R C : Type} (v : Vocabulary T A R C)
    (inheritance : ConceptualInheritance v) (s : T) (a : A)
    (ha : AttributeOf v a s) : ConceivedThroughItself v a := by
  intro c requirement
  exact ha.1.2 c (inheritance a s c ha.2 requirement)

-- Non-vacuous model: two substances have strictly nested reality/attribute
-- profiles, with two actual attribute witnesses. All three bridges hold.
-- This is a model of THIS fragment, not of P5 or the whole Ethics.
def exampleVocabulary : Vocabulary Bool Bool Bool Bool where
  inItself _ := True
  substanceNeedsOther _ _ := False
  perceivedAsEssence a s := a = false ∨ s = true
  attributeNeedsOther _ _ := False
  realityAspect s r := r = false ∨ s = true
  expressedAspect a := a

theorem example_substance (s : Bool) : Substance exampleVocabulary s :=
  ⟨True.intro, fun _ h => h⟩

theorem attribute_fragment_has_model :
    EssenceRepresentation exampleVocabulary ∧ AttributeCoverage exampleVocabulary ∧
    ConceptualInheritance exampleVocabulary ∧
    Substance exampleVocabulary true ∧ Substance exampleVocabulary false ∧
    MoreReality exampleVocabulary true false ∧
    MoreAttributes exampleVocabulary true false ∧
    ConceivedThroughItself exampleVocabulary true := by
  have representation : EssenceRepresentation exampleVocabulary := fun _ _ => Iff.rfl
  have coverage : AttributeCoverage exampleVocabulary := fun _ r _ => ⟨r, rfl⟩
  have inheritance : ConceptualInheritance exampleVocabulary := fun _ _ _ _ h => h
  have reality : MoreReality exampleVocabulary true false := by
    refine ⟨fun _ _ => Or.inr rfl, true, Or.inr rfl, ?_⟩
    intro h
    cases h with
    | inl h => exact Bool.noConfusion h
    | inr h => exact Bool.noConfusion h
  exact ⟨representation, coverage, inheritance, example_substance true,
    example_substance false, reality,
    proposition9_attribute_inclusion exampleVocabulary representation coverage true false
      (example_substance true) (example_substance false) reality,
    proposition10_attribute_independence exampleVocabulary inheritance true true
      ⟨example_substance true, Or.inr rfl⟩⟩

-- Necessity check for P10's interpretive bridge: perception of essence and
-- D3 alone leave attribute requirements unconstrained. This is NOT a refutation
-- of Spinoza; it diagnoses the missing connection in our primitive vocabulary.
def unlinkedConcepts : Vocabulary Bool Bool Bool Bool := { exampleVocabulary with
  attributeNeedsOther := fun _ _ => True }

theorem d3_d4_do_not_supply_conceptual_inheritance :
    EssenceRepresentation unlinkedConcepts ∧ AttributeCoverage unlinkedConcepts ∧
    AttributeOf unlinkedConcepts true true ∧
    ¬ ConceivedThroughItself unlinkedConcepts true ∧
    ¬ ConceptualInheritance unlinkedConcepts := by
  refine ⟨fun _ _ => Iff.rfl, fun _ r _ => ⟨r, rfl⟩,
    ⟨⟨True.intro, fun _ h => h⟩, Or.inr rfl⟩, ?_, ?_⟩
  · intro independent
    exact independent true True.intro
  · intro inheritance
    exact inheritance true true true (Or.inr rfl) True.intro

-- Necessity check for P9's coverage bridge: an additional reality aspect
-- need not be expressed by ANY attribute when completeness is omitted.
def incompleteAttributes : Vocabulary Bool Unit Bool Bool where
  inItself _ := True
  substanceNeedsOther _ _ := False
  perceivedAsEssence _ _ := True
  attributeNeedsOther _ _ := False
  realityAspect s r := r = false ∨ s = true
  expressedAspect _ := false

theorem more_reality_without_more_attributes :
    EssenceRepresentation incompleteAttributes ∧ ConceptualInheritance incompleteAttributes ∧
    Substance incompleteAttributes true ∧ Substance incompleteAttributes false ∧
    MoreReality incompleteAttributes true false ∧
    ¬ MoreAttributes incompleteAttributes true false ∧
    ¬ AttributeCoverage incompleteAttributes := by
  refine ⟨?_, fun _ _ _ _ h => h, ⟨True.intro, fun _ h => h⟩,
    ⟨True.intro, fun _ h => h⟩, ?_, ?_, ?_⟩
  · intro _ _
    exact ⟨fun _ => Or.inl rfl, fun _ => True.intro⟩
  · refine ⟨fun _ _ => Or.inr rfl, true, Or.inr rfl, ?_⟩
    intro h
    cases h with
    | inl h => exact Bool.noConfusion h
    | inr h => exact Bool.noConfusion h
  · intro h
    obtain ⟨_, _, absent⟩ := h.2
    exact absent ⟨⟨True.intro, fun _ h => h⟩, True.intro⟩
  · intro coverage
    obtain ⟨a, h⟩ := coverage true true (Or.inr rfl)
    exact Bool.noConfusion h

#print axioms attributes_monotone
#print axioms proposition9_attribute_inclusion
#print axioms proposition10_attribute_independence
#print axioms attribute_fragment_has_model
#print axioms d3_d4_do_not_supply_conceptual_inheritance
#print axioms more_reality_without_more_attributes
end PhiloForge.Spinoza.Attributes
