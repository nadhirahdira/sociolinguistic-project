// Microphone recorder that produces real (uncompressed) WAV files.
// Captures raw PCM through an AudioWorklet, resamples to CONFIG.SAMPLE_RATE,
// and encodes 16-bit mono WAV. Browser voice processing (echo cancellation,
// noise suppression, auto gain) is switched off where the browser allows,
// because it alters the recorded voice.
window.Recorder = (() => {
  let ctx = null, stream = null, source = null, node = null;
  let chunks = [], recording = false, levelCb = null;

  const constraints = {
    audio: {
      channelCount: 1,
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function isReady() {
    return !!(ctx && stream && stream.getAudioTracks().some((t) => t.readyState === "live"));
  }

  async function init() {
    if (isReady()) {
      if (ctx.state !== "running") await ctx.resume();
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const e = new Error("getUserMedia not supported"); e.name = "NotSupportedError"; throw e;
    }
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      if (!ctx.audioWorklet) {
        const e = new Error("AudioWorklet not supported"); e.name = "NotSupportedError"; throw e;
      }
      await ctx.audioWorklet.addModule("js/recorder-worklet.js");
      node = new AudioWorkletNode(ctx, "pcm-capture");
      node.port.onmessage = onChunk;
      // Connect to the output through a muted gain so the browser keeps
      // the worklet running, without playing the mic back to the speaker.
      const mute = ctx.createGain();
      mute.gain.value = 0;
      node.connect(mute);
      mute.connect(ctx.destination);
    }
    if (source) source.disconnect();
    source = ctx.createMediaStreamSource(stream);
    source.connect(node);
    if (ctx.state !== "running") await ctx.resume();
  }

  function onChunk(e) {
    const d = e.data;
    if (recording) chunks.push(d);
    if (levelCb) {
      let s = 0;
      for (let i = 0; i < d.length; i++) s += d[i] * d[i];
      levelCb(Math.sqrt(s / d.length));
    }
  }

  async function start(onLevel) {
    await init();
    chunks = [];
    levelCb = onLevel || null;
    recording = true;
  }

  async function stop() {
    await sleep(80); // collect the last block in flight
    recording = false;
    levelCb = null;
    let total = 0;
    for (const c of chunks) total += c.length;
    const raw = new Float32Array(total);
    let off = 0;
    for (const c of chunks) { raw.set(c, off); off += c.length; }
    chunks = [];
    let rate = CONFIG.SAMPLE_RATE, pcm;
    try {
      pcm = await resample(raw, ctx.sampleRate, rate);
    } catch (err) {
      console.warn("Resampling failed; saving at the device rate", err);
      pcm = raw; rate = ctx.sampleRate;
    }
    return { blob: encodeWav(pcm, rate), duration: pcm.length / rate, sampleRate: rate };
  }

  function cancel() { recording = false; levelCb = null; chunks = []; }

  // Prompt playback through the same (already unlocked) audio context, so it
  // can start automatically without another tap, including on iPhone.
  const promptCache = new Map();
  let promptSrc = null;
  async function playPrompt(url) {
    await init();
    let buf = promptCache.get(url);
    if (!buf) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Prompt audio not found (HTTP ${res.status})`);
      const bytes = await res.arrayBuffer();
      buf = await new Promise((ok, fail) => ctx.decodeAudioData(bytes, ok, fail));
      promptCache.set(url, buf);
    }
    stopPrompt();
    return new Promise((resolve) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.onended = () => { if (promptSrc === src) promptSrc = null; resolve(); };
      promptSrc = src;
      src.start();
    });
  }
  function stopPrompt() {
    if (!promptSrc) return;
    try { promptSrc.onended = null; promptSrc.stop(); } catch (e) { /* already stopped */ }
    promptSrc = null;
  }

  async function resample(data, fromRate, toRate) {
    if (fromRate === toRate || data.length === 0) return data;
    const len = Math.max(1, Math.round((data.length * toRate) / fromRate));
    const off = new OfflineAudioContext(1, len, toRate);
    const buf = off.createBuffer(1, data.length, fromRate);
    buf.copyToChannel(data, 0);
    const src = off.createBufferSource();
    src.buffer = buf;
    src.connect(off.destination);
    src.start();
    const rendered = await off.startRendering();
    return rendered.getChannelData(0);
  }

  function encodeWav(samples, rate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const v = new DataView(buffer);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, "RIFF"); v.setUint32(4, 36 + samples.length * 2, true); str(8, "WAVE");
    str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    str(36, "data"); v.setUint32(40, samples.length * 2, true);
    let o = 44;
    for (let i = 0; i < samples.length; i++, o += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([buffer], { type: "audio/wav" });
  }

  // Technical details for the methods section (no device names/IDs).
  function info() {
    const t = stream && stream.getAudioTracks()[0];
    const s = t && t.getSettings ? t.getSettings() : {};
    return {
      input_sample_rate: ctx ? ctx.sampleRate : null,
      saved_sample_rate: CONFIG.SAMPLE_RATE,
      channel_count: s.channelCount ?? null,
      echo_cancellation: s.echoCancellation ?? null,
      noise_suppression: s.noiseSuppression ?? null,
      auto_gain_control: s.autoGainControl ?? null,
    };
  }

  return { init, start, stop, cancel, info, isReady, playPrompt, stopPrompt };
})();
