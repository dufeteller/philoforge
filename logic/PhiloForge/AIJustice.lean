import Std

/-!
AI, property and democratic justice, version 1.
Exact rational, finite-population model. Normative commitments are explicit
parameters/definitions; none is a global logical assumption. Institutional
feasibility, liberties and democratic control are predicates, not established
empirical facts. Production is net of maintenance and required investment.
-/
namespace PhiloForge.AIJustice

-- Using a witnessed lower bound avoids silently assuming that an infimum
-- is attained. With positive needs, this is exactly min_i (access_i / needs_i).
structure Model (Person Regime : Type) where
  needs : Person → Rat
  needs_pos : ∀ i, 0 < needs i
  access : Regime → Person → Rat
  access_nonneg : ∀ r i, 0 ≤ access r i
  feasible : Regime → Prop
  equalLiberties : Regime → Prop
  democraticControl : Regime → Prop
  floor : Regime → Rat
  floor_lower : ∀ r i, floor r * needs i ≤ access r i
  floor_attained : ∀ r, ∃ i, access r i = floor r * needs i

def Admissible {P R : Type} (m : Model P R) (r : R) : Prop :=
  m.feasible r ∧ m.equalLiberties r ∧ m.democraticControl r

-- J1 is the admissibility requirement. J2 is the maximin comparison.
-- The definition does not assert that a just regime exists.
def Just {P R : Type} (m : Model P R) (r : R) : Prop :=
  Admissible m r ∧ ∀ s, Admissible m s → m.floor s ≤ m.floor r

def UniversalNeeds {P R : Type} (m : Model P R) (r : R) : Prop :=
  ∀ i, m.needs i ≤ m.access r i

theorem universal_needs_iff_floor {P R : Type} (m : Model P R) (r : R) :
    UniversalNeeds m r ↔ 1 ≤ m.floor r := by
  constructor
  · intro h
    obtain ⟨i, hi⟩ := m.floor_attained r
    have hni := h i
    have hm : 1 * m.needs i ≤ m.floor r * m.needs i := by grind
    exact Rat.le_of_mul_le_mul_right hm (m.needs_pos i)
  · intro h i
    have hm := Rat.mul_le_mul_of_nonneg_right h (show 0 ≤ m.needs i by
      have := m.needs_pos i; grind)
    have hl := m.floor_lower r i
    grind

theorem just_is_admissible {P R : Type} (m : Model P R) (r : R)
    (justice : Just m r) : Admissible m r := justice.1

-- The formerly independent no-avoidable-deprivation principle is derived.
theorem needs_from_maximin {P R : Type} (m : Model P R) (r s : R)
    (justice : Just m r) (alternative : Admissible m s)
    (sufficient : UniversalNeeds m s) : UniversalNeeds m r := by
  have hs := (universal_needs_iff_floor m s).mp sufficient
  have hr := justice.2 s alternative
  apply (universal_needs_iff_floor m r).mpr
  grind

theorem avoidable_deprivation_not_just {P R : Type} (m : Model P R) (r s : R)
    (alternative : Admissible m s) (sufficient : UniversalNeeds m s)
    (deprivation : ∃ i, m.access r i < m.needs i) : ¬ Just m r := by
  intro justice
  obtain ⟨i, hi⟩ := deprivation
  have hn := needs_from_maximin m r s justice alternative sufficient i
  grind

theorem strictly_better_rules_out_justice {P R : Type} (m : Model P R) (r s : R)
    (alternative : Admissible m s) (better : m.floor r < m.floor s) :
    ¬ Just m r := by
  intro justice
  have := justice.2 s alternative
  grind

theorem unique_best_is_unique_just {P R : Type} (m : Model P R) (best : R)
    (admissible : Admissible m best)
    (strict : ∀ r, Admissible m r → r ≠ best → m.floor r < m.floor best) :
    Just m best ∧ ∀ r, Just m r → r = best := by
  classical
  constructor
  · refine ⟨admissible, ?_⟩
    intro r hr
    by_cases same : r = best
    · subst r; grind
    · have := strict r hr same; grind
  · intro r hr
    apply Classical.byContradiction
    intro different
    have hlt := strict r hr.1 different
    have hle := hr.2 best admissible
    grind

theorem no_maximum_no_just {P R : Type} (m : Model P R)
    (improvement : ∀ r, Admissible m r →
      ∃ s, Admissible m s ∧ m.floor r < m.floor s) :
    ¬ ∃ r, Just m r := by
  rintro ⟨r, hr⟩
  obtain ⟨s, hs, better⟩ := improvement r hr.1
  exact strictly_better_rules_out_justice m r s hs better hr

theorem strict_best_conflicts_with_improvement {P R : Type} (m : Model P R) (best : R)
    (admissible : Admissible m best)
    (strict : ∀ r, Admissible m r → r ≠ best → m.floor r < m.floor best)
    (improvement : ∀ r, Admissible m r →
      ∃ s, Admissible m s ∧ m.floor r < m.floor s) : False := by
  have bestJust := (unique_best_is_unique_just m best admissible strict).1
  exact no_maximum_no_just m improvement ⟨best, bestJust⟩

def income (labor share profits redistribution population : Rat) : Rat :=
  labor + (1 - redistribution) * share * profits + redistribution * profits / population

theorem income_change_identity (l0 l1 share p0 p1 n : Rat) :
    income l1 share p1 0 n - income l0 share p0 0 n =
      (l1 - l0) + share * (p1 - p0) := by
  unfold income
  grind

theorem loss_threshold (l0 l1 share p0 p1 n : Rat) (growth : 0 < p1 - p0) :
    income l1 share p1 0 n < income l0 share p0 0 n ↔
      share < (l0 - l1) / (p1 - p0) := by
  rw [Rat.lt_div_iff growth]
  unfold income
  grind

theorem nonowner_access (labor profits redistribution population : Rat) :
    income labor 0 profits redistribution population =
      labor + redistribution * profits / population := by
  unfold income
  grind

-- Total over an explicit list. The population list is distinct/exhaustive
-- when interpreting the total economically; the algebra works for any list.
def total {P : Type} (people : List P) (f : P → Rat) : Rat :=
  match people with
  | [] => 0
  | i :: rest => f i + total rest f

theorem total_linear {P : Type} (people : List P) (f g : P → Rat) (a b : Rat) :
    total people (fun i => a * f i + b * g i) =
      a * total people f + b * total people g := by
  induction people with
  | nil => simp [total]; grind
  | cons i rest ih => simp only [total]; rw [ih]; grind

theorem total_monotone {P : Type} (people : List P) (f g : P → Rat)
    (h : ∀ i, i ∈ people → f i ≤ g i) : total people f ≤ total people g := by
  induction people with
  | nil => simp [total]
  | cons i rest ih =>
    have hhead := h i (by simp)
    have hrest := ih (fun j hj => h j (by simp [hj]))
    simp only [total]
    grind

theorem maximin_resource_bound {P : Type} (people : List P) (needs access : P → Rat)
    (q Y : Rat) (lower : ∀ i, i ∈ people → q * needs i ≤ access i)
    (budget : total people access ≤ Y) : q * total people needs ≤ Y := by
  have hsum := total_monotone people (fun i => q * needs i) access lower
  have hlinear := total_linear people needs (fun _ => 0) q 0
  simp only [Rat.zero_mul, Rat.add_zero] at hlinear
  rw [hlinear] at hsum
  grind

theorem proportional_allocation_attains {P : Type} (people : List P)
    (needs access : P → Rat) (q Y : Rat)
    (needsPositive : ∀ i, 0 < needs i)
    (lower : ∀ i, i ∈ people → q * needs i ≤ access i)
    (budget : total people access ≤ Y) (positive : 0 < total people needs) :
    q ≤ Y / total people needs ∧
    total people (fun i => (Y / total people needs) * needs i) = Y ∧
    ∀ i, ((Y / total people needs) * needs i) / needs i = Y / total people needs := by
  have bound := maximin_resource_bound people needs access q Y lower budget
  have nz : total people needs ≠ 0 := by grind
  have lin := total_linear people needs (fun _ => 0) (Y / total people needs) 0
  simp only [Rat.zero_mul, Rat.add_zero] at lin
  constructor
  · apply Classical.byContradiction
    intro h
    have hlt : Y / total people needs < q := by grind
    have := (Rat.div_lt_iff positive).mp hlt
    grind
  · constructor
    · rw [lin]
      grind
    · intro i
      have hi : needs i ≠ 0 := by have := needsPositive i; grind
      grind

theorem collective_improvement_iff (privateOutput commonOutput laborShare tax n : Rat)
    (population : 0 < n) (production : 0 < privateOutput) :
    income (laborShare * privateOutput / n) 0
      ((1 - laborShare) * privateOutput) tax n < commonOutput / n ↔
    laborShare + tax * (1 - laborShare) < commonOutput / privateOutput := by
  have hn : n ≠ 0 := by grind
  have identity : income (laborShare * privateOutput / n) 0
      ((1 - laborShare) * privateOutput) tax n =
      ((laborShare + tax * (1 - laborShare)) * privateOutput) / n := by
    unfold income
    grind
  rw [identity, Rat.div_lt_iff population]
  have cancel : (commonOutput / n) * n = commonOutput := by grind
  rw [cancel, Rat.lt_div_iff production]

def MajorityWins (yes no : Nat) : Prop := no < yes

theorem majority_choice (yes no n : Nat) (ballots : yes + no = n)
    (majority : n < 2 * yes) : MajorityWins yes no := by
  unfold MajorityWins
  omega

theorem collective_innovation_not_necessary {R : Type}
    (privateConcentration sustainableInnovation : R → Prop) (common : R)
    (innovation : sustainableInnovation common) (collective : ¬ privateConcentration common) :
    ¬ (∀ r, sustainableInnovation r → privateConcentration r) := by
  intro necessary
  exact collective (necessary common innovation)

-- Concrete nonempty institutional model: two citizens, two feasible regimes.
-- Bool is a label only: true names the equal collective allocation.
def exampleModel : Model Bool Bool where
  needs := fun _ => 1
  needs_pos := by intro i; decide
  access := fun r i => if r then 1 else if i then 2 else 0
  access_nonneg := by intro r i; cases r <;> cases i <;> decide +kernel
  feasible := fun _ => True
  equalLiberties := fun _ => True
  democraticControl := fun _ => True
  floor := fun r => if r then 1 else 0
  floor_lower := by intro r i; cases r <;> cases i <;> decide +kernel
  floor_attained := by intro r; cases r <;> exact ⟨false, by decide +kernel⟩

theorem reduced_principles_have_model :
    Just exampleModel true ∧ UniversalNeeds exampleModel true ∧ ¬ Just exampleModel false := by
  have good : Just exampleModel true := by
    refine ⟨⟨True.intro, True.intro, True.intro⟩, ?_⟩
    intro r _
    cases r <;> decide +kernel
  have needs : UniversalNeeds exampleModel true := by intro i; cases i <;> decide +kernel
  refine ⟨good, needs, ?_⟩
  apply avoidable_deprivation_not_just exampleModel false true good.1 needs
  exact ⟨false, by decide +kernel⟩

def before (i : Nat) : Rat := if i < 10 then 14 / 5 else 4 / 5
def after (i : Nat) : Rat := if i < 10 then 191 / 10 else 1 / 10

theorem majority_loss_example :
    total (List.range 100) before = 100 ∧
    total (List.range 100) after = 200 ∧
    ((List.range 100).filter (fun i => after i < before i)).length = 90 ∧
    ((List.range 100).filter (fun i => after i < (3 / 4 : Rat))).length = 90 ∧
    total (List.range 100) (fun _ => (3 / 4 : Rat)) = 75 := by
  decide +kernel

theorem redistribution_repairs_example :
    income (1 / 10) 0 190 (13 / 38) 100 = (3 / 4 : Rat) := by
  decide +kernel

end PhiloForge.AIJustice
