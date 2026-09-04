# Changelog

## [0.7.0] - 2026-09-04

Human-quality release. The pipeline is rewritten around one standard: a cold reader cannot tell the book was machine-drafted.

### Added
- `skills/loom/quality-bar.md` — shared standard: five-axis rubric with anchors, the 2026 AI-tell taxonomy (structural, emotional, nonfiction/technical, English lexical, Korean, Japanese), cold-read critique protocol, language and format notes, visual rules.
- Agents `beta-reader` (cold read as target readers, readiness verdict gating publish), `fact-checker` (claim ledger, source and web verification, removal of unverifiable claims, code execution), `art-director` (art bible, look lock, vision QA, contact-sheet review), `figure-engineer` (code-rendered diagrams, charts, technical drawings, maps' base layers).
- Skill `/book-visuals` — the book visual system: art bible, look lock, figure plan, code-rendered figures, model-agnostic prompt compilation, vision QA, asset validation, print/EPUB constraints. `/book-illustrate` is now an alias into it.
- `velith.mjs metrics` — deterministic prose metrics (sentence cv, mid-band share, punch-ending share, TTR, em-dash and AI-tell density for en/ko, "not X but Y", rhetorical questions, connectives, dialogue share, cross-chapter repeated 3/4-grams, flags).
- `velith.mjs snapshot` — copies `drafts/` and bible/STYLE/outline before rewriting stages.
- `velith.mjs images compile|check|render` — per-backend prompts (Midjourney, gpt-image, SD/FLUX, Imagen, Ideogram) from the art bible; asset validation (dimensions, aspect, size, alt text, references, manifest coverage); figure rendering with mmdc/d2/dot/rsvg-convert/python3 detection.
- `bible.md` (story/book bible with per-chapter ledger), `art-bible.md`, voice lock in `STYLE.md`, `.velith/critiques/`, `visuals/`.
- Editing stage 0 (fact check) and stage 6 (readiness); `edits/readiness-report.md` frontmatter parsed into `status.json` and shown on the dashboard Overview.
- Agent `effort` levels in frontmatter (`max` for chapter-writer and beta-reader).
- `scripts/gen-codex-agents.mjs` — Codex TOMLs generated from `agents/*.md`.
- Dashboard: 12 agent cards, readiness badge with axes, `readiness` edit stage; 9 new i18n keys in all 10 locales.

### Changed
- Every skill and agent rewritten as craft guidance for frontier models: goals, materials, the bar, judgment. Genre skills now carry structure options, scene/argument craft, genre-specific tells, language notes (en/ko/ja), visuals, and validation lists.
- Context policy: full-manuscript reading replaces summary-based context (supersedes ADR-005).
- Drafting: sequential for narrative genres; parallel (≤3) only for DAG-independent technical chapters (amends ADR-003). Voice lock precedes volume. `chapter-writer` drafts, critiques with quoted lines, revises, updates the bible ledger.
- `scene-generator` produces scene plans, not prose (removes the double-drafting seam).
- Editing stages 2-5 rewrite the manuscript in place with snapshots; `book-edit` writes `edits/editorial-report.md` on PASS (fixes Phase 4 never reaching 100%).
- `style-doctor` uses metrics + the 2026 taxonomy and edits in place; `continuity-editor` also hunts repetition; `cover-designer` and `illustrator` consume the art bible and run vision QA; `marketing-expert` leads with the readiness report's strengths.
- `book-publish` gates on readiness PASS, strips chapter frontmatter before pandoc, builds front/back matter, runs epubcheck, and writes KDP and Korean platform checklists.
- `${CLAUDE_PLUGIN_ROOT}` replaces the `{PLUGIN_ROOT}` placeholder in skills and agents.
- Plugin description and manifests list 12 agents; Cursor/Cline/Aider rule files updated to the new pipeline.

### Fixed
- `velith.mjs scan`: terminal dashboard rendered on one line (missing newlines); `**Genre:**`/`**Language:**`/`**Title:**` bold-label parsing; chapter count parsing from `**Chapters:** N`; `illustrator` missing from agent status; Phase 4 completion detection.
- Stale `scripts/agent-status.js` and `skills/book-status/scripts/scan-project.js` paths in Codex TOMLs and `book-illustrate`.



## [0.6.0] - 2026-09-03

### Added
- Scan: prune zombie project rows and registry entries (moved/deleted paths, non-book directories); dashboard indexes by `last_updated` so `--ui` opens the right project.
- Serve: DB hot-reload on file change and atomic writes; static handler containment guard.
- Dashboard: day-ago labels, word-target guard, dev-server upload parity with `velith.mjs serve` (8 MB gate, extension check).

## [0.5.0] - 2026-09-02

### Added
- Grok Build (xAI) plugin host: `.grok-plugin/plugin.json` metadata manifest and `.grok-plugin/marketplace.json` (local source `.`). Skills and agents are discovered from the plugin root.

### Changed
- Root `plugin.json` no longer lists agent files as an array. Grok treats that field as a path override and skips spawn registration if it is a file list. Agy still auto-discovers `agents/` from the repo root.

## [0.4.1] - 2026-07-09

### Fixed
- Dashboard: render book cover image in Overview banner (#6) — new `CoverImage.svelte` component, `OverviewView.svelte` and `App.svelte` wired to display the cover; UI version bumped to match.

### Changed
- README: label the hf-space benchmark table as a heuristic simulation.
- Ignore Playwright MCP debug artifacts (`.playwright-mcp/`) in `.gitignore`.

## [0.4.0] - 2026-06-19

### Added
- New `illustrator` agent — interior illustration pipeline (scene extraction, style bible, 3-tier prompts, placement metadata)
- New `/book-illustrate` skill — illustration plan orchestration for chapter drafts (Phase 3-5)
- `cover-designer` agent expanded — structured concept development (palette/typography/layout/moodboard), multi-format support (ebook/print/audiobook)

### Changed
- `loom` and `book-publish` skills updated with illustrator entry points
- `illustrator` and `cover-designer` status tracking via `velith.mjs agents` subcommand

## [0.3.1] - 2026-06-15

### Changed
- README: reposition Velith from "AI-native publishing system" to **"Build books like software"** across all 7 language READMEs (en, ko, ja, zh, es, fr, de, pt)
- README: add "One pipeline, many artifacts" section — same pipeline applies to RFCs, whitepapers, design docs, course material, and game scenarios, not just books

## [0.3.0] - 2026-06-10

### Changed
- Migrate dashboard data store from JSON files to SQLite (`sql.js` WASM, vendored in `vendor/sql.js/`) — zero npm install for plugin users
- Rename `client.mjs` → `velith.mjs` (unified CLI + HTTP server: scan/agents/stats/words/list/migrate/serve)
- Auto-migrate legacy JSON to SQLite on `scan`/`serve`, backing up originals to `.bak`
- Centralize data in `~/.velith/` (SQLite DB + cache)

### Added
- `velith.mjs migrate` subcommand for explicit JSON → SQLite import
- Root `plugin.json` for Agy auto-discovery
- Codex plugin version sync with Claude Code manifest
- AGENTS.md versioning guide (5-location version bump process)

### Fixed
- Dashboard: ETag caching, onMount init, poll interval tuning
- Release: remove archive packaging; fix Agy install link

## [0.1.6] - 2026-06-08

### Changed
- Extract `FICTION_GENRES` list to `dashboard/shared/fiction-genres.json` (single source of truth for scan-project.js and data.js)
- Add `console.error` logging to `fs.watch` catch block in server.mjs

## [0.1.5] - 2026-06-08

### Fixed
- Dashboard: `fs.watch` cache invalidation for live status updates (atomic write safe)
- Dashboard: per-project agent status instead of last-writer-wins merge
- Dashboard: add `disabled` status i18n key (10 locales) and UI card
- Scan: `filter(Boolean)` drops `ch00` — use `n !== null` instead
- Scan: strip markdown bold (`**`) from YAML genre/language fields
- Scan: fiction-only agents (`scene-generator`) show `disabled` for non-fiction genres
- Scan: `style-doctor` infers `complete` from `line-edit` stage (not just `proofread`)

## [0.1.4] - 2026-06-03

### Fixed
- Dashboard: add missing `edit.stage.*` i18n keys, remove last hardcoded Phase strings
- Dashboard: resolve 11 review issues from i18n overhaul
- Plugin: add icon and fix category for awesome-codex-plugins registration

## [0.1.3] - 2026-06-03

### Fixed
- Dashboard: remove remaining hardcoded English strings (READY/PENDING, Pending, Phase {n}, Utility, edit stage labels)
- Dashboard: normalize phase name keys for i18n lookup (handles spaces in phase names)
- Dashboard: fix accent color store initialization to use saved value from localStorage
- Dashboard: fix PRESET_COLORS Orange default mismatch with actual defaults
- Dashboard: add dropdown arrow to locale select (appearance:none fix)
- Dashboard: clean up previous Google Font links on font switch
- i18n: add 42 missing genre.* keys to all 9 non-English locales (ko, ja, zh, de, es, fr, it, pt, ru)
- i18n: add status.pending, help.phase, help.utility, publish.ready, publish.pending keys to all locales
- i18n: add key consistency validation script (dashboard/scripts/check-i18n.js)

## [0.1.2] - 2026-06-02

### Changed
- Dashboard: full i18n overhaul (10 locales, all views, genre workflows)
- Dashboard: accent color & font picker in settings
- Dashboard: WCAG AA contrast, 16px base font, Tailwind scale cleanup
- Dashboard: CJK font variants (Noto KR/JP/SC) with locale auto-sync
- Dashboard: color unification, light/dark sidebar, header icon colors
- Plugin: llm-context-windows book example via full pipeline

## [0.1.1] - 2026-06

### Added
- Hugging Face Space demo (`hf-space/`) — Gradio app with heuristic NLP pipeline
- Three 1000+ word example inputs (messy notes, meeting transcript, research dump)
- README: Benchmark section, expanded comparison table (Notion AI, Scrivener)
- `docs/launch-playbook.md` — 48-hour HN + HF + X launch strategy
- Cursor integration: `.cursor/rules/` with pipeline, genre, and editing rule files
- Cline integration: `.clinerules` project-level instructions
- Aider integration: `CONVENTIONS.md` with `.aider.conf.yml` auto-load config
- Multi-platform installation sections in README (Cursor, Cline, Aider)

## [0.1.0] - 2025-05

### Added
- 6-phase book creation pipeline (onboarding → ideation → outlining → drafting → editing → publishing)
- 10 skill files including genre-specific patterns (fiction, non-fiction, technical)
- 4 specialized agents (book-architect, chapter-writer, continuity-editor, style-doctor)
- 6 commands (book-init, book-outline, book-draft, book-edit, book-publish, book-status)
- Quality gates for each phase
- Plan-Then-Execute pattern with resume support
- AI-slop detection in style-doctor agent
- Parallel chapter generation (max 4 concurrent)
- 5-stage editing pipeline (Editorial Assessment → Developmental → Line → Copy → Proofread)
- EPUB/PDF output via Pandoc
- Title candidate generation (22+ patterns)
