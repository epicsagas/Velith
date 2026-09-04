---
title: Velith Pipeline Demo
emoji: 📖
colorFrom: yellow
colorTo: blue
sdk: gradio
sdk_version: 5.0.0
app_file: app.py
pinned: false
license: apache-2.0
short_description: Paste raw notes. Get a structured book outline + metrics.
---

# Velith Pipeline Demo

Turn raw notes, meeting transcripts, or research dumps into a structured,
chaptered document — and **measure the improvement**.

## Try it

Paste any of the following:
- **Messy notes** — scattered ideas, bullet points, repeated thoughts
- **Meeting transcript** — unstructured discussion with tangents
- **Research dump** — copy-pasted paragraphs from multiple sources

Then click **Run Pipeline** to see:

| Metric | Before | After |
|--------|--------|-------|
| Token count | Raw word count | After redundancy removal |
| Structure score | 0-10 (heading hierarchy + balance) | Improved with chapter headings |
| Redundancy | % n-gram overlap between paragraphs | Reduced after deduplication |
| Readability | Flesch-Kincaid Grade Level | Adjusted in structured output |
| AI-slop / 1K words | Forbidden pattern frequency | Identified for removal |
| Coherence | Consecutive sentence overlap score | Measured after restructuring |

## What this demo does

This demo simulates **two phases** of the Velith publishing pipeline:

1. **Analysis** — measures raw text quality across 6 dimensions
2. **Structuring** — clusters paragraphs by topic, builds chapter hierarchy, maps cross-references, flags redundant sections

> ⚠️ This is a heuristic simulation using open-source NLP (trigram overlap,
> keyword clustering, textstat). The full Velith plugin uses Claude Code agents
> for actual generation and editing.

## The full Velith plugin

Velith is an AI-native book publishing pipeline for Claude Code.
It treats book creation like software: structured phases, quality gates, specialized agents.

```
/plugin install velith@epicsagas
```

**6-phase pipeline:** Onboarding → Ideation → Outlining → Drafting → Editing → Publishing

**12 specialized agents:** book-architect · scene-generator · chapter-writer · continuity-editor · fact-checker ·
style-doctor · beta-reader · art-director · figure-engineer · illustrator · cover-designer · marketing-expert

**8 genre systems:** fiction · non-fiction · technical · screenplay · poetry · game · academic · custom

**Output:** EPUB · PDF · MOBI · TXT · Markdown

→ [GitHub: epicsagas/Velith](https://github.com/epicsagas/Velith)

## License

Apache-2.0 © 2026 epicsagas
