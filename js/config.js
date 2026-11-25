// =====================================================================
// SETTINGS — the only file you need to edit to connect Supabase.
// =====================================================================
window.CONFIG = {
  // From Supabase: Project Settings → API (or "Connect" button).
  // Leave empty to run in DEMO MODE: nothing is uploaded, and the last
  // page offers the recordings as downloads (useful for local testing).
  SUPABASE_URL: "https://wykbjzqbhkvbeiqziotv.supabase.co",
  SUPABASE_KEY: "sb_publishable_AGo2poNTexm80vVW_0IEQA_oRCUacwT",   // public by design — never put the secret/service_role key here

  BUCKET: "recordings",
  TABLE: "sessions",

  // Audio is saved as mono 16-bit WAV at this sample rate.
  // 22050 Hz keeps the full speech range and keeps files small.
  SAMPLE_RATE: 22050,

  MONOLOGUE: { max_seconds: 180, min_seconds: 120 },
  PICTURE:   { max_seconds: 90,  min_seconds: 60 },
  MIC_TEST_SECONDS: 5,

  // Bump this whenever prompts/pictures/questions change, so sessions
  // recorded with different materials can be told apart.
  STUDY_VERSION: "0.5-audio-pictures",
};
