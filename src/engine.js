import { extractListing } from './zipSandbox.js';
export class SandboxEngine {
  constructor() { this.last = null; }
  load(manifest) { this.manifest = manifest; }
  run() {
    this.last = extractListing(this.manifest.entries, this.manifest.root);
    return { extracted: this.last.ok.length, blocked: this.last.blocked.length, detail: this.last };
  }
}
