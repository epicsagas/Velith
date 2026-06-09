import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path from 'path';
import os from 'os';

const VELITH_DIR = path.join(os.homedir(), '.velith');
const CACHE_DIR = path.join(VELITH_DIR, 'cache');
const CACHE_STATUS = path.join(CACHE_DIR, 'status.json');

function readJson(filePath: string): any | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function buildStatusJson(): object {
  // 1. Try centralized cache
  const cached = readJson(CACHE_STATUS);
  if (cached?.projects?.length) {
    return {
      generated_at: new Date().toISOString(),
      agents: cached.agents ?? [],
      projects: cached.projects.map((proj: any, idx: number) => {
        const p = { ...proj };
        if (p.path) {
          const coverDir = path.join(p.path, 'publish', 'cover');
          for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
            if (fs.existsSync(path.join(coverDir, `cover.${ext}`))) {
              p.cover_path = `/cover/${idx}`;
              break;
            }
          }
        }
        return p;
      }),
    };
  }

  // 2. Fallback: per-project reads (pre-cache)
  const registry = readJson(path.join(VELITH_DIR, 'projects.json'));
  const projectPaths: string[] = registry?.projects?.map((p: any) => p.path) ?? [];

  const allProjects: any[] = [];
  let latestAgents: any[] | null = null;

  for (const projectPath of projectPaths) {
    const statusFile = path.join(projectPath, '.velith', 'status.json');
    const data = readJson(statusFile);
    if (data?.projects?.length) {
      allProjects.push(...data.projects);
      if (!latestAgents && data.agents?.length) {
        latestAgents = data.agents;
      }
    }
  }

  if (!latestAgents || allProjects.length === 0) {
    const global = readJson(path.join(VELITH_DIR, 'status.json'));
    if (global) {
      latestAgents = latestAgents ?? global.agents ?? [];
      if (allProjects.length === 0) allProjects.push(...(global.projects ?? []));
    }
  }

  return {
    generated_at: new Date().toISOString(),
    agents: latestAgents ?? [],
    projects: allProjects,
  };
}

function velithApiPlugin() {
  return {
    name: 'velith-api',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = new URL(req.url, 'http://localhost');

        // GET /status.json
        if (req.method === 'GET' && url.pathname === '/status.json') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(buildStatusJson()));
          return;
        }

        // GET /cover/{index}
        const coverMatch = url.pathname.match(/^\/cover\/(\d+)$/);
        if (req.method === 'GET' && coverMatch) {
          const index = parseInt(coverMatch[1], 10);
          const status = buildStatusJson() as any;
          const project = status.projects?.[index];
          if (project?.path) {
            for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
              const f = path.join(project.path, 'publish', 'cover', `cover.${ext}`);
              if (fs.existsSync(f)) {
                const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
                res.writeHead(200, { 'Content-Type': mime });
                res.end(fs.readFileSync(f));
                return;
              }
            }
          }
          res.writeHead(404);
          res.end('');
          return;
        }

        // POST /api/cover/{index}?filename=cover.png
        const coverUploadMatch = url.pathname.match(/^\/api\/cover\/(\d+)$/);
        if (req.method === 'POST' && coverUploadMatch) {
          const index = parseInt(coverUploadMatch[1], 10);
          const filename = path.basename(url.searchParams.get('filename') || 'cover.jpg');
          const status = buildStatusJson() as any;
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

        // GET /download/{index}/{filename}
        const downloadMatch = url.pathname.match(/^\/download\/(\d+)\/(.+)$/);
        if (req.method === 'GET' && downloadMatch) {
          const index = parseInt(downloadMatch[1], 10);
          const filename = downloadMatch[2];
          const status = buildStatusJson() as any;
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
