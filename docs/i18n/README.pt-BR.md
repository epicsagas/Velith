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

**Livros no nível humano.** Da página em branco a um EPUB e um PDF publicáveis, um pipeline de seis fases submete cada capítulo, cada edição e cada imagem a um único padrão: um leitor frio que compra livros do gênero não percebe que o manuscrito é um rascunho de máquina.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## Por que a Velith?

Modelos de fronteira escrevem boas frases. Deixados sozinhos, ainda produzem livros que os leitores abandonam: uma voz que muda por volta do capítulo oito, personagens que explicam os próprios sentimentos, estatísticas que não existem, parágrafos que terminam todos numa frase de efeito, ilustrações que trocam de estilo a cada capítulo. Nada disso é problema do modelo. É problema de pipeline.

A Velith é esse pipeline. Ela lê o manuscrito inteiro antes de escrever o próximo capítulo, trava a voz numa amostra de capítulo antes de escrever em volume, critica e revisa cada capítulo antes de salvar, checa cada afirmação, reescreve durante a edição em vez de só produzir relatórios, lê o livro pronto a frio como o leriam os leitores-alvo, e se recusa a publicar até que eles continuariam lendo. Com as imagens é igual: uma bíblia de arte por livro, prompts compilados dela para qualquer modelo de imagem que você use, diagramas renderizados por código, e cada imagem aberta e julgada antes de sair.

## O que mudou no 0.5

| Antes (0.4) | Agora (0.5) |
|--------------|-----------|
| Agentes recebiam resumos de capítulos | Agentes leem o manuscrito inteiro (modelos de fronteira carregam 1M de tokens; um romance fica abaixo de 200K) |
| Quatro capítulos redigidos em paralelo | Gêneros narrativos escrevem em ordem; o capítulo N lê o N-1 |
| Uma passada por capítulo | Rascunho → crítica fria com citações → revisão, antes de salvar o arquivo |
| A edição produzia relatórios | A edição reescreve o manuscrito no lugar, com snapshots, em 7 etapas |
| Detecção de vícios por lista de palavras ("delve") | A taxonomia de marcas de IA de 2026: ritmo, estrutura, emoção, diálogo, mais marcas lexicais em en/ko/ja, medidas com `velith.mjs metrics` |
| Sem checagem de fatos | `fact-checker` monta um livro-razão de afirmações e remove o que não consegue verificar |
| O portão = arquivos existem | O portão = veredito do `beta-reader`: cinco eixos ≥ 7, nenhum ponto de abandono nos capítulos 1-3 |
| Só prompts de capa | Bíblia de arte, look lock, figuras por código, prompts compilados para qualquer backend, visão QA, validação de ativos |

| | Recurso | Por que importa |
|--|---------|----------------|
| 📏 | Um padrão de qualidade | `skills/loom/quality-bar.md`: rubrica de cinco eixos, taxonomia de marcas de IA, protocolo de leitura fria. Todo agente lê |
| 📋 | Pipeline de 6 fases com checkpoints do autor | Conceito, esboço, voice lock, look lock, reestruturações, veredito. O resto roda sem supervisão |
| 📖 | 7 referências de ofício por gênero + personalizadas | Ficção, não ficção, técnico, roteiro, poesia, games, acadêmico: opções de estrutura, ofício, marcas por gênero, notas de idioma |
| 🤖 | 12 agentes especializados | Arquiteto, planejador de cenas, escritor, continuidade, checador de fatos, doutor de estilo, leitor beta, diretor de arte, engenheiro de figuras, ilustrador, capa, marketing |
| ✏️ | Edição em 7 etapas | Checagem de fatos → avaliação → reestruturação → linha → cópia → revisão → veredito |
| 🎨 | Sistema visual | Bíblia de arte, look lock, figuras Mermaid/D2/SVG, prompts agnósticos de modelo, visão QA, checagens de impressão/EPUB |
| 📊 | Métricas determinísticas | Ritmo das frases, forma dos parágrafos, repetição entre capítulos, densidade de marcas (en/ko) |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Pandoc + Calibre opcional, epubcheck, checklists para KDP e plataformas coreanas |

## Comparação

| | Velith | Prompts crus | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| Contexto do manuscrito inteiro | Cada agente, cada tarefa | Manual | Nenhum | Limitado | n/d |
| Voice lock + ciclo crítica-revisão | Embutido | Nenhum | Nenhum | Nenhum | Manual |
| Checagem de fatos com livro-razão | Agente dedicado | Nenhum | Nenhum | Nenhum | Manual |
| Portão de prontidão com leitores simulados | Bloqueia a publicação | Nenhum | Nenhum | Nenhum | Nenhum |
| Consistência visual no livro inteiro | Bíblia de arte + prompts compilados + visão QA | Prompt por imagem | Nenhum | Nenhum | Nenhum |
| Consciência de gênero | 7 referências de ofício + personalizado | Depende do prompt | Nenhum | Focado em ficção | Nenhum |
| Formato de saída | EPUB, PDF, MOBI, TXT, Markdown | Copiar e colar | Markdown / PDF | DOCX, limitado | DOCX, PDF |
| Requer | Claude Code, Codex CLI, Agy, Cursor, Cline ou Aider | Qualquer LLM | Assinatura do Notion | Assinatura | Licença |
| Controle total | Nível de prompt, Apache-2.0 | Total | Caixa-preta | Caixa-preta | Total |

## Instalação

### Claude Code

```
/plugin marketplace add epicsagas/plugins
/plugin install velith@epicsagas
```

18 skills e 12 agentes disponíveis de imediato. Atualizações com `/plugin update velith@epicsagas`.

**Pré-requisito:** CLI do [Claude Code](https://claude.ai/code) instalada e autenticada. A Velith é ajustada para a família Claude 5 (contexto de 1M); os agentes herdam o modelo da sua sessão e definem o próprio nível de esforço.

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

18 skills e 12 subagentes personalizados (`.codex-plugin/agents/*.toml`, gerados a partir de `agents/*.md`). O Codex descobre ambos automaticamente. Atualizações com `codex plugin update velith@epicsagas`.

**Pré-requisito:** [Codex CLI](https://github.com/openai/codex) instalada e configurada.

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

### Cursor

Regras de contexto em `.cursor/rules/`:

| Arquivo de regras | Quando carrega |
|-----------|-------------|
| `velith-pipeline.mdc` | Sempre (fases, roteador, agentes, padrão de qualidade, checkpoints) |
| `velith-genres.mdc` | Ao editar rascunhos, esboços ou o PRD |
| `velith-editing.mdc` | Ao trabalhar com edits, STYLE.md ou bible.md |

### Cline

Instruções de projeto em `.clinerules`, na raiz do repositório.

### Aider

Convenções de escrita em `CONVENTIONS.md`, carregadas automaticamente via `.aider.conf.yml`.

## Início rápido

```bash
> /book-init          # gênero, leitor, idioma, amostra de voz → PRD.md + STYLE.md
> /loom               # detecta o estado e roda a próxima fase, parando nos checkpoints do autor
```

O que acontece:

1. **Onboarding** — leitor, promessa, extensão e uma impressão digital de voz extraída de uma amostra da sua própria escrita
2. **Ideação** — teste de estresse da premissa, títulos comparáveis reais, conceitos classificados; você escolhe
3. **Esboço** — estrutura escolhida e justificada, especificações por capítulo, plano de figuras, bíblia; o arquiteto pontua, você aprova
4. **Redação** — voice lock num capítulo de amostra; depois capítulos sequenciais com contexto completo, cada um criticado e revisado, livro-razão da bíblia atualizado, checagens de continuidade
5. **Edição** — checagem de fatos, avaliação, reescritas estruturais, edição de linha, cópia, revisão final, e uma leitura fria por leitores simulados. PASS ou REVISE
6. **Publicação** — páginas pré-textuais e pós-textuais, EPUB/PDF/MOBI, epubcheck, capa a partir da bíblia de arte, plano de marketing, checklists de plataforma

Imagens a qualquer momento a partir da Fase 2: `/book-visuals plan` (bíblia de arte), `/book-visuals lock` (look lock), depois figuras e ilustrações conforme os capítulos pedem.

## Skills

| Skill | Fase | Descrição |
|-------|-------|-------------|
| `/loom` | Roteador | Detecta o estado, roda a próxima fase, aplica os portões |
| `/book-init` | 0 | Leitor, promessa, extensão, impressão de voz, índice de fontes → `PRD.md`, `STYLE.md` |
| `/book-ideation` | 1 | Teste da premissa, comparáveis, conceitos classificados, amostras de voz |
| `/book-outline` | 2 | Estrutura, especificações, plano de figuras, bíblia, validação pontuada, aprovação |
| `/book-draft` | 3 | Voice lock, redação sequencial com crítica e revisão, livro-razão, continuidade |
| `/book-edit` | 4 | 7 etapas: checagem de fatos … veredito de prontidão |
| `/book-publish` | 5 | Portão de prontidão, páginas pré/pós-textuais, formatos, epubcheck, capa, marketing, checklists |
| `/book-visuals` | 2-5 | Bíblia de arte, look lock, figuras, ilustrações, fotos, compilação de prompts, visão QA, checagem de ativos |
| `/book-illustrate` | 3-5 | Alias do subconjunto de ilustração do `/book-visuals` |
| `/book-status` | — | Painel no terminal, `--ui` painel no navegador, `--metrics` |
| `/book-fiction` … `/book-academic` | — | Referências de ofício por gênero (7) |
| `/book-genre-creator` | — | Seleção de gênero e especificações de gênero personalizado |

## Agentes

| Agente | Fase | Função |
|-------|-------|-----|
| `book-architect` | 2 | Esboço e bíblia; estrutura escolhida e justificada; validação pontuada; propostas de reestruturação |
| `scene-generator` | 3 | Planos de cena por capítulo de ficção (propósito, virada, subtexto, saída). Planos, não prosa |
| `chapter-writer` | 3-4 | Um capítulo com contexto completo; redige, critica com citações, revisa, atualiza o livro-razão |
| `continuity-editor` | 3-4 | Contradições e repetições no manuscrito inteiro contra a bíblia |
| `fact-checker` | 4 | Livro-razão de afirmações; verificação contra fontes e web; remove o inverificável; executa código |
| `style-doctor` | 4 | Mede e depois reescreve no lugar as marcas, a uniformidade rítmica e a deriva |
| `beta-reader` | 4 | Leitura fria como três leitores-alvo e um profissional; veredito de prontidão |
| `art-director` | 2-5 | Bíblia de arte, look lock, visão QA de cada imagem, revisão da folha de contato |
| `figure-engineer` | 3-5 | Diagramas, gráficos, desenhos técnicos e bases de mapas renderizados por código; rótulos verificados contra o texto |
| `illustrator` | 3-5 | Ilustrações a partir da bíblia de arte com prompts compilados, geração quando existe ferramenta, visão QA |
| `cover-designer` | 5 | Conceitos de capa a partir da bíblia de arte, formatos, variantes de marketing |
| `marketing-expert` | 5 | Posicionamento, personas, canais, calendário, checklist de lançamento |

## O padrão de qualidade

`skills/loom/quality-bar.md` é lido por todo agente de escrita, edição e revisão. Ele define:

- **Cinco eixos, nota de 1 a 10 com âncoras**: voz e prosa, estrutura e ritmo, profundidade, especificidade e fundamentação, experiência do leitor. O voice lock exige eixo 1 ≥ 7. A prontidão exige cada eixo ≥ 7, média ≥ 7.5 e nenhum ponto de abandono nos três primeiros capítulos.
- **A taxonomia de marcas de IA de 2026**: o que os leitores realmente percebem hoje (ritmo de parágrafo uniforme, finais em frase de efeito, "not X but Y", codas reflexivas, autoconhecimento preciso demais, diálogo que responde, autoridade sem fonte, especificidade inventada) e como corrigir, mais listas lexicais para inglês, coreano e japonês.
- **O protocolo de leitura fria**: ler uma vez em velocidade de leitura, marcar, diagnosticar com citações, pontuar com honestidade, priorizar, e só então revisar.
- **Regras visuais**: um visual por livro, propósito antes de decoração, código para tudo que leva texto ou dados, look lock, visão QA, restrições de entrega.

## CLI

```bash
node velith.mjs scan <dir> [--ui]           # estado do projeto, dados do painel, veredito de prontidão
node velith.mjs metrics <dir|file>          # métricas de prosa + repetição entre capítulos (JSON)
node velith.mjs snapshot <dir> <label>      # copia drafts/ antes de uma etapa de reescrita
node velith.mjs images compile <dir> [id]   # bíblia de arte + spec → prompts Midjourney / gpt-image / SD-FLUX / Imagen / Ideogram
node velith.mjs images check <dir>          # dimensões, proporção, tamanho, texto alt, referências, cobertura do manifesto
node velith.mjs images render <dir>         # Mermaid / D2 / Graphviz / SVG / matplotlib → SVG + PNG
```

## Painel visual

<img src="../../docs/assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` abre um painel em Svelte: rastreador do pipeline, 12 cartões de agentes, tabela de capítulos, kanban de edição em 6 etapas, veredito de prontidão com notas por eixo, arquivos de saída, configurações. O `dist/` pré-compilado está incluído.

```bash
cd dashboard && npm install && npm run dev   # http://localhost:5173
npm run build                                 # reconstruir dist/
```

## Dependências externas

```bash
brew install pandoc                 # EPUB/PDF (necessário na fase 5)
brew install texlive                # PDF com suporte a CJK
brew install --cask calibre         # MOBI (opcional)
brew install epubcheck              # validação de EPUB (opcional, recomendado)
npm i -g @mermaid-js/mermaid-cli    # figuras Mermaid → SVG (opcional)
brew install d2 graphviz librsvg    # figuras D2 / Graphviz, SVG → PNG (opcional)
```

A geração de imagens não vem empacotada. `illustrator` e `cover-designer` geram quando existe uma ferramenta de imagem na sua sessão (servidores MCP de imagem, Replicate, Stable Diffusion local); senão, entregam pacotes de prompts compilados por backend em `visuals/prompts/`.

<details>
<summary>Solução de problemas</summary>

- **pandoc not found** — `brew install pandoc`
- **Caracteres CJK ausentes no PDF** — `brew install texlive`
- **Comandos do plugin não aparecem** — reinicie o Claude Code
- **A fase 4 nunca termina** — o portão é `edits/readiness-report.md` com `verdict: PASS`; rode `/book-edit 6`
- **Imagens mudam de estilo a cada capítulo** — falta o look lock; rode `/book-visuals plan` e depois `/book-visuals lock`
</details>

## Estrutura do projeto

```
{project-dir}/
├── PRD.md              # Requisitos + promessa ao leitor
├── STYLE.md            # Impressão digital de voz, amostra de voz, regras, voice lock
├── ideation.md         # Conceitos, comparáveis, conceito escolhido
├── outline.md          # Especificações, plano de figuras, validação, aprovação
├── bible.md            # Personagens/conceitos, regras de termos, linha do tempo, livro-razão por capítulo
├── art-bible.md        # Identidade visual, sistema de figuras, look lock
├── sources/            # Material de referência + INDEX.md
├── drafts/             # ch{NN}-{slug}.md, ch{NN}-scenes.md (reescritos no lugar durante a edição)
├── visuals/            # plan, manifest, figures/, illustrations/, photos/, ref/, prompts/
├── edits/              # 00-fact-check … 06-readiness-report, readiness-report.md, editorial-report.md
├── publish/            # book.epub/pdf/…, metadata, páginas pré/pós-textuais, cover/, marketing, checklists
└── .velith/            # status.json, art-bible.json, critiques/, snapshots/, metrics.json
```

## Integrações

- **alcove** — busca seu cofre de documentos como material de fonte durante `/book-init` e a redação.
- **obsidian-forge** — `of book init / sync / export` para escrever direto de um vault do Obsidian.
- **humanize-korean** — se instalado, `style-doctor` pode usá-lo como polimento final de coreano.
- **MCPs de geração de imagem** — usados por `illustrator` e `cover-designer` quando presentes.

Tudo opcional. A Velith funciona sozinha.

## Contribuir

Veja [CONTRIBUTING.md](../../CONTRIBUTING.md). Prompts são o produto: uma mudança em `quality-bar.md` ou num arquivo de agente muda todos os livros. Teste com `examples/` e `node velith.mjs metrics`.

## Licença

[Apache-2.0](../../LICENSE)
