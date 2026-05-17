#!/usr/bin/env node
// Shared agent status tracker. Usage: node agent-status.js <agent-id> <running|complete|error> [task-message]
import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [,, id, status, task] = process.argv;
if (!id || !status) { console.error('Usage: agent-status.js <id> <running|complete|error> [task]'); process.exit(1); }

const dir = join(homedir(), '.velith', 'agents');
mkdirSync(dir, { recursive: true });

const now = new Date().toISOString();
const data = { status, last_run: now, task: status === 'complete' ? null : (task || null) };
writeFileSync(join(dir, `${id}.json`), JSON.stringify(data));
console.log(JSON.stringify(data));
