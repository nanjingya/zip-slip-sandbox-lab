import { resolveSafe } from './pathGuard.js';

export function extractListing(entries, root) {
  if (!Array.isArray(entries)) {
    throw new TypeError('entries must be an array');
  }
  if (typeof root !== 'string' || root.length === 0) {
    throw new TypeError('root must be a non-empty string');
  }

  const ok = [];
  const blocked = [];

  for (const entry of entries) {
    const path = entry && typeof entry === 'object' ? entry.path : undefined;
    try {
      const dest = resolveSafe(root, path);
      ok.push({
        path,
        dest,
        size: typeof entry.size === 'number' ? entry.size : null,
      });
    } catch (error) {
      blocked.push({
        path: typeof path === 'string' ? path : null,
        reason: error.code || error.message,
      });
    }
  }

  return { ok, blocked };
}
