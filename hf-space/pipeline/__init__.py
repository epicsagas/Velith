"""Velith pipeline — orchestrates text analysis, structuring, and rendering."""

from .analyzer import TextAnalyzer
from .structurer import TextStructurer
from .renderer import render_output


def run_pipeline(raw_text: str) -> dict:
    """Run the full Velith pipeline simulation.

    Stages:
      1. Analyze raw input (token count, redundancy, structure score, etc.)
      2. Cluster paragraphs by topic keyword overlap
      3. Build chapter hierarchy + cross-references
      4. Build structured output text with headings
      5. Re-analyze structured text to get "after" metrics
      6. Render comparison table + downloadable markdown

    Returns dict with metrics_table, structured_output, download_path, etc.
    """
    if not raw_text or not raw_text.strip():
        return {
            "before_metrics": {},
            "after_metrics": {},
            "structure": {
                "chapters": [], "cross_references": [],
                "redundant_sections": [], "chapter_count": 0,
            },
            "metrics_table": [["No input", "", "", ""]],
            "structured_output": "Please provide some text to analyze.",
            "download_path": None,
        }

    # Stage 1: Analyze raw input
    before_analyzer = TextAnalyzer(raw_text)
    before_metrics = before_analyzer.analyze()

    # Stage 2-3: Extract structure (topic clusters → chapters + xrefs)
    structurer = TextStructurer(raw_text, before_metrics)
    structure = structurer.extract()

    # Stage 4: Build structured text (headings added, redundancies removed)
    structured_text = _build_structured_text(structurer, structure)

    # Stage 5: Re-analyze structured text
    after_analyzer = TextAnalyzer(structured_text)
    after_metrics = after_analyzer.analyze()

    # Stage 6: Render output
    rendered = render_output(raw_text, before_metrics, after_metrics, structure)

    return {
        "before_metrics": before_metrics,
        "after_metrics": after_metrics,
        "structure": structure,
        "metrics_table": rendered["metrics_table"],
        "structured_output": rendered["structured_output"],
        "download_path": rendered["download_path"],
    }


def _build_structured_text(structurer: "TextStructurer", structure: dict) -> str:
    """Rebuild text with chapter headings and redundant paragraphs removed.

    Uses structurer's internal topic clusters to map paragraphs to chapters.
    """
    paragraphs = structurer.paragraphs

    # Indices of redundant paragraphs — remove the second occurrence
    redundant_indices: set[int] = set()
    for red in structure.get("redundant_sections", []):
        idx = red["paragraph_b"] - 1  # 1-based → 0-based
        if 0 <= idx < len(paragraphs):
            redundant_indices.add(idx)

    # Map paragraph indices to chapter number via structurer's topic clusters
    para_to_chapter: dict[int, int] = {}
    for topic_idx, topic in enumerate(structurer._last_topics):
        ch_num = topic_idx + 1
        for para_idx in topic["indices"]:
            para_to_chapter[para_idx] = ch_num

    # Build structured markdown
    chapters = structure["chapters"]
    lines = ["# Structured Document", ""]

    for ch in chapters:
        lines.append(f"## Chapter {ch['number']}: {ch['title']}")
        lines.append("")
        for i, p in enumerate(paragraphs):
            if para_to_chapter.get(i) == ch["number"] and i not in redundant_indices:
                lines.append(p.strip())
                lines.append("")

    return "\n".join(lines)
