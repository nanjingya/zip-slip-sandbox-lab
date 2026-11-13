// TODO: harden
export function resolveSafe(root, entryPath) {
  return root + '/' + entryPath; // intentionally unsafe
}
