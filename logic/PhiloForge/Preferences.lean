namespace PhiloForge.Preferences

-- Weak preference: r a b means that a is at least as desirable as b.
def Strict {α : Type} (r : α → α → Prop) (a b : α) : Prop :=
  r a b ∧ ¬ r b a

def Transitive {α : Type} (r : α → α → Prop) : Prop :=
  ∀ a b c, r a b → r b c → r a c

def Complete {α : Type} (r : α → α → Prop) : Prop :=
  ∀ a b, r a b ∨ r b a

-- A definition-only result: no transitivity or completeness is needed.
theorem strict_asymmetric {α : Type} {r : α → α → Prop} {a b : α}
    (hab : Strict r a b) : ¬ Strict r b a := by
  intro hba
  exact hab.2 hba.1

theorem strict_transitive {α : Type} {r : α → α → Prop}
    (ht : Transitive r) {a b c : α}
    (hab : Strict r a b) (hbc : Strict r b c) : Strict r a c := by
  constructor
  · exact ht a b c hab.1 hbc.1
  · intro hca
    exact hab.2 (ht b c a hbc.1 hca)

theorem no_strict_three_cycle {α : Type} {r : α → α → Prop}
    (ht : Transitive r) {a b c : α}
    (hab : Strict r a b) (hbc : Strict r b c) : ¬ Strict r c a := by
  exact strict_asymmetric (strict_transitive ht hab hbc)

theorem complete_reflexive {α : Type} {r : α → α → Prop}
    (hc : Complete r) (a : α) : r a a := by
  cases hc a a with
  | inl h => exact h
  | inr h => exact h

-- A greatest option among three, allowing ties and repeated options.
-- No utility function or claim about all infinite sets is involved.
theorem greatest_of_three {α : Type} {r : α → α → Prop}
    (ht : Transitive r) (hc : Complete r) (a b c : α) :
    ∃ x, r x a ∧ r x b ∧ r x c := by
  cases hc a b with
  | inl hab =>
    cases hc a c with
    | inl hac => exact ⟨a, complete_reflexive hc a, hab, hac⟩
    | inr hca => exact ⟨c, hca, ht c a b hca hab, complete_reflexive hc c⟩
  | inr hba =>
    cases hc b c with
    | inl hbc => exact ⟨b, hba, complete_reflexive hc b, hbc⟩
    | inr hcb => exact ⟨c, ht c b a hcb hba, hcb, complete_reflexive hc c⟩

#print axioms strict_asymmetric
#print axioms strict_transitive
#print axioms no_strict_three_cycle
#print axioms complete_reflexive
#print axioms greatest_of_three
end PhiloForge.Preferences
