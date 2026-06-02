"""Structure extraction — simulates Velith's outlining phase.

Clusters paragraphs by topic keyword overlap, builds a chapter hierarchy,
finds cross-references, and identifies redundant sections.
"""

import re
from collections import Counter
from typing import Any

from .analyzer import _content_words, STOP_WORDS


class TextStructurer:
    """Extracts structure from unstructured text."""

    def __init__(self, text: str, metrics: dict[str, Any]):
        self.text = text
        self.metrics = metrics
        self.paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    def extract(self) -> dict[str, Any]:
        """Run full structure extraction."""
        topics = self._cluster_by_topic()
        self._last_topics = topics  # exposed for __init__.py paragraph mapping
        chapters = self._build_chapters(topics)
        xrefs = self._find_cross_references(chapters)
        redundancies = self._mark_redundancies()
        return {
            "chapters": chapters,
            "cross_references": xrefs,
            "redundant_sections": redundancies,
            "chapter_count": len(chapters),
        }

    def _cluster_by_topic(self) -> list[dict[str, Any]]:
        """Group paragraphs into topic clusters using keyword overlap."""
        if not self.paragraphs:
            return []

        # Extract keywords per paragraph
        para_keywords = []
        for p in self.paragraphs:
            words = _content_words(p)
            freq = Counter(words)
            # Top keywords per paragraph
            keywords = {w for w, _ in freq.most_common(8)}
            para_keywords.append(keywords)

        # Simple clustering: merge paragraphs with shared keywords
        clusters: list[list[int]] = []
        assigned = set()

        for i, kw_i in enumerate(para_keywords):
            if i in assigned:
                continue

            cluster = [i]
            assigned.add(i)

            for j, kw_j in enumerate(para_keywords):
                if j in assigned or j <= i:
                    continue
                # Overlap ratio
                if kw_i and kw_j:
                    overlap = len(kw_i & kw_j) / min(len(kw_i), len(kw_j))
                    if overlap >= 0.25:
                        cluster.append(j)
                        assigned.add(j)

            clusters.append(cluster)

        # Build topic dicts
        topics = []
        for cluster_indices in clusters:
            cluster_paras = [self.paragraphs[i] for i in cluster_indices]
            all_words: list[str] = []
            for idx in cluster_indices:
                all_words.extend(_content_words(self.paragraphs[idx]))

            top_keywords = [w for w, _ in Counter(all_words).most_common(7)]
            topics.append(
                {
                    "paragraphs": cluster_paras,
                    "indices": cluster_indices,
                    "keywords": top_keywords,
                    "word_count": sum(len(p.split()) for p in cluster_paras),
                }
            )

        return topics

    def _build_chapters(self, topics: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Convert topic clusters into chapter structure."""
        chapters = []

        for i, topic in enumerate(topics):
            # Generate title from top keywords
            keywords = topic["keywords"]
            if len(keywords) >= 2:
                title = f"{keywords[0].title()} & {keywords[1].title()}"
            elif keywords:
                title = keywords[0].title()
            else:
                title = f"Section {i + 1}"

            # First sentence as summary
            first_para = topic["paragraphs"][0] if topic["paragraphs"] else ""
            sentences = re.split(r"(?<=[.!?])\s+", first_para)
            summary = sentences[0] if sentences else ""

            chapters.append(
                {
                    "number": i + 1,
                    "title": title,
                    "summary": summary,
                    "key_concepts": keywords[:5],
                    "word_count": topic["word_count"],
                    "paragraph_count": len(topic["paragraphs"]),
                }
            )

        return chapters

    def _find_cross_references(
        self, chapters: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:
        """Find shared terms between chapters (cross-references)."""
        xrefs = []
        for i, ch_a in enumerate(chapters):
            for j, ch_b in enumerate(chapters):
                if j <= i:
                    continue
                shared = set(ch_a["key_concepts"]) & set(ch_b["key_concepts"])
                if shared:
                    xrefs.append(
                        {
                            "from_chapter": ch_a["number"],
                            "to_chapter": ch_b["number"],
                            "shared_terms": list(shared),
                        }
                    )
        return xrefs

    def _mark_redundancies(self) -> list[dict[str, Any]]:
        """Identify paragraphs with high trigram overlap."""
        from .analyzer import _get_trigrams

        if len(self.paragraphs) < 2:
            return []

        para_trigrams = []
        for p in self.paragraphs:
            words = _content_words(p)
            para_trigrams.append(_get_trigrams(words))

        redundancies = []
        for i in range(len(self.paragraphs)):
            for j in range(i + 1, len(self.paragraphs)):
                if not para_trigrams[i] or not para_trigrams[j]:
                    continue
                intersection = para_trigrams[i] & para_trigrams[j]
                union = para_trigrams[i] | para_trigrams[j]
                if union:
                    sim = len(intersection) / len(union)
                    if sim >= 0.3:
                        redundancies.append(
                            {
                                "paragraph_a": i + 1,
                                "paragraph_b": j + 1,
                                "similarity": round(sim, 2),
                                "shared_trigrams": len(intersection),
                            }
                        )

        return redundancies
