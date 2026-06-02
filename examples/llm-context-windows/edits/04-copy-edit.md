# Stage 4: Copy Edit

## Terminology Consistency

| Term | Ch1 | Ch2 | Ch3 | Verdict |
|------|-----|-----|-----|---------|
| context window | ✅ lowercase | ✅ lowercase | ✅ lowercase | Consistent |
| token(s) | ✅ lowercase | ✅ lowercase | ✅ lowercase | Consistent |
| RAG | — | mentioned once (informal) | ✅ introduced formally | ✅ Consistent |
| system prompt | — | ✅ lowercase | ✅ lowercase | Consistent |
| transformer | ✅ lowercase | ✅ lowercase | — | Consistent |

## Numbers & Units

- ✅ Token counts formatted with commas: 128,000 / 200,000 / 1,000,000 ✅
- ✅ "8k" / "200k" informal shorthand used in narrative — acceptable for conversational tone
- ✅ Python numeric literals use underscores: `200_000` ✅
- ✅ Percentages consistent: "75-80%" (Ch2), "20%" (Ch3)

## Code Formatting

- ✅ All code blocks have `python` language tag
- ✅ ASCII diagram in Ch3 has no language tag (correct — it's not code)
- ✅ Inline code uses backticks consistently: `tiktoken`, `/v2/users`, `top_k=5`

## Fixes Applied

### Ch1 — model table: "Claude Sonnet 4" naming consistency
- ✅ "Claude Sonnet 4" matches current model naming convention

### Ch2 — inline code for endpoint paths
**Before**: `/v2/users`, `/v1/users` — already in backtick inline code ✅

### Ch3 — "summarize_messages" undefined
The function `summarize_messages` is called in the rolling summarization snippet but never defined. This is intentional (it's a placeholder for user implementation), but a comment clarifies intent.

**Fix**: Add `# your summarization function` comment.

**Auto-fix**: Yes (Minor).
