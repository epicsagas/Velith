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
  <a href=".claude-plugin/plugin.json"><img alt="Version" src="https://img.shields.io/badge/version-0.3.0-fc8d62?style=for-the-badge&labelColor=0d1117" /></a>
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

**소프트웨어처럼 책을 만들자.** 구조화된 장폼 창작을 위한 AI 네이티브 출판 시스템 — 백지에서 출판 가능한 EPUB/PDF까지.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## 왜 Velith인가?

날것의 LLM 프롬프트로 책을 쓰면 챕터가 단절되고, 문체가 일관되지 않으며, 구조가 없습니다. Velith는 **계획 후 실행 파이프라인**을 제공합니다 — 쓰기 전에 검증하고, 각 단계에서 품질을 관리하며, 원고 전체의 연속성을 유지합니다.

| | 기능 | 중요한 이유 |
|--|------|-------------|
| 📋 | 6단계 파이프라인 | 각 단계에서 검증 후 진행 — 재작업 없음 |
| 📖 | 7가지 장르 템플릿 | 소설, 논픽션, 기술서, 대본, 시, 게임 시나리오, 학술 (+ genre-creator로 커스텀) |
| 🤖 | 7개 전문 에이전트 | 설계, 초안, 장면 생성, 연속성, 문체, 표지, 마케팅 |
| ✏️ | 5단계 편집 | 평가 → 개발 편집 → 라인 편집 → 교열 → 최종 교정 |
| 🔄 | 어디서든 재개 | 완료된 챕터 건너뜀, 중단 지점에서 재개 |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Pandoc + Calibre로 출판 준비 완료 파일 생성 |

## 비교

| | Velith | 단순 프롬프트 | AI 작성 도구 (Jasper, Sudowrite) |
|--|-----------|-------------|--------------------------------------|
| 구조 검증 | 단계별 관문 파이프라인 | 없음 | 기본 템플릿 |
| 챕터 간 연속성 | 전담 에이전트 | 수동 | 제한적 |
| AI 슬롭 감지 | 내장 (style-doctor) | 없음 | 없음 |
| 장르 인식 | 7가지 장르 시스템 + 커스텀 | 프롬프트에 따라 다름 | 소설 중심 |
| 출력 형식 | EPUB, PDF, MOBI, TXT, Markdown | 복사-붙여넣기 | DOCX, 제한적 |
| 필요 조건 | Claude Code | 모든 LLM | 구독 |
| 완전한 제어 | 프롬프트 수준 | 완전 | 블랙박스 |

## 설치

```bash
# epicsagas 마켓플레이스 추가 (아직 추가하지 않은 경우)
claude plugin marketplace add epicsagas

# velith 설치
claude plugin install velith@epicsagas
```

**사전 요건:** [Claude Code](https://claude.ai/code) CLI가 설치되고 인증되어 있어야 합니다.

## 빠른 시작

```bash
# 새 책 프로젝트 시작
> /book-init

# 현재 단계를 자동 감지하고 계속
> /loom
```

플러그인이 다음 과정을 안내합니다:
1. **Onboarding** — 장르, 독자, 언어, 소스 자료, 스타일 가이드
2. **Ideation** — 시장 조사, 개념 정제, 경쟁 도서
3. **Outlining** — 스펙, 의존성, 상호 참조를 포함한 전체 챕터 개요
4. **Drafting** — 병렬 서브에이전트로 챕터별 생성
5. **Editing** — 5단계 파이프라인: 평가 → 개발 편집 → 라인 편집 → 교열 → 최종 교정
6. **Publishing** — EPUB/PDF/MOBI 변환, 메타데이터, 마케팅 계획

## 스킬

| 스킬 | 단계 | 설명 |
|------|------|------|
| `/loom` | 라우터 | 단계 자동 감지 및 라우팅 |
| `/book-init` | 0 | 새 책 프로젝트 시작 — 장르, 독자, 스타일 가이드 |
| `/book-ideation` | 1 | 개념 생성 및 검증, 경쟁 분석 |
| `/book-outline` | 2 | 챕터 개요 작성 (의존성 포함) |
| `/book-draft` | 3 | 챕터 초안 작성 (전체/특정/재개, 병렬 에이전트) |
| `/book-edit` | 4 | 5단계 편집 파이프라인 |
| `/book-publish` | 5 | EPUB/PDF/MOBI 변환, 표지, 마케팅 |
| `/book-status` | — | 터미널 대시보드 + `--ui` 브라우저 대시보드 |
| `/book-fiction` | — | 소설 패턴 (15비트, Snowflake, 캐릭터 바이블) |
| `/book-nonfiction` | — | 논픽션 패턴 (문제-해결, 근거 계층) |
| `/book-technical` | — | 기술서 패턴 (개념 기울기, 코드, 실습) |
| `/book-screenplay` | — | 대본 패턴 (3막 구조, 대화, A/B 스토리) |
| `/book-poetry` | — | 시 패턴 (형식, 심상, 연 구조) |
| `/book-game` | — | 게임 시나리오 패턴 (퀘스트 트리, 분기, 로어 바이블) |
| `/book-academic` | — | 학술 패턴 (IMRAD, 문헌 고찰, 논증 체인) |
| `/book-genre-creator` | — | 장르 선택 가이드 및 커스텀 장르 생성 위저드 |

## 에이전트

| 에이전트 | 역할 |
|----------|------|
| `book-architect` | 구조 검증, 개요 점수화, 페이싱 확인 |
| `chapter-writer` | 장르 템플릿으로 챕터 초안 생성 |
| `continuity-editor` | 챕터 간 일관성 (용어, 참조, 타임라인) |
| `style-doctor` | 문체/톤 일관성, AI 슬롭 감지 |
| `scene-generator` | GMC+RDD 구조로 장면 분석 (소설 전용) |
| `cover-designer` | 표지 개념 + Midjourney/DALL-E 이미지 프롬프트 |
| `marketing-expert` | 독자 페르소나, 채널 전략, 12주 런치 캘린더 |

## 시각적 대시보드

<img src="../assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui`는 브라우저에서 Svelte 기반 진행 대시보드를 엽니다:

- 단계 진행 바 (6단계)
- 챕터별 상태 (줄 수, 단어 수, 편집/초안/대기)
- 출력 파일 상태 (EPUB/PDF/MOBI/TXT/MD)
- 탭을 통한 다중 프로젝트 지원

대시보드는 `ui/public/status.json`에서 읽습니다 (`/book-status --ui` 실행 시마다 Claude가 생성). 사전 빌드된 `ui/dist/index.html`이 포함되어 있어 빌드 단계가 필요 없습니다.

## 설계 원칙

- **계획 후 실행** — 개요 먼저, 검증 후 작성
- **멱등성** — 완료된 챕터 건너뜀, 중단 지점에서 재개
- **토큰 효율** — 전체 텍스트가 아닌 요약 기반 컨텍스트
- **장르 인식** — 장르별 다른 구조, 템플릿, 검증
- **품질 관문** — 각 단계는 기준을 통과해야 다음으로 진행

## 외부 의존성

EPUB/PDF 출력 (Phase 5):

```bash
brew install pandoc        # EPUB/PDF 변환
brew install texlive       # CJK/한국어 지원 PDF
brew install --cask calibre  # MOBI (Kindle) 변환 — 선택 사항
```

### 문제 해결

<details>
<summary>pandoc을 찾을 수 없음</summary>

Homebrew로 설치:
```bash
brew install pandoc
```
</details>

<details>
<summary>CJK/PDF 문자가 깨지거나 없음</summary>

CJK를 지원하는 LaTeX 배포판 설치:
```bash
brew install texlive
# 또는 최소 설치:
brew install basictex && sudo tlmgr install collection-langkorean
```
</details>

<details>
<summary>설치 후 플러그인 명령어를 찾을 수 없음</summary>

플러그인을 다시 로드하려면 Claude Code를 재시작:
```bash
claude restart
```
</details>

## 프로젝트 구조

책 프로젝트를 생성하면 Velith가 다음을 설정합니다:

```
{project-dir}/
├── PRD.md          # 책 요구사항
├── STYLE.md        # 문체, 톤, 규칙
├── ideation.md     # 아이디어, 시장 조사
├── outline.md      # 전체 챕터 개요
├── drafts/         # 챕터 초안
│   ├── ch00-foreword.md
│   ├── ch01-xxx.md
│   └── ...
├── edits/          # 편집 보고서
│   └── editorial-report.md
├── publish/        # 최종 출력물
│   ├── book.epub
│   ├── book.pdf
│   ├── book.mobi
│   └── metadata.yaml
└── sources/        # 소스 자료 참조
```

## 통합

### 내장 에이전트 워크플로

별도 설정 없이 파이프라인에서 자동으로 실행됩니다:

- **discover** — `/book-outline` 중 `book-architect`가 구조 확정 전 책 개념의 맹점과 모순을 탐색
- **council** — `/book-outline` 및 `/book-edit` 중 개발 편집·구조·문장 교정 등 다양한 편집 관점을 목차·수정 결정에 반영

### alcove — 리서치 볼트를 소스 자료로 활용

[alcove](https://github.com/epicsagas/alcove)는 프라이빗 문서 서버로, Velith 에이전트가 집필 중 기존 노트, 연구 자료, 프로젝트 문서를 소스 자료로 참조할 수 있게 합니다.

**이럴 때 유용합니다:**
- 수년간 모은 연구 노트, 인터뷰 녹취록, 참고 문헌에서 에이전트가 인용하게 하고 싶을 때
- 논픽션을 집필하며 구조화된 프로젝트 문서에서 사실을 끌어와야 할 때
- 용어집, 타임라인, 세계관 설정 등 에이전트가 존중해야 할 지식 베이스를 유지할 때

**사용 방법:**
1. Claude Code 설정에 alcove를 MCP 서버로 설치 및 구성
2. `/book-init`에서 alcove 프로젝트를 소스로 지정
3. 초안 작성 시 에이전트가 자동으로 alcove를 쿼리하여 리서치를 반영

### obsidian-forge — 생각하는 곳에서 집필까지

[obsidian-forge](https://github.com/epicsagas/obsidian-forge)는 Obsidian 볼트와 Velith를 연결하여, Obsidian에서 리서크하고 Velith로 집필할 때 파일을 수동으로 복사할 필요가 없습니다.

**이럴 때 유용합니다:**
- 연구 자료, 캐릭터 프로필, 참고 노트가 이미 Obsidian 볼트에 있을 때
- Velith에 넘기기 전에 Obsidian의 링크 노트 환경에서 개요를 반복 다듬고 싶을 때
- 브레인스토밍에 Obsidian을 선호하는 공동 저자와 협업할 때

**사용 방법:**

```bash
# Obsidian 볼트 내에 책 프로젝트 생성 (01-Projects/)
of book init my-book --genre non-fiction --lang ko

# Obsidian에서 작업: 연구 노트, 캐릭터 프로필, 참고 자료
# book/my-book 태그로 소스 자료 연결
of book sync my-book

# 작성 준비가 되면 독립 디렉토리로 내보내기
of book export my-book --output ~/projects/my-book

# 내보낸 프로젝트에서 velith 실행
> /loom
```

alcove와 obsidian-forge 모두 **선택 사항**입니다 — Velith는 독립적으로 작동합니다.

## 기여

[CONTRIBUTING.md](../../CONTRIBUTING.md)를 참조하세요. PR 환영합니다 — `good first issue` 레이블이 붙은 이슈를 확인하세요.

## 라이선스

[Apache-2.0](../../LICENSE)
