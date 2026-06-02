# Stage 3: Line Edit

## STYLE.md Compliance Check

### Voice & Person
- ✅ Second person ("you", "your") consistent throughout all 3 chapters
- ✅ Conversational but precise — no academic hedging, no informal slang
- ✅ No passive voice chains > 2 clauses

### Technical Term Definition
- ✅ **context window** — defined Ch1 on first use
- ✅ **token** / **tokenization** — defined Ch1 with inline examples
- ✅ **quadratic** — explained inline ("double the context, quadruple the compute")
- ✅ **oldest-first truncation** — defined Ch2 on first use
- ✅ **recency bias** — defined Ch2 on first use
- ✅ **context poisoning** — defined Ch2 on first use
- ✅ **chunking** — defined Ch3 on first use
- ✅ **rolling summarization** — defined Ch3 on first use
- ✅ **RAG** — expanded on first use (Ch3)
- ✅ **sliding window** — defined Ch3 on first use
- ✅ **token budgeting** — defined Ch3 on first use

### Code Blocks
- ✅ All code blocks under 10 lines (STYLE.md limit)
- ✅ Python used throughout
- ⚠️ Ch3 Sliding Window diagram uses ASCII — acceptable (not code, no language tag needed)

### Prohibited Patterns (AI-slop scan)
- Scanned for: "delve", "it's worth noting", "in conclusion", "tapestry", "groundbreaking", "revolutionary", "game-changer", "Furthermore,", "Moreover,", "In today's world,"
- ✅ None found across all 3 chapters

### Formatting
- ✅ H1 for chapter title, H2 for sections — consistent
- ✅ **Bold** on key terms at first introduction only
- ✅ Tables used for comparison data (Ch1 model table, Ch3 strategy tables)
- ✅ Bullet/bold pattern for silent failure modes (Ch2) — clear and scannable

## Line-Level Fixes Applied

### Ch1, para 4 — minor tightening
**Before**: "Sounds like a lot. But a large codebase, a research paper with appendices, or a day's worth of chat history can fill that faster than you'd expect."
**After**: No change — rhythm is intentional. Short sentence creates pause before the "but."

### Ch2, "Recency Bias" section — clarify RAG tip
**Before**: "If you're using RAG and injecting retrieved documents, put the user's actual question after the documents, not before."
**Issue**: Slightly ambiguous — "after" could mean after in the system prompt or after as a separate message.
**Fix**: Add "in your prompt" for clarity.

**Auto-fix**: Yes (Minor).
