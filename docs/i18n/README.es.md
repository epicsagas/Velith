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

**Libros al nivel humano.** De la página en blanco a un EPUB y un PDF publicables, un pipeline de seis fases somete cada capítulo, cada edición y cada imagen a un único estándar: un lector frío que compra libros de este género no puede distinguir que el manuscrito es un borrador de máquina.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## ¿Por qué Velith?

Los modelos de frontera escriben buenas frases. Dejados solos, siguen produciendo libros que los lectores abandonan: una voz que cambia hacia el capítulo ocho, personajes que explican sus sentimientos, estadísticas que no existen, párrafos que terminan todos en una frase contundente, ilustraciones que cambian de estilo en cada capítulo. Nada de eso es un problema del modelo. Es un problema de pipeline.

Velith es ese pipeline. Lee el manuscrito completo antes de escribir el siguiente capítulo, fija la voz con un capítulo de muestra antes de escribir en volumen, critica y reescribe cada capítulo antes de guardarlo, verifica cada afirmación, reescribe durante la edición en lugar de solo emitir informes, lee el libro terminado en frío como lo leerían sus lectores reales, y se niega a publicar hasta que estos seguirían leyendo. Con las imágenes ocurre lo mismo: una biblia artística por libro, prompts compilados desde ella para el modelo de imagen que uses, diagramas renderizados desde código, y cada imagen revisada a la vista antes de enviarse.

## Qué cambió en 0.5

| Antes (0.4) | Ahora (0.5) |
|--------------|-----------|
| Los agentes recibían resúmenes de capítulos | Los agentes leen el manuscrito completo (los modelos de frontera manejan 1M de tokens; una novela ocupa menos de 200K) |
| Cuatro capítulos redactados en paralelo | Los géneros narrativos se redactan en orden; el capítulo N lee el N-1 |
| Una sola pasada por capítulo | Borrador → crítica en frío con citas → revisión, antes de guardar el archivo |
| La edición producía informes | La edición reescribe el manuscrito en el sitio, con instantáneas, en 7 etapas |
| Detección de tics por lista de palabras ("delve") | Taxonomía de marcas de IA 2026: ritmo, estructura, emoción, diálogo, más marcas léxicas en en/ko/ja, medidas con `velith.mjs metrics` |
| Sin verificación de hechos | `fact-checker` construye un libro de afirmaciones y elimina lo que no puede verificar |
| La compuerta = archivos existen | La compuerta = veredicto de `beta-reader`: cinco ejes ≥ 7, sin punto de abandono en los capítulos 1-3 |
| Solo prompts de portada | Biblia artística, look lock, figuras por código, prompts compilados para cualquier backend, visión QA, validación de activos |

| | Funcionalidad | Por qué importa |
|--|---------|----------------|
| 📏 | Un estándar de calidad | `skills/loom/quality-bar.md`: rúbrica de cinco ejes, taxonomía de marcas de IA, protocolo de lectura en frío. Lo leen todos los agentes |
| 📋 | Pipeline de 6 fases con puntos de control del autor | Concepto, esquema, voice lock, look lock, reestructuras, veredicto. Todo lo demás corre sin supervisión |
| 📖 | 7 referencias de oficio por género + personalizadas | Ficción, no ficción, técnico, guion, poesía, videojuegos, académico: opciones de estructura, oficio, marcas por género, notas de idioma |
| 🤖 | 12 agentes especializados | Arquitecto, planificador de escenas, escritor, continuidad, verificador de hechos, doctor de estilo, lector beta, director artístico, ingeniero de figuras, ilustrador, portada, marketing |
| ✏️ | Edición en 7 etapas | Verificación de hechos → evaluación → reestructuración → línea → copia → corrección → veredicto |
| 🎨 | Sistema visual | Biblia artística, look lock, figuras Mermaid/D2/SVG, prompts agnósticos al modelo, visión QA, chequeos de imprenta/EPUB |
| 📊 | Métricas deterministas | Ritmo de la frase, forma del párrafo, repetición entre capítulos, densidad de marcas (en/ko) |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Pandoc + Calibre opcional, epubcheck, listas para KDP y plataformas coreanas |

## Comparación

| | Velith | Prompts crudos | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| Contexto del manuscrito completo | Cada agente, cada tarea | Manual | Ninguno | Limitado | n/d |
| Voice lock + bucle crítica-revisión | Incorporado | Ninguno | Ninguno | Ninguno | Manual |
| Verificación de hechos con libro de afirmaciones | Agente dedicado | Ninguno | Ninguno | Ninguno | Manual |
| Compuerta de preparación con lectores simulados | Bloquea la publicación | Ninguno | Ninguno | Ninguno | Ninguno |
| Consistencia visual en todo el libro | Biblia artística + prompts compilados + visión QA | Prompt por imagen | Ninguno | Ninguno | Ninguno |
| Conciencia de género | 7 referencias de oficio + personalizado | Depende del prompt | Ninguno | Centrado en ficción | Ninguno |
| Formato de salida | EPUB, PDF, MOBI, TXT, Markdown | Copiar y pegar | Markdown / PDF | DOCX, limitado | DOCX, PDF |
| Requiere | Claude Code, Codex CLI, Agy, Cursor, Cline o Aider | Cualquier LLM | Suscripción a Notion | Suscripción | Licencia |
| Control total | A nivel de prompt, Apache-2.0 | Total | Caja negra | Caja negra | Total |

## Instalación

### Claude Code

```
/plugin marketplace add epicsagas/plugins
/plugin install velith@epicsagas
```

18 skills y 12 agentes disponibles de inmediato. Actualizaciones con `/plugin update velith@epicsagas`.

**Requisitos:** CLI de [Claude Code](https://claude.ai/code) instalada y autenticada. Velith está afinado para la familia Claude 5 (1M de contexto); los agentes heredan el modelo de tu sesión y fijan su propio nivel de esfuerzo.

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

18 skills y 12 subagentes personalizados (`.codex-plugin/agents/*.toml`, generados desde `agents/*.md`). Codex los descubre automáticamente. Actualizaciones con `codex plugin update velith@epicsagas`.

**Requisitos:** [Codex CLI](https://github.com/openai/codex) instalada y configurada.

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

### Cursor

Reglas de contexto en `.cursor/rules/`:

| Archivo de reglas | Cuándo se carga |
|-----------|-------------|
| `velith-pipeline.mdc` | Siempre (fases, router, agentes, estándar de calidad, puntos de control) |
| `velith-genres.mdc` | Al editar borradores, esquemas o el PRD |
| `velith-editing.mdc` | Al trabajar con edits, STYLE.md o bible.md |

### Cline

Instrucciones a nivel de proyecto en `.clinerules`, en la raíz del repositorio.

### Aider

Convenciones de escritura en `CONVENTIONS.md`, cargadas automáticamente vía `.aider.conf.yml`.

## Inicio rápido

```bash
> /book-init          # género, lector, idioma, muestra de voz → PRD.md + STYLE.md
> /loom               # detecta el estado y ejecuta la siguiente fase, deteniéndose en los puntos de control
```

Qué ocurre:

1. **Onboarding** — lector, promesa, extensión y una huella de voz extraída de una muestra de tu propia escritura
2. **Ideación** — prueba de estrés de la premisa, títulos comparables reales, conceptos ordenados; tú eliges
3. **Esquema** — estructura elegida y justificada, especificaciones por capítulo, plan de figuras, biblia; el arquitecto la puntúa y tú la apruebas
4. **Redacción** — voice lock con un capítulo de muestra; luego capítulos secuenciales con contexto completo, cada uno criticado y revisado, con el libro de la biblia actualizado y verificación de continuidad
5. **Edición** — verificación de hechos, evaluación, reescrituras estructurales, edición de línea, copia, corrección, y una lectura en frío por lectores simulados. PASS o REVISE
6. **Publicación** — páginas preliminares y finales, EPUB/PDF/MOBI, epubcheck, portada desde la biblia artística, plan de marketing, listas de plataformas

Imágenes en cualquier momento desde la Fase 2: `/book-visuals plan` (biblia artística), `/book-visuals lock` (look lock), y figuras e ilustraciones según las pida cada capítulo.

## Skills

| Skill | Fase | Descripción |
|-------|-------|-------------|
| `/loom` | Router | Detecta el estado, ejecuta la siguiente fase, aplica las compuertas |
| `/book-init` | 0 | Lector, promesa, extensión, huella de voz, índice de fuentes → `PRD.md`, `STYLE.md` |
| `/book-ideation` | 1 | Prueba de estrés, comparables, conceptos ordenados, muestras de voz |
| `/book-outline` | 2 | Estructura, especificaciones, plan de figuras, biblia, validación puntuada, aprobación |
| `/book-draft` | 3 | Voice lock, redacción secuencial con crítica y revisión, libro de capítulos, continuidad |
| `/book-edit` | 4 | 7 etapas: verificación de hechos … veredicto de preparación |
| `/book-publish` | 5 | Compuerta, páginas preliminares, formatos, epubcheck, portada, marketing, listas |
| `/book-visuals` | 2-5 | Biblia artística, look lock, figuras, ilustraciones, fotos, compilación de prompts, visión QA, chequeo de activos |
| `/book-illustrate` | 3-5 | Alias del subconjunto de ilustración de `/book-visuals` |
| `/book-status` | — | Panel en terminal, panel en navegador con `--ui`, `--metrics` |
| `/book-fiction` … `/book-academic` | — | Referencias de oficio por género (7) |
| `/book-genre-creator` | — | Selección de género y especificaciones de género personalizado |

## Agentes

| Agente | Fase | Tarea |
|-------|-------|-----|
| `book-architect` | 2 | Esquema y biblia; estructura elegida y justificada; validación puntuada; propuestas de reestructuración |
| `scene-generator` | 3 | Planes de escena por capítulo de ficción (propósito, giro, subttexto, salida). Planes, no prosa |
| `chapter-writer` | 3-4 | Un capítulo con contexto completo; redacta, critica con citas, revisa y actualiza el libro |
| `continuity-editor` | 3-4 | Contradicciones y repeticiones en todo el manuscrito contra la biblia |
| `fact-checker` | 4 | Libro de afirmaciones; verificación contra fuentes y web; elimina lo inverificable; ejecuta código |
| `style-doctor` | 4 | Mide y luego reescribe en el sitio las marcas, la uniformidad rítmica y la deriva |
| `beta-reader` | 4 | Lectura en frío como tres lectores objetivo y un profesional; veredicto de preparación |
| `art-director` | 2-5 | Biblia artística, look lock, visión QA de cada imagen, revisión de la hoja de contactos |
| `figure-engineer` | 3-5 | Diagramas, gráficos, planos técnicos y bases de mapas renderizados desde código; etiquetas verificadas contra el texto |
| `illustrator` | 3-5 | Ilustraciones desde la biblia artística con prompts compilados, generación si existe herramienta, visión QA |
| `cover-designer` | 5 | Conceptos de portada desde la biblia artística, formatos, variantes de marketing |
| `marketing-expert` | 5 | Posicionamiento, personas, canales, calendario, lista de lanzamiento |

## El estándar de calidad

`skills/loom/quality-bar.md` lo leen todos los agentes de escritura, edición y revisión. Define:

- **Cinco ejes puntuados de 1 a 10 con anclas**: voz y prosa, estructura y ritmo, profundidad, especificidad y fundamentos, experiencia del lector. El voice lock exige eje 1 ≥ 7. La preparación exige cada eje ≥ 7, media ≥ 7.5 y ningún punto de abandono en los tres primeros capítulos.
- **La taxonomía de marcas de IA de 2026**: lo que los lectores notan de verdad hoy (ritmo de párrafo uniforme, cierres remachados, "not X but Y", codas reflexivas, autoconocimiento preciso, diálogo que responde, autoridad sin fuente, especificidad inventada) con sus correcciones, más listas léxicas para inglés, coreano y japonés.
- **El protocolo de lectura en frío**: leer una vez a velocidad de lectura, marcar, diagnosticar con citas, puntuar con honestidad, priorizar y solo entonces revisar.
- **Reglas visuales**: un look por libro, propósito antes que decoración, código para todo lo que lleve texto o datos, look lock, visión QA, restricciones de envío.

## CLI

```bash
node velith.mjs scan <dir> [--ui]           # estado del proyecto, datos del panel, veredicto de preparación
node velith.mjs metrics <dir|file>          # métricas de prosa + repetición entre capítulos (JSON)
node velith.mjs snapshot <dir> <label>      # copia drafts/ antes de una etapa de reescritura
node velith.mjs images compile <dir> [id]   # biblia artística + spec → prompts Midjourney / gpt-image / SD-FLUX / Imagen / Ideogram
node velith.mjs images check <dir>          # dimensiones, aspecto, tamaño, texto alt, referencias, cobertura del manifiesto
node velith.mjs images render <dir>         # Mermaid / D2 / Graphviz / SVG / matplotlib → SVG + PNG
```

## Panel visual

<img src="../../docs/assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` abre un panel en Svelte: rastreo del pipeline, 12 tarjetas de agentes, tabla de capítulos, kanban de edición en 6 etapas, veredicto de preparación con puntuaciones por eje, archivos de salida y ajustes. Incluye `dist/` preconstruido.

```bash
cd dashboard && npm install && npm run dev   # http://localhost:5173
npm run build                                 # reconstruir dist/
```

## Dependencias externas

```bash
brew install pandoc                 # EPUB/PDF (necesario en la fase 5)
brew install texlive                # PDF con soporte CJK
brew install --cask calibre         # MOBI (opcional)
brew install epubcheck              # validación de EPUB (opcional, recomendado)
npm i -g @mermaid-js/mermaid-cli    # figuras Mermaid → SVG (opcional)
brew install d2 graphviz librsvg    # figuras D2 / Graphviz, SVG → PNG (opcional)
```

La generación de imágenes no viene incluida. `illustrator` y `cover-designer` generan cuando hay una herramienta de imágenes en tu sesión (servidores MCP de imágenes, Replicate, Stable Diffusion local); si no, entregan paquetes de prompts compilados por backend en `visuals/prompts/`.

<details>
<summary>Solución de problemas</summary>

- **pandoc not found** — `brew install pandoc`
- **Caracteres CJK ausentes en el PDF** — `brew install texlive`
- **Los comandos del plugin no aparecen** — reinicia Claude Code
- **La fase 4 nunca termina** — la compuerta es `edits/readiness-report.md` con `verdict: PASS`; ejecuta `/book-edit 6`
- **Las imágenes cambian de estilo por capítulo** — falta el look lock; ejecuta `/book-visuals plan` y luego `/book-visuals lock`
</details>

## Estructura del proyecto

```
{project-dir}/
├── PRD.md              # Requisitos + promesa al lector
├── STYLE.md            # Huella de voz, muestra de voz, reglas, voice lock
├── ideation.md         # Conceptos, comparables, concepto elegido
├── outline.md          # Especificaciones, plan de figuras, validación, aprobación
├── bible.md            # Personajes/conceptos, reglas de términos, línea temporal, libro por capítulo
├── art-bible.md        # Identidad visual, sistema de figuras, look lock
├── sources/            # Material de referencia + INDEX.md
├── drafts/             # ch{NN}-{slug}.md, ch{NN}-scenes.md (reescritos en el sitio durante la edición)
├── visuals/            # plan, manifest, figures/, illustrations/, photos/, ref/, prompts/
├── edits/              # 00-fact-check … 06-readiness-report, readiness-report.md, editorial-report.md
├── publish/            # book.epub/pdf/…, metadata, preliminares, cover/, marketing, checklists
└── .velith/            # status.json, art-bible.json, critiques/, snapshots/, metrics.json
```

## Integración

- **alcove** — busca en tu bóveda de documentos como material de fuente durante `/book-init` y la redacción.
- **obsidian-forge** — `of book init / sync / export` para escribir desde un vault de Obsidian.
- **humanize-korean** — si está instalado, `style-doctor` puede usarlo como pulido final de coreano.
- **MCPs de generación de imágenes** — los usan `illustrator` y `cover-designer` cuando están presentes.

Todo opcional. Velith funciona por sí solo.

## Contribuir

Ver [CONTRIBUTING.md](../../CONTRIBUTING.md). Los prompts son el producto: un cambio en `quality-bar.md` o en un archivo de agente cambia todos los libros. Prueba con `examples/` y `node velith.mjs metrics`.

## Licencia

[Apache-2.0](../../LICENSE)
