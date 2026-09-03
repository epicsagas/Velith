// Velith CLI — unified client for book project management
// Usage: node velith.mjs <command> [args]
// Commands: scan, agents, stats, words, list, serve
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, renameSync, createReadStream } from 'node:fs';
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
  } else {
    _db = new SQL.Database();
    _db.run(`CREATE TABLE IF NOT EXISTS projects (
      path TEXT PRIMARY KEY, name TEXT NOT NULL, genre TEXT, language TEXT,
      current_phase INTEGER DEFAULT 0, total_chapters INTEGER DEFAULT 0,
      completed_chapters INTEGER DEFAULT 0, total_words INTEGER DEFAULT 0,
      target_words INTEGER DEFAULT 0, count_unit TEXT DEFAULT 'words',
      phase_status TEXT DEFAULT '[]', output_files TEXT DEFAULT '[]',
      cover_path TEXT, last_updated TEXT
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
    title: yamlTitle || (prd.match(/\*\*Title\*?\*?:\s*(.+)/i) || prd.match(/\*\*제목:\*\*\s*(.+)/) || prd.match(/^#\s*PRD[—:\-\s]+(.+)/im) || [, 'Untitled'])[1]?.trim(),
    genre: (yamlGenre || (prd.match(/\*\*Genre\*?\*?:\s*(.+)/i) || prd.match(/\*\*장르:\*\*\s*(.+)/) || [, 'unknown'])[1])?.trim().toLowerCase(),
    language: (yamlLang || (prd.match(/\*\*Language\*?\*?:\s*(.+)/i) || prd.match(/\*\*언어:\*\*\s*(.+)/) || [, 'ko'])[1])?.trim(),
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
  const planned = parseInt((prd.match(/(\d+)\s*(?:chapters|장|챕터)/i) || [, '0'])[1]);
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
  ];
  const edits = existsSync(editsPath) ? readdirSync(editsPath).filter(f => f.endsWith('.md')) : [];
  const hasEdits = edits.length > 0;
  const editStage = (() => {
    if (!hasEdits) return null;
    let last = null;
    for (const r of editReports) { if (edits.includes(r.file)) last = r.stage; else break; }
    return last;
  })();
  const editStartTime = hasEdits
    ? (() => { const r = editReports.find(r => edits.includes(r.file)); return r ? statSync(join(editsPath, r.file)).mtimeMs : null; })()
    : null;
  const editingComplete = hasEdits && edits.includes('editorial-report.md');

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
  const EDIT_STAGE_ORDER = ['assessment', 'developmental', 'line-edit', 'copy-edit', 'proofread'];
  const editStageIdx = editStage ? EDIT_STAGE_ORDER.indexOf(editStage) : -1;
  const editStageGte = (stage) => editStageIdx >= EDIT_STAGE_ORDER.indexOf(stage);

  const agentDefs = [
    { id: 'book-architect', name: 'Book Architect', icon: 'architecture', role: 'Structural design & outline planning', artifacts: ['PRD.md', 'STYLE.md', 'outline.md'] },
    { id: 'chapter-writer', name: 'Chapter Writer', icon: 'edit_note', role: 'Draft generation', artifacts: [] },
    { id: 'continuity-editor', name: 'Continuity Editor', icon: 'compare_arrows', role: 'Cross-chapter consistency', artifacts: [] },
    { id: 'cover-designer', name: 'Cover Designer', icon: 'palette', role: 'Cover design & brand identity', artifacts: ['publish/cover'] },
    { id: 'marketing-expert', name: 'Marketing Expert', icon: 'campaign', role: 'Marketing copy & launch', artifacts: ['publish/marketing-plan.md'] },
    { id: 'scene-generator', name: 'Scene Generator', icon: 'theaters', role: 'Scene creation & expansion', artifacts: [] },
    { id: 'style-doctor', name: 'Style Doctor', icon: 'medical_services', role: 'Style consistency & AI-slop detection', artifacts: [] },
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
    phase(4, 'Editing', has(dir, 'edits/editorial-report.md') ? 100 : edits.length > 0 ? 50 : 0, has(dir, 'edits/editorial-report.md') ? 'complete' : edits.length > 0 ? 'in_progress' : 'pending'),
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
  db.run(`INSERT OR REPLACE INTO projects (path, name, genre, language, current_phase, total_chapters, completed_chapters, total_words, target_words, count_unit, phase_status, output_files, cover_path, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [dir, meta.title, meta.genre, meta.language, current_phase, totalChapters, completedChapters, total_words, meta.target_words || 0, countUnit, JSON.stringify(phases), JSON.stringify(output_files), cover_path, now]);
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
    chapter_details, output_files, cover_path, last_updated: now,
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
  const line = (s) => `║  ${s.padEnd(w - 4)}║`;
  const sep = () => `╠${'═'.repeat(w - 2)}╣`;
  let out = `╔${'═'.repeat(w - 2)}╗\n`;
  out += line(`${meta.title}`);
  out += line(`${meta.genre} · ${meta.language} · ${planned || '?'} chapters`);
  out += sep();
  phases.forEach(p => out += line(`${p.phase}. ${p.name.padEnd(13)} ${bar(p.percent)} ${String(p.percent).padStart(3)}%  ${statusLabel(p.status)}`));
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
  const commands = { scan: cmdScan, agents: cmdAgents, stats: cmdStats, words: cmdWords, list: cmdList, migrate: cmdMigrate, serve: cmdServe };
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
    console.log('  serve                   Start dashboard server');
    console.log('');
    console.log('Flags:');
    console.log('  --ui                    Open dashboard after scan');
    console.log('  --plugin-root=<path>    Plugin root path');
    process.exit(0);
  }
  Promise.resolve(fn(rest)).catch(err => { console.error(err.message || err); process.exit(1); });
}
