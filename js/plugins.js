// Custom jsPsych plugins: microphone check, recording trial, finish page.
const PT = jsPsychModule.ParameterType;

const fmtTime = (s) => {
  s = Math.max(0, Math.floor(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// Microphone error → message in Indonesian
function micErrorHtml(err) {
  const name = (err && err.name) || "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return `
      <p class="error"><b>Akses mikrofon ditolak.</b> Situs ini perlu mikrofon untuk merekam.</p>
      <ul class="checklist small">
        <li><b>Android (Chrome):</b> ketuk ikon di sebelah kiri alamat situs → <i>Izin</i> → <i>Mikrofon</i> → <i>Izinkan</i>.</li>
        <li><b>iPhone (Safari):</b> ketuk <i>aA</i> di bilah alamat → <i>Pengaturan Situs Web</i> → <i>Mikrofon</i> → <i>Izinkan</i>. Atau buka <i>Pengaturan → Safari → Mikrofon</i>.</li>
        <li><b>Laptop:</b> klik ikon gembok di sebelah alamat situs → izinkan mikrofon.</li>
      </ul>
      <p>Setelah itu tekan <b>Coba lagi</b>. Kalau masih gagal, muat ulang halaman (belum ada rekaman yang hilang).</p>`;
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return `<p class="error"><b>Mikrofon tidak ditemukan.</b> Pastikan perangkat Anda punya mikrofon yang aktif, lalu coba lagi.</p>`;
  }
  if (name === "NotReadableError") {
    return `<p class="error"><b>Mikrofon sedang dipakai aplikasi lain.</b> Tutup aplikasi lain (mis. panggilan telepon/video), lalu coba lagi.</p>`;
  }
  if (name === "NotSupportedError") {
    return `<p class="error"><b>Browser ini tidak bisa merekam.</b> Buka tautan ini di Chrome (Android/laptop) atau Safari (iPhone), bukan di dalam aplikasi lain.</p>`;
  }
  return `<p class="error"><b>Mikrofon tidak bisa dipakai</b> (${name || "kesalahan tidak dikenal"}). Coba lagi, atau buka di Chrome/Safari.</p>`;
}

function levelMeter(el) {
  return (rms) => {
    const pct = Math.min(100, Math.round(Math.sqrt(rms) * 220));
    el.style.width = pct + "%";
  };
}

// ---------------------------------------------------------------------
class MicCheckPlugin {
  static info = {
    name: "mic-check",
    version: "1.0.0",
    parameters: { seconds: { type: PT.INT, default: 5 } },
    data: {},
  };
  constructor(jsPsych) { this.jsPsych = jsPsych; }

  trial(el, trial) {
    let tests = 0, peak = 0, audioUrl = null;

    const intro = () => {
      el.innerHTML = `
        <div class="panel">
          <h2>Cek mikrofon</h2>
          <p>Pertama, izinkan situs ini memakai mikrofon. Browser akan menampilkan pertanyaan izin — pilih <b>Izinkan</b>.</p>
          <div id="mc-msg"></div>
          <button class="jspsych-btn primary" id="mc-allow">Izinkan mikrofon</button>
        </div>`;
      el.querySelector("#mc-allow").onclick = async (ev) => {
        ev.target.disabled = true;
        try { await Recorder.init(); ready(); }
        catch (err) {
          console.error(err);
          el.querySelector("#mc-msg").innerHTML = micErrorHtml(err);
          ev.target.disabled = false;
          ev.target.textContent = "Coba lagi";
        }
      };
    };

    const ready = () => {
      el.innerHTML = `
        <div class="panel">
          <h2>Tes rekaman ${trial.seconds} detik</h2>
          <p>Letakkan HP sekitar 20–30 cm dari mulut. Tekan tombol di bawah, lalu ucapkan beberapa kalimat
          dengan suara biasa, misalnya memperkenalkan diri, hari ini sedang apa dan di mana (rekaman tidak akan disimpan).</p>
          <button class="jspsych-btn primary" id="mc-rec">● Mulai tes</button>
        </div>`;
      el.querySelector("#mc-rec").onclick = record;
    };

    const record = async () => {
      tests++; peak = 0;
      el.innerHTML = `
        <div class="panel">
          <div class="rec"><span class="rec-dot"></span> Merekam… <span id="mc-t">${trial.seconds}</span></div>
          <div class="meter"><div id="mc-lvl"></div></div>
          <p class="hint">Coba bicara sekarang. Garis hijau bergerak jika suara bisa terdengar.</p>
        </div>`;
      const meter = levelMeter(el.querySelector("#mc-lvl"));
      try {
        await Recorder.start((rms) => { peak = Math.max(peak, rms); meter(rms); });
      } catch (err) {
        el.innerHTML = `<div class="panel">${micErrorHtml(err)}<button class="jspsych-btn" id="mc-again">Coba lagi</button></div>`;
        el.querySelector("#mc-again").onclick = intro;
        return;
      }
      const t0 = performance.now();
      const tick = setInterval(() => {
        const left = trial.seconds - (performance.now() - t0) / 1000;
        const t = el.querySelector("#mc-t");
        if (t) t.textContent = Math.ceil(Math.max(0, left));
      }, 200);
      setTimeout(async () => {
        clearInterval(tick);
        const res = await Recorder.stop();
        review(res);
      }, trial.seconds * 1000);
    };

    const review = (res) => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      audioUrl = URL.createObjectURL(res.blob);
      const quiet = peak < 0.01 || res.duration < 1;
      el.innerHTML = `
        <div class="panel">
          <h2>Dengarkan hasil tes</h2>
          ${quiet ? `<p class="warn">Suara terdengar sangat pelan atau tidak ada. Dekatkan HP ke mulut, pastikan mikrofon tidak tertutup, lalu ulangi tes.</p>` : ""}
          <audio controls src="${audioUrl}"></audio>
          <p>Apakah suaramu bisa terdengar jelas?</p>
          <div class="btn-row">
            <button class="jspsych-btn" id="mc-redo">Ulangi tes</button>
            <button class="jspsych-btn primary" id="mc-ok">Lanjut</button>
          </div>
        </div>`;
      el.querySelector("#mc-redo").onclick = record;
      el.querySelector("#mc-ok").onclick = () => {
        URL.revokeObjectURL(audioUrl);
        this.jsPsych.finishTrial({ mic_tests: tests, mic_test_peak: Math.round(peak * 1000) / 1000, mic: Recorder.info() });
      };
    };

    if (Recorder.isReady()) ready(); else intro();
  }
}

// ---------------------------------------------------------------------
class RecordTrialPlugin {
  static info = {
    name: "record-trial",
    version: "1.0.0",
    parameters: {
      task: { type: PT.STRING, default: "mono" },          // "mono" | "pic"
      item_id: { type: PT.STRING, default: "" },
      number: { type: PT.INT, default: 1 },                // 1-based within task
      total: { type: PT.INT, default: 1 },
      label: { type: PT.HTML_STRING, default: "" },
      instruction: { type: PT.HTML_STRING, default: "" },
      prompt_audio: { type: PT.STRING, default: null },
      prompt_text: { type: PT.HTML_STRING, default: null },
      image: { type: PT.STRING, default: null },
      image_alt: { type: PT.STRING, default: "" },
      max_seconds: { type: PT.INT, default: 60 },
      min_seconds: { type: PT.INT, default: 0 },
      filename: { type: PT.STRING, default: "" },
      path: { type: PT.STRING, default: "" },
    },
    data: {},
  };
  constructor(jsPsych) { this.jsPsych = jsPsych; }

  trial(el, trial) {
    const st = { plays: 0, pauses: 0, promptError: false, hidden: false, retries: 0, startedAt: null };
    let timer = null;

    const onVis = () => { if (document.hidden && st.startedAt) st.hidden = true; };
    document.addEventListener("visibilitychange", onVis);

    const showText = () => trial.prompt_text && (CONTENT.showPromptText || !trial.prompt_audio || st.promptError);

    const frame = (controls) => {
      el.innerHTML = `
        <div class="panel task">
          <p class="task-label">${trial.label}</p>
          ${trial.image ? `<img class="task-image" src="${trial.image}" alt="${trial.image_alt}">` : ""}
          ${showText() ? `<div class="prompt-text">${trial.prompt_text}</div>` : ""}
          ${trial.instruction ? `<p class="task-instruction">${trial.instruction}</p>` : ""}
          <div id="rt-controls">${controls}</div>
        </div>`;
    };

    // --- prompt audio: plays automatically, with play/pause and a progress bar ---
    // "Mulai merekam" appears once the prompt has been heard to the end.
    // If the audio can't be loaded, the written prompt is used instead.
    let player = null, raf = null;
    const tick = () => {
      if (!player) return;
      const pos = player.position();
      const fill = el.querySelector("#pp-fill"), time = el.querySelector("#pp-time"), btn = el.querySelector("#pp-btn");
      if (fill) fill.style.width = `${(pos / player.duration) * 100}%`;
      if (time) time.textContent = `${fmtTime(pos)} / ${fmtTime(player.duration)}`;
      if (btn) {
        btn.textContent = player.isPlaying() ? "❚❚" : "▶";
        btn.setAttribute("aria-label", player.isPlaying() ? "Jeda" : "Putar");
      }
      raf = requestAnimationFrame(tick);
    };
    const showStart = () => {
      const slot = el.querySelector("#rt-after");
      if (slot && !slot.innerHTML) {
        slot.innerHTML = `<button class="jspsych-btn primary" id="rt-start">● Mulai merekam</button>`;
        el.querySelector("#rt-start").onclick = start;
      }
    };
    const listen = async () => {
      frame(`<p class="status">Memuat pertanyaan…</p>`);
      try {
        player = await Recorder.loadPrompt(trial.prompt_audio);
      } catch (err) {
        console.warn("Prompt audio failed to load", err);
        st.promptError = true;
        ready();
        return;
      }
      frame(`
        <div class="player">
          <button class="player-btn" id="pp-btn" aria-label="Jeda">❚❚</button>
          <div class="player-track"><div class="player-fill" id="pp-fill"></div></div>
          <span class="player-time" id="pp-time">0:00 / ${fmtTime(player.duration)}</span>
        </div>
        <div id="rt-after"></div>`);
      player.onended = () => { st.plays++; showStart(); };
      el.querySelector("#pp-btn").onclick = () => {
        if (player.isPlaying()) { player.pause(); st.pauses++; } else player.play();
      };
      player.play();
      raf = requestAnimationFrame(tick);
    };
    const stopPlayer = () => { if (raf) cancelAnimationFrame(raf); raf = null; Recorder.stopPrompt(); player = null; };

    // --- ready to record (no audio, or audio failed) ---
    const ready = () => {
      frame(`<button class="jspsych-btn primary" id="rt-start">● Mulai merekam</button>`);
      el.querySelector("#rt-start").onclick = start;
    };

    // --- recording ---
    const start = async () => {
      stopPlayer();
      try {
        await Recorder.start(levelMeterCb);
      } catch (err) {
        frame(`${micErrorHtml(err)}<button class="jspsych-btn primary" id="rt-start">Coba lagi</button>`);
        el.querySelector("#rt-start").onclick = start;
        return;
      }
      st.startedAt = new Date().toISOString();
      frame(`
        <div class="rec"><span class="rec-dot"></span> Merekam <span id="rt-t">0:00</span> / ${fmtTime(trial.max_seconds)}</div>
        <div class="meter"><div id="rt-lvl"></div></div>
        <button class="jspsych-btn primary" id="rt-done" ${trial.min_seconds > 0 ? "disabled" : ""}>Selesai</button>
        <p class="hint" id="rt-hint"></p>`);
      meterEl = el.querySelector("#rt-lvl");
      const done = el.querySelector("#rt-done");
      done.onclick = () => stop(false);
      const t0 = st.t0 = performance.now();
      timer = setInterval(() => {
        const s = (performance.now() - t0) / 1000;
        el.querySelector("#rt-t").textContent = fmtTime(s);
        const hint = el.querySelector("#rt-hint");
        if (s < trial.min_seconds) {
          hint.textContent = `Tombol Selesai aktif dalam ${fmtTime(trial.min_seconds - s + 0.999)}`;
        } else {
          done.disabled = false;
          const left = trial.max_seconds - s;
          hint.textContent = left <= 30 ? `Rekaman berhenti otomatis dalam ${Math.ceil(left)} detik` : "";
        }
        if (s >= trial.max_seconds) stop(true);
      }, 250);
    };

    let meterEl = null;
    const levelMeterCb = (rms) => { if (meterEl) levelMeter(meterEl)(rms); };

    let stopping = false;
    const stop = async (auto) => {
      if (stopping) return;
      stopping = true;
      clearInterval(timer);
      frame(`<p class="status">Menyimpan rekaman…</p>`);
      const res = await Recorder.stop();
      // Empty = at least 1 s went by but (almost) no audio arrived. A very quick
      // stop (possible in test mode) is not an error.
      const elapsed = (performance.now() - st.t0) / 1000;
      if (elapsed >= 1 && res.duration < Math.min(1, elapsed / 2)) {
        // Technical failure (no audio captured) — the only case where a retake is allowed.
        stopping = false; st.retries++; st.startedAt = null;
        frame(`<p class="error">Rekaman kosong — mikrofon tidak menangkap suara. Pastikan mikrofon tidak dipakai aplikasi lain, lalu coba lagi.</p>
               <button class="jspsych-btn primary" id="rt-start">● Coba lagi</button>`);
        el.querySelector("#rt-start").onclick = start;
        return;
      }
      Uploader.queueFile(trial.path, res.blob, trial.filename);
      document.removeEventListener("visibilitychange", onVis);
      this.jsPsych.finishTrial({
        task: trial.task,
        item_id: trial.item_id,
        item_number: trial.number,
        filename: trial.filename,
        duration_s: Math.round(res.duration * 10) / 10,
        sample_rate: res.sampleRate,
        auto_stopped: auto,
        prompt_plays: st.plays,
        prompt_pauses: st.pauses,
        prompt_audio_error: st.promptError,
        page_hidden_during_recording: st.hidden,
        empty_retakes: st.retries,
        recording_started_at: st.startedAt,
      });
    };

    if (trial.prompt_audio) listen(); else ready();
  }
}

// ---------------------------------------------------------------------
class FinishPlugin {
  static info = {
    name: "finish",
    version: "1.0.0",
    parameters: {
      code: { type: PT.STRING, default: "" },
      save_summary: { type: PT.FUNCTION, default: () => {} },  // (not "on_start": jsPsych reserves that name)
    },
    data: {},
  };
  constructor(jsPsych) { this.jsPsych = jsPsych; }

  trial(el, trial) {
    const T = CONTENT.finish;
    trial.save_summary();
    const files = () => Uploader.items.filter((i) => i.kind === "file");

    const render = () => {
      const items = Uploader.items;
      const busy = Uploader.busy();
      const failed = items.some((i) => i.status === "failed");
      const done = items.filter((i) => i.status === "done").length;
      let status;
      if (!Uploader.enabled) status = `<p class="warn">${T.demo}</p>`;
      else if (busy) status = `<p class="status">${T.uploading} (${done}/${items.length})</p>`;
      else if (failed) status = `<p class="error">${T.failed}</p><button class="jspsych-btn primary" id="fp-retry">${T.retry}</button>`;
      else status = `<p class="success">${T.done}</p>`;

      const showDownloads = !Uploader.enabled || (failed && !busy);
      const downloads = showDownloads
        ? `<p>${Uploader.enabled ? T.backupNote : ""}</p><ul class="downloads">${files().map((f) => {
            f.url = f.url || URL.createObjectURL(f.blob);
            const ok = f.status === "done" ? " ✓" : "";
            return `<li><a href="${f.url}" download="${f.path.split("/").pop()}">${f.path.split("/").pop()}</a>${ok}</li>`;
          }).join("")}</ul>` : "";

      el.innerHTML = `
        <div class="panel">
          <h1>${T.title}</h1>
          ${status}
          ${downloads}
        </div>`;
      const r = el.querySelector("#fp-retry");
      if (r) r.onclick = () => Uploader.retryFailed();
      if (!busy && !failed) window.onbeforeunload = null;
    };

    Uploader.onChange(render);
    render();
    // This is the last screen; the trial never ends on its own.
  }
}
