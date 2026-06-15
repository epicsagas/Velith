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
  <a href=".claude-plugin/plugin.json"><img alt="Version" src="https://img.shields.io/badge/version-0.3.1-fc8d62?style=for-the-badge&labelColor=0d1117" /></a>
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

**Construye libros como software.** Un pipeline multifase que convierte el conocimiento de formato largo —libros, RFC, whitepapers, docs de diseño, guías técnicas— en artefactos estructurados, no prompts aislados. De página en blanco a EPUB/PDF publicable.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## ¿Por qué Velith?

Escribir un libro con prompts LLM básicos produce capítulos desconectados, voz inconsistente y sin estructura. Velith proporciona un **pipeline de planificación previa a la ejecución** — valida antes de escribir, controla la calidad en cada fase y mantiene la continuidad a lo largo de todo el manuscrito.

## Benchmark

Lo que el pipeline hace con la entrada no estructurada — [pruébalo tú mismo →](https://huggingface.co/spaces/epicsaga/Velith)

| Métrica | Entrada sin procesar | Después del pipeline de Velith |
|---------|---------------------|-------------------------------|
| Puntuación de estructura | 2–4 / 10 | 6–9 / 10 |
| Redundancia | 20–45% solapamiento n-gram | < 10% tras consolidación |
| Marcadores de AI-slop | 6–20 por 1K palabras | Detectados y eliminados por style-doctor |
| Jerarquía de capítulos | Ninguna | Detectada + mapeada con referencias cruzadas |
| Puntuación de coherencia | 0,3–1,5 / 10 | Mejorada con reestructuración de secciones |

| | Característica | Por qué importa |
|--|---------------|-----------------|
| 📋 | Pipeline de 6 fases | Cada fase valida antes de continuar — sin retrabajo |
| 📖 | 7 plantillas de género | Ficción, no ficción, técnico, guion, poesía, juego, académico (+ género personalizado vía genre-creator) |
| 🤖 | 7 agentes especializados | Arquitectura, borradores, generación de escenas, continuidad, estilo, portada, marketing |
| ✏️ | Edición en 5 etapas | Evaluación → Desarrollo → Línea → Corrección → Revisión final |
| 🔄 | Reanudar en cualquier punto | Omite capítulos completados, retoma donde lo dejaste |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Archivos listos para publicar via Pandoc + Calibre |

## Un pipeline, muchos artefactos

Velith se publica como un pipeline de libros, pero las mismas 6 fases se aplican a **cualquier conocimiento estructurado de formato largo**. No importa si el artefacto es una novela de 300 páginas o un RFC de 12; el flujo plan-then-execute, las puertas de calidad y los agentes son idénticos.

| Artefacto | Skill de género | Salida típica |
|----------|-------------|----------------|
| Novela / Historia | `book-fiction` | EPUB / PDF / MOBI |
| Libro de no-ficción | `book-nonfiction` | EPUB / PDF |
| RFC / Doc de diseño | `book-technical` | Markdown / PDF |
| Whitepaper / Informe de investigación | `book-academic` | PDF (citas) |
| Material de curso / Tutorial | `book-technical` | EPUB / PDF |
| Escenario de juego / Lore bible | `book-game` | Markdown / EPUB |

## Comparación

| | Velith | Prompts básicos | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| Validación de estructura | Pipeline por fases | Ninguna | Ninguna | Plantillas básicas | Manual |
| Continuidad entre capítulos | Agente dedicado | Manual | Ninguna | Limitada | Manual |
| Detección de AI-slop | Integrada (style-doctor) | Ninguna | Ninguna | Ninguna | Ninguna |
| Consciencia de género | 8 sistemas de género + personalizado | Depende del prompt | Ninguna | Centrado en ficción | Ninguna |
| Formato de salida | EPUB, PDF, MOBI, TXT, Markdown | Copiar-pegar | Markdown / PDF | DOCX, limitado | DOCX, PDF |
| Control de calidad | Cada fase | Ninguno | Ninguno | Ninguno | Ninguno |
| Requiere | Claude Code, Codex CLI, Agy, Cursor, Cline o Aider | Cualquier LLM | Suscripción Notion | Suscripción | Licencia |
| Control total | A nivel de prompt | Total | Caja negra | Caja negra | Total |

## Instalación

### Claude Code

```bash
# Agregar marketplace de epicsagas (primera vez)
claude plugin marketplace add epicsagas

# Instalar velith
claude plugin install velith@epicsagas
```

**Requisitos previos:** CLI de [Claude Code](https://claude.ai/code) instalado y autenticado.

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

**Requisitos previos:** [Codex CLI](https://github.com/openai/codex) instalado y configurado con una clave API de OpenAI.

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

Agy descubre automáticamente las skills y agentes desde la raíz del repositorio. No requiere configuración adicional.

**Requisitos previos:** [Agy](https://antigravity.google/docs/cli-install) instalado y configurado.

### Cursor

Velith proporciona reglas de contexto en `.cursor/rules/` que dan al agente de Cursor conocimiento completo de la pipeline de publicación, patrones de género y estándares de edición. Las reglas se cargan automáticamente al abrir un proyecto de libro en Cursor.

**Requisitos previos:** [Cursor](https://cursor.sh) instalado.

### Cline

Velith proporciona instrucciones a nivel de proyecto en `.clinerules` en la raíz del repositorio. Cline las lee automáticamente al trabajar en el directorio del proyecto.

**Requisitos previos:** Extensión [Cline](https://github.com/cline/cline) instalada en VS Code o JetBrains.

### Aider

Velith proporciona convenciones de escritura en `CONVENTIONS.md`, autocargadas mediante `.aider.conf.yml`.

```bash
aider  # CONVENTIONS.md se autocarga
```

**Requisitos previos:** [Aider](https://aider.chat) instalado y configurado con una clave API.

## Inicio Rápido

```bash
# Iniciar un nuevo proyecto de libro
> /book-init

# Detectar automáticamente la fase actual y continuar
> /loom
```

El plugin te guía a través de:
1. **Onboarding** — Género, audiencia, idioma, material fuente, guía de estilo
2. **Ideation** — Investigación de mercado, destilación de conceptos, títulos competidores
3. **Outlining** — Esquema completo de capítulos con especificaciones, dependencias, referencias cruzadas
4. **Drafting** — Generación capítulo por capítulo con subagentes en paralelo
5. **Editing** — Pipeline de 5 etapas: Evaluación → Desarrollo → Línea → Corrección → Revisión final
6. **Publishing** — Conversión EPUB/PDF/MOBI, metadatos, plan de marketing

## Skills

| Skill | Fase | Descripción |
|-------|------|-------------|
| `/loom` | Router | Detectar fase automáticamente y enrutar |
| `/book-init` | 0 | Iniciar nuevo proyecto — género, audiencia, guía de estilo |
| `/book-ideation` | 1 | Generar y validar conceptos, análisis competitivo |
| `/book-outline` | 2 | Crear esquema de capítulos (con dependencias) |
| `/book-draft` | 3 | Redactar capítulos (todos/específicos/reanudar, agentes paralelos) |
| `/book-edit` | 4 | Pipeline de edición en 5 etapas |
| `/book-publish` | 5 | Conversión EPUB/PDF/MOBI, portada, marketing |
| `/book-status` | — | Panel de terminal + `--ui` panel en navegador |
| `/book-fiction` | — | Patrones de ficción (15 beats, Snowflake, biblia de personajes) |
| `/book-nonfiction` | — | Patrones de no ficción (problema-solución, jerarquía de evidencia) |
| `/book-technical` | — | Patrones técnicos (gradiente de conceptos, código, labs) |
| `/book-screenplay` | — | Patrones de guion (3 actos, diálogo, historias A/B) |
| `/book-poetry` | — | Patrones de poesía (formas, imágenes, estructura de estrofas) |
| `/book-game` | — | Patrones de juego (árboles de misiones, ramificación, biblia de lore) |
| `/book-academic` | — | Patrones académicos (IMRAD, revisión de literatura, cadenas argumentativas) |
| `/book-genre-creator` | — | Guía de selección de género y asistente de creación de géneros personalizados |

## Agentes

| Agente | Rol |
|--------|-----|
| `book-architect` | Valida estructura, puntúa esquemas, verifica ritmo narrativo |
| `chapter-writer` | Genera borradores de capítulos con plantillas de género |
| `continuity-editor` | Consistencia entre capítulos (terminología, referencias, cronología) |
| `style-doctor` | Consistencia de voz/tono, detección de AI-slop |
| `scene-generator` | Desglose a nivel de escena con estructura GMC+RDD (solo ficción) |
| `cover-designer` | Conceptos de portada + prompts de imagen para Midjourney/DALL-E |
| `marketing-expert` | Personas de lectores, estrategia de canales, calendario de lanzamiento de 12 semanas |

## Panel Visual

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` abre un panel de progreso basado en Svelte en tu navegador. El panel se actualiza automáticamente cada 5 segundos:

- Rastreador de pipeline de 6 fases (Onboarding → Ideation → Outlining → Drafting → Editing → Publishing)
- 7 tarjetas de estado de agentes (book-architect, chapter-writer, continuity-editor, cover-designer, marketing-expert, scene-generator, style-doctor)
- Esquema de capítulos, tabla de borradores y kanban de edición en 5 etapas
- Estado de archivos de salida (EPUB/PDF/MOBI/TXT/MD) con lista de verificación de publicación
- Configuración del proyecto y referencia de comandos

El panel lee dinámicamente desde archivos `status.json` por proyecto. El `dist/` precompilado está incluido — no se requiere paso de compilación para usuarios del plugin.

Para ejecutar localmente en desarrollo:

```bash
cd dashboard
npm install
npm run dev     # http://localhost:5173
npm run build   # reconstruir dist/
```

## Principios de Diseño

- **Planificar Antes de Ejecutar** — Primero el esquema, validar, luego escribir
- **Idempotente** — Omite capítulos completados, reanuda donde lo dejaste
- **Eficiente en Tokens** — Contexto basado en resúmenes, no en texto completo
- **Consciente del Género** — Diferentes estructuras, plantillas y validación por género
- **Control de Calidad** — Cada fase debe superar los criterios antes de continuar

## Dependencias Externas

Para salida EPUB/PDF (Phase 5):

```bash
brew install pandoc        # Conversión EPUB/PDF
brew install texlive       # PDF con soporte CJK/coreano
brew install --cask calibre  # Conversión MOBI (Kindle) — opcional
```

### Solución de Problemas

<details>
<summary>pandoc no encontrado</summary>

Instalar via Homebrew:
```bash
brew install pandoc
```
</details>

<details>
<summary>Caracteres CJK/PDF faltantes o corruptos</summary>

Instalar una distribución LaTeX compatible con CJK:
```bash
brew install texlive
# O para instalación mínima:
brew install basictex && sudo tlmgr install collection-langkorean
```
</details>

<details>
<summary>Comandos del plugin no encontrados tras la instalación</summary>

Reiniciar Claude Code para recargar los plugins:
```bash
claude restart
```
</details>

## Estructura del Proyecto

Al crear un proyecto de libro, Velith configura:

```
{project-dir}/
├── PRD.md          # Requisitos del libro
├── STYLE.md        # Voz, tono, convenciones
├── ideation.md     # Ideas, investigación de mercado
├── outline.md      # Esquema completo de capítulos
├── drafts/         # Borradores de capítulos
│   ├── ch00-foreword.md
│   ├── ch01-xxx.md
│   └── ...
├── edits/          # Informes de edición
│   └── editorial-report.md
├── publish/        # Archivos finales
│   ├── book.epub
│   ├── book.pdf
│   ├── book.mobi
│   └── metadata.yaml
└── sources/        # Referencias de material fuente
```

## Integración

### Flujos de trabajo de agentes integrados

Sin configuración adicional — se ejecutan automáticamente durante el proceso:

- **discover** — Durante `/book-outline`, `book-architect` explora puntos ciegos y contradicciones en el concepto del libro antes de fijar la estructura
- **council** — Durante `/book-outline` y `/book-edit`, incorpora múltiples perspectivas editoriales (desarrollo, estructura, edición de línea) en las decisiones de esquema y revisión

### alcove — Tu bóveda de investigación como material fuente

[alcove](https://github.com/epicsagas/alcove) es un servidor de documentos privados que permite a los agentes de Velith consultar tus notas existentes, investigación y documentos de proyecto como material fuente durante la redacción.

**Cuándo es útil:**
- Tienes años de notas de investigación, transcripciones de entrevistas o documentos de referencia que quieres que el agente cite
- Estás escribiendo no ficción y necesitas que los agentes extraigan hechos de documentación de proyecto estructurada
- Mantienes una base de conocimientos con glosarios, líneas temporales o detalles de construcción del mundo que el agente debe respetar

**Cómo usarlo:**
1. Instala y configura alcove como servidor MCP en tu configuración de Claude Code
2. Durante `/book-init`, señala tu proyecto alcove como fuente
3. Los agentes consultarán alcove automáticamente al redactar capítulos que referencien tu investigación

### obsidian-forge — De pensar a escribir

[obsidian-forge](https://github.com/epicsagas/obsidian-forge) conecta tu vault de Obsidian con Velith, para que puedas investigar en Obsidian y escribir con Velith sin copiar archivos manualmente.

**Cuándo es útil:**
- Tus investigaciones, perfiles de personajes y notas de referencia ya están en un vault de Obsidian
- Quieres iterar esquemas en el entorno de notas enlazadas de Obsidian antes de pasarlo a Velith
- Colaboras con coautores que prefieren Obsidian para lluvia de ideas

**Cómo usarlo:**

```bash
# Crear un proyecto de libro dentro de tu vault de Obsidian (01-Projects/)
of book init my-book --genre non-fiction --lang ko

# Trabajar en Obsidian: notas de investigación, perfiles de personajes, referencias
# Etiquetar notas con book/my-book para vincularlas como material fuente
of book sync my-book

# Exportar a un directorio independiente cuando estés listo para escribir
of book export my-book --output ~/projects/my-book

# Ahora ejecutar velith en el proyecto exportado
> /loom
```

Tanto alcove como obsidian-forge son **opcionales** — Velith funciona de forma independiente.

## Contribución

Ver [CONTRIBUTING.md](../../CONTRIBUTING.md). Se aceptan PRs — consulta los issues etiquetados como `good first issue`.

## Licencia

[Apache-2.0](../../LICENSE)
