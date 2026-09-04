import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = root + '/agents';
let n = 0;
for (const f of readdirSync(dir).filter(f => f.endsWith('.md'))) {
  const src = readFileSync(`${dir}/${f}`, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { console.error('no frontmatter', f); process.exit(1); }
  const fm = m[1], body = m[2].trim();
  const get = k => (fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1]?.trim().replace(/^"(.*)"$/, '$1');
  const name = get('name'), desc = get('description');
  if (body.includes("'''")) { console.error('body contains triple single quote', f); process.exit(1); }
  const codexBody = body.replaceAll('${CLAUDE_PLUGIN_ROOT}', '{PLUGIN_ROOT}');
  const toml = `name = "${name}"\ndescription = "${desc.replace(/"/g, '\\"')}"\n\n# {PLUGIN_ROOT} = the directory containing velith.mjs (Codex does not substitute it automatically).\ndeveloper_instructions = '''\n${codexBody}\n'''\n`;
  writeFileSync(`${root}/.codex-plugin/agents/${name}.toml`, toml);
  n++;
}
console.log('wrote', n, 'toml files');
