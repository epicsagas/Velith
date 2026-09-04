# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Velith

A Claude Code plugin that produces books to the human-quality bar: a cold reader should not be able to tell the manuscript was machine-drafted. 6-phase pipeline (Onboarding → Ideation → Outlining → Drafting → Editing → Publishing), 18 skills, 12 agents, 7 genre systems + custom, a model-agnostic visual pipeline, and an optional Svelte dashboard. Ships as a plugin with zero npm dependencies at the root.

## Architecture

### Plugin structure

```
skills/{skill-name}/SKILL.md    — Skills (slash commands): frontmatter (name, description, argument-hint) + prompt
skills/loom/quality-bar.md      — Shared standard: 5-axis rubric, 2026 AI-tell taxonomy (en/ko/ja), cold-read protocol, visual rules
agents/{agent-name}.md          — Agents: frontmatter (name, description, tools[], effort) + prompt
velith.mjs                      — Unified CLI + HTTP server (scan/agents/stats/words/list/migrate/metrics/snapshot/images/serve)
vendor/sql.js/sql-wasm.js/wasm  — Vendored SQLite WASM binary (no npm install required)
.claude-plugin/plugin.json      — Plugin manifest (skills path, agent list)
```

Skills are the user-facing entry points. Agents are subagents invoked by skills. `loom` is the router. `quality-bar.md` is read by every writing, editing, and reviewing agent; changes there change the whole product.

`${CLAUDE_PLUGIN_ROOT}` is used in skills and agents (Claude Code substitutes it). Codex TOMLs use `{PLUGIN_ROOT}` and are **generated** from `agents/*.md`; do not hand-edit them.

### Operating principles (v0.5, supersede the 2025 design)

- **Full-manuscript context.** Agents read the whole manuscript, not summaries. `bible.md` is an index and ledger. (Replaces ADR-005 summary-based context.)
- **Sequential drafting for narrative genres**; parallel (≤3) only for technical/reference/academic chapters proven independent by the outline DAG. (Amends ADR-003.)
- **Voice lock** on a sample chapter before drafting volume; recorded in `STYLE.md` `## Voice Lock`.
- **Draft → critique → revise** inside `chapter-writer`; critiques saved in `.velith/critiques/`.
- **Editing rewrites in place** with snapshots (`velith.mjs snapshot`) and stage reports; 7 stages (0 fact-check … 6 readiness).
- **Readiness gate**: `beta-reader` writes `edits/readiness-report.md` with YAML `verdict: PASS|REVISE`, `score`, `axes`. Publishing requires PASS or an explicit override.
- **One look per book**: `art-bible.md` + `.velith/art-bible.json`; prompts compiled by `velith.mjs images compile`; diagrams/charts/drawings are code-rendered by `figure-engineer`; every image passes vision QA; look lock precedes volume.
- **Author checkpoints** (required stops): concept, outline approval, voice lock, look lock, developmental restructures, readiness verdict.

### Skill → Agent mapping

| Phase | Skill | Agent(s) |
|-------|-------|----------|
| 0 | `/book-init` | — |
| 1 | `/book-ideation` | — |
| 2 | `/book-outline` | `book-architect` |
| 3 | `/book-draft` | `scene-generator` (fiction), `chapter-writer`, `continuity-editor`, `figure-engineer` (planned figures) |
| 4 | `/book-edit` | `fact-checker` (stage 0), `chapter-writer` (rewrites), `continuity-editor`, `style-doctor`, `beta-reader` (stage 6) |
| 3-5 | `/book-visuals` (`/book-illustrate` alias) | `art-director`, `figure-engineer`, `illustrator`, `cover-designer` |
| 5 | `/book-publish` | `cover-designer`, `art-director` (consistency review), `marketing-expert` |
| — | `/book-status` | — (haiku) |

### Agent tool and effort constraints

Each agent has minimal tools by design (`style-doctor` has Edit but not Write; `beta-reader` has Write but not Edit; `fact-checker` has WebSearch/WebFetch). `effort` is set per agent: `max` for `chapter-writer` and `beta-reader`, `xhigh` for architect/scene/continuity/style/fact-check/art-director/figure-engineer, `high` for illustrator/cover/marketing. Model is inherited from the session; do not pin a model in agent frontmatter.

### Genre system

7 genre skills + `book-genre-creator`. Each genre skill is craft guidance (structure options, scene/argument craft, genre-specific AI tells, language notes for en/ko/ja, a Visuals section, and the architect's validation list), not a template. Genres are strings; agents read `skills/book-{genre}/SKILL.md` or the project's `genre-custom.md`. Adding a genre: create the skill, update `skills/loom/SKILL.md`, `skills/book-genre-creator/SKILL.md`, `README.md`, dashboard `HelpView.svelte`, and i18n files.

### Book project runtime structure

```
{project-dir}/
├── PRD.md              # Requirements + reader promise (frontmatter: title, genre, language, target_length, count_unit, chapters)
├── STYLE.md            # Voice fingerprint, voice sample, rules, ## Voice Lock
├── ideation.md         # Concepts, comps, ## Chosen Concept
├── outline.md          # Chapter specs, figure plan, ## Validation, ## Approval
├── bible.md            # Characters/concepts, term rules, timeline, motifs, ## Chapter ledger
├── art-bible.md        # Visual identity, ## Look lock
├── sources/INDEX.md    # Source map with trust levels
├── drafts/             # ch{NN}-{slug}.md (frontmatter: status draft|edited|final, revision, critique_score), ch{NN}-scenes.md
├── visuals/            # plan.md, manifest.json, figures/{src/}, illustrations/, photos/, ref/, prompts/
├── edits/              # 00-fact-check … 06-readiness-report, readiness-report.md, editorial-report.md, continuity-report.md, style-report.md, claim-ledger.md
├── publish/            # book.*, metadata.yaml, frontmatter/, backmatter/, cover/, title-candidates.md, marketing-plan.md, CHECKLIST.md, PUBLISH-NOTES.md
└── .velith/            # status.json, art-bible.json, critiques/, snapshots/, metrics.json
```

## CLI (`velith.mjs`)

| Command | Purpose |
|---------|---------|
| `scan [dir] [--ui]` | Project state → SQLite + `status.json`; parses `edits/readiness-report.md` frontmatter into `readiness` |
| `metrics <file\|dir>` | Deterministic prose metrics: sentence cv, mid-band share, punch endings, TTR, em-dash, AI-tell hits (en/ko), not-X-but-Y, rhetorical questions, connectives, dialogue share, cross-chapter repeated 3/4-grams, flags. Writes `.velith/metrics.json` |
| `snapshot <dir> <label>` | Copies `drafts/` + bible/STYLE/outline to `.velith/snapshots/{stamp}-{label}` |
| `images compile [dir] [id]` | Art bible + manifest entry → per-backend prompts (Midjourney, gpt-image, SD/FLUX, Imagen, Ideogram) in `visuals/prompts/` |
| `images check [dir]` | Manifest coverage, dimensions (PNG/JPEG/SVG headers), aspect, size, alt text, draft references, unmanaged files. Exit 2 on failure |
| `images render [dir]` | Detects mmdc/d2/dot/rsvg-convert/python3; renders `visuals/figures/src/*` to SVG (+PNG) |
| `agents <id> <status> [task]` | Agent status for the dashboard |
| `serve`, `list`, `stats`, `words`, `migrate` | As before |

## Dashboard

Svelte 5 + Vite + Tailwind (CDN). `dashboard/src/App.svelte` + `views/`. Routing is manual (`View` union + `VALID_VIEWS`). i18n: 10 locales, `en.js` is the key source of truth; every locale must have identical keys (the `add-i18n` pattern: import module, merge, re-serialize). Data from SQLite via `getStatus()` in both `vite.config.ts` and `velith.mjs serve`. `AGENT_DEFS` in `lib/data.js` lists 12 agents; `EDIT_STAGES` has 6 (incl. readiness). Overview shows the readiness verdict and axes when present.

```bash
cd dashboard && npm install && npm run dev   # http://localhost:5173
npm run build                                 # rebuild dist/ (committed for plugin users)
```

## Grok Build (xAI) Plugin Support

Grok Build reads skills (`skills/`) and agents (`agents/*.md`) natively from the plugin root. Install with `grok plugin install epicsagas/Velith --trust`; agents spawn as `velith:<name>`.

Grok also reads the root `plugin.json`, where the `agents` field must stay a directory path (`"./agents/"`) or be omitted — a Claude-style file array makes Grok skip spawn registration. Claude Code keeps the file list in `.claude-plugin/plugin.json`.

## Multi-platform support

| Platform | Files |
|----------|-------|
| Claude Code | `.claude-plugin/plugin.json`, `skills/`, `agents/` |
| Codex CLI | `.codex-plugin/plugin.json`, `.codex-plugin/agents/*.toml` (generated: `node scripts/gen-codex-agents.mjs`) |
| Grok Build | `.grok-plugin/plugin.json` + `.grok-plugin/marketplace.json` | Metadata + catalog; skills/agents discovered from plugin root |
| Agy | root `plugin.json` |
| Cursor | `.cursor/rules/*.mdc` |
| Cline | `.clinerules` |
| Aider | `CONVENTIONS.md` + `.aider.conf.yml` |

When an agent changes, regenerate the Codex TOMLs and update `.clinerules`, `CONVENTIONS.md`, and the Cursor rules if the change affects pipeline semantics.

## Conventions

- **Commits**: Conventional Commits (`type(scope): description`).
- **License**: Apache-2.0.
- **i18n**: all dashboard strings through the i18n system; add keys to all 10 locales.
- **Idempotent agents**: skip completed work unless `--force`.
- **Agent status**: `node ${CLAUDE_PLUGIN_ROOT}/velith.mjs agents {id} {running|complete|error} [task]` at start and end.
- **Prompts are written for frontier models**: goals, materials, the bar, and judgment, not step lists. Quote-based critiques. No "delve"-era word lists as the primary tell detector; the taxonomy in `quality-bar.md` is structural.

## Versioning and release

Bump the `version` in all six locations to the same value before pushing to `main`: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.grok-plugin/plugin.json`, root `plugin.json`, the `README.md` badge URL, and `UI_VERSION` in `dashboard/src/App.svelte`. Do **not** bump `dashboard/package.json` (toolchain version, private). The version badges in `docs/i18n/README.*.md` are dynamic (shields.io reads `version` from `.claude-plugin/plugin.json`) and must not be edited during a bump.

- PATCH: fixes, typos, i18n strings, styling.
- MINOR: new skills, agents, genres, views, i18n keys, feature additions.
- MAJOR: breaking skill/agent interface changes, phase restructuring, removed skills or agents.

Process: bump five locations → `cd dashboard && npm run build` → regenerate Codex TOMLs → commit → tag `v{version}` → push with `--tags`.
