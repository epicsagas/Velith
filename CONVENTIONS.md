# Velith — Writing Conventions

The bar: a cold reader who buys books in this genre cannot tell the manuscript was machine-drafted. Full reference: `skills/loom/quality-bar.md`.

## Pipeline

0. **Onboarding** — genre, reader, language, scope, voice fingerprint from the author's sample → `PRD.md` (reader promise) + `STYLE.md`
1. **Ideation** — premise stress test, real comps, ranked concepts, author picks → `ideation.md`
2. **Outlining** — structure chosen and justified, chapter specs (purpose, entry/exit state, pull, content, sets up/pays off, must not), figure plan, bible, scored validation, author approval → `outline.md`, `bible.md`
3. **Drafting** — voice lock, then sequential full-context chapters with draft → critique → revise, bible ledger per chapter, continuity checks → `drafts/`
4. **Editing** — fact check, assessment, developmental rewrites, line edit, copy edit, proofread, beta-reader readiness verdict → revised `drafts/`, `edits/`
5. **Publishing** — readiness gate, front/back matter, EPUB/PDF/MOBI/TXT/MD, epubcheck, cover, marketing, platform checklists → `publish/`

Visuals (any phase from 2): art bible and look lock, code-rendered figures, compiled prompts for illustrations, vision QA, asset check → `art-bible.md`, `visuals/`

## Writing rules

- Read everything before writing: the whole manuscript, the bible, the voice lock passages.
- Narrative genres draft in order. Chapter N needs chapter N-1.
- No chapter is saved after one pass. Critique with quoted lines and five-axis scores, then revise.
- Nonfiction: every number, quote, study, and named person traces to `sources/INDEX.md` or a verified URL. Otherwise cut.
- Editing rewrites in place; reports document what changed.
- Images: one art bible per book; prompts compiled from it; diagrams and drawings from code; every image opened and scored.

## Five-axis rubric (1-10)

Voice and prose · Structure and pacing · Depth · Specificity and grounding · Reader experience. Voice lock: axis 1 ≥ 7. Readiness: every axis ≥ 7, mean ≥ 7.5, no put-down point in chapters 1-3.

## AI tells that matter (2026)

Structural: uniform paragraph length, punch-line endings, tricolons, symmetrical scenes, "not X but Y", balanced antithesis, reflective codas, em-dash cascades, rhetorical question chains, summary-then-scene, naming the theme.

Emotional: precise self-knowledge, physical-reaction inventories, universal kindness, dialogue that answers, "something shifted", tidy resolution, interchangeable voices, sensory garnish.

Nonfiction/technical: hedged authority, invented specificity, framework inflation, listicle drift, preview-and-recap, uniform confidence, analogy padding, code that never fails.

Korean: 번역투 무생물 주어, ~것이다 남발, 피동 과잉, 감정 명명, 접속부사 연쇄, ~에 대해/~을 통해, 대명사·~들 과잉, 존댓말·시제 흔들림, 균일한 문장 길이, 한자어 과밀, 설명형 대화.

## Metrics

`node velith.mjs metrics drafts/` — sentence-length cv, mid-band share, punch-ending share, TTR, em-dash and tell density, repeated n-grams across chapters. Numbers locate problems; they do not judge prose.

## Quality gates

| Phase | Must pass |
|-------|-----------|
| 0 | PRD with reader promise; STYLE with voice fingerprint |
| 1 | Author-chosen concept; ≥5 comps with verification status |
| 2 | Outline approved; architect score ≥ 8, no Critical; bible exists |
| 3 | All chapters drafted; critiques all axes ≥ 6; ledger per chapter; voice lock |
| 4 | Readiness PASS; chapters `status: final` |
| 5 | EPUB + PDF built, epubcheck clean, metadata, cover concepts, marketing, checklist |
