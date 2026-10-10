import PhiloForge.Preferences
namespace PhiloForge.Conflicts
-- Identical agent/situation vocabulary on both sides is essential.
theorem alternatives_conflict {Agent Situation : Type}
    (alternatives : Agent → Situation → Prop)
    (exists_alternatives : ∃ a s, alternatives a s)
    (no_alternatives : ∀ a s, ¬ alternatives a s) : False := by
  obtain ⟨a, s, h⟩ := exists_alternatives
  exact no_alternatives a s h

theorem transitivity_cycle_conflict {α : Type} {r : α → α → Prop}
    (ht : PhiloForge.Preferences.Transitive r)
    (cycle : ∃ a b c, PhiloForge.Preferences.Strict r a b ∧
      PhiloForge.Preferences.Strict r b c ∧ PhiloForge.Preferences.Strict r c a) : False := by
  obtain ⟨a, b, c, hab, hbc, hca⟩ := cycle
  exact PhiloForge.Preferences.no_strict_three_cycle ht hab hbc hca

#print axioms alternatives_conflict
#print axioms transitivity_cycle_conflict
end PhiloForge.Conflicts
