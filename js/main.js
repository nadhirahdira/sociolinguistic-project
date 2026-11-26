// Session flow. Order: welcome → consent → mic check → instructions →
// monologues → pictures → questionnaire → finish.
(() => {
  // ---------- participant code & mode ----------
  // Neutral code generated here, e.g. "PK7M3QX". No I, L, O, 0, 1 (easy to read aloud).
  // Add ?mode=test to the link for practice runs (code starts with T, easy to delete)
  // or ?mode=pilot for pilot sessions (normal P code, flagged as pilot in the data).
  const params = new URLSearchParams(location.search);
  const mode = ["test", "pilot"].includes(params.get("mode")) ? params.get("mode") : "main";
  const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const rnd = crypto.getRandomValues(new Uint32Array(6));
  const CODE = (mode === "test" ? "T" : "P") + Array.from(rnd, (n) => ALPHABET[n % ALPHABET.length]).join("");
  const startedAt = new Date().toISOString();
  // Test runs (?mode=test) may finish a recording at any time.
  const minSeconds = (s) => (mode === "test" ? 0 : s);

  // ---------- device info ----------
  const ua = navigator.userAgent;
  const isIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const deviceType = isIPad || /Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "phone" : "desktop";
  const browser =
    /EdgA?\//.test(ua) ? "Edge" : /SamsungBrowser/.test(ua) ? "Samsung Internet" : /CriOS/.test(ua) ? "Chrome (iOS)" :
    /FxiOS|Firefox/.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "other";
  const inAppBrowser = /FBAN|FBAV|Instagram|Line\/|TikTok|; wv\)/.test(ua);

  // ---------- keep the screen on & warn before leaving ----------
  let wakeLock = null;
  async function keepAwake() {
    try { if ("wakeLock" in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request("screen"); wakeLock.onrelease = () => { wakeLock = null; }; } }
    catch (e) { /* not supported or denied — fine */ }
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden && sessionActive) keepAwake(); });
  let sessionActive = false;
  function beginSession() {
    sessionActive = true;
    keepAwake();
    window.onbeforeunload = (e) => { e.preventDefault(); e.returnValue = ""; return ""; };
  }

  // ---------- preload stimuli ----------
  CONTENT.pictures.forEach((p) => { const i = new Image(); i.src = p.src; });
  CONTENT.prompts.filter((p) => p.enabled && p.audio).forEach((p) => { const a = new Audio(); a.preload = "auto"; a.src = p.audio; });

  // ---------- jsPsych ----------
  const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: true,
    message_progress_bar: CONTENT.progressLabel,
  });

  const timeline = [];
  const btn = (stimulus, label, extra = {}) => ({
    type: jsPsychHtmlButtonResponse, stimulus: `<div class="panel">${stimulus}</div>`,
    choices: [label], button_html: (c) => `<button class="jspsych-btn primary">${c}</button>`, ...extra,
  });

  // 1. Welcome
  timeline.push(btn(
    CONTENT.welcome + (inAppBrowser ? `<p class="error">${CONTENT.inAppWarning}</p>` : ""),
    CONTENT.startButton, { on_finish: beginSession }));

  // 2. Consent (checkbox required by the browser form)
  timeline.push({
    type: jsPsychSurveyHtmlForm,
    preamble: `<div class="panel">${CONTENT.consent.replace("{CONTACT}", CONTENT.researcherContact)}</div>`,
    html: `<div class="panel"><label class="consent"><input type="checkbox" name="consent" value="yes" required> ${CONTENT.consentCheckbox}</label></div>`,
    button_label: CONTENT.nextButton,
    data: { section: "consent" },
  });

  // 3. Microphone check, then record the session start
  timeline.push({
    type: MicCheckPlugin,
    seconds: CONFIG.MIC_TEST_SECONDS,
    data: { section: "mic_check" },
    on_finish: (d) => {
      Uploader.queueRow({
        participant_code: CODE, event: "start", mode, consent: true,
        device_type: deviceType, browser, user_agent: ua,
        study_version: CONFIG.STUDY_VERSION, client_time: startedAt,
        details: { mic: d.mic, mic_tests: d.mic_tests, screen: `${screen.width}x${screen.height}` },
      }, "session start");
    },
  });

  // 4. Instructions
  timeline.push(btn(CONTENT.instructions, CONTENT.instructionsButton));

  // 5. Monologues
  const prompts = CONTENT.prompts.filter((p) => p.enabled);
  const pad = (n) => String(n).padStart(2, "0");
  prompts.forEach((p, i) => {
    const filename = `${CODE}_mono_${pad(i + 1)}.wav`;
    timeline.push({
      type: RecordTrialPlugin,
      task: "mono", item_id: p.id, number: i + 1, total: prompts.length,
      label: CONTENT.monologueLabel.replace("{N}", i + 1).replace("{TOTAL}", prompts.length),
      instruction: CONTENT.monologueInstruction,
      prompt_audio: p.audio, prompt_text: p.text,
      max_seconds: CONFIG.MONOLOGUE.max_seconds, min_seconds: minSeconds(CONFIG.MONOLOGUE.min_seconds),
      filename, path: `${CODE}/${filename}`,
      data: { section: "monologue" },
    });
  });

  // 6. Pictures
  timeline.push(btn(CONTENT.pictureIntro, CONTENT.nextButton));
  CONTENT.pictures.forEach((p, i) => {
    const filename = `${CODE}_pic_${pad(i + 1)}.wav`;
    timeline.push({
      type: RecordTrialPlugin,
      task: "pic", item_id: p.id, number: i + 1, total: CONTENT.pictures.length,
      label: CONTENT.pictureLabel.replace("{N}", i + 1).replace("{TOTAL}", CONTENT.pictures.length),
      instruction: CONTENT.pictureInstruction,
      image: p.src, image_alt: p.alt,
      max_seconds: CONFIG.PICTURE.max_seconds, min_seconds: minSeconds(CONFIG.PICTURE.min_seconds),
      filename, path: `${CODE}/${filename}`,
      data: { section: "picture" },
    });
  });

  // 7. Questionnaire
  timeline.push(btn(CONTENT.questionnaireIntro, CONTENT.nextButton));
  // A1 answer ("Saat ini Anda") decides what people living in Belitung skip.
  const statusAnswer = () => {
    const t = jsPsych.data.get().filter({ section: "questionnaire", block: "A" }).values()[0];
    return t && t.response ? t.response.a_status || null : null;
  };
  const hiddenFor = (item, status) => !!(item.hideFor && status && item.hideFor.includes(status));

  // On page A itself, show/hide the "outside Belitung" questions as A1 changes.
  // A hidden question is also disabled, so it is neither required nor saved.
  function wireStatusToggle() {
    const form = document.querySelector("#jspsych-survey-html-form");
    const blockA = CONTENT.questionnaire.find((b) => b.id === "A");
    const apply = () => {
      const sel = form.querySelector('input[name="a_status"]:checked');
      const status = sel ? sel.value : null;
      blockA.questions.filter((q) => q.hideFor).forEach((q) => {
        const fs = form.querySelector(`fieldset[data-q="${q.name}"]`);
        if (!fs) return;
        const hide = hiddenFor(q, status);
        fs.hidden = hide;
        fs.querySelectorAll("input").forEach((i) => (i.disabled = hide));
      });
    };
    form.querySelectorAll('input[name="a_status"]').forEach((r) => r.addEventListener("change", apply));
    apply();
  }

  CONTENT.questionnaire.forEach((block) => {
    const page = {
      type: jsPsychSurveyHtmlForm,
      preamble: `<div class="panel"><h2>${block.title}</h2>${block.intro ? `<p>${block.intro}</p>` : ""}<p class="hint">${CONTENT.questionnaireRequiredNote}</p></div>`,
      // Built when the page opens, so later pages can drop questions based on A1.
      html: () => {
        const status = block.id === "A" ? null : statusAnswer();
        return `<div class="panel">${block.questions.filter((q) => !hiddenFor(q, status)).map(renderQuestion).join("")}</div>`;
      },
      button_label: CONTENT.nextButton,
      data: { section: "questionnaire", block: block.id },
    };
    if (block.id === "A") page.on_load = wireStatusToggle;
    timeline.push(block.hideFor
      ? { timeline: [page], conditional_function: () => !hiddenFor(block, statusAnswer()) }
      : page);
  });

  // 8. Finish: save session summary, wait for uploads
  timeline.push({
    type: FinishPlugin,
    code: CODE,
    save_summary: saveSummary,
  });

  function renderQuestion(q) {
    // Test runs (?mode=test) can skip questions; the * still shows which are required.
    const req = q.required && mode !== "test" ? "required" : "";
    const id = (v) => `${q.name}__${v}`;
    let field = "";
    if (q.type === "radio" || q.type === "likert") {
      const opts = q.type === "likert" ? CONTENT.likert5 : q.options;
      const horiz = q.type === "likert" || q.horizontal;
      field = `<div class="${horiz ? "scale" : "options"}">${opts.map((o) =>
        `<label for="${id(o.value)}"><input type="radio" id="${id(o.value)}" name="${q.name}" value="${o.value}" ${req}><span>${o.label}</span></label>`
      ).join("")}</div>`;
    } else if (q.type === "checkbox") {
      field = `<div class="options">${q.options.map((o) =>
        `<label for="${id(o.value)}"><input type="checkbox" id="${id(o.value)}" name="${q.name}__${o.value}" value="1"><span>${o.label}</span></label>`
      ).join("")}</div>`;
    } else if (q.type === "number") {
      field = `<input type="number" inputmode="decimal" name="${q.name}" min="${q.min ?? ""}" max="${q.max ?? ""}" step="${q.step ?? 1}" ${req}>`;
    } else {
      field = `<input type="text" name="${q.name}" autocomplete="off" ${req}>`;
    }
    return `<fieldset class="question" data-q="${q.name}"><legend>${q.label}${q.required ? ' <span class="req" aria-hidden="true">*</span>' : ""}</legend>${field}</fieldset>`;
  }

  function collectQuestionnaire() {
    const out = {};
    const defs = {};
    CONTENT.questionnaire.forEach((b) => b.questions.forEach((q) => { defs[q.name] = q; }));
    jsPsych.data.get().filter({ section: "questionnaire" }).values().forEach((t) => {
      Object.entries(t.response).forEach(([k, v]) => {
        if (k.includes("__")) {               // checkbox group
          const [name, val] = k.split("__");
          (out[name] = out[name] || []).push(val);
        } else {
          const q = defs[k];
          const numeric = q && (q.type === "number" || q.type === "likert" || (q.options && typeof q.options[0].value === "number"));
          out[k] = v === "" ? null : numeric ? Number(v) : v;
        }
      });
    });
    CONTENT.questionnaire.forEach((b) => b.questions.forEach((q) => {
      if (q.type === "checkbox" && !out[q.name]) out[q.name] = [];
    }));
    return out;
  }

  function saveSummary() {
    const endedAt = new Date().toISOString();
    const questionnaire = collectQuestionnaire();
    const c = ["c_orang_belitung", "c_bm_identity", "c_children_bm"].map((k) => questionnaire[k]).filter((v) => typeof v === "number");
    const recordings = jsPsych.data.get().filter([{ section: "monologue" }, { section: "picture" }]).values().map((t) => ({
      filename: t.filename, task: t.task, item_id: t.item_id, item_number: t.item_number,
      duration_s: t.duration_s, auto_stopped: t.auto_stopped, prompt_plays: t.prompt_plays, prompt_pauses: t.prompt_pauses,
      prompt_audio_error: t.prompt_audio_error, page_hidden_during_recording: t.page_hidden_during_recording,
      empty_retakes: t.empty_retakes, recording_started_at: t.recording_started_at,
    }));
    const summary = {
      participant_code: CODE, event: "complete", mode, consent: true,
      device_type: deviceType, browser, user_agent: ua,
      study_version: CONFIG.STUDY_VERSION, client_time: endedAt,
      questionnaire,
      details: {
        started_at: startedAt, ended_at: endedAt,
        duration_min: Math.round((Date.parse(endedAt) - Date.parse(startedAt)) / 6000) / 10,
        identity_score: c.length ? Math.round((c.reduce((a, b) => a + b, 0) / c.length) * 100) / 100 : null,
        prompts: prompts.map((p) => p.id),
        recordings,
        mic: Recorder.info(),
      },
    };
    Uploader.queueRow(summary, "session summary");
    // Backup copy of the same data next to the audio files.
    const json = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" });
    Uploader.queueFile(`${CODE}/${CODE}_session.json`, json, `${CODE}_session.json`);
  }

  jsPsych.run(timeline);
})();
