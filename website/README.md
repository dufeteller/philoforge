# dufetelle.com

Personal journal at `/` and an exploratory PhiloForge workshop at `/philoforge/`.

The journal starts without published posts. Add reviewed article HTML and links to the journal when posts are ready. No content management system is connected.

The workshop supports selecting example axioms, theory presets, browser-local saving, and JSON export. It does not verify proofs or consistency and does not provide accounts or shared storage.

Cloudflare Worker: `portefolio`. Configuration is in `wrangler.jsonc`; assets are in `dist/`. Deploy with Cloudflare's official Wrangler CLI from this directory. Domain remains `dufetelle.com`.

Previous live version observed before replacement: `1ab33fb5` (dashboard short ID). Previous versions remain in Cloudflare for rollback.
