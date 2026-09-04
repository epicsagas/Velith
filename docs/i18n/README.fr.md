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

**Des livres au niveau humain.** De la page blanche à un EPUB et un PDF publiables, un pipeline en six phases soumet chaque chapitre, chaque édition et chaque image à un seul standard : un lecteur à froid qui achète des livres du genre ne peut pas deviner que le manuscrit vient d'un premier jet machine.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## Pourquoi Velith ?

Les modèles de pointe écrivent de bonnes phrases. Livrés à eux-mêmes, ils produisent des livres que les lecteurs abandonnent : une voix qui dérive dès le chapitre huit, des personnages qui expliquent leurs sentiments, des statistiques qui n'existent pas, des paragraphes qui se terminent tous sur une punchline, des illustrations qui changent de style à chaque chapitre. Rien de tout cela n'est un problème de modèle. C'est un problème de pipeline.

Velith, c'est le pipeline. Il lit tout le manuscrit avant d'écrire le chapitre suivant, verrouille la voix sur un chapitre d'échantillon avant de passer au volume, critique et révise chaque chapitre avant de l'enregistrer, vérifie chaque affirmation, réécrit pendant l'édition au lieu de se contenter de rapports, lit le livre achevé à froid comme le liraient ses lecteurs cibles, et refuse de publier tant que ceux-ci ne dévoreraient pas la suite. Les images reçoivent le même traitement : une bible artistique par livre, des prompts compilés depuis elle quel que soit le modèle d'image, des diagrammes rendus par le code, et chaque image inspectée visuellement avant expédition.

## Ce qui change en 0.5

| Avant (0.4) | Maintenant (0.5) |
|--------------|-----------|
| Les agents recevaient des résumés de chapitres | Les agents lisent tout le manuscrit (les modèles de pointe portent 1M de tokens ; un roman tient sous 200K) |
| Quatre chapitres rédigés en parallèle | Les genres narratifs s'écrivent dans l'ordre ; le chapitre N lit le N-1 |
| Une seule passe par chapitre | Brouillon → critique à froid avec citations → révision, avant l'enregistrement |
| L'édition produisait des rapports | L'édition réécrit le manuscrit en place, avec instantanés, en 7 étapes |
| Détection des tics par liste de mots (« delve ») | Taxonomie des marqueurs d'IA 2026 : rythme, structure, émotion, dialogue, plus les marqueurs lexicaux en/ko/ja, mesurés par `velith.mjs metrics` |
| Pas de vérification des faits | `fact-checker` construit un registre d'affirmations et supprime ce qui n'est pas vérifiable |
| Le seuil = fichiers présents | Le seuil = verdict de `beta-reader` : cinq axes ≥ 7, aucun point d'abandon dans les chapitres 1-3 |
| Prompts de couverture seulement | Bible artistique, look lock, figures rendues par code, prompts compilés pour tout backend, vision QA, validation des actifs |

| | Fonctionnalité | Pourquoi c'est important |
|--|---------|----------------|
| 📏 | Un seul standard de qualité | `skills/loom/quality-bar.md` : rubrique à cinq axes, taxonomie des marqueurs d'IA, protocole de lecture à froid. Tous les agents le lisent |
| 📋 | Pipeline en 6 phases avec points de contrôle auteur | Concept, plan, voice lock, look lock, restructurations, verdict. Tout le reste tourne sans supervision |
| 📖 | 7 références de métier par genre + personnalisé | Fiction, non-fiction, technique, scénario, poésie, jeu vidéo, académique : options de structure, métier, marqueurs par genre, notes de langue |
| 🤖 | 12 agents spécialisés | Architecte, planificateur de scènes, rédacteur, continuité, vérificateur de faits, docteur du style, lecteur bêta, directeur artistique, ingénieur figures, illustrateur, couverture, marketing |
| ✏️ | Édition en 7 étapes | Vérification des faits → diagnostic → restructuration → ligne → copie → correction → verdict |
| 🎨 | Système visuel | Bible artistique, look lock, figures Mermaid/D2/SVG, prompts agnostiques du modèle, vision QA, contrôles impression/EPUB |
| 📊 | Métriques déterministes | Rythme des phrases, forme des paragraphes, répétitions entre chapitres, densité de marqueurs (en/ko) |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Pandoc + Calibre en option, epubcheck, listes KDP et plateformes coréennes |

## Comparaison

| | Velith | Prompts bruts | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| Contexte du manuscrit entier | Chaque agent, chaque tâche | Manuel | Aucun | Limité | n/a |
| Voice lock + boucle critique-révision | Intégré | Aucun | Aucun | Aucun | Manuel |
| Vérification des faits par registre d'affirmations | Agent dédié | Aucun | Aucun | Aucun | Manuel |
| Seuil de maturité par lecteurs simulés | Bloque la publication | Aucun | Aucun | Aucun | Aucun |
| Cohérence visuelle sur tout le livre | Bible artistique + prompts compilés + vision QA | Prompt par image | Aucun | Aucun | Aucun |
| Conscience du genre | 7 références de métier + personnalisé | Dépend du prompt | Aucun | Orienté fiction | Aucun |
| Format de sortie | EPUB, PDF, MOBI, TXT, Markdown | Copier-coller | Markdown / PDF | DOCX, limité | DOCX, PDF |
| Requiert | Claude Code, Codex CLI, Agy, Cursor, Cline ou Aider | N'importe quel LLM | Abonnement Notion | Abonnement | Licence |
| Contrôle total | Au niveau du prompt, Apache-2.0 | Total | Boîte noire | Boîte noire | Total |

## Installation

### Claude Code

```
/plugin marketplace add epicsagas/plugins
/plugin install velith@epicsagas
```

18 skills et 12 agents disponibles immédiatement. Mises à jour avec `/plugin update velith@epicsagas`.

**Prérequis :** CLI [Claude Code](https://claude.ai/code) installée et authentifiée. Velith est accordé pour la famille Claude 5 (contexte 1M) ; les agents héritent du modèle de votre session et fixent leur propre niveau d'effort.

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

18 skills et 12 sous-agents personnalisés (`.codex-plugin/agents/*.toml`, générés depuis `agents/*.md`). Codex les découvre automatiquement. Mises à jour avec `codex plugin update velith@epicsagas`.

**Prérequis :** [Codex CLI](https://github.com/openai/codex) installée et configurée.

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

### Cursor

Règles de contexte dans `.cursor/rules/` :

| Fichier de règles | Chargement |
|-----------|-------------|
| `velith-pipeline.mdc` | Toujours (phases, routeur, agents, standard de qualité, points de contrôle) |
| `velith-genres.mdc` | Édition des brouillons, plans ou PRD |
| `velith-editing.mdc` | Travail sur edits, STYLE.md, bible.md |

### Cline

Instructions au niveau du projet dans `.clinerules`, à la racine du dépôt.

### Aider

Conventions d'écriture dans `CONVENTIONS.md`, chargées automatiquement via `.aider.conf.yml`.

## Démarrage rapide

```bash
> /book-init          # genre, lecteur, langue, échantillon de voix → PRD.md + STYLE.md
> /loom               # détecte l'état et lance la phase suivante, en s'arrêtant aux points de contrôle
```

Ce qui se passe :

1. **Onboarding** — lecteur, promesse, ampleur, et une empreinte de voix extraite d'un échantillon de votre propre écriture
2. **Idéation** — test de résistance de la prémisse, titres comparables réels, concepts classés ; vous choisissez
3. **Plan** — structure choisie et justifiée, spécifications par chapitre, plan de figures, bible ; l'architecte note, vous approuvez
4. **Rédaction** — voice lock sur un chapitre d'échantillon ; puis chapitres séquentiels en contexte complet, chacun critiqué et révisé, registre de la bible tenu à jour, contrôles de continuité
5. **Édition** — vérification des faits, diagnostic, réécritures structurelles, édition de ligne, copie, correction, puis lecture à froid par des lecteurs simulés. PASS ou REVISE
6. **Publication** — pages liminaires, EPUB/PDF/MOBI, epubcheck, couverture depuis la bible artistique, plan marketing, listes de plateformes

Images à tout moment à partir de la phase 2 : `/book-visuals plan` (bible artistique), `/book-visuals lock` (look lock), puis figures et illustrations au fil des besoins des chapitres.

## Skills

| Skill | Phase | Description |
|-------|-------|-------------|
| `/loom` | Routeur | Détecte l'état, lance la phase suivante, applique les seuils |
| `/book-init` | 0 | Lecteur, promesse, ampleur, empreinte de voix, index des sources → `PRD.md`, `STYLE.md` |
| `/book-ideation` | 1 | Test de la prémisse, comparables, concepts classés, échantillons de voix |
| `/book-outline` | 2 | Structure, spécifications, plan de figures, bible, validation notée, approbation |
| `/book-draft` | 3 | Voice lock, rédaction séquentielle brouillon-critique-révision, registre, continuité |
| `/book-edit` | 4 | 7 étapes : vérification des faits … verdict de maturité |
| `/book-publish` | 5 | Seuil, pages liminaires, formats, epubcheck, couverture, marketing, listes |
| `/book-visuals` | 2-5 | Bible artistique, look lock, figures, illustrations, photos, compilation de prompts, vision QA, contrôle des actifs |
| `/book-illustrate` | 3-5 | Alias du sous-ensemble illustration de `/book-visuals` |
| `/book-status` | — | Tableau de bord terminal, `--ui` navigateur, `--metrics` |
| `/book-fiction` … `/book-academic` | — | Références de métier par genre (7) |
| `/book-genre-creator` | — | Sélection de genre et spécifications de genre personnalisé |

## Agents

| Agent | Phase | Rôle |
|-------|-------|-----|
| `book-architect` | 2 | Plan et bible ; structure choisie et justifiée ; validation notée ; propositions de restructuration |
| `scene-generator` | 3 | Plans de scènes par chapitre de fiction (but, retournement, sous-texte, sortie). Des plans, pas de la prose |
| `chapter-writer` | 3-4 | Un chapitre en contexte complet ; rédige, critique avec citations, révise, tient le registre |
| `continuity-editor` | 3-4 | Contradictions et répétitions sur tout le manuscrit, confrontées à la bible |
| `fact-checker` | 4 | Registre d'affirmations ; vérification contre les sources et le web ; supprime l'invérifiable ; exécute le code |
| `style-doctor` | 4 | Mesure puis réécrit en place les marqueurs, l'uniformité du rythme et la dérive |
| `beta-reader` | 4 | Lecture à froid comme trois lecteurs cibles et un professionnel ; verdict de maturité |
| `art-director` | 2-5 | Bible artistique, look lock, vision QA de chaque image, revue de la planche contact |
| `figure-engineer` | 3-5 | Diagrammes, graphiques, dessins techniques et fonds de cartes rendus par code ; libellés vérifiés contre le texte |
| `illustrator` | 3-5 | Illustrations depuis la bible artistique, prompts compilés, génération si un outil existe, vision QA |
| `cover-designer` | 5 | Concepts de couverture depuis la bible artistique, formats, variantes marketing |
| `marketing-expert` | 5 | Positionnement, personas, canaux, calendrier, liste de lancement |

## Le standard de qualité

`skills/loom/quality-bar.md` est lu par tous les agents de rédaction, d'édition et de révision. Il définit :

- **Cinq axes notés de 1 à 10 avec ancres** : voix et prose, structure et rythme, profondeur, spécificité et ancrage, expérience du lecteur. Le voice lock exige l'axe 1 ≥ 7. La maturité exige chaque axe ≥ 7, moyenne ≥ 7.5 et aucun point d'abandon dans les trois premiers chapitres.
- **La taxonomie 2026 des marqueurs d'IA** : ce que les lecteurs remarquent vraiment aujourd'hui (rythme de paragraphe uniforme, fins en punchline, « not X but Y », codas réflexives, connaissance de soi trop précise, dialogue qui répond, autorité sans source, spécificité inventée) et comment corriger, plus des listes lexicales pour l'anglais, le coréen et le japonais.
- **Le protocole de lecture à froid** : lire une fois à vitesse de lecture, marquer, diagnostiquer avec citations, noter honnêtement, prioriser, et seulement ensuite réviser.
- **Les règles visuelles** : un look par livre, le but avant la décoration, le code pour tout ce qui porte du texte ou des données, look lock, vision QA, contraintes d'expédition.

## CLI

```bash
node velith.mjs scan <dir> [--ui]           # état du projet, données du tableau de bord, verdict
node velith.mjs metrics <dir|file>          # métriques de prose + répétitions entre chapitres (JSON)
node velith.mjs snapshot <dir> <label>      # copie drafts/ avant une étape de réécriture
node velith.mjs images compile <dir> [id]   # bible artistique + spéc → prompts Midjourney / gpt-image / SD-FLUX / Imagen / Ideogram
node velith.mjs images check <dir>          # dimensions, ratio, poids, texte alt, références, couverture du manifeste
node velith.mjs images render <dir>         # Mermaid / D2 / Graphviz / SVG / matplotlib → SVG + PNG
```

## Tableau de bord visuel

<img src="../../docs/assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` ouvre un tableau de bord Svelte : suivi du pipeline, 12 cartes d'agents, table des chapitres, kanban d'édition en 6 étapes, verdict de maturité avec scores par axe, fichiers de sortie, réglages. Le `dist/` préconstruit est inclus.

```bash
cd dashboard && npm install && npm run dev   # http://localhost:5173
npm run build                                 # reconstruire dist/
```

## Dépendances externes

```bash
brew install pandoc                 # EPUB/PDF (requis pour la phase 5)
brew install texlive                # PDF avec support CJK
brew install --cask calibre         # MOBI (optionnel)
brew install epubcheck              # validation EPUB (optionnel, recommandé)
npm i -g @mermaid-js/mermaid-cli    # figures Mermaid → SVG (optionnel)
brew install d2 graphviz librsvg    # figures D2 / Graphviz, SVG → PNG (optionnel)
```

La génération d'images n'est pas fournie. `illustrator` et `cover-designer` génèrent lorsqu'un outil d'image est disponible dans votre session (serveurs MCP d'images, Replicate, Stable Diffusion local) ; sinon ils livrent des packs de prompts compilés par backend dans `visuals/prompts/`.

<details>
<summary>Dépannage</summary>

- **pandoc not found** — `brew install pandoc`
- **Caractères CJK manquants en PDF** — `brew install texlive`
- **Commandes du plugin introuvables** — redémarrez Claude Code
- **La phase 4 ne se termine jamais** — le seuil est `edits/readiness-report.md` avec `verdict: PASS` ; lancez `/book-edit 6`
- **Les images changent de style à chaque chapitre** — pas de look lock ; lancez `/book-visuals plan` puis `/book-visuals lock`
</details>

## Structure du projet

```
{project-dir}/
├── PRD.md              # Exigences + promesse au lecteur
├── STYLE.md            # Empreinte de voix, échantillon, règles, voice lock
├── ideation.md         # Concepts, comparables, concept retenu
├── outline.md          # Spécifications, plan de figures, validation, approbation
├── bible.md            # Personnages/concepts, règles de termes, chronologie, registre par chapitre
├── art-bible.md        # Identité visuelle, système de figures, look lock
├── sources/            # Documentation de référence + INDEX.md
├── drafts/             # ch{NN}-{slug}.md, ch{NN}-scenes.md (révisés en place pendant l'édition)
├── visuals/            # plan, manifest, figures/, illustrations/, photos/, ref/, prompts/
├── edits/              # 00-fact-check … 06-readiness-report, readiness-report.md, editorial-report.md
├── publish/            # book.epub/pdf/…, metadata, pages liminaires, cover/, marketing, checklists
└── .velith/            # status.json, art-bible.json, critiques/, snapshots/, metrics.json
```

## Intégrations

- **alcove** — interroge votre coffre de documents comme matériel source pendant `/book-init` et la rédaction.
- **obsidian-forge** — `of book init / sync / export` pour écrire depuis un vault Obsidian.
- **humanize-korean** — s'il est installé, `style-doctor` peut l'utiliser comme polissage final du coréen.
- **MCP de génération d'images** — utilisés par `illustrator` et `cover-designer` lorsqu'ils sont présents.

Tout est optionnel. Velith fonctionne seul.

## Contribuer

Voir [CONTRIBUTING.md](../../CONTRIBUTING.md). Les prompts sont le produit : une modification de `quality-bar.md` ou d'un fichier d'agent change tous les livres. Testez avec `examples/` et `node velith.mjs metrics`.

## Licence

[Apache-2.0](../../LICENSE)
