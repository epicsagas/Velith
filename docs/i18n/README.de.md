<!-- Translated from README.md @ commit 3d6a2f0 (2026-05-16) -->
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
  <a href=".claude-plugin/plugin.json"><img alt="Version" src="https://img.shields.io/badge/version-0.2.9-fc8d62?style=for-the-badge&labelColor=0d1117" /></a>
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

**Bücher wie Software bauen.** KI-natives Publikationssystem für strukturierte Langform-Erstellung — von der leeren Seite bis zum EPUB/PDF.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## Warum Velith?

Ein Buch mit rohen LLM-Prompts zu schreiben führt zu unzusammenhängenden Kapiteln, inkonsistenter Stimme und fehlender Struktur. Velith bietet eine **Pipeline nach dem Prinzip Planen-dann-Ausführen** — vor dem Schreiben validieren, Qualität in jeder Phase sichern und die Kontinuität über das gesamte Manuskript aufrechterhalten.

| | Funktion | Warum es wichtig ist |
|--|----------|----------------------|
| 📋 | 6-Phasen-Pipeline | Jede Phase validiert vor dem Weitermachen — kein Nacharbeiten |
| 📖 | 7 Genre-Vorlagen | Belletristik, Sachbuch, Technik, Drehbuch, Poesie, Spiel, Akademisch (+ benutzerdefiniert via genre-creator) |
| 🤖 | 7 spezialisierte Agenten | Architektur, Entwurf, Szenengenerierung, Kontinuität, Stil, Cover, Marketing |
| ✏️ | 5-stufiges Lektorat | Beurteilung → Entwicklung → Zeile → Korrektorat → Schlusskorrektur |
| 🔄 | Überall fortsetzen | Abgeschlossene Kapitel überspringen, dort weitermachen wo man aufgehört hat |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Veröffentlichungsfertige Dateien via Pandoc + Calibre |

## Vergleich

| | Velith | Rohe Prompts | KI-Schreibwerkzeuge (Jasper, Sudowrite) |
|--|-----------|-------------|--------------------------------------|
| Strukturvalidierung | Phasengesteuerter Pipeline | Keine | Grundvorlagen |
| Kapitelübergreifende Kontinuität | Dedizierter Agent | Manuell | Begrenzt |
| KI-Schunddetektion | Eingebaut (style-doctor) | Keine | Keine |
| Genre-Bewusstsein | 7 Genre-Systeme + benutzerdefiniert | Abhängig vom Prompt | Belletristik-fokussiert |
| Ausgabeformat | EPUB, PDF, MOBI, TXT, Markdown | Kopieren-Einfügen | DOCX, begrenzt |
| Erfordert | Claude Code | Beliebiges LLM | Abonnement |
| Volle Kontrolle | Prompt-Ebene | Vollständig | Black Box |

## Installation

```bash
# epicsagas-Marktplatz hinzufügen (falls noch nicht hinzugefügt)
claude plugin marketplace add epicsagas

# velith installieren
claude plugin install velith@epicsagas
```

**Voraussetzungen:** [Claude Code](https://claude.ai/code) CLI installiert und authentifiziert.

## Schnellstart

```bash
# Neues Buchprojekt starten
> /book-init

# Aktuelle Phase automatisch erkennen und fortfahren
> /loom
```

Das Plugin führt Sie durch:
1. **Onboarding** — Genre, Zielgruppe, Sprache, Quellmaterial, Stilrichtlinien
2. **Ideation** — Marktforschung, Konzeptdestillation, konkurrierende Titel
3. **Outlining** — Vollständige Kapitelgliederung mit Spezifikationen, Abhängigkeiten, Querverweisen
4. **Drafting** — Kapitelweise Generierung mit parallelen Unteragenten
5. **Editing** — 5-stufiger Pipeline: Beurteilung → Entwicklung → Zeile → Korrektorat → Schlusskorrektur
6. **Publishing** — EPUB/PDF/MOBI-Konvertierung, Metadaten, Marketingplan

## Skills

| Skill | Phase | Beschreibung |
|-------|-------|--------------|
| `/loom` | Router | Phase automatisch erkennen und weiterleiten |
| `/book-init` | 0 | Neues Buchprojekt starten — Genre, Zielgruppe, Stilrichtlinien |
| `/book-ideation` | 1 | Konzepte generieren und validieren, Wettbewerbsanalyse |
| `/book-outline` | 2 | Kapitelgliederung erstellen (mit Abhängigkeiten) |
| `/book-draft` | 3 | Kapitel entwerfen (alle/bestimmte/fortsetzen, parallele Agenten) |
| `/book-edit` | 4 | 5-stufige Lektorierpipeline |
| `/book-publish` | 5 | EPUB/PDF/MOBI-Konvertierung, Cover, Marketing |
| `/book-status` | — | Terminal-Dashboard + `--ui` Browser-Dashboard |
| `/book-fiction` | — | Belletristik-Pattern (15 Beats, Snowflake, Charakterbibel) |
| `/book-nonfiction` | — | Sachbuch-Pattern (Problem-Lösung, Evidenzhierarchie) |
| `/book-technical` | — | Technikbuch-Pattern (Konzeptgradient, Code, Labs) |
| `/book-screenplay` | — | Drehbuch-Pattern (3-Akt, Dialog, A/B-Story) |
| `/book-poetry` | — | Poesie-Pattern (Formen, Bildsprache, Strophenstruktur) |
| `/book-game` | — | Spiel-Szenario-Pattern (Quest-Bäume, Verzweigungen, Lore-Bibel) |
| `/book-academic` | — | Akademisch-Pattern (IMRAD, Literaturreview, Argumentationsketten) |
| `/book-genre-creator` | — | Genre-Auswahlhilfe und Assistent für benutzerdefinierte Genre-Erstellung |

## Agenten

| Agent | Rolle |
|-------|-------|
| `book-architect` | Struktur validieren, Gliederungen bewerten, Pacing prüfen |
| `chapter-writer` | Kapitelentwürfe mit Genre-Vorlagen generieren |
| `continuity-editor` | Kapitelübergreifende Konsistenz (Terminologie, Referenzen, Zeitlinie) |
| `style-doctor` | Stimme/Ton-Konsistenz, KI-Schunddetektion |
| `scene-generator` — Szenenebene-Analyse mit GMC+RDD-Struktur (nur Belletristik) |
| `cover-designer` | Cover-Konzepte + Midjourney/DALL-E-Bildprompts |
| `marketing-expert` | Leserpersonas, Kanalstrategie, 12-Wochen-Launchkalender |

## Visuelles Dashboard

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` öffnet ein Svelte-basiertes Fortschritts-Dashboard in Ihrem Browser:

- Phasenfortschrittsbalken (6 Phasen)
- Kapitelweiser Status (Zeilen, Wörter, Lektorat/Entwurf/Warten)
- Status der Ausgabedateien (EPUB/PDF/MOBI/TXT/MD)
- Multi-Projekt-Unterstützung über Tabs

Das Dashboard liest aus `ui/public/status.json` (bei jedem `/book-status --ui`-Aufruf von Claude generiert). Das vorkompilierte `ui/dist/index.html` ist enthalten — kein Build-Schritt erforderlich.

## Designprinzipien

- **Planen-dann-Ausführen** — Erst die Gliederung, validieren, dann schreiben
- **Idempotent** — Abgeschlossene Kapitel überspringen, dort weitermachen wo man aufgehört hat
- **Token-Effizient** — Zusammenfassungsbasierter Kontext, kein vollständiger Text
- **Genre-Bewusst** — Unterschiedliche Strukturen, Vorlagen und Validierung je Genre
- **Qualitätskontrolle** — Jede Phase muss Kriterien bestehen bevor es weitergeht

## Externe Abhängigkeiten

Für EPUB/PDF-Ausgabe (Phase 5):

```bash
brew install pandoc        # EPUB/PDF-Konvertierung
brew install texlive       # PDF mit CJK/Koreanisch-Unterstützung
brew install --cask calibre  # MOBI (Kindle)-Konvertierung — optional
```

### Fehlerbehebung

<details>
<summary>pandoc nicht gefunden</summary>

Über Homebrew installieren:
```bash
brew install pandoc
```
</details>

<details>
<summary>CJK/PDF-Zeichen fehlen oder sind beschädigt</summary>

Eine CJK-fähige LaTeX-Distribution installieren:
```bash
brew install texlive
# Oder für Minimalinstallation:
brew install basictex && sudo tlmgr install collection-langkorean
```
</details>

<details>
<summary>Plugin-Befehle nach der Installation nicht gefunden</summary>

Claude Code neu starten um Plugins neu zu laden:
```bash
claude restart
```
</details>

## Projektstruktur

Wenn Sie ein Buchprojekt erstellen, richtet Velith folgendes ein:

```
{project-dir}/
├── PRD.md          # Buchanforderungen
├── STYLE.md        # Stimme, Ton, Konventionen
├── ideation.md     # Ideen, Marktforschung
├── outline.md      # Vollständige Kapitelgliederung
├── drafts/         # Kapitelentwürfe
│   ├── ch00-foreword.md
│   ├── ch01-xxx.md
│   └── ...
├── edits/          # Lektoriatsberichte
│   └── editorial-report.md
├── publish/        # Finale Ausgabedateien
│   ├── book.epub
│   ├── book.pdf
│   ├── book.mobi
│   └── metadata.yaml
└── sources/        # Quellmaterial-Referenzen
```

## Integration

### Integrierte Agent-Workflows

Kein zusätzliches Setup — werden automatisch in der Pipeline ausgeführt:

- **discover** — Während `/book-outline` untersucht `book-architect` blinde Flecken und Widersprüche im Buchkonzept vor der Strukturfestlegung
- **council** — Während `/book-outline` und `/book-edit` werden verschiedene redaktionelle Perspektiven (Lektorat, Struktur, Zeilenbearbeitung) in Gliederungs- und Überarbeitungsentscheidungen einbezogen

### alcove — Research-Vault als Quellmaterial

[alcove](https://github.com/epicsagas/alcove) ist ein privater Dokumentserver, der es Velith Agenten ermöglicht, beim Schreiben auf Ihre bestehenden Notizen, Recherchen und Projektdokumente als Quellmaterial zuzugreifen.

**Wann es hilft:**
- Sie haben jahrelange Recherche-Notizen, Interview-Transkripte oder Referenzdokumente, die der Agent zitieren soll
- Sie schreiben Sachbücher und benötigen Fakten aus strukturierter Projektdokumentation
- Sie pflegen eine Wissensbasis mit Glossaren, Zeitleisten oder Weltbau-Details, die der Agent berücksichtigen soll

**So verwenden Sie es:**
1. Installieren und konfigurieren Sie alcove als MCP-Server in Ihren Claude Code-Einstellungen
2. Geben Sie bei `/book-init` Ihr alcove-Projekt als Quelle an
3. Agenten fragen alcove beim Verfassen automatisch ab und beziehen Ihre Recherche ein

### obsidian-forge — Vom Denken zum Schreiben

[obsidian-forge](https://github.com/epicsagas/obsidian-forge) verbindet Ihren Obsidian-Vault mit Velith, sodass Sie in Obsidian recherchieren und mit Velith schreiben können, ohne Dateien manuell zu kopieren.

**Wann es hilft:**
- Ihre Recherchen, Charakterprofile und Referenznotizen leben bereits in einem Obsidian-Vault
- Sie möchten Gliederungen in Obsidians verlinkter Notizumgebung iterieren, bevor Sie sie an Velith übergeben
- Sie arbeiten mit Koautoren zusammen, die Obsidian für Brainstorming bevorzugen

**So verwenden Sie es:**

```bash
# Buchprojekt in Ihrem Obsidian-Vault erstellen (01-Projects/)
of book init my-book --genre non-fiction --lang ko

# In Obsidian arbeiten: Recherche-Notizen, Charakterprofile, Referenzen
# Notizen mit book/my-book taggen um sie als Quellmaterial zu verknüpfen
of book sync my-book

# In ein eigenständiges Verzeichnis exportieren wenn bereit zum Schreiben
of book export my-book --output ~/projects/my-book

# Nun velith auf dem exportierten Projekt ausführen
> /loom
```

Sowohl alcove als auch obsidian-forge sind **optional** — Velith funktioniert eigenständig.

## Beitragen

Siehe [CONTRIBUTING.md](../../CONTRIBUTING.md). PRs willkommen — schauen Sie sich Issues mit dem Label `good first issue` an.

## Lizenz

[Apache-2.0](../../LICENSE)
