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

**사람이 쓴 수준의 책.** 백지에서 출판 가능한 EPUB과 PDF까지, 여섯 단계 파이프라인이 모든 장·모든 편집·모든 이미지를 하나의 기준으로 검증한다. 이 장르의 책을 사서 읽는 처음 보는 독자는 원고가 기계 초안임을 알아채지 못한다.

`Phase 0: Onboarding → Phase 1: Ideation → Phase 2: Outlining → Phase 3: Drafting → Phase 4: Editing → Phase 5: Publishing`

</div>

<img src="../../docs/assets/features.png" width="100%" alt="Features of Velith" />

## 왜 Velith인가?

프론티어 모델은 문장을 잘 쓴다. 그러나 방치하면 독자가 덮는 책이 나온다. 8장쯤 가면 목소리가 달라지고, 캐릭터는 자기 감정을 설명만 하고, 존재하지 않는 통계가 나오고, 모든 문단이 짧은 명대사로 끝나고, 삽화는 챕터마다 화풍이 바뀐다. 어느 하나도 모델의 문제가 아니다. 파이프라인의 문제다.

Velith는 그 파이프라인이다. 다음 장을 쓰기 전에 원고 전체를 읽고, 분량을 쓰기 전에 샘플 챕터로 목소리를 고정하고, 저장 전에 모든 장을 비평하고 수정하고, 모든 주장을 팩트체크하고, 편집 중에 보고서 대신 원고를 고치고, 완성본을 타깃 독자 시점으로 콜드리드 하고, 독자가 계속 읽을 것이라 확신하기 전까지는 출판을 거부한다. 이미지도 같다. 책당 아트 바이블 하나, 어느 이미지 모델을 쓰든 그것에서 컴파일된 프롬프트, 코드로 렌더링되는 다이어그램, 출하 전 모든 그림의 육안 검수.

## 0.5의 변경점

| 이전 (0.4) | 지금 (0.5) |
|--------------|-----------|
| 에이전트가 챕터 요약을 수신 | 에이전트가 원고 전체를 읽음 (프론티어 모델은 1M 토큰, 소설은 200K 이하) |
| 챕터 4개 병렬 초안 | 서사 장르는 순서대로. N장은 N-1장을 읽고 쓴다 |
| 챕터당 1회 통과 | 저장 전 초안 → 인용문 있는 콜드 비평 → 수정 |
| 편집이 보고서를 산출 | 편집이 스냅샷을 남기고 원고를 제자리에 고침, 7단계 |
| "delve" 단어 목록 탐지 | 2026 AI-텔 분류: 리듬·구조·감정·대화 + en/ko/ja 어휘 텔, `velith.mjs metrics`로 측정 |
| 팩트체크 없음 | `fact-checker`가 클레임 원장을 만들고 검증 불가 항목은 삭제 |
| 게이트 = 파일 존재 | 게이트 = `beta-reader` 준비도 판정: 5축 ≥ 7, 1-3장 이탈 지점 없음 |
| 커버 프롬프트만 | 아트 바이블, 룩 락, 코드 렌더 피겨, 모든 백엔드용 컴파일 프롬프트, 비전 QA, 자산 검증 |

| | 기능 | 왜 중요한가 |
|--|---------|----------------|
| 📏 | 하나의 품질 기준 | `skills/loom/quality-bar.md`: 5축 루브릭, AI-텔 분류, 콜드리드 프로토콜. 모든 에이전트가 읽음 |
| 📋 | 저자 체크포인트가 있는 6단계 파이프라인 | 컨셉, 목차, 보이스 락, 룩 락, 개고, 준비도. 나머지는 무인 실행 |
| 📖 | 7개 장르 크래프트 레퍼런스 + 커스텀 | 픽션, 비소설, 기술, 시나리오, 시, 게임, 학술: 구조 선택지, 크래프트, 장르별 텔, 언어 노트 |
| 🤖 | 12개 전문 에이전트 | 아키텍트, 씬 플래너, 작가, 연속성, 팩트체커, 스타일 닥터, 베타 리더, 아트 디렉터, 피겨 엔지니어, 일러스트레이터, 커버, 마케팅 |
| ✏️ | 7단계 편집 | 팩트체크 → 진단 → 개고 → 라인 → 교정 → 교열 → 준비도 |
| 🎨 | 비주얼 시스템 | 아트 바이블, 룩 락, Mermaid/D2/SVG 피겨, 모델 무관 프롬프트, 비전 QA, 인쇄/EPUB 검사 |
| 📊 | 결정론적 메트릭 | 문장 리듬, 문단 형태, 장 간 반복, 텔 밀도 (en/ko) |
| 📦 | EPUB, PDF, MOBI, TXT, Markdown | Pandoc + 선택적 Calibre, epubcheck, KDP·국내 플랫폼 체크리스트 |

## 비교

| | Velith | 원시 프롬프트 | Notion AI | Jasper / Sudowrite | Scrivener |
|--|-----------|-------------|-----------|-------------------|-----------|
| 전권 컨텍스트 | 모든 에이전트, 모든 작업 | 수동 | 없음 | 제한적 | 해당 없음 |
| 보이스 락 + 비평-수정 루프 | 내장 | 없음 | 없음 | 없음 | 수동 |
| 클레임 원장 팩트체크 | 전담 에이전트 | 없음 | 없음 | 없음 | 수동 |
| 시뮬레이션 독자 준비도 게이트 | 출판 차단 | 없음 | 없음 | 없음 | 없음 |
| 책 전체 이미지 일관성 | 아트 바이블 + 컴파일 프롬프트 + 비전 QA | 이미지마다 프롬프트 | 없음 | 없음 | 없음 |
| 장르 인식 | 7개 크래프트 레퍼런스 + 커스텀 | 프롬프트 의존 | 없음 | 픽션 편중 | 없음 |
| 출력 포맷 | EPUB, PDF, MOBI, TXT, Markdown | 복사-붙여넣기 | Markdown / PDF | DOCX, 제한적 | DOCX, PDF |
| 필요 것 | Claude Code, Codex CLI, Agy, Cursor, Cline 또는 Aider | 아무 LLM | Notion 구독 | 구독 | 라이선스 |
| 완전한 제어 | 프롬프트 수준, Apache-2.0 | 완전 | 블랙박스 | 블랙박스 | 완전 |

## 설치

### Claude Code

```
/plugin marketplace add epicsagas/plugins
/plugin install velith@epicsagas
```

18개 스킬과 12개 에이전트가 즉시 사용 가능. 업데이트는 `/plugin update velith@epicsagas`.

**필요 것:** [Claude Code](https://claude.ai/code) CLI 설치 및 인증. Velith는 Claude 5 계열(1M 컨텍스트)에 맞춰 튜닝됨. 에이전트는 세션 모델을 상속하고 자체 effort 레벨을 설정.

### Codex CLI (OpenAI)

```bash
codex plugin marketplace add epicsagas/plugins
```

18개 스킬과 12개 커스텀 서브에이전트(`.codex-plugin/agents/*.toml`, `agents/*.md`에서 생성). Codex가 자동 발견. 업데이트는 `codex plugin update velith@epicsagas`.

**필요 것:** [Codex CLI](https://github.com/openai/codex) 설치 및 구성.

### Agy (Antigravity)

```bash
agy plugin install https://github.com/epicsagas/Velith
```

### Cursor

`.cursor/rules/`의 컨텍스트 규칙:

| 규칙 파일 | 로드 시점 |
|-----------|-------------|
| `velith-pipeline.mdc` | 항상 (단계, 라우터, 에이전트, 품질 기준, 체크포인트) |
| `velith-genres.mdc` | 초안·목차·PRD 편집 시 |
| `velith-editing.mdc` | edits·STYLE.md·bible.md 작업 시 |

### Cline

저장소 루트의 `.clinerules` 프로젝트 수준 지침.

### Aider

`CONVENTIONS.md`의 집필 컨벤션, `.aider.conf.yml`로 자동 로드.

## 빠른 시작

```bash
> /book-init          # 장르, 독자, 언어, 보이스 샘플 → PRD.md + STYLE.md
> /loom               # 상태 감지 후 다음 단계 실행, 저자 체크포인트에서 정지
```

진행 과정:

1. **온보딩** — 독자, 약속, 분량, 그리고 저자 본인 글 샘플에서 추출한 보이스 핑거프린트
2. **아이데이션** — 전제 스트레스 테스트, 실제 비교 도서, 순위 매긴 컨셉. 저자가 선택
3. **아웃라이닝** — 근거와 함께 선택된 구조, 챕터 스펙, 피겨 플랜, 바이블. 아키텍트 채점, 저자 승인
4. **드래프팅** — 샘플 챕터 보이스 락. 이후 순차적 풀컨텍스트 집필, 장마다 비평·수정, 바이블 원장 갱신, 연속성 검사
5. **편집** — 팩트체크, 진단, 개고 재작성, 라인 편집, 교정, 교열, 이어서 시뮬레이션 독자의 콜드리드. PASS 또는 REVISE
6. **출판** — 전후부, EPUB/PDF/MOBI, epubcheck, 아트 바이블 기반 커버, 마케팅 플랜, 플랫폼 체크리스트

이미지는 Phase 2부터 언제든: `/book-visuals plan` (아트 바이블), `/book-visuals lock` (룩 락), 이후 챕터가 필요로 할 때 피겨와 삽화.

## 스킬

| 스킬 | 단계 | 설명 |
|-------|-------|-------------|
| `/loom` | 라우터 | 상태 감지, 다음 단계 실행, 게이트 강제 |
| `/book-init` | 0 | 독자, 약속, 분량, 보이스 핑거프린트, 소스 인덱스 → `PRD.md`, `STYLE.md` |
| `/book-ideation` | 1 | 전제 스트레스 테스트, 비교 도서, 컨셉 순위, 보이스 샘플 |
| `/book-outline` | 2 | 구조, 챕터 스펙, 피겨 플랜, 바이블, 채점된 검증, 승인 |
| `/book-draft` | 3 | 보이스 락, 순차 초안-비평-수정, 원장, 연속성 |
| `/book-edit` | 4 | 7단계: 팩트체크 … 준비도 판정 |
| `/book-publish` | 5 | 준비도 게이트, 전후부, 포맷, epubcheck, 커버, 마케팅, 체크리스트 |
| `/book-visuals` | 2-5 | 아트 바이블, 룩 락, 피겨, 삽화, 사진, 프롬프트 컴파일, 비전 QA, 자산 검사 |
| `/book-illustrate` | 3-5 | `/book-visuals`의 삽화 하위집합 별칭 |
| `/book-status` | — | 터미널 대시보드, `--ui` 브라우저 대시보드, `--metrics` |
| `/book-fiction` … `/book-academic` | — | 장르 크래프트 레퍼런스 (7) |
| `/book-genre-creator` | — | 장르 선택과 커스텀 장르 스펙 |

## 에이전트

| 에이전트 | 단계 | 역할 |
|-------|-------|-----|
| `book-architect` | 2 | 목차와 바이블. 근거와 함께 구조 선택, 채점된 검증, 재구성 제안 |
| `scene-generator` | 3 | 픽션 챕터의 씬 플랜 (목적, 전환, 서브텍스트, 출구). 계획이지 산문이 아님 |
| `chapter-writer` | 3-4 | 풀컨텍스트로 한 장. 초안, 인용문 비평, 수정, 원장 갱신 |
| `continuity-editor` | 3-4 | 원고 전체의 모순과 반복을 바이블 대조 검사 |
| `fact-checker` | 4 | 클레임 원장. 소스와 웹 대조 검증, 검증 불가 항목 삭제, 코드 실행 |
| `style-doctor` | 4 | 측정 후 텔·리듬 균일성·드리프트를 제자리 재작성 |
| `beta-reader` | 4 | 타깃 독자 3인 + 전문가 1인 콜드리드. 준비도 판정 |
| `art-director` | 2-5 | 아트 바이블, 룩 락, 모든 이미지의 비전 QA, 접지 시트 리뷰 |
| `figure-engineer` | 3-5 | 다이어그램·차트·기술 도면·지도 베이스를 코드로 렌더. 라벨은 본문과 대조 검증 |
| `illustrator` | 3-5 | 아트 바이블 기반 삽화. 컴파일 프롬프트, 도구가 있으면 생성, 비전 QA |
| `cover-designer` | 5 | 아트 바이블 기반 커버 컨셉, 포맷, 마케팅 변형 |
| `marketing-expert` | 5 | 포지셔닝, 페르소나, 채널, 캘린더, 런치 체크리스트 |

## 품질 기준

모든 집필·편집·검토 에이전트가 `skills/loom/quality-bar.md`를 읽는다. 정의하는 것:

- **앵커가 있는 5축, 1-10점**: 보이스와 산문, 구조와 페이싱, 깊이, 구체성과 근거, 독자 경험. 보이스 락은 1축 ≥ 7. 준비도는 전 축 ≥ 7, 평균 ≥ 7.5, 첫 3장에 이탈 지점 없음.
- **2026 AI-텔 분류**: 지금 독자가 실제로 알아채는 것(균일한 문단 리듬, 펀치라인 종결, "not X but Y", 성찰 코다, 정확한 자기인식, 답하는 대화, 근거 없는 권위, 조작된 구체성)과 수정법, 영어·한국어·일본어 어휘 목록.
- **콜드리드 프로토콜**: 읽기 속도로 1회 통독, 표시, 인용문과 함께 진단, 정직한 채점, 우선순위, 그다음 수정.
- **비주얼 규칙**: 책당 하나의 룩, 장식이 아닌 목적, 텍스트·데이터가 있으면 코드, 룩 락, 비전 QA, 출하 제약.

## CLI

```bash
node velith.mjs scan <dir> [--ui]           # 프로젝트 상태, 대시보드 데이터, 준비도 판정
node velith.mjs metrics <dir|file>          # 산문 메트릭 + 장 간 반복 (JSON)
node velith.mjs snapshot <dir> <label>      # 재작성 단계 전 drafts/ 복사
node velith.mjs images compile <dir> [id]   # 아트 바이블 + 스펙 → Midjourney / gpt-image / SD-FLUX / Imagen / Ideogram 프롬프트
node velith.mjs images check <dir>          # 치수, 비율, 용량, alt 텍스트, 참조, 매니페스트 커버리지
node velith.mjs images render <dir>         # Mermaid / D2 / Graphviz / SVG / matplotlib → SVG + PNG
```

## 비주얼 대시보드

<img src="../../docs/assets/dashboard.png" width="100%" alt="Dashboard" />

`/book-status --ui`가 Svelte 대시보드를 연다: 파이프라인 트래커, 12개 에이전트 카드, 챕터 테이블, 6단계 편집 칸반, 축별 점수가 있는 준비도 판정, 출력 파일, 설정. 사전 빌드된 `dist/` 포함.

```bash
cd dashboard && npm install && npm run dev   # http://localhost:5173
npm run build                                 # dist/ 재빌드
```

## 외부 의존성

```bash
brew install pandoc                 # EPUB/PDF (Phase 5에 필수)
brew install texlive                # CJK 지원 PDF
brew install --cask calibre         # MOBI (선택)
brew install epubcheck              # EPUB 검증 (선택, 권장)
npm i -g @mermaid-js/mermaid-cli    # Mermaid 피겨 → SVG (선택)
brew install d2 graphviz librsvg    # D2 / Graphviz 피겨, SVG → PNG (선택)
```

이미지 생성은 번들되지 않음. `illustrator`와 `cover-designer`는 세션에 이미지 도구가 있으면(MCP 이미지 서버, Replicate, 로컬 Stable Diffusion) 직접 생성하고, 없으면 `visuals/prompts/`에 백엔드별 컴파일 프롬프트 팩을 건네준다.

<details>
<summary>문제 해결</summary>

- **pandoc not found** — `brew install pandoc`
- **PDF에서 한글 깨짐** — `brew install texlive` 또는 `brew install basictex && sudo tlmgr install collection-langkorean`
- **플러그인 커맨드가 안 보임** — Claude Code 재시작
- **Phase 4가 끝나지 않음** — 게이트는 `verdict: PASS`인 `edits/readiness-report.md`. `/book-edit 6` 실행
- **챕터마다 이미지가 다름** — 룩 락 없음. `/book-visuals plan` 후 `/book-visuals lock` 실행
</details>

## 프로젝트 구조

```
{project-dir}/
├── PRD.md              # 요구사항 + 독자 약속
├── STYLE.md            # 보이스 핑거프린트, 보이스 샘플, 규칙, 보이스 락
├── ideation.md         # 컨셉, 비교 도서, 선택된 컨셉
├── outline.md          # 챕터 스펙, 피겨 플랜, 검증, 승인
├── bible.md            # 캐릭터/개념, 용어 규칙, 타임라인, 장별 원장
├── art-bible.md        # 비주얼 아이덴티티, 피겨 시스템, 룩 락
├── sources/            # 참고 자료 + INDEX.md
├── drafts/             # ch{NN}-{slug}.md, ch{NN}-scenes.md (편집 중 제자리 수정)
├── visuals/            # plan, manifest, figures/, illustrations/, photos/, ref/, prompts/
├── edits/              # 00-fact-check … 06-readiness-report, readiness-report.md, editorial-report.md
├── publish/            # book.epub/pdf/…, metadata, 전후부, cover/, marketing, checklists
└── .velith/            # status.json, art-bible.json, critiques/, snapshots/, metrics.json
```

## 통합

- **alcove** — `/book-init`과 드래프팅에서 문서 볼트를 소스 자료로 검색.
- **obsidian-forge** — `of book init / sync / export`로 Obsidian 볼트에서 집필.
- **humanize-korean** — 설치되어 있으면 `style-doctor`가 최종 한국어 윤문으로 실행 가능.
- **이미지 생성 MCP** — 있으면 `illustrator`와 `cover-designer`가 사용.

전부 선택 사항. Velith는 단독으로 동작.

## 기여

[CONTRIBUTING.md](../../CONTRIBUTING.md) 참고. 프롬프트가 곧 제품이다. `quality-bar.md`나 에이전트 파일의 변경은 모든 책을 바꾼다. `examples/`와 `node velith.mjs metrics`로 테스트.

## 라이선스

[Apache-2.0](../../LICENSE)
