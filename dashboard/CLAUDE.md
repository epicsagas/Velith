# Dashboard

Svelte 5 + Vite + Tailwind (CDN). `src/App.svelte` + `views/`. Routing is manual (`View` union + `VALID_VIEWS`). i18n: 10 locales, `en.js` is the key source of truth; every locale must have identical keys (the `add-i18n` pattern: import module, merge, re-serialize). Data from SQLite via `getStatus()` in both `vite.config.ts` and `velith.mjs serve`. `AGENT_DEFS` in `lib/data.js` lists 12 agents; `EDIT_STAGES` has 6 (incl. readiness). Overview shows the readiness verdict and axes when present.

```bash
npm install && npm run dev   # http://localhost:5173
npm run build                # rebuild dist/ (committed for plugin users)
```
