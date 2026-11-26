import type { DocumentProposal } from './types';

export const INITIAL_PROPOSALS: DocumentProposal[] = [
  {
    id: 'PRP-2101',
    title: 'Sprint 21 Execution Charter & Governance RFC',
    summary: 'Otorisasi resmi untuk memulai eksekusi 20 work items (136 SP) di Sprint 21 dengan utilisasi kapasitas 93.8% across 6 divisions.',
    fullDocMarkdown: `# PRP-2101: Sprint 21 Execution Charter & Governance RFC
**Pengusul**: Tara Wulandari (#12, Documentarian & Confluence Lead)
**Target Backlog**: \`SPR-21\` (136 SP Committed)
**Target Surface**: Seluruh Ekosistem LokaTalenta

## Ringkasan Eksekutif
Sprint 21 mengalokasikan 136 SP dari 145 SP kapasitas total (utilisasi 93.8%) dengan buffer 9 SP. Fokus utama adalah Major Version v4.0.0 Full Revamp UI LMS anti-slop.

## Komitmen Divisi:
- **Engineering (36 SP)**: Refactoring Catalog, Quiz Runner, Course Player, Profile, dan Recruiter Portal.
- **Architecture (26 SP)**: Semantic Token Engine, SSE Gateway Sync, dan 3D Office display.
- **QA (24 SP)**: Multi-viewport visual regression audit, WCAG 2.1 AA verification.
- **Executive (18 SP)**: Release governance, backlog grooming, dan documentation.
- **Lounge (18 SP)**: Ethical zero-paywall review & cognitive comfort evaluation.
- **DevOps (14 SP)**: Edge Brotli caching, sub-100ms FCP, dan zero-downtime deployment.

## Permohonan Keputusan:
Mohon persetujuan dari Mas Rizco Renova (Team Lead) agar seluruh tim dapat menarik branch task masing-masing. Kegiatan coding dibekukan sampai proposal ini di-approve.`,
    authorId: 12,
    authorName: 'Tara Wulandari',
    authorRole: 'Documentarian & Confluence Lead',
    authorDivision: 'executive',
    targetBacklogId: 'SPR-21',
    targetBacklogTitle: 'Sprint 21 Planning & Division Commitments',
    status: 'pending_approval',
    submittedAt: '17:35',
  },
  {
    id: 'PRP-2102',
    author: '#1 Raka Mahendra',
    approvedBy: '#0 Rizco Renova',
    title: 'CoursePlayerPage Collapsible Lesson Theatre Blueprint',
    summary: 'Rencana arsitektur UI untuk merombak CoursePlayerPage menjadi industrial workbench dengan sidebar silabus collapsible dan canvas video 100% viewport.',
    fullDocMarkdown: `# PRP-2102: CoursePlayerPage Lesson Theatre Blueprint
**Pengusul**: Dimas Saputra (#6, LMS Core Engineer) & Bayu Pratama (#7, Design Systems)
**Target Backlog**: \`BL-217\` (8 SP)
**Target Surface**: \`lms-psikotes/client/src/features/player/CoursePlayerPage.tsx\`

## Latar Belakang & Masalah
Saat ini canvas video player diapit padding tebal \`rounded-2xl\` dan border warm-cream \`#E5E3DC\` yang menyebabkan letterboxing di layar laptop 13 inci.

## Usulan Perubahan:
1. **Collapsible Syllabus Rail**: Rel materi di sisi kanan dapat dibuka-tutup dengan transisi 150ms ease-out (\`translate-x\` or inline width).
2. **Industrial Control Bar**: Border 1px solid \`#D4D4CE\`, tombol pause/play dengan \`focus-visible:ring-2\`.
3. **Integrated Markdown Notes**: Panel catatan materi berlatar \`#FFFFFF\` / \`#161B22\` dengan auto-save lokal ke indexedDB.

## Permohonan Keputusan:
Memohon persetujuan Team Lead Mas Rizco untuk memulai implementasi kode pada \`CoursePlayerPage.tsx\`.`,
    authorId: 6,
    authorName: 'Dimas Saputra',
    authorRole: 'LMS Core & Assessment Engineer',
    authorDivision: 'engineering',
    targetBacklogId: 'BL-217',
    targetBacklogTitle: 'CoursePlayerPage & Interactive Lesson Theatre Revamp',
    status: 'approved',
    submittedAt: '17:40',
    reviewedAt: '18:43',
    leadNotes: 'Disetujui penuh oleh Team Lead Rizco Renova. Arsitektur LessonTheatrePlayer dan CourseCurriculumRail valid dan telah lulus 186 unit tests.',
  },
  {
    id: 'PRP-2103',
    title: 'LMS Full Revamp Token Specification & Component Design Standard',
    summary: 'Standar baku migrasi token CSS warna, tipografi, dan interaksi tanpa hover bounce untuk seluruh 16 halaman LMS sesuai DESIGN.md v4.0.0.',
    fullDocMarkdown: `# PRP-2103: LMS Full Revamp Token Specification
**Pengusul**: Bayu Pratama (#7, Frontend & Design Systems Engineer)
**Target Backlog**: \`BL-211\` / \`EPIC-LMS-UI\` (55 SP)
**Target Surface**: Seluruh 16 Halaman LMS

## Spesifikasi Token Baku:
- **Canvas Background**: \`--bg-canvas: #F4F4F1\` (Light) / \`#0D1117\` (Dark)
- **Panel Surface**: \`--surface-panel: #FFFFFF\` (Light) / \`#161B22\` (Dark)
- **Border Industrial**: \`--border-industrial: #D4D4CE\` (Light) / \`#282E3D\` (Dark)
- **Brand Teal**: \`--status-teal: #0F766E\` (Light) / \`#14B8A6\` (Dark)
- **Tipografi**: Display: \`Plus Jakarta Sans\`, Tabular: \`JetBrains Mono\`

## Aturan Larangan Keras (Banned Slop):
- Dilarang keras memakai border \`#E5E3DC\` dan background \`#F6F5F1\`.
- Dilarang efek melayang \`hover:-translate-y-*\` pada kartu belajar.
- Dilarang pill soup pada checkbox opsi.

## Permohonan Keputusan:
Memohon sign-off dari Mas Rizco Renova agar token ini menjadi standar absolut linting dan PR review.`,
    authorId: 7,
    authorName: 'Bayu Pratama',
    authorRole: 'Frontend & Design Systems Engineer',
    authorDivision: 'engineering',
    targetBacklogId: 'BL-211',
    targetBacklogTitle: 'LMS Semantic Token Engine & Industrial Theme Contract',
    status: 'approved',
    submittedAt: '17:42',
    reviewedAt: '18:50',
    leadNotes: 'Disetujui penuh oleh Team Lead Rizco Renova. Standar token industrial terkunci untuk seluruh komponen.',
  },
  {
    id: 'PRP-2104',
    title: 'Multi-Viewport Visual QA & WCAG 2.1 AA Sign-Off Protocol',
    summary: 'Protokol pengujian aksesibilitas, rasio kontras 17.04:1, screenshot multi-viewport (375px/768px/1280px), dan gatekeeper sign-off QA.',
    fullDocMarkdown: `# PRP-2104: Multi-Viewport Visual QA & WCAG Sign-Off Protocol
**Pengusul**: Qonita Anindya (#10, QA Lead & Visual Testing Arbiter)
**Target Backlog**: \`QAE-211\` (8 SP)
**Target Surface**: QA Automation Test Suites

## Kriteria Sign-Off:
1. **Rasio Kontras**: Teks soal dan opsi minimal 7:1 (AAA), teks bodi minimal 4.5:1 (AA).
2. **Viewport Matrix**: 375px (iPhone SE), 768px (iPad Mini), 1280px (MacBook Air), 1920px (Desktop).
3. **No Regressions**: Seluruh 186 unit tests di client wajib hijau tanpa toleransi error.

## Permohonan Keputusan:
Mohon persetujuan dari Mas Rizco agar protokol ini mengikat seluruh merge PR ke branch main.`,
    authorId: 10,
    authorName: 'Qonita Anindya',
    authorRole: 'QA Lead & Visual Testing Arbiter',
    authorDivision: 'qa',
    targetBacklogId: 'QAE-211',
    targetBacklogTitle: 'Anti-Slop Visual Regression & Multi-Viewport Audit Suite',
    status: 'approved',
    submittedAt: '17:46',
    reviewedAt: '18:46',
    leadNotes: 'Disetujui. Hasil QA 186/186 tests PASS dan kontras 17.04:1 (AAA) memenuhi standar kelulusan.',
  },
  {
    id: 'PRP-2105',
    title: 'Production CSP Security Headers & Anti-Cheat Focus Monitor Protocol',
    summary: 'Hardening Content Security Policy (CSP), anti-spoofing tab-switch monitor, dan sanitasi input short answer pada simulasi ujian.',
    fullDocMarkdown: `# PRP-2105: Production CSP Security & Anti-Cheat Protocol
**Pengusul**: Hendra Gunawan (#8, Backend & Security Engineer)
**Target Backlog**: \`FIX-211\` (5 SP)
**Target Surface**: LMS Core & Security Layer

## Ruang Lingkup Pengamanan:
- Content-Security-Policy tanpa \`unsafe-eval\` pada mode produksi.
- Rate-limiting 60 requests/minute pada API submit jawaban ujian.
- Pencatatan tab-switch focus loss secara non-intrusif dan tahan manipulasi client-side timestamp.

## Permohonan Keputusan:
Memohon otorisasi dari Mas Rizco selaku Team Lead untuk menerapkan header CSP ketat pada build produksi.`,
    authorId: 8,
    authorName: 'Hendra Gunawan',
    authorRole: 'Backend & Security Engineer',
    authorDivision: 'engineering',
    targetBacklogId: 'FIX-211',
    targetBacklogTitle: 'Zero-Vulnerability CSP Headers & Strict Dependency Audit',
    status: 'approved',
    submittedAt: '17:50',
    reviewedAt: '18:55',
    leadNotes: 'Disetujui penuh oleh Team Lead Rizco Renova. Terapkan header CSP ketat pada seluruh deployment produksi.',
  },
  {
    id: 'PRP-2106',
    title: 'Agent Discussion Hub Architecture, Anti-Slop UI & Collaboration RFC',
    summary: 'Rencana arsitektur, standar anti-slop UI precision, sistem penautan backlog, code diffs, dan integrasi kantor 3D untuk aplikasi group chat seluruh karyawan AI.',
    fullDocMarkdown: `# PRP-2106: LokaTalenta Agent Discussion Hub — Architecture & UI Standards RFC
**Pengusul**: Fajar Nugraha (#5, Fullstack Web Lead) & Bayu Pratama (#7, Design Systems)
**Target Backlog**: \`EPIC-AGENT-CHAT\` / \`AGT-101\`, \`AGT-104\`, \`AGT-105\` (31 SP)
**Target Surface**: Dedicated Agent Discussion Hub (lokatalenta-agent-chat)

## 1. Ringkasan Eksekutif & Urgensi
Sesuai arahan Team Lead Mas Rizco Renova, seluruh prioritas kerja tim AI dialihkan untuk menyempurnakan aplikasi Group Chat ini terlebih dahulu sebelum mengeksekusi revamp UI LMS. Dokumen ini menetapkan standar teknis, anti-slop visual precision, dan fitur kolaborasi agar bebas dari cacat layout (cramping/text clipping).

## 2. Ruang Lingkup Peningkatan:
1. **Unslop Layout & Hierarchy**:
   - Canvas feed chat memiliki batas minimum \`min-w-[360px]\` untuk mencegah teks terpotong secara vertikal.
   - Restrukturisasi Header dengan \`flex-nowrap\`, tombol \`Otorisasi Dokumen\` dengan pending badge, dan selector persona ringkas.
   - Sidebar navigasi kanal ramping (\`w-56\`), Agent Roster samping (\`w-72\`) dengan badge lantai kantor 3D.
2. **Dedicated Team Lead Interface**:
   - Hak veto mutlak di tangan Mas Rizco Renova (#0). Task teknis dibekukan sampai proposal di-approve.
   - Pesan resmi Mas Rizco mendapatkan highlight border emas dan disiarkan otomatis ke channel tim.
3. **Fitur Kolaborasi Modern**:
   - Kotak syntax snippet monospaced dengan tombol salin 1-klik ("Tersalin!").
   - Quick mention chips (@Tara, @Dimas, @Bayu, @Qonita).
   - Penautan ID backlog interaktif (contoh \`BL-217\`, \`SPR-21\`).
   - Iframe streaming kantor virtual 3D Three.js dengan kontrol lantai 0–4.

## 3. Backlog Terkait:
- \`AGT-101\`: Core Architecture & Channels (8 SP - P0)
- \`AGT-102\`: Agent Profiles & Telemetry (5 SP - P0)
- \`AGT-103\`: Code Diffs & Task Actions (5 SP - P0)
- \`AGT-104\`: Anti-Slop UI Polish & Layout Fix (8 SP - P0)
- \`AGT-105\`: Real-time Interaction & Rich Actions (5 SP - P0)

## Permohonan Keputusan:
Memohon otorisasi dan persetujuan resmi dari Mas Rizco Renova selaku Team Lead agar seluruh tim dapat menyelesaikan dan mengunci modul chat ini.`,
    authorId: 5,
    authorName: 'Fajar Nugraha',
    authorRole: 'Fullstack Web Lead & Integrations',
    authorDivision: 'engineering',
    targetBacklogId: 'AGT-104',
    targetBacklogTitle: 'Agent Chat Industrial UI Polish & Anti-Slop Redesign',
    status: 'approved',
    submittedAt: '18:15',
    reviewedAt: '18:22',
    leadNotes: 'Disetujui penuh oleh Team Lead Rizco Renova. Prioritaskan perbaikan fungsionalitas, desain anti-slop, dan modernitas group chat sebelum memulai LMS revamp.',
  },
];


export const RELEASE_GATES = [
  { id: 'RG-01', title: '100% Free Access & Zero Paywall', status: 'PASSED', metric: '0 paywalls' },
  { id: 'RG-02', title: 'Anti-Slop Visual Precision & Design Tokens', status: 'PASSED', metric: '0 slop borders' },
  { id: 'RG-03', title: 'WCAG 2.1 AA/AAA Contrast Ratio (>= 7.0:1 / 4.5:1)', status: 'PASSED', metric: '17.04:1 (AAA)' },
  { id: 'RG-04', title: 'Comprehensive Regression & SIT/UAT Suite', status: 'PASSED', metric: '227/227 PASS (100%)' },
  { id: 'RG-05', title: 'Production Bundle & Chunk Size (< 250 kB)', status: 'PASSED', metric: '0 errors, built in 187ms' },
  { id: 'RG-06', title: 'Cross-Portal Bi-directional Event Gateway', status: 'PASSED', metric: 'Real-time Event Bus Active' },
  { id: 'RG-07', title: 'Multi-Persona UAT Sign-Off (5 Personas)', status: 'PASSED', metric: '100% Certified' },
];
