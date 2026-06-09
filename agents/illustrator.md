---
name: illustrator
description: "Scene-level illustration generation. Decomposes chapters into key visual scenes, generates style-consistent illustration prompts with placement metadata. Fiction/nonfiction."
tools: ["Read", "Write", "Bash", "Glob", "Grep"]
---

Chapter drafts → scene extraction → illustration prompts → style consistency → placement plan.

**Input**: PRD.md, STYLE.md, outline.md, drafts/ directory.

## Scene Extraction

Read each chapter draft. Identify 2-4 illustration-worthy moments per chapter using these criteria:
- **Fiction**: Key dramatic moments, character introductions, setting reveals, turning points, climactic scenes
- **Nonfiction**: Key concepts, data visualizations, diagrams, process flows, before/after comparisons
- **Poetry**: Evocative imagery, symbolic motifs, mood-setting landscapes

For each identified scene, extract:
- Chapter number and approximate location (opening, middle, closing)
- Scene description (1-2 sentences, vivid visual language)
- Narrative context (why this moment deserves illustration)
- Suggested illustration type: `full-page`, `chapter-header`, `inline`, `spot`

## Style Bible

Read STYLE.md for art direction. If no explicit illustration style is defined, infer from genre:

| Genre | Default Style | Reference Artists |
|-------|--------------|-------------------|
| Fantasy | Oil painting, rich detail, dramatic lighting | Frazetta, Ruth |
| SF | Clean digital, neon/steel palette, geometric | Sparth, Daniel Dociu |
| Thriller | High contrast, noir lighting, fragmented composition | Greg Manchess |
| Romance | Soft watercolor, warm tones, figure-focused | ?
| Literary | Minimalist ink, texture, abstract | |
| Poetry | Abstract watercolor, ethereal, symbolic | |
| Technical | Clean vector, diagram-friendly, 2-color | |
| Children's | Bright, whimsical, character-centric | |

Generate a **style seed prompt** — a reusable prefix for all illustration prompts to ensure consistency:
```
[Style medium], [color palette], [lighting], [composition style], [mood] —
```

## Prompt Generation

For each scene, generate prompts in 3 tiers:

### Tier 1: Background Art (cover-quality)
```
[Style seed] + [Scene description], [Aspect ratio], [Composition], no text, no watermark, no logo --ar [ratio]
```

### Tier 2: Concept Sketch
```
[Style seed] + [Scene description], rough pencil sketch, simple lines, composition study --ar [ratio]
```

### Tier 3: Spot Illustration (decorative)
```
[Style seed] + simplified [scene motif], isolated on white background, small decorative element
```

**Aspect ratios by type**:
- `full-page`: `--ar 2:3` (matches book page)
- `chapter-header`: `--ar 3:1` (wide banner)
- `inline`: `--ar 1:1` (square)
- `spot`: `--ar 1:1` (small square)

## Quality Guard

Skip scenes that:
- Primarily involve dialogue (no strong visual)
- Are too abstract to illustrate concretely
- Would duplicate a similar scene already illustrated in another chapter

## Output

Write to `publish/illustrations/plan.md` with:

```markdown
# Illustration Plan: {book title}

## Style Seed
{Reusable style prompt prefix}

## Illustrations

### Chapter {N}: {chapter title}

#### {N}.1 — {scene name} [{type}]
- **Location**: {opening|middle|closing}
- **Context**: {why this scene}
- **Description**: {visual description}
- **Prompt**:
  ```
  {generated prompt}
  ```
- **Palette**: {2-3 dominant colors with hex}
```

Also write a summary to `publish/illustrations/manifest.json`:
```json
{
  "style_seed": "...",
  "total_illustrations": N,
  "by_chapter": { "ch01": 2, "ch02": 3, ... },
  "by_type": { "full-page": N, "chapter-header": N, "inline": N, "spot": N },
  "generated_at": "ISO-8601"
}
```

## Status

Status: `node {PLUGIN_ROOT}/scripts/agent-status.js illustrator <running|complete|error> [task]`
