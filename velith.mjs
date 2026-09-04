// Velith CLI — unified client for book project management
// Usage: node velith.mjs <command> [args]
// Commands: scan, agents, stats, words, list, migrate, metrics, snapshot, images, serve
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, renameSync, createReadStream, cpSync } from 'node:fs';
import http from 'node:http';
import { homedir } from 'node:os';
import { join, basename, resolve, extname } from 'node:path';
import { execSync } from 'node:child_process';
import initSqlJs from './vendor/sql.js/sql-wasm.js';

const HOME = homedir();
const VELITH = join(HOME, '.velith');
const DB_PATH = join(VELITH, 'velith.db');
const IMG_EXTS = /\.(jpg|jpeg|png|webp|gif)$/i;
// Max accepted cover upload size (8 MB). The dashboard renders the cover at
// ~112px; a server-side thumbnail pass (follow-up) will shrink served bytes,
// but the upload gate still caps memory/bandwidth abuse regardless.
const MAX_COVER_BYTES = 8 * 1024 * 1024;
const CJK_LANGS = new Set(['ko', 'ja', 'zh', 'zh-cn', 'zh-tw', 'zh-hans', 'zh-hant']);

// ─── DB Layer ────────────────────────────────────────────────────────────────────

let _db = null;
let _SQL = null;
let _dbMtimeMs = 0;

export async function getDb() {
  if (_db) {
    // Other processes (scan/agents run from other Claude sessions) rewrite the
    // DB file. sql.js is in-memory, so a long-lived serve process must detect
    // the file change and reload, or the dashboard serves a startup snapshot
    // forever no matter how often the browser polls. _SQL is guaranteed
    // initialized here — _db is only set after the factory loads below.
    try {
      const m = statSync(DB_PATH).mtimeMs;
      if (m !== _dbMtimeMs) {
        _db = new _SQL.Database(readFileSync(DB_PATH));
        _dbMtimeMs = m;
      }
    } catch {}
    return _db;
  }
  _SQL = await initSqlJs();
  const SQL = _SQL;
  mkdirSync(VELITH, { recursive: true });
  if (existsSync(DB_PATH)) {
    _db = new SQL.Database(readFileSync(DB_PATH));
    _dbMtimeMs = statSync(DB_PATH).mtimeMs;
    try { _db.run('ALTER TABLE projects ADD COLUMN readiness TEXT'); save(); } catch {}
  } else {
    _db = new SQL.Database();
    _db.run(`CREATE TABLE IF NOT EXISTS projects (
      path TEXT PRIMARY KEY, name TEXT NOT NULL, genre TEXT, language TEXT,
      current_phase INTEGER DEFAULT 0, total_chapters INTEGER DEFAULT 0,
      completed_chapters INTEGER DEFAULT 0, total_words INTEGER DEFAULT 0,
      target_words INTEGER DEFAULT 0, count_unit TEXT DEFAULT 'words',
      phase_status TEXT DEFAULT '[]', output_files TEXT DEFAULT '[]',
      cover_path TEXT, readiness TEXT, last_updated TEXT
    )`);
    _db.run(`CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT, project_path TEXT NOT NULL,
      filename TEXT NOT NULL, title TEXT, lines INTEGER DEFAULT 0,
      words INTEGER DEFAULT 0, status TEXT DEFAULT 'wait', edit_stage TEXT,
      FOREIGN KEY (project_path) REFERENCES projects(path) ON DELETE CASCADE
    )`);
    _db.run(`CREATE TABLE IF NOT EXISTS agents (
      id TEXT NOT NULL, project_path TEXT NOT NULL DEFAULT '', name TEXT, icon TEXT, role TEXT,
      status TEXT DEFAULT 'idle', last_run TEXT, task TEXT,
      PRIMARY KEY (id, project_path)
    )`);
    _db.run(`CREATE TABLE IF NOT EXISTS scan_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT, project_path TEXT NOT NULL,
      scanned_at TEXT NOT NULL, duration_ms INTEGER
    )`);
    save();
  }
  return _db;
}

export function save() {
  if (!_db) return;
  // Atomic write (temp + rename): concurrent readers must never see a
  // half-written DB file — SQL.Database would throw on reload.
  // ponytail: no cross-process write lock; last writer wins. Agent status
  // self-heals from ~/.velith/agents/*.json on next scan, so acceptable
  // until two concurrent scans become routine.
  const tmp = DB_PATH + '.tmp';
  try {
    writeFileSync(tmp, Buffer.from(_db.export()));
    renameSync(tmp, DB_PATH);
    _dbMtimeMs = statSync(DB_PATH).mtimeMs;
  } catch {}
}

export async function getStatus() {
  const db = await getDb();
  const projects = [];
  const pRows = db.exec('SELECT * FROM projects ORDER BY last_updated DESC');
  if (pRows.length) {
    const cols = pRows[0].columns;
    for (const row of pRows[0].values) {
      const p = {};
      cols.forEach((c, i) => p[c] = row[i]);
      p.phase_status = JSON.parse(p.phase_status || '[]');
      p.output_files = JSON.parse(p.output_files || '[]');
      p.readiness = p.readiness ? JSON.parse(p.readiness) : null;
      // chapters
      const cRows = db.exec('SELECT filename, title, lines, words, status, edit_stage FROM chapters WHERE project_path = ? ORDER BY filename', [p.path]);
      p.chapter_details = cRows.length ? cRows[0].values.map(r => ({ filename: r[0], title: r[1], lines: r[2], words: r[3], status: r[4], edit_stage: r[5] })) : [];
      // cover
      if (p.path) {
        const coverDir = join(p.path, 'publish', 'cover');
        try {
          const files = readdirSync(coverDir).filter(f => IMG_EXTS.test(f));
          if (files.length > 0) {
            p.cover_file = files.find(f => /^cover\./i.test(f)) || files[0];
          }
        } catch {}
      }
      projects.push(p);
    }
    // Cover URLs are index-based; assign once the final order is known
    projects.forEach((p, i) => { if (p.cover_file) p.cover_path = `/cover/${i}`; });
  }
  // agents — merge across projects
  const aRows = db.exec('SELECT id, name, icon, role, status, last_run, task FROM agents ORDER BY project_path');
  const agents = [];
  if (aRows.length) {
    const seen = new Map();
    // error and running rank above complete: a stale "complete" from a finished
    // book must not mask an active run or a failure on another project.
    const rank = { error: 4, running: 3, complete: 2, disabled: 1, idle: 0 };
    for (const r of aRows[0].values) {
      const a = { id: r[0], name: r[1], icon: r[2], role: r[3], status: r[4], last_run: r[5], task: r[6] };
      const prev = seen.get(a.id);
      if (!prev || (rank[a.status] || 0) > (rank[prev.status] || 0)) seen.set(a.id, a);
    }
    agents.push(...seen.values());
  }
  // Fallback: if DB empty, try JSON cache
  if (projects.length === 0) {
    const cache = readJson(join(VELITH, 'cache', 'status.json'), null);
    if (cache?.projects?.length) return cache;
  }
  return { generated_at: new Date().toISOString(), agents, projects };
}

function readJson(p, fb) {
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return fb; }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────────

const has = (dir, f) => existsSync(join(dir, f));
// In-process counters (was execSync wc/tr per file — spawned ~3 processes per chapter).
const countLines = (p) => { try { return (readFileSync(p, 'utf8').match(/\n/g) || []).length; } catch { return 0; } };
const countWords = (p) => { try { return readFileSync(p, 'utf8').split(/\s+/).filter(Boolean).length; } catch { return 0; } };
const countChars = (p) => { try { return readFileSync(p, 'utf8').replace(/\s/g, '').length; } catch { return 0; } };
// Parse the YAML frontmatter of edits/readiness-report.md written by beta-reader.
function parseReadiness(fp) {
  if (!existsSync(fp)) return null;
  const fm = (readFileSync(fp, 'utf8').match(/^---\n([\s\S]*?)\n---/) || [])[1];
  if (!fm) return null;
  const get = (k) => (fm.match(new RegExp('^' + k + ':\\s*(.+)$', 'm')) || [])[1]?.trim();
  const verdict = (get('verdict') || '').toUpperCase() || null;
  const score = parseFloat(get('score')) || null;
  const axesRaw = get('axes') || '';
  const axes = {};
  for (const m of axesRaw.matchAll(/(\w+):\s*([\d.]+)/g)) axes[m[1]] = parseFloat(m[2]);
  return { verdict, score, axes, read_at: get('read_at') || null };
}

// ─── auto-migration ─────────────────────────────────────────────────────────────

async function needsMigration() {
  if (existsSync(DB_PATH)) {
    const db = await getDb();
    const rows = db.exec('SELECT COUNT(*) FROM projects');
    if (rows.length && rows[0].values[0][0] > 0) return false;
  }
  const reg = readJson(join(VELITH, 'projects.json'), { projects: [] });
  if (reg.projects.length > 0) return true;
  const cache = readJson(join(VELITH, 'cache', 'status.json'), null);
  if (cache?.projects?.length > 0) return true;
  return false;
}

async function autoMigrate() {
  if (await needsMigration()) {
    console.log('Migrating legacy JSON data to SQLite...');
    await cmdMigrate();
  }
}

// ─── scan ─────────────────────────────────────────────────────────────────────────

async function cmdScan(args) {
  await autoMigrate();
  const start = Date.now();
  const pluginRoot = (args.find(a => a.startsWith('--plugin-root=')) || '').slice('--plugin-root='.length) || null;
  const dir = resolve(args.find(a => !a.startsWith('--')) || process.cwd());
  const ui = args.includes('--ui');

  // PRD parsing
  const prd = has(dir, 'PRD.md') ? readFileSync(join(dir, 'PRD.md'), 'utf8') : '';
  const yamlTitle = (prd.match(/^---\n[\s\S]*?^title:\s*["']?(.+?)["']?\s*$/m) || [])[1]?.trim();
  const yamlGenre = (prd.match(/^---\n[\s\S]*?^genre:\s*(.+)$/m) || [])[1]?.trim().replace(/^\*+\s*/, '');
  const yamlLang = (prd.match(/^---\n[\s\S]*?^language:\s*(.+)$/m) || [])[1]?.trim().replace(/^\*+\s*/, '');
  const meta = {
    title: yamlTitle || (prd.match(/\*\*Title(?: \(working\))?:?\*\*:?\s*(.+)/i) || prd.match(/\*\*제목:\*\*\s*(.+)/) || prd.match(/^#\s*PRD[—:\-\s]+(.+)/im) || [, 'Untitled'])[1]?.trim(),
    genre: (yamlGenre || (prd.match(/\*\*Genre:?\*\*:?\s*(.+)/i) || prd.match(/\*\*장르:\*\*\s*(.+)/) || [, 'unknown'])[1])?.trim().toLowerCase(),
    language: (yamlLang || (prd.match(/\*\*Language:?\*\*:?\s*(.+)/i) || prd.match(/\*\*언어:\*\*\s*(.+)/) || [, 'ko'])[1])?.trim(),
    target_words: (() => {
      const manMatch = prd.match(/(?:분량|target|목표)[^\n]*?(\d+)\s*~?\s*(\d+)\s*만\s*(?:자|글자)/i);
      if (manMatch) return parseInt(manMatch[2]) * 10000;
      const eokMatch = prd.match(/(?:분량|target|목표)[^\n]*?(\d+)\s*~?\s*(\d+)\s*억\s*(?:자|글자)/i);
      if (eokMatch) return parseInt(eokMatch[2]) * 100000000;
      const m = prd.match(/(?:분량|target|목표)[^\n]*?(\d[\d,]+)\s*(?:words|자|글자)/i) || prd.match(/(\d[\d,]+)\s*(?:words|자|글자)/i);
      return parseInt((m || [, '0'])[1]?.replace(/,/g, '')) || 0;
    })(),
  };
  const isCJK = CJK_LANGS.has((meta.language || '').toLowerCase());
  const countFn = isCJK ? countChars : countWords;
  const countUnit = isCJK ? 'chars' : 'words';

  // Drafts
  const draftsDir = (prd.match(/drafts_dir:\s*(\S+)/i) || prd.match(/\*\*초안\s*경로:\*\*\s*(\S+)/) || [, 'drafts'])[1];
  const planned = parseInt((prd.match(/(\d+)\s*(?:chapters|장|챕터)/i) || prd.match(/(?:chapters|챕터)[:*\s]*(\d+)/i) || prd.match(/^chapters:\s*(\d+)/im) || [, '0'])[1]);
  let draftsPath = join(dir, draftsDir);
  if (!existsSync(draftsPath) && draftsDir !== 'drafts') draftsPath = join(dir, 'drafts');
  const drafts = existsSync(draftsPath) ? readdirSync(draftsPath).filter(f => f.endsWith('.md')).sort() : [];

  // Edits
  const editsPath = join(dir, 'edits');
  const editReports = [
    { stage: 'assessment', file: '01-assessment.md' },
    { stage: 'developmental', file: '02-developmental.md' },
    { stage: 'line-edit', file: '03-line-edit.md' },
    { stage: 'copy-edit', file: '04-copy-edit.md' },
    { stage: 'proofread', file: '05-proofread.md' },
    { stage: 'readiness', file: '06-readiness-report.md' },
  ];
  const edits = existsSync(editsPath) ? readdirSync(editsPath).filter(f => f.endsWith('.md')) : [];
  const hasEdits = edits.length > 0;
  const readiness = parseReadiness(join(editsPath, 'readiness-report.md'));
  const editStage = (() => {
    if (!hasEdits) return null;
    let last = null;
    for (const r of editReports) { if (edits.includes(r.file)) last = r.stage; else break; }
    return last;
  })();
  const editStartTime = hasEdits
    ? (() => { const r = editReports.find(r => edits.includes(r.file)); return r ? statSync(join(editsPath, r.file)).mtimeMs : null; })()
    : null;
  const editingComplete = hasEdits && (edits.includes('editorial-report.md') || readiness?.verdict === 'PASS');

  function chapterStatus(fp) {
    if (editingComplete) return 'edit';
    if (!editStartTime) return 'draft';
    try { return statSync(fp).mtimeMs > editStartTime ? 'edit' : 'draft'; } catch { return 'draft'; }
  }

  const chapter_details = drafts.map(f => {
    const fp = join(draftsPath, f);
    return { filename: f, title: basename(f, '.md').replace(/^ch\d+[-_]?/i, '').replace(/[-_]/g, ' '), lines: countLines(fp), words: countFn(fp), status: chapterStatus(fp), edit_stage: editStage };
  });

  // Planned but not drafted
  const outlineText = has(dir, 'outline.md') ? readFileSync(join(dir, 'outline.md'), 'utf8') : '';
  const plannedChapters = [...outlineText.matchAll(/^###\s+Chapter\s+(\d+):\s*(.+)$/gm)].map(m => ({ num: parseInt(m[1]), title: m[2].trim() }));
  const draftedNums = new Set(drafts.map(f => { const m = f.match(/^ch(\d+)/i); return m ? parseInt(m[1]) : null; }).filter(n => n !== null));
  for (const pc of plannedChapters) {
    if (!draftedNums.has(pc.num)) {
      chapter_details.push({ filename: `ch${String(pc.num).padStart(2, '0')}-${pc.title.replace(/\s+/g, '-')}.md`, title: pc.title, lines: 0, words: 0, status: 'wait', edit_stage: null });
    }
  }
  chapter_details.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));
  // Planned count can under-report: the PRD regex grabs the first "N chapters/장"
  // match anywhere in the text (e.g. "각 2장씩"), and Korean outlines may not use
  // the `### Chapter N:` heading form. Never let planned fall below actual drafts.
  const effectivePlanned = Math.max(planned || 0, plannedChapters.length, drafts.length);
  const total_words = chapter_details.reduce((s, c) => s + c.words, 0);

  // Cover
  let cover_path = null;
  const coverDir = join(dir, 'publish', 'cover');
  if (existsSync(coverDir)) {
    const imgs = readdirSync(coverDir).filter(f => IMG_EXTS.test(f));
    if (imgs.length) cover_path = imgs.find(f => /^cover\./i.test(f)) || imgs[0];
  }

  // Publish files
  const formats = ['epub', 'pdf', 'mobi', 'txt', 'md'];
  const output_files = formats.map(fmt => {
    const p = join(dir, 'publish', `book.${fmt}`);
    return { name: `book.${fmt}`, exists: existsSync(p), size_bytes: existsSync(p) ? statSync(p).size : 0 };
  });

  // Agents
  const _fgPath = pluginRoot ? join(pluginRoot, 'dashboard', 'shared', 'fiction-genres.json') : join(import.meta.dirname, 'dashboard', 'shared', 'fiction-genres.json');
  const FICTION_GENRES = new Set(JSON.parse(readFileSync(_fgPath, 'utf8')));
  const EDIT_STAGE_ORDER = ['assessment', 'developmental', 'line-edit', 'copy-edit', 'proofread', 'readiness'];
  const NO_FACTCHECK_GENRES = new Set(['poetry', 'game']);
  const editStageIdx = editStage ? EDIT_STAGE_ORDER.indexOf(editStage) : -1;
  const editStageGte = (stage) => editStageIdx >= EDIT_STAGE_ORDER.indexOf(stage);

  const agentDefs = [
    { id: 'book-architect', name: 'Book Architect', icon: 'architecture', role: 'Structural design & outline planning', artifacts: ['PRD.md', 'STYLE.md', 'outline.md'] },
    { id: 'chapter-writer', name: 'Chapter Writer', icon: 'edit_note', role: 'Draft generation', artifacts: [] },
    { id: 'continuity-editor', name: 'Continuity Editor', icon: 'compare_arrows', role: 'Cross-chapter consistency', artifacts: [] },
    { id: 'cover-designer', name: 'Cover Designer', icon: 'palette', role: 'Cover design & brand identity', artifacts: ['publish/cover'] },
    { id: 'marketing-expert', name: 'Marketing Expert', icon: 'campaign', role: 'Marketing copy & launch', artifacts: ['publish/marketing-plan.md'] },
    { id: 'scene-generator', name: 'Scene Generator', icon: 'theaters', role: 'Scene creation & expansion', artifacts: [] },
    { id: 'style-doctor', name: 'Style Doctor', icon: 'medical_services', role: 'Style consistency & AI-slop detection', artifacts: ['edits/style-report.md'] },
    { id: 'art-director', name: 'Art Director', icon: 'auto_awesome', role: 'Art bible, look lock & visual QA', artifacts: ['art-bible.md'] },
    { id: 'figure-engineer', name: 'Figure Engineer', icon: 'schema', role: 'Code-rendered diagrams, charts & drawings', artifacts: ['visuals/figures'] },
    { id: 'illustrator', name: 'Illustrator', icon: 'brush', role: 'Illustrations from the art bible', artifacts: ['visuals/illustrations'] },
    { id: 'fact-checker', name: 'Fact Checker', icon: 'fact_check', role: 'Claim ledger & source verification', artifacts: ['edits/00-fact-check.md'] },
    { id: 'beta-reader', name: 'Beta Reader', icon: 'groups', role: 'Cold read & readiness verdict', artifacts: ['edits/readiness-report.md'] },
  ];
  const projectAgentsDir = join(dir, '.velith', 'agents');
  const globalAgentsDir = join(VELITH, 'agents');
  const agents = agentDefs.map(a => {
    const projectFile = join(projectAgentsDir, `${a.id}.json`);
    const globalFile = join(globalAgentsDir, `${a.id}.json`);
    const sf = existsSync(projectFile) ? projectFile : existsSync(globalFile) ? globalFile : null;
    const s = sf ? readJson(sf, {}) : {};
    let status = s.status || null;
    if (!status) {
      if (a.id === 'scene-generator' && meta.genre && !FICTION_GENRES.has(meta.genre)) status = 'disabled';
      else if (a.id === 'fact-checker' && meta.genre && NO_FACTCHECK_GENRES.has(meta.genre)) status = 'disabled';
      else if (a.artifacts.length > 0 && a.artifacts.every(f => existsSync(join(dir, f)))) status = 'complete';
      else if (a.id === 'chapter-writer' && drafts.length > 0) status = drafts.length < (effectivePlanned || Infinity) ? 'running' : 'complete';
      else if (a.id === 'style-doctor' && editStageGte('line-edit')) status = 'complete';
      else if (a.id === 'continuity-editor' && editStageGte('developmental')) status = 'complete';
      else status = 'idle';
    }
    return { id: a.id, name: a.name, icon: a.icon, role: a.role, status, last_run: s.last_run || null, task: s.task || null };
  });

  // Phases
  const phase = (n, name, pct, st) => ({ phase: n, name, percent: pct, status: st });
  const phases = [
    phase(0, 'Onboarding', has(dir, 'PRD.md') && has(dir, 'STYLE.md') ? 100 : has(dir, 'PRD.md') ? 50 : 0, has(dir, 'PRD.md') && has(dir, 'STYLE.md') ? 'complete' : has(dir, 'PRD.md') ? 'in_progress' : 'pending'),
    phase(1, 'Ideation', has(dir, 'ideation.md') || has(dir, 'outline.md') ? 100 : 0, has(dir, 'ideation.md') || has(dir, 'outline.md') ? 'complete' : 'pending'),
    phase(2, 'Outlining', has(dir, 'outline.md') ? 100 : 0, has(dir, 'outline.md') ? 'complete' : 'pending'),
    phase(3, 'Drafting', effectivePlanned > 0 ? Math.min(Math.round(drafts.length / effectivePlanned * 100), 100) : drafts.length > 0 ? 100 : 0, effectivePlanned > 0 ? (drafts.length > 0 && drafts.length < effectivePlanned ? 'in_progress' : drafts.length >= effectivePlanned ? 'complete' : 'pending') : (drafts.length > 0 ? 'complete' : 'pending')),
    phase(4, 'Editing', editingComplete ? 100 : Math.round(editReports.filter(r => edits.includes(r.file)).length / editReports.length * 100), editingComplete ? 'complete' : edits.length > 0 ? 'in_progress' : 'pending'),
    phase(5, 'Publishing', (() => { const c = [output_files.find(f => f.name === 'book.epub')?.exists, output_files.find(f => f.name === 'book.pdf')?.exists, has(dir, 'publish/metadata.yaml'), has(dir, 'publish/title-candidates.md'), has(dir, 'publish/marketing-plan.md'), cover_path != null]; return Math.round(c.filter(Boolean).length / c.length * 100); })(), (() => { const ep = output_files.find(f => f.name === 'book.epub')?.exists, pd = output_files.find(f => f.name === 'book.pdf')?.exists; return (ep && pd && has(dir, 'publish/metadata.yaml')) ? 'complete' : (ep || pd) ? 'in_progress' : 'pending'; })()),
  ];
  const current_phase = (() => { const ip = phases.find(p => p.status === 'in_progress'); if (ip) return ip.phase; const last = [...phases].reverse().find(p => p.status === 'complete'); return last ? Math.min(last.phase + 1, phases[phases.length - 1].phase) : 0; })();

  const now = new Date().toISOString();
  const totalChapters = effectivePlanned || drafts.length;
  const completedChapters = Math.min(drafts.length, totalChapters);

  // ─── Write SQLite ───
  const db = await getDb();
  // Prune zombie rows: paths that no longer exist (project moved/deleted) or
  // that are not book projects (no PRD.md — e.g. /tmp scanned by accident).
  // Without this, moved projects leave stale rows forever and the dashboard
  // keeps serving dead paths.
  const allRows = db.exec('SELECT path FROM projects');
  if (allRows.length) {
    for (const [pp] of allRows[0].values) {
      if (pp && (!existsSync(pp) || !existsSync(join(pp, 'PRD.md')))) {
        db.run('DELETE FROM projects WHERE path = ?', [pp]);
        db.run('DELETE FROM chapters WHERE project_path = ?', [pp]);
        db.run('DELETE FROM agents WHERE project_path = ?', [pp]);
        db.run('DELETE FROM scan_log WHERE project_path = ?', [pp]);
      }
    }
  }
  db.run('DELETE FROM chapters WHERE project_path = ?', [dir]);
  db.run('DELETE FROM agents WHERE project_path = ?', [dir]);
  db.run(`INSERT OR REPLACE INTO projects (path, name, genre, language, current_phase, total_chapters, completed_chapters, total_words, target_words, count_unit, phase_status, output_files, cover_path, readiness, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [dir, meta.title, meta.genre, meta.language, current_phase, totalChapters, completedChapters, total_words, meta.target_words || 0, countUnit, JSON.stringify(phases), JSON.stringify(output_files), cover_path, readiness ? JSON.stringify(readiness) : null, now]);
  for (const c of chapter_details) {
    db.run('INSERT INTO chapters (project_path, filename, title, lines, words, status, edit_stage) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [dir, c.filename, c.title, c.lines, c.words, c.status, c.edit_stage]);
  }
  for (const a of agents) {
    db.run(`INSERT OR REPLACE INTO agents (id, project_path, name, icon, role, status, last_run, task) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.id, dir, a.name, a.icon, a.role, a.status, a.last_run, a.task]);
  }
  db.run('INSERT INTO scan_log (project_path, scanned_at, duration_ms) VALUES (?, ?, ?)', [dir, now, Date.now() - start]);
  save();

  // ─── Write per-project status.json (backward compat) ───
  const project = {
    name: meta.title, path: dir, genre: meta.genre, language: meta.language,
    current_phase, phase_status: phases,
    total_chapters: totalChapters, completed_chapters: completedChapters,
    total_words, target_words: meta.target_words || 0, count_unit: countUnit,
    chapter_details, output_files, cover_path, readiness, last_updated: now,
  };
  mkdirSync(join(dir, '.velith'), { recursive: true });
  writeFileSync(join(dir, '.velith', 'status.json'), JSON.stringify({ generated_at: now, agents, projects: [project] }, null, 2));

  // ─── Update registry ───
  const regPath = join(VELITH, 'projects.json');
  const reg = readJson(regPath, { projects: [] });
  reg.projects = reg.projects.filter(p => p.path === dir || (existsSync(p.path) && existsSync(join(p.path, 'PRD.md'))));
  const idx = reg.projects.findIndex(p => p.path === dir);
  const entry = { path: dir, name: meta.title, updated: now };
  if (idx >= 0) reg.projects[idx] = entry; else reg.projects.push(entry);
  writeFileSync(regPath, JSON.stringify(reg, null, 2));

  // ─── Terminal output ───
  const bar = (pct) => { const f = Math.round(pct / 100 * 12); return '█'.repeat(f) + '░'.repeat(12 - f); };
  const statusLabel = (s) => s === 'complete' ? 'COMPLETE' : s === 'in_progress' ? 'IN PROGRESS' : 'PENDING';
  const w = 59;
  const line = (s) => `║  ${s.padEnd(w - 4)}║\n`;
  const sep = () => `╠${'═'.repeat(w - 2)}╣\n`;
  let out = `╔${'═'.repeat(w - 2)}╗\n`;
  out += line(`${meta.title}`);
  out += line(`${meta.genre} · ${meta.language} · ${planned || '?'} chapters`);
  out += sep();
  phases.forEach(p => out += line(`${p.phase}. ${p.name.padEnd(13)} ${bar(p.percent)} ${String(p.percent).padStart(3)}%  ${statusLabel(p.status)}`));
  if (readiness) out += line(`Readiness: ${readiness.verdict || '?'} ${readiness.score != null ? readiness.score.toFixed(1) + '/10' : ''} ${Object.entries(readiness.axes).map(([k, v]) => k[0] + v).join(' ')}`);
  out += sep();
  chapter_details.forEach(c => out += line(`${c.filename.padEnd(20)} ${String(c.lines).padStart(5)} lines  ${String(c.words).padStart(5)} ${countUnit}  [${c.status}]`));
  if (chapter_details.length) out += line(`Total: ${total_words} ${countUnit} · Target: ${meta.target_words || '?'}`);
  out += sep();
  output_files.forEach(f => out += line(`${f.name.padEnd(12)} ${f.exists ? '✓ exists' : '✗ missing'}${f.size_bytes ? ` (${(f.size_bytes / 1024).toFixed(0)}KB)` : ''}`));
  out += `╚${'═'.repeat(w - 2)}╝\n`;
  console.log(out);

  // ─── --ui flag ───
  if (ui) {
    const config = readJson(join(VELITH, 'config.json'), {});
    const port = config.port || 9631;
    try { execSync(`curl -sf http://127.0.0.1:${port}/status.json`, { stdio: 'pipe' }); }
    catch {
      const clientPath = pluginRoot ? join(pluginRoot, 'velith.mjs') : import.meta.url.replace(/^file:\/\//, '');
      execSync(`nohup node "${clientPath}" serve > /dev/null 2>&1 &`, { stdio: 'ignore' });
    }
    // Dashboard indexes projects by last_updated DESC; the just-scanned
    // project (last_updated = now) sits at that position. The registry's
    // insertion order is a different sequence and opened the wrong project.
    const posRows = db.exec('SELECT COUNT(*) FROM projects WHERE last_updated > ?', [now]);
    const pidx = posRows.length ? posRows[0].values[0][0] : 0;
    execSync(`open http://127.0.0.1:${port}/${pidx}/overview`, { stdio: 'ignore' });
  }
}

// ─── agents ───────────────────────────────────────────────────────────────────────

async function cmdAgents(args) {
  const [id, status, ...taskParts] = args;
  if (!id || !status) { console.error('Usage: velith.mjs agents <id> <running|complete|error> [task]'); process.exit(1); }
  const now = new Date().toISOString();
  const task = status === 'complete' ? null : (taskParts.join(' ') || null);

  // Also write JSON file for backward compat
  const agentsDir = join(VELITH, 'agents');
  mkdirSync(agentsDir, { recursive: true });
  writeFileSync(join(agentsDir, `${id}.json`), JSON.stringify({ status, last_run: now, task }));

  // Write to SQLite
  const db = await getDb();
  // Update all rows for this agent id
  const existing = db.exec('SELECT project_path FROM agents WHERE id = ?', [id]);
  if (existing.length && existing[0].values.length) {
    for (const [pp] of existing[0].values) {
      db.run('UPDATE agents SET status = ?, last_run = ?, task = ? WHERE id = ? AND project_path = ?', [status, now, task, id, pp]);
    }
  } else {
    // No projects scanned yet — insert with empty project_path
    db.run('INSERT OR REPLACE INTO agents (id, project_path, status, last_run, task) VALUES (?, ?, ?, ?, ?)', [id, '', status, now, task]);
  }
  save();
  console.log(JSON.stringify({ status, last_run: now, task }));
}

// ─── stats ────────────────────────────────────────────────────────────────────────

async function cmdStats(args) {
  const dir = resolve(args.find(a => !a.startsWith('--')) || process.cwd());
  const db = await getDb();
  const rows = db.exec('SELECT name, genre, language, current_phase, total_chapters, completed_chapters, total_words, target_words, count_unit, last_updated FROM projects WHERE path = ?', [dir]);
  if (!rows.length || !rows[0].values.length) {
    console.log(JSON.stringify({ error: 'Project not found in DB. Run `velith.mjs scan` first.' }));
    return;
  }
  const r = rows[0].values[0];
  const cRows = db.exec('SELECT filename, title, lines, words, status, edit_stage FROM chapters WHERE project_path = ? ORDER BY filename', [dir]);
  const chapters = cRows.length ? cRows[0].values.map(c => ({ filename: c[0], title: c[1], lines: c[2], words: c[3], status: c[4], edit_stage: c[5] })) : [];
  console.log(JSON.stringify({
    name: r[0], genre: r[1], language: r[2], current_phase: r[3],
    total_chapters: r[4], completed_chapters: r[5], total_words: r[6], target_words: r[7],
    count_unit: r[8], last_updated: r[9], chapters,
  }, null, 2));
}

// ─── words ────────────────────────────────────────────────────────────────────────

function cmdWords(args) {
  const filePath = resolve(args[0] || '');
  if (!existsSync(filePath)) { console.error('File not found:', filePath); process.exit(1); }
  const l = countLines(filePath);
  const w = countWords(filePath);
  const c = countChars(filePath);
  console.log(JSON.stringify({ file: filePath, lines: l, words: w, chars: c }));
}

// ─── list ─────────────────────────────────────────────────────────────────────────

async function cmdList() {
  const db = await getDb();
  const rows = db.exec('SELECT path, name, genre, language, current_phase, total_chapters, completed_chapters, total_words, count_unit, last_updated FROM projects ORDER BY last_updated DESC');
  if (!rows.length || !rows[0].values.length) {
    console.log('No projects in DB. Run `velith.mjs scan <dir>` to add one.');
    return;
  }
  const projects = rows[0].values.map(r => ({
    path: r[0], name: r[1], genre: r[2], language: r[3],
    phase: r[4], chapters: `${r[6]}/${r[5]}`,
    words: `${r[7]} ${r[8]}`, updated: r[9],
  }));
  console.log(JSON.stringify(projects, null, 2));
}

// ─── migrate ──────────────────────────────────────────────────────────────────────

async function cmdMigrate() {
  const db = await getDb();
  let imported = 0, skipped = 0;

  // 1. Collect project data from JSON sources
  const regPath = join(VELITH, 'projects.json');
  const reg = readJson(regPath, { projects: [] });
  const cache = readJson(join(VELITH, 'cache', 'status.json'), null);
  const cacheMap = new Map();
  if (cache?.projects) cache.projects.forEach(p => cacheMap.set(p.path, p));

  if (reg.projects.length === 0 && !cache) {
    console.log('No JSON data found to migrate.');
    return;
  }

  for (const entry of reg.projects) {
    // Try per-project status.json first, then cache
    const perProject = readJson(join(entry.path, '.velith', 'status.json'), null);
    const source = perProject?.projects?.[0] || cacheMap.get(entry.path);
    if (!source) { console.log(`  ⚠ ${entry.name || entry.path}: no status data, skipping`); skipped++; continue; }

    const now = new Date().toISOString();
    db.run(`INSERT OR REPLACE INTO projects (path, name, genre, language, current_phase, total_chapters, completed_chapters, total_words, target_words, count_unit, phase_status, output_files, cover_path, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      source.path || entry.path,
      source.name || entry.name || 'Untitled',
      source.genre || null,
      source.language || null,
      source.current_phase ?? 0,
      source.total_chapters ?? 0,
      source.completed_chapters ?? 0,
      source.total_words ?? 0,
      source.target_words ?? 0,
      source.count_unit || 'words',
      JSON.stringify(source.phase_status || []),
      JSON.stringify(source.output_files || []),
      source.cover_path || null,
      source.last_updated || now,
    ]);

    // Chapters
    if (source.chapter_details?.length) {
      const pp = source.path || entry.path;
      db.run('DELETE FROM chapters WHERE project_path = ?', [pp]);
      for (const c of source.chapter_details) {
        db.run('INSERT INTO chapters (project_path, filename, title, lines, words, status, edit_stage) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [pp, c.filename, c.title, c.lines ?? 0, c.words ?? 0, c.status || 'wait', c.edit_stage || null]);
      }
    }

    // Agents (from per-project status)
    if (perProject?.agents?.length) {
      const pp = source.path || entry.path;
      for (const a of perProject.agents) {
        db.run(`INSERT OR REPLACE INTO agents (id, project_path, name, icon, role, status, last_run, task) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [a.id, pp, a.name, a.icon, a.role, a.status || 'idle', a.last_run || null, a.task || null]);
      }
    }
    imported++;
    console.log(`  ✓ ${source.name || entry.path}`);
  }

  // 2. Global agents from ~/.velith/agents/*.json
  const agentsDir = join(VELITH, 'agents');
  let agentCount = 0;
  if (existsSync(agentsDir)) {
    for (const f of readdirSync(agentsDir).filter(f => f.endsWith('.json'))) {
      const id = basename(f, '.json');
      const data = readJson(join(agentsDir, f), {});
      if (!data.status) continue;
      // Update existing agent rows, or insert standalone
      const existing = db.exec('SELECT id FROM agents WHERE id = ?', [id]);
      if (existing.length && existing[0].values.length) {
        db.run('UPDATE agents SET status = ?, last_run = ?, task = ? WHERE id = ?',
          [data.status, data.last_run || null, data.task || null, id]);
      } else {
        db.run('INSERT OR REPLACE INTO agents (id, project_path, status, last_run, task) VALUES (?, ?, ?, ?, ?)',
          [id, data.status, data.last_run || null, data.task || null]);
      }
      agentCount++;
    }
  }

  save();
  console.log(`\nMigrated ${imported} projects, ${agentCount} agents (${skipped} skipped).`);

  // ─── Backup JSON files after successful migration ───
  if (imported === 0) return;
  const renamed = [];
  const renameSafe = (from, to) => { try { if (existsSync(from)) { renameSync(from, to); return true; } } catch {} return false; };
  // Centralized cache
  const cacheStatus = join(VELITH, 'cache', 'status.json');
  if (renameSafe(cacheStatus, cacheStatus + '.bak')) renamed.push('cache/status.json');
  // Per-project status.json
  for (const entry of reg.projects) {
    const sp = join(entry.path, '.velith', 'status.json');
    if (renameSafe(sp, sp + '.bak')) renamed.push(sp.replace(HOME, '~'));
  }
  // Global agent files
  if (existsSync(agentsDir)) {
    for (const f of readdirSync(agentsDir).filter(f => f.endsWith('.json'))) {
      const from = join(agentsDir, f);
      if (renameSafe(from, from + '.bak')) renamed.push(`~/.velith/agents/${f}`);
    }
  }
  if (renamed.length) {
    console.log(`\nBacked up ${renamed.length} JSON files:`);
    renamed.forEach(f => console.log(`  ${f} → .bak`));
  }
}

// ─── metrics ──────────────────────────────────────────────────────────────────────
// Deterministic prose metrics. Numbers point the style-doctor at problems; they do
// not judge prose. Language is detected per file (CJK share of letters > 30%).

const EN_TELLS = [
  /\bdelv(e|es|ed|ing)\b/gi, /\btapestr(y|ies)\b/gi, /\btestament to\b/gi, /\bnavigat(e|es|ing) the\b/gi,
  /\blandscape of\b/gi, /\bnuanced\b/gi, /\bmultifaceted\b/gi, /\bplethora\b/gi, /\bmyriad\b/gi,
  /\brobust\b/gi, /\bseamless(ly)?\b/gi, /\bleverag(e|es|ed|ing)\b/gi, /\bunpack(s|ed|ing)?\b/gi,
  /\bat its core\b/gi, /\bfast-paced world\b/gi, /\bit'?s worth noting\b/gi, /\bit'?s important to (note|remember)\b/gi,
  /\bserves as a reminder\b/gi, /\ba beacon of\b/gi, /\bresonat(e|es|ed|ing)\b/gi, /\bembark(s|ed|ing)?\b/gi,
  /\bfoster(s|ed|ing)?\b/gi, /\bunderscor(e|es|ed|ing)\b/gi, /\bpivotal\b/gi, /\bgame-?changer/gi,
  /\bgroundbreaking\b/gi, /\btransformative\b/gi, /\bholistic\b/gi, /\bsynerg/gi, /\bparadigm\b/gi,
  /\belevat(e|es|ed|ing)\b/gi, /\bvibrant\b/gi, /\bbustling\b/gi, /\bsomething (in \w+ )?shifted\b/gi,
  /\ba beat\.\s/g, /\bthe air (changed|shifted)\b/gi, /\bin conclusion\b/gi, /\bat the end of the day\b/gi,
  /\bsilence (stretched|settled|hung)\b/gi, /\blet out a breath\b/gi, /\bdidn'?t know (she|he|they) (was|were) holding\b/gi,
];
const KO_TELLS = [
  /것이다[.!]/g, /것입니다[.!]/g, /되어졌/g, /여겨진다/g, /보여진다/g, /에 대해서?\s/g, /[을를] 통해\s/g,
  /느꼈다\./g, /느낄 수 있었다/g, /밀려왔다/g, /수행하였다/g, /존재하였다/g, /인식하였다/g,
  /무언가가? (달라|바뀌|변)/g, /알 수 없는 (감정|기분)/g, /그녀는 .{0,12}(슬픔|불안|두려움|기쁨)을 느/g,
  /하나의\s/g, /~?들의\s/g,
];
const EN_CONNECT = /(^|[.!?]\s+)(However|Moreover|Furthermore|Additionally|Ultimately|Notably|Interestingly),?\s/gm;
const KO_CONNECT = /(^|[.!?。]\s*)(그러나|하지만|또한|따라서|그리고|그런데|그래서)\s/gm;
const EN_NOTX = /\b(wasn't|isn't|not)\s+(just\s+|only\s+|about\s+)?[^.]{1,60}\.\s+(It|This|That|She|He|They)\s+(was|is|were|are)\b/g;
const KO_NOTX = /아니(었|였)?다\.\s*[^.]{1,60}(이었|였)다\./g;

const isCJK = (t) => {
  const cjk = (t.match(/[ᄀ-ᇿ㄰-㆏가-힯぀-ヿ一-鿿]/g) || []).length;
  const lat = (t.match(/[A-Za-z]/g) || []).length;
  return cjk > 0 && cjk / (cjk + lat) > 0.3;
};
const splitSentences = (t) => t.split(/(?<=[.!?。！？…])["'”’」』)]*\s+/).map(x => x.trim()).filter(x => x.length > 1);
const avg = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const std = (a, m) => a.length ? Math.sqrt(avg(a.map(x => (x - m) ** 2))) : 0;
const r2 = (x) => +x.toFixed(2);

function analyzeText(raw) {
  const text = raw.replace(/^---[\s\S]*?\n---\n/, '').replace(/```[\s\S]*?```/g, '').replace(/^#{1,6} .*$/gm, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  const cjk = isCJK(text);
  const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const sentences = paras.flatMap(splitSentences);
  const lenOf = (s) => cjk ? s.replace(/\s/g, '').length : s.split(/\s+/).filter(Boolean).length;
  const lens = sentences.map(lenOf);
  const mean = avg(lens), sd = std(lens, mean);
  const shortThresh = cjk ? 15 : 8;
  const paraSent = paras.map(p => splitSentences(p));
  const punch = paraSent.filter(ss => ss.length >= 2 && lenOf(ss[ss.length - 1]) < shortThresh).length;
  const tokens = text.split(/\s+/).map(t => t.replace(/[^\p{L}\p{N}']/gu, '').toLowerCase()).filter(Boolean);
  const words = cjk ? text.replace(/\s/g, '').length : tokens.length;
  const per1k = (n) => words ? r2(n / words * 1000) : 0;
  const tellHits = {};
  let tells = 0;
  for (const re of (cjk ? KO_TELLS : EN_TELLS)) { const m = text.match(re); if (m) { tells += m.length; tellHits[re.source] = m.length; } }
  return {
    lang: cjk ? 'cjk' : 'latin', unit: cjk ? 'chars' : 'words', words, sentences: sentences.length, paragraphs: paras.length,
    sentence_len_mean: r2(mean), sentence_len_sd: r2(sd), sentence_cv: mean ? r2(sd / mean) : 0,
    mid_band_share: lens.length ? r2(lens.filter(l => l >= mean * 0.7 && l <= mean * 1.3).length / lens.length) : 0,
    para_sentences_mean: r2(avg(paraSent.map(s => s.length))), para_sentences_sd: r2(std(paraSent.map(s => s.length), avg(paraSent.map(s => s.length)))),
    punch_ending_share: paras.length ? r2(punch / paras.length) : 0,
    ttr: tokens.length ? +(new Set(tokens).size / tokens.length).toFixed(3) : 0,
    em_dash_per_1k: per1k((text.match(/[—–]/g) || []).length),
    tells_per_1k: per1k(tells), tell_hits: tellHits,
    not_x_but_y: (text.match(cjk ? KO_NOTX : EN_NOTX) || []).length,
    rhetorical_q_per_1k: per1k(sentences.filter(s => /[?？]["'”’」』]*$/.test(s)).length),
    connectives_per_1k: per1k((text.match(cjk ? KO_CONNECT : EN_CONNECT) || []).length),
    dialogue_para_share: paras.length ? r2(paras.filter(p => /^["“「『']/.test(p)).length / paras.length) : 0,
    _tokens: tokens,
  };
}

function flagsFor(name, m) {
  const f = [];
  if (m.sentences >= 20 && m.sentence_cv < 0.4) f.push(`${name}: sentence length too uniform (cv ${m.sentence_cv})`);
  if (m.sentences >= 20 && m.mid_band_share > 0.6) f.push(`${name}: ${Math.round(m.mid_band_share * 100)}% of sentences within ±30% of mean`);
  if (m.paragraphs >= 10 && m.punch_ending_share > 0.35) f.push(`${name}: ${Math.round(m.punch_ending_share * 100)}% of paragraphs end on a short punch`);
  if (m.tells_per_1k > 2) f.push(`${name}: AI-tell hits ${m.tells_per_1k}/1k`);
  if (m.em_dash_per_1k > 3) f.push(`${name}: em-dashes ${m.em_dash_per_1k}/1k`);
  if (m.not_x_but_y >= 2) f.push(`${name}: "not X but Y" ×${m.not_x_but_y}`);
  if (m.rhetorical_q_per_1k > 3) f.push(`${name}: rhetorical questions ${m.rhetorical_q_per_1k}/1k`);
  return f;
}

function cmdMetrics(args) {
  const target = resolve(args.find(a => !a.startsWith('--')) || 'drafts');
  if (!existsSync(target)) { console.error('Not found:', target); process.exit(1); }
  let files;
  let projectDir = null;
  if (statSync(target).isDirectory()) {
    const d = existsSync(join(target, 'drafts')) ? join(target, 'drafts') : target;
    projectDir = basename(d) === 'drafts' ? resolve(d, '..') : null;
    files = readdirSync(d).filter(f => /^(ch|p)\d+.*\.md$/i.test(f) && !/-scenes\.md$/.test(f)).sort().map(f => join(d, f));
  } else files = [target];
  const perFile = {};
  const grams = new Map(); // gram -> { count, files:Set }
  for (const fp of files) {
    const m = analyzeText(readFileSync(fp, 'utf8'));
    const toks = m._tokens; delete m._tokens;
    perFile[basename(fp)] = m;
    for (const n of [3, 4]) {
      const seen = new Set();
      for (let i = 0; i + n <= toks.length; i++) {
        const g = toks.slice(i, i + n);
        if (g.every(t => t.length <= 2)) continue;
        const key = g.join(' ');
        const e = grams.get(key) || { count: 0, files: new Set() };
        e.count++; e.files.add(basename(fp)); grams.set(key, e);
        seen.add(key);
      }
    }
  }
  const repeated = [...grams.entries()]
    .filter(([, e]) => e.count >= 3 && (e.files.size >= 2 || e.count >= 4))
    .map(([ngram, e]) => ({ ngram, count: e.count, files: [...e.files] }))
    .sort((a, b) => b.count - a.count || b.files.length - a.files.length)
    .slice(0, 40);
  const flags = Object.entries(perFile).flatMap(([n, m]) => flagsFor(n, m));
  for (const r of repeated) if (r.ngram.split(' ').length === 4 && r.count >= 3) flags.push(`repeated 4-gram "${r.ngram}" ×${r.count} in ${r.files.join(', ')}`);
  const ttrs = Object.values(perFile).map(m => m.ttr).filter(Boolean).sort((a, b) => a - b);
  const medTtr = ttrs.length ? ttrs[Math.floor(ttrs.length / 2)] : 0;
  for (const [n, m] of Object.entries(perFile)) if (medTtr && m.ttr < medTtr * 0.85) flags.push(`${n}: vocabulary diversity ${m.ttr} is >15% below manuscript median ${medTtr}`);
  const out = { generated_at: new Date().toISOString(), files: perFile, repeated_ngrams: repeated, flags };
  if (projectDir) { mkdirSync(join(projectDir, '.velith'), { recursive: true }); writeFileSync(join(projectDir, '.velith', 'metrics.json'), JSON.stringify(out, null, 2)); }
  console.log(JSON.stringify(out, null, 2));
}

// ─── snapshot ─────────────────────────────────────────────────────────────────────

function cmdSnapshot(args) {
  const pos = args.filter(a => !a.startsWith('--'));
  const dir = resolve(pos[0] || process.cwd());
  const label = (pos[1] || 'snapshot').replace(/[^\w.-]/g, '_');
  const src = join(dir, 'drafts');
  if (!existsSync(src)) { console.error('No drafts/ directory in', dir); process.exit(1); }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dest = join(dir, '.velith', 'snapshots', `${stamp}-${label}`);
  cpSync(src, dest, { recursive: true });
  for (const f of ['bible.md', 'STYLE.md', 'outline.md']) if (existsSync(join(dir, f))) cpSync(join(dir, f), join(dest, f));
  console.log(JSON.stringify({ snapshot: dest, files: readdirSync(dest).length }));
}


// ─── images ───────────────────────────────────────────────────────────────────────
// Model-agnostic image tooling. `compile` merges the art bible with an image spec into
// per-backend prompts; `check` validates assets and references; `render` runs whatever
// figure renderers are installed. No image decoding beyond header parsing.

const PLACEMENT_MIN = { 'full-page': [1600, 2400], 'chapter-header': [2400, 800], inline: [1200, 1200], spot: [800, 800], 'cover-front': [1600, 2560], spread: [2400, 1800], audiobook: [3200, 3200], social: [1200, 628] };
const DEFAULT_ASPECT = { 'full-page': '2:3', 'chapter-header': '3:1', inline: '1:1', spot: '1:1', 'cover-front': '2:3', spread: '4:3', audiobook: '1:1', social: '1.91:1' };
const BASE_NEGATIVE = ['text', 'letters', 'words', 'watermark', 'signature', 'logo', 'border', 'frame'];
const SD_NEGATIVE_EXTRA = ['lowres', 'jpeg artifacts', 'bad anatomy', 'extra limbs', 'extra fingers', 'deformed hands', 'blurry'];

function imageDims(fp) {
  try {
    const ext = extname(fp).toLowerCase();
    if (ext === '.svg') {
      const s = readFileSync(fp, 'utf8').slice(0, 4000);
      const vb = s.match(/viewBox="[\d.\s-]*?\s([\d.]+)\s([\d.]+)"/);
      const w = s.match(/\swidth="([\d.]+)/), h = s.match(/\sheight="([\d.]+)/);
      if (w && h) return { width: Math.round(+w[1]), height: Math.round(+h[1]), vector: true };
      if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]), vector: true };
      return { width: null, height: null, vector: true };
    }
    const buf = readFileSync(fp);
    if (buf[0] === 0x89 && buf[1] === 0x50) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i++; continue; }
        const m = buf[i + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        i += 2 + buf.readUInt16BE(i + 2);
      }
    }
  } catch {}
  return { width: null, height: null };
}

function loadVisuals(dir) {
  const bible = readJson(join(dir, '.velith', 'art-bible.json'), null);
  const manifest = readJson(join(dir, 'visuals', 'manifest.json'), null);
  return { bible, manifest };
}

function compileOne(bible, entry) {
  const b = bible || {};
  const chars = (entry.characters || []).map(id => { const c = (b.characters || {})[id]; return c ? (c.tokens || c.constants || '') : ''; }).filter(Boolean);
  const settings = (entry.settings || []).map(id => { const s = (b.settings || {})[id]; return s ? (s.tokens || s.constants || '') : ''; }).filter(Boolean);
  const subject = [entry.subject, entry.action, entry.setting, ...chars, ...settings].filter(Boolean).join(', ');
  const style = (b.backend && b.backend.style_clause) || [b.medium, b.line, b.texture, b.detail && `${b.detail} detail`].filter(Boolean).join(', ');
  const palette = (b.palette || []).map(p => `${p.role} ${p.hex}`).join(', ');
  const forbidden = (b.forbidden_colors || []).join(', ');
  const comp = [entry.composition, entry.focal_point && `focal point: ${entry.focal_point}`, entry.camera, b.composition].filter(Boolean).join(', ');
  const light = [entry.lighting || b.lighting, entry.time].filter(Boolean).join(', ');
  const mood = [].concat(entry.mood || [], b.mood || []).join(', ');
  const aspect = (b.aspect || {})[entry.placement] || DEFAULT_ASPECT[entry.placement] || '2:3';
  const neg = [...new Set([...(b.negative || []), ...(entry.text_in_image ? [] : BASE_NEGATIVE)])];
  const be = b.backend || {};
  const refs = [be.sref && `style reference: ${be.sref}`, be.cref && `character reference: ${be.cref}`].filter(Boolean);
  const textLine = entry.text_in_image && entry.text ? ` Include the text exactly: "${entry.text}".` : ' Do not include any text, letters, words, watermarks, or signatures.';
  const mj = `${subject}. ${style}. palette: ${palette}${forbidden ? `, avoid ${forbidden}` : ''}. ${comp}. ${light}. ${mood} --ar ${aspect} --style raw --v 7${be.sref ? ` --sref ${be.sref}` : ''}${be.cref ? ` --cref ${be.cref} --cw 100` : ''}${be.seed ? ` --seed ${be.seed}` : ''} --no ${neg.join(', ')}`;
  const natural = `${subject}. Rendered as ${style}. Color palette: ${palette}${forbidden ? `; never use ${forbidden}` : ''}. Composition: ${comp}. Lighting: ${light}. Mood: ${mood}.${textLine} Aspect ratio ${aspect}.${refs.length ? ` Match the ${refs.join(' and ')}.` : ''}`;
  const sd = { positive: [subject, style, palette && `palette ${palette}`, comp, light, mood].filter(Boolean).join(', '), negative: [...neg, ...SD_NEGATIVE_EXTRA].join(', '), aspect, seed: be.seed || null, references: refs };
  const ideogram = entry.text_in_image ? `${natural} Typography must be legible and exactly as specified.` : null;
  return { id: entry.id, placement: entry.placement, aspect, midjourney: mj, gpt_image: natural, stable_diffusion_flux: sd, imagen: natural, ideogram, references: refs, negative: neg };
}

function cmdImages(args) {
  const [sub, ...rest] = args;
  const pos = rest.filter(a => !a.startsWith('--'));
  const dir = resolve(pos[0] || process.cwd());
  if (sub === 'compile') {
    const { bible, manifest } = loadVisuals(dir);
    if (!manifest) { console.error('No visuals/manifest.json in', dir); process.exit(1); }
    if (!bible) console.error('Warning: no .velith/art-bible.json; prompts will lack the book look.');
    const want = pos[1];
    const entries = (manifest.images || manifest).filter(e => e && (!want || e.id === want) && (want || ['illustrator', 'cover-designer'].includes(e.maker)));
    if (!entries.length) { console.error('No matching manifest entries'); process.exit(1); }
    mkdirSync(join(dir, 'visuals', 'prompts'), { recursive: true });
    const out = [];
    for (const e of entries) {
      const c = compileOne(bible, e);
      const md = `# ${c.id} (${c.placement}, ${c.aspect})\n\n## Midjourney\n\n\`\`\`\n${c.midjourney}\n\`\`\`\n\n## gpt-image / DALL-E\n\n\`\`\`\n${c.gpt_image}\n\`\`\`\n\n## Stable Diffusion / FLUX\n\n**Positive**\n\`\`\`\n${c.stable_diffusion_flux.positive}\n\`\`\`\n**Negative**\n\`\`\`\n${c.stable_diffusion_flux.negative}\n\`\`\`\n${c.stable_diffusion_flux.seed ? `Seed: ${c.stable_diffusion_flux.seed}\n` : ''}\n## Imagen\n\n\`\`\`\n${c.imagen}\n\`\`\`\n${c.ideogram ? `\n## Ideogram (text-in-image)\n\n\`\`\`\n${c.ideogram}\n\`\`\`\n` : ''}\n## References\n\n${c.references.length ? c.references.map(r => `- ${r}`).join('\n') : '- none recorded in art bible backend profile'}\n`;
      writeFileSync(join(dir, 'visuals', 'prompts', `${c.id}.md`), md);
      out.push(c);
    }
    console.log(JSON.stringify(out, null, 2));
    return;
  }
  if (sub === 'check') {
    const { bible, manifest } = loadVisuals(dir);
    const errors = [], warnings = [], images = [];
    const entries = manifest ? (manifest.images || manifest) : [];
    const managed = new Set();
    for (const e of entries) {
      const rec = { id: e.id, status: e.status, ok: true, issues: [] };
      if (e.status !== 'done') { images.push(rec); continue; }
      const out = e.output || e.path;
      if (!out) { rec.issues.push('no output path'); rec.ok = false; images.push(rec); continue; }
      const fp = resolve(dir, out);
      managed.add(fp);
      if (!existsSync(fp)) { rec.issues.push(`missing file ${out}`); rec.ok = false; images.push(rec); continue; }
      const d = imageDims(fp);
      rec.dims = d;
      const min = PLACEMENT_MIN[e.placement];
      if (min && d.width && !d.vector && (d.width < min[0] || d.height < min[1])) rec.issues.push(`below placement minimum ${min[0]}x${min[1]} (got ${d.width}x${d.height})`);
      const aspect = ((bible && bible.aspect) || {})[e.placement] || DEFAULT_ASPECT[e.placement];
      if (aspect && d.width && d.height) {
        const [aw, ah] = aspect.split(':').map(Number);
        const want = aw / ah, got = d.width / d.height;
        if (Math.abs(got - want) / want > 0.05) rec.issues.push(`aspect ${got.toFixed(2)} vs expected ${aspect}`);
      }
      const size = statSync(fp).size;
      if (!d.vector && size > 500 * 1024 && e.type !== 'cover') warnings.push(`${e.id}: ${(size / 1024).toFixed(0)}KB exceeds 500KB EPUB budget`);
      if (!e.alt) rec.issues.push('no alt text');
      if (e.maker === 'figure-engineer' && !e.caption) rec.issues.push('figure without caption');
      if (rec.issues.length) rec.ok = false;
      images.push(rec);
    }
    // references in drafts
    const draftsDir = join(dir, 'drafts');
    const references = [];
    if (existsSync(draftsDir)) {
      for (const f of readdirSync(draftsDir).filter(f => f.endsWith('.md'))) {
        const txt = readFileSync(join(draftsDir, f), 'utf8');
        for (const m of txt.matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)) {
          const [, alt, p] = m;
          if (/^https?:/.test(p)) continue;
          const fp = resolve(draftsDir, p);
          const r = { draft: f, path: p, ok: true, issues: [] };
          if (!existsSync(fp)) { r.issues.push('unresolved'); r.ok = false; }
          if (!alt.trim()) { r.issues.push('empty alt'); r.ok = false; }
          if (existsSync(fp) && managed.size && !managed.has(fp)) r.issues.push('not in manifest');
          references.push(r);
        }
      }
    }
    const unmanaged = [];
    for (const sub of ['illustrations', 'figures', 'photos']) {
      const d = join(dir, 'visuals', sub);
      if (!existsSync(d)) continue;
      for (const f of readdirSync(d)) { const fp = join(d, f); if (statSync(fp).isFile() && /\.(png|jpe?g|webp|svg)$/i.test(f) && !managed.has(fp)) unmanaged.push(join('visuals', sub, f)); }
    }
    const legacy = join(dir, 'publish', 'illustrations');
    if (existsSync(legacy)) for (const f of readdirSync(legacy)) if (/\.(png|jpe?g|webp)$/i.test(f)) unmanaged.push(join('publish', 'illustrations', f));
    if (!manifest) warnings.push('no visuals/manifest.json');
    if (!bible) warnings.push('no .velith/art-bible.json (run /book-visuals plan)');
    const pass = images.every(i => i.ok) && references.every(r => r.ok) && errors.length === 0;
    console.log(JSON.stringify({ pass, images, references, unmanaged, warnings, errors }, null, 2));
    process.exitCode = pass ? 0 : 2;
    return;
  }
  if (sub === 'render') {
    const srcDir = join(dir, 'visuals', 'figures', 'src');
    const outDir = join(dir, 'visuals', 'figures');
    if (!existsSync(srcDir)) { console.error('No visuals/figures/src in', dir); process.exit(1); }
    mkdirSync(outDir, { recursive: true });
    const have = (t) => { try { execSync(`command -v ${t}`, { stdio: 'pipe' }); return true; } catch { return false; } };
    const tools = { mmdc: have('mmdc'), d2: have('d2'), dot: have('dot'), 'rsvg-convert': have('rsvg-convert'), python3: have('python3') };
    const themeMmd = existsSync(join(srcDir, 'theme.json')) ? ` -c "${join(srcDir, 'theme.json')}"` : '';
    const results = [];
    for (const f of readdirSync(srcDir).sort()) {
      const src = join(srcDir, f), id = f.replace(/\.[^.]+$/, ''), ext = extname(f).toLowerCase();
      if (f.startsWith('theme')) continue;
      const svg = join(outDir, `${id}.svg`);
      let cmd = null, tool = null;
      if (ext === '.mmd') { tool = 'mmdc'; cmd = `mmdc -i "${src}" -o "${svg}"${themeMmd} -b transparent`; }
      else if (ext === '.d2') { tool = 'd2'; cmd = `d2 "${src}" "${svg}"`; }
      else if (ext === '.dot') { tool = 'dot'; cmd = `dot -Tsvg "${src}" -o "${svg}"`; }
      else if (ext === '.py') { tool = 'python3'; cmd = `cd "${outDir}" && python3 "${src}"`; }
      else if (ext === '.svg') { tool = null; cmd = `cp "${src}" "${svg}"`; }
      else { results.push({ file: f, skipped: 'unknown source type' }); continue; }
      if (tool && !tools[tool]) { results.push({ file: f, skipped: `${tool} not installed` }); continue; }
      try { execSync(cmd, { stdio: 'pipe' }); const r = { file: f, svg: existsSync(svg) ? svg : null };
        if (r.svg && tools['rsvg-convert']) { const png = join(outDir, `${id}.png`); execSync(`rsvg-convert -w 2400 "${svg}" -o "${png}"`, { stdio: 'pipe' }); r.png = png; }
        results.push(r);
      } catch (err) { results.push({ file: f, error: String(err.message || err).split('\n')[0] }); }
    }
    console.log(JSON.stringify({ tools, results }, null, 2));
    return;
  }
  console.error('Usage: velith.mjs images <compile [dir] [id] | check [dir] | render [dir]>');
  process.exit(1);
}


// ─── serve ────────────────────────────────────────────────────────────────────────

async function cmdServe(args) {
  await autoMigrate();
  const DIST_DIR = join(import.meta.dirname, 'dashboard', 'dist');
  const PID_PATH = join(VELITH, 'server.pid');
  const DEFAULT_PORT = 9631;

  const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
  };

  function serveStatic(res, urlPath) {
    let fp = join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);
    // Explicit containment guard: URL normalization blocks most traversal, but
    // don't rely on it — anything resolving outside DIST_DIR is SPA-routed.
    if (!fp.startsWith(DIST_DIR + '/')) fp = join(DIST_DIR, 'index.html');
    if (!existsSync(fp) || statSync(fp).isDirectory()) fp = join(DIST_DIR, 'index.html');
    const ext = basename(fp).includes('.') ? '.' + basename(fp).split('.').pop() : '';
    try {
      const buf = readFileSync(fp);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(buf);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  }

  // ── ETag cache for status.json ──
  let cachedStatusJson = null;
  let cachedEtag = null;

  // Shared conditional-response helper: if the client's If-None-Match matches
  // the computed `etag`, short-circuit with 304; otherwise write `headers`
  // (augmented with ETag + Cache-Control: no-cache) and run `send`. Collapses
  // the 304 fast-path that was previously inlined per route.
  function serveWithEtag(req, res, etag, headers, send) {
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, { 'ETag': etag });
      res.end();
      return;
    }
    res.writeHead(200, { ...headers, 'Cache-Control': 'no-cache', 'ETag': etag });
    send();
  }

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/status.json') {
      const status = await getStatus();
      const body = JSON.stringify({ ...status, generated_at: new Date().toISOString() });
      const etag = '"' + Buffer.from(body).length.toString(36) + '-' + Buffer.from(body).slice(0, 64).toString('base64').slice(0, 8) + '"';
      cachedStatusJson = body;
      cachedEtag = etag;
      serveWithEtag(req, res, etag, { 'Content-Type': 'application/json' }, () => res.end(body));
      return;
    }

    const coverMatch = url.pathname.match(/^\/cover\/(\d+)$/);
    if (coverMatch) {
      const status = await getStatus();
      const proj = status.projects?.[parseInt(coverMatch[1])];
      if (!proj?.path) { res.writeHead(404); res.end('Not found'); return; }
      const coverDir = join(proj.path, 'publish', 'cover');
      try {
        const files = readdirSync(coverDir).filter(f => IMG_EXTS.test(f));
        if (files.length === 0) { res.writeHead(404); res.end('No cover'); return; }
        const cover = files.find(f => /^cover\./i.test(f)) || files[0];
        const fp = join(coverDir, cover);
        const ext = extname(fp);
        // ETag by size + mtimeMs + inode so a replaced cover is re-fetched
        // immediately, while an unchanged cover short-circuits to 304. The
        // inode disambiguates a same-ms / same-size replacement (two different
        // images written within one stat tick) that size+mtime alone would
        // wrongly report as unchanged. no-cache forces revalidation on every
        // request (no stale-image window after upload).
        const st = statSync(fp);
        const etag = `"${st.size.toString(16)}-${st.mtimeMs.toString(16)}-${st.ino?.toString(16) ?? '0'}"`;
        serveWithEtag(req, res, etag,
          { 'Content-Type': MIME[ext] || 'image/jpeg' },
          () => createReadStream(fp).pipe(res));
      } catch {
        res.writeHead(404); res.end('No cover');
      }
      return;
    }

    const uploadMatch = url.pathname.match(/^\/api\/cover\/(\d+)$/);
    if (uploadMatch && req.method === 'POST') {
      const status = await getStatus();
      const proj = status.projects?.[parseInt(uploadMatch[1])];
      if (!proj?.path) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"Project not found"}'); return; }
      const coverDir = join(proj.path, 'publish', 'cover');
      mkdirSync(coverDir, { recursive: true });
      const chunks = [];
      let total = 0;
      let tooLarge = false;
      for await (const chunk of req) {
        chunks.push(chunk);
        total += chunk.length;
        // Bound the in-memory buffer to MAX_COVER_BYTES to avoid unbounded
        // uploads. The dashboard renders at ~112px; a multi-MB raw photo is
        // neither useful nor safe to accept verbatim.
        if (total > MAX_COVER_BYTES) { tooLarge = true; break; }
      }
      if (tooLarge) {
        // Reject and tear down the connection: breaking out of the for-await
        // left the remaining request body unconsumed, so destroy the stream
        // to release the socket instead of leaving it to time out.
        req.destroy();
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Cover too large' }));
        return;
      }
      const buf = Buffer.concat(chunks);
      let filename = basename(url.searchParams.get('filename') || 'cover.jpg');
      if (!IMG_EXTS.test(filename)) filename = 'cover.jpg';
      const fp = join(coverDir, filename);
      writeFileSync(fp, buf);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, path: fp }));
      return;
    }

    const dlMatch = url.pathname.match(/^\/download\/(\d+)\/(.+)$/);
    if (dlMatch) {
      const status = await getStatus();
      const proj = status.projects?.[parseInt(dlMatch[1])];
      if (!proj?.path) { res.writeHead(404); res.end('Not found'); return; }
      const fp = resolve(proj.path, 'publish', dlMatch[2]);
      const pubDir = resolve(proj.path, 'publish');
      if (!fp.startsWith(pubDir + '/') || !existsSync(fp) || statSync(fp).isDirectory()) { res.writeHead(403); res.end('Forbidden'); return; }
      const ext = extname(fp);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Disposition': `attachment; filename="${dlMatch[2]}"` });
      createReadStream(fp).pipe(res);
      return;
    }

    serveStatic(res, url.pathname);
  });

  const config = readJson(join(VELITH, 'config.json'), {});
  const port = config.port || DEFAULT_PORT;
  const host = config.host || '127.0.0.1';

  server.listen(port, host, () => {
    writeFileSync(PID_PATH, String(process.pid));
    console.log(`velith:${host === '0.0.0.0' ? '0.0.0.0' : '127.0.0.1'}:${port}`);
  });
}

// ─── CLI Router (only when run directly, not when imported) ──────────────────────

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.url.replace(/^file:\/\//, ''));
if (isMain) {
  const [,, cmd, ...rest] = process.argv;
  const commands = { scan: cmdScan, agents: cmdAgents, stats: cmdStats, words: cmdWords, list: cmdList, migrate: cmdMigrate, metrics: cmdMetrics, snapshot: cmdSnapshot, images: cmdImages, serve: cmdServe };
  const fn = commands[cmd];
  if (!fn) {
    console.log('Velith CLI — unified client for book project management');
    console.log('Usage: node velith.mjs <command> [args]');
    console.log('');
    console.log('Commands:');
    console.log('  scan [dir]              Scan project and write to SQLite');
    console.log('  agents <id> <status>    Update agent status');
    console.log('  stats [dir]             Query project stats from SQLite');
    console.log('  words <file>            Count lines/words/chars in file');
    console.log('  list                    List all projects in DB');
    console.log('  migrate                 Import existing JSON data into SQLite');
    console.log('  metrics <file|dir>      Prose metrics: rhythm, repetition, AI-tell counts (JSON)');
    console.log('  snapshot <dir> <label>  Copy drafts/ to .velith/snapshots/ before a rewrite');
    console.log('  images compile|check|render [dir] [id]  Model-agnostic prompts, asset validation, figure rendering');
    console.log('  serve                   Start dashboard server');
    console.log('');
    console.log('Flags:');
    console.log('  --ui                    Open dashboard after scan');
    console.log('  --plugin-root=<path>    Plugin root path');
    process.exit(0);
  }
  Promise.resolve(fn(rest)).catch(err => { console.error(err.message || err); process.exit(1); });
}
