<div align="center">
  <img src="public/logo-solusiprd.png" alt="Logo" width="120" height="120">
  <h1 align="center">SOLUSIPRD</h1>
  <p align="center">
    <strong>AI-Powered Product Requirements Document (PRD) & WBS Generator</strong>
    <br />
    <em>Transforming raw ideas into enterprise-grade technical roadmaps.</em>
  </p>
</div>

---

## 📖 Tentang Proyek Ini

**SOLUSIPRD** bermula dari sebuah visi besar: *Bagaimana jika kita bisa menggantikan proses manual berhari-hari dalam merancang arsitektur produk dan menyusun PRD, menjadi hanya dalam hitungan menit menggunakan kecerdasan buatan?*

Platform ini dirancang khusus untuk Senior Product Managers, Security Experts, dan Full-Stack Architects. Dengan mengandalkan LLM berkinerja tinggi, SOLUSIPRD membedah ide mentah pengguna menjadi:
1. **Struktur WBS (Work Breakdown Structure)** divisualisasikan menggunakan diagram interaktif.
2. **Dokumen PRD (Product Requirements Document)** yang komprehensif, mencakup aspek *Security*, *Scalability*, dan *Business Value*.
3. **Actionable Task List**, memecah setiap fitur menjadi *checklist* tugas teknis yang berjenjang dan rapi.

## 🚀 Perjalanan Pengembangan (Development Journey)

Pengembangan SOLUSIPRD adalah perjalanan evolusi iteratif yang berfokus pada **Estetika Premium** dan **Technical Excellence**.

### 1. Perencanaan & Fondasi (The Blueprint)
- **Tech Stack Selection:** Kami memilih **Next.js 15** untuk kerangka utama, **TailwindCSS** untuk desain *glassmorphism* tingkat lanjut, **React Flow** untuk visualisasi *node-based*, dan **Supabase** sebagai *backend-as-a-service* untuk autentikasi dan database.
- **LLM Integration:** Menggunakan **Groq API (Llama-3)** untuk generasi teks latensi rendah yang sangat cepat, memastikan transisi antartahap berjalan mulus tanpa waktu tunggu (loading) yang membosankan.

### 2. Membangun 4 Tahap Keajaiban (The 4-Step Magic)
- **Step 1 (Ideasi):** Antarmuka input yang imersif dan responsif.
- **Step 2 (Visualisasi Struktur):** Mengubah ide abstrak menjadi *Mind Map* (WBS) visual.
- **Step 3 (Dokumentasi PRD):** Generasi dokumen Markdown komprehensif dengan fitur **Revision Chat**—memungkinkan *user* mengobrol dengan AI untuk merevisi dokumen secara langsung.
- **Step 4 (Ekstraksi Task List):** Menarik tugas teknis ke dalam visualisasi diagram tingkat lanjut.

### 3. Monetisasi & Kontrol Admin
- Integrasi **Midtrans Payment Gateway** untuk membatasi *token* bagi pengguna Basic/Free dan membuka akses *Unlimited* bagi pengguna Pro/Max.
- Pembuatan **Admin Dashboard** eksklusif untuk memonitor metrik *user*, serta memodifikasi **System Prompt Utama** secara dinamis langsung dari *database* (Supabase).

## 🛠️ Tantangan & Solusi (Bug Fixes & Refinements)

Tidak ada perangkat lunak hebat yang lahir tanpa mengatasi *bugs* dan tantangan teknis. Berikut adalah penyempurnaan krusial yang telah kami lakukan hingga mencapai versi Final (Finish) ini:

- 🐛 **Inkonsistensi Output AI (The Parsing Bug):**
  - *Masalah:* AI terkadang gagal memisahkan dokumen PRD dan Task List, menyebabkan *error rendering*.
  - *Solusi:* Implementasi pemisah keras (`---TASKS_SEPARATOR---`) yang disuntikkan ke dalam instruksi *system prompt* tingkat dalam, beserta logika *Fallback* jika AI mengabaikannya.
  
- 🐛 **Kepadatan Visual Diagram (The UI Clutter):**
  - *Masalah:* Pada awalnya, *checklist* tugas dijejalkan ke dalam kotak (Node) WBS yang sudah ada, membuat layar Tahap 4 terlalu panjang, bertumpuk, dan tidak beraturan.
  - *Solusi:* Merombak arsitektur `React Flow` dengan melahirkan tipe Node baru (`TaskListNode`). Kami menciptakan **Algoritma Branching (Percabangan)** yang menarik garis mulus dari Fitur utama menuju kotak *checklist* khusus, membentangkan diagram secara elegan ke arah kanan.

- 🐛 **Penamaan File Unduhan (The Random String Issue):**
  - *Masalah:* File PRD dan Task List yang diunduh bernama acak seperti `PRD-1723456789.md`.
  - *Solusi:* Menggunakan algoritma *Regex* untuk mengekstrak nama proyek dari hasil AI, sehingga nama file kini dinamis dan profesional (contoh: `PRD-Vulnerability-Scanner.md`).

- 🐛 **Navigasi Jalan Buntu (The Dead End):**
  - *Masalah:* Pengguna tidak bisa kembali ke tahap sebelumnya tanpa menghapus (*reset*) seluruh *progress*.
  - *Solusi:* Injeksi sistem **Navigasi Back Button** di setiap *footer* transisi, memungkinkan pengguna melompat mundur untuk meninjau kembali PRD atau Struktur tanpa kehilangan *state* komponen.

## 💻 Tech Stack Utama

* **Frontend:** Next.js 15 (App Router), React 18, TailwindCSS, React Markdown, React Flow
* **Backend:** Next.js API Routes, Supabase (PostgreSQL, Auth)
* **AI/LLM:** Groq (Llama-3-70b-versatile)
* **Payment Gateway:** Midtrans
* **Deployment:** Vercel

## 🏁 Kesimpulan

SOLUSIPRD bukan sekadar *tools generator* teks biasa. Ini adalah kolaborasi seni UI/UX modern (*Dark Mode Glassmorphism*) dan rekayasa perangkat lunak arsitektur yang menjadikannya sebagai asisten tangguh tak tergantikan bagi para *Tech Leaders*. Dari ide hingga ke garis akhir, setiap baris kode ditulis untuk memberikan *wow factor*!

---
*Developed with passion & agentic AI (Antigravity).*
