export type Lang = "en" | "id";

const translations = {
  en: {
    nav: {
      dashboard: "Dashboard",
      transactions: "Transactions",
      budgets: "Budgets",
      settings: "Settings",
    },
    navbar: {
      export: "Export",
      signOut: "Sign out",
    },
    landing: {
      tagline: "Track family expenses as easily as sending a WhatsApp message",
      whatsappFirst: "WhatsApp First",
      whatsappFirstDesc: "Log expenses directly from WA, no app to open",
      sharedDashboard: "Shared Dashboard",
      sharedDashboardDesc: "All family members can view spending trends",
      multiMember: "Multi-member",
      multiMemberDesc: "Invite your spouse, kids, or other family members",
      safeEasy: "Safe & Easy",
      safeEasyDesc: "Sign in with Google — no new password needed",
      cta: "Sign in to start tracking your family finances",
    },
    auth: {
      signInWithGoogle: "Sign in with Google",
      signInTitle: "Sign in to your account",
      signInDisclaimer:
        "By signing in, you agree to the use of your data for family finance tracking purposes.",
    },
    dashboard: {
      title: "Family Dashboard",
      subtitle: "This month's financial summary",
      noFamily: "Family group not found. Contact administrator.",
    },
    transactions: {
      title: "Transactions",
      subtitle: "All family expenses",
    },
    budgets: {
      title: "Budgets",
      subtitle: "Manage monthly spending limits per category",
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your family and account",
      familyGroup: "Family Group",
      groupName: "Group name:",
      members: "Members",
      connectWhatsApp: "Connect WhatsApp",
      connectWhatsAppDesc:
        "Add your WhatsApp number to your profile so expenses logged via WA are linked to this account.",
    },
    summary: {
      totalThisMonth: "Total This Month",
      transactions: "Transactions",
      activeMembers: "Active Members",
    },
    chart: {
      title: "Spending Trend This Month",
      empty: "No spending data this month",
      dateLabel: "Date",
    },
    contributions: {
      title: "Member Contributions",
      empty: "No transactions yet",
      total: "Total",
    },
    budgetOverview: {
      title: "This Month's Budgets",
      empty: "No budgets set. Add one on the Budgets page.",
      used: "% used",
    },
    transactionList: {
      titleAll: "All Transactions",
      titleRecent: "Recent Transactions",
      empty: "No transactions yet",
    },
    addTransaction: {
      button: "Add",
      modalTitle: "Add Transaction",
      category: "Category",
      amount: "Amount",
      currency: "Currency",
      notes: "Notes",
      notesPlaceholder: "Lunch at a restaurant",
      date: "Date",
      saving: "Saving...",
      save: "Save Transaction",
    },
    invite: {
      button: "Invite Member",
      modalTitle: "Invite Family Member",
      emailLabel: "Email (optional)",
      emailPlaceholder: "member@email.com",
      emailHint: "Leave blank to create a general invite link",
      generate: "Generate Invite Link",
      generating: "Generating...",
      linkLabel: "Invite link (valid for 7 days):",
      linkHint: "Share this link with your family member",
    },
    export: {
      date: "Date",
      amount: "Amount",
      currency: "Currency",
      notes: "Notes",
      category: "Category",
      member: "Member",
    },
  },
  id: {
    nav: {
      dashboard: "Dasbor",
      transactions: "Transaksi",
      budgets: "Anggaran",
      settings: "Pengaturan",
    },
    navbar: {
      export: "Export",
      signOut: "Keluar",
    },
    landing: {
      tagline: "Catat pengeluaran keluarga semudah kirim pesan WhatsApp",
      whatsappFirst: "WhatsApp First",
      whatsappFirstDesc: "Catat langsung dari WA, tanpa buka aplikasi",
      sharedDashboard: "Dasbor Bersama",
      sharedDashboardDesc: "Semua anggota keluarga bisa lihat tren pengeluaran",
      multiMember: "Multi-anggota",
      multiMemberDesc: "Undang suami, istri, atau anggota keluarga lain",
      safeEasy: "Aman & Mudah",
      safeEasyDesc: "Login pakai Google — tidak perlu password baru",
      cta: "Masuk untuk mulai melacak keuangan keluarga Anda",
    },
    auth: {
      signInWithGoogle: "Masuk dengan Google",
      signInTitle: "Masuk ke akun Anda",
      signInDisclaimer:
        "Dengan masuk, Anda menyetujui penggunaan data untuk keperluan pelacakan keuangan keluarga.",
    },
    dashboard: {
      title: "Dasbor Keluarga",
      subtitle: "Ringkasan keuangan bulan ini",
      noFamily: "Keluarga tidak ditemukan. Hubungi administrator.",
    },
    transactions: {
      title: "Transaksi",
      subtitle: "Semua pengeluaran keluarga",
    },
    budgets: {
      title: "Anggaran",
      subtitle: "Kelola batas pengeluaran bulanan per kategori",
    },
    settings: {
      title: "Pengaturan",
      subtitle: "Kelola keluarga dan akun Anda",
      familyGroup: "Grup Keluarga",
      groupName: "Nama grup:",
      members: "Anggota",
      connectWhatsApp: "Hubungkan WhatsApp",
      connectWhatsAppDesc:
        "Tambahkan nomor WhatsApp kamu ke profil agar pencatatan via WA langsung terhubung ke akun ini.",
    },
    summary: {
      totalThisMonth: "Total Bulan Ini",
      transactions: "Transaksi",
      activeMembers: "Anggota Aktif",
    },
    chart: {
      title: "Tren Pengeluaran Bulan Ini",
      empty: "Belum ada data pengeluaran bulan ini",
      dateLabel: "Tanggal",
    },
    contributions: {
      title: "Kontribusi Anggota",
      empty: "Belum ada transaksi",
      total: "Total",
    },
    budgetOverview: {
      title: "Anggaran Bulan Ini",
      empty: "Belum ada anggaran. Tambahkan di halaman Anggaran.",
      used: "% terpakai",
    },
    transactionList: {
      titleAll: "Semua Transaksi",
      titleRecent: "Transaksi Terbaru",
      empty: "Belum ada transaksi",
    },
    addTransaction: {
      button: "Tambah",
      modalTitle: "Tambah Transaksi",
      category: "Kategori",
      amount: "Nominal",
      currency: "Mata uang",
      notes: "Catatan",
      notesPlaceholder: "Makan siang di warteg",
      date: "Tanggal",
      saving: "Menyimpan...",
      save: "Simpan Transaksi",
    },
    invite: {
      button: "Undang Anggota",
      modalTitle: "Undang Anggota Keluarga",
      emailLabel: "Email (opsional)",
      emailPlaceholder: "anggota@email.com",
      emailHint: "Kosongkan untuk membuat link undangan umum",
      generate: "Buat Link Undangan",
      generating: "Membuat link...",
      linkLabel: "Link undangan (berlaku 7 hari):",
      linkHint: "Bagikan link ini ke anggota keluarga Anda",
    },
    export: {
      date: "Tanggal",
      amount: "Nominal",
      currency: "Mata_Uang",
      notes: "Catatan",
      category: "Kategori",
      member: "Anggota",
    },
  },
} as const;

export type Translations = typeof translations.en;
export type TranslationKey = string;

export default translations;
