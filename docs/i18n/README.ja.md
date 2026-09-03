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
  <a href="../../.claude-plugin/plugin.json"><img alt="Version" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fepicsagas%2FVelith%2Fmain%2F.claude-plugin%2Fplugin.json&query=%24.version&label=version&color=fc8d62&labelColor=0d1117&style=for-the-badge" /></a>
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

**本をソフトウェアのように作る。** 書籍、RFC、ホワイトペーパー、デザインドキュメント、技術ガイドなどの長文ナレッジを、孤立したプロンプトではなく構造化された成果物に変えるマルチフェーズパイプライン。白紙から出版可能な EPUB/PDF まで。

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## なぜ Velith なのか？

生の LLM プロンプトで本を書くと、章がバラバラになり、文体が一貫せず、構造がありません。Velith は**計画してから実行するパイプライン**を提供します — 書く前に検証し、各フェーズで品質を管理し、原稿全体の継続性を維持します。

## ベンチマーク

パイプラインが非構造化入力に何をするか — [自分で試してみる →](https://huggingface.co/spaces/epicsaga/Velith)

| 指標 | 元の入力 | Velithパイプライン適用後 |
|------|----------|--------------------------|
| 構造スコア | 2–4 / 10 | 6–9 / 10 |
| 重複率 | 20–45% n-gram重複 | 統合後 < 10% |
| AI スロップマーカー | 1,000単語あたり6–20個 | style-doctorが検出・除去 |
| 章の階層 | なし | 相互参照付きで検出・マッピング |
| 一貫性スコア | 0.3–1.5 / 10 | セクション再構成で改善 |

| | 機能 | 重要な理由 |
|--|------|------------|
| 📋 | 6フェーズ パイプライン | 各フェーズで検証してから次へ — 手戻りなし |
| 📖 | 7ジャンル テンプレート | フィクション、ノンフィクション、技術書、脚本、詩、ゲームシナリオ、学術（+ genre-creatorでカスタム） |
| 🤖 | 8つの専門エージェント | 設計、草稿、シーン生成、継続性、文体、表紙、挿絵、マーケティング |
| ✏️ | 5段階編集 | 評価 → 開発編集 → ライン編集 → 校閲 → 最終校正 |
| 🔄 | どこからでも再開 | 完了した章をスキップ、中断地点から再開 |
| 📦 | EPUB、PDF、MOBI、TXT、Markdown | Pandoc + Calibre で出版準備済みファイルを生成 |

## 1つのパイプライン、多様な成果物

Velith は書籍パイプラインとして提供されますが、同じ6フェーズは**あらゆる長文の構造化ナレッジ**に適用できます。成果物が300ページの小説でも12ページのRFCでも同じこと — plan-then-execute フロー、品質ゲート、エージェントはすべて同一です。

| 成果物 | ジャンルスキル | 典型的な出力 |
|----------|-------------|----------------|
| 小説 / ストーリー | `book-fiction` | EPUB / PDF / MOBI |
| ノンフィクション | `book-nonfiction` | EPUB / PDF |
| RFC / デザインドキュメント | `book-technical` | Markdown / PDF |
| ホワイトペーパー / 研究報告 | `book-academic` | PDF（引用） |
| コース資料 / チュートリアル | `book-technical` | EPUB / PDF |
| ゲームシナリオ / ロアバイブル | `book-game` | Markdown / EPUB |

## 比較

| | Velith | 単純なプロンプト | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| 構造検証 | フェーズゲート パイプライン | なし | なし | 基本テンプレート | 手動 |
| 章間継続性 | 専任エージェント | 手動 | なし | 限定的 | 手動 |
| AI スロップ検出 | 内蔵（style-doctor） | なし | なし | なし | なし |
| ジャンル認識 | 8ジャンルシステム + カスタム | プロンプト次第 | なし | フィクション中心 | なし |
| 出力形式 | EPUB、PDF、MOBI、TXT、Markdown | コピー＆ペースト | Markdown / PDF | DOCX、限定的 | DOCX、PDF |
| 品質ゲート | 全フェーズ | なし | なし | なし | なし |
| 必要条件 | Claude Code、Codex CLI、Grok Build、Agy、Cursor、Cline、Aider | 任意の LLM | Notionサブスク | サブスクリプション | ライセンス |
| 完全なコントロール | プロンプトレベル | 完全 | ブラックボックス | ブラックボックス | 完全 |

## インストール

### Claude Code

```bash
# epicsagas マーケットプレイスを追加（初回のみ）
claude plugin marketplace add epicsagas

# velith をインストール
claude plugin install velith@epicsagas
```

**前提条件:** [Claude Code](https://claude.ai/code) CLI がインストール済みで認証されていること。

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

**前提条件:** [Codex CLI](https://github.com/openai/codex) がインストールされ、OpenAI API キーが設定されていること。

### Grok Build (xAI)

```bash
grok plugin install epicsagas/Velith --trust
```

Grok はプラグインルートの `skills/` と `agents/` をそのまま読み込みます。追加設定は不要です。

**前提条件:** [Grok Build](https://x.ai/cli) がインストールされ、認証されていること。

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

Agy はリポジトリルートからスキルとエージェントを自動検出します。追加設定は不要です。

**前提条件:** [Agy](https://antigravity.google/docs/cli-install) がインストールされ、設定されていること。

### Cursor

Velith は `.cursor/rules/` にコンテキストルールを提供し、Cursor のエージェントが出版パイプライン、ジャンルパターン、編集基準を完全に把握できるようにします。プロジェクトを Cursor で開くと、ルールが自動的に読み込まれます。

**前提条件:** [Cursor](https://cursor.sh) がインストールされていること。

### Cline

Velith はリポジトリルートに `.clinerules` を提供します。プロジェクトディレクトリで作業すると、Cline が自動的に読み込みます。

**前提条件:** VS Code または JetBrains に [Cline](https://github.com/cline/cline) 拡張機能がインストールされていること。

### Aider

Velith は `CONVENTIONS.md` に執筆規約を提供し、`.aider.conf.yml` で自動ロードされます。

```bash
aider  # CONVENTIONS.md が自動ロードされます
```

**前提条件:** [Aider](https://aider.chat) がインストールされ、API キーが設定されていること。

## クイックスタート

```bash
# 新しい書籍プロジェクトを開始
> /book-init

# 現在のフェーズを自動検出して続行
> /loom
```

プラグインが以下のプロセスを案内します:
1. **Onboarding** — ジャンル、読者、言語、ソース資料、スタイルガイド
2. **Ideation** — 市場調査、コンセプト精製、競合タイトル
3. **Outlining** — スペック、依存関係、相互参照を含む全章アウトライン
4. **Drafting** — 並列サブエージェントによる章ごとの生成
5. **Editing** — 5段階パイプライン: 評価 → 開発編集 → ライン編集 → 校閲 → 最終校正
6. **Publishing** — EPUB/PDF/MOBI 変換、メタデータ、マーケティングプラン

## スキル

| スキル | フェーズ | 説明 |
|--------|----------|------|
| `/loom` | ルーター | フェーズを自動検出してルーティング |
| `/book-init` | 0 | 新しい書籍プロジェクトを開始 — ジャンル、読者、スタイルガイド |
| `/book-ideation` | 1 | コンセプトの生成と検証、競合分析 |
| `/book-outline` | 2 | 章アウトラインの作成（依存関係含む） |
| `/book-draft` | 3 | 章の草稿作成（全体/特定/再開、並列エージェント） |
| `/book-edit` | 4 | 5段階編集パイプライン |
| `/book-publish` | 5 | EPUB/PDF/MOBI変換、表紙、マーケティング |
| `/book-illustrate` | 3-5 | 挿絵 — シーン抽出、スタイル統一プロンプト、配置計画 |
| `/book-status` | — | ターミナルダッシュボード + `--ui` ブラウザダッシュボード |
| `/book-fiction` | — | フィクションパターン（15ビート、Snowflake、キャラクターバイブル） |
| `/book-nonfiction` | — | ノンフィクションパターン（問題解決、証拠階層） |
| `/book-technical` | — | 技術書パターン（概念勾配、コード、ラボ） |
| `/book-screenplay` | — | 脚本パターン（3幕構成、対話、A/Bストーリー） |
| `/book-poetry` | — | 詩パターン（形式、意象、連構造） |
| `/book-game` | — | ゲームシナリオパターン（クエストツリー、分岐、ロアバイブル） |
| `/book-academic` | — | 学術パターン（IMRAD、文献レビュー、論証チェーン） |
| `/book-genre-creator` | — | ジャンル選択ガイド＆カスタムジャンル作成ウィザード |

## エージェント

| エージェント | 役割 |
|-------------|------|
| `book-architect` | 構造検証、アウトラインのスコアリング、ペーシング確認 |
| `chapter-writer` | ジャンルテンプレートで章の草稿を生成 |
| `continuity-editor` | 章間の一貫性（用語、参照、タイムライン） |
| `style-doctor` | 文体/トーンの一貫性、AI スロップ検出 |
| `scene-generator` | GMC+RDD 構造でシーンを分析（フィクション専用） |
| `cover-designer` | 表紙コンセプト + Midjourney/DALL-E 画像プロンプト |
| `illustrator` | 挿絵 — シーン抽出、スタイルバイブル、プロンプト生成 |
| `marketing-expert` | 読者ペルソナ、チャネル戦略、12週間ローンチカレンダー |

## ビジュアルダッシュボード

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` はブラウザで Svelte ベースの進捗ダッシュボードを開きます。ダッシュボードは5秒ごとに自動更新されます:

- 6フェーズパイプライントラッカー（Onboarding → Ideation → Outlining → Drafting → Editing → Publishing）
- 8エージェントステータスカード（book-architect、chapter-writer、continuity-editor、cover-designer、illustrator、marketing-expert、scene-generator、style-doctor）
- 章のアウトライン、草稿テーブル、5段階編集カンバン
- 出力ファイルのステータス（EPUB/PDF/MOBI/TXT/MD）と出版チェックリスト
- プロジェクト設定とコマンドリファレンス

ダッシュボードはプロジェクトごとの `status.json` ファイルから動的に読み込みます。事前ビルド済みの `dist/` が含まれているため、プラグインユーザーにビルド手順は不要です。

ローカル開発環境での実行:

```bash
cd dashboard
npm install
npm run dev     # http://localhost:5173
npm run build   # dist/ を再ビルド
```

## 設計原則

- **計画してから実行** — まずアウトライン、検証してから執筆
- **冪等性** — 完了した章をスキップ、中断地点から再開
- **トークン効率** — 全文ではなく要約ベースのコンテキスト
- **ジャンル認識** — ジャンルごとに異なる構造、テンプレート、検証
- **品質ゲート** — 各フェーズは基準を通過してから次へ進む

## 外部依存関係

EPUB/PDF 出力（Phase 5）:

```bash
brew install pandoc        # EPUB/PDF 変換
brew install texlive       # CJK/日本語対応 PDF
brew install --cask calibre  # MOBI（Kindle）変換 — オプション
```

### トラブルシューティング

<details>
<summary>pandoc が見つからない</summary>

Homebrew でインストール:
```bash
brew install pandoc
```
</details>

<details>
<summary>CJK/PDF 文字が欠けているか文字化けする</summary>

CJK 対応の LaTeX ディストリビューションをインストール:
```bash
brew install texlive
# または最小インストール:
brew install basictex && sudo tlmgr install collection-langkorean
```
</details>

<details>
<summary>インストール後にプラグインコマンドが見つからない</summary>

プラグインをリロードするために Claude Code を再起動:
```bash
claude restart
```
</details>

## プロジェクト構造

書籍プロジェクトを作成すると、Velith が以下をセットアップします:

```
{project-dir}/
├── PRD.md          # 書籍要件
├── STYLE.md        # 文体、トーン、規約
├── ideation.md     # アイデア、市場調査
├── outline.md      # 全章アウトライン
├── drafts/         # 章の草稿
│   ├── ch00-foreword.md
│   ├── ch01-xxx.md
│   └── ...
├── edits/          # 編集レポート
│   └── editorial-report.md
├── publish/        # 最終出力物
│   ├── book.epub
│   ├── book.pdf
│   ├── book.mobi
│   └── metadata.yaml
└── sources/        # ソース資料の参照
```

## 統合

### 内蔵エージェントワークフロー

追加設定不要 — パイプライン中に自動実行されます:

- **discover** — `/book-outline`中に`book-architect`が構造確定前に書籍コンセプトの盲点や矛盾を探査
- **council** — `/book-outline`および`/book-edit`中に、開発編集・構造・行編集など複数の編集視点をアウトライン・改訂決定に反映

### alcove — リサーチボールトをソース素材に

[alcove](https://github.com/epicsagas/alcove) はプライベートドキュメントサーバーで、Velith エージェントが執筆中に既存のノート、リサーチ、プロジェクトドキュメントをソース素材として参照できるようにします。

**こんな時に役立ちます:**
- 何年もかけて蓄積したリサーチノート、インタビュー録、参考文献をエージェントに引用させたい時
- ノンフィクションを執筆中で、構造化されたプロジェクト文書から事実を引き出す必要がある時
- 用語集、タイムライン、世界観設定など、エージェントが尊重すべきナレッジベースを維持している時

**使い方:**
1. Claude Code 設定で alcove を MCP サーバーとしてインストール・設定
2. `/book-init` で alcove プロジェクトをソースとして指定
3. 執筆時にエージェントが自動的に alcove をクエリしてリサーチを反映

### obsidian-forge — 考える場所で執筆へ

[obsidian-forge](https://github.com/epicsagas/obsidian-forge) は Obsidian ボールトと Velith を連携させ、Obsidian でリサーチして Velith で執筆する際にファイルを手動コピーする必要がなくなります。

**こんな時に役立ちます:**
- リサーチ、キャラクタープロフィール、参考ノートがすでに Obsidian ボールトにある時
- Velith に渡す前に、Obsidian のリンクノート環境でアウトラインを反復改良したい時
- ブレインストーミングに Obsidian を好む共著者とコラボレーションする時

**使い方:**

```bash
# Obsidian ボールト内に書籍プロジェクトを作成（01-Projects/）
of book init my-book --genre non-fiction --lang ko

# Obsidian で作業: リサーチノート、キャラクタープロフィール、参考文献
# book/my-book タグでソース資料としてリンク
of book sync my-book

# 執筆準備ができたら独立ディレクトリにエクスポート
of book export my-book --output ~/projects/my-book

# エクスポートされたプロジェクトで velith を実行
> /loom
```

alcove、obsidian-forge ともに**オプション**です — Velith は単独で動作します。

## コントリビューション

[CONTRIBUTING.md](../../CONTRIBUTING.md) を参照してください。PR 歓迎です — `good first issue` ラベルの付いたイシューを確認してください。

## ライセンス

[Apache-2.0](../../LICENSE)
