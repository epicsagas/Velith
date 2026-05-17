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

Claude Code 向けのエンドツーエンド書籍制作ツールキット。白紙から6フェーズで完成した EPUB/PDF まで。

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## なぜ Velith なのか？

生の LLM プロンプトで本を書くと、章がバラバラになり、文体が一貫せず、構造がありません。Velith は**計画してから実行するパイプライン**を提供します — 書く前に検証し、各フェーズで品質を管理し、原稿全体の継続性を維持します。

| | 機能 | 重要な理由 |
|--|------|------------|
| 📋 | 6フェーズ パイプライン | 各フェーズで検証してから次へ — 手戻りなし |
| 📖 | 7ジャンル テンプレート | フィクション、ノンフィクション、技術書、脚本、詩、ゲームシナリオ、学術（+ genre-creatorでカスタム） |
| 🤖 | 7つの専門エージェント | 設計、草稿、シーン生成、継続性、文体、表紙、マーケティング |
| ✏️ | 5段階編集 | 評価 → 開発編集 → ライン編集 → 校閲 → 最終校正 |
| 🔄 | どこからでも再開 | 完了した章をスキップ、中断地点から再開 |
| 📦 | EPUB、PDF、MOBI、TXT、Markdown | Pandoc + Calibre で出版準備済みファイルを生成 |

## 比較

| | Velith | 単純なプロンプト | AI 執筆ツール（Jasper、Sudowrite） |
|--|-----------|-------------|--------------------------------------|
| 構造検証 | フェーズゲート パイプライン | なし | 基本テンプレート |
| 章間継続性 | 専任エージェント | 手動 | 限定的 |
| AI スロップ検出 | 内蔵（style-doctor） | なし | なし |
| ジャンル認識 | 7ジャンルシステム + カスタム | プロンプト次第 | フィクション中心 |
| 出力形式 | EPUB、PDF、MOBI、TXT、Markdown | コピー＆ペースト | DOCX、限定的 |
| 必要条件 | Claude Code | 任意の LLM | サブスクリプション |
| 完全なコントロール | プロンプトレベル | 完全 | ブラックボックス |

## インストール

```bash
# epicsagas マーケットプレイスを追加（まだの場合）
claude plugin marketplace add epicsagas

# velith をインストール
claude plugin install velith@epicsagas
```

**前提条件:** [Claude Code](https://claude.ai/code) CLI がインストール済みで認証されていること。

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
| `marketing-expert` | 読者ペルソナ、チャネル戦略、12週間ローンチカレンダー |

## ビジュアルダッシュボード

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui` はブラウザで Svelte ベースの進捗ダッシュボードを開きます:

- フェーズ進捗バー（6フェーズ）
- 章ごとのステータス（行数、単語数、編集/草稿/待機）
- 出力ファイルのステータス（EPUB/PDF/MOBI/TXT/MD）
- タブによるマルチプロジェクト対応

ダッシュボードは `ui/public/status.json` から読み込みます（`/book-status --ui` 実行ごとに Claude が生成）。ビルド済みの `ui/dist/index.html` が含まれているため、ビルド手順は不要です。

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
