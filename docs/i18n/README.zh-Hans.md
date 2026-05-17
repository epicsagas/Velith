<!-- Translated from README.md @ commit 3d6a2f0 (2026-05-16) -->
<!-- The English version is the authoritative source and may be more up-to-date. -->

<div align="center">

# Velith

<p>
  <a href="https://github.com/epicsagas/book-forge/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/epicsagas/book-forge?style=for-the-badge&labelColor=0d1117&color=ffd700&logo=github&logoColor=white" /></a>
  <a href="https://github.com/epicsagas/book-forge/network/members"><img alt="Forks" src="https://img.shields.io/github/forks/epicsagas/book-forge?style=for-the-badge&labelColor=0d1117&color=2ecc71&logo=github&logoColor=white" /></a>
  <a href="https://github.com/epicsagas/book-forge/issues"><img alt="Issues" src="https://img.shields.io/github/issues/epicsagas/book-forge?style=for-the-badge&labelColor=0d1117&color=ff6b6b&logo=github&logoColor=white" /></a>
  <a href="https://github.com/epicsagas/book-forge/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/epicsagas/book-forge?style=for-the-badge&labelColor=0d1117&color=58a6ff&logo=git&logoColor=white" /></a>
</p>
<p>
  <a href=".claude-plugin/plugin.json"><img alt="Version" src="https://img.shields.io/badge/version-0.1.0-fc8d62?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="../../LICENSE"><img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-3fb950?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://claude.ai/code"><img alt="Claude Code" src="https://img.shields.io/badge/Claude_Code-plugin-bc8cff?style=for-the-badge&labelColor=0d1117" /></a>
  <a href="https://buymeacoffee.com/epicsaga"><img alt="Buy Me a Coffee" src="https://img.shields.io/badge/buy_me_a_coffee-FFDD00?style=for-the-badge&labelColor=0d1117&logo=buymeacoffee&logoColor=black" /></a>
</p>
<p>
  <img alt="7 Agents" src="https://img.shields.io/badge/7_agents-architect_%7C_writer_%7C_scene_%7C_continuity_%7C_style_%7C_cover_%7C_marketing-e67e22?style=for-the-badge&labelColor=0d1117" />
</p>
<p>
  <img alt="6 Phases" src="https://img.shields.io/badge/6_phases-onboard_%E2%86%92_ideate_%E2%86%92_outline_%E2%86%92_draft_%E2%86%92_edit_%E2%86%92_publish-9b59b6?style=for-the-badge&labelColor=0d1117" />
</p>
<p>
  <img alt="EPUB" src="https://img.shields.io/badge/output-EPUB-3498db?style=for-the-badge&labelColor=0d1117" />
  <img alt="PDF" src="https://img.shields.io/badge/output-PDF-3498db?style=for-the-badge&labelColor=0d1117" />
  <img alt="MOBI" src="https://img.shields.io/badge/output-MOBI-3498db?style=for-the-badge&labelColor=0d1117" />
  <img alt="TXT" src="https://img.shields.io/badge/output-TXT-3498db?style=for-the-badge&labelColor=0d1117" />
  <img alt="Markdown" src="https://img.shields.io/badge/output-Markdown-3498db?style=for-the-badge&labelColor=0d1117" />
</p>
<p>
  <img alt="Fiction" src="https://img.shields.io/badge/genre-Fiction-d73a49?style=for-the-badge&labelColor=0d1117" />
  <img alt="Non-Fiction" src="https://img.shields.io/badge/genre-Non--Fiction-d73a49?style=for-the-badge&labelColor=0d1117" />
  <img alt="Technical" src="https://img.shields.io/badge/genre-Technical-d73a49?style=for-the-badge&labelColor=0d1117" />
  <img alt="Screenplay" src="https://img.shields.io/badge/genre-Screenplay-d73a49?style=for-the-badge&labelColor=0d1117" />
  <img alt="Poetry" src="https://img.shields.io/badge/genre-Poetry-d73a49?style=for-the-badge&labelColor=0d1117" />
  <img alt="Game" src="https://img.shields.io/badge/genre-Game-d73a49?style=for-the-badge&labelColor=0d1117" />
  <img alt="Academic" src="https://img.shields.io/badge/genre-Academic-d73a49?style=for-the-badge&labelColor=0d1117" />
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

面向 Claude Code 的端到端图书创作工具包。从空白页经过 6 个阶段到完成的 EPUB/PDF。

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## 为什么选择 Velith？

使用原始 LLM 提示写书会导致章节脱节、文体不一致、缺乏结构。Velith 提供**先计划后执行的流水线** — 写作前验证，每个阶段把控质量，在整个手稿中保持连贯性。

| | 功能 | 重要原因 |
|--|------|----------|
| 📋 | 6阶段流水线 | 每个阶段验证后再推进 — 无需返工 |
| 📖 | 7种体裁模板 | 小说、非虚构、技术书、剧本、诗歌、游戏脚本、学术（+ genre-creator自定义） |
| 🤖 | 7个专业智能体 | 架构、起草、场景生成、连贯性、文体、封面、营销 |
| ✏️ | 5阶段编辑 | 评估 → 内容编辑 → 行文编辑 → 校对 → 终校 |
| 🔄 | 随时恢复 | 跳过已完成章节，从中断处继续 |
| 📦 | EPUB、PDF、MOBI、TXT、Markdown | 通过 Pandoc + Calibre 生成可出版文件 |

## 对比

| | Velith | 原始提示 | AI 写作工具（Jasper、Sudowrite） |
|--|-----------|-------------|--------------------------------------|
| 结构验证 | 阶段关卡流水线 | 无 | 基础模板 |
| 跨章节连贯性 | 专属智能体 | 手动 | 有限 |
| AI 糟糕内容检测 | 内置（style-doctor） | 无 | 无 |
| 体裁感知 | 7种体裁系统 + 自定义 | 取决于提示 | 以小说为主 |
| 输出格式 | EPUB、PDF、MOBI、TXT、Markdown | 复制粘贴 | DOCX，有限 |
| 所需条件 | Claude Code | 任意 LLM | 订阅 |
| 完全控制 | 提示级别 | 完全 | 黑盒 |

## 安装

```bash
# 添加 epicsagas 市场（如尚未添加）
claude plugin marketplace add epicsagas

# 安装 velith
claude plugin install velith@epicsagas
```

**前提条件:** 已安装并通过身份验证的 [Claude Code](https://claude.ai/code) CLI。

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
| `marketing-expert` | 读者画像、渠道策略、12周上市日历 |

## 可视化仪表盘

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` 在浏览器中打开基于 Svelte 的进度仪表盘:

- 阶段进度条（6个阶段）
- 逐章状态（行数、字数、编辑/草稿/等待）
- 输出文件状态（EPUB/PDF/MOBI/TXT/MD）
- 通过标签支持多项目

仪表盘从 `ui/public/status.json` 读取数据（每次运行 `/book-status --ui` 时由 Claude 生成）。已内置预构建的 `ui/dist/index.html` — 无需构建步骤。

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
