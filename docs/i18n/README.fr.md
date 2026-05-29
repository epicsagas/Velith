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
  <a href=".claude-plugin/plugin.json"><img alt="Version" src="https://img.shields.io/badge/version-0.3.0-fc8d62?style=for-the-badge&labelColor=0d1117" /></a>
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

Kit d'outils de création de livres de bout en bout pour Claude Code. De la page blanche à l'EPUB/PDF publié en 6 phases.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## Pourquoi Velith ?

Écrire un livre avec des prompts LLM bruts produit des chapitres déconnectés, une voix incohérente et aucune structure. Velith fournit un **pipeline planifier-puis-exécuter** — valider avant d'écrire, contrôler la qualité à chaque phase et maintenir la continuité tout au long du manuscrit.

| | Fonctionnalité | Pourquoi c'est important |
|--|---------------|--------------------------|
| 📋 | Pipeline en 6 phases | Chaque phase valide avant de continuer — pas de retravail |
| 📖 | 7 modèles de genre | Fiction, non-fiction, technique, scénario, poésie, jeu, académique (+ personnalisé via genre-creator) |
| 🤖 | 7 agents spécialisés | Architecture, rédaction, génération de scènes, continuité, style, couverture, marketing |
| ✏️ | Édition en 5 étapes | Évaluation → Développement → Ligne → Correction → Relecture finale |
| 🔄 | Reprendre n'importe où | Ignorer les chapitres terminés, reprendre là où vous vous êtes arrêté |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Fichiers prêts à publier via Pandoc + Calibre |

## Comparaison

| | Velith | Prompts bruts | Outils d'écriture IA (Jasper, Sudowrite) |
|--|-----------|-------------|--------------------------------------|
| Validation de structure | Pipeline par phases | Aucune | Modèles basiques |
| Continuité entre chapitres | Agent dédié | Manuelle | Limitée |
| Détection AI-slop | Intégrée (style-doctor) | Aucune | Aucune |
| Conscience du genre | 7 systèmes de genre + personnalisé | Dépend du prompt | Centré sur la fiction |
| Format de sortie | EPUB, PDF, MOBI, TXT, Markdown | Copier-coller | DOCX, limité |
| Nécessite | Claude Code | N'importe quel LLM | Abonnement |
| Contrôle total | Au niveau du prompt | Total | Boîte noire |

## Installation

```bash
# Ajouter le marketplace epicsagas (si pas encore ajouté)
claude plugin marketplace add epicsagas

# Installer velith
claude plugin install velith@epicsagas
```

**Prérequis :** CLI [Claude Code](https://claude.ai/code) installé et authentifié.

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
| `marketing-expert` | Personas de lecteurs, stratégie de canaux, calendrier de lancement de 12 semaines |

## Tableau de Bord Visuel

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` ouvre un tableau de bord de progression basé sur Svelte dans votre navigateur :

- Barres de progression par phase (6 phases)
- Statut chapitre par chapitre (lignes, mots, édition/brouillon/attente)
- Statut des fichiers de sortie (EPUB/PDF/MOBI/TXT/MD)
- Support multi-projets via des onglets

Le tableau de bord lit depuis `ui/public/status.json` (généré par Claude à chaque exécution de `/book-status --ui`). Le `ui/dist/index.html` pré-compilé est inclus — aucune étape de construction requise.

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
