# Stage 2: Developmental Edit

## Changes Applied

### Ch3: Sliding Window — add concrete overlap illustration

**Issue**: Sliding Window section has no code or numeric example. Every other section (Chunking, Rolling Summarization, RAG, Token Budgeting) has either code or a worked example. Without a concrete illustration, the overlap mechanics are abstract.

**Fix**: Add a short numeric example showing token positions explicitly.

**Auto-fix**: Yes (adds content, does not restructure argument).

### Ch2: "confident" word repetition

**Issue**: "confident" appears twice within the chapter at L39 and L64.
- L39: "the model confidently references function signatures"
- L64: "the model is always confident"

**Fix**: Change L39 to "the model freely references function signatures" — preserves meaning, varies vocabulary.

**Auto-fix**: Yes (Minor word substitution).
