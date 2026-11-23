// =====================================================================
// CONTENT — all text participants see, plus prompts, pictures and the
// questionnaire. Edit this file to replace placeholders.
//
//   [DRAF]         = draft Indonesian written by Claude; please review.
//   [PLACEHOLDER]  = must be replaced with your final material.
//
// Answer VALUES (value: "...") are short English codes for analysis;
// LABELS are what participants see. Change labels freely, but keep values
// stable once data collection starts.
// =====================================================================
window.CONTENT = {
  researcherContact: "[PLACEHOLDER: nama & kontak peneliti, mis. WhatsApp/email]",

  // ---------------------------------------------------------------
  welcome: `
    <h1>Cerita tentang Kampung Halaman</h1>
    <p>Terima kasih sudah bersedia membantu! Di sesi ini Anda akan bercerita tentang
    kampung halaman, menjelaskan beberapa gambar, lalu mengisi kuesioner singkat.</p>
    <ul class="checklist">
      <li><b>Waktu:</b> sekitar 30 menit, sekaligus tanpa jeda panjang.</li>
      <li><b>Tempat:</b> ruangan yang tenang.</li>
      <li><b>Perangkat:</b> HP lebih disarankan (mikrofon dekat mulut); laptop juga bisa.</li>
      <li><b>Browser:</b> Chrome (Android/laptop) atau Safari (iPhone). Jangan dibuka di dalam aplikasi seperti Instagram atau LINE.</li>
    </ul>
    <p class="warn"><b>Penting:</b> jangan memuat ulang (refresh) atau menutup halaman ini
    sampai selesai, dan jaga agar layar tetap menyala. Rekaman dikirim otomatis selama sesi berlangsung.</p>`,

  // ---------------------------------------------------------------
  // [DRAF] Consent text — check course rules with your professor first.
  consent: `
    <h2>Informasi dan Persetujuan</h2>
    <p><b>Tujuan.</b> Ini adalah proyek mata kuliah tentang bahasa Belitung dan pengalaman
    merantau. [DRAF]</p>
    <p><b>Apa yang Anda lakukan.</b> Merekam beberapa cerita singkat, menjelaskan gambar,
    dan mengisi kuesioner (sekitar 30 menit).</p>
    <p><b>Penyimpanan.</b> Rekaman disimpan di penyimpanan pribadi (Supabase) yang hanya bisa
    dibuka oleh peneliti. Data hanya dipakai untuk proyek ini dan dihapus setelah penilaian
    [PLACEHOLDER: atau tanggal tertentu].</p>
    <p><b>Kerahasiaan.</b> Anda diberi kode, bukan nama. Nama Anda tidak akan muncul di laporan,
    dan isi cerita pribadi Anda tidak akan dikutip. Mohon jangan menyebut nama lengkap siapa pun
    saat merekam.</p>
    <p><b>Hak mengundurkan diri.</b> Anda boleh berhenti kapan saja, termasuk setelah merekam.
    Cukup hubungi peneliti dan sebutkan kode partisipan Anda: <b class="code">{CODE}</b>
    (kode ini juga ditampilkan lagi di akhir sesi).</p>
    <p><b>Kontak.</b> {CONTACT}</p>`,
  consentCheckbox: "Saya sudah membaca informasi di atas dan bersedia ikut serta.",

  // ---------------------------------------------------------------
  instructions: `
    <h2>Petunjuk</h2>
    <ul class="checklist">
      <li>Pegang atau letakkan HP sekitar <b>20–30 cm dari mulut</b>.</li>
      <li>Setiap jawaban direkam <b>satu kali</b> dan tidak bisa diulang. Kalau salah ucap, tidak apa-apa — lanjutkan saja.</li>
      <li><b>Jangan menyebut nama lengkap</b> siapa pun.</li>
      <li>Jangan memuat ulang atau menutup halaman. Jaga layar tetap menyala.</li>
    </ul>
    <h3>Bagian 1: Bercerita</h3>
    <p>Anda akan mendengar beberapa pertanyaan dalam bahasa Belitung. Setelah setiap
    pertanyaan, bercerita sekitar <b>2–3 menit dalam bahasa Belitung</b>, seperti sedang
    ngobrol dengan teman dari kampung. Tombol <i>Selesai</i> aktif setelah 1,5 menit;
    rekaman berhenti otomatis setelah 3 menit.</p>`,

  pictureIntro: `
    <h2>Bagian 2: Gambar</h2>
    <p>Sekarang Anda akan melihat beberapa gambar. Untuk setiap gambar, ceritakan
    <b>dalam bahasa Belitung</b> apa yang Anda lihat — benda apa, apa yang sedang terjadi.
    Cukup beberapa kalimat untuk setiap gambar (paling lama 1 menit).</p>`,

  questionnaireIntro: `
    <h2>Bagian 3: Kuesioner</h2>
    <p>Bagian terakhir adalah kuesioner singkat (sekitar 10 menit) tentang latar belakang
    dan penggunaan bahasa Anda. Tidak ada jawaban benar atau salah.</p>`,

  monologueInstruction: "Dengarkan pertanyaannya, lalu bercerita dalam bahasa Belitung.",
  pictureInstruction: "Ceritakan dalam bahasa Belitung apa yang Anda lihat di gambar ini.",

  // ---------------------------------------------------------------
  // MONOLOGUE PROMPTS — identical for everyone, played in this order.
  //   audio: path to the recorded BM prompt, e.g. "stimuli/prompts/prompt_01.mp3".
  //          While audio is null, the placeholder text is shown instead.
  //   enabled: set false to drop a prompt after the pilot.
  // All 6 are enabled for the pilot.
  prompts: [
    { id: "cook",   enabled: true, audio: null,
      text: "[PLACEHOLDER] Jelaskan langkah demi langkah bagaimana memasak satu makanan khas Belitung." },
    { id: "rain",   enabled: true, audio: null,
      text: "[PLACEHOLDER] Waktu kecil, apa yang biasanya Anda lakukan di musim hujan?" },
    { id: "beach",  enabled: true, audio: null,
      text: "[PLACEHOLDER] Ceritakan satu hari di pantai di Belitung: apa yang Anda lihat dan lakukan." },
    { id: "route",  enabled: true, audio: null,
      text: "[PLACEHOLDER] Jelaskan jalan dari pusat kota ke satu tempat terkenal di Belitung, misalnya pasar." },
    { id: "game",   enabled: true, audio: null,
      text: "[PLACEHOLDER] Ajarkan satu permainan masa kecil Anda. Bagaimana aturannya?" },
    { id: "school", enabled: true, audio: null,
      text: "[PLACEHOLDER] Ceritakan satu hari biasa waktu SMA, dari pagi sampai sore." },
  ],

  // ---------------------------------------------------------------
  // PICTURES — replace the files in stimuli/pictures/ (keep or change the
  // names here). Real pictures must contain no written words and no
  // identifiable faces. Note each image's license in stimuli/pictures/LICENSES.txt.
  pictures: [
    { id: "rain_house",   src: "stimuli/pictures/01_rain_house.svg",   alt: "" },
    { id: "rice",         src: "stimuli/pictures/02_rice.svg",         alt: "" },
    { id: "clothesline",  src: "stimuli/pictures/03_clothesline.svg",  alt: "" },
    { id: "chewing",      src: "stimuli/pictures/04_chewing.svg",      alt: "" },
    { id: "angry",        src: "stimuli/pictures/05_angry.svg",        alt: "" },
    { id: "sand",         src: "stimuli/pictures/06_sand.svg",         alt: "" },
    { id: "cup_table",    src: "stimuli/pictures/07_cup_table.svg",    alt: "" },
    { id: "objects_a",    src: "stimuli/pictures/08_objects.svg",      alt: "" },
  ],

  // ---------------------------------------------------------------
  // [DRAF] QUESTIONNAIRE — one page per block.
  // type: "radio" | "likert" | "checkbox" | "text" | "number"
  likert5: [
    { value: 1, label: "1<br>Sangat tidak setuju" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5<br>Sangat setuju" },
  ],

  questionnaire: [
    {
      id: "A", title: "A. Latar belakang",
      questions: [
        { name: "a_status", type: "radio", label: "Saat ini Anda:", required: true, options: [
          { value: "student_outside", label: "Kuliah di luar Belitung" },
          { value: "living_belitung", label: "Tinggal di Belitung (tidak sedang kuliah di luar)" },
          { value: "other", label: "Lainnya" },
        ]},
        { name: "a_age", type: "number", label: "Usia (tahun)", required: true, min: 15, max: 99 },
        { name: "a_gender", type: "radio", label: "Jenis kelamin", required: true, options: [
          { value: "male", label: "Laki-laki" },
          { value: "female", label: "Perempuan" },
          { value: "no_answer", label: "Tidak ingin menjawab" },
        ]},
        { name: "a_district", type: "radio", label: "Kabupaten tempat Anda dibesarkan", required: true, options: [
          { value: "belitung", label: "Belitung" },
          { value: "belitung_timur", label: "Belitung Timur" },
          { value: "other", label: "Lainnya" },
        ]},
        { name: "a_town", type: "text", label: "Nama kota/desa tempat Anda dibesarkan", required: true },
        { name: "a_town_type", type: "radio", label: "Tempat itu lebih tepat disebut", required: true, options: [
          { value: "town", label: "Kota" },
          { value: "village", label: "Desa / kampung" },
        ]},
        { name: "a_study_place", type: "text", label: "Kota tempat Anda kuliah sekarang <span class='opt'>(kosongkan jika tidak berlaku)</span>", required: false },
        { name: "a_years_outside", type: "number", label: "Sudah berapa tahun Anda tinggal di luar Belitung? <span class='opt'>(isi 0 jika tidak pernah)</span>", required: true, min: 0, max: 80, step: 0.5 },
      ],
    },
    {
      id: "B", title: "B. Rencana ke depan",
      questions: [
        { name: "b_plan_after", type: "radio", label: "Setelah lulus, Anda berencana tinggal di mana?", required: true, options: [
          { value: "belitung", label: "Di Belitung" },
          { value: "outside", label: "Di luar Belitung" },
          { value: "undecided", label: "Belum tahu" },
        ]},
        { name: "b_certainty", type: "radio", horizontal: true, label: "Seberapa yakin Anda dengan jawaban tadi?", required: true, options: [
          { value: 1, label: "1<br>Sama sekali tidak yakin" }, { value: 2, label: "2" }, { value: 3, label: "3" },
          { value: 4, label: "4" }, { value: 5, label: "5<br>Sangat yakin" },
        ]},
        { name: "b_plan_longterm", type: "radio", label: "Dalam jangka panjang (10 tahun lagi atau lebih), Anda membayangkan tinggal di mana?", required: true, options: [
          { value: "belitung", label: "Di Belitung" },
          { value: "outside", label: "Di luar Belitung" },
          { value: "undecided", label: "Belum tahu" },
        ]},
      ],
    },
    {
      id: "C", title: "C. Pendapat Anda",
      intro: "Seberapa setuju Anda dengan pernyataan berikut?",
      questions: [
        { name: "c_orang_belitung", type: "likert", label: "Saya menganggap diri saya orang Belitung.", required: true },
        { name: "c_bm_identity", type: "likert", label: "Berbicara bahasa Belitung penting bagi jati diri saya.", required: true },
        { name: "c_children_bm", type: "likert", label: "Saya ingin anak-anak saya kelak bisa berbahasa Belitung.", required: true },
      ],
    },
    {
      id: "D1", title: "D1. Masa kecil",
      questions: [
        { name: "d1_parents_lang", type: "radio", label: "Bahasa yang paling sering dipakai orang tua kepada Anda di rumah", required: true, options: [
          { value: "bm", label: "Bahasa Belitung" },
          { value: "indonesian", label: "Bahasa Indonesia" },
          { value: "both", label: "Keduanya" },
          { value: "other", label: "Lainnya" },
        ]},
        { name: "d1_parents_origin", type: "radio", label: "Apakah orang tua Anda berasal dari Belitung?", required: true, options: [
          { value: "both", label: "Keduanya" },
          { value: "one", label: "Salah satu" },
          { value: "neither", label: "Tidak ada" },
        ]},
        { name: "d1_hs_friends_lang", type: "radio", label: "Bahasa yang paling sering Anda pakai dengan teman waktu SMA", required: true, options: [
          { value: "bm", label: "Bahasa Belitung" },
          { value: "indonesian", label: "Bahasa Indonesia" },
          { value: "both", label: "Keduanya" },
        ]},
      ],
    },
    {
      id: "D2", title: "D2. Sekarang",
      questions: [
        { name: "d2_bm_freq", type: "radio", label: "Seberapa sering Anda berbicara bahasa Belitung sekarang?", required: true, options: [
          { value: "daily", label: "Setiap hari" },
          { value: "weekly", label: "Setiap minggu" },
          { value: "monthly", label: "Setiap bulan" },
          { value: "rarely", label: "Jarang" },
        ]},
        { name: "d2_bm_with", type: "checkbox", label: "Dengan siapa Anda berbicara bahasa Belitung sekarang? <span class='opt'>(boleh pilih lebih dari satu)</span>", options: [
          { value: "family", label: "Keluarga" },
          { value: "belitung_friends", label: "Teman dari Belitung" },
          { value: "others", label: "Orang lain" },
          { value: "nobody", label: "Hampir tidak pernah dengan siapa pun" },
        ]},
        { name: "d2_family_contact", type: "radio", label: "Seberapa sering Anda menelepon atau berkirim pesan dengan keluarga di Belitung?", required: true, options: [
          { value: "daily", label: "Setiap hari" },
          { value: "weekly", label: "Setiap minggu" },
          { value: "monthly", label: "Setiap bulan" },
          { value: "rarely", label: "Jarang" },
          { value: "na", label: "Tidak berlaku (saya tinggal di Belitung)" },
        ]},
        { name: "d2_belitung_friends", type: "radio", label: "Apakah Anda punya teman dari Belitung di tempat Anda tinggal sekarang? Seberapa sering bertemu?", required: true, options: [
          { value: "none", label: "Tidak punya" },
          { value: "daily", label: "Punya — bertemu hampir setiap hari" },
          { value: "weekly", label: "Punya — bertemu setiap minggu" },
          { value: "monthly", label: "Punya — bertemu setiap bulan" },
          { value: "rarely", label: "Punya — jarang bertemu" },
          { value: "na", label: "Tidak berlaku (saya tinggal di Belitung)" },
        ]},
        { name: "d2_visits_year", type: "number", label: "Berapa kali Anda pulang ke Belitung dalam setahun terakhir? <span class='opt'>(isi 0 jika tinggal di Belitung)</span>", required: true, min: 0, max: 100 },
      ],
    },
  ],

  // ---------------------------------------------------------------
  finish: {
    title: "Terima kasih!",
    codeNote: "Ini kode partisipan Anda. Mohon simpan (misalnya dengan tangkapan layar) dan kirimkan ke peneliti.",
    uploading: "Rekaman sedang dikirim… Mohon jangan tutup halaman ini dulu.",
    done: "Semua rekaman dan jawaban sudah tersimpan. Anda boleh menutup halaman ini.",
    failed: "Beberapa file belum terkirim. Periksa koneksi internet, lalu tekan “Kirim ulang”.",
    retry: "Kirim ulang",
    backupNote: "Kalau tetap gagal, unduh file di bawah ini dan kirimkan ke peneliti:",
    demo: "MODE DEMO: Supabase belum diatur, jadi tidak ada yang dikirim. File bisa diunduh di bawah.",
  },
};
