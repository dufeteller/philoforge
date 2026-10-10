# PhiloForge

A collaborative library of philosophical axioms, reusable theories, and custom universes.

The platform checks what follows from chosen assumptions; it does not determine philosophical truth. This repository is the initial project scaffold, not a working application or proof engine.

## Structure
- `frontend/`: future contributor interface.
- `backend/`: future API, persistence, and access control.
- `logic/`: formalization and future Lean verification boundary.
- `examples/`: versioned axiom, theory, and universe fixtures.
- `docs/`: architecture, roadmap, and contribution workflow.

## Check the scaffold
Requires Python 3.11 or later; no third-party packages.

```sh
python3 scripts/validate.py
```

CI runs this same check for pushes and pull requests. Lean compilation, application tests, and deployment are not yet implemented.

## License
License selection is pending. No open-source license is granted yet.

## Languages / Langues
English is the primary language; French is supported across the website. French contributions are welcome. See [the language guide](docs/languages.md) for translation conventions.
