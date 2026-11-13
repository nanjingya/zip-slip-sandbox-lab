import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SandboxEngine } from '../src/engine.js';

test('runs the fixture manifest and reports safe and blocked counts', async () => {
  const manifest = JSON.parse(await readFile(new URL('../fixtures/manifest.json', import.meta.url)));
  const engine = new SandboxEngine();

  engine.load(manifest);
  const result = engine.run();

  assert.equal(result.extracted, 3);
  assert.equal(result.blocked, 2);
  assert.equal(result.detail.ok.length, result.extracted);
  assert.equal(result.detail.blocked.length, result.blocked);
});

test('requires a manifest before a dry-run', () => {
  const engine = new SandboxEngine();
  assert.throws(() => engine.run(), /load a manifest/);
});
