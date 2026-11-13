const DRIVE_PATTERN = /^[A-Za-z]:/;

function requirePathString(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
  if (value.includes('\0')) {
    throw new Error(`${label} contains a null byte`);
  }
  return value;
}

function toForwardSlashes(path) {
  return path.replaceAll('\\', '/');
}

function hasDrivePrefix(path) {
  return DRIVE_PATTERN.test(path);
}

function isUncPath(path) {
  return path.startsWith('//') || path.startsWith('\\\\');
}

export function canonicalize(path) {
  requirePathString(path, 'path');
  const normalized = toForwardSlashes(path);
  const driveMatch = normalized.match(DRIVE_PATTERN);
  const drivePrefix = driveMatch ? `${driveMatch[0].toUpperCase()}/` : '';
  const withoutDrive = drivePrefix ? normalized.slice(driveMatch[0].length) : normalized;
  const isAbsolute = withoutDrive.startsWith('/') || drivePrefix.length > 0;
  const segments = withoutDrive.split('/').filter(segment => segment.length > 0 && segment !== '.');
  const stack = [];

  for (const segment of segments) {
    if (segment === '..') {
      if (stack.length > 0 && stack[stack.length - 1] !== '..') {
        stack.pop();
      } else if (!isAbsolute) {
        stack.push('..');
      }
    } else {
      stack.push(segment);
    }
  }

  const absolutePrefix = drivePrefix || (withoutDrive.startsWith('/') ? '/' : '');
  const joined = stack.join('/');
  return joined.length === 0 && absolutePrefix.length === 0 ? '.' : absolutePrefix + joined;
}

function assertInsideRoot(rootPath, candidatePath) {
  const rootWithSep = rootPath.endsWith('/') ? rootPath : `${rootPath}/`;
  if (candidatePath !== rootPath && !candidatePath.startsWith(rootWithSep)) {
    const error = new Error(`path escapes sandbox root: ${candidatePath}`);
    error.code = 'PATH_OUTSIDE_ROOT';
    throw error;
  }
}

export function resolveSafe(root, entryPath) {
  requirePathString(root, 'root');
  requirePathString(entryPath, 'entryPath');

  const normalizedEntry = toForwardSlashes(entryPath);
  if (isUncPath(entryPath)) {
    const error = new Error('UNC entry paths are not allowed');
    error.code = 'UNC_ENTRY_PATH';
    throw error;
  }
  if (normalizedEntry.startsWith('/') || entryPath.startsWith('\\')) {
    const error = new Error('absolute entry paths are not allowed');
    error.code = 'ABSOLUTE_ENTRY_PATH';
    throw error;
  }
  if (hasDrivePrefix(normalizedEntry)) {
    const error = new Error('drive-prefixed entry paths are not allowed');
    error.code = 'DRIVE_ENTRY_PATH';
    throw error;
  }
  const canonicalRoot = canonicalize(root);
  const candidate = canonicalize(`${canonicalRoot}/${normalizedEntry}`);
  assertInsideRoot(canonicalRoot, candidate);
  return candidate;
}
