# Velith — Writing Conventions

## Pipeline

6-phase book creation pipeline. Each phase validates before proceeding:

0. **Onboarding** — Genre, audience, language, style guide → `PRD.md` + `STYLE.md`
1. **Ideation** — Market research, concept distillation → `ideation.md`
2. **Outlining** — Chapter outline with specs and cross-references → `outline.md`
3. **Drafting** — Chapter-by-chapter generation, idempotent (skip completed) → `drafts/`
4. **Editing** — 5-stage: Assessment → Developmental → Line → Copy → Proofread → `edits/`
5. **Publishing** — EPUB/PDF/MOBI/TXT/Markdown, cover, marketing → `publish/`

## Genre Patterns

- **Fiction:** Save the Cat! 15-beat, character bible (GMC), scene beats (RDD), POV consistency, dialogue subtext
- **Non-Fiction:** Problem-solution, learner personas, evidence hierarchy (research > interviews > case studies > anecdotes)
- **Technical:** Concept progression (novice→expert), compilable code examples, diagrams, chapter labs
- **Screenplay:** 3-act + 8-sequence, dialogue subtext, A/B story interweaving, present-tense action
- **Poetry:** Form types (sonnet/haiku/free verse), meter, imagery systems, collection arc
- **Game:** Quest trees, branching dialogue, lore bible, flag system, multiple endings
- **Academic:** IMRAD, thematic lit review, argument chains, consistent citation style
- **Custom:** Compose patterns from any genre

## Writing Rules

- **Plan-Then-Execute:** Outline first, validate, then write
- **Idempotent:** Skip completed chapters, resume from where you left off
- **Summary-based context:** Use chapter summaries, not full text, for cross-references
- **Style reference:** All tone and voice checks use `STYLE.md`

## AI-Slop Detection

Avoid these patterns in all drafts:

- Excessive modifiers: revolutionary, game-changer, groundbreaking, seamless, robust, transformative
- Repetitive transitions: "however", "moreover", "furthermore" overuse
- Generic conclusions: "in conclusion", "ultimately", "at the end of the day"
- Weak hedging: "can be", "seems like", "it could be argued"
- AI markers: "delve", "tapestry", "nuanced", "multifaceted", "plethora", "myriad"
- List overuse: 5+ consecutive bullets without prose context

## Style Drift Checks

Per-chapter quantitative metrics:

- Sentence length variance (compare against book mean)
- Paragraph length distribution
- Type-token ratio (vocabulary diversity)
- POV consistency (no 1st/3rd mixing within chapters)

## Quality Gates

| Phase | Must Pass |
|-------|-----------|
| Onboarding | PRD.md + STYLE.md exist |
| Ideation | Elevator pitch + 3 competing titles analyzed |
| Outlining | All chapters specified + cross-reference map |
| Drafting | All chapters meet word target + frontmatter |
| Editing | 5-stage pipeline passed + <5 issues remaining |
| Publishing | EPUB/PDF generated + metadata complete |
