"""Output rendering — builds comparison table, structured markdown, and download file."""

import os
import tempfile
from typing import Any


def render_output(
    raw_text: str,
    before_metrics: dict[str, Any],
    after_metrics: dict[str, Any],
    structure: dict[str, Any],
) -> dict[str, Any]:
    """Render pipeline results for Gradio display.

    Returns dict with:
      - metrics_table: list of lists for gr.Dataframe
      - structured_output: markdown string
      - download_path: path to saved .md file
    """
    table = _build_comparison_table(before_metrics, after_metrics, structure)
    markdown = _render_structured_markdown(before_metrics, structure)
    filepath = _save_download(markdown)

    return {
        "metrics_table": table,
        "structured_output": markdown,
        "download_path": filepath,
    }


def _build_comparison_table(
    before: dict[str, Any], after: dict[str, Any], structure: dict[str, Any]
) -> list[list[str]]:
    """Build before/after comparison table."""
    rows = [
        [
            "Token Count",
            str(before["token_count"]),
            str(after["token_count"]),
            _pct_change(
                before["token_count"], after["token_count"], lower_is_better=True
            ),
        ],
        [
            "Structure Score",
            f"{before['structure_score']}/10",
            f"{after['structure_score']}/10",
            _delta(before["structure_score"], after["structure_score"], "pts"),
        ],
        [
            "Redundancy",
            f"{before['redundancy_score']}%",
            f"{after['redundancy_score']}%",
            _pct_change(
                before["redundancy_score"],
                after["redundancy_score"],
                lower_is_better=True,
            ),
        ],
        [
            "Readability",
            f"Grade {before['readability_grade']}",
            f"Grade {after['readability_grade']}",
            _delta(before["readability_grade"], after["readability_grade"], "grades"),
        ],
        [
            "AI-Slop / 1K words",
            str(before["ai_slop_per_1k"]),
            str(after["ai_slop_per_1k"]),
            _pct_change(
                before["ai_slop_per_1k"], after["ai_slop_per_1k"], lower_is_better=True
            ),
        ],
        [
            "Coherence",
            f"{before['coherence_score']}/10",
            f"{after['coherence_score']}/10",
            _delta(before["coherence_score"], after["coherence_score"], "pts"),
        ],
        [
            "Vocabulary Diversity",
            f"{before['vocabulary_diversity']}",
            f"{after['vocabulary_diversity']}",
            _delta(before["vocabulary_diversity"], after["vocabulary_diversity"], ""),
        ],
        [
            "Chapters Detected",
            "0",
            str(structure["chapter_count"]),
            f"+{structure['chapter_count']}",
        ],
        [
            "Cross-References",
            "0",
            str(len(structure["cross_references"])),
            f"+{len(structure['cross_references'])}",
        ],
    ]
    return rows


def _render_structured_markdown(
    metrics: dict[str, Any], structure: dict[str, Any]
) -> str:
    """Render structured output as markdown."""
    lines = [
        "---",
        'title: "Structured Output"',
        "generated_by: Velith Pipeline Demo (heuristic)",
        f"chapters: {structure['chapter_count']}",
        f"cross_references: {len(structure['cross_references'])}",
        f"redundant_sections: {len(structure['redundant_sections'])}",
        "---",
        "",
        f"# Structured Output",
        "",
        f"> Analyzed {metrics['token_count']} words across {metrics['paragraph_count']} paragraphs.",
        f"> Detected {structure['chapter_count']} topic clusters with {len(structure['cross_references'])} cross-references.",
        "",
        "## Chapter Outline",
        "",
    ]

    for ch in structure["chapters"]:
        lines.append(f"### Chapter {ch['number']}: {ch['title']}")
        lines.append("")
        lines.append(f"> {ch['summary']}")
        lines.append("")
        lines.append(f"- **Word count:** {ch['word_count']}")
        lines.append(f"- **Key concepts:** {', '.join(ch['key_concepts'])}")
        lines.append("")

    if structure["cross_references"]:
        lines.append("## Cross-References")
        lines.append("")
        for xref in structure["cross_references"]:
            terms = ", ".join(xref["shared_terms"])
            lines.append(
                f"- Ch {xref['from_chapter']} ↔ Ch {xref['to_chapter']}: _{terms}_"
            )
        lines.append("")

    if structure["redundant_sections"]:
        lines.append("## Redundancy Warnings")
        lines.append("")
        for red in structure["redundant_sections"][:10]:
            lines.append(
                f"- Paragraphs {red['paragraph_a']} & {red['paragraph_b']}: "
                f"{red['similarity']:.0%} overlap ({red['shared_trigrams']} shared trigrams)"
            )
        if len(structure["redundant_sections"]) > 10:
            remaining = len(structure["redundant_sections"]) - 10
            lines.append(f"- ... and {remaining} more pairs")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append(
        "*Generated by [Velith](https://github.com/epicsagas/Velith) pipeline demo. "
        "This uses open-source NLP heuristics. The full Velith plugin uses Claude Code "
        "agents for actual generation and editing.*"
    )

    return "\n".join(lines)


def _save_download(markdown: str) -> str:
    """Save structured output to temp file for download."""
    tmpdir = tempfile.mkdtemp(prefix="velith_")
    filepath = os.path.join(tmpdir, "velith-structured-output.md")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(markdown)
    return filepath


def _pct_change(before: float, after: float, lower_is_better: bool = True) -> str:
    """Format percentage change."""
    if before == 0:
        return "N/A"
    change = ((after - before) / before) * 100
    if change == 0:
        return "0%"
    sign = "+" if change > 0 else ""
    if lower_is_better:
        arrow = "✅" if change < 0 else "⚠️"
    else:
        arrow = "✅" if change > 0 else "⚠️"
    return f"{sign}{change:.0f}% {arrow}"


def _delta(before: float, after: float, unit: str) -> str:
    """Format absolute delta."""
    diff = after - before
    sign = "+" if diff > 0 else ""
    unit_str = f" {unit}" if unit else ""
    return f"{sign}{diff:.1f}{unit_str}"
