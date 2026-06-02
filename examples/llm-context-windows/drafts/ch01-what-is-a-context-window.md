---
chapter: 1
title: "What Is a Context Window?"
word_target: 800
status: edited
created: 2026-06-02
---

# What Is a Context Window?

You paste 10,000 words into ChatGPT and it forgets the first half. Here's why.

This isn't a bug. It's a fundamental property of how large language models work — and once you understand it, a lot of otherwise mysterious model behavior starts to make sense.

## What the Model Actually Sees

Every time you send a message to a language model, the model starts fresh. It has no memory of previous sessions, no persistent storage, no internal database it's consulting. All it has is the text you send it right now, in this single request.

Think of it like a filing cabinet that gets emptied and refilled on every request. You hand the model a folder. It reads the folder. It writes a response. The folder disappears. Next request, you hand it a new folder — which might include the previous response if you're building a chat application, but that's your code doing that, not the model remembering anything.

This folder is the **context window**: the complete text the model can read before generating a response. Everything inside it the model can use. Everything outside it doesn't exist, from the model's perspective.

## What a Token Is

Models don't read text the way you do. They work with **tokens** — chunks of characters that a tokenizer has split the text into. Tokens roughly correspond to words, but not exactly.

Common English words are usually one token each: "cat", "run", "the". Longer or less common words get split: "unbelievable" becomes three tokens ("un", "believ", "able"). Spaces and punctuation count too. A rough rule: **1 token ≈ 4 characters**, or about 0.75 words.

Why does this matter? Because context window sizes are measured in tokens, not words or characters. When a model says it has a 128,000-token context window, that's roughly 96,000 words — about the length of a long novel. Sounds like a lot. But a large codebase, a research paper with appendices, or a day's worth of chat history can fill that faster than you'd expect.

You can check token counts with the `tiktoken` library (for OpenAI models) or the tokenizer endpoints in Anthropic's and Google's APIs:

```python
import tiktoken
enc = tiktoken.encoding_for_model("gpt-4o")
print(len(enc.encode("Hello, world!")))  # → 4 tokens
```

## Why Windows Are Bounded

If bigger context windows are better, why not make them infinite?

The short answer is math. The attention mechanism at the core of transformer models — the part that lets the model relate any word to any other word — scales **quadratically** with sequence length. Double the context, quadruple the compute. At some point the hardware cost becomes prohibitive.

Engineers are actively working around this with sparse attention patterns, linear attention variants, and state-space models. Context windows have grown dramatically over the past few years. But there's still a ceiling, and hitting it has real consequences for your application.

## Where Models Stand Today

As of mid-2026, here's what the major models offer:

| Model | Context Window |
|-------|---------------|
| GPT-5 | 1,047,576 tokens |
| Claude Opus 4.8 | 200,000 tokens |
| Claude Sonnet 4.6 | 200,000 tokens |
| Gemini 3.1 Pro | 1,048,576 tokens |
| Llama 4 Scout (local) | 10,000,000 tokens |
| Mistral Small 3.2 (local) | 128,000 tokens |

The range is striking: a quantized local model might cap at 128k tokens while frontier cloud models now push past one million. But bigger isn't always better — million-token windows cost more per request, respond more slowly, and attention quality still degrades over very long contexts. You pay for the space you use, so understanding what you actually need in context is worth your time.

## Working Memory, Not Long-Term Memory

Here's the thing most people get wrong: a context window is **working memory**, not long-term memory.

Working memory is what you hold in your head right now — the details you're actively juggling while solving a problem. It's fast, powerful, and finite. Long-term memory is everything you've ever learned — vast, persistent, slow to update.

A language model's training is its long-term memory. All the patterns, facts, and language it absorbed during training are baked into its weights. The context window is its working memory: the active scratchpad for this specific task, right now.

This matters in practice: a model can know a lot about Python from training, but if you don't include your specific function in the context window, it can't see it. Training knowledge doesn't substitute for missing context. A model that knows everything about SQL can still give you wrong answers about your schema if you forgot to paste it in.

In the next chapter, we'll look at what actually happens when the working memory fills up — and why the failures are so hard to detect.
