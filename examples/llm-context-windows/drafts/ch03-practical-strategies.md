---
chapter: 3
title: "Practical Strategies for Managing Context"
word_target: 800
status: edited
created: 2026-06-02
---

# Practical Strategies for Managing Context

Three techniques used in production LLM apps — none require a bigger context window.

The instinct when you hit context limits is to find a model with a larger window. Sometimes that's the right call. But context window size is a blunt instrument: it costs more, responds slower, and doesn't address the underlying issue — sending the model more than it needs. The strategies below are about precision.

## Chunking

**Chunking** splits a large input into smaller pieces, processes each piece independently, then merges the results. It's the simplest strategy and the right first move for single-pass tasks on large documents.

If you need to summarize a 60,000-word report and your model has an 8,000-token window, you don't need a bigger model. Chunk the report into sections, summarize each one, then summarize the summaries:

```python
def chunk_text(text, chunk_size=2000):
    words = text.split()
    return [" ".join(words[i:i+chunk_size])
            for i in range(0, len(words), chunk_size)]

summaries = [summarize(chunk) for chunk in chunk_text(document)]
final = summarize("\n\n".join(summaries))
```

The tradeoff: concepts introduced in chunk 1 may be referenced in chunk 3 without definition. Adding overlap — including the last 200 words of the previous chunk at the start of the next — reduces information loss at boundaries.

## Rolling Summarization

For ongoing conversations, **rolling summarization** compresses the oldest turns into a summary and replaces them with it. Instead of dropping old turns entirely (the default truncation behavior), you distill them.

After every N turns, take the oldest M messages, summarize them into a compact paragraph, and swap them out:

```python
def compress_history(messages, keep_recent=6):
    if len(messages) <= keep_recent:
        return messages
    old = messages[:-keep_recent]
    summary = summarize_messages(old)  # your summarization function
    compressed = {"role": "system", "content": f"Earlier: {summary}"}
    return [compressed] + messages[-keep_recent:]
```

This keeps total context size bounded regardless of conversation length. The cost is nuance: a summary loses exact wording, tone, and edge cases. For high-stakes flows where a user's earlier phrasing matters, it's a risk worth knowing about.

## Retrieval-Augmented Generation (RAG)

**RAG** is the right tool when you have a large, relatively static knowledge base — documentation, a codebase, a support ticket history — and need the model to answer questions about it.

Instead of loading the entire knowledge base into context (impossible at scale), you index it into a vector store, then retrieve only the most relevant pieces at query time:

```python
hits = vector_store.search(user_query, top_k=5)
context = "\n\n".join(h.text for h in hits)
response = llm.complete(system=f"Context:\n{context}", user=user_query)
```

RAG keeps context lean by construction. The tradeoff is retrieval quality: if the embedding search returns the wrong chunks, the model answers from irrelevant material without knowing it. Garbage in, confident garbage out.

## Sliding Window

When processing a continuous stream — a long document, a transcript, a log file — **sliding window** processing maintains continuity across chunk boundaries.

Each window overlaps with the previous one by some amount. A 2,000-token window with a 400-token overlap means window 2 begins 1,600 tokens into window 1. Any entity or concept introduced in the final 400 tokens of window 1 is visible at the start of window 2.

```
Window 1: [tokens 0 ──────────────── 2000]
Window 2:                [tokens 1600 ──────────────── 3600]
Window 3:                                [tokens 3200 ──────────────── 5200]
                          ↑ overlap ↑
```

This prevents the hard boundary problem of plain chunking, at the cost of processing overlap tokens twice. For a 400-token overlap on 2,000-token windows, that's a 20% compute overhead — usually worth it when continuity matters.

## Token Budgeting

The most underused strategy is also the most direct: **explicitly allocate your context window before building a request**.

Treat the context window like memory in an embedded system — you know the total, so assign slots:

| Slot | Allocation |
|------|-----------|
| System prompt | 500 tokens (never truncate) |
| Conversation history | 2,000 tokens |
| Retrieved context (RAG) | 3,000 tokens |
| User message | 500 tokens |
| Output buffer | 2,000 tokens |
| **Total** | **8,000 tokens** |

Enforce these limits in code. Trim history before retrieved context. Trim retrieved context before touching the system prompt. The system prompt is inviolable.

## Choosing a Strategy

| Situation | Use |
|-----------|-----|
| Large document, one-shot question | Chunking |
| Long conversation, unbounded turns | Rolling summarization |
| Large knowledge base, dynamic queries | RAG |
| Stream processing with continuity | Sliding window |
| Any app at risk of overflow | Token budgeting |

These compose. A production chatbot over a documentation corpus might use RAG to pull relevant docs, rolling summarization to compress history, and token budgeting to enforce hard limits — all in the same request pipeline.

Context management isn't the interesting part of building LLM applications. But it's the part that determines whether they work reliably at scale. A model is only as good as what you put in front of it.
