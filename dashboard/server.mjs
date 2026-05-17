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

function buildStatus() {
  const registry = getRegistry();
  const projects = [];
  const agentMap = new Map();
  for (const [idx, entry] of (registry.projects || []).entries()) {
    const sp = path.join(entry.path, '.velith', 'status.json');
    const data = readJson(sp, null);
    if (!data) continue;
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
      projects.push(proj);
    }
    if (Array.isArray(data.agents)) {
      for (const a of data.agents) {
        if (a?.id) agentMap.set(a.id, a);
      }
    }
  }
  return { projects, agents: Array.from(agentMap.values()), generated_at: new Date().toISOString() };
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

  serveStatic(res, url.pathname);
});

const config = readJson(CONFIG_PATH, {});
const port = config.port || DEFAULT_PORT;

server.listen(port, '127.0.0.1', () => {
  fs.writeFileSync(PID_PATH, String(process.pid));
  console.log(`velith:${port}`);
});
