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
  <a href=".claude-plugin/plugin.json"><img alt="Version" src="https://img.shields.io/badge/version-0.2.8-fc8d62?style=for-the-badge&labelColor=0d1117" /></a>
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

Kit de ferramentas de criação de livros de ponta a ponta para o Claude Code. Da página em branco ao EPUB/PDF publicado em 6 fases.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## Por que Velith?

Escrever um livro com prompts LLM brutos resulta em capítulos desconectados, voz inconsistente e sem estrutura. O Velith fornece um **pipeline de planejar-depois-executar** — valida antes de escrever, controla a qualidade em cada fase e mantém a continuidade ao longo de todo o manuscrito.

| | Funcionalidade | Por que importa |
|--|---------------|-----------------|
| 📋 | Pipeline de 6 fases | Cada fase valida antes de avançar — sem retrabalho |
| 📖 | 7 templates de gênero | Ficção, não-ficção, técnico, roteiro, poesia, jogo, acadêmico (+ personalizado via genre-creator) |
| 🤖 | 7 agentes especializados | Arquitetura, rascunho, geração de cenas, continuidade, estilo, capa, marketing |
| ✏️ | Edição em 5 etapas | Avaliação → Desenvolvimento → Linha → Revisão → Leitura final |
| 🔄 | Retomar em qualquer lugar | Pular capítulos concluídos, continuar de onde parou |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Arquivos prontos para publicar via Pandoc + Calibre |

## Comparação

| | Velith | Prompts básicos | Ferramentas de escrita IA (Jasper, Sudowrite) |
|--|-----------|-------------|--------------------------------------|
| Validação de estrutura | Pipeline por fases | Nenhuma | Templates básicos |
| Continuidade entre capítulos | Agente dedicado | Manual | Limitada |
| Detecção de AI-slop | Integrada (style-doctor) | Nenhuma | Nenhuma |
| Consciência de gênero | 7 sistemas de gênero + personalizado | Depende do prompt | Focado em ficção |
| Formato de saída | EPUB, PDF, MOBI, TXT, Markdown | Copiar-colar | DOCX, limitado |
| Requer | Claude Code | Qualquer LLM | Assinatura |
| Controle total | Nível de prompt | Total | Caixa preta |

## Instalação

```bash
# Adicionar o marketplace da epicsagas (se ainda não adicionado)
claude plugin marketplace add epicsagas

# Instalar o velith
claude plugin install velith@epicsagas
```

**Pré-requisitos:** CLI do [Claude Code](https://claude.ai/code) instalado e autenticado.

## Início Rápido

```bash
# Iniciar um novo projeto de livro
> /book-init

# Detectar automaticamente a fase atual e continuar
> /loom
```

O plugin guia você por:
1. **Onboarding** — Gênero, público, idioma, material-fonte, guia de estilo
2. **Ideation** — Pesquisa de mercado, destilação de conceitos, títulos concorrentes
3. **Outlining** — Esboço completo de capítulos com especificações, dependências, referências cruzadas
4. **Drafting** — Geração capítulo a capítulo com subagentes em paralelo
5. **Editing** — Pipeline de 5 etapas: Avaliação → Desenvolvimento → Linha → Revisão → Leitura final
6. **Publishing** — Conversão EPUB/PDF/MOBI, metadados, plano de marketing

## Skills

| Skill | Fase | Descrição |
|-------|------|-----------|
| `/loom` | Router | Detectar fase automaticamente e rotear |
| `/book-init` | 0 | Iniciar novo projeto — gênero, público, guia de estilo |
| `/book-ideation` | 1 | Gerar e validar conceitos, análise competitiva |
| `/book-outline` | 2 | Criar esboço de capítulos (com dependências) |
| `/book-draft` | 3 | Rascunhar capítulos (todos/específicos/retomar, agentes paralelos) |
| `/book-edit` | 4 | Pipeline de edição em 5 etapas |
| `/book-publish` | 5 | Conversão EPUB/PDF/MOBI, capa, marketing |
| `/book-status` | — | Painel de terminal + `--ui` painel no navegador |
| `/book-fiction` | — | Padrões de ficção (15 beats, Snowflake, bíblia de personagens) |
| `/book-nonfiction` | — | Padrões de não-ficção (problema-solução, hierarquia de evidência) |
| `/book-technical` | — | Padrões técnicos (gradiente de conceitos, código, labs) |
| `/book-screenplay` | — | Padrões de roteiro (3 atos, diálogo, histórias A/B) |
| `/book-poetry` | — | Padrões de poesia (formas, imagens, estrutura de estrofes) |
| `/book-game` | — | Padrões de jogo (árvores de quests, ramificação, bíblia de lore) |
| `/book-academic` | — | Padrões acadêmicos (IMRAD, revisão de literatura, cadeias de argumentação) |
| `/book-genre-creator` | — | Guia de seleção de gênero e assistente de criação de gêneros personalizados |

## Agentes

| Agente | Papel |
|--------|-------|
| `book-architect` | Valida estrutura, pontua esboços, verifica ritmo narrativo |
| `chapter-writer` | Gera rascunhos de capítulos com templates de gênero |
| `continuity-editor` | Consistência entre capítulos (terminologia, referências, linha do tempo) |
| `style-doctor` | Consistência de voz/tom, detecção de AI-slop |
| `scene-generator` | Análise em nível de cena com estrutura GMC+RDD (somente ficção) |
| `cover-designer` | Conceitos de capa + prompts de imagem para Midjourney/DALL-E |
| `marketing-expert` | Personas de leitores, estratégia de canais, calendário de lançamento de 12 semanas |

## Painel Visual

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` abre um painel de progresso baseado em Svelte no seu navegador:

- Barras de progresso por fase (6 fases)
- Status capítulo a capítulo (linhas, palavras, edição/rascunho/espera)
- Status dos arquivos de saída (EPUB/PDF/MOBI/TXT/MD)
- Suporte a múltiplos projetos via abas

O painel lê de `ui/public/status.json` (gerado pelo Claude a cada execução de `/book-status --ui`). O `ui/dist/index.html` pré-compilado está incluído — nenhuma etapa de build necessária.

## Princípios de Design

- **Planejar Antes de Executar** — Primeiro o esboço, validar, depois escrever
- **Idempotente** — Pular capítulos concluídos, retomar de onde parou
- **Eficiente em Tokens** — Contexto baseado em resumos, não texto completo
- **Consciente do Gênero** — Estruturas, templates e validação diferentes por gênero
- **Controle de Qualidade** — Cada fase deve passar nos critérios antes de continuar

## Dependências Externas

Para saída EPUB/PDF (Phase 5):

```bash
brew install pandoc        # Conversão EPUB/PDF
brew install texlive       # PDF com suporte a CJK/coreano
brew install --cask calibre  # Conversão MOBI (Kindle) — opcional
```

### Solução de Problemas

<details>
<summary>pandoc não encontrado</summary>

Instalar via Homebrew:
```bash
brew install pandoc
```
</details>

<details>
<summary>Caracteres CJK/PDF ausentes ou corrompidos</summary>

Instalar uma distribuição LaTeX compatível com CJK:
```bash
brew install texlive
# Ou para instalação mínima:
brew install basictex && sudo tlmgr install collection-langkorean
```
</details>

<details>
<summary>Comandos do plugin não encontrados após instalação</summary>

Reiniciar o Claude Code para recarregar os plugins:
```bash
claude restart
```
</details>

## Estrutura do Projeto

Ao criar um projeto de livro, o Velith configura:

```
{project-dir}/
├── PRD.md          # Requisitos do livro
├── STYLE.md        # Voz, tom, convenções
├── ideation.md     # Ideias, pesquisa de mercado
├── outline.md      # Esboço completo de capítulos
├── drafts/         # Rascunhos de capítulos
│   ├── ch00-foreword.md
│   ├── ch01-xxx.md
│   └── ...
├── edits/          # Relatórios de edição
│   └── editorial-report.md
├── publish/        # Arquivos finais
│   ├── book.epub
│   ├── book.pdf
│   ├── book.mobi
│   └── metadata.yaml
└── sources/        # Referências de material-fonte
```

## Integração

### Fluxos de trabalho de agentes integrados

Sem configuração adicional — executam automaticamente no pipeline:

- **discover** — Durante `/book-outline`, `book-architect` explora pontos cegos e contradições no conceito do livro antes de definir a estrutura
- **council** — Durante `/book-outline` e `/book-edit`, traz múltiplas perspectivas editoriais (desenvolvimento, estrutura, revisão de linha) para decisões de esboço e revisão

### alcove — Seu vault de pesquisa como material-fonte

[alcove](https://github.com/epicsagas/alcove) é um servidor de documentos privados que permite aos agentes do Velith consultar suas notas existentes, pesquisas e documentos de projeto como material-fonte durante a escrita.

**Quando é útil:**
- Você tem anos de notas de pesquisa, transcrições de entrevistas ou documentos de referência que deseja que o agente cite
- Está escrevendo não-ficção e precisa que os agentes extraiam fatos de documentação estruturada de projeto
- Mantém uma base de conhecimento com glossários, linhas do tempo ou detalhes de construção de mundo que o agente deve respeitar

**Como usar:**
1. Instale e configure o alcove como servidor MCP nas configurações do Claude Code
2. Durante `/book-init`, aponte seu projeto alcove como fonte
3. Os agents consultarão o alcove automaticamente ao redigir capítulos que referenciem sua pesquisa

### obsidian-forge — Do pensar ao escrever

[obsidian-forge](https://github.com/epicsagas/obsidian-forge) conecta seu vault do Obsidian ao Velith, para que você possa pesquisar no Obsidian e escrever com o Velith sem copiar arquivos manualmente.

**Quando é útil:**
- Suas pesquisas, perfis de personagens e notas de referência já existem em um vault do Obsidian
- Você quer iterar esboços no ambiente de notas vinculadas do Obsidian antes de passar ao Velith
- Colabora com coautores que preferem o Obsidian para brainstorming

**Como usar:**

```bash
# Criar um projeto de livro dentro do seu vault do Obsidian (01-Projects/)
of book init my-book --genre non-fiction --lang ko

# Trabalhar no Obsidian: notas de pesquisa, perfis de personagens, referências
# Marcar notas com book/my-book para vinculá-las como material-fonte
of book sync my-book

# Exportar para um diretório independente quando estiver pronto para escrever
of book export my-book --output ~/projects/my-book

# Agora executar velith no projeto exportado
> /loom
```

Tanto alcove quanto obsidian-forge são **opcionais** — o Velith funciona de forma independente.

## Contribuição

Ver [CONTRIBUTING.md](../../CONTRIBUTING.md). PRs são bem-vindos — verifique as issues rotuladas como `good first issue`.

## Licença

[Apache-2.0](../../LICENSE)
