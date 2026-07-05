// ============================================================
// KHAJEAI PRD & Task Generator — Dummy Data
// All data simulates AI-generated content for demo purposes
// ============================================================

export interface PRDSection {
  id: string;
  title: string;
  content: string;
}

export interface UserRole {
  role: string;
  description: string;
  permissions: string[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  subFeatures: string[];
}

export interface TechStackItem {
  name: string;
  category: string;
  reason: string;
}

export interface Milestone {
  phase: string;
  title: string;
  duration: string;
  tasks: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  message: string;
  timestamp: string;
}

// ============================================================
// PRD Data — Aplikasi Booking Studio Musik "StudioBook"
// ============================================================

export const dummyPRD = {
  projectName: 'StudioBook',
  tagline: 'Platform Booking Studio Musik yang Cerdas & Efisien',
  status: 'Draft' as const,

  background: `StudioBook hadir untuk mengatasi masalah umum dalam industri studio musik di Indonesia: proses booking yang masih manual, tidak transparan, dan seringkali membingungkan. 

Saat ini, sebagian besar studio musik masih mengandalkan WhatsApp atau telepon untuk proses reservasi. Hal ini menyebabkan:
• Double-booking yang merugikan pelanggan dan pemilik studio
• Tidak ada visibilitas real-time terhadap ketersediaan ruangan
• Proses pembayaran yang tidak terstruktur
• Kesulitan dalam mengelola jadwal untuk multi-ruangan

StudioBook menawarkan solusi digital end-to-end yang memungkinkan musisi menemukan, membooking, dan membayar sewa studio secara online dengan pengalaman yang seamless.`,

  userRoles: [
    {
      role: 'Musisi (Customer)',
      description: 'Pengguna yang mencari dan membooking studio musik untuk latihan atau rekaman.',
      permissions: [
        'Mencari studio berdasarkan lokasi & fasilitas',
        'Melihat ketersediaan jadwal real-time',
        'Melakukan booking & pembayaran online',
        'Memberikan rating & review',
        'Mengelola riwayat booking',
      ],
    },
    {
      role: 'Pemilik Studio (Owner)',
      description: 'Pemilik atau pengelola studio musik yang mendaftarkan studio mereka di platform.',
      permissions: [
        'Mendaftarkan studio & ruangan',
        'Mengatur jadwal ketersediaan',
        'Menetapkan harga per jam/sesi',
        'Melihat dashboard pendapatan',
        'Merespons review pelanggan',
      ],
    },
    {
      role: 'Admin Platform',
      description: 'Tim internal yang mengelola operasional platform secara keseluruhan.',
      permissions: [
        'Verifikasi studio baru',
        'Moderasi review & konten',
        'Mengelola dispute/refund',
        'Melihat analytics platform-wide',
        'Mengatur promo & featured studios',
      ],
    },
  ] as UserRole[],

  features: [
    {
      id: 'F001',
      name: 'Studio Discovery & Search',
      description: 'Fitur pencarian studio dengan filter komprehensif termasuk lokasi, harga, fasilitas, dan rating.',
      priority: 'high' as const,
      subFeatures: [
        'Search by lokasi dengan map integration',
        'Filter berdasarkan harga, rating, fasilitas',
        'Studio recommendation engine',
        'Gallery foto & virtual tour studio',
      ],
    },
    {
      id: 'F002',
      name: 'Real-time Booking System',
      description: 'Sistem reservasi real-time dengan kalender interaktif yang menunjukkan slot tersedia.',
      priority: 'high' as const,
      subFeatures: [
        'Kalender interaktif per ruangan',
        'Booking per jam atau per sesi',
        'Conflict detection & prevention',
        'Booking confirmation via email & push notification',
      ],
    },
    {
      id: 'F003',
      name: 'Payment Gateway Integration',
      description: 'Integrasi pembayaran digital dengan berbagai metode termasuk e-wallet dan transfer bank.',
      priority: 'high' as const,
      subFeatures: [
        'Multi-payment method (GoPay, OVO, VA, CC)',
        'Automated invoicing',
        'Refund management system',
        'Split payment untuk group booking',
      ],
    },
    {
      id: 'F004',
      name: 'Studio Owner Dashboard',
      description: 'Dashboard komprehensif untuk pemilik studio mengelola operasional dan melihat analytics.',
      priority: 'medium' as const,
      subFeatures: [
        'Revenue & occupancy analytics',
        'Jadwal management drag-and-drop',
        'Customer insights & demographics',
        'Promo & discount management',
      ],
    },
    {
      id: 'F005',
      name: 'Rating & Review System',
      description: 'Sistem ulasan yang transparan untuk membangun kepercayaan antar user dan studio.',
      priority: 'medium' as const,
      subFeatures: [
        'Star rating (1-5) dengan kategori',
        'Photo review capability',
        'Owner response feature',
        'Review moderation system',
      ],
    },
    {
      id: 'F006',
      name: 'Notification & Reminder',
      description: 'Sistem notifikasi multi-channel untuk mengingatkan jadwal booking dan update penting.',
      priority: 'low' as const,
      subFeatures: [
        'Push notification (mobile & web)',
        'Email reminder H-1 dan H-hour',
        'WhatsApp integration (opsional)',
        'In-app notification center',
      ],
    },
  ] as Feature[],

  techStack: [
    { name: 'Next.js 14', category: 'Frontend', reason: 'SSR & SEO optimal untuk discovery page' },
    { name: 'React', category: 'Frontend', reason: 'Component-based UI dengan ekosistem besar' },
    { name: 'Tailwind CSS', category: 'Styling', reason: 'Rapid prototyping dengan utility classes' },
    { name: 'Node.js + Express', category: 'Backend', reason: 'JavaScript ecosystem consistency' },
    { name: 'PostgreSQL', category: 'Database', reason: 'Relational data untuk booking & scheduling' },
    { name: 'Redis', category: 'Cache', reason: 'Real-time availability caching' },
    { name: 'Midtrans', category: 'Payment', reason: 'Payment gateway lokal Indonesia' },
    { name: 'Vercel', category: 'Deployment', reason: 'Optimal untuk Next.js deployment' },
  ] as TechStackItem[],

  timeline: [
    {
      phase: 'Phase 1',
      title: 'MVP Foundation',
      duration: '4 minggu',
      tasks: ['Setup project & database', 'Auth system', 'Studio listing CRUD', 'Basic search & filter'],
    },
    {
      phase: 'Phase 2',
      title: 'Core Booking',
      duration: '3 minggu',
      tasks: ['Calendar booking system', 'Payment integration', 'Email notifications', 'Booking management'],
    },
    {
      phase: 'Phase 3',
      title: 'Enhancement',
      duration: '3 minggu',
      tasks: ['Rating & review', 'Owner dashboard analytics', 'Map integration', 'Performance optimization'],
    },
    {
      phase: 'Phase 4',
      title: 'Launch Prep',
      duration: '2 minggu',
      tasks: ['QA & bug fixes', 'SEO optimization', 'Documentation', 'Soft launch & monitoring'],
    },
  ] as Milestone[],
};

// ============================================================
// Chat Messages — Pre-loaded welcome + revision responses
// ============================================================

export const welcomeMessage: ChatMessage = {
  id: 'welcome-1',
  role: 'ai',
  message:
    'Halo! 👋 Saya siap membantu merevisi PRD Anda. Klik tombol ✏️ pada section mana pun untuk meminta revisi, atau langsung ketik permintaan Anda di bawah.',
  timestamp: '',
};

export const dummyRevisionResponses: Record<string, string> = {
  'latar belakang':
    'Baik, saya telah memperbarui bagian Latar Belakang. Saya menambahkan data statistik tentang jumlah studio musik di Indonesia (~2,500 studio aktif) dan potensi market size sebesar Rp 150M/tahun. Apakah ada hal lain yang perlu ditambahkan?',
  'user roles':
    'Saya telah menambahkan role baru "Guest User" yang bisa melihat listing studio tanpa login, dan menambahkan permission "Reschedule booking" untuk role Musisi. Silakan review perubahannya.',
  'spesifikasi fitur':
    'Saya telah menambahkan fitur "Recurring Booking" untuk musisi yang rutin latihan mingguan, dan "Equipment Rental Add-on" agar studio bisa menawarkan penyewaan alat musik tambahan. Priority keduanya set ke Medium.',
  'tech stack':
    'Berdasarkan kebutuhan real-time booking, saya merekomendasikan menambahkan Socket.io untuk live availability updates dan Cloudinary untuk optimasi foto studio. Saya juga mengganti Redis dengan Upstash Redis untuk serverless compatibility.',
  timeline:
    'Saya telah menyesuaikan timeline menjadi lebih konservatif: Phase 1 diperpanjang menjadi 5 minggu untuk mengakomodasi testing yang lebih thorough, dan menambahkan buffer 1 minggu di Phase 4 untuk unexpected issues.',
  default:
    'Terima kasih atas masukannya! Saya telah mencatat perubahan yang Anda minta dan memperbarui section terkait di PRD. Silakan review hasilnya di panel sebelah kiri. Ada revisi lain yang diperlukan?',
};

// ============================================================
// Tech Stack Options for Step 1 dropdown
// ============================================================

export const techStackOptions = [
  { value: 'ai-decide', label: '🤖 Let AI decide', description: 'AI akan memilih stack terbaik untuk proyek Anda' },
  { value: 'nextjs-react', label: '⚛️ Next.js + React', description: 'Full-stack web dengan SSR' },
  { value: 'vuejs-nuxt', label: '💚 Vue.js + Nuxt', description: 'Progressive framework + SSR' },
  { value: 'react-native', label: '📱 React Native', description: 'Cross-platform mobile app' },
  { value: 'python-fastapi', label: '🐍 Python + FastAPI', description: 'High-performance backend API' },
];

export const platformOptions = [
  { value: 'web', label: '🌐 Web Application' },
  { value: 'mobile', label: '📱 Mobile Application' },
  { value: 'both', label: '🔗 Both (Web + Mobile)' },
];

// ============================================================
// Step 2 — Clarification AI Chat Questions
// ============================================================

export interface ClarificationQuestion {
  id: string;
  question: string;
  context: string;
  suggestions: string[];
}

export const clarificationQuestions: ClarificationQuestion[] = [
  {
    id: 'q1',
    question:
      'Siapa target pengguna utama aplikasi Anda? Apakah ini untuk B2C (langsung ke end-user), B2B (antar bisnis), atau keduanya? Dan berapa estimasi skala pengguna di tahap awal?',
    context: 'Memahami target audience untuk menentukan arsitektur & UX yang tepat.',
    suggestions: [
      'B2C — musisi individual dan band lokal, target 500-1000 user di awal',
      'B2B — studio musik yang ingin mendigitalisasi booking mereka',
      'Keduanya — marketplace dua sisi (musisi + pemilik studio)',
    ],
  },
  {
    id: 'q2',
    question:
      'Apakah Anda memerlukan sistem pembayaran terintegrasi (payment gateway) di versi pertama? Atau cukup booking konfirmasi saja dulu dan pembayaran dilakukan secara offline?',
    context: 'Menentukan kompleksitas MVP dan integrasi pihak ketiga yang dibutuhkan.',
    suggestions: [
      'Ya, payment gateway lengkap (GoPay, OVO, transfer bank)',
      'Cukup booking konfirmasi dulu, bayar langsung di studio',
      'Hybrid — deposit online, sisa bayar di tempat',
    ],
  },
  {
    id: 'q3',
    question:
      'Fitur real-time apa yang paling penting untuk Anda? Misalnya: live availability kalender, notifikasi instant, atau chat antara musisi dan pemilik studio?',
    context: 'Menentukan kebutuhan infrastruktur real-time (WebSocket, SSE, polling).',
    suggestions: [
      'Live availability kalender — harus update real-time saat ada yang booking',
      'Notifikasi instant — push notification untuk konfirmasi & reminder',
      'Semua di atas termasuk in-app chat antara musisi dan pemilik studio',
    ],
  },
];

export const clarificationResponses: Record<string, string> = {
  q1: 'Bagus! Dengan target marketplace dua sisi, kita perlu memastikan UX yang berbeda untuk masing-masing role. Saya akan menyiapkan dashboard terpisah untuk musisi dan pemilik studio. Mari lanjut ke pertanyaan berikutnya.',
  q2: 'Noted! Saya akan memasukkan payment gateway sebagai fitur core di PRD. Kita akan integrasikan Midtrans untuk mendukung berbagai metode pembayaran lokal Indonesia.',
  q3: 'Excellent! Real-time features akan menjadi diferensiasi utama. Saya akan merekomendasikan WebSocket untuk live availability dan push notification service. Sekarang saya punya gambaran yang jelas tentang kebutuhan Anda!',
  default: 'Terima kasih atas jawabannya! Informasi ini akan sangat membantu dalam menyusun PRD yang lebih akurat.',
};

// ============================================================
// Step 3 — Feature Mapping Tree
// ============================================================

export interface FeatureNode {
  id: string;
  name: string;
  icon: string;
  description: string;
  priority: 'core' | 'important' | 'nice-to-have';
  children?: FeatureNode[];
}

export const featureTree: FeatureNode[] = [
  {
    id: 'auth',
    name: 'Authentication & Authorization',
    icon: '🔐',
    description: 'Sistem login, registrasi, dan manajemen role pengguna',
    priority: 'core',
    children: [
      { id: 'auth-1', name: 'Email & Password Login', icon: '📧', description: 'Registrasi dan login dengan email', priority: 'core' },
      { id: 'auth-2', name: 'Google OAuth', icon: '🔑', description: 'Login cepat via Google', priority: 'important' },
      { id: 'auth-3', name: 'Role-based Access', icon: '👤', description: 'Musisi, Owner, Admin permissions', priority: 'core' },
      { id: 'auth-4', name: 'Profile Management', icon: '⚙️', description: 'Edit profil, foto, preferensi', priority: 'important' },
    ],
  },
  {
    id: 'discovery',
    name: 'Studio Discovery',
    icon: '🔍',
    description: 'Pencarian dan eksplorasi studio musik',
    priority: 'core',
    children: [
      { id: 'disc-1', name: 'Search & Filter', icon: '🎯', description: 'Cari berdasarkan lokasi, harga, fasilitas', priority: 'core' },
      { id: 'disc-2', name: 'Map Integration', icon: '🗺️', description: 'Peta interaktif lokasi studio', priority: 'important' },
      { id: 'disc-3', name: 'Studio Detail Page', icon: '📸', description: 'Gallery foto, deskripsi, review', priority: 'core' },
      { id: 'disc-4', name: 'Recommendation Engine', icon: '✨', description: 'Rekomendasi berdasarkan preferensi', priority: 'nice-to-have' },
    ],
  },
  {
    id: 'booking',
    name: 'Booking System',
    icon: '📅',
    description: 'Sistem reservasi dan manajemen jadwal',
    priority: 'core',
    children: [
      { id: 'book-1', name: 'Interactive Calendar', icon: '🗓️', description: 'Kalender real-time per ruangan', priority: 'core' },
      { id: 'book-2', name: 'Slot Management', icon: '⏰', description: 'Booking per jam atau per sesi', priority: 'core' },
      { id: 'book-3', name: 'Conflict Prevention', icon: '🛡️', description: 'Cegah double-booking otomatis', priority: 'core' },
      { id: 'book-4', name: 'Recurring Booking', icon: '🔄', description: 'Jadwal latihan rutin mingguan', priority: 'nice-to-have' },
    ],
  },
  {
    id: 'payment',
    name: 'Payment System',
    icon: '💳',
    description: 'Pembayaran digital multi-metode',
    priority: 'core',
    children: [
      { id: 'pay-1', name: 'Payment Gateway', icon: '🏦', description: 'Midtrans: GoPay, OVO, VA, CC', priority: 'core' },
      { id: 'pay-2', name: 'Invoice & Receipt', icon: '🧾', description: 'Auto-generated invoice & receipt', priority: 'important' },
      { id: 'pay-3', name: 'Refund System', icon: '↩️', description: 'Manajemen refund & cancellation', priority: 'important' },
      { id: 'pay-4', name: 'Split Payment', icon: '👥', description: 'Pembagian bayar untuk group', priority: 'nice-to-have' },
    ],
  },
  {
    id: 'dashboard',
    name: 'Owner Dashboard',
    icon: '📊',
    description: 'Panel kontrol untuk pemilik studio',
    priority: 'important',
    children: [
      { id: 'dash-1', name: 'Revenue Analytics', icon: '📈', description: 'Grafik pendapatan & occupancy', priority: 'important' },
      { id: 'dash-2', name: 'Schedule Manager', icon: '📋', description: 'Drag-and-drop jadwal ruangan', priority: 'important' },
      { id: 'dash-3', name: 'Customer Insights', icon: '👥', description: 'Demografi & behavior pelanggan', priority: 'nice-to-have' },
      { id: 'dash-4', name: 'Promo Manager', icon: '🏷️', description: 'Buat & kelola diskon/promo', priority: 'nice-to-have' },
    ],
  },
  {
    id: 'engagement',
    name: 'User Engagement',
    icon: '⭐',
    description: 'Fitur interaksi dan retensi pengguna',
    priority: 'important',
    children: [
      { id: 'eng-1', name: 'Rating & Review', icon: '⭐', description: 'Sistem rating 1-5 bintang', priority: 'important' },
      { id: 'eng-2', name: 'Push Notifications', icon: '🔔', description: 'Reminder booking & promo', priority: 'important' },
      { id: 'eng-3', name: 'In-App Messaging', icon: '💬', description: 'Chat musisi ↔ pemilik studio', priority: 'nice-to-have' },
      { id: 'eng-4', name: 'Favorites & Wishlist', icon: '❤️', description: 'Simpan studio favorit', priority: 'nice-to-have' },
    ],
  },
];
