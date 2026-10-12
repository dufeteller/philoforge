# PhiloForge

A collaborative library of philosophical axioms, reusable theories, and custom universes.

The platform checks what follows from chosen assumptions; it does not determine philosophical truth. The repository includes the bilingual website at [dufetelle.com/philoforge](https://dufetelle.com/philoforge/), a source library, a map of precompiled conditional Lean proofs, and an interactive theory of AI and democratic justice. It is not a general interactive proof engine.

## Structure
- `frontend/`: future contributor interface.
- `backend/`: future API, persistence, and access control.
- `logic/`: Lean formalizations, models and countermodels.
- `website/`: deployed static site and interface tests.
- `examples/`: versioned axiom, theory, and universe fixtures.
- `docs/`: architecture, roadmap, and contribution workflow.

## Check the scaffold
Requires Python 3.11 or later; no third-party packages.

```sh
python3 scripts/validate.py
```

CI checks the site, source/proof registries and Lean compilation on pushes and pull requests. The main branch is connected to the website’s Cloudflare deployment. See [the coverage inventory](docs/ethics-coverage.md) and [formalization limits](docs/spinoza-formalization-audit.md) before interpreting a Lean badge.

## License
License selection is pending. No open-source license is granted yet.

## Languages / Langues
English is the primary language; French is supported across the website. French contributions are welcome. See [the language guide](docs/languages.md) for translation conventions.

## AI and democratic justice

The theory at [dufetelle.com/philoforge/ai-justice/](https://dufetelle.com/philoforge/ai-justice/) explores two normative principles, explicit economic hypotheses, sixteen conditional results and a verified conflict between optimization scenarios. See [the formalization notes](docs/ai-justice.md) for scope and checks.
