"""Text analysis engine — heuristic metrics that mirror Velith's style-doctor and book-architect agents.

All metrics are deterministic and computed locally with no external API calls.
"""

import re
import textstat
from collections import Counter
from typing import Any

# AI-slop patterns from Velith's CONVENTIONS.md
SLOP_PATTERNS = [
    "revolutionary", "game-changer", "groundbreaking", "seamless",
    "robust", "transformative", "delve", "tapestry", "nuanced",
    "multifaceted", "plethora", "myriad", "in conclusion",
    "at the end of the day", "it could be argued", "it's worth noting",
    "in today's world", "in the realm of", "a testament to",
    "leveraging", "synergy", "paradigm shift", "holistic",
    "invaluable", "unprecedented", "meticulous", "cornerstone",
    "beacon of", "navigate the landscape", "rich tapestry",
]

STOP_WORDS = frozenset({
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "as", "into", "through", "during", "before", "after", "above", "below",
    "between", "out", "off", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "each",
    "every", "both", "few", "more", "most", "other", "some", "such", "no",
    "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "because", "but", "and", "or", "if", "while", "about", "up", "that",
    "this", "these", "those", "it", "its", "i", "me", "my", "we", "our",
    "you", "your", "he", "she", "they", "them", "what", "which", "who",
    "also", "been", "get", "got", "like", "one", "two", "new", "now",
    "way", "many", "much", "well", "back", "even", "still", "make",
})


def _split_sentences(text: str) -> list[str]:
    """Split text into sentences using regex."""
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s.strip() for s in sentences if s.strip() and len(s.strip()) > 3]


def _get_trigrams(words: list[str]) -> set[str]:
    """Generate set of trigrams from word list."""
    if len(words) < 3:
        return set()
    return {" ".join(words[i:i+3]) for i in range(len(words) - 2)}


def _content_words(text: str) -> list[str]:
    """Extract content words (lowercase, no stop words)."""
    words = re.findall(r'[a-zA-Z]+', text.lower())
    return [w for w in words if w not in STOP_WORDS and len(w) > 2]


class TextAnalyzer:
    """Analyzes raw text and computes heuristic metrics."""

    def __init__(self, text: str):
        self.raw_text = text
        self.paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        self.sentences = _split_sentences(text)
        self.words = text.split()
        self.word_count = len(self.words)

    def analyze(self) -> dict[str, Any]:
        """Run all analyses and return metrics dict."""
        return {
            "token_count": self._token_count(),
            "sentence_count": len(self.sentences),
            "paragraph_count": len(self.paragraphs),
            "redundancy_score": self._redundancy_score(),
            "structure_score": self._structure_score(),
            "readability_grade": self._readability(),
            "ai_slop_per_1k": self._ai_slop_detection(),
            "coherence_score": self._coherence_score(),
            "heading_count": self._heading_count(),
            "avg_sentence_length": self._avg_sentence_length(),
            "vocabulary_diversity": self._vocabulary_diversity(),
        }

    def _token_count(self) -> int:
        """Total word count."""
        return self.word_count

    def _redundancy_score(self) -> float:
        """Trigram Jaccard similarity between consecutive paragraphs (0-100%)."""
        if len(self.paragraphs) < 2:
            return 0.0

        similarities = []
        for i in range(len(self.paragraphs) - 1):
            words_a = _content_words(self.paragraphs[i])
            words_b = _content_words(self.paragraphs[i + 1])
            tris_a = _get_trigrams(words_a)
            tris_b = _get_trigrams(words_b)

            if not tris_a or not tris_b:
                continue

            intersection = tris_a & tris_b
            union = tris_a | tris_b
            if union:
                similarities.append(len(intersection) / len(union))

        return round(sum(similarities) / len(similarities) * 100, 1) if similarities else 0.0

    def _structure_score(self) -> float:
        """Structure quality score (0-10) based on headings, balance, and coherence."""
        score = 0.0

        # Heading detection (0-3 points)
        heading_count = self._heading_count()
        if heading_count >= 5:
            score += 3.0
        elif heading_count >= 3:
            score += 2.0
        elif heading_count >= 1:
            score += 1.0

        # Section balance (0-3 points) — low stddev of paragraph lengths = balanced
        if len(self.paragraphs) >= 3:
            lengths = [len(p.split()) for p in self.paragraphs]
            avg_len = sum(lengths) / len(lengths)
            if avg_len > 0:
                cv = (sum((l - avg_len) ** 2 for l in lengths) / len(lengths)) ** 0.5 / avg_len
                if cv < 0.3:
                    score += 3.0
                elif cv < 0.5:
                    score += 2.0
                elif cv < 0.8:
                    score += 1.0

        # Topic coherence (0-2 points)
        if len(self.paragraphs) >= 2:
            all_content_words = _content_words(self.raw_text)
            if all_content_words:
                word_freq = Counter(all_content_words)
                top_5_coverage = sum(c for _, c in word_freq.most_common(5)) / len(all_content_words)
                if 0.05 <= top_5_coverage <= 0.25:
                    score += 2.0
                elif top_5_coverage < 0.05:
                    score += 1.0

        # Hierarchy bonus (0-2 points)
        has_h1 = bool(re.search(r'^# ', self.raw_text, re.MULTILINE))
        has_h2 = bool(re.search(r'^## ', self.raw_text, re.MULTILINE))
        has_h3 = bool(re.search(r'^### ', self.raw_text, re.MULTILINE))
        if has_h1 and has_h2 and has_h3:
            score += 2.0
        elif has_h1 and has_h2:
            score += 1.0

        return round(min(score, 10.0), 1)

    def _readability(self) -> float:
        """Flesch-Kincaid Grade Level via textstat."""
        try:
            return round(textstat.flesch_kincaid_grade(self.raw_text), 1)
        except Exception:
            return 0.0

    def _ai_slop_detection(self) -> float:
        """Count AI-slop patterns per 1000 words."""
        text_lower = self.raw_text.lower()
        count = sum(1 for pattern in SLOP_PATTERNS if pattern in text_lower)
        if self.word_count == 0:
            return 0.0
        return round(count / (self.word_count / 1000), 1)

    def _coherence_score(self) -> float:
        """Consecutive sentence word overlap score (0-10)."""
        if len(self.sentences) < 2:
            return 5.0

        overlaps = []
        for i in range(len(self.sentences) - 1):
            words_a = set(_content_words(self.sentences[i]))
            words_b = set(_content_words(self.sentences[i + 1]))

            if not words_a or not words_b:
                continue

            intersection = words_a & words_b
            union = words_a | words_b
            overlaps.append(len(intersection) / len(union))

        if not overlaps:
            return 5.0

        avg_overlap = sum(overlaps) / len(overlaps)
        # Scale to 0-10: overlap 0.05-0.25 is sweet spot for coherence
        score = min(avg_overlap * 40, 10.0)
        return round(score, 1)

    def _heading_count(self) -> int:
        """Count markdown headings."""
        return len(re.findall(r'^#{1,6}\s+', self.raw_text, re.MULTILINE))

    def _avg_sentence_length(self) -> float:
        """Average words per sentence."""
        if not self.sentences:
            return 0.0
        return round(sum(len(s.split()) for s in self.sentences) / len(self.sentences), 1)

    def _vocabulary_diversity(self) -> float:
        """Type-token ratio (unique words / total words)."""
        content = _content_words(self.raw_text)
        if not content:
            return 0.0
        return round(len(set(content)) / len(content), 3)
