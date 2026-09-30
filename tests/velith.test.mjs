import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { isInside, findCmd } from '../velith.mjs';

test('isInside accepts children and rejects traversal and siblings', () => {
  const d = path.resolve('/srv/dist');
  assert.equal(isInside(d, path.join(d, 'assets', 'a.js')), true);
  assert.equal(isInside(d, path.join(d, '..', 'secret')), false);
  assert.equal(isInside(d, d + '-evil/x.js'), false);
  assert.equal(isInside(d, d), false);
});

test('isInside holds with Windows separators (the POSIX-only startsWith bug)', () => {
  const w = path.win32;
  const d = w.join('C:\\Users\\a\\velith', 'dashboard', 'dist');
  const rel = w.relative(d, w.join(d, '/assets/index.js'));
  assert.ok(!rel.startsWith('..') && !w.isAbsolute(rel));
  assert.equal(w.join(d, '/assets/index.js').startsWith(d + '/'), false, 'the old guard fails on Windows');
});

test('findCmd resolves node on PATH and misses nonsense', () => {
  assert.ok(findCmd('node'));
  assert.equal(findCmd('velith-no-such-binary-xyz'), null);
});
