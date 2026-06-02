# Marketing Plan

## Reader Personas

### Persona 1: The Production Engineer
- **Who**: Backend/full-stack engineer shipping LLM features at a startup or mid-sized company
- **Problem**: Chatbot works in dev, mysteriously degrades in production after long sessions
- **Where they are**: HN, Reddit r/MachineLearning, r/LocalLLaMA, Dev.to, internal Slack
- **Hook**: "Why does my app break after 20 turns?" — Chapter 2 silent failure modes

### Persona 2: The AI Integration Developer
- **Who**: Developer building RAG pipelines, document Q&A, or copilot features
- **Problem**: Uncertain about how much context to include, why retrieval sometimes fails
- **Where they are**: LangChain Discord, LlamaIndex docs, HN, X/Twitter AI accounts
- **Hook**: "RAG keeps context lean by construction" — Chapter 3 strategies

### Persona 3: The Tech Lead / Architect
- **Who**: Senior engineer or engineering manager evaluating LLM infrastructure
- **Problem**: Team is fighting ad-hoc context management, no systematic approach
- **Where they are**: HN, internal tech blog, InfoQ, The Pragmatic Engineer newsletter
- **Hook**: Token budgeting as an engineering discipline, not prompt engineering

---

## Distribution Channels

| Channel | Format | When |
|---------|--------|------|
| Hacker News (Show HN) | Free ebook (EPUB + PDF) | Launch day |
| GitHub README | Link to PDF + example project | Launch day |
| X/Twitter thread | 8-tweet breakdown of Ch2 silent failures | Day 1 |
| Reddit r/MachineLearning | "I wrote a short guide on context windows" | Day 2 |
| Reddit r/LocalLLaMA | Focus on local model limits (8k vs 200k table) | Day 3 |
| Dev.to article | Adapted Ch3 as standalone post | Week 2 |
| HuggingFace Space | Interactive demo using this book's concepts | Ongoing |

---

## 12-Week Launch Calendar

### Week 1 — Launch
- Day 1: Post EPUB + PDF freely, Show HN
- Day 2: X/Twitter thread (Ch2 silent failure modes as hook)
- Day 3: Reddit posts
- Day 4-7: Respond to comments, collect feedback

### Week 2-3 — Content Distribution
- Adapt Ch3 into a Dev.to / Substack post: "5 Production Strategies for LLM Context"
- Share token budgeting table as a standalone tweet/image
- Post ASCII sliding window diagram on X — visual hooks perform well

### Week 4-6 — SEO / Discoverability
- Submit to AI newsletters (TLDR AI, The Batch, Import AI)
- Add to awesome-llm-resources and similar GitHub lists
- Ensure book is indexed on HuggingFace model pages (link in model card descriptions)

### Week 7-12 — Community
- Answer HN/Reddit questions with links to relevant chapters
- Update content if major model changes (new context window sizes)
- Track which chapter gets most links/shares → expand into longer guide

---

## Launch Checklist

- [ ] EPUB and PDF available for free download (no email gate)
- [ ] GitHub repo with source markdown files
- [ ] HN title under 80 characters: "Understanding LLM Context Windows – free guide (EPUB/PDF)"
- [ ] HN first comment: brief personal context, what the guide covers, what it doesn't
- [ ] X/Twitter thread drafted and scheduled
- [ ] Reddit posts written (one per subreddit, different angles)
- [ ] HuggingFace Space demo linked in README

---

## Success Metrics

| Timeframe | Target |
|-----------|--------|
| Day 1 | 200+ HN upvotes, 500+ PDF downloads |
| Week 1 | 1,000+ downloads, 50+ GitHub stars |
| Month 1 | 5,000+ downloads, 200+ GitHub stars |
| Month 3 | Referenced in 3+ blog posts or newsletters |

---

## Pricing Strategy

**Free**, no email gate, open source (Apache-2.0).

Rationale: This is a demonstration of Velith's capabilities. The goal is inbound attention to the plugin, not monetization of the content itself. Gating a short technical guide reduces reach with no meaningful revenue upside.
