import { SandboxEngine } from './engine.js';
import { bindControls } from './ui/controls.js';
const engine = new SandboxEngine();
const els = {
  status: document.querySelector('#status'),
  log: document.querySelector('#log'),
  stats: document.querySelector('#stats'),
  preview: document.querySelector('#preview'),
  btnLoad: document.querySelector('#btn-load'),
  btnRun: document.querySelector('#btn-run'),
  btnExport: document.querySelector('#btn-export'),
};
bindControls({ engine, els });
els.status.textContent = 'ready';
