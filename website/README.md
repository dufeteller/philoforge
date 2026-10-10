# dufetelle.com

The journal lives at `/`; `/philoforge/` presents only a sourced fragment of Spinoza's Ethics I. English is canonical, French optional. Source translations are maintained in `dist/assets/locales.js`; missing French content is hidden.

The interactive library contains Definition III and Axioms IV and V. Its results are the conceptual-separation step of Proposition III, Proposition III, and a reconstruction of the alternative proof of Proposition VI's corollary. Explicit modeling conventions accompany every source entry.

Lean checks the reconstruction in `logic/PhiloForge/Spinoza.lean`. The browser selects supported results; it does not execute Lean. The optional counterexample test is clearly labeled as user-added, not a Spinoza axiom. Selections are stored under `philoforge.spinoza.v1`; obsolete saved universes are not loaded.

Cloudflare Worker: `portefolio`, custom domain `dufetelle.com`. Workers Builds deploys `main` with `npx wrangler@4.149.0 deploy --config website/wrangler.jsonc`. Preview builds are disabled.

Checks: `node website/tests/spinoza.cjs`, `node website/tests/i18n.cjs`, and `lake build` from `logic/`.

## Deduction map

Generate opens `/philoforge/map/` in a new tab with the selected source IDs and language in its URL. The map supports pointer dragging, pinch or wheel zoom, buttons, keyboard navigation, and node details. Known contradictions remain on the selection page; direct contradictory map URLs are rejected. A generated-link fallback is provided when browser popup handling interferes.

The complete Ethics library is served at `/philoforge/ethics/`. Its versioned source records live in `dist/data/ethics.json`; optional French statements in `dist/data/ethics-fr.json`. See `docs/spinoza-sources.md` for import and proof-status rules. Run `node website/tests/ethics.cjs` from the repository root. The source-only catalog does not affect the deduction engine.
