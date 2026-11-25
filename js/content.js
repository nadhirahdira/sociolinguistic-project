// =====================================================================
// CONTENT — text participants see, plus prompts, pictures and the
// questionnaire. Text reviewed by the researcher (v0.2).
//
// Answer VALUES (value: "...") are short English codes for analysis;
// LABELS are what participants see. Change labels freely, but keep values
// stable once data collection starts.
// =====================================================================
window.CONTENT = {
  researcherContact: "Nadhirah, nadhirah@kaist.ac.kr, 081927264717",

  progressLabel: "Progress",
  nextButton: "Selanjutnya",

  // ---------------------------------------------------------------
  welcome: `
    <h1>Studi Sosiolinguistik tentang Bahasa Belitong</h1>
    <p>Terima kasih atas partisipasinya! Di studi ini, kamu akan diminta untuk berbicara
    mengenai beberapa topik pilihan, mendeskripsikan beberapa gambar, lalu mengisi kuesioner singkat.</p>
    <ul class="checklist">
      <li><b>Waktu:</b> 20-30 menit</li>
      <li><b>Tempat:</b> Disarankan untuk berada di ruangan yang tenang.</li>
      <li><b>Perangkat:</b> HP (disarankan), laptop</li>
      <li><b>Browser:</b> Chrome (Android/laptop) atau Safari (iPhone). Jangan dibuka di dalam aplikasi seperti Instagram atau LINE.</li>
    </ul>
    <p class="warn"><b>Penting:</b> jangan memuat ulang (refresh) atau menutup halaman ini
    sampai selesai, dan usahakan agar layar tetap menyala. Rekaman akan dikirim otomatis selama sesi berlangsung.</p>`,
  inAppWarning: "Mohon salin tautan dan buka di Chrome atau Safari agar perekaman berjalan lancar.",
  startButton: "Mulai",

  // ---------------------------------------------------------------
  consent: `
    <h2>Informasi dan Persetujuan</h2>
    <p><b>Tujuan.</b> Data ini akan digunakan untuk tugas di kelas HSS.20147 Introduction to
    Sociolinguistics di KAIST.</p>
    <p><b>Apa yang akan kamu lakukan.</b> Berbicara mengenai beberapa topik pilihan,
    mendeskripsikan gambar, dan mengisi kuesioner (20-30 menit).</p>
    <p><b>Penyimpanan.</b> Data hanya digunakan untuk proyek ini dan dihapus setelah penilaian
    (31 Desember 2026).</p>
    <p><b>Kerahasiaan.</b> Nama partisipan tidak akan muncul di laporan, dan rekaman percakapan
    tidak akan dikutip. Mohon jangan menyebut nama lengkap siapa pun saat menjawab pertanyaan
    yang diberikan.</p>
    <p><b>Hak mengundurkan diri.</b> Partisipan boleh berhenti kapan saja, termasuk setelah sesi
    selesai (ingin mengundurkan diri). Cukup hubungi kontak di bawah ini.</p>
    <p><b>Kontak.</b> {CONTACT}</p>`,
  consentCheckbox: "Saya sudah membaca informasi di atas dan bersedia ikut serta.",

  // ---------------------------------------------------------------
  instructions: `
    <h2>Petunjuk</h2>
    <ul class="checklist">
      <li>Usahakan untuk berbicara di dekat mikrofon.</li>
      <li>Setiap jawaban direkam satu kali dan tidak bisa diulang. Jawaban tidak akan dinilai.
      Jangan takut membuat kesalahan dan bicaralah secara natural.</li>
      <li>Jangan menyebut nama lengkap siapa pun.</li>
      <li>Jangan memuat ulang atau menutup halaman. Usahakan agar layar tetap menyala.</li>
    </ul>
    <h3>Sesi 1: Pengalaman Pribadi</h3>
    <p>Kamu akan mendengar beberapa pertanyaan dalam bahasa Belitung. Setelah setiap
    pertanyaan, mulailah menjawab selama 2–3 menit dalam bahasa Belitong, seperti sedang
    berbincang dengan teman dari Belitung. Rekaman akan berhenti secara otomatis setelah 3 menit.</p>`,
  instructionsButton: "Saya mengerti, mulai",

  pictureIntro: `
    <h2>Sesi 2: Deskripsi Gambar</h2>
    <p>Sekarang kamu akan melihat beberapa gambar. Untuk setiap gambar, dalam bahasa Belitung,
    deskripsikan apa yang kamu lihat, seperti apa yang sedang terjadi, benda apa yang kamu lihat,
    dsb. Deskripsikan gambar tersebut dengan beberapa kalimat singkat (paling lama 1.5 menit).</p>`,

  questionnaireIntro: `
    <h2>Bagian 3: Kuesioner</h2>
    <p>Bagian terakhir adalah kuesioner singkat tentang latar belakang dan penggunaan bahasa.
    Tidak ada jawaban benar atau salah.</p>`,

  monologueLabel: "{N} dari {TOTAL}",
  monologueInstruction: "",   // none: the prompt is shown (or played) on its own
  pictureLabel: "Gambar {N} dari {TOTAL}",
  pictureInstruction: "Nok ape nok mikak liat de gambar ini?",

  // ---------------------------------------------------------------
  // MONOLOGUE PROMPTS — identical for everyone, played in this order.
  //   audio: path to the recorded BM prompt, e.g. "stimuli/prompts/prompt_01.mp3".
  //          It plays automatically when the screen opens (replay button before recording).
  //   text: Belitung Malay prompt, shown on screen (see showPromptText).
  //   text_id: Indonesian version, for reference only (not shown).
  //   enabled: set false to drop a prompt.
  showPromptText: true,   // true = show the written prompt together with the audio

  prompts: [
    { id: "favorite_dish", enabled: true, audio: "stimuli/prompts/prompt_01.m4a",
      text: "Cube ceriteek makanen nok nyaman menurut mikak. Ngape mikak rajin kan makanen itu? Sebile terakhir makan e? Isak ke nyuba masak e sendirik?",
      text_id: "Ceritakan tentang salah satu makanan favoritmu, seperti alasan kamu menyukai makanan itu dan momen terakhir kamu makan masakan itu. Apa kamu pernah memasak makanan itu sendiri?" },
    { id: "rainy_sunny", enabled: true, audio: "stimuli/prompts/prompt_02.m4a",
      text: "Mikak lebe rajin mun pas ari ujan ape ari terik? Ngape? Mikak biase e ngape mun ari kitu?",
      text_id: "Apakah kamu lebih menyukai hari di saat hujan turun atau hari di mana matahari bersinar terang? Mengapa? Apa yang biasanya kamu lakukan di hari-hari tersebut?" },
    { id: "beach", enabled: true, audio: "stimuli/prompts/prompt_03.m4a",
      text: "Cube ceriteek pengalamen mikak de pantai nok ade de Belitong. Sebile mikak kesitu? Pantai ape itu name e? Nok ape mikak gaween de situ? Mikak pegi e kan kawan ape kan keluarge?",
      text_id: "Ceritakan satu hari saat kalian berada di salah satu pantai di Belitung. Kapan dan di mana pantai itu? Apa yang kamu lakukan di sana? Dengan siapa saja kamu pergi ke sana?" },
    { id: "place_recommendation", enabled: true, audio: "stimuli/prompts/prompt_04.m4a",
      text: "Tempat mane bang Belitong ne nok mikak nak kenalek kan urang-urang dari luar Belitong, selain pantai-pantai? Ape nok bagus e dari tempat itu? Sebile mikak terakhir kesitu? Mun mikak ke tempat itu pulak, ape nok nak mikak gaween de situ?",
      text_id: "Ceritakan salah satu tempat di Belitung, selain pantai, yang kamu pasti akan rekomendasikan kepada pengunjung dari luar Belitung. Apa yang spesial dari tempat itu? Kapan terakhir kali kamu mengunjungi tempat itu? Jika kamu mengunjungi tempat itu lagi, apa yang ingin kamu lakukan di sana?" },
    { id: "school_subject", enabled: true, audio: "stimuli/prompts/prompt_05.m4a",
      text: "Pas tika SMA duluk e, pelajaren ape nok paling mikak rajinek? Ngape mikak rajin itu? Cube ceriteek ape sajak nok mikak ingat dari pelajaren itu. Mun pelajaren nok mikak ndak rajin e, ade ke? Ngape mikak nda rajin kan pelajaren itu?",
      text_id: "Apa mata pelajaran favorit kalian semasa SMA? Ceritakan apapun berkaitan dengan mata pelajaran tersebut. Bagaimana dengan mata pelajaran yang paling kalian tidak senangi? Mengapa?" },
  ],

  // ---------------------------------------------------------------
  // PICTURES — replace the placeholder files in stimuli/pictures/.
  // Real pictures must contain no written words and no identifiable faces.
  // Note each image's license in stimuli/pictures/LICENSES.txt.
  pictures: [
    { id: "sweet_bread",   src: "stimuli/pictures/01_sweet_bread.jpg",   alt: "" },
    { id: "green_dress",   src: "stimuli/pictures/02_green_dress.jpg",   alt: "" },
    { id: "school_fight",  src: "stimuli/pictures/03_school_fight.jpg",  alt: "" },
    { id: "beach",         src: "stimuli/pictures/04_beach.jpg",         alt: "" },
    { id: "seafood_meal",  src: "stimuli/pictures/05_seafood_meal.jpg",  alt: "" },
  ],

  // ---------------------------------------------------------------
  // QUESTIONNAIRE — one page per block.
  // type: "radio" | "likert" | "checkbox" | "text" | "number"
  likert5: [
    { value: 1, label: "1<br>Sangat tidak setuju" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5<br>Sangat setuju" },
  ],

  questionnaireRequiredNote: "Pertanyaan bertanda <span class='req'>*</span> wajib diisi.",

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
        { name: "a_district", type: "radio", label: "Kabupaten tempat dibesarkan", required: true, options: [
          { value: "belitung", label: "Belitung" },
          { value: "belitung_timur", label: "Belitung Timur" },
          { value: "other", label: "Lainnya" },
        ]},
        { name: "a_study_place", type: "text", label: "Kota tempat kuliah/tinggal sekarang <span class='opt'>(kosongkan jika tidak berlaku)</span>", required: false },
        { name: "a_years_outside", type: "number", label: "Sudah berapa tahun kamu tinggal di luar Belitung? <span class='opt'>(isi 0 jika tidak pernah)</span>", required: true, min: 0, max: 80, step: 0.5 },
      ],
    },
    {
      id: "B", title: "B. Rencana ke depan",
      questions: [
        { name: "b_plan_after", type: "radio", label: "Setelah lulus, di mana Anda berencana untuk tinggal?", required: true, options: [
          { value: "belitung", label: "Di Belitung" },
          { value: "outside", label: "Di luar Belitung" },
          { value: "undecided", label: "Belum tahu" },
        ]},
        { name: "b_certainty", type: "radio", horizontal: true, label: "Seberapa yakin Anda dengan jawaban sebelumnya?", required: true, options: [
          { value: 1, label: "1<br>Sama sekali tidak yakin" }, { value: 2, label: "2" }, { value: 3, label: "3" },
          { value: 4, label: "4" }, { value: 5, label: "5<br>Sangat yakin" },
        ]},
        { name: "b_plan_longterm", type: "radio", label: "Dalam jangka panjang (10 tahun lagi atau lebih), di mana Anda membayangkan diri Anda menetap?", required: true, options: [
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
    uploading: "Rekaman sedang dikirim… Mohon jangan tinggalkan halaman ini.",
    done: "Semua rekaman dan jawaban sudah tersimpan. Anda boleh menutup halaman ini.",
    failed: "Beberapa file belum terkirim. Periksa koneksi internet, lalu tekan “Kirim ulang”.",
    retry: "Kirim ulang",
    backupNote: "Jika tetap gagal, unduh file di bawah ini dan kirimkan ke 081927264717 (Nadhirah) atau ke nadhirah@kaist.ac.kr",
    demo: "MODE DEMO: Supabase belum diatur, jadi tidak ada yang dikirim. File bisa diunduh di bawah.",
  },
};
