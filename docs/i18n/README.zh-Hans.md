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

**像构建软件一样构建书籍。** 一个多阶段流水线，将长篇知识——书籍、RFC、白皮书、设计文档、技术指南——转化为结构化的产物，而非孤立的提示词。从空白页到可发布的 EPUB/PDF。

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## 为什么选择 Velith？

使用原始 LLM 提示写书会导致章节脱节、文体不一致、缺乏结构。Velith 提供**先计划后执行的流水线** — 写作前验证，每个阶段把控质量，在整个手稿中保持连贯性。

## 基准测试

流水线对非结构化输入的处理效果 — [亲自尝试 →](https://huggingface.co/spaces/epicsaga/Velith)

| 指标 | 原始输入 | Velith 流水线处理后 |
|------|---------|---------------------|
| 结构评分 | 2–4 / 10 | 6–9 / 10 |
| 冗余率 | 20–45% n-gram 重叠 | 合并后 < 10% |
| AI 糟糕内容标记 | 每千词 6–20 个 | 由 style-doctor 检测并删除 |
| 章节层级 | 无 | 检测后添加交叉引用并映射 |
| 连贯性评分 | 0.3–1.5 / 10 | 通过章节重构改善 |

| | 功能 | 重要原因 |
|--|------|----------|
| 📋 | 6阶段流水线 | 每个阶段验证后再推进 — 无需返工 |
| 📖 | 7种体裁模板 | 小说、非虚构、技术书、剧本、诗歌、游戏脚本、学术（+ genre-creator自定义） |
| 🤖 | 8个专业智能体 | 架构、起草、场景生成、连贯性、文体、封面、插图、营销 |
| ✏️ | 5阶段编辑 | 评估 → 内容编辑 → 行文编辑 → 校对 → 终校 |
| 🔄 | 随时恢复 | 跳过已完成章节，从中断处继续 |
| 📦 | EPUB、PDF、MOBI、TXT、Markdown | 通过 Pandoc + Calibre 生成可出版文件 |

## 一个流水线，多种产物

Velith 以图书流水线的形式发布，但同样的 6 个阶段适用于**任何长篇结构化知识**。产出物是 300 页的小说还是 12 页的 RFC 都不重要——先规划后执行的流程、质量关卡和 agent 完全一致。

| 产出物 | 体裁技能 | 典型输出 |
|----------|-------------|----------------|
| 小说 / 故事 | `book-fiction` | EPUB / PDF / MOBI |
| 非虚构图书 | `book-nonfiction` | EPUB / PDF |
| RFC / 设计文档 | `book-technical` | Markdown / PDF |
| 白皮书 / 研究报告 | `book-academic` | PDF（引用） |
| 课程材料 / 教程 | `book-technical` | EPUB / PDF |
| 游戏剧本 / 世界观设定 | `book-game` | Markdown / EPUB |

## 对比

| | Velith | 原始提示 | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| 结构验证 | 阶段关卡流水线 | 无 | 无 | 基础模板 | 手动 |
| 跨章节连贯性 | 专属智能体 | 手动 | 无 | 有限 | 手动 |
| AI 糟糕内容检测 | 内置（style-doctor） | 无 | 无 | 无 | 无 |
| 体裁感知 | 8种体裁系统 + 自定义 | 取决于提示 | 无 | 以小说为主 | 无 |
| 输出格式 | EPUB、PDF、MOBI、TXT、Markdown | 复制粘贴 | Markdown / PDF | DOCX，有限 | DOCX、PDF |
| 质量关卡 | 每个阶段 | 无 | 无 | 无 | 无 |
| 所需条件 | Claude Code、Codex CLI、Grok Build、Agy、Cursor、Cline 或 Aider | 任意 LLM | Notion 订阅 | 订阅 | 许可证 |
| 完全控制 | 提示级别 | 完全 | 黑盒 | 黑盒 | 完全 |

## 安装

### Claude Code

```bash
# 添加 epicsagas 市场（首次）
claude plugin marketplace add epicsagas

# 安装 velith
claude plugin install velith@epicsagas
```

**前提条件:** 已安装并通过身份验证的 [Claude Code](https://claude.ai/code) CLI。

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

**前提条件:** 已安装 [Codex CLI](https://github.com/openai/codex) 并配置 OpenAI API 密钥。

### Grok Build (xAI)

```bash
grok plugin install epicsagas/Velith --trust
```

Grok 会从插件根目录直接读取 `skills/` 和 `agents/`。无需额外配置。

**前提条件:** 已安装并完成认证的 [Grok Build](https://x.ai/cli)。

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

Agy 会自动从仓库根目录发现技能和代理。无需额外配置。

**前提条件:** 已安装并配置 [Agy](https://antigravity.google/docs/cli-install)。

### Cursor

Velith 在 `.cursor/rules/` 中提供上下文规则，使 Cursor 的代理能够完全了解出版流程、体裁模式和编辑标准。在 Cursor 中打开项目时，规则会自动加载。

**前提条件:** 已安装 [Cursor](https://cursor.sh)。

### Cline

Velith 在仓库根目录提供 `.clinerules` 项目级指令。在项目目录中工作时，Cline 会自动读取。

**前提条件:** VS Code 或 JetBrains 中已安装 [Cline](https://github.com/cline/cline) 扩展。

### Aider

Velith 在 `CONVENTIONS.md` 中提供写作规范，通过 `.aider.conf.yml` 自动加载。

```bash
aider  # CONVENTIONS.md 自动加载
```

**前提条件:** 已安装 [Aider](https://aider.chat) 并配置 API 密钥。

## 快速开始

```bash
# 开始新的图书项目
> /book-init

# 自动检测当前阶段并继续
> /loom
```

插件将引导您完成以下流程:
1. **Onboarding** — 体裁、受众、语言、源材料、风格指南
2. **Ideation** — 市场调研、概念提炼、竞争书目
3. **Outlining** — 包含规格、依赖关系、交叉引用的完整章节大纲
4. **Drafting** — 通过并行子智能体逐章生成
5. **Editing** — 5阶段流水线：评估 → 内容编辑 → 行文编辑 → 校对 → 终校
6. **Publishing** — EPUB/PDF/MOBI 转换、元数据、营销计划

## 技能

| 技能 | 阶段 | 描述 |
|------|------|------|
| `/loom` | 路由 | 自动检测阶段并路由 |
| `/book-init` | 0 | 开始新图书项目 — 体裁、受众、风格指南 |
| `/book-ideation` | 1 | 概念生成和验证、竞争分析 |
| `/book-outline` | 2 | 创建章节大纲（含依赖关系） |
| `/book-draft` | 3 | 起草章节（全部/特定/恢复，并行智能体） |
| `/book-edit` | 4 | 5阶段编辑流水线 |
| `/book-publish` | 5 | EPUB/PDF/MOBI转换、封面、营销 |
| `/book-illustrate` | 3-5 | 内页插图 — 场景提取、风格一致的提示词、布局方案 |
| `/book-status` | — | 终端仪表盘 + `--ui` 浏览器仪表盘 |
| `/book-fiction` | — | 小说模式（15节拍、Snowflake、角色设定集） |
| `/book-nonfiction` | — | 非虚构模式（问题解决、证据层级） |
| `/book-technical` | — | 技术书模式（概念梯度、代码、实验） |
| `/book-screenplay` | — | 剧本模式（三幕结构、对话、A/B故事线） |
| `/book-poetry` | — | 诗歌模式（体裁、意象、诗节结构） |
| `/book-game` | — | 游戏脚本模式（任务树、分支、世界观设定集） |
| `/book-academic` | — | 学术模式（IMRAD、文献综述、论证链） |
| `/book-genre-creator` | — | 体裁选择指南及自定义体裁创建向导 |

## 智能体

| 智能体 | 角色 |
|--------|------|
| `book-architect` | 验证结构、为大纲评分、检查节奏 |
| `chapter-writer` | 使用体裁模板生成章节草稿 |
| `continuity-editor` | 跨章节一致性（术语、引用、时间线） |
| `style-doctor` | 文体/语调一致性、AI 糟糕内容检测 |
| `scene-generator` | 使用 GMC+RDD 结构进行场景级分析（仅小说） |
| `cover-designer` | 封面概念 + Midjourney/DALL-E 图像提示 |
| `illustrator` | 内页插图 — 场景提取、风格指南、提示词生成 |
| `marketing-expert` | 读者画像、渠道策略、12周上市日历 |

## 可视化仪表盘

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` 在浏览器中打开基于 Svelte 的进度仪表盘。仪表盘每 5 秒自动刷新:

- 6阶段流水线追踪器（Onboarding → Ideation → Outlining → Drafting → Editing → Publishing）
- 8个智能体状态卡片（book-architect、chapter-writer、continuity-editor、cover-designer、illustrator、marketing-expert、scene-generator、style-doctor）
- 章节大纲、草稿表和5阶段编辑看板
- 输出文件状态（EPUB/PDF/MOBI/TXT/MD）及发布清单
- 项目设置和命令参考

仪表盘从每个项目的 `status.json` 文件动态读取。预构建的 `dist/` 已内置 — 插件用户无需构建步骤。

本地开发环境运行:

```bash
cd dashboard
npm install
npm run dev     # http://localhost:5173
npm run build   # 重新构建 dist/
```

## 设计原则

- **先计划后执行** — 先写大纲，验证后再写作
- **幂等性** — 跳过已完成章节，从中断处恢复
- **Token 高效** — 基于摘要的上下文，而非全文
- **体裁感知** — 每种体裁有不同的结构、模板和验证
- **质量关卡** — 每个阶段必须通过标准才能继续

## 外部依赖

用于 EPUB/PDF 输出（Phase 5）:

```bash
brew install pandoc        # EPUB/PDF 转换
brew install texlive       # 支持 CJK/中文的 PDF
brew install --cask calibre  # MOBI（Kindle）转换 — 可选
```

### 故障排除

<details>
<summary>找不到 pandoc</summary>

通过 Homebrew 安装:
```bash
brew install pandoc
```
</details>

<details>
<summary>CJK/PDF 字符缺失或乱码</summary>

安装支持 CJK 的 LaTeX 发行版:
```bash
brew install texlive
# 或最小安装:
brew install basictex && sudo tlmgr install collection-langkorean
```
</details>

<details>
<summary>安装后找不到插件命令</summary>

重启 Claude Code 以重新加载插件:
```bash
claude restart
```
</details>

## 项目结构

创建图书项目后，Velith 会设置以下结构:

```
{project-dir}/
├── PRD.md          # 图书需求
├── STYLE.md        # 文体、语调、规范
├── ideation.md     # 想法、市场调研
├── outline.md      # 完整章节大纲
├── drafts/         # 章节草稿
│   ├── ch00-foreword.md
│   ├── ch01-xxx.md
│   └── ...
├── edits/          # 编辑报告
│   └── editorial-report.md
├── publish/        # 最终输出文件
│   ├── book.epub
│   ├── book.pdf
│   ├── book.mobi
│   └── metadata.yaml
└── sources/        # 源材料引用
```

## 集成

### 内置智能体工作流

无需额外设置 — 在流程中自动运行：

- **discover** — 在 `/book-outline` 期间由 `book-architect` 在结构确定前探查书籍概念中的盲点和矛盾
- **council** — 在 `/book-outline` 和 `/book-edit` 期间将多种编辑视角（发展性、结构性、逐行编辑）融入提纲和修订决策

### alcove — 将研究库作为源材料

[alcove](https://github.com/epicsagas/alcove) 是一个私有文档服务器，让 Velith 智能体在起草过程中引用您现有的笔记、研究资料和项目文档作为源材料。

**适用于以下场景：**
- 您有多年积累的研究笔记、访谈记录、参考文献，希望智能体从中引用
- 撰写非虚构作品时需要从结构化的项目文档中提取事实
- 维护术语表、时间线、世界观设定等希望智能体遵循的知识库

**使用方法：**
1. 在 Claude Code 设置中将 alcove 安装并配置为 MCP 服务器
2. 在 `/book-init` 中将 alcove 项目指定为来源
3. 起草时智能体会自动查询 alcove 以反映您的研究

### obsidian-forge — 从思考到写作

[obsidian-forge](https://github.com/epicsagas/obsidian-forge) 将 Obsidian 知识库与 Velith 连接，让您在 Obsidian 中研究、用 Velith 写作时无需手动复制文件。

**适用于以下场景：**
- 研究资料、人物档案、参考笔记已存在于 Obsidian 知识库中
- 希望在提交给 Velith 之前，先在 Obsidian 的双向链接环境中反复打磨大纲
- 与偏好使用 Obsidian 进行头脑风暴的合著者协作

**使用方法：**

```bash
# 在 Obsidian 知识库中创建图书项目（01-Projects/）
of book init my-book --genre non-fiction --lang ko

# 在 Obsidian 中工作：研究笔记、人物档案、参考资料
# 用 book/my-book 标签将笔记链接为源材料
of book sync my-book

# 准备好写作时导出到独立目录
of book export my-book --output ~/projects/my-book

# 在导出的项目上运行 velith
> /loom
```

alcove 和 obsidian-forge 都是**可选的** — Velith 可以独立运行。

## 贡献

参见 [CONTRIBUTING.md](../../CONTRIBUTING.md)。欢迎 PR — 查看标有 `good first issue` 的 issue。

## 许可证

[Apache-2.0](../../LICENSE)
