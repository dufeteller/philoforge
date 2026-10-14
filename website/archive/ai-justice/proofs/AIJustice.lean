import Std

/-!
AI, property and democratic justice, version 2.
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


-- A sufficiency criterion separates the author's minimum commitment from
-- the optional, stronger maximin definition. No new global axiom is introduced.
def SufficiencyJust {P R : Type} (m : Model P R) (r : R) : Prop :=
  Admissible m r ∧ ((∃ s, Admissible m s ∧ UniversalNeeds m s) → UniversalNeeds m r)

theorem maximin_implies_sufficiency {P R : Type} (m : Model P R) (r : R)
    (justice : Just m r) : SufficiencyJust m r := by
  refine ⟨justice.1, ?_⟩
  rintro ⟨s, admissible, sufficient⟩
  exact needs_from_maximin m r s justice admissible sufficient

theorem sufficient_justice_excludes_deprivation {P R : Type} (m : Model P R) (r s : R)
    (alternative : Admissible m s) (sufficient : UniversalNeeds m s)
    (deprivation : ∃ i, m.access r i < m.needs i) : ¬ SufficiencyJust m r := by
  intro justice
  have covered := justice.2 ⟨s, alternative, sufficient⟩
  obtain ⟨i, hi⟩ := deprivation
  have := covered i
  grind

def sufficientButNotMaximal : Model Bool Bool where
  needs := fun _ => 1
  needs_pos := by intro i; decide
  access := fun r _ => if r then 2 else 1
  access_nonneg := by intro r i; cases r <;> decide +kernel
  feasible := fun _ => True
  equalLiberties := fun _ => True
  democraticControl := fun _ => True
  floor := fun r => if r then 2 else 1
  floor_lower := by intro r i; cases r <;> decide +kernel
  floor_attained := by intro r; cases r <;> exact ⟨false, by decide +kernel⟩

theorem sufficiency_does_not_imply_maximin :
    SufficiencyJust sufficientButNotMaximal false ∧ ¬ Just sufficientButNotMaximal false := by
  constructor
  · exact ⟨⟨True.intro, True.intro, True.intro⟩, fun _ i => by cases i <;> decide +kernel⟩
  · intro justice
    have h := justice.2 true ⟨True.intro, True.intro, True.intro⟩
    have bad : ¬ sufficientButNotMaximal.floor true ≤ sufficientButNotMaximal.floor false := by
      decide +kernel
    exact bad h

-- Net automated output includes upkeep, energy, renewal and investment costs.
-- Human hours include every remaining human task, not just paid employment.
def netOutput (automated productivity hours : Rat) : Rat := automated + productivity * hours

def requiredLabor (needs automated productivity : Rat) : Rat :=
  if needs ≤ automated then 0 else (needs - automated) / productivity

theorem division_le_iff (a b c : Rat) (positive : 0 < b) :
    a / b ≤ c ↔ a ≤ c * b := by
  have := @Rat.lt_div_iff c a b positive
  grind

theorem le_division_iff (a b c : Rat) (positive : 0 < c) :
    a ≤ b / c ↔ a * c ≤ b := by
  have := @Rat.div_lt_iff b c a positive
  grind

theorem required_labor_nonnegative (needs automated productivity : Rat)
    (positive : 0 < productivity) : 0 ≤ requiredLabor needs automated productivity := by
  unfold requiredLabor
  split
  · exact Rat.le_refl
  · rename_i insufficient
    apply (le_division_iff 0 (needs - automated) productivity positive).mpr
    grind

theorem labor_requirement_characterization (needs automated productivity hours : Rat)
    (positive : 0 < productivity) (nonnegative : 0 ≤ hours) :
    needs ≤ netOutput automated productivity hours ↔
      requiredLabor needs automated productivity ≤ hours := by
  unfold requiredLabor
  split
  · rename_i sufficient
    have product := Rat.mul_nonneg (show 0 ≤ productivity by grind) nonnegative
    unfold netOutput
    grind
  · rw [division_le_iff (needs - automated) productivity hours positive]
    unfold netOutput
    grind

theorem automation_reduces_required_labor (needs before after productivity : Rat)
    (positive : 0 < productivity) (growth : before ≤ after) :
    requiredLabor needs after productivity ≤ requiredLabor needs before productivity := by
  have nonneg := required_labor_nonnegative needs before productivity positive
  have initial := (labor_requirement_characterization needs before productivity
    (requiredLabor needs before productivity) positive nonneg).mpr (Rat.le_refl)
  have improved : needs ≤ netOutput after productivity (requiredLabor needs before productivity) := by
    unfold netOutput at *
    grind
  exact (labor_requirement_characterization needs after productivity
    (requiredLabor needs before productivity) positive nonneg).mp improved

theorem sufficient_automation_needs_no_labor (needs automated productivity : Rat)
    (sufficient : needs ≤ automated) : requiredLabor needs automated productivity = 0 := by
  simp [requiredLabor, sufficient]

-- Contribution is an explicit index of the remuneration function. The model
-- cannot identify real moral merit or certify that every contribution is measured.
theorem equal_contribution_ownership_gap (pay : Rat → Rat)
    (contribution lowShare highShare profits population : Rat)
    (positive : 0 < profits) (unequal : lowShare < highShare) :
    income (pay contribution) lowShare profits 0 population <
      income (pay contribution) highShare profits 0 population := by
  have := Rat.mul_lt_mul_of_pos_right unequal positive
  unfold income
  grind

-- Hours and privately accumulated capital may vary independently.
def IndependentSecurity {P : Type} (needs : P → Rat) (access : P → Rat → Rat → Rat) : Prop :=
  ∀ i hours capital, 0 ≤ hours → 0 ≤ capital → needs i ≤ access i hours capital

theorem common_entitlement_secures_independence {P : Type} (needs common : P → Rat)
    (supplement : P → Rat → Rat → Rat)
    (guarantee : ∀ i, needs i ≤ common i)
    (nonnegative : ∀ i hours capital, 0 ≤ hours → 0 ≤ capital → 0 ≤ supplement i hours capital) :
    IndependentSecurity needs (fun i hours capital => common i + supplement i hours capital) := by
  intro i hours capital hoursNonneg capitalNonneg
  have := guarantee i
  have := nonnegative i hours capital hoursNonneg capitalNonneg
  grind

theorem security_without_employment_or_wealth {P : Type} (needs : P → Rat)
    (access : P → Rat → Rat → Rat) (security : IndependentSecurity needs access) :
    ∀ i, needs i ≤ access i 0 0 := by
  intro i
  exact security i 0 0 (Rat.le_refl) (Rat.le_refl)

-- This is a narrow power: unilateral withdrawal causing essential deprivation.
-- The common entitlement must remain protected under every permitted withdrawal.
def DeprivationVeto {W : Type} (needs : Rat) (accessAfter : W → Rat) : Prop :=
  ∃ withdrawal, accessAfter withdrawal < needs

theorem protected_common_access_blocks_veto {W : Type} (needs common : Rat)
    (remainder : W → Rat) (guarantee : needs ≤ common)
    (nonnegative : ∀ withdrawal, 0 ≤ remainder withdrawal) :
    ¬ DeprivationVeto needs (fun withdrawal => common + remainder withdrawal) := by
  rintro ⟨withdrawal, deprived⟩
  have := nonnegative withdrawal
  grind

-- A saturating private technology is an explicit example, not an empirical law.
def saturatedPrivateOutput (cap capital : Rat) : Rat := cap * capital / (1 + capital)

theorem saturated_private_output_bounded (cap capital : Rat)
    (capNonneg : 0 ≤ cap) (capitalNonneg : 0 ≤ capital) :
    saturatedPrivateOutput cap capital ≤ cap := by
  unfold saturatedPrivateOutput
  apply (division_le_iff (cap * capital) (1 + capital) cap (by grind)).mpr
  grind

theorem common_capacity_dominates_accumulation (cap common : Rat)
    (capNonneg : 0 ≤ cap) (commonCapacity : cap ≤ common) :
    ∀ capital, 0 ≤ capital → saturatedPrivateOutput cap capital ≤ common := by
  intro capital nonnegative
  have := saturated_private_output_bounded cap capital capNonneg nonnegative
  grind

-- Projects are complete alternative plans, so material feasibility includes
-- budgets and ecological limits. Knowledge availability alone is not approval.
def Selectable {X : Type} (solution material rights : X → Prop) (x : X) : Prop :=
  solution x ∧ material x ∧ rights x

theorem abundant_solutions_leave_material_and_rights_choices {X : Type}
    (solution material rights : X → Prop) (available : ∀ x, solution x) :
    ∀ x, Selectable solution material rights x ↔ material x ∧ rights x := by
  intro x
  exact ⟨fun h => h.2, fun h => ⟨available x, h⟩⟩

-- Legal title and effective institutions are stipulated structures, not labels
-- automatically inferred from redistribution or from a majority vote count.
structure CommonInfrastructure (P : Type) where
  collectiveTitle : Prop
  beneficiary : P → Prop
  mayPrivatizeAlone : P → Prop

def CollectiveOwnership {P : Type} (c : CommonInfrastructure P) : Prop :=
  c.collectiveTitle ∧ (∀ i, c.beneficiary i) ∧ (∀ i, ¬ c.mayPrivatizeAlone i)

structure EconomicGovernance (P X : Type) where
  voteWeight : P → Rat
  canContest : P → Prop
  protectedInitiative : X → Prop
  mayPursue : P → X → Prop
  feasible : X → Prop
  respectsRights : X → Prop
  selected : X → Prop
  implemented : X → Prop

def EconomicDemocracy {P X : Type} (g : EconomicGovernance P X) : Prop :=
  (∀ i, g.voteWeight i = 1) ∧
  (∀ i, g.canContest i) ∧
  (∀ i x, g.protectedInitiative x → g.mayPursue i x) ∧
  (∀ x, g.selected x → g.feasible x ∧ g.respectsRights x) ∧
  (∀ x, g.implemented x ↔ g.selected x)

def DemocraticCommunism {P R X : Type} (m : Model P R) (r : R)
    (c : CommonInfrastructure P) (g : EconomicGovernance P X) : Prop :=
  CollectiveOwnership c ∧ EconomicDemocracy g ∧ Admissible m r ∧ UniversalNeeds m r

theorem democratic_control_protects_contestation_and_initiative {P X : Type}
    (g : EconomicGovernance P X) (democracy : EconomicDemocracy g) :
    (∀ i, g.canContest i) ∧
    (∀ i x, g.protectedInitiative x → g.mayPursue i x) ∧
    (∀ i j, g.voteWeight i = g.voteWeight j) := by
  refine ⟨democracy.2.1, democracy.2.2.1, ?_⟩
  intro i j
  rw [democracy.1 i, democracy.1 j]

theorem implemented_economic_choices_respect_rights {P X : Type}
    (g : EconomicGovernance P X) (democracy : EconomicDemocracy g) :
    ∀ x, g.implemented x → g.feasible x ∧ g.respectsRights x := by
  intro x implemented
  exact democracy.2.2.2.1 x ((democracy.2.2.2.2 x).mp implemented)

theorem common_provision_realizes_democratic_communism {P R X : Type}
    (m : Model P R) (r : R) (c : CommonInfrastructure P) (g : EconomicGovernance P X)
    (ownership : CollectiveOwnership c) (democracy : EconomicDemocracy g)
    (admissible : Admissible m r) (common : P → Rat)
    (sufficient : ∀ i, m.needs i ≤ common i)
    (delivered : ∀ i, common i ≤ m.access r i) :
    DemocraticCommunism m r c g ∧ SufficiencyJust m r := by
  have needs : UniversalNeeds m r := by
    intro i
    have := sufficient i
    have := delivered i
    grind
  exact ⟨⟨ownership, democracy, admissible, needs⟩, ⟨admissible, fun _ => needs⟩⟩

-- A finite witness shows that these stipulated requirements can coexist.
-- It validates no historical regime and makes no prediction of real feasibility.
def commonWitness : CommonInfrastructure Bool where
  collectiveTitle := True
  beneficiary := fun _ => True
  mayPrivatizeAlone := fun _ => False

def governanceWitness : EconomicGovernance Bool Bool where
  voteWeight := fun _ => 1
  canContest := fun _ => True
  protectedInitiative := fun _ => True
  mayPursue := fun _ _ => True
  feasible := fun _ => True
  respectsRights := fun _ => True
  selected := fun x => x = true
  implemented := fun x => x = true

theorem democratic_common_institution_has_model :
    DemocraticCommunism exampleModel true commonWitness governanceWitness := by
  refine ⟨?_, ?_, ?_, ?_⟩
  · exact ⟨True.intro, fun _ => True.intro, fun _ h => h⟩
  · exact ⟨fun _ => rfl, fun _ => True.intro, fun _ _ _ => True.intro,
      fun _ _ => ⟨True.intro, True.intro⟩, fun _ => Iff.rfl⟩
  · exact ⟨True.intro, True.intro, True.intro⟩
  · intro i
    cases i <;> decide +kernel

end PhiloForge.AIJustice
