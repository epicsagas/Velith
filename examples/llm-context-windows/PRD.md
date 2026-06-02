# PRD — Understanding LLM Context Windows

## Book Identity
- **Title (working):** Understanding LLM Context Windows
- **Genre:** Technical
- **Language:** English
- **Status:** Phase 0 complete

## Reader Personas
1. **Mid-level software developer** — writes production code, uses LLM APIs (OpenAI, Anthropic), wants to understand why prompts break at scale and how to fix it
2. **AI-curious engineer** — building LLM-powered features for the first time, confused by token limits, context loss, and retrieval patterns

## Scope
- **Chapters:** 3 (demo scope)
- **Target word count:** ~2,400 words total (~800 per chapter)
- **Format:** Technical mini-book / long-form guide

## Chapter Outline (high-level)
1. What Is a Context Window? — tokens, limits, why they exist
2. What Happens When Context Runs Out — truncation, hallucination, degraded recall
3. Practical Strategies — chunking, summarization, RAG, sliding window

## Source Map
1. Public LLM documentation (OpenAI, Anthropic token limits)
2. Transformer architecture fundamentals (attention mechanism, quadratic scaling)
3. Common developer pain points (prompt truncation, lost instructions, context poisoning)

## Success Criteria
- Reader understands what a context window is and why it's bounded
- Reader can explain what goes wrong when context is exceeded
- Reader knows 3+ practical strategies to work within context limits
- Each chapter is self-contained and under 900 words
- No jargon without definition on first use
