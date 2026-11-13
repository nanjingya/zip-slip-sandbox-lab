import test from 'node:test';
import assert from 'node:assert/strict';
import { extractListing } from '../src/zipSandbox.js';
test('separates ok and blocked', () => {
  const entries = [
    { path: 'ok/a.txt', size: 1 },
    { path: '../evil', size: 1 },
    { path: 'nested/../b.txt', size: 1 }
  ];
  const r = extractListing(entries, '/safe/root');
  assert.equal(r.ok.length, 2);
  assert.equal(r.blocked.length, 1);
  assert.equal(r.blocked[0].path, '../evil');
  assert.ok(r.blocked[0].reason);
});

test('records malformed entries instead of silently skipping them', () => {
  const result = extractListing([
    { path: 'safe.txt' },
    { path: 'C:/windows.txt' },
    null,
  ], '/safe/root');

  assert.deepEqual(result.ok, [
    { path: 'safe.txt', dest: '/safe/root/safe.txt', size: null },
  ]);
  assert.deepEqual(result.blocked.map(item => item.path), ['C:/windows.txt', null]);
  assert.ok(result.blocked.every(item => item.reason));
});

test('blocks backslash parent traversal after path planning', () => {
  const result = extractListing([{ path: 'nested\\..\\..\\evil' }], '/safe/root');
  assert.equal(result.ok.length, 0);
  assert.equal(result.blocked[0].reason, 'PATH_OUTSIDE_ROOT');
});

test('rejects an invalid sandbox root before planning entries', () => {
  assert.throws(() => extractListing([], ''), /root must be a non-empty string/);
});
