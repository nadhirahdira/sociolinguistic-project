// Upload queue: sends each recording to Supabase Storage and each data row
// to the sessions table, one at a time, retrying with back-off if the
// connection drops. Participants can only INSERT (no read/overwrite), so a
// retry of a file that actually arrived returns "already exists" — that is
// treated as success.
window.Uploader = (() => {
  const enabled = !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_KEY);
  const client = enabled
    ? supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      })
    : null;

  const MAX_ATTEMPTS = 6;
  const items = [];   // { kind, label, path?, blob?, row?, status, attempts, error }
  const listeners = [];
  let running = false;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const notify = () => listeners.forEach((fn) => { try { fn(items); } catch (e) { console.error(e); } });

  function isDuplicate(err) {
    const code = String(err.statusCode || err.status || err.code || "");
    return code === "409" || code === "23505" || /exist|duplicate/i.test(err.message || "");
  }

  async function sendOnce(item) {
    if (item.kind === "file") {
      const { error } = await client.storage
        .from(CONFIG.BUCKET)
        .upload(item.path, item.blob, { contentType: item.blob.type, upsert: false });
      if (error && !isDuplicate(error)) throw error;
    } else {
      const { error } = await client.from(CONFIG.TABLE).insert(item.row);
      if (error) throw error;
    }
  }

  async function pump() {
    if (running) return;
    running = true;
    let item;
    while ((item = items.find((i) => i.status === "pending"))) {
      if (!enabled) { item.status = "local"; notify(); continue; }
      item.status = "uploading"; notify();
      while (true) {
        item.attempts++;
        try {
          await sendOnce(item);
          item.status = "done"; item.error = null;
          break;
        } catch (err) {
          item.error = err.message || String(err);
          console.warn(`Upload failed (${item.label}, attempt ${item.attempts}):`, err);
          if (item.attempts >= MAX_ATTEMPTS) { item.status = "failed"; break; }
          await sleep(Math.min(2000 * 2 ** (item.attempts - 1), 30000));
        }
      }
      notify();
    }
    running = false;
    notify();
  }

  function queueFile(path, blob, label) {
    items.push({ kind: "file", label: label || path, path, blob, status: "pending", attempts: 0, error: null });
    notify(); pump();
  }

  function queueRow(row, label) {
    items.push({ kind: "row", label: label || "data", row, status: "pending", attempts: 0, error: null });
    notify(); pump();
  }

  function retryFailed() {
    items.forEach((i) => { if (i.status === "failed") { i.status = "pending"; i.attempts = 0; } });
    notify(); pump();
  }

  window.addEventListener("online", retryFailed);

  return {
    enabled,
    items,
    queueFile,
    queueRow,
    retryFailed,
    onChange: (fn) => listeners.push(fn),
    offChange: (fn) => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); },
    busy: () => items.some((i) => i.status === "pending" || i.status === "uploading"),
  };
})();
