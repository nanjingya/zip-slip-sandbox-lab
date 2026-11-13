export function bindControls({ engine, els }) {
  const { status, log, stats, preview, btnLoad, btnRun, btnExport } = els;
  let lastExport = null;

  btnLoad.onclick = async () => {
    try {
      const res = await fetch('fixtures/manifest.json');
      if (!res.ok) {
        throw new Error(`failed to load manifest: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      engine.load(data);
      lastExport = null;
      log.textContent = '';
      stats.textContent = '';
      status.textContent = 'ready';
      preview.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      status.textContent = error.message || String(error);
    }
  };

  btnRun.onclick = () => {
    try {
      const result = engine.run();
      lastExport = result;
      stats.textContent = `extracted=${result.extracted} blocked=${result.blocked}`;
      log.textContent = JSON.stringify(result.detail, null, 2);
      status.textContent = 'ready';
    } catch (error) {
      status.textContent = error.message || String(error);
    }
  };

  btnExport.onclick = () => {
    try {
      if (!lastExport) {
        throw new Error('run a dry-run before exporting JSON');
      }
      const json = JSON.stringify(lastExport, null, 2);
      preview.textContent = json;
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'zip-sandbox-dry-run.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      status.textContent = 'ready';
    } catch (error) {
      status.textContent = error.message || String(error);
    }
  };
}
