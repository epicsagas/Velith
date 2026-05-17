---
name: book-publish
description: "Phase 5: Publishing. Convert to EPUB/PDF/MOBI/TXT/Markdown, cover design, metadata, title candidates, KDP checklist, marketing plan."
---

# Phase 5: Publishing

**Formats** (requires `pandoc`, optional `calibre` for MOBI):
- **EPUB**: `pandoc drafts/ch*.md -o publish/book.epub --toc --toc-depth=2 --metadata-file=publish/metadata.yaml --css=publish/style.css`
- **PDF**: `pandoc` with 6x9in geometry, mirror margins, CJK font support
- **MOBI**: `ebook-convert book.epub book.mobi` (optional, Kindle supports EPUB)
- **TXT**: `pandoc --to plain --wrap=none`
- **MD**: `pandoc --to markdown --standalone`

**Metadata**: `publish/metadata.yaml` (title, subtitle, author, lang, keywords, description).

**Titles**: 22+ candidates across 5 categories (descriptive, emotional, question, metaphor, provocative).

**Agents**: `cover-designer` → concepts + image prompts. `marketing-expert` → personas, channels, 12-week calendar, launch checklist.

Output: `publish/` directory with all formats + metadata + title-candidates.md + cover/concepts.md + marketing-plan.md.

Gate: EPUB + PDF generated, metadata complete, 22+ titles, cover concepts, marketing plan.
