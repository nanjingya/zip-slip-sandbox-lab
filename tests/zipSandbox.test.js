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
