import PhiloForge.Spinoza

namespace PhiloForge.Spinoza.Limits

-- Countermodels of the current website fragment, NOT of the full Ethics.
-- Definitions interpret terms; they do not supply existence principles.
def pluralVocabulary : Vocabulary Bool where
  inItself _ := True
  inOther _ _ := False
  depends _ _ := False
  causes _ _ := False
  common _ _ := True

theorem plural_model :
    Axiom4 pluralVocabulary ∧ Axiom5 pluralVocabulary ∧
    Substance pluralVocabulary false ∧ Substance pluralVocabulary true := by
  refine ⟨?_, ?_, ?_, ?_⟩
  · intro _ _ h
    exact h
  · intro _ _ h
    exact False.elim (h True.intro)
  · exact ⟨True.intro, fun _ _ h => h⟩
  · exact ⟨True.intro, fun _ _ h => h⟩

-- Monism cannot be inferred from just the current encoded D3/A4/A5.
theorem current_fragment_does_not_force_uniqueness :
    ¬ (∀ (v : Vocabulary Bool), Axiom4 v → Axiom5 v →
      ∀ x y, Substance v x → Substance v y → x = y) := by
  intro claim
  have equality := claim pluralVocabulary plural_model.1 plural_model.2.1
    false true plural_model.2.2.1 plural_model.2.2.2
  exact Bool.noConfusion equality

-- Absence of dependence does not imply absence of commonality (A5 is one-way).
theorem independent_substances_can_have_commonality :
    Substance pluralVocabulary false ∧ Substance pluralVocabulary true ∧
    (¬ pluralVocabulary.depends false true) ∧
    (¬ pluralVocabulary.depends true false) ∧
    pluralVocabulary.common false true := by
  exact ⟨plural_model.2.2.1, plural_model.2.2.2,
    fun h => h, fun h => h, True.intro⟩

-- Excluding an external cause does not establish that any cause exists.
theorem current_fragment_does_not_force_self_causation :
    ¬ (∀ (v : Vocabulary Bool), Axiom4 v → Axiom5 v →
      ∀ s, Substance v s → v.causes s s) := by
  intro claim
  exact claim pluralVocabulary plural_model.1 plural_model.2.1
    false plural_model.2.2.1

-- A precise additional premise that would close this particular causal gap.
-- This is NOT E1 P7: causal self-relation does not encode essence/existence.
theorem self_causation_if_a_cause_exists {Entity : Type}
    (v : Vocabulary Entity) (a4 : Axiom4 v) (s : Entity)
    (hs : Substance v s) (hasCause : ∃ c, v.causes c s) :
    v.causes s s := by
  obtain ⟨c, hc⟩ := hasCause
  by_cases equal : c = s
  · simpa only [equal] using hc
  · exact False.elim (external_cause_excluded v a4 s c hs equal hc)

#print axioms plural_model
#print axioms current_fragment_does_not_force_uniqueness
#print axioms independent_substances_can_have_commonality
#print axioms current_fragment_does_not_force_self_causation
#print axioms self_causation_if_a_cause_exists
end PhiloForge.Spinoza.Limits
