# dufetelle.com

The journal lives at `/`; `/philoforge/` presents Spinoza and AI justice as consecutive theory groups in a shared workshop. English is canonical, French optional. Source translations are maintained in `dist/assets/locales.js`; missing French content is hidden.

The workshop supports complete theories, premise groups and individual statements with tri-state checkboxes. Spinoza has 20 conditional results; AI justice has 32 (31 in its complete preset, one in the alternative H9 scenario). Explicit modeling conventions accompany the source entries.

Lean checks the reconstruction in `logic/PhiloForge/Spinoza.lean`. The browser selects supported results; it does not execute Lean. The optional counterexample test is clearly labeled as user-added, not a Spinoza axiom. Shared selections use `philoforge.universe.v1`. On first use, the two older theory-specific selections are migrated without overwriting them. An explicit URL selection wins over storage, and saved empty selections remain empty.

Cloudflare Worker: `portefolio`, custom domain `dufetelle.com`. Workers Builds deploys `main` with `npx wrangler@4.149.0 deploy --config website/wrangler.jsonc`. Preview builds are disabled.

Checks: `node website/tests/spinoza.cjs`, `node website/tests/i18n.cjs`, and `lake build` from `logic/`.

## Deduction map

Generate opens `/philoforge/map/` in a new tab with namespaced premise IDs (`spinoza:*`, `justice:*`) and language in its URL. Only Spinoza is exposed in the public map. The return link restores the exact selection. Legacy `?axioms=` map links still load as Spinoza selections. The map supports pointer dragging, pinch or wheel zoom, buttons, keyboard navigation, and node details. Known contradictions remain on the selection page; direct contradictory map URLs are rejected. A generated-link fallback is provided when browser popup handling interferes.

`dist/assets/theories.js` loads Spinoza for the public workshop; its optional second registry remains covered by archive tests. The browser only selects registered theorems. Known conflicts suppress results from the whole selection. Whole-theory presets exclude the optional Spinoza counterexample and the alternative H9 improvement scenario. Run `node website/tests/theories.cjs` for selection, ancestry, namespace, migration and URL checks.

The bridge registry is intentionally empty. A future cross-theory result requires an explicit mapping of concepts, named premises from both theories, a compiled Lean theorem and synchronized proof metadata. Displaying both theories together does not establish philosophical compatibility or derive a new theorem.

The complete Ethics library is served at `/philoforge/ethics/`. Its versioned source records live in `dist/data/ethics.json`; optional French statements in `dist/data/ethics-fr.json`. See `docs/spinoza-sources.md` for import and proof-status rules. Run `node website/tests/ethics.cjs` from the repository root. The source-only catalog does not affect the deduction engine.

## AI, property and democratic justice

The personal AI justice page and assets are archived in `archive/ai-justice/`, outside the deployed `dist/` directory. Their source checks remain available. The live registry loads only Spinoza and filters archived IDs out of saved selections and shared map links.
