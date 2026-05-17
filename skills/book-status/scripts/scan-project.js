#!/usr/bin/env node
// Scan book project and write status.json + update projects registry.
// Usage: node scan-project.js [project-dir] [--ui]
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, basename } from 'node:path';
import { execSync } from 'node:child_process';

const HOME = homedir();
const VELITH = join(HOME, '.velith');
const IMG_EXTS = /\.(jpg|jpeg|png|webp|gif)$/i;

const args = process.argv.slice(2);
const ui = args.includes('--ui');
const pluginRoot = (args.find(a => a.startsWith('--plugin-root=')) || '').slice('--plugin-root='.length) || null;
const dir = args.find(a => !a.startsWith('--')) || process.cwd();

// --- helpers ---
const read = (p, fb) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return fb; } };
const has = (f) => existsSync(join(dir, f));
const lines = (p) => { try { return parseInt(execSync(`wc -l < "${p}"`, { encoding: 'utf8' }).trim()); } catch { return 0; } };
const words = (p) => { try { return parseInt(execSync(`wc -w < "${p}"`, { encoding: 'utf8' }).trim()); } catch { return 0; } };

// --- scan ---
const prd = has('PRD.md') ? readFileSync(join(dir, 'PRD.md'), 'utf8') : '';
const meta = {
  title: (prd.match(/\*\*Title\*?\*?:\s*(.+)/i) || prd.match(/\*\*제목:\*\*\s*(.+)/) || prd.match(/#\s*PRD[—\-\s]+(.+)/i) || [,'Untitled'])[1]?.trim(),
  genre: (prd.match(/\*\*Genre\*?\*?:\s*(.+)/i) || prd.match(/\*\*장르:\*\*\s*(.+)/) || [,'unknown'])[1]?.trim().toLowerCase(),
  language: (prd.match(/\*\*Language\*?\*?:\s*(.+)/i) || prd.match(/\*\*언어:\*\*\s*(.+)/) || [,'ko'])[1]?.trim(),
  target_words: parseInt((prd.match(/(\d[\d,]+)\s*(?:words|자|글자)/i) || [,'0'])[1]?.replace(/,/g, '')),
};
const draftsDir = (prd.match(/drafts_dir:\s*(\S+)/i) || prd.match(/\*\*초안\s*경로:\*\*\s*(\S+)/) || [,'drafts'])[1];
const planned = parseInt((prd.match(/(\d+)\s*(?:chapters|장|챕터)/i) || [,'0'])[1]);

// draft scan — fall back to drafts/ if specified path doesn't exist
let draftsPath = join(dir, draftsDir);
if (!existsSync(draftsPath) && draftsDir !== 'drafts') draftsPath = join(dir, 'drafts');
const drafts = existsSync(draftsPath) ? readdirSync(draftsPath).filter(f => f.endsWith('.md')).sort() : [];
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

const chapter_details = drafts.map(f => {
  const fp = join(draftsPath, f);
  return { filename: f, title: basename(f, '.md').replace(/^ch\d+[-_]?/i, '').replace(/[-_]/g, ' '), lines: lines(fp), words: words(fp), status: hasEdits ? 'edit' : 'draft', edit_stage: editStage };
});
const total_words = chapter_details.reduce((s, c) => s + c.words, 0);

// cover scan
let cover_path = null;
const coverDir = join(dir, 'publish', 'cover');
if (existsSync(coverDir)) {
  const imgs = readdirSync(coverDir).filter(f => IMG_EXTS.test(f));
  if (imgs.length) cover_path = imgs.find(f => /^cover\./i.test(f)) || imgs[0];
}

// publish files
const formats = ['epub', 'pdf', 'mobi', 'txt', 'md'];
const output_files = formats.map(fmt => {
  const p = join(dir, 'publish', `book.${fmt}`);
  return { name: `book.${fmt}`, exists: existsSync(p), size_bytes: existsSync(p) ? statSync(p).size : 0 };
});

// agent defaults + artifact-based status inference
const agentDefs = [
  { id: 'book-architect', name: 'Book Architect', icon: 'architecture', role: 'Structural design & outline planning', artifacts: ['PRD.md', 'STYLE.md', 'outline.md'] },
  { id: 'chapter-writer', name: 'Chapter Writer', icon: 'edit_note', role: 'Draft generation', artifacts: [] },
  { id: 'continuity-editor', name: 'Continuity Editor', icon: 'compare_arrows', role: 'Cross-chapter consistency', artifacts: [] },
  { id: 'cover-designer', name: 'Cover Designer', icon: 'palette', role: 'Cover design & brand identity', artifacts: ['publish/cover'] },
  { id: 'marketing-expert', name: 'Marketing Expert', icon: 'campaign', role: 'Marketing copy & launch', artifacts: [] },
  { id: 'scene-generator', name: 'Scene Generator', icon: 'theaters', role: 'Scene creation & expansion', artifacts: [] },
  { id: 'style-doctor', name: 'Style Doctor', icon: 'medical_services', role: 'Style consistency & AI-slop detection', artifacts: [] },
];
const agentsDir = join(dir, '.velith', 'agents');
const agents = agentDefs.map(a => {
  const sf = join(agentsDir, `${a.id}.json`);
  const s = existsSync(sf) ? read(sf, {}) : {};
  let status = s.status || null;
  if (!status) {
    if (a.artifacts.length > 0 && a.artifacts.every(f => existsSync(join(dir, f)))) status = 'complete';
    else if (a.id === 'chapter-writer' && drafts.length > 0) status = drafts.length < (planned || Infinity) ? 'running' : 'complete';
    else if (a.id === 'style-doctor' && editStage === 'proofread') status = 'complete';
    else if (a.id === 'continuity-editor' && editStage === 'developmental') status = 'complete';
    else status = 'idle';
  }
  return { id: a.id, name: a.name, icon: a.icon, role: a.role, status, last_run: s.last_run || null, task: s.task || null };
});

// phases
const phase = (n, name, pct, st) => ({ phase: n, name, percent: pct, status: st });
const phases = [
  phase(0, 'Onboarding', has('PRD.md') && has('STYLE.md') ? 100 : has('PRD.md') ? 50 : 0, has('PRD.md') && has('STYLE.md') ? 'complete' : has('PRD.md') ? 'in_progress' : 'pending'),
  phase(1, 'Ideation', has('ideation.md') ? 100 : 0, has('ideation.md') ? 'complete' : 'pending'),
  phase(2, 'Outlining', has('outline.md') ? 100 : 0, has('outline.md') ? 'complete' : 'pending'),
  phase(3, 'Drafting', planned ? Math.round(drafts.length / planned * 100) : 0, drafts.length > 0 && drafts.length < planned ? 'in_progress' : drafts.length >= planned && planned > 0 ? 'complete' : 'pending'),
  phase(4, 'Editing', has('edits/editorial-report.md') ? 100 : edits.length > 0 ? 50 : 0, has('edits/editorial-report.md') ? 'complete' : edits.length > 0 ? 'in_progress' : 'pending'),
  phase(5, 'Publishing', output_files.some(f => f.exists && f.name.match(/epub|pdf/)) ? 100 : 0, output_files.some(f => f.exists && f.name.match(/epub|pdf/)) ? 'complete' : 'pending'),
];
const current_phase = (() => { const ip = phases.find(p => p.status === 'in_progress'); if (ip) return ip.phase; const last = [...phases].reverse().find(p => p.status === 'complete'); return last ? last.phase + 1 : 0; })();

// --- build JSON ---
const now = new Date().toISOString();
const project = {
  name: meta.title, path: dir, genre: meta.genre, language: meta.language,
  current_phase, phase_status: phases,
  total_chapters: planned || drafts.length, completed_chapters: drafts.length,
  total_words, target_words: meta.target_words || 0,
  chapter_details, output_files, cover_path,
  last_updated: now,
};
const statusJson = { generated_at: now, agents, projects: [project] };

// --- write ---
mkdirSync(join(dir, '.velith'), { recursive: true });
mkdirSync(join(dir, '.velith', 'agents'), { recursive: true });
writeFileSync(join(dir, '.velith', 'status.json'), JSON.stringify(statusJson, null, 2));

// update registry
const regPath = join(VELITH, 'projects.json');
const reg = read(regPath, { projects: [] });
const idx = reg.projects.findIndex(p => p.path === dir);
const entry = { path: dir, name: meta.title, updated: now };
if (idx >= 0) reg.projects[idx] = entry; else reg.projects.push(entry);
writeFileSync(regPath, JSON.stringify(reg, null, 2));

console.log(`status.json written → ${join(dir, '.velith', 'status.json')}`);

// --- terminal dashboard ---
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
chapter_details.forEach(c => out += line(`${c.filename.padEnd(20)} ${String(c.lines).padStart(5)} lines  ${String(c.words).padStart(5)} words  [${c.status}]`));
if (chapter_details.length) out += line(`Total: ${total_words} words · Target: ${meta.target_words || '?'}`);
out += sep();
output_files.forEach(f => out += line(`${f.name.padEnd(12)} ${f.exists ? '✓ exists' : '✗ missing'}${f.size_bytes ? ` (${(f.size_bytes / 1024).toFixed(0)}KB)` : ''}`));
out += `╚${'═'.repeat(w - 2)}╝\n`;
console.log(out);

// --- --ui flag ---
if (ui) {
  const config = read(join(VELITH, 'config.json'), {});
  const port = config.port || 9631;
  try { execSync(`curl -sf http://127.0.0.1:${port}/status.json`, { stdio: 'pipe' }); }
  catch {
    const serverPath = pluginRoot ? join(pluginRoot, 'dashboard', 'server.mjs') : join(dir, '..', '..', 'dashboard', 'server.mjs');
    execSync(`nohup node "${serverPath}" > /dev/null 2>&1 &`, { stdio: 'ignore' });
  }
  const pidx = Math.max(0, reg.projects.findIndex(p => p.path === dir));
  execSync(`open http://127.0.0.1:${port}/${pidx}/overview`, { stdio: 'ignore' });
}
