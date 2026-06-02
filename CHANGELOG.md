# Changelog

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
