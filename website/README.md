# dufetelle.com

Personal journal at `/` and an exploratory PhiloForge workshop at `/philoforge/`.

The journal starts without published posts. Add reviewed article HTML and links to the journal when posts are ready. No content management system is connected.

The workshop supports selecting example axioms, theory presets, browser-local saving, and JSON export. It does not verify proofs or consistency and does not provide accounts or shared storage.

Cloudflare Worker: `portefolio`. Configuration is in `wrangler.jsonc`; assets are in `dist/`. Deploy with Cloudflare's official Wrangler CLI from this directory. Domain remains `dufetelle.com`.

Previous live version observed before replacement: `1ab33fb5` (dashboard short ID). Previous versions remain in Cloudflare for rollback.

Published on 2026-10-10. Cloudflare deployment version: `67957c16-299e-4a1a-a762-964f737ab7df`. Live blog: https://dufetelle.com/ ; workshop: https://dufetelle.com/philoforge/ . Both routes and live preset selection were verified in the browser.

## Automatic deployment

Cloudflare Workers Builds is connected to `dufeteller/philoforge`, production branch `main`. Each push to `main` triggers `npx wrangler@4.149.0 deploy --config website/wrangler.jsonc` from the repository root. Preview builds are disabled. Changes on feature branches reach production after integration into `main`.

## Consequences

The workshop derives consequences using an explicit, inspectable rule library, with dependency lists and reasoning steps. It does not run Lean or establish consistency. A conflicting no-alternatives axiom is opt-in; combining the theory presets does not select it. The causal-action deduction requires an explicit bridge covering possible actions. Validate with `node website/tests/consequences.cjs`.

## Languages / Langues

English is the default language. The EN / FR selector is available on the journal, PhiloForge, and 404 page, and remembers the visitor's choice in browser storage. `?lang=fr` opens a page in French.

English text remains canonical in HTML and rule data. French translations are maintained in `dist/assets/locales.js`, including axioms, consequence explanations, and interface text. Logical identifiers and dependencies remain identical in both languages; JSON exports retain canonical English content and record the selected display language. User-entered universe names are never automatically translated, except the initial default name.

Pour modifier le français, mettez à jour les traductions dans `dist/assets/locales.js`. Lors de l’ajout d’un contenu anglais, ajoutez sa traduction française et lancez `node website/tests/i18n.cjs`.
