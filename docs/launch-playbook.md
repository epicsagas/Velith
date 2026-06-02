# Velith Launch Playbook — HN + HF + X

48-hour launch strategy for Velith's Hugging Face Space debut and Show HN post.

---

## Pre-Launch Checklist (T-48h)

### HF Space
- [ ] HF Space deployed and building (Docker)
- [ ] All 3 example inputs run successfully
- [ ] Download button produces valid `.md` file
- [ ] Mobile layout works (test at 375px width)
- [ ] Space README card metadata verified (`colorFrom`, `colorTo`, `sdk: docker`)
- [ ] HF Space URL finalized → update README.md badge link

### GitHub
- [ ] README.md HF badge URL is correct
- [ ] All i18n links in README resolve
- [ ] `docs/`, `hf-space/` directories committed to `main`
- [ ] CHANGELOG.md entry for `0.5.0` written
- [ ] Version bumped to `0.5.0` in both `plugin.json` files and README badge

### Social
- [ ] HN account has > 50 karma (required for Show HN)
- [ ] X/Twitter account bio updated with GitHub link
- [ ] 30-second demo GIF recorded (see script below)
- [ ] HF thumbnail PNG prepared (1280×650px)

---

## 48-Hour Timeline

| Time | Action | Channel |
|------|--------|---------|
| T-24h | Deploy HF Space, smoke test all 3 examples | HF |
| T-12h | Record demo GIF, prepare all copy | Local |
| T-6h | Final README push, confirm all links | GitHub |
| T+0h | Publish HF Space (make public) | HF |
| T+1h | Post X/Twitter thread | X |
| T+2h | Submit Show HN (9–11am US Eastern is peak) | HN |
| T+3h | Monitor HN comments, respond within 10 min | HN |
| T+6h | Share HN link on X with "we're on HN" tweet | X |
| T+12h | Post in r/MachineLearning, r/LocalLLaMA if traction | Reddit |
| T+24h | Reply to all HN comments, share Day 1 metrics | HN / X |
| T+48h | Blog post or detailed X thread on architecture | X |

---

## Show HN Post

### Title Options

**A — Direct (recommended for credibility)**
```
Show HN: Velith – AI book publishing pipeline with 6-phase quality gates
```
*72 chars. Clear, descriptive, matches the plugin's actual value.*

**B — Problem-first (higher engagement risk/reward)**
```
Show HN: I built a book pipeline because LLMs write terrible long-form
```
*67 chars. Controversial framing attracts clicks and debate.*

**C — Technical framing**
```
Show HN: Velith – structure emergence for AI-assisted long-form writing
```
*71 chars. Appeals to HN's ML/NLP crowd.*

### First Comment Template

Post this yourself within 2 minutes of submitting:

```
I built Velith after trying to write a technical book with raw LLM prompts
and ending up with 12 chapters that contradicted each other.

The core insight: LLMs are good at writing sentences, bad at maintaining
structure across 80,000 words. Velith treats a book like a software project —
each phase (ideation → outline → draft → edit → publish) has a quality gate
that must pass before moving on.

Architecture:
- 6 pipeline phases with mandatory validation
- 7 specialized agents (architect, writer, continuity checker, style doctor, etc.)
- 8 genre templates (fiction, nonfiction, technical, screenplay, poetry, game,
  academic, custom)
- Idempotent: resume from any phase, skip completed chapters

It ships as a Claude Code plugin, but also works with Codex CLI, Cursor,
Cline, and Aider.

There's a live demo on Hugging Face Spaces that shows the text analysis and
structuring pipeline: [link]

Happy to answer questions about the architecture or the agent coordination
approach. Still early — would love to hear what breaks on your use case.
```

### Comment Engagement Rules

- Respond within 10 minutes for the first 2 hours
- Technical questions: give real implementation details, not marketing copy
- Skepticism ("isn't this just prompting?"): acknowledge the limitation, explain what the quality gates actually enforce
- Bugs / failures: thank them, open a GitHub issue publicly in the reply
- Never say "great question"

---

## X/Twitter Thread Template

**Tweet 1 — Hook**
```
Most people use LLMs wrong for long-form writing.

You get great chapter 1. By chapter 8, it's a different book with different characters and contradictory facts.

The problem isn't the model. It's the abstraction.

I built something to fix this. 🧵
```

**Tweet 2 — Problem**
```
Ask any LLM to write a book:

→ Chapters that don't reference each other
→ Inconsistent character names
→ Repeated background paragraphs
→ Voice drift between sections
→ No structural coherence

Prompting is the wrong unit of work for 80,000 words.
```

**Tweet 3 — Solution**
```
Velith treats book creation like software:

Phase 0: Onboarding (PRD + STYLE guide)
Phase 1: Ideation (market + concept validation)
Phase 2: Outlining (chapter DAG + dependencies)
Phase 3: Drafting (parallel agents, idempotent)
Phase 4: Editing (5-stage pipeline)
Phase 5: Publishing (EPUB/PDF/MOBI)

Quality gate at every phase.
```

**Tweet 4 — Live demo**
```
There's a live demo on Hugging Face.

Paste your messy notes, meeting transcript, or research dump.

Watch it:
→ detect redundant paragraphs
→ cluster by topic
→ build chapter hierarchy
→ map cross-references
→ measure structure improvement

[HF Space link]
```

**Tweet 5 — Benchmark**
```
What it does to unstructured input:

Structure score:  2/10 → 8/10
Redundancy:       42% → 8%
AI-slop markers:  19/1k → flagged
Chapters:         0 → auto-detected
Cross-references: 0 → mapped

Numbers from the live demo. Try your own text.
```

**Tweet 6 — Open source**
```
It's open source (Apache-2.0).

Works with:
→ Claude Code
→ Codex CLI (OpenAI)
→ Cursor
→ Cline
→ Aider
→ Agy

8 genre systems. 7 specialized agents. Ships as a plugin — no setup beyond installing your AI tool.

github.com/epicsagas/Velith
```

**Tweet 7 — CTA**
```
If you've ever tried to write a book with AI and given up by chapter 5 —
this is for you.

⭐ Star on GitHub
🚀 Try the demo
🔌 Install the plugin

Would love feedback, especially on what breaks for your use case.
```

---

## HF Space Thumbnail Spec

For `hf-space/thumbnail.png` — used as the Space card preview image.

- **Dimensions:** 1280 × 650 px
- **Background:** `#0d1117` (Velith dark)
- **Font:** System monospace or JetBrains Mono

Layout:
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   📖  VELITH                    [gold, 48px bold]       │
│   Structure emergence, not text generation.             │
│   [muted, 18px]                                         │
│                                                         │
│   RAW TEXT  →  [6 stage boxes]  →  STRUCTURED BOOK      │
│                                                         │
│   Structure: 2/10 → 8/10   Redundancy: 42% → 8%        │
│   [green accent, monospace]                             │
│                                                         │
│                    ▶ Try the demo                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Colors: gold `#ffd700`, green `#2ecc71`, blue `#58a6ff`, muted `#8b949e`

---

## 30-Second Demo Script

For recording a GIF or MP4 to attach to tweets and the HN comment.

```
0s  — App loads, empty input box visible
2s  — Click "📝 Messy Notes" example button
3s  — Messy text fills the input (scroll to show length)
6s  — Click "▶ Run Pipeline"
7s  — Stage progress boxes animate: Analyzing → Clustering → ...
13s — All 6 stages show ✅
14s — Scroll to metrics table: structure 5→6, AI-slop 6.4→5.4
18s — Scroll to structured output markdown with ## Chapter headings
24s — Click "⬇ Download Structured Markdown"
26s — File saves
28s — End card: github.com/epicsagas/Velith
```

Tool: QuickTime (macOS) → trim → convert to GIF with `ffmpeg`:
```bash
ffmpeg -i demo.mov -vf "fps=10,scale=1200:-1" -loop 0 demo.gif
```

---

## Viral Hook Templates

### Statistical
- "LLMs produce 20–45% redundant content in long-form writing. Our pipeline detects and removes it."
- "Structure score 2/10 → 8/10 on unstructured notes. Live demo included."

### Contrarian
- "Prompt engineering is the wrong abstraction for book writing."
- "Stop asking ChatGPT to write your book. Structure it first."
- "The problem with AI writing tools isn't the AI. It's the missing pipeline."

### Technical
- "6-phase DAG with cross-chapter dependency resolution and idempotent resume."
- "7 specialized agents, each with minimal tool access by design."

### Relatable
- "Has anyone else gotten to chapter 7 of an AI-generated book and realized chapter 2 contradicts everything?"
- "I copy-pasted between ChatGPT and a text editor for a month before building this."

---

## Success Metrics

| | Day 1 | Day 3 | Day 7 |
|-|-------|-------|-------|
| GitHub stars | 100+ | 300+ | 500+ |
| HF demo runs | 500+ | 2,000+ | 5,000+ |
| HN upvotes | 100+ | — | — |
| HN comments | 20+ | — | — |
| Forks | 10+ | 30+ | 50+ |

These are targets for a well-executed launch, not guarantees.
The HN front page threshold is roughly 200+ upvotes in the first 2 hours.

---

## Post-Launch (Day 7+)

- Reply to all open HN comments with a "1 week update" top-level comment
- Write a technical post: "How we built a 6-phase book pipeline with specialized agents"
- Consider Product Hunt launch (different audience, longer tail)
- Track which HF examples drive the most engagement → update examples accordingly
- Add `book-status --ui` screenshot to README if dashboard gets interest
