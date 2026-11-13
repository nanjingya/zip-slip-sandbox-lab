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

test('does not treat a sibling with a shared prefix as inside root', () => {
  assert.throws(() => resolveSafe('/safe/root', '../root-evil/x.txt'));
});

test('blocks Windows drive prefixes and backslash traversal', () => {
  assert.throws(() => resolveSafe('/safe/root', 'C:/evil.txt'), /drive-prefixed/);
  assert.throws(() => resolveSafe('/safe/root', '..\\..\\evil.txt'), /escapes sandbox/);
});

test('blocks UNC entry paths with either separator style', () => {
  assert.throws(() => resolveSafe('/safe/root', '//server/share'), {
    code: 'UNC_ENTRY_PATH',
  });
  assert.throws(() => resolveSafe('/safe/root', '\\\\server\\share'), {
    code: 'UNC_ENTRY_PATH',
  });
});

test('canonicalizes a relative root before resolving entries', () => {
  assert.equal(resolveSafe('safe/../outside', 'ok.txt'), 'outside/ok.txt');
});

test('allows a safe root directory entry', () => {
  assert.equal(resolveSafe('/safe/root/', '.'), '/safe/root');
});
