export function bindControls({ engine, els }) {
  const { status, log, stats, preview, btnLoad, btnRun, btnExport } = els;
  let lastExport = null;
  btnLoad.onclick = async () => {
    try {
      const res = await fetch('fixtures/manifest.json');
      const data = await res.json();
      engine.load(data);
      status.textContent = 'ready';
      preview.textContent = JSON.stringify(data, null, 2);
    } catch (e) { status.textContent = String(e.message || e); }
  };
  btnRun.onclick = () => {
    try {
      const r = engine.run();
      lastExport = r;
      stats.textContent = `extracted=${r.extracted} blocked=${r.blocked}`;
      log.textContent = JSON.stringify(r.detail, null, 2);
      status.textContent = 'ready';
    } catch (e) { status.textContent = String(e.message || e); }
  };
  btnExport.onclick = () => { preview.textContent = JSON.stringify(lastExport || {}, null, 2); };
}
