import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path from 'path';

const IMG_EXTS = /\.(jpg|jpeg|png|webp|gif)$/i;

// Lazy-load getStatus from velith.mjs (SQLite-backed)
let _getStatus: (() => Promise<any>) | null = null;
async function getStatus() {
  if (!_getStatus) {
    const mod = await import('../velith.mjs');
    _getStatus = mod.getStatus;
  }
  return _getStatus();
}

function velithApiPlugin() {
  return {
    name: 'velith-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = new URL(req.url, 'http://localhost');

        if (req.method === 'GET' && url.pathname === '/status.json') {
          const status = await getStatus();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ...status, generated_at: new Date().toISOString() }));
          return;
        }

        const coverMatch = url.pathname.match(/^\/cover\/(\d+)$/);
        if (req.method === 'GET' && coverMatch) {
          const index = parseInt(coverMatch[1], 10);
          const status = await getStatus();
          const project = status.projects?.[index];
          if (project?.path) {
            const coverDir = path.join(project.path, 'publish', 'cover');
            try {
              const files = fs.readdirSync(coverDir).filter((f: string) => IMG_EXTS.test(f));
              if (files.length > 0) {
                const cover = files.find((f: string) => /^cover\./i.test(f)) || files[0];
                const fp = path.join(coverDir, cover);
                const ext = path.extname(fp).slice(1);
                const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
                res.writeHead(200, { 'Content-Type': mime });
                res.end(fs.readFileSync(fp));
                return;
              }
            } catch {}
          }
          res.writeHead(404);
          res.end('');
          return;
        }

        const coverUploadMatch = url.pathname.match(/^\/api\/cover\/(\d+)$/);
        if (req.method === 'POST' && coverUploadMatch) {
          const index = parseInt(coverUploadMatch[1], 10);
          const filename = path.basename(url.searchParams.get('filename') || 'cover.jpg');
          const status = await getStatus();
          const project = status.projects?.[index];
          if (project?.path) {
            const coverDir = path.join(project.path, 'publish', 'cover');
            fs.mkdirSync(coverDir, { recursive: true });
            const chunks: Buffer[] = [];
            req.on('data', (c: Buffer) => chunks.push(c));
            req.on('end', () => {
              fs.writeFileSync(path.join(coverDir, filename), Buffer.concat(chunks));
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true }));
            });
            return;
          }
          res.writeHead(404);
          res.end('');
          return;
        }

        const downloadMatch = url.pathname.match(/^\/download\/(\d+)\/(.+)$/);
        if (req.method === 'GET' && downloadMatch) {
          const index = parseInt(downloadMatch[1], 10);
          const filename = downloadMatch[2];
          const status = await getStatus();
          const project = status.projects?.[index];
          if (project?.path) {
            const f = path.resolve(project.path, 'publish', filename);
            const pubDir = path.resolve(project.path, 'publish');
            if (f.startsWith(pubDir + path.sep) && fs.existsSync(f)) {
              res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${filename}"`,
              });
              res.end(fs.readFileSync(f));
              return;
            }
          }
          res.writeHead(404);
          res.end('');
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [svelte(), velithApiPlugin()],
  resolve: {
    conditions: ['browser'],
  },
});
