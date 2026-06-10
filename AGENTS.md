# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Velith

A Claude Code plugin for AI-native book publishing. 6-phase pipeline (Onboarding → Ideation → Outlining → Drafting → Editing → Publishing) with 16 skills, 7 agents, and 7 genre systems. Ships as a plugin with an optional Svelte dashboard.

## Architecture

### Plugin structure

```
skills/{skill-name}/SKILL.md    — Skills (slash commands): frontmatter (name, description) + prompt
agents/{agent-name}.md          — Agents: frontmatter (name, description, tools[]) + prompt
client.mjs                      — Unified CLI + HTTP server (scan/agents/stats/words/list/migrate/serve)
vendor/sql.js/sql-wasm.js/wasm  — Vendored SQLite WASM binary (no npm install required)
.claude-plugin/plugin.json      — Plugin manifest (skills path, agent list)
```

Skills are the user-facing entry points (`/book-init`, `/book-draft`, etc.). Agents are specialized subagents invoked by skills during pipeline phases. The `loom` skill is the router that detects project state and routes to the correct phase.

### Skill → Agent mapping

| Phase | Skill | Agent(s) used |
|-------|-------|---------------|
| 0 | `/book-init` | — |
| 1 | `/book-ideation` | — |
| 2 | `/book-outline` | `book-architect` |
| 3 | `/book-draft` | `chapter-writer`, `scene-generator` (fiction), `continuity-editor` |
| 4 | `/book-edit` | `style-doctor`, `continuity-editor` |
| 5 | `/book-publish` | `cover-designer`, `marketing-expert` |

### Agent tool constraints

- Each agent has minimal tool access by design (e.g., style-doctor has Read/Edit/Glob/Grep/Bash but no Write)

### Genre system

8 genre skills provide genre-specific templates and validation rules: `book-fiction`, `book-nonfiction`, `book-technical`, `book-screenplay`, `book-poetry`, `book-game`, `book-academic`, `book-genre-creator` (meta-skill for custom genres).

Genres are string-based (no typed enum) — branching happens via conditional logic in skills and agents. Adding a new genre requires creating `skills/book-{genre}/SKILL.md` and updating the genre lists in `skills/loom/SKILL.md`, `README.md`, dashboard `HelpView.svelte`, and i18n files.

### Book project runtime structure

When Velith creates a book project, it generates:
```
{project-dir}/
├── PRD.md          # Book requirements (genre flows as string field)
├── STYLE.md        # Voice, tone, conventions
├── ideation.md     # Phase 1 output
├── outline.md      # Phase 2 output
├── drafts/         # Phase 3 output (ch{NN}-{slug}.md)
├── edits/          # Phase 4 output
├── publish/        # Phase 5 output (EPUB/PDF/MOBI + cover/)
├── sources/        # Reference material
└── .velith/status.json  # Dashboard status data
```

## Dashboard

Svelte 5 + Vite + Tailwind CSS (CDN). Single-file app architecture in `dashboard/src/App.svelte` with view components in `dashboard/src/views/`.

### Key patterns

- **Routing**: Manual URL path parsing with `View` union type and `VALID_VIEWS` set. No router library.
- **Styling**: Tailwind via CDN with CSS custom properties for theming. Light/dark mode via `.dark` class on `<html>`. Sidebar is permanently dark.
- **i18n**: 10 locales (en, ko, ja, zh, es, fr, de, pt, it, ru). Source of truth is `en.ts` with `StringKey` type. All locales must have the same keys. Locale stored in `localStorage` as `bf-locale`, defaults to `ko`.
- **Data**: SQLite (`sql.js`, WASM, vendored in `vendor/sql.js/`) at `~/.velith/velith.db`. Zero npm dependencies at root — plugin works after git clone. Both `vite.config.ts` (dev) and `client.mjs serve` (production) read via `getStatus()`. Legacy JSON files auto-migrate on first `scan`/`serve` and rename to `.bak`.
- **Help view**: Accessible without project selection — sidebar onclick has `|| item.id === 'help'` guard, and render chain checks `activeView === 'help'` before project-selection landing.

### Dashboard commands

```bash
cd dashboard
npm install
npm run dev       # http://localhost:5173 (with live status.json API)
npm run build     # rebuild dist/ (included in repo for plugin users)
```

### Adding a new view

1. Create `dashboard/src/views/{Name}View.svelte`
2. Add `View` type variant in `App.svelte`
3. Add to `VALID_VIEWS` set
4. Add sidebar nav item with `icon` and `labelKey`
5. Add render block in the `{:else if}` chain
6. Add `nav.*` and `view.*` i18n keys to all 10 locale files

## Conventions

- **Commits**: Conventional Commits (`type(scope): description`). Use `/git-cc`.
- **License**: Apache-2.0
- **i18n**: All user-facing strings must go through the i18n system. When adding keys, add to all 10 locale files.
- **Idempotent agents**: Agents must skip already-completed work (e.g., chapter-writer skips existing draft files).
- **Agent status tracking**: All agents call `node {PLUGIN_ROOT}/client.mjs agents {id} {running|complete|error} [task]` to update status (SQLite + JSON backward compat). Auto-migration runs on `scan`/`serve` when legacy JSON data is detected.

## Codex (OpenAI) Plugin Support

Velith also supports OpenAI Codex CLI discovery via `.codex-plugin/plugin.json`, which points to the same `skills/` and `agents/*.md` used by Claude Code.

### Multi-Platform Support

| Platform | Files | Purpose |
|----------|-------|---------|
| Claude Code | `.claude-plugin/plugin.json` | Skills + agent definitions |
| Codex CLI | `.codex-plugin/plugin.json` + `.codex-plugin/agents/*.toml` | Skill directory + agent prompts |
| Agy | GitHub URL install (`agy plugin install`) | Auto-discovers skills/agents from repo root |
| Cursor | `.cursor/rules/*.mdc` | Always-on pipeline context (3 rule files) |
| Cline | `.clinerules` | Project-level instructions |
| Aider | `CONVENTIONS.md` + `.aider.conf.yml` | Writing conventions (auto-loaded) |

## Versioning and Release

This is a Claude Code plugin. Before every push to `main`, bump the `version` field in `.claude-plugin/plugin.json` semantically based on the change scope:

- **PATCH** (`0.1.0` → `0.1.1`): Bug fixes, typo corrections, minor dashboard styling tweaks, i18n string fixes — no new functionality.
- **MINOR** (`0.1.0` → `0.2.0`): New skills, new agents, new genre support, new dashboard views, new i18n keys, feature additions to existing skills/agents.
- **MAJOR** (`0.1.0` → `1.0.0`): Breaking changes to skill/agent interfaces, pipeline phase restructuring, removed skills or agents, incompatible plugin manifest changes.

Also bump `version` in `README.md` badge URL (`badge/version-{version}`) to match.

Additionally, bump the **UI version** constant in `dashboard/src/App.svelte` (`UI_VERSION`) to match the plugin version. Both must stay in sync.

**Process**: bump version → commit all changes → push. Do not push without bumping.
