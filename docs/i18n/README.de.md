<!-- Translated from README.md @ v0.5.0 (2026-09-04) -->
<!-- The English version is the authoritative source and may be more up-to-date. -->

<div align="center">

# Velith

<p>
  <a href="https://github.com/epicsagas/Velith/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/Velith?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
  <a href="https://github.com/epicsagas/Velith/network/members"><img alt="Forks" src="https://img.shields.io/github/forks/epicsagas/Velith?style=for-the-badge&labelColor=0d1117&color=2ecc71&logo=github&logoColor=white" /></a>
  <a href="https://github.com/epicsagas/Velith/issues"><img alt="Issues" src="https://img.shields.io/github/issues/epicsagas/Velith?style=for-the-badge&labelColor=0d1117&color=ff6b6b&logo=github&logoColor=white" /></a>
  <a href="https://github.com/epicsagas/Velith/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/epicsagas/Velith?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=git&logoColor=white" /></a>
</p>
<p>
  <a href="../../.claude-plugin/plugin.json"><img alt="Version" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fepicsagas%2FVelith%2Fmain%2F.claude-plugin%2Fplugin.json&query=%24.version&label=version&color=fc8d62&labelColor=0d1117&style=for-the-badge" /></a>
  <a href="../../LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://claude.ai/code"><img alt="Claude Code" src="https://img.shields.io/badge/Claude_Code-plugin-bc8cff?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/openai/codex"><img alt="Codex CLI" src="https://img.shields.io/badge/Codex_CLI-plugin-10a37f?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://buymeacoffee.com/epicsaga"><img alt="Buy Me a Coffee" src="https://img.shields.io/badge/buy_me_a_coffee-FFDD00?style=for-the-badge&labelColor=0d1117&logo=buymeacoffee&logoColor=black" /></a>
</p>
<p>
  <a href="../../README.md">English</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.zh-Hans.md">中文</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.pt-BR.md">Português</a>
</p>

**Bücher auf menschlichem Niveau.** Von der leeren Seite bis zu veröffentlichbarem EPUB und PDF prüft eine Pipeline in sechs Phasen jedes Kapitel, jede Bearbeitung und jedes Bild an einem einzigen Maßstab: Ein kalter Leser, der Bücher dieses Genres kauft, erkennt nicht, dass das Manuskript ein Maschinen-Entwurf ist.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## Warum Velith?

Modelle der Spitzenklasse schreiben gute Sätze. Sich selbst überlassen entstehen trotzdem Bücher, die Leser weglegen: Eine Stimme, die ab Kapitel acht kippt, Figuren, die ihre Gefühle erklären, Statistiken, die nicht existieren, Absätze, die alle auf einen Punchline-Schluss hinauslaufen, Illustrationen, die pro Kapitel den Stil wechseln. Keines davon ist ein Modellproblem. Es ist ein Pipeline-Problem.

Velith ist diese Pipeline. Sie liest das gesamte Manuskript, bevor sie das nächste Kapitel schreibt, verriegelt die Stimme an einem Musterkapitel, bevor sie in Masse schreibt, kritisiert und überarbeitet jedes Kapitel, bevor es gespeichert wird, prüft jede Behauptung auf Fakten, schreibt beim Editieren das Manuskript um statt nur Berichte anzulegen, liest das fertige Buch kalt wie seine Zielleser und verweigert die Veröffentlichung, solange diese weiterlesen würden. Für Bilder gilt dasselbe: eine Art-Bibel pro Buch, daraus kompilierte Prompts für jedes Bildmodell, aus Code gerenderte Diagramme, und jedes Bild wird vor dem Versand angesehen und beurteilt.

## Was sich in 0.5 ändert

| Vorher (0.4) | Jetzt (0.5) |
|--------------|-----------|
| Agenten erhielten Kapitelzusammenfassungen | Agenten lesen das gesamte Manuskript (Spitzenmodelle haben 1M Token Kontext; ein Roman bleibt unter 200K) |
| Vier Kapitel parallel entworfen | Narrative Genres schreiben der Reihe nach; Kapitel N liest Kapitel N-1 |
| Ein Durchgang pro Kapitel | Entwurf → kalte Kritik mit Zitaten → Überarbeitung, vor dem Speichern |
| Die Bearbeitung erstellte Berichte | Die Bearbeitung schreibt das Manuskript an Ort und Stelle um, mit Snapshots, in 7 Stufen |
| Tic-Erkennung per Wortliste („delve") | Die KI-Marker-Taxonomie 2026: Rhythmus, Struktur, Emotion, Dialog, plus lexikalische Marker in en/ko/ja, gemessen mit `velith.mjs metrics` |
| Keine Faktenprüfung | `fact-checker` führt ein Behauptungsregister und entfernt, was nicht verifizierbar ist |
| Die Schwelle = Dateien vorhanden | Die Schwelle = Reifeurteil von `beta-reader`: fünf Achsen ≥ 7, kein Aufgabepunkt in den Kapiteln 1-3 |
| Nur Cover-Prompts | Art-Bibel, Look Lock, Code-gerenderte Figuren, kompilierte Prompts für jedes Backend, Vision-QA, Asset-Prüfung |

| | Funktion | Warum es zählt |
|--|---------|----------------|
| 📏 | Ein Qualitätsmaßstab | `skills/loom/quality-bar.md`: Fünf-Achsen-Rubrik, KI-Marker-Taxonomie, Kaltlese-Protokoll. Jeder Agent liest es |
| 📋 | 6-Phasen-Pipeline mit Autoren-Checkpoints | Konzept, Gliederung, Voice Lock, Look Lock, Umstellungen, Reifeurteil. Alles andere läuft unbeaufsichtigt |
| 📖 | 7 Genre-Werkstattreferenzen + benutzerdefiniert | Fiction, Sachbuch, Technik, Drehbuch, Poesie, Spiel, akademisch: Strukturenoptionen, Handwerk, genrespezifische Marker, Sprachnotizen |
| 🤖 | 12 spezialisierte Agenten | Architekt, Szenenplaner, Autor, Kontinuität, Faktenprüfer, Stildoktor, Beta-Leser, Art Director, Figuren-Ingenieur, Illustrator, Cover, Marketing |
| ✏️ | Bearbeitung in 7 Stufen | Faktenprüfung → Beurteilung → Umstellung → Zeilenarbeit → Kopie → Korrektorat → Reifeurteil |
| 🎨 | Visuelles System | Art-Bibel, Look Lock, Mermaid/D2/SVG-Figuren, modellagnostische Prompts, Vision-QA, Druck-/EPUB-Prüfungen |
| 📊 | Deterministische Metriken | Satzbetonung, Absatzform, Wiederholungen kapitelübergreifend, Marker-Dichte (en/ko) |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Pandoc + optionales Calibre, epubcheck, Checklisten für KDP und koreanische Plattformen |

## Vergleich

| | Velith | Rohe Prompts | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| Gesamtes Manuskript als Kontext | Jeder Agent, jede Aufgabe | Manuell | Keine | Begrenzt | n/a |
| Voice Lock + Kritik-Überarbeitungs-Schleife | Eingebaut | Keine | Keine | Keine | Manuell |
| Faktenprüfung mit Behauptungsregister | Eigener Agent | Keine | Keine | Keine | Manuell |
| Reifeschwelle durch simulierte Leser | Blockiert die Veröffentlichung | Keine | Keine | Keine | Keine |
| Bildkonsistenz im ganzen Buch | Art-Bibel + kompilierte Prompts + Vision-QA | Prompt pro Bild | Keine | Keine | Keine |
| Genre-Bewusstsein | 7 Werkstattreferenzen + benutzerdefiniert | Prompt-abhängig | Keine | Fiction-lastig | Keine |
| Ausgabeformat | EPUB, PDF, MOBI, TXT, Markdown | Kopieren/Einfügen | Markdown / PDF | DOCX, begrenzt | DOCX, PDF |
| Erfordert | Claude Code, Codex CLI, Agy, Cursor, Cline oder Aider | Beliebiges LLM | Notion-Abo | Abo | Lizenz |
| Volle Kontrolle | Auf Prompt-Ebene, Apache-2.0 | Vollständig | Blackbox | Blackbox | Vollständig |

## Installation

### Claude Code

```
/plugin marketplace add epicsagas/plugins
/plugin install velith@epicsagas
```

18 Skills und 12 Agenten sind sofort verfügbar. Updates mit `/plugin update velith@epicsagas`.

**Voraussetzung:** [Claude Code](https://claude.ai/code)-CLI installiert und authentifiziert. Velith ist auf die Claude-5-Familie (1M Kontext) abgestimmt; Agenten erben das Sitzungsmodell und setzen ihre eigene Effort-Stufe.

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

18 Skills und 12 benutzerdefinierte Subagenten (`.codex-plugin/agents/*.toml`, generiert aus `agents/*.md`). Codex findet beide automatisch. Updates mit `codex plugin update velith@epicsagas`.

**Voraussetzung:** [Codex CLI](https://github.com/openai/codex) installiert und konfiguriert.

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

### Cursor

Kontextregeln in `.cursor/rules/`:

| Regeldatei | Wann geladen |
|-----------|-------------|
| `velith-pipeline.mdc` | Immer (Phasen, Router, Agenten, Qualitätsmaßstab, Checkpoints) |
| `velith-genres.mdc` | Beim Bearbeiten von Entwürfen, Gliederungen oder PRD |
| `velith-editing.mdc` | Bei Arbeit an edits, STYLE.md, bible.md |

### Cline

Projektweite Anweisungen in `.clinerules` im Repository-Stammverzeichnis.

### Aider

Schreibkonventionen in `CONVENTIONS.md`, automatisch geladen über `.aider.conf.yml`.

## Schnellstart

```bash
> /book-init          # Genre, Leser, Sprache, Stimmprobe → PRD.md + STYLE.md
> /loom               # erkennt den Zustand und startet die nächste Phase, hält an Autoren-Checkpoints an
```

Was passiert:

1. **Onboarding** — Leser, Versprechen, Umfang und ein Stimmfingerabdruck aus einer Probe Ihres eigenen Schreibens
2. **Ideation** — Stresstest der Prämisse, echte Vergleichstitel, bewertete Konzepte; Sie wählen
3. **Gliederung** — begründete Struktur, Kapitelspezifikationen, Figurenplan, Bibel; der Architekt bewertet, Sie geben frei
4. **Entwurf** — Voice Lock am Musterkapitel; dann sequenzielle Kapitel mit vollem Kontext, jedes kritisiert und überarbeitet, Bibel-Register geführt, Kontinuitätsprüfungen
5. **Bearbeitung** — Faktenprüfung, Beurteilung, umstellende Neuschreibungen, Zeilenarbeit, Kopie, Korrektorat, dann eine kalte Lesung durch simulierte Leser. PASS oder REVISE
6. **Veröffentlichung** — Vor- und Nachspann, EPUB/PDF/MOBI, epubcheck, Cover aus der Art-Bibel, Marketingplan, Plattform-Checklisten

Bilder ab Phase 2 jederzeit: `/book-visuals plan` (Art-Bibel), `/book-visuals lock` (Look Lock), dann Figuren und Illustrationen, wenn die Kapitel sie brauchen.

## Skills

| Skill | Phase | Beschreibung |
|-------|-------|-------------|
| `/loom` | Router | Erkennt Zustand, startet die nächste Phase, erzwingt Schwellen |
| `/book-init` | 0 | Leser, Versprechen, Umfang, Stimmfingerabdruck, Quellenindex → `PRD.md`, `STYLE.md` |
| `/book-ideation` | 1 | Prämissen-Stresstest, Vergleichstitel, bewertete Konzepte, Stimmproben |
| `/book-outline` | 2 | Struktur, Kapitelspezifikationen, Figurenplan, Bibel, bewertete Validierung, Freigabe |
| `/book-draft` | 3 | Voice Lock, sequenzieller Entwurf mit Kritik und Überarbeitung, Register, Kontinuität |
| `/book-edit` | 4 | 7 Stufen: Faktenprüfung … Reifeurteil |
| `/book-publish` | 5 | Reifeschwelle, Vor-/Nachspann, Formate, epubcheck, Cover, Marketing, Checklisten |
| `/book-visuals` | 2-5 | Art-Bibel, Look Lock, Figuren, Illustrationen, Fotos, Prompt-Kompilierung, Vision-QA, Asset-Prüfung |
| `/book-illustrate` | 3-5 | Alias für den Illustrationsteil von `/book-visuals` |
| `/book-status` | — | Terminal-Dashboard, `--ui` Browser-Dashboard, `--metrics` |
| `/book-fiction` … `/book-academic` | — | Genre-Werkstattreferenzen (7) |
| `/book-genre-creator` | — | Genre-Auswahl und benutzerdefinierte Genre-Spezifikationen |

## Agenten

| Agent | Phase | Aufgabe |
|-------|-------|-----|
| `book-architect` | 2 | Gliederung und Bibel; begründete Struktur; bewertete Validierung; Umstellungsvorschläge |
| `scene-generator` | 3 | Szenenpläne pro Fiction-Kapitel (Zweck, Wendung, Unterton, Ausgang). Pläne, keine Prosa |
| `chapter-writer` | 3-4 | Ein Kapitel mit vollem Kontext; entwirft, kritisiert mit Zitaten, überarbeitet, führt das Register |
| `continuity-editor` | 3-4 | Widersprüche und Wiederholungen im gesamten Manuskript gegen die Bibel |
| `fact-checker` | 4 | Behauptungsregister; Verifikation gegen Quellen und Web; entfernt Unverifizierbares; führt Code aus |
| `style-doctor` | 4 | Misst und schreibt dann Marker, Rhythmusgleichmäßigkeit und Drift an Ort und Stelle um |
| `beta-reader` | 4 | Kalte Lesung als drei Zielleser und ein Profi; Reifeurteil |
| `art-director` | 2-5 | Art-Bibel, Look Lock, Vision-QA jedes Bildes, Kontaktbogen-Review |
| `figure-engineer` | 3-5 | Diagramme, Charts, technische Zeichnungen und Karten-Grundlagen aus Code; Beschriftungen gegen den Text geprüft |
| `illustrator` | 3-5 | Illustrationen aus der Art-Bibel mit kompilierten Prompts, Generierung bei vorhandenem Werkzeug, Vision-QA |
| `cover-designer` | 5 | Cover-Konzepte aus der Art-Bibel, Formate, Marketing-Varianten |
| `marketing-expert` | 5 | Positionierung, Personas, Kanäle, Kalender, Launch-Checkliste |

## Der Qualitätsmaßstab

`skills/loom/quality-bar.md` wird von jedem Schreib-, Bearbeitungs- und Prüfagenten gelesen. Es definiert:

- **Fünf Achsen, bewertet 1-10 mit Ankerpunkten**: Stimme und Prosa, Struktur und Tempo, Tiefe, Spezifität und Fundierung, Leserlebnis. Voice Lock verlangt Achse 1 ≥ 7. Reife verlangt jede Achse ≥ 7, Mittelwert ≥ 7.5 und keinen Aufgabepunkt in den ersten drei Kapiteln.
- **Die KI-Marker-Taxonomie 2026**: Was Leser heute wirklich bemerken (gleichmäßiger Absatzrhythmus, Punchline-Abschlüsse, „not X but Y", reflektierende Codas, zu präzise Selbsterkenntnis, antwortender Dialog, Autorität ohne Quelle, erfundene Spezifität) und wie man es behebt, plus lexikalische Listen für Englisch, Koreanisch und Japanisch.
- **Das Kaltlese-Protokoll**: Einmal mit Lesegeschwindigkeit lesen, markieren, mit Zitaten diagnostizieren, ehrlich bewerten, priorisieren — und erst dann überarbeiten.
- **Visuelle Regeln**: Ein Look pro Buch, Zweck vor Dekoration, Code für alles mit Text oder Daten, Look Lock, Vision-QA, Versandbeschränkungen.

## CLI

```bash
node velith.mjs scan <dir> [--ui]           # Projektzustand, Dashboard-Daten, Reifeurteil
node velith.mjs metrics <dir|file>          # Prosa-Metriken + Wiederholungen kapitelübergreifend (JSON)
node velith.mjs snapshot <dir> <label>      # kopiert drafts/ vor einer Umenschreibungsstufe
node velith.mjs images compile <dir> [id]   # Art-Bibel + Spec → Midjourney / gpt-image / SD-FLUX / Imagen / Ideogram Prompts
node velith.mjs images check <dir>          # Abmessungen, Seitenverhältnis, Größe, Alt-Text, Referenzen, Manifest-Abdeckung
node velith.mjs images render <dir>         # Mermaid / D2 / Graphviz / SVG / matplotlib → SVG + PNG
```

## Visuelles Dashboard

<img src="../../docs/assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` öffnet ein Svelte-Dashboard: Pipeline-Tracker, 12 Agentenkarten, Kapiteltabelle, 6-Stufen-Bearbeitungskanban, Reifeurteil mit Achsenwerten, Ausgabedateien, Einstellungen. Vorgebautes `dist/` ist enthalten.

```bash
cd dashboard && npm install && npm run dev   # http://localhost:5173
npm run build                                 # dist/ neu bauen
```

## Externe Abhängigkeiten

```bash
brew install pandoc                 # EPUB/PDF (erforderlich für Phase 5)
brew install texlive                # PDF mit CJK-Unterstützung
brew install --cask calibre         # MOBI (optional)
brew install epubcheck              # EPUB-Validierung (optional, empfohlen)
npm i -g @mermaid-js/mermaid-cli    # Mermaid-Figuren → SVG (optional)
brew install d2 graphviz librsvg    # D2-/Graphviz-Figuren, SVG → PNG (optional)
```

Bilderzeugung ist nicht gebündelt. `illustrator` und `cover-designer` generieren, wenn ein Bildwerkzeug in Ihrer Sitzung verfügbar ist (MCP-Bildserver, Replicate, lokales Stable Diffusion); sonst liefern sie pro Backend kompilierte Prompt-Pakete in `visuals/prompts/`.

<details>
<summary>Fehlerbehebung</summary>

- **pandoc not found** — `brew install pandoc`
- **CJK-Zeichen fehlen im PDF** — `brew install texlive`
- **Plugin-Befehle nicht gefunden** — Claude Code neu starten
- **Phase 4 endet nie** — die Schwelle ist `edits/readiness-report.md` mit `verdict: PASS`; `/book-edit 6` ausführen
- **Bilder wirken kapitelweise unterschiedlich** — kein Look Lock; erst `/book-visuals plan`, dann `/book-visuals lock`
</details>

## Projektstruktur

```
{project-dir}/
├── PRD.md              # Anforderungen + Leserversprechen
├── STYLE.md            # Stimmfingerabdruck, Stimmprobe, Regeln, Voice Lock
├── ideation.md         # Konzepte, Vergleichstitel, gewähltes Konzept
├── outline.md          # Kapitelspezifikationen, Figurenplan, Validierung, Freigabe
├── bible.md            # Figuren/Konzepte, Begriffsregeln, Zeitlinie, Register pro Kapitel
├── art-bible.md        # Visuelle Identität, Figurensystem, Look Lock
├── sources/            # Referenzmaterial + INDEX.md
├── drafts/             # ch{NN}-{slug}.md, ch{NN}-scenes.md (während der Bearbeitung an Ort und Stelle umgeschrieben)
├── visuals/            # plan, manifest, figures/, illustrations/, photos/, ref/, prompts/
├── edits/              # 00-fact-check … 06-readiness-report, readiness-report.md, editorial-report.md
├── publish/            # book.epub/pdf/…, metadata, Vor-/Nachspann, cover/, marketing, checklists
└── .velith/            # status.json, art-bible.json, critiques/, snapshots/, metrics.json
```

## Integrationen

- **alcove** — durchsucht Ihren Dokumentenspeicher als Quellmaterial während `/book-init` und dem Entwurf.
- **obsidian-forge** — `of book init / sync / export`, um aus einem Obsidian-Vault zu schreiben.
- **humanize-korean** — falls installiert, kann `style-doctor` es als letzten koreanischen Feinschliff nutzen.
- **Bildgenerierungs-MCPs** — werden von `illustrator` und `cover-designer` verwendet, wenn vorhanden.

Alles optional. Velith funktioniert eigenständig.

## Mitwirken

Siehe [CONTRIBUTING.md](../../CONTRIBUTING.md). Prompts sind das Produkt: Eine Änderung an `quality-bar.md` oder einer Agentendatei verändert jedes Buch. Testen mit `examples/` und `node velith.mjs metrics`.

## Lizenz

[Apache-2.0](../../LICENSE)
