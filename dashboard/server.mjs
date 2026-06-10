#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOME = os.homedir();
const VELITH_DIR = path.join(HOME, '.velith');
const CONFIG_PATH = path.join(VELITH_DIR, 'config.json');
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

// Lazy-load getStatus from client.mjs (SQLite-backed)
let _getStatus = null;
async function getStatus() {
  if (!_getStatus) {
    const mod = await import('../client.mjs');
    _getStatus = mod.getStatus;
  }
  return _getStatus();
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

async function serveCover(res, projectIndex) {
  const status = await getStatus();
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
  const status = await getStatus();
  const proj = status.projects?.[projectIndex];
  if (!proj?.path) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"Project not found"}'); return; }
  const coverDir = path.join(proj.path, 'publish', 'cover');
  fs.mkdirSync(coverDir, { recursive: true });

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buf = Buffer.concat(chunks);

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
    const status = await getStatus();
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end(JSON.stringify({ ...status, generated_at: new Date().toISOString() }));
    return;
  }

  const coverMatch = url.pathname.match(/^\/cover\/(\d+)$/);
  if (coverMatch) {
    await serveCover(res, parseInt(coverMatch[1]));
    return;
  }

  const uploadMatch = url.pathname.match(/^\/api\/cover\/(\d+)$/);
  if (uploadMatch && req.method === 'POST') {
    await handleUpload(req, res, parseInt(uploadMatch[1]));
    return;
  }

  const dlMatch = url.pathname.match(/^\/download\/(\d+)\/(.+)$/);
  if (dlMatch) {
    const status = await getStatus();
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
