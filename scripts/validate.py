"""Validate fixture references; this does not verify philosophical proofs."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
data = json.loads((root / "examples/library.json").read_text())
for kind in ("axioms", "theories", "universes"):
    ids = [item["id"] for item in data[kind]]
    if len(ids) != len(set(ids)):
        raise ValueError(f"Duplicate {kind} IDs")
axioms = {item["id"] for item in data["axioms"]}
theories = {item["id"] for item in data["theories"]}
for theory in data["theories"]:
    if not set(theory["axiom_ids"]) <= axioms:
        raise ValueError(f"Unknown axioms in {theory['id']}")
for universe in data["universes"]:
    if not set(universe["theory_ids"]) <= theories:
        raise ValueError(f"Unknown theories in {universe['id']}")
    if not set(universe["axiom_ids"]) <= axioms:
        raise ValueError(f"Unknown axioms in {universe['id']}")
print("Scaffold fixture references are valid. No proofs were verified.")
