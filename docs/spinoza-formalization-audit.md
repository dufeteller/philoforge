# What remains to formalize in Spinoza's Ethics

The catalogue contains 259 numbered propositions. Only E1 P1, P3 and P6 have scoped reconstructions compiled by Lean. The other **256 are not formalized**; importing their text is not formal verification. The [complete coverage inventory](ethics-coverage.md) is regenerated and checked in CI.

## What the current formal language expresses

`Spinoza.lean` interprets substance using conceptual independence, modes using inherence and dependence, and A4/A5 using causation, dependence and commonality. `SpinozaAffects.lean` encodes adequate/partial causes and activity/passivity for a fixed actor and event.

It does not yet encode attributes, essence, necessary existence, God, ideas, bodies, duration, a theory of knowledge, or the general theory of affects. A proposition using these notions cannot be checked merely by adding its name to the registry.

## Machine-checkable limits of the current fragment

`logic/PhiloForge/SpinozaLimits.lean` constructs a Boolean model with two substances, no conceptual dependence or causation, and commonality between every pair. It satisfies encoded A4 and A5; both entities satisfy encoded D3.

The accompanying proofs establish:

- **Uniqueness does not follow from this fragment.** The two distinct substances satisfy all its current premises. This is not a counterexample to the full Ethics or its complete premises for E1 P14.
- **Independence does not imply lack of commonality.** A5 provides the direction from no commonality to no dependence, not its converse. The model does not interpret different attributes and therefore is not a counterexample to historical E1 P2.
- **Excluding external causes does not provide a self-cause.** The model has no causes at all. To infer causal self-relation for a substance, the supplied conditional lemma additionally requires that it have a cause. This extra existence premise is explicit; the lemma is not E1 P7, whose essence/existence vocabulary remains unencoded.

These results describe limitations of our chosen representation. They neither refute Spinoza nor count as additional proved propositions from the Ethics. The build prints the foundational assumptions used by each proof. Mathematical existence of this small model also does not establish consistency of the full Ethics.

## Requirements for expanding coverage

For each historical proposition, an implementation needs its source passage, a typed interpretation of every term, explicit premises, dependency references, and a Lean proof. Where an argument requires an additional interpretive bridge, record that bridge separately. A conclusion must not be introduced as a premise and then labelled verified. Scope notes must distinguish historical statements from weakened or strengthened reconstructions.

Part I must first acquire an explicit account of attributes and essence/existence. Parts II–V require additional semantic structures. Their source texts remain available in the library without a verification badge while this work is incomplete. The existing compiled results and the dependency map retain their current scope.

## Related work reviewed

[Nakamura's Lean project coverage register](https://github.com/Nakammura/spinoza-ethica-lean/blob/main/docs/coverage.md) describes partial work on Part I and distinguishes additional premises from derived results. It is not a complete formalization to import. Its existence does not validate our different encoding. No external Lean code has been copied into this audit.

Primary text: [Spinoza, Ethics, Elwes translation](https://www.gutenberg.org/files/3800/3800-h/3800-h.htm). The repository's catalogue retains source references and the imported edition checksum.
