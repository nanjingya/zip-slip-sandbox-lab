import { extractListing } from './zipSandbox.js';

export class SandboxEngine {
  constructor() {
    this.manifest = null;
    this.last = null;
  }

  load(manifest) {
    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
      throw new TypeError('manifest must be an object');
    }
    if (typeof manifest.root !== 'string' || manifest.root.length === 0) {
      throw new TypeError('manifest.root must be a non-empty string');
    }
    if (!Array.isArray(manifest.entries)) {
      throw new TypeError('manifest.entries must be an array');
    }
    this.manifest = manifest;
    this.last = null;
  }

  run() {
    if (!this.manifest) {
      throw new Error('load a manifest before running a dry-run');
    }
    this.last = extractListing(this.manifest.entries, this.manifest.root);
    return { extracted: this.last.ok.length, blocked: this.last.blocked.length, detail: this.last };
  }
}
