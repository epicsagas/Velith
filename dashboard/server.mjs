#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOME = os.homedir();
const VELITH_DIR = path.join(HOME, '.velith');
const CONFIG_PATH = path.join(VELITH_DIR, 'config.json');
const REGISTRY_PATH = path.join(VELITH_DIR, 'projects.json');
const PID_PATH = path.join(VELITH_DIR, 'server.pid');
const DIST_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), 'dist');
const DEFAULT_PORT = 9631;

const IMG_EXTS = /\.(jpg|jpeg|png|webp|gif)$/i;

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

function readJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

function getRegistry() {
  return readJson(REGISTRY_PATH, { projects: [] });
}

function getProjectDir(index) {
  const reg = getRegistry();
  const entry = reg.projects?.[index];
  return entry?.path || null;
}

// In-memory cache invalidated by fs.watch on each project's status.json
let cachedStatus = null;
const statusWatchers = new Map();

function buildStatusFresh() {
  const registry = getRegistry();
  const projects = [];
  const agentMap = new Map();
  const activePaths = new Set();
  for (const [idx, entry] of (registry.projects || []).entries()) {
    const sp = path.join(entry.path, '.velith', 'status.json');
    const data = readJson(sp, null);
    if (!data) continue;
    activePaths.add(sp);
    // Watch this project's status.json for changes
    if (!statusWatchers.has(sp)) {
      try {
        const watcher = fs.watch(sp, () => { cachedStatus = null; });
        watcher.on('error', () => {});
        statusWatchers.set(sp, watcher);
      } catch {}
    }
    // Extract project records from status.json (format: { generated_at, agents, projects: [...] })
    for (const proj of data.projects || []) {
      // Attach cover image path
      const coverDir = path.join(entry.path, 'publish', 'cover');
      try {
        const files = fs.readdirSync(coverDir).filter(f => IMG_EXTS.test(f));
        if (files.length > 0) {
          const cover = files.find(f => /^cover\./i.test(f)) || files[0];
          proj.cover_path = `/cover/${idx}`;
          proj.cover_file = cover;
        }
      } catch {}
      // Attach per-project agents so each project has its own agent statuses
      proj.agents = Array.isArray(data.agents) ? data.agents : [];
      projects.push(proj);
    }
    // Also build a global agent list for backward compat — merge by picking the
    // most-progressed status per agent id across all projects:
    //   complete > running > disabled > idle
    if (Array.isArray(data.agents)) {
      const rank = { complete: 3, running: 2, disabled: 1, idle: 0 };
      for (const a of data.agents) {
        if (!a?.id) continue;
        const existing = agentMap.get(a.id);
        if (!existing || (rank[a.status] || 0) > (rank[existing.status] || 0)) {
          agentMap.set(a.id, a);
        }
      }
    }
  }
  // Remove watchers for projects no longer in the registry
  for (const [sp, watcher] of statusWatchers) {
    if (!activePaths.has(sp)) {
      watcher.close();
      statusWatchers.delete(sp);
    }
  }
  return { projects, agents: Array.from(agentMap.values()), generated_at: new Date().toISOString() };
}

function buildStatus() {
  if (!cachedStatus) {
    cachedStatus = buildStatusFresh();
  }
  // Update timestamp even on cache hit so UI knows it's alive
  cachedStatus.generated_at = new Date().toISOString();
  return cachedStatus;
}

function serveStatic(res, urlPath) {
  let fp = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) fp = path.join(DIST_DIR, 'index.html');
  const ext = path.extname(fp);
  try {
    const buf = fs.readFileSync(fp);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}

function serveCover(res, projectIndex) {
  const projDir = getProjectDir(projectIndex);
  if (!projDir) { res.writeHead(404); res.end('Not found'); return; }
  const coverDir = path.join(projDir, 'publish', 'cover');
  try {
    const files = fs.readdirSync(coverDir).filter(f => IMG_EXTS.test(f));
    if (files.length === 0) { res.writeHead(404); res.end('No cover'); return; }
    const cover = files.find(f => /^cover\./i.test(f)) || files[0];
    const fp = path.join(coverDir, cover);
    const ext = path.extname(fp);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'image/jpeg', 'Cache-Control': 'public, max-age=60' });
    fs.createReadStream(fp).pipe(res);
  } catch {
    res.writeHead(404); res.end('No cover');
  }
}

async function handleUpload(req, res, projectIndex) {
  const projDir = getProjectDir(projectIndex);
  if (!projDir) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"Project not found"}'); return; }
  const coverDir = path.join(projDir, 'publish', 'cover');
  fs.mkdirSync(coverDir, { recursive: true });

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buf = Buffer.concat(chunks);

  // Read filename from content-disposition or query param
  const url = new URL(req.url, `http://${req.headers.host}`);
  let filename = url.searchParams.get('filename') || 'cover.jpg';
  if (!IMG_EXTS.test(filename)) filename += '.jpg';

  const fp = path.join(coverDir, filename);
  fs.writeFileSync(fp, buf);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, path: fp }));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/status.json') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end(JSON.stringify(buildStatus()));
    return;
  }

  // Cover image serving: /cover/{projectIndex}
  const coverMatch = url.pathname.match(/^\/cover\/(\d+)$/);
  if (coverMatch) {
    serveCover(res, parseInt(coverMatch[1]));
    return;
  }

  // Cover upload: POST /api/cover/{projectIndex}
  const uploadMatch = url.pathname.match(/^\/api\/cover\/(\d+)$/);
  if (uploadMatch && req.method === 'POST') {
    await handleUpload(req, res, parseInt(uploadMatch[1]));
    return;
  }

  // Download publish file: /download/{projectIndex}/{filename}
  const dlMatch = url.pathname.match(/^\/download\/(\d+)\/(.+)$/);
  if (dlMatch) {
    const projDir = getProjectDir(parseInt(dlMatch[1]));
    if (!projDir) { res.writeHead(404); res.end('Not found'); return; }
    const fp = path.join(projDir, 'publish', dlMatch[2]);
    if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(fp);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Disposition': `attachment; filename="${dlMatch[2]}"` });
    fs.createReadStream(fp).pipe(res);
    return;
  }

  serveStatic(res, url.pathname);
});

const config = readJson(CONFIG_PATH, {});
const port = config.port || DEFAULT_PORT;
const host = config.host || '127.0.0.1';

server.listen(port, host, () => {
  fs.writeFileSync(PID_PATH, String(process.pid));
  console.log(`velith:${host === '0.0.0.0' ? '0.0.0.0' : '127.0.0.1'}:${port}`);
});
