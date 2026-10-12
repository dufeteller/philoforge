# AI, property and democratic justice

The bilingual theory is at `/philoforge/ai-justice/`. Its detail page has its own
selection state; the shared workshop also offers it beside Spinoza with
namespaced premises and a common deduction map.

## Founding text and normative choices

The founding text covers contribution and property, access independent of
employment, necessary work, innovation priorities, common productive capacity,
economic dependence, democracy, the communist ideal, and humanity's historical
intellectual position. The coverage section links each argument to scoped results.
Historical framing remains prose. The requested mathematics example is omitted.

The minimal commitments are **J1** (equal liberties and effective democracy) and
**J3** (universal essential provision whenever a sufficient admissible alternative
exists). `SufficiencyJust` names this criterion. **J2** maximin is an optional
strengthening; `Just` retains its earlier meaning and every previous result.
Lean proves `Just → SufficiencyJust` and a counterexample to the converse.
The default selects D1, J1, J3, H1 and H2 without automatically adopting maximin.
Existing saved choices are preserved. No moral principle is proved true by Lean.

Definitions D1–D8 and hypotheses H10–H19 expose the additional models. The full
preset includes both compatible criteria and excludes H9, which conflicts with H3.

## Exact formal scope

`logic/PhiloForge/AIJustice.lean` uses Lean 4.34.1 and the standard library, with
exact rational quantities. A model has positive needs, nonnegative access and a
witnessed lowest ratio. The floor is encoded by `floor * needs <= access` for
everyone and equality for a witness. Positive needs make this equivalent to the
minimum of access divided by needs. The witness excludes an empty population or
an unattained infimum. Liberty, feasibility and democracy are uninterpreted
institutional predicates: satisfying them is a premise, not an empirical theorem.

`Just` combines admissibility and maximin. Its definition does not declare that
any actual economy is just, or that communism is uniquely optimal. Strict
institutional superiority is a separate hypothesis.

The finite resource proofs sum over an explicit list. For a population reading,
the list must enumerate the population once. Resource composition, divisibility,
fixed net output and institutional implementability remain economic assumptions.
The algebraic theorem bounds any common lower satisfaction ratio and proves that
the proportional allocation spends exactly the budget. The theorem also checks that each pointwise ratio equals
the proportionality factor under positive needs. Production responses to redistribution,
transition costs and incentives must be incorporated into feasibility and net output
before using the institutional comparison.

Income is `labor + (1-tax)*share*profits + tax*profits/population`. The change
identity and loss threshold use fixed ownership and zero redistribution. The
collective comparison is for a nonowner under equal labor incomes, positive
population and positive private output. An application to a majority additionally
requires a majority of such individuals; material preference is not a voting rule.

The vote theorem proves only the natural-number count implication. Equal,
informed, free voting, admissible alternatives and actual implementation are
separate institutional premises. The innovation theorem is a logical
counterexample to necessity, conditional on an actual sustainable collective
alternative. It does not prove the existence of such infrastructure.

A two-person witness demonstrates that the reduced framework has a nonempty
model. Its liberty/democracy predicates are true by construction, not an assessment
of a real institution. The 100-person example is kernel-evaluated, including exact
total output and counts of loss and deprivation. A redistribution counterexample
shows that private ownership and universal essential access need not conflict.

## Website and proof synchronization

`website/dist/data/ai-justice.json` is the versioned English registry; translations
are in the shared `locales.js`. Every result lists its selected premises, proof
steps, scope, full Lean name and exact source. Definitions and built-in model
constraints remain in force when checkboxes are cleared. A selected checkbox
explores a conditional premise; it does not assert empirical truth or execute Lean.

The interactive economy uses browser arithmetic and is labeled illustrative.
Only the stated exact examples and general conditional propositions are compiled
Lean results. Simulation controls preserve total output, update actual population
counts and handle the all-owner case without a fictitious nonowner group.

After editing Lean or the registry:

```sh
node scripts/check-ai-justice.cjs --write
node scripts/check-ai-justice.cjs
node website/tests/ai-justice.cjs
cd logic && lake build
```

The generator binds the exact proof text, theorem source line, downloadable Lean
file and compiled audit references. The main Lean target imports those references.
Every displayed result and helper is audited with `#print axioms`; no admitted
proofs, global philosophical axioms or native-evaluation proof shortcuts are used.

## Interpretation

The formal results support conditional democratic collective provision. They do
not establish the impossibility of capitalism, a prediction that most people will
lose from AI, or the unique superiority of communism. Mixed institutions and
widely distributed private ownership remain possible competitors under the same
criteria. A majority's preference neither establishes justice by itself nor
licenses violating a minority's fundamental liberties.

Selecting H3 (strictly best admissible regime) with H9 (every admissible regime
can be strictly improved) replaces the result list with their compiled conflict
proof. This detects one known incompatibility, not arbitrary model consistency.

## Additional models and limits

- Necessary work: net output is `A + pL`. With positive human productivity,
  required work is zero when A covers B, otherwise `(B-A)/p`. The exact threshold
  and weak decrease with increased automation are proved at fixed needs and
  productivity. Net output must include upkeep, energy, renewal, investment and
  all remaining human tasks. Actual working-time policy and distribution remain
  institutional choices.
- Contribution and property: the same modeled contribution is paid through the
  same function. Positive capital income and unequal ownership still produce an
  income gap. This neither measures moral merit nor exhausts property arguments.
- Independent security: a sufficient common entitlement and nonnegative
  supplements cover needs for every nonnegative work/capital choice, including
  zero work and zero wealth. Society may still require work from others.
- Deprivation veto: protected common access excludes specified private withdrawals
  causing essential deprivation. Capture, violence and other domination are not
  covered. The entitlement must actually survive every modeled withdrawal.
- Productive dominance: `M*K/(1+K)` is bounded by M for every nonnegative finite K.
  Common output at least M is therefore never exceeded in that scenario. This
  saturation law, quality, sustainability and common capacity are not inferred
  from AI. The comparison is of output, not every person's utility or privilege.
- Priorities: available technical solutions remove only one eligibility condition.
  Material feasibility and rights remain. The result does not rank alternatives,
  prove that several eligible plans exist or solve all scientific problems.
- Collective ownership: common title, universal beneficiary status and no
  unilateral privatization concern productive infrastructure. Personal possessions
  are outside the definition; redistribution alone does not imply common title.
- Economic democracy: equal voting weights, universal contestation, protected
  initiatives, feasible rights-respecting choices and implementation exactly of
  selected plans are explicit institutional requirements. This ideal specification
  is not a voting algorithm, a guarantee of funding every initiative, a proof of
  real enforcement or the absence of informal influence.
- Democratic communism: common title, specified governance, admissibility and
  actual universal provision satisfy `DemocraticCommunism` and `SufficiencyJust`.
  These records must describe the same candidate institution. A finite witness
  shows the requirements coexist abstractly, without proving real feasibility,
  a transition strategy or unique superiority.

The automation-to-work and common-provision-to-security arguments have distinct
premises. Knowledge gains do not automatically imply material abundance, effective
access, rights or democratic institutions.
