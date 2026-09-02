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
  <a href=".claude-plugin/plugin.json"><img alt="Version" src="https://img.shields.io/badge/version-0.5.0-fc8d62?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="../../LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://claude.ai/code"><img alt="Claude Code" src="https://img.shields.io/badge/Claude_Code-plugin-bc8cff?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://github.com/openai/codex"><img alt="Codex CLI" src="https://img.shields.io/badge/Codex_CLI-plugin-10a37f?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://x.ai/cli"><img alt="Grok Build" src="https://img.shields.io/badge/Grok_Build-plugin-ffffff?style=for-the-badge&labelColor=0d1117" /></a>
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

**Construisez des livres comme du logiciel.** Un pipeline multi-phases qui transforme la connaissance longue-forme —livres, RFC, livres blancs, docs de design, guides techniques— en artefacts structurés, pas en prompts isolés. De la page blanche à l'EPUB/PDF publiable.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## Pourquoi Velith ?

Écrire un livre avec des prompts LLM bruts produit des chapitres déconnectés, une voix incohérente et aucune structure. Velith fournit un **pipeline planifier-puis-exécuter** — valider avant d'écrire, contrôler la qualité à chaque phase et maintenir la continuité tout au long du manuscrit.

## Benchmark

Ce que le pipeline fait aux entrées non structurées — [essayez par vous-même →](https://huggingface.co/spaces/epicsaga/Velith)

| Métrique | Entrée brute | Après le pipeline Velith |
|---------|-------------|--------------------------|
| Score de structure | 2–4 / 10 | 6–9 / 10 |
| Redondance | 20–45% de chevauchement n-gram | < 10% après consolidation |
| Marqueurs AI-slop | 6–20 pour 1 000 mots | Détectés et supprimés par style-doctor |
| Hiérarchie des chapitres | Aucune | Détectée + cartographiée avec références croisées |
| Score de cohérence | 0,3–1,5 / 10 | Amélioré par restructuration de sections |

| | Fonctionnalité | Pourquoi c'est important |
|--|---------------|--------------------------|
| 📋 | Pipeline en 6 phases | Chaque phase valide avant de continuer — pas de retravail |
| 📖 | 7 modèles de genre | Fiction, non-fiction, technique, scénario, poésie, jeu, académique (+ personnalisé via genre-creator) |
| 🤖 | 8 agents spécialisés | Architecture, rédaction, génération de scènes, continuité, style, couverture, illustrations, marketing |
| ✏️ | Édition en 5 étapes | Évaluation → Développement → Ligne → Correction → Relecture finale |
| 🔄 | Reprendre n'importe où | Ignorer les chapitres terminés, reprendre là où vous vous êtes arrêté |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Fichiers prêts à publier via Pandoc + Calibre |

## Un pipeline, plusieurs artefacts

Velith est livré comme un pipeline de livres, mais les mêmes 6 phases s'appliquent à **toute connaissance longue-forme structurée**. Que l'artefact soit un roman de 300 pages ou un RFC de 12 pages importe peu — le flux plan-then-execute, les portes de qualité et les agents sont identiques.

| Artefact | Skill de genre | Sortie typique |
|----------|-------------|----------------|
| Roman / Histoire | `book-fiction` | EPUB / PDF / MOBI |
| Livre non-fiction | `book-nonfiction` | EPUB / PDF |
| RFC / Doc de design | `book-technical` | Markdown / PDF |
| Livre blanc / Rapport de recherche | `book-academic` | PDF (citations) |
| Support de cours / Tutoriel | `book-technical` | EPUB / PDF |
| Scénario de jeu / Lore bible | `book-game` | Markdown / EPUB |

## Comparaison

| | Velith | Prompts bruts | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| Validation de structure | Pipeline par phases | Aucune | Aucune | Modèles basiques | Manuelle |
| Continuité entre chapitres | Agent dédié | Manuelle | Aucune | Limitée | Manuelle |
| Détection AI-slop | Intégrée (style-doctor) | Aucune | Aucune | Aucune | Aucune |
| Conscience du genre | 8 systèmes de genre + personnalisé | Dépend du prompt | Aucune | Centré sur la fiction | Aucune |
| Format de sortie | EPUB, PDF, MOBI, TXT, Markdown | Copier-coller | Markdown / PDF | DOCX, limité | DOCX, PDF |
| Contrôle qualité | Chaque phase | Aucun | Aucun | Aucun | Aucun |
| Nécessite | Claude Code, Codex CLI, Grok Build, Agy, Cursor, Cline ou Aider | N'importe quel LLM | Abonnement Notion | Abonnement | Licence |
| Contrôle total | Au niveau du prompt | Total | Boîte noire | Boîte noire | Total |

## Installation

### Claude Code

```bash
# Ajouter le marketplace epicsagas (première fois)
claude plugin marketplace add epicsagas

# Installer velith
claude plugin install velith@epicsagas
```

**Prérequis :** CLI [Claude Code](https://claude.ai/code) installé et authentifié.

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

**Prérequis :** [Codex CLI](https://github.com/openai/codex) installé et configuré avec une clé API OpenAI.

### Grok Build (xAI)

```bash
grok plugin install epicsagas/Velith --trust
```

Grok lit `skills/` et `agents/` à la racine du plugin. Aucune configuration supplémentaire n'est nécessaire.

**Prérequis :** [Grok Build](https://x.ai/cli) installé et authentifié.

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

Agy découvre automatiquement les skills et agents depuis la racine du dépôt. Aucune configuration supplémentaire nécessaire.

**Prérequis :** [Agy](https://antigravity.google/docs/cli-install) installé et configuré.

### Cursor

Velith fournit des règles de contexte dans `.cursor/rules/` qui donnent à l'agent de Cursor une connaissance complète du pipeline de publication, des modèles de genre et des standards d'édition. Les règles se chargent automatiquement à l'ouverture d'un projet de livre dans Cursor.

**Prérequis :** [Cursor](https://cursor.sh) installé.

### Cline

Velith fournit des instructions au niveau du projet dans `.clinerules` à la racine du dépôt. Cline les lit automatiquement lors du travail dans le répertoire du projet.

**Prérequis :** Extension [Cline](https://github.com/cline/cline) installée dans VS Code ou JetBrains.

### Aider

Velith fournit des conventions d'écriture dans `CONVENTIONS.md`, auto-chargées via `.aider.conf.yml`.

```bash
aider  # CONVENTIONS.md est auto-chargé
```

**Prérequis :** [Aider](https://aider.chat) installé et configuré avec une clé API.

## Démarrage Rapide

```bash
# Démarrer un nouveau projet de livre
> /book-init

# Détecter automatiquement la phase actuelle et continuer
> /loom
```

Le plugin vous guide à travers :
1. **Onboarding** — Genre, audience, langue, matériel source, guide de style
2. **Ideation** — Étude de marché, distillation de concepts, titres concurrents
3. **Outlining** — Plan complet des chapitres avec spécifications, dépendances, références croisées
4. **Drafting** — Génération chapitre par chapitre avec des sous-agents en parallèle
5. **Editing** — Pipeline en 5 étapes : Évaluation → Développement → Ligne → Correction → Relecture finale
6. **Publishing** — Conversion EPUB/PDF/MOBI, métadonnées, plan marketing

## Skills

| Skill | Phase | Description |
|-------|-------|-------------|
| `/loom` | Routeur | Détecter la phase automatiquement et router |
| `/book-init` | 0 | Démarrer un nouveau projet — genre, audience, guide de style |
| `/book-ideation` | 1 | Générer et valider des concepts, analyse concurrentielle |
| `/book-outline` | 2 | Créer le plan des chapitres (avec dépendances) |
| `/book-draft` | 3 | Rédiger les chapitres (tous/spécifiques/reprendre, agents parallèles) |
| `/book-edit` | 4 | Pipeline d'édition en 5 étapes |
| `/book-publish` | 5 | Conversion EPUB/PDF/MOBI, couverture, marketing |
| `/book-illustrate` | 3-5 | Illustrations intérieures — extraction de scènes, prompts à style cohérent, plan de placement |
| `/book-status` | — | Tableau de bord terminal + `--ui` tableau de bord navigateur |
| `/book-fiction` | — | Patterns fiction (15 beats, Snowflake, bible de personnages) |
| `/book-nonfiction` | — | Patterns non-fiction (problème-solution, hiérarchie de preuves) |
| `/book-technical` | — | Patterns technique (gradient de concepts, code, labs) |
| `/book-screenplay` | — | Patterns scénario (3 actes, dialogue, histoires A/B) |
| `/book-poetry` | — | Patterns poésie (formes, imagerie, structure de strophes) |
| `/book-game` | — | Patterns jeu (arbres de quêtes, embranchements, bible de lore) |
| `/book-academic` | — | Patterns académique (IMRAD, revue de littérature, chaînes d'argumentation) |
| `/book-genre-creator` | — | Guide de sélection de genre et assistant de création de genre personnalisé |

## Agents

| Agent | Rôle |
|-------|------|
| `book-architect` | Valide la structure, note les plans, vérifie le rythme |
| `chapter-writer` | Génère des brouillons de chapitres avec des modèles de genre |
| `continuity-editor` | Cohérence entre chapitres (terminologie, références, chronologie) |
| `style-doctor` | Cohérence voix/ton, détection d'AI-slop |
| `scene-generator` | Décomposition au niveau de la scène avec structure GMC+RDD (fiction uniquement) |
| `cover-designer` | Concepts de couverture + prompts d'images Midjourney/DALL-E |
| `illustrator` | Illustrations intérieures — extraction de scènes, bible de style, génération de prompts |
| `marketing-expert` | Personas de lecteurs, stratégie de canaux, calendrier de lancement de 12 semaines |

## Tableau de Bord Visuel

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` ouvre un tableau de bord de progression basé sur Svelte dans votre navigateur. Le tableau de bord se rafraîchit automatiquement toutes les 5 secondes :

- Suivi du pipeline en 6 phases (Onboarding → Ideation → Outlining → Drafting → Editing → Publishing)
- 8 cartes de statut d'agents (book-architect, chapter-writer, continuity-editor, cover-designer, illustrator, marketing-expert, scene-generator, style-doctor)
- Plan des chapitres, tableau des brouillons et kanban d'édition en 5 étapes
- Statut des fichiers de sortie (EPUB/PDF/MOBI/TXT/MD) avec liste de contrôle de publication
- Paramètres du projet et référence des commandes

Le tableau de bord lit dynamiquement depuis les fichiers `status.json` par projet. Le `dist/` pré-compilé est inclus — aucune étape de construction requise pour les utilisateurs du plugin.

Pour exécuter localement en développement :

```bash
cd dashboard
npm install
npm run dev     # http://localhost:5173
npm run build   # reconstruire dist/
```

## Principes de Conception

- **Planifier Avant d'Exécuter** — D'abord le plan, valider, puis écrire
- **Idempotent** — Ignorer les chapitres terminés, reprendre là où vous vous êtes arrêté
- **Efficace en Tokens** — Contexte basé sur des résumés, pas le texte complet
- **Conscience du Genre** — Structures, modèles et validation différents par genre
- **Contrôle Qualité** — Chaque phase doit passer les critères avant de continuer

## Dépendances Externes

Pour la sortie EPUB/PDF (Phase 5) :

```bash
brew install pandoc        # Conversion EPUB/PDF
brew install texlive       # PDF avec support CJK/coréen
brew install --cask calibre  # Conversion MOBI (Kindle) — optionnel
```

### Dépannage

<details>
<summary>pandoc introuvable</summary>

Installer via Homebrew :
```bash
brew install pandoc
```
</details>

<details>
<summary>Caractères CJK/PDF manquants ou corrompus</summary>

Installer une distribution LaTeX compatible CJK :
```bash
brew install texlive
# Ou pour une installation minimale :
brew install basictex && sudo tlmgr install collection-langkorean
```
</details>

<details>
<summary>Commandes du plugin introuvables après installation</summary>

Redémarrer Claude Code pour recharger les plugins :
```bash
claude restart
```
</details>

## Structure du Projet

Lors de la création d'un projet de livre, Velith configure :

```
{project-dir}/
├── PRD.md          # Exigences du livre
├── STYLE.md        # Voix, ton, conventions
├── ideation.md     # Idées, étude de marché
├── outline.md      # Plan complet des chapitres
├── drafts/         # Brouillons des chapitres
│   ├── ch00-foreword.md
│   ├── ch01-xxx.md
│   └── ...
├── edits/          # Rapports d'édition
│   └── editorial-report.md
├── publish/        # Fichiers finaux
│   ├── book.epub
│   ├── book.pdf
│   ├── book.mobi
│   └── metadata.yaml
└── sources/        # Références du matériel source
```

## Intégration

### Flux de travail d'agents intégrés

Aucune configuration supplémentaire — s'exécutent automatiquement dans le pipeline :

- **discover** — Pendant `/book-outline`, `book-architect` explore les angles morts et les contradictions du concept du livre avant la fixation de la structure
- **council** — Pendant `/book-outline` et `/book-edit`, intègre plusieurs perspectives éditoriales (développement, structure, révision de ligne) dans les décisions de plan et de révision

### alcove — Votre vault de recherche comme matériel source

[alcove](https://github.com/epicsagas/alcove) est un serveur de documents privé qui permet aux agents Velith de consulter vos notes existantes, recherches et documents de projet comme matériel source pendant la rédaction.

**Quand c'est utile :**
- Vous avez des années de notes de recherche, transcriptions d'entretiens ou documents de référence que vous souhaitez que l'agent cite
- Vous écrivez de la non-fiction et avez besoin que les agents extraient des faits depuis une documentation de projet structurée
- Vous maintenez une base de connaissances avec glossaires, chronologies ou détails de construction du monde que l'agent doit respecter

**Comment l'utiliser :**
1. Installez et configurez alcove comme serveur MCP dans vos paramètres Claude Code
2. Lors de `/book-init`, indiquez votre projet alcove comme source
3. Les agents interrogeront automatiquement alcove lors de la rédaction des chapitres faisant référence à vos recherches

### obsidian-forge — De la réflexion à l'écriture

[obsidian-forge](https://github.com/epicsagas/obsidian-forge) relie votre vault Obsidian à Velith, pour que vous puissiez faire des recherches dans Obsidian et écrire avec Velith sans copier manuellement les fichiers.

**Quand c'est utile :**
- Vos recherches, profils de personnages et notes de référence existent déjà dans un vault Obsidian
- Vous souhaitez itérer sur les plans dans l'environnement de notes liées d'Obsidian avant de passer à Velith
- Vous collaborez avec des co-auteurs qui préfèrent Obsidian pour le brainstorming

**Comment l'utiliser :**

```bash
# Créer un projet de livre dans votre vault Obsidian (01-Projects/)
of book init my-book --genre non-fiction --lang ko

# Travailler dans Obsidian : notes de recherche, profils de personnages, références
# Taguer les notes avec book/my-book pour les lier comme matériel source
of book sync my-book

# Exporter vers un répertoire autonome quand vous êtes prêt à écrire
of book export my-book --output ~/projects/my-book

# Maintenant exécuter velith sur le projet exporté
> /loom
```

alcove et obsidian-forge sont tous les deux **optionnels** — Velith fonctionne de manière autonome.

## Contribution

Voir [CONTRIBUTING.md](../../CONTRIBUTING.md). Les PRs sont les bienvenus — consultez les issues étiquetées `good first issue`.

## Licence

[Apache-2.0](../../LICENSE)
