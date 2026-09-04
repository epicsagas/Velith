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

**人間が書いたとしか読めない本を。** 白紙から出版可能なEPUBとPDFまで、6フェーズのパイプラインがすべての章・すべての編集・すべての画像を一つの基準で検証する。このジャンルの本を買って読む初見の読者には、原稿が機械の初稿だと分からない。

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## なぜ Velith なのか

フロンティアモデルは文章を上手に書く。しかし放置すれば、読者に途中で投げられる本ができる。8章あたりで声が変わり、キャラクターは自分の感情を説明するだけになり、存在しない統計が出てきて、あらゆる段落が短い決め台詞で終わり、挿絵は章ごとに画風が変わる。どれもモデルの問題ではない。パイプラインの問題だ。

Velithはそのパイプラインである。次の章を書く前に原稿全体を読み、分量を書く前にサンプル章で声を固定し、保存前にすべての章を批評・改稿し、すべての主張をファクトチェックし、編集中はレポートではなく原稿そのものを直し、完成原稿をターゲット読者の視点でコールドリードし、読者が読み続けると確信できるまで出版を拒否する。画像も同じだ。本につきアートバイブル1冊、どの画像モデルを使ってもそこからコンパイルされたプロンプト、コードでレンダリングされる図表、出荷前の全画像の目視検収。

## 0.5 の変更点

| 以前 (0.4) | 現在 (0.5) |
|--------------|-----------|
| エージェントは章の要約を受け取る | エージェントは原稿全体を読む (フロンティアモデルは1Mトークン、小説は200K以下) |
| 4章を並列で初稿執筆 | 物語ジャンルは順番に。第N章は第N-1章を読んでから書く |
| 章につき1パス | 保存前にドラフト → 引用付きコールド批評 → 改稿 |
| 編集はレポートだけ作っていた | 編集はスナップショットを残して原稿をその場で直す、7ステージ |
| "delve" 系ワードリスト検出 | 2026 AI-tell分類: リズム・構造・感情・対話 + en/ko/ja 語彙テル、`velith.mjs metrics` で測定 |
| ファクトチェックなし | `fact-checker` がクレーム台帳を作り、検証不能な項目は削除 |
| ゲート = ファイルの存在 | ゲート = `beta-reader` の準備判定: 5軸 ≥ 7、1-3章に離脱点なし |
| カバープロンプトのみ | アートバイブル、ルックロック、コードレンダ図表、全バックエンド向けコンパイル済みプロンプト、ビジョンQA、アセット検証 |

| | 機能 | なぜ重要か |
|--|---------|----------------|
| 📏 | 一つの品質基準 | `skills/loom/quality-bar.md`: 5軸ルーブリック、AI-tell分類、コールドリードプロトコル。全エージェントが読む |
| 📋 | 著者チェックポイント付き6フェーズ | コンセプト、目次、ボイスロック、ルックロック、改稿、準備判定。他は無人実行 |
| 📖 | 7ジャンルのクラフトリファレンス + カスタム | フィクション、ノンフィクション、技術、脚本、詩、ゲーム、学術: 構造の選択肢、クラフト、ジャンル別テル、言語ノート |
| 🤖 | 12の専門エージェント | アーキテクト、シーンプランナー、ライター、連続性、ファクトチェッカー、スタイルドクター、ベータリーダー、アートディレクター、フィギュアエンジニア、イラストレーター、カバー、マーケティング |
| ✏️ | 7ステージ編集 | ファクトチェック → 診断 → 再構成 → ライン → 校正 → 校閲 → 準備判定 |
| 🎨 | ビジュアルシステム | アートバイブル、ルックロック、Mermaid/D2/SVG図表、モデル非依存プロンプト、ビジョンQA、印刷/EPUB検査 |
| 📊 | 決定論的メトリクス | 文のリズム、段落の形、章間の反復、テル密度 (en/ko) |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Pandoc + 任意の Calibre、epubcheck、KDP・国内プラットフォームチェックリスト |

## 比較

| | Velith | 素のプロンプト | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| 全巻コンテキスト | 全エージェント・全タスク | 手動 | なし | 限定的 | 該当なし |
| ボイスロック + 批評・改稿ループ | 内蔵 | なし | なし | なし | 手動 |
| クレーム台帳ファクトチェック | 専任エージェント | なし | なし | なし | 手動 |
| シミュレーション読者の準備ゲート | 出版をブロック | なし | なし | なし | なし |
| 本全体の画像一貫性 | アートバイブル + コンパイル済みプロンプト + ビジョンQA | 画像ごとのプロンプト | なし | なし | なし |
| ジャンル対応 | 7クラフトリファレンス + カスタム | プロンプト依存 | なし | フィクション偏重 | なし |
| 出力フォーマット | EPUB, PDF, MOBI, TXT, Markdown | コピペ | Markdown / PDF | DOCX, 限定的 | DOCX, PDF |
| 必要なもの | Claude Code, Codex CLI, Agy, Cursor, Cline, Aider | 任意のLLM | Notionサブスク | サブスク | ライセンス |
| 完全な制御 | プロンプトレベル、Apache-2.0 | 完全 | ブラックボックス | ブラックボックス | 完全 |

## インストール

### Claude Code

```
/plugin marketplace add epicsagas/plugins
/plugin install velith@epicsagas
```

18スキルと12エージェントが即時利用可能。更新は `/plugin update velith@epicsagas`。

**必要要件:** [Claude Code](https://claude.ai/code) CLIのインストールと認証。VelithはClaude 5ファミリー(1Mコンテキスト)向けにチューニング。エージェントはセッションモデルを継承し、各自のeffortレベルを設定する。

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

18スキルと12のカスタムサブエージェント(`.codex-plugin/agents/*.toml`、`agents/*.md`から生成)。Codexが自動検出。更新は `codex plugin update velith@epicsagas`。

**必要要件:** [Codex CLI](https://github.com/openai/codex)のインストールと設定。

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

### Cursor

`.cursor/rules/` のコンテキストルール:

| ルールファイル | ロードタイミング |
|-----------|-------------|
| `velith-pipeline.mdc` | 常時 (フェーズ、ルーター、エージェント、品質基準、チェックポイント) |
| `velith-genres.mdc` | 原稿・目次・PRD編集時 |
| `velith-editing.mdc` | edits・STYLE.md・bible.md の作業時 |

### Cline

リポジトリルートの `.clinerules` プロジェクトレベル指示。

### Aider

`CONVENTIONS.md` の執筆規約、`.aider.conf.yml` で自動ロード。

## クイックスタート

```bash
> /book-init          # ジャンル、読者、言語、ボイスサンプル → PRD.md + STYLE.md
> /loom               # 状態を検出して次フェーズを実行、著者チェックポイントで停止
```

進行の流れ:

1. **オンボーディング** — 読者、約束、分量、そして著者自身の文章サンプルから抽出したボイスフィンガープリント
2. **アイデア創出** — 前提のストレステスト、実際の類書、ランク付けしたコンセプト。著者が選ぶ
3. **アウトライン** — 根拠とともに選ばれた構造、章スペック、図表プラン、バイブル。アーキテクトが採点、著者が承認
4. **ドラフト** — サンプル章のボイスロック。以降は順次・全コンテキスト執筆、章ごとに批評・改稿、バイブル台帳更新、整合性チェック
5. **編集** — ファクトチェック、診断、再構成の書き直し、ライン編集、校正、校閲、続いてシミュレーション読者のコールドリード。PASS または REVISE
6. **出版** — 前後付、EPUB/PDF/MOBI、epubcheck、アートバイブルに基づくカバー、マーケティングプラン、プラットフォームチェックリスト

画像はPhase 2以降いつでも: `/book-visuals plan` (アートバイブル)、`/book-visuals lock` (ルックロック)、以降は章が必要とするときに図表と挿絵。

## スキル

| スキル | フェーズ | 説明 |
|-------|-------|-------------|
| `/loom` | ルーター | 状態検出、次フェーズ実行、ゲート強制 |
| `/book-init` | 0 | 読者、約束、分量、ボイスフィンガープリント、ソース索引 → `PRD.md`, `STYLE.md` |
| `/book-ideation` | 1 | 前提ストレステスト、類書、コンセプト順位、ボイスサンプル |
| `/book-outline` | 2 | 構造、章スペック、図表プラン、バイブル、採点済み検証、承認 |
| `/book-draft` | 3 | ボイスロック、順次ドラフト・批評・改稿、台帳、整合性 |
| `/book-edit` | 4 | 7ステージ: ファクトチェック … 準備判定 |
| `/book-publish` | 5 | 準備ゲート、前後付、フォーマット、epubcheck、カバー、マーケティング、チェックリスト |
| `/book-visuals` | 2-5 | アートバイブル、ルックロック、図表、挿絵、写真、プロンプトコンパイル、ビジョンQA、アセット検査 |
| `/book-illustrate` | 3-5 | `/book-visuals` の挿絵サブセットのエイリアス |
| `/book-status` | — | ターミナルダッシュボード、`--ui` ブラウザダッシュボード、`--metrics` |
| `/book-fiction` … `/book-academic` | — | ジャンルクラフトリファレンス (7) |
| `/book-genre-creator` | — | ジャンル選択とカスタムジャンルスペック |

## エージェント

| エージェント | フェーズ | 役割 |
|-------|-------|-----|
| `book-architect` | 2 | 目次とバイブル。根拠とともに構造を選定、採点済み検証、再構成提案 |
| `scene-generator` | 3 | フィクション章のシーンプラン (目的、転換、サブテキスト、出口)。計画であり散文ではない |
| `chapter-writer` | 3-4 | 全コンテキストで一章。ドラフト、引用付き批評、改稿、台帳更新 |
| `continuity-editor` | 3-4 | 原稿全体の矛盾と反復をバイブルと突き合わせて検査 |
| `fact-checker` | 4 | クレーム台帳。ソースとウェブで検証、検証不能項目の削除、コード実行 |
| `style-doctor` | 4 | 測定してからテル・リズム均一性・ドリフトをその場で書き直す |
| `beta-reader` | 4 | ターゲット読者3人 + 専門家1人のコールドリード。準備判定 |
| `art-director` | 2-5 | アートバイブル、ルックロック、全画像のビジョンQA、コンタクトシートレビュー |
| `figure-engineer` | 3-5 | 図解・チャート・技術図面・地図ベースをコードでレンダ。ラベルは本文と照合検証 |
| `illustrator` | 3-5 | アートバイブルに基づく挿絵。コンパイル済みプロンプト、ツールがあれば生成、ビジョンQA |
| `cover-designer` | 5 | アートバイブルに基づくカバーコンセプト、フォーマット、マーケ変種 |
| `marketing-expert` | 5 | ポジショニング、ペルソナ、チャネル、カレンダー、ローンチチェックリスト |

## 品質基準

すべての執筆・編集・レビューエージェントが `skills/loom/quality-bar.md` を読む。定義されるもの:

- **アンカー付き5軸、1-10点**: 声と文章、構造とペーシング、深さ、具体性と裏付け、読者体験。ボイスロックは第1軸 ≥ 7。準備判定は全軸 ≥ 7、平均 ≥ 7.5、最初の3章に離脱点なし。
- **2026 AI-tell分類**: 今の読者が実際に気づくもの(均一な段落リズム、決め台詞の段落終わり、"not X but Y"、内省の後書き、正確すぎる自己認識、質問に答える対話、出典なき権威、捏造された具体性)とその直し方、英語・韓国語・日本語の語彙リスト。
- **コールドリードプロトコル**: 読書速度で一読、マーク、引用付きで診断、正直に採点、優先順位付け、その後に改稿。
- **ビジュアルルール**: 本につき一つのルック、装飾ではなく目的、テキスト・データはコードで、ルックロック、ビジョンQA、出荷制約。

## CLI

```bash
node velith.mjs scan <dir> [--ui]           # プロジェクト状態、ダッシュボードデータ、準備判定
node velith.mjs metrics <dir|file>          # 文章メトリクス + 章間反復 (JSON)
node velith.mjs snapshot <dir> <label>      # 書き直しステージ前に drafts/ をコピー
node velith.mjs images compile <dir> [id]   # アートバイブル + スペック → Midjourney / gpt-image / SD-FLUX / Imagen / Ideogram プロンプト
node velith.mjs images check <dir>          # 寸法、比率、容量、altテキスト、参照、マニフェストカバレッジ
node velith.mjs images render <dir>         # Mermaid / D2 / Graphviz / SVG / matplotlib → SVG + PNG
```

## ビジュアルダッシュボード

<img src="../../docs/assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` でSvelteダッシュボードを開く: パイプライントラッカー、12エージェントカード、章テーブル、6ステージ編集カンバン、軸別スコア付き準備判定、出力ファイル、設定。事前ビルドの `dist/` を同梱。

```bash
cd dashboard && npm install && npm run dev   # http://localhost:5173
npm run build                                 # dist/ を再ビルド
```

## 外部依存

```bash
brew install pandoc                 # EPUB/PDF (Phase 5に必須)
brew install texlive                # CJK対応PDF
brew install --cask calibre         # MOBI (任意)
brew install epubcheck              # EPUB検証 (任意・推奨)
npm i -g @mermaid-js/mermaid-cli    # Mermaid図表 → SVG (任意)
brew install d2 graphviz librsvg    # D2 / Graphviz図表、SVG → PNG (任意)
```

画像生成はバンドルしない。`illustrator` と `cover-designer` は、セッションに画像ツールがあれば(MCP画像サーバー、Replicate、ローカルStable Diffusion)直接生成し、なければ `visuals/prompts/` にバックエンド別コンパイル済みプロンプトパックを渡す。

<details>
<summary>トラブルシューティング</summary>

- **pandoc not found** — `brew install pandoc`
- **PDFで日本語が文字化け** — `brew install texlive`
- **プラグインコマンドが出ない** — Claude Codeを再起動
- **Phase 4が終わらない** — ゲートは `verdict: PASS` の `edits/readiness-report.md`。`/book-edit 6` を実行
- **章ごとに画像の雰囲気が違う** — ルックロックなし。`/book-visuals plan` の後に `/book-visuals lock`
</details>

## プロジェクト構造

```
{project-dir}/
├── PRD.md              # 要件 + 読者への約束
├── STYLE.md            # ボイスフィンガープリント、ボイスサンプル、ルール、ボイスロック
├── ideation.md         # コンセプト、類書、選択されたコンセプト
├── outline.md          # 章スペック、図表プラン、検証、承認
├── bible.md            # キャラクター/概念、用語規則、タイムライン、章ごとの台帳
├── art-bible.md        # ビジュアルアイデンティティ、フィギュアシステム、ルックロック
├── sources/            # 参考資料 + INDEX.md
├── drafts/             # ch{NN}-{slug}.md, ch{NN}-scenes.md (編集中はその場で改稿)
├── visuals/            # plan, manifest, figures/, illustrations/, photos/, ref/, prompts/
├── edits/              # 00-fact-check … 06-readiness-report, readiness-report.md, editorial-report.md
├── publish/            # book.epub/pdf/…, metadata, 前後付, cover/, marketing, checklists
└── .velith/            # status.json, art-bible.json, critiques/, snapshots/, metrics.json
```

## 統合

- **alcove** — `/book-init` とドラフト中にドキュメントボルトをソース資料として検索。
- **obsidian-forge** — `of book init / sync / export` でObsidianボルトから執筆。
- **humanize-korean** — インストール済みなら `style-doctor` が最終韓国語推敲として実行可能。
- **画像生成MCP** — あれば `illustrator` と `cover-designer` が使用。

すべて任意。Velithは単独で動作する。

## コントリビュート

[CONTRIBUTING.md](../../CONTRIBUTING.md) を参照。プロンプトこそがプロダクトだ。`quality-bar.md` やエージェントファイルの変更はすべての本を変える。`examples/` と `node velith.mjs metrics` でテスト。

## ライセンス

[Apache-2.0](../../LICENSE)
