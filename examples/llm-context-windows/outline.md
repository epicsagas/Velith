# Outline — Understanding LLM Context Windows

## Structure Overview

Technical genre distribution (3-chapter demo):
- Chapter 1: Introduction/Foundations (40%) — what + why
- Chapter 2: Mechanisms (30%) — how it breaks
- Chapter 3: Practice (30%) — what to do about it

Total target: ~2,400 words

---

## Chapter Specs

### Chapter 1: What Is a Context Window?
- **Hook:** "You paste 10,000 words into ChatGPT and it forgets the first half. Here's why."
- **Key concepts:** token, tokenization, context window, attention mechanism (surface-level), model memory
- **Word target:** 800 words (±10%)
- **Difficulty:** Beginner
- **Prerequisites:** None
- **Source refs:** Transformer attention overview, OpenAI/Anthropic token limit docs
- **Structure:**
  1. The filing cabinet analogy — what a model "sees" per request
  2. What a token actually is (with examples: "unbelievable" = 3 tokens)
  3. Why windows are bounded — quadratic attention cost, brief
  4. Common limits table (GPT-4: 128k, Claude 3: 200k, Llama 3: 8k)
  5. Key takeaway: context window = working memory, not long-term memory

### Chapter 2: What Happens When Context Runs Out
- **Hook:** "Your carefully crafted system prompt just got silently truncated. Your app has no idea."
- **Key concepts:** truncation, recency bias, context poisoning, hallucination under context pressure, silent failure
- **Word target:** 800 words (±10%)
- **Difficulty:** Intermediate
- **Prerequisites:** Chapter 1 (token, context window)
- **Source refs:** LLM truncation behavior docs, known hallucination patterns under long context
- **Structure:**
  1. How truncation happens — which tokens get dropped (oldest first)
  2. Recency bias — why models weight recent tokens more
  3. Silent failure modes — the model doesn't tell you it forgot
  4. Context poisoning — contradictory info added mid-conversation
  5. Diagnosing the problem in production (log token counts)

### Chapter 3: Practical Strategies for Managing Context
- **Hook:** "Three techniques used in production LLM apps — none require a bigger context window."
- **Key concepts:** chunking, summarization, retrieval-augmented generation (RAG), sliding window, token budgeting
- **Word target:** 800 words (±10%)
- **Difficulty:** Intermediate
- **Prerequisites:** Chapter 1 (token), Chapter 2 (truncation, context pressure)
- **Source refs:** RAG pattern literature, production LLM architecture patterns
- **Structure:**
  1. Chunking — split input, process in pieces, merge results
  2. Rolling summarization — compress old context into a summary token
  3. RAG — retrieve only what's relevant, keep context lean
  4. Sliding window — overlap chunks to preserve continuity
  5. Token budgeting — reserve slots for system prompt, history, output
  6. Decision guide: which strategy for which problem

---

## Cross-Reference Map (DAG)

```
token (Ch1) ──────────────────────────────► chunking (Ch3)
context window (Ch1) ──► truncation (Ch2) ──► sliding window (Ch3)
                    └──────────────────────► token budgeting (Ch3)
attention mechanism (Ch1) ──► recency bias (Ch2)
truncation (Ch2) ──► RAG (Ch3)
context poisoning (Ch2) ──► rolling summarization (Ch3)
```

No cycles. Each concept defined exactly once (at first appearance chapter).

---

## Validation

**Technical genre checklist:**
- [x] Novice → expert ordering (Ch1 beginner, Ch2-3 intermediate)
- [x] Concept dependencies respected (token defined before chunking)
- [x] No forward references without prior definition
- [x] Difficulty gradient smooth (1 → 2 → 3)
- [x] Each chapter self-contained with a clear problem → solution shape
- [x] Word targets consistent (~800 each, 2,400 total)
