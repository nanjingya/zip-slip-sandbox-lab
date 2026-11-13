import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSafe } from '../src/pathGuard.js';
test('allows nested relative path inside root', () => {
  const dest = resolveSafe('/safe/root', 'ok/a.txt');
  assert.equal(dest, '/safe/root/ok/a.txt');
});
test('blocks parent traversal', () => {
  assert.throws(() => resolveSafe('/safe/root', '../etc/passwd'));
});
test('blocks absolute entry', () => {
  assert.throws(() => resolveSafe('/safe/root', '/abs/x'));
});
test('normalizes but keeps inside root', () => {
  const dest = resolveSafe('/safe/root', 'ok/../ok/c.txt');
  assert.equal(dest, '/safe/root/ok/c.txt');
});
