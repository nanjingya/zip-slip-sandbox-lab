import { resolveSafe } from './pathGuard.js';
export function extractListing(entries, root) {
  return { ok: entries.map(e => ({ path: e.path, dest: resolveSafe(root, e.path) })), blocked: [] };
}
