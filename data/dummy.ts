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
  timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
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
