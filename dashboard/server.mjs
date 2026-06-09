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
const CACHE_DIR = path.join(VELITH_DIR, 'cache');
const CACHE_STATUS = path.join(CACHE_DIR, 'status.json');
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

// In-memory cache invalidated by fs.watch
let cachedStatus = null;
const statusWatchers = new Map();
let cacheWatcher = null;
let cacheWatchRetries = 0;

function ensureCacheWatcher() {
  if (cacheWatcher || cacheWatchRetries >= 20) return;
  cacheWatchRetries++;
  try {
    cacheWatcher = fs.watch(CACHE_STATUS, (eventType) => {
      cachedStatus = null;
      cacheWatchRetries = 0;
      if (eventType === 'rename') {
        cacheWatcher.close();
        cacheWatcher = null;
        setTimeout(ensureCacheWatcher, 100);
      }
    });
    cacheWatcher.on('error', () => { cacheWatcher = null; });
  } catch {}
}

function enrichFromCache(cached) {
  const projects = cached.projects.map((proj, idx) => {
    const p = { ...proj };
    if (p.path) {
      const coverDir = path.join(p.path, 'publish', 'cover');
      try {
        const files = fs.readdirSync(coverDir).filter(f => IMG_EXTS.test(f));
        if (files.length > 0) {
          p.cover_path = `/cover/${idx}`;
          p.cover_file = files.find(f => /^cover\./i.test(f)) || files[0];
        }
      } catch {}
    }
    p.agents = Array.isArray(cached.agents) ? [...cached.agents] : [];
    return p;
  });
  return { projects, agents: cached.agents || [], generated_at: new Date().toISOString() };
}

function buildFromProjectDirs() {
  const registry = getRegistry();
  const projects = [];
  const agentMap = new Map();
  const activePaths = new Set();
  for (const [idx, entry] of (registry.projects || []).entries()) {
    const sp = path.join(entry.path, '.velith', 'status.json');
    const data = readJson(sp, null);
    if (!data) continue;
    activePaths.add(sp);
    if (!statusWatchers.has(sp)) {
      try {
        const watcher = fs.watch(sp, (eventType) => {
          cachedStatus = null;
          if (eventType === 'rename') { watcher.close(); statusWatchers.delete(sp); }
        });
        watcher.on('error', () => { statusWatchers.delete(sp); });
        statusWatchers.set(sp, watcher);
      } catch (e) { console.error('[velith] fs.watch failed:', sp, e.message); }
    }
    for (const proj of data.projects || []) {
      const coverDir = path.join(entry.path, 'publish', 'cover');
      try {
        const files = fs.readdirSync(coverDir).filter(f => IMG_EXTS.test(f));
        if (files.length > 0) {
          const cover = files.find(f => /^cover\./i.test(f)) || files[0];
          proj.cover_path = `/cover/${idx}`;
          proj.cover_file = cover;
        }
      } catch {}
      proj.agents = Array.isArray(data.agents) ? data.agents : [];
      projects.push(proj);
    }
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
  for (const [sp, watcher] of statusWatchers) {
    if (!activePaths.has(sp)) { watcher.close(); statusWatchers.delete(sp); }
  }
  return { projects, agents: Array.from(agentMap.values()), generated_at: new Date().toISOString() };
}

function buildStatusFresh() {
  const cached = readJson(CACHE_STATUS, null);
  if (cached?.projects?.length) {
    ensureCacheWatcher();
    return enrichFromCache(cached);
  }
  return buildFromProjectDirs();
}

function buildStatus() {
  if (!cachedStatus) {
    cachedStatus = buildStatusFresh();
  }
  // Spread to avoid mutating the cached object — generated_at signals server liveness to the UI
  return { ...cachedStatus, generated_at: new Date().toISOString() };
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
  const status = buildStatus();
  const proj = status.projects?.[projectIndex];
  if (!proj?.path) { res.writeHead(404); res.end('Not found'); return; }
  const coverDir = path.join(proj.path, 'publish', 'cover');
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
  const status = buildStatus();
  const proj = status.projects?.[projectIndex];
  if (!proj?.path) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"Project not found"}'); return; }
  const coverDir = path.join(proj.path, 'publish', 'cover');
  fs.mkdirSync(coverDir, { recursive: true });

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buf = Buffer.concat(chunks);

  // Read filename from content-disposition or query param
  const url = new URL(req.url, `http://${req.headers.host}`);
  let filename = path.basename(url.searchParams.get('filename') || 'cover.jpg');
  if (!IMG_EXTS.test(filename)) filename = 'cover.jpg';

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
    const status = buildStatus();
    const proj = status.projects?.[parseInt(dlMatch[1])];
    if (!proj?.path) { res.writeHead(404); res.end('Not found'); return; }
    const fp = path.resolve(proj.path, 'publish', dlMatch[2]);
    const pubDir = path.resolve(proj.path, 'publish');
    if (!fp.startsWith(pubDir + path.sep) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(403); res.end('Forbidden'); return; }
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
