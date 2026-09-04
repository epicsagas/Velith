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

**达到人类写作水准的书。** 从空白页到可出版的 EPUB 与 PDF,六阶段流水线以同一标准检验每一章、每一次编辑、每一张图片:买这个类型书来读的陌生读者,分辨不出稿件出自机器初稿。

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## 为什么选择 Velith

前沿模型擅长写句子。放任不管,产出的是读者会中途放下的书:第八章声音就变了,角色只会解释自己的情绪,出现不存在的统计数据,每个段落都用短金句收尾,插图每章换一种画风。这些没有一个是模型的问题,全是流水线的问题。

Velith 就是那条流水线。写下一章之前先通读全书,写正文之前用样章锁定声音,保存之前对每一章进行批评并修改,核查每一条主张,编辑时直接改稿而不是只交报告,以目标读者的视角冷读成品书,直到确信读者会继续读下去才允许出版。图片同样如此:每本书一份美术圣经,无论用哪个图像模型都从它编译提示词,图表由代码渲染,出厂前每张图都经过目检。

## 0.5 的变化

| 之前 (0.4) | 现在 (0.5) |
|--------------|-----------|
| 智能体收到章节摘要 | 智能体通读全书(前沿模型 1M 上下文,小说不足 200K) |
| 四章并行初稿 | 叙事类按顺序写。第 N 章读完第 N-1 章再动笔 |
| 每章一遍过 | 保存之前:初稿 → 带引文的冷批评 → 修改 |
| 编辑产出报告 | 编辑留下快照、原地改稿,共 7 个阶段 |
| "delve" 词表检测 | 2026 AI 痕迹分类:节奏·结构·情感·对话 + en/ko/ja 词汇痕迹,由 `velith.mjs metrics` 度量 |
| 没有事实核查 | `fact-checker` 建立主张台账,删除无法验证的内容 |
| 门槛 = 文件存在 | 门槛 = `beta-reader` 就绪判定:五轴 ≥ 7,前三章无弃读点 |
| 只有封面提示词 | 美术圣经、风格锁定、代码渲染图表、面向各后端的编译提示词、视觉 QA、资产校验 |

| | 功能 | 为什么重要 |
|--|---------|----------------|
| 📏 | 一份质量标准 | `skills/loom/quality-bar.md`:五轴评分量表、AI 痕迹分类、冷读协议。所有智能体都读它 |
| 📋 | 带作者检查点的六阶段流水线 | 概念、大纲、声音锁定、风格锁定、重构、就绪判定。其余无人值守运行 |
| 📖 | 7 个流派写作参考 + 自定义 | 小说、非虚构、技术、剧本、诗歌、游戏、学术:结构选项、技艺、流派专属痕迹、语言说明 |
| 🤖 | 12 个专业智能体 | 架构师、场景规划、写手、连续性、事实核查、风格医生、试读读者、美术总监、图表工程师、插画师、封面、营销 |
| ✏️ | 7 阶段编辑 | 事实核查 → 评估 → 重构 → 行文 → 校对 → 审校 → 就绪判定 |
| 🎨 | 视觉系统 | 美术圣经、风格锁定、Mermaid/D2/SVG 图表、模型无关提示词、视觉 QA、印刷/EPUB 检查 |
| 📊 | 确定性度量 | 句子节奏、段落形态、跨章重复、痕迹密度 (en/ko) |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Pandoc + 可选 Calibre、epubcheck、KDP 与国内平台清单 |

## 对比

| | Velith | 裸提示词 | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| 全书上下文 | 每个智能体、每项任务 | 手动 | 无 | 有限 | 不适用 |
| 声音锁定 + 批评-修改循环 | 内置 | 无 | 无 | 无 | 手动 |
| 主张台账式事实核查 | 专职智能体 | 无 | 无 | 无 | 手动 |
| 模拟读者的就绪门槛 | 阻止出版 | 无 | 无 | 无 | 无 |
| 全书图像一致性 | 美术圣经 + 编译提示词 + 视觉 QA | 每图各写提示词 | 无 | 无 | 无 |
| 流派认知 | 7 份写作参考 + 自定义 | 依赖提示词 | 无 | 偏小说 | 无 |
| 输出格式 | EPUB, PDF, MOBI, TXT, Markdown | 复制粘贴 | Markdown / PDF | DOCX,有限 | DOCX, PDF |
| 需要 | Claude Code、Codex CLI、Agy、Cursor、Cline 或 Aider | 任意 LLM | Notion 订阅 | 订阅 | 许可证 |
| 完全控制 | 提示词级、Apache-2.0 | 完全 | 黑盒 | 黑盒 | 完全 |

## 安装

### Claude Code

```
/plugin marketplace add epicsagas/plugins
/plugin install velith@epicsagas
```

18 个技能与 12 个智能体立即可用。更新:`/plugin update velith@epicsagas`。

**前提:** 已安装并认证 [Claude Code](https://claude.ai/code) CLI。Velith 针对 Claude 5 系列(1M 上下文)调优;智能体继承会话模型并各自设定 effort 级别。

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

18 个技能与 12 个自定义子智能体(`.codex-plugin/agents/*.toml`,由 `agents/*.md` 生成)。Codex 自动发现。更新:`codex plugin update velith@epicsagas`。

**前提:** 已安装并配置 [Codex CLI](https://github.com/openai/codex)。

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

### Cursor

`.cursor/rules/` 中的上下文规则:

| 规则文件 | 加载时机 |
|-----------|-------------|
| `velith-pipeline.mdc` | 始终(阶段、路由、智能体、质量标准、检查点) |
| `velith-genres.mdc` | 编辑草稿、大纲或 PRD 时 |
| `velith-editing.mdc` | 处理 edits、STYLE.md、bible.md 时 |

### Cline

仓库根目录的 `.clinerules` 项目级指令。

### Aider

`CONVENTIONS.md` 中的写作规范,经 `.aider.conf.yml` 自动加载。

## 快速开始

```bash
> /book-init          # 流派、读者、语言、声音样本 → PRD.md + STYLE.md
> /loom               # 检测状态并运行下一阶段,在作者检查点停下
```

流程:

1. **入门** — 读者、承诺、篇幅,以及从作者本人文样提取的声音指纹
2. **构思** — 前提压力测试、真实对标书目、排序后的概念。由作者选择
3. **大纲** — 带理由选定结构、章节规格、图表计划、圣经。架构师评分,作者批准
4. **起草** — 样章声音锁定;随后顺序全文上下文写作,每章批评并修改,更新圣经台账,连续性检查
5. **编辑** — 事实核查、评估、重构改写、行文编辑、校对、审校,然后由模拟读者冷读。PASS 或 REVISE
6. **出版** — 前后辅文、EPUB/PDF/MOBI、epubcheck、美术圣经驱动的封面、营销计划、平台清单

从 Phase 2 起随时可用图片:`/book-visuals plan`(美术圣经)、`/book-visuals lock`(风格锁定),之后按章节需要出图表与插图。

## 技能

| 技能 | 阶段 | 说明 |
|-------|-------|-------------|
| `/loom` | 路由 | 检测状态、运行下一阶段、强制门槛 |
| `/book-init` | 0 | 读者、承诺、篇幅、声音指纹、资料索引 → `PRD.md`, `STYLE.md` |
| `/book-ideation` | 1 | 前提压力测试、对标书、概念排序、声音样本 |
| `/book-outline` | 2 | 结构、章节规格、图表计划、圣经、评分验证、批准 |
| `/book-draft` | 3 | 声音锁定、顺序初稿-批评-修改、台账、连续性 |
| `/book-edit` | 4 | 7 阶段:事实核查 … 就绪判定 |
| `/book-publish` | 5 | 就绪门槛、辅文、格式、epubcheck、封面、营销、清单 |
| `/book-visuals` | 2-5 | 美术圣经、风格锁定、图表、插画、照片、提示词编译、视觉 QA、资产检查 |
| `/book-illustrate` | 3-5 | `/book-visuals` 插画子集的别名 |
| `/book-status` | — | 终端仪表盘、`--ui` 浏览器仪表盘、`--metrics` |
| `/book-fiction` … `/book-academic` | — | 流派写作参考(7) |
| `/book-genre-creator` | — | 流派选择与自定义流派规格 |

## 智能体

| 智能体 | 阶段 | 职责 |
|-------|-------|-----|
| `book-architect` | 2 | 大纲与圣经;带理由选定结构、评分验证、重构提案 |
| `scene-generator` | 3 | 小说章节的场景规划(目的、转折、潜台词、出口)。只做规划,不写正文 |
| `chapter-writer` | 3-4 | 全上下文写一章;初稿、带引文批评、修改、更新台账 |
| `continuity-editor` | 3-4 | 对照圣经检查全书矛盾与重复 |
| `fact-checker` | 4 | 主张台账;对照资料与网络验证;删除无法验证内容;运行代码 |
| `style-doctor` | 4 | 先度量,再原地改写痕迹、节奏均匀性与漂移 |
| `beta-reader` | 4 | 以三名目标读者加一名专业人士冷读;就绪判定 |
| `art-director` | 2-5 | 美术圣经、风格锁定、每张图的视觉 QA、全图一致性评审 |
| `figure-engineer` | 3-5 | 用代码渲染图表、数据图、工程图、地图底图;标签与正文对照验证 |
| `illustrator` | 3-5 | 基于美术圣经的插画;编译提示词,有工具则生成,视觉 QA |
| `cover-designer` | 5 | 基于美术圣经的封面概念、规格、营销变体 |
| `marketing-expert` | 5 | 定位、读者画像、渠道、日历、发布清单 |

## 质量标准

所有写作、编辑、评审智能体都读 `skills/loom/quality-bar.md`。它定义:

- **带锚点的五轴,1-10 分**:声音与文笔、结构与节奏、深度、具体性与依据、读者体验。声音锁定要求第 1 轴 ≥ 7;就绪判定要求每轴 ≥ 7、均值 ≥ 7.5、前三章无弃读点。
- **2026 AI 痕迹分类**:如今的读者真正注意到的东西(均匀的段落节奏、金句收尾、"not X but Y"、反思性尾声、过于精确的自我认知、有问必答的对话、无出处的权威、虚构的具体性)及修改方法,附英语、韩语、日语词汇表。
- **冷读协议**:以阅读速度通读一遍、做标记、带引文诊断、诚实评分、排优先级,然后才修改。
- **视觉规则**:每本书一种风格、先有目的再有装饰、含文字或数据的内容用代码、风格锁定、视觉 QA、出厂约束。

## CLI

```bash
node velith.mjs scan <dir> [--ui]           # 项目状态、仪表盘数据、就绪判定
node velith.mjs metrics <dir|file>          # 文本度量 + 跨章重复 (JSON)
node velith.mjs snapshot <dir> <label>      # 改稿阶段前复制 drafts/
node velith.mjs images compile <dir> [id]   # 美术圣经 + 规格 → Midjourney / gpt-image / SD-FLUX / Imagen / Ideogram 提示词
node velith.mjs images check <dir>          # 尺寸、比例、体积、alt 文本、引用、清单覆盖
node velith.mjs images render <dir>         # Mermaid / D2 / Graphviz / SVG / matplotlib → SVG + PNG
```

## 可视化仪表盘

<img src="../../docs/assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` 打开 Svelte 仪表盘:流水线追踪、12 个智能体卡片、章节表格、6 阶段编辑看板、带各轴分数的就绪判定、输出文件、设置。内置预构建 `dist/`。

```bash
cd dashboard && npm install && npm run dev   # http://localhost:5173
npm run build                                 # 重建 dist/
```

## 外部依赖

```bash
brew install pandoc                 # EPUB/PDF(Phase 5 必需)
brew install texlive                # 支持 CJK 的 PDF
brew install --cask calibre         # MOBI(可选)
brew install epubcheck              # EPUB 校验(可选,推荐)
npm i -g @mermaid-js/mermaid-cli    # Mermaid 图表 → SVG(可选)
brew install d2 graphviz librsvg    # D2 / Graphviz 图表、SVG → PNG(可选)
```

不内置图像生成。会话中存在图像工具时(MCP 图像服务、Replicate、本地 Stable Diffusion),`illustrator` 与 `cover-designer` 直接生成;否则在 `visuals/prompts/` 交付按后端编译的提示词包。

<details>
<summary>故障排查</summary>

- **pandoc not found** — `brew install pandoc`
- **PDF 中文乱码** — `brew install texlive`
- **插件命令不存在** — 重启 Claude Code
- **Phase 4 永远不结束** — 门槛是含 `verdict: PASS` 的 `edits/readiness-report.md`;运行 `/book-edit 6`
- **每章图片风格不一** — 缺少风格锁定;先 `/book-visuals plan` 再 `/book-visuals lock`
</details>

## 项目结构

```
{project-dir}/
├── PRD.md              # 需求 + 读者承诺
├── STYLE.md            # 声音指纹、声音样本、规则、声音锁定
├── ideation.md         # 概念、对标书、选定概念
├── outline.md          # 章节规格、图表计划、验证、批准
├── bible.md            # 角色/概念、术语规则、时间线、逐章台账
├── art-bible.md        # 视觉识别、图表系统、风格锁定
├── sources/            # 参考资料 + INDEX.md
├── drafts/             # ch{NN}-{slug}.md, ch{NN}-scenes.md(编辑期间原地修改)
├── visuals/            # plan, manifest, figures/, illustrations/, photos/, ref/, prompts/
├── edits/              # 00-fact-check … 06-readiness-report, readiness-report.md, editorial-report.md
├── publish/            # book.epub/pdf/…、metadata、前后辅文、cover/、marketing、checklists
└── .velith/            # status.json, art-bible.json, critiques/, snapshots/, metrics.json
```

## 集成

- **alcove** — 在 `/book-init` 与写作期间将文档库作为资料源检索。
- **obsidian-forge** — `of book init / sync / export`,从 Obsidian 库直接写作。
- **humanize-korean** — 如已安装,`style-doctor` 可将其作为韩语最终润色运行。
- **图像生成 MCP** — 存在时由 `illustrator` 与 `cover-designer` 使用。

均为可选。Velith 可独立运行。

## 贡献

参见 [CONTRIBUTING.md](../../CONTRIBUTING.md)。提示词即产品:`quality-bar.md` 或智能体文件的改动会影响每一本书。用 `examples/` 与 `node velith.mjs metrics` 测试。

## 许可证

[Apache-2.0](../../LICENSE)
