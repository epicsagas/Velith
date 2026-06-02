---
chapter: 2
title: "What Happens When Context Runs Out"
word_target: 800
status: edited
created: 2026-06-02
---

# What Happens When Context Runs Out

Your carefully crafted system prompt just got silently truncated. Your app has no idea.

That's the core danger. When a context window fills up, tokens get dropped — and the model never tells you. It keeps generating responses as if everything is fine, because from where it sits, it is. It only sees what's currently in context. What's missing is invisible to it.

## How Truncation Happens

When your input exceeds the context window, something has to give. Most APIs handle this with **oldest-first truncation**: the beginning of the conversation gets cut, the most recent messages are kept.

This makes sense intuitively — recent messages are usually more relevant. But it creates a specific failure pattern: long-running conversations silently lose their system prompt.

Picture a customer support bot with a 600-token system prompt: persona rules, response policies, things it must never say. After enough conversation turns, those 600 tokens scroll out of the window. The model is now running without its instructions. It didn't malfunction — it simply can't see them anymore. From that point on, every response is shaped by a policy it can no longer read.

Some APIs let you configure truncation behavior, or raise an error instead of silently truncating. Check the documentation for your specific provider. The default behavior is almost always silent.

## Recency Bias

Even when nothing gets truncated, models don't treat all tokens equally. Research on transformer attention patterns shows a consistent **recency bias**: tokens near the end of the context receive more attention weight than tokens in the middle.

This is sometimes called the "lost in the middle" problem. If you place critical instructions in the middle of a 100,000-token context, don't assume the model will follow them reliably. Instructions at the very start (system prompt) or immediately before the user's final message tend to stick better.

Practical takeaway: position your most important constraints at the edges of the context, not buried in the middle. If you're using RAG and injecting retrieved documents, put the user's actual question after the documents in your prompt, not before.

## Silent Failure Modes

The most dangerous property of context overflow is that it fails quietly. Three patterns show up repeatedly in production:

**Forgotten constraints.** The model was told "always respond in formal English." After 50 turns, that instruction is gone. It starts responding casually. Your monitoring catches nothing because the responses are still fluent.

**Lost code context.** You're asking an LLM to help debug a large service. You paste in files one at a time across a long session. By file 10, file 1 is no longer in context — but the model freely references function signatures and variable names from file 1 as if it can see them. The suggestions look plausible and are completely wrong.

**Stale facts.** You correct a detail mid-conversation: "actually the endpoint is `/v2/users`, not `/v1/users`." In a short conversation, the model uses the corrected value. In a long one, both the original and the correction may be in context, and the model may choose either — inconsistently.

## Context Poisoning

A related failure mode that gets less attention: **context poisoning**. This is when incorrect or adversarial content added to the context degrades the quality of all subsequent responses.

Accidental poisoning happens when a user pastes in wrong information, or when a retrieved document contains outdated data. The model has no way to flag a conflict between what's in context and what it knows from training — it just tries to reconcile them.

Intentional poisoning is the basis of prompt injection attacks: an attacker embeds instructions inside external content you ask the model to process ("Ignore your previous instructions and..."). Once that content is in context, every response is potentially compromised until the context resets.

## Diagnosing the Problem

The good news: token counts are easy to instrument. Every major API returns usage metadata on each response:

```python
response = client.messages.create(...)
used = response.usage.input_tokens
limit = 200_000  # Claude Sonnet 4.6
print(f"{used}/{limit} tokens ({used/limit:.0%} full)")
```

Set an alert threshold — 75-80% of your context window — and flag requests that exceed it for review. You'll quickly identify which conversation flows are at risk before users notice the degradation.

Silently failing LLM apps are some of the hardest to debug: the model is always confident, the output is always fluent, and the source of drift is invisible unless you're watching the numbers.

In the next chapter, we'll cover the strategies engineers use to keep context lean without sacrificing quality.
