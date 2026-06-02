"""Velith Pipeline Demo — Gradio app for Hugging Face Spaces.

Simulates the Velith text analysis and structuring pipeline using
open-source NLP heuristics. No external LLM API calls required.
"""

import os
import sys

import gradio as gr

sys.path.insert(0, os.path.dirname(__file__))

from pipeline import run_pipeline

# ── Example inputs ────────────────────────────────────────────────────────────

def _load_example(filename: str) -> str:
    path = os.path.join(os.path.dirname(__file__), "examples", filename)
    try:
        with open(path, encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return ""

EXAMPLE_NOTES = _load_example("messy-notes.txt")
EXAMPLE_MEETING = _load_example("meeting-transcript.txt")
EXAMPLE_RESEARCH = _load_example("research-dump.txt")

# ── Stage labels ──────────────────────────────────────────────────────────────

STAGES = [
    ("Analyzing", "📊 Analyzing raw text…"),
    ("Clustering", "🔗 Clustering paragraphs by topic…"),
    ("Structuring", "🏗️  Building chapter hierarchy…"),
    ("Mapping", "🗺️  Mapping cross-references…"),
    ("Evaluating", "✅ Evaluating structured output…"),
    ("Rendering", "📄 Rendering comparison & download…"),
]

STAGE_DONE = "✅ Done"

# ── CSS ───────────────────────────────────────────────────────────────────────

CUSTOM_CSS = """
:root {
    --velith-bg:      #0d1117;
    --velith-surface: #161b22;
    --velith-border:  #30363d;
    --velith-gold:    #ffd700;
    --velith-green:   #2ecc71;
    --velith-blue:    #58a6ff;
    --velith-text:    #c9d1d9;
    --velith-muted:   #8b949e;
}

body, .gradio-container {
    background: var(--velith-bg) !important;
    color: var(--velith-text) !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
}

.velith-header {
    text-align: center;
    padding: 2rem 0 1rem;
    border-bottom: 1px solid var(--velith-border);
    margin-bottom: 1.5rem;
}

.velith-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--velith-gold);
    letter-spacing: -0.5px;
    margin: 0 0 0.25rem;
}

.velith-header .subtitle {
    color: var(--velith-muted);
    font-size: 0.95rem;
    margin: 0 0 0.75rem;
}

.velith-header .pipeline-line {
    font-size: 0.75rem;
    color: var(--velith-blue);
    font-family: monospace;
}

.stage-box {
    background: var(--velith-surface);
    border: 1px solid var(--velith-border);
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    font-size: 0.82rem;
    color: var(--velith-muted);
    margin-bottom: 0.3rem;
    transition: all 0.2s;
}

.stage-box.active {
    border-color: var(--velith-gold);
    color: var(--velith-gold);
}

.stage-box.done {
    border-color: var(--velith-green);
    color: var(--velith-green);
}

.metric-badge {
    display: inline-block;
    background: var(--velith-surface);
    border: 1px solid var(--velith-border);
    border-radius: 4px;
    padding: 0.2rem 0.5rem;
    font-size: 0.78rem;
    font-family: monospace;
}

.disclaimer {
    font-size: 0.75rem;
    color: var(--velith-muted);
    border: 1px solid var(--velith-border);
    border-radius: 6px;
    padding: 0.6rem 1rem;
    margin-top: 1rem;
}

footer { display: none !important; }
"""

HEADER_HTML = """
<div class="velith-header">
  <h1>📖 Velith Pipeline Demo</h1>
  <p class="subtitle">Structure emergence, not text generation.</p>
  <p class="pipeline-line">
    Onboarding → Ideation → Outlining → Drafting → Editing → Publishing
  </p>
</div>
"""

DISCLAIMER_HTML = """
<div class="disclaimer">
  ⚠️ <strong>Note:</strong> This demo simulates Velith's text analysis pipeline
  using open-source NLP heuristics (trigram overlap, keyword clustering, textstat).
  The full <a href="https://github.com/epicsagas/Velith" target="_blank">Velith plugin</a>
  uses Claude Code agents for actual generation and multi-stage editing.
  Metrics shown are heuristic estimates, not formal benchmarks.
</div>
"""

HOW_IT_WORKS_MD = """
## How the Pipeline Works

Velith treats books as **structured artifacts**, not isolated prompts.
This demo simulates the analysis and structuring phases:

### Stage 1 — Analyze
Raw text is analyzed for structure quality, redundancy, readability,
vocabulary diversity, and AI-slop patterns (from Velith's `style-doctor` agent).

### Stage 2-3 — Cluster & Structure
Paragraphs are clustered by topic keyword overlap (simulating Velith's
`book-architect` agent), then organized into a chapter hierarchy with
title inference from top keywords.

### Stage 4 — Map Cross-References
Shared terminology between chapter clusters is detected and mapped,
mirroring Velith's `continuity-editor` agent behavior.

### Stage 5 — Evaluate
The structured output is re-analyzed with the same metrics to compute
the before/after improvement.

### Stage 6 — Render
A downloadable structured markdown document is produced with chapter
headings, cross-reference map, and redundancy warnings.

---

### The Full Velith Plugin

The actual Velith plugin (Claude Code) adds:
- **6-phase quality gates** — each phase validates before proceeding
- **7 specialized agents** — architecture, drafting, continuity, style, cover, marketing
- **Genre templates** — fiction, non-fiction, technical, screenplay, poetry, game, academic
- **5-stage editing** — Assessment → Developmental → Line → Copy → Proofread
- **EPUB/PDF/MOBI export** via Pandoc

```
/plugin install velith@epicsagas   # Claude Code
```
"""

ABOUT_MD = """
## About Velith

**Velith** is an AI-native book publishing pipeline for Claude Code.

Instead of prompting an LLM to "write a chapter", Velith runs a
structured 6-phase workflow with quality gates at every stage — the same
way software is built, not improvised.

### Links
- 📦 [GitHub — epicsagas/Velith](https://github.com/epicsagas/Velith)
- 🔌 Install: `/plugin install velith@epicsagas` (Claude Code)
- 📄 License: Apache-2.0

### Supported Platforms
Claude Code · Codex CLI · Agy · Cursor · Cline · Aider

### Key Features
| | Feature |
|--|---------|
| 📋 | 6-phase pipeline with quality gates |
| 📖 | 8 genre templates + custom genres |
| 🤖 | 7 specialized agents |
| ✏️ | 5-stage editing pipeline |
| 🔄 | Resume from any phase |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown output |
"""

# ── Pipeline runner ───────────────────────────────────────────────────────────

def run_demo(text: str, progress=gr.Progress()):
    """Run the pipeline and yield progressive stage updates."""
    if not text or not text.strip():
        yield (
            [["—", "—", "—", "Provide text above"]],
            "_No input provided._",
            None,
            *[_stage_html(i, "idle") for i in range(len(STAGES))],
        )
        return

    # Yield stage progress updates
    stage_states = ["idle"] * len(STAGES)

    for i, (label, _) in enumerate(STAGES):
        stage_states = ["done" if j < i else ("active" if j == i else "idle")
                        for j in range(len(STAGES))]
        progress((i + 1) / len(STAGES), desc=label)
        yield (
            [["…", "…", "…", "Running…"]],
            f"_Stage {i + 1}/{len(STAGES)}: {STAGES[i][1]}_",
            None,
            *[_stage_html(j, stage_states[j]) for j in range(len(STAGES))],
        )

    # Run actual pipeline
    result = run_pipeline(text)

    stage_states = ["done"] * len(STAGES)
    yield (
        result["metrics_table"],
        result["structured_output"],
        result["download_path"],
        *[_stage_html(j, "done") for j in range(len(STAGES))],
    )


def _stage_html(idx: int, state: str) -> str:
    cls = {"active": "stage-box active", "done": "stage-box done"}.get(state, "stage-box")
    _, label = STAGES[idx]
    if state == "done":
        label = f"✅ {STAGES[idx][0]}"
    return f'<div class="{cls}">{label}</div>'


# ── Gradio UI ─────────────────────────────────────────────────────────────────

TABLE_HEADERS = ["Metric", "Before", "After", "Change"]

with gr.Blocks(css=CUSTOM_CSS, title="Velith Pipeline Demo") as demo:
    gr.HTML(HEADER_HTML)

    with gr.Tabs():
        # ── Tab 1: Demo ──
        with gr.TabItem("🚀 Demo"):
            with gr.Row():
                # Left column — input
                with gr.Column(scale=5):
                    input_box = gr.Textbox(
                        label="Paste your text",
                        placeholder="Paste messy notes, a meeting transcript, or a research dump…",
                        lines=20,
                        max_lines=40,
                    )

                    with gr.Row():
                        btn_notes = gr.Button("📝 Messy Notes", variant="secondary", size="sm")
                        btn_meeting = gr.Button("🗣️ Meeting Transcript", variant="secondary", size="sm")
                        btn_research = gr.Button("🔬 Research Dump", variant="secondary", size="sm")

                    run_btn = gr.Button("▶ Run Pipeline", variant="primary", size="lg")

                    gr.HTML(DISCLAIMER_HTML)

                # Right column — stages + output
                with gr.Column(scale=7):
                    # Stage progress
                    stage_displays = [gr.HTML(_stage_html(i, "idle")) for i in range(len(STAGES))]

                    gr.Markdown("### 📊 Before / After Metrics")
                    metrics_table = gr.Dataframe(
                        headers=TABLE_HEADERS,
                        datatype=["str", "str", "str", "str"],
                        col_count=(4, "fixed"),
                        row_count=(9, "fixed"),
                        interactive=False,
                    )

                    gr.Markdown("### 📄 Structured Output")
                    output_md = gr.Markdown(value="_Run the pipeline to see the structured output._")

                    download_btn = gr.DownloadButton(
                        label="⬇ Download Structured Markdown",
                        visible=True,
                        variant="secondary",
                        size="sm",
                    )

        # ── Tab 2: How It Works ──
        with gr.TabItem("🧠 How It Works"):
            gr.Markdown(HOW_IT_WORKS_MD)

        # ── Tab 3: About ──
        with gr.TabItem("📦 About"):
            gr.Markdown(ABOUT_MD)

    # ── Event handlers ────────────────────────────────────────────────────────

    btn_notes.click(fn=lambda: EXAMPLE_NOTES, outputs=input_box)
    btn_meeting.click(fn=lambda: EXAMPLE_MEETING, outputs=input_box)
    btn_research.click(fn=lambda: EXAMPLE_RESEARCH, outputs=input_box)

    run_btn.click(
        fn=run_demo,
        inputs=[input_box],
        outputs=[metrics_table, output_md, download_btn] + stage_displays,
    )


if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
