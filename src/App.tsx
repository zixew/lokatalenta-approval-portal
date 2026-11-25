import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  FileText,
  Lock,
  MessageSquare,
  Moon,
  Plus,
  Rocket,
  ShieldAlert,
  Sun,
  Terminal,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { INITIAL_PROPOSALS } from './data';
import { dispatchSDLCEvent } from './services/eventBus';
import type { DocumentProposal, ProposalStatus } from './types';

export function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('lokatalenta-portal-theme') === 'dark';
  });

  const [activeTab, setActiveTab] = useState<'proposals' | 'new_proposal' | 'release_gate'>('proposals');
  const [proposals, setProposals] = useState<DocumentProposal[]>(() => {
    const saved = localStorage.getItem('lokatalenta-agent-proposals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROPOSALS;
      }
    }
    return INITIAL_PROPOSALS;
  });

  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    proposals.length > 0 ? proposals[0].id : ''
  );
  const [feedbackNote, setFeedbackNote] = useState<string>('');

  // New Proposal Form
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newMarkdown, setNewMarkdown] = useState('');
  const [newBacklogId, setNewBacklogId] = useState('BL-220');
  const [newBacklogTitle, setNewBacklogTitle] = useState('Course Syllabus Drawer Fluid Gesture Optimization');

  // Release Gate State
  const [releaseVersion, setReleaseVersion] = useState('v4.0.0-PROD');
  const [releaseNotes, setReleaseNotes] = useState('Major release v4.0.0: Industrial Precision Workbench, zero slop, 186 unit tests PASS, WCAG 2.1 AA 17.04:1.');
  const [releaseAuthorized, setReleaseAuthorized] = useState<boolean>(() => {
    return localStorage.getItem('lokatalenta-release-authorized') === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lokatalenta-portal-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lokatalenta-portal-theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('lokatalenta-agent-proposals', JSON.stringify(proposals));
  }, [proposals]);

  const currentProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];

  const pendingCount = proposals.filter((p) => p.status === 'pending_approval').length;
  const approvedCount = proposals.filter((p) => p.status === 'approved').length;
  const revisionCount = proposals.filter((p) => p.status === 'revision_requested').length;

  const handleApprove = (proposalId: string) => {
    const targetProp = proposals.find((p) => p.id === proposalId);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'approved',
              reviewedAt: timeStr,
              leadNotes: feedbackNote || 'Disetujui penuh oleh Team Lead Rizco Renova.',
            }
          : p
      )
    );
    dispatchSDLCEvent({
      type: 'proposal_approved',
      proposalId,
      proposalTitle: targetProp?.title,
      authorId: targetProp?.authorId,
      authorName: targetProp?.authorName,
      targetBacklogId: targetProp?.targetBacklogId,
      targetBacklogTitle: targetProp?.targetBacklogTitle,
      notes: feedbackNote || 'Disetujui penuh oleh Team Lead Rizco Renova.',
      timestamp: timeStr,
    });
    setFeedbackNote('');
  };

  const handleRequestRevision = (proposalId: string) => {
    if (!feedbackNote.trim()) {
      alert('Mohon cantumkan arahan revisi untuk tim pembuat proposal.');
      return;
    }
    const targetProp = proposals.find((p) => p.id === proposalId);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'revision_requested',
              reviewedAt: timeStr,
              leadNotes: feedbackNote,
            }
          : p
      )
    );
    dispatchSDLCEvent({
      type: 'proposal_revision_requested',
      proposalId,
      proposalTitle: targetProp?.title,
      authorId: targetProp?.authorId,
      authorName: targetProp?.authorName,
      targetBacklogId: targetProp?.targetBacklogId,
      targetBacklogTitle: targetProp?.targetBacklogTitle,
      notes: feedbackNote,
      timestamp: timeStr,
    });
    setFeedbackNote('');
  };

  const handleReject = (proposalId: string) => {
    if (!feedbackNote.trim()) {
      alert('Mohon cantumkan alasan penolakan proposal.');
      return;
    }
    const targetProp = proposals.find((p) => p.id === proposalId);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'rejected',
              reviewedAt: timeStr,
              leadNotes: feedbackNote,
            }
          : p
      )
    );
    dispatchSDLCEvent({
      type: 'proposal_rejected',
      proposalId,
      proposalTitle: targetProp?.title,
      authorId: targetProp?.authorId,
      authorName: targetProp?.authorName,
      targetBacklogId: targetProp?.targetBacklogId,
      targetBacklogTitle: targetProp?.targetBacklogTitle,
      notes: feedbackNote,
      timestamp: timeStr,
    });
    setFeedbackNote('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMarkdown.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const id = `PRP-210${proposals.length + 1}`;

    const newProp: DocumentProposal = {
      id,
      title: newTitle,
      summary: newSummary || newTitle,
      fullDocMarkdown: newMarkdown,
      authorId: 12,
      authorName: 'Tara Wulandari',
      authorRole: 'Documentarian & Confluence Lead',
      authorDivision: 'executive',
      targetBacklogId: newBacklogId,
      targetBacklogTitle: newBacklogTitle,
      status: 'pending_approval',
      submittedAt: timeStr,
    };

    setProposals((prev) => [newProp, ...prev]);
    setSelectedProposalId(id);
    dispatchSDLCEvent({
      type: 'proposal_created',
      proposalId: id,
      proposalTitle: newTitle,
      authorId: 12,
      authorName: 'Tara Wulandari',
      targetBacklogId: newBacklogId,
      targetBacklogTitle: newBacklogTitle,
      timestamp: timeStr,
    });
    setNewTitle('');
    setNewSummary('');
    setNewMarkdown('');
    setActiveTab('proposals');
  };

  const handleAuthorizeRelease = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setReleaseAuthorized(true);
    localStorage.setItem('lokatalenta-release-authorized', 'true');
    dispatchSDLCEvent({
      type: 'release_authorized',
      version: releaseVersion,
      notes: releaseNotes,
      timestamp: timeStr,
    });
  };

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            DISETUJUI (APPROVED)
          </span>
        );
      case 'revision_requested':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            BUTUH REVISI
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            DITOLAK
          </span>
        );
      case 'pending_approval':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-400 dark:border-amber-700 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            MENUNGGU OTORISASI RIZCO
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F4F4F1] dark:bg-[#0D1117]">
      {/* Top Header */}
      <header className="h-14 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 select-none z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
            LT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-[#18181B] dark:text-white tracking-tight">
                LokaTalenta Document &amp; Release Authorization Portal
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/40">
                EXECUTIVE GATEKEEPER
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                SPR-22: 100% DONE
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-[#71717A] dark:text-slate-400 leading-tight">
              Otoritas Eksklusif Team Lead Rizco Renova (#0) • Protokol Agile SDLC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ecosystem Quick Links */}
          <a
            href="https://lokatalenta-agent-chat.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] text-xs font-semibold text-[#18181B] dark:text-white hover:border-[#0F766E] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#0F766E]" />
            <span className="hidden md:inline">Group Chat</span>
          </a>

          <a
            href="https://lokatalenta-office-3d.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] text-xs font-semibold text-[#18181B] dark:text-white hover:border-[#0F766E] transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-[#0F766E]" />
            <span className="hidden md:inline">Kantor 3D</span>
          </a>

          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Theme"
            className="p-1.5 rounded border border-[#D4D4CE] dark:border-[#282E3D] text-[#52525B] dark:text-slate-300 hover:bg-[#F4F4F1] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Navigation Sub-Header */}
      <div className="px-6 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 sm:gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('proposals')}
            className={`py-3 px-3 border-b-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'proposals'
                ? 'border-[#0F766E] text-[#0F766E] dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Otorisasi Proposal SDLC ({proposals.length})</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500 text-white font-bold animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('new_proposal')}
            className={`py-3 px-3 border-b-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new_proposal'
                ? 'border-[#0F766E] text-[#0F766E] dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Authoring Studio (Ajukan RFC)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('release_gate')}
            className={`py-3 px-3 border-b-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'release_gate'
                ? 'border-amber-500 text-amber-700 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Release Deployment Arbiter Gate</span>
            {releaseAuthorized ? (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-100 text-emerald-800">
                UNLOCKED
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-100 text-rose-800">
                LOCKED
              </span>
            )}
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-mono">Sprint 21:</span>
          <span className="font-bold text-[#0F766E] font-mono">149 SP Committed</span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-emerald-600 font-mono">186/186 Tests PASS</span>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'proposals' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Gatekeeper Alert Banner */}
          <div className="px-6 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Gatekeeper Protocol:</strong> {pendingCount} proposal menunggu persetujuan Anda. Kegiatan teknis:{' '}
                {pendingCount > 0 ? (
                  <span className="text-amber-700 dark:text-amber-300 font-bold underline">
                    DIBEKUKAN SAMPAI PROPOSAL DI-APPROVE
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    SELURUH WORK ITEMS RESMI DIIZINKAN BERJALAN
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-amber-700 dark:text-amber-300">Pending: {pendingCount}</span>
              <span className="text-emerald-700 dark:text-emerald-400">Approved: {approvedCount}</span>
              {revisionCount > 0 && <span className="text-purple-700 dark:text-purple-300">Revisi: {revisionCount}</span>}
            </div>
          </div>

          {/* 2-Column Proposal Workspace */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Proposals List */}
            <div className="w-80 sm:w-96 border-r border-[#D4D4CE] dark:border-[#282E3D] bg-slate-50/50 dark:bg-[#11141B]/40 flex flex-col overflow-y-auto shrink-0">
              <div className="p-3 border-b border-[#D4D4CE] dark:border-[#282E3D] text-[11px] font-bold text-[#71717A] dark:text-slate-400 uppercase tracking-wider">
                Daftar Proposal Dokumen SDLC ({proposals.length})
              </div>
              <div className="divide-y divide-[#E5E5E0] dark:divide-[#282E3D]/60">
                {proposals.map((prop) => {
                  const isSelected = prop.id === currentProposal?.id;
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => {
                        setSelectedProposalId(prop.id);
                        setFeedbackNote(prop.leadNotes || '');
                      }}
                      className={`w-full text-left p-3.5 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-teal-50 dark:bg-teal-950/40 border-l-4 border-l-[#0F766E]'
                          : 'hover:bg-slate-100 dark:hover:bg-[#161B22]/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-mono font-bold text-[#0F766E] dark:text-teal-400">
                          {prop.id}
                        </span>
                        <span className="text-[10px] text-[#71717A] dark:text-slate-500 font-mono">
                          {prop.submittedAt}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#18181B] dark:text-slate-200 line-clamp-1">
                        {prop.title}
                      </div>
                      <div className="text-[11px] text-[#71717A] dark:text-slate-400 line-clamp-2">
                        {prop.summary}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                          Author: {prop.authorName.split(' ')[0]} ({prop.authorDivision})
                        </span>
                        <div>{getStatusBadge(prop.status)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Proposal Document Detail */}
            {currentProposal ? (
              <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#161B22]">
                <div className="p-4 border-b border-[#D4D4CE] dark:border-[#282E3D] bg-[#FAFAF8] dark:bg-[#141820] flex items-start justify-between gap-4 shrink-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-[#0F766E] dark:text-teal-300 border border-[#0F766E]/30">
                        {currentProposal.id}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        Target Backlog: {currentProposal.targetBacklogId}
                      </span>
                      {getStatusBadge(currentProposal.status)}
                    </div>
                    <h2 className="text-base font-bold text-[#18181B] dark:text-white">
                      {currentProposal.title}
                    </h2>
                    <p className="text-xs text-[#71717A] dark:text-slate-400 mt-0.5">
                      Diajukan oleh: <strong className="text-slate-800 dark:text-slate-200">{currentProposal.authorName}</strong> ({currentProposal.authorRole}) • Divisi: {currentProposal.authorDivision.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-[#18181B] dark:text-slate-200">
                  <div className="p-3.5 rounded-lg bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-slate-400 mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
                      Ringkasan Eksekutif Proposal
                    </h3>
                    <p className="text-xs text-[#18181B] dark:text-slate-200 leading-relaxed">
                      {currentProposal.summary}
                    </p>
                  </div>

                  <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap font-mono bg-slate-50 dark:bg-[#11141B]/70 p-4 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D]">
                    {currentProposal.fullDocMarkdown}
                  </div>

                  {currentProposal.leadNotes && (
                    <div className="p-3.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs">
                      <div className="font-bold text-[#0F766E] dark:text-teal-300 mb-1">
                        Catatan Keputusan Team Lead (Rizco Renova):
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 italic">
                        "{currentProposal.leadNotes}"
                      </p>
                      {currentProposal.reviewedAt && (
                        <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                          Ditinjau pada pukul {currentProposal.reviewedAt}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Lead Decision Bar */}
                <div className="p-4 border-t border-[#D4D4CE] dark:border-[#282E3D] bg-[#F4F4F1] dark:bg-[#11141B] flex flex-col gap-3 shrink-0">
                  <input
                    type="text"
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder="Tulis arahan / catatan keputusan Anda untuk author proposal ini..."
                    className="w-full px-3 py-1.5 bg-white dark:bg-[#161B22] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-[#18181B] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E]"
                  />

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-[11px] text-[#71717A] dark:text-slate-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>
                        Keputusan Team Lead akan membuka/membekukan status tiket backlog terkait.
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReject(currentProposal.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded border border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 cursor-pointer"
                      >
                        Tolak Proposal
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRequestRevision(currentProposal.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded border border-amber-300 dark:border-amber-900/80 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 cursor-pointer"
                      >
                        Minta Revisi
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprove(currentProposal.id)}
                        className="px-4 py-1.5 text-xs font-bold rounded bg-[#0F766E] text-white hover:bg-[#0D655E] border border-teal-600 shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-98"
                      >
                        <CheckCircle2 className="w-4 h-4 text-teal-200" />
                        <span>Setujui &amp; Otorisasi Task ({currentProposal.targetBacklogId})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                Pilih proposal dari daftar sebelah kiri.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: New Proposal Studio */}
      {activeTab === 'new_proposal' && (
        <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-[#161B22] max-w-4xl mx-auto w-full">
          <div className="p-4 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-[#0F766E]/30 space-y-1">
            <h2 className="text-sm font-bold text-[#0F766E] dark:text-teal-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Authoring Studio: Pengajuan Proposal Dokumen SDLC
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Setiap perubahan teknis, arsitektur, dan token desain wajib memiliki dokumen proposal yang ditinjau dan disetujui langsung oleh Team Lead (Rizco Renova).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Judul Proposal Dokumen
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Course Syllabus Drawer Fluid Gesture RFC"
                className="w-full px-3 py-2 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Backlog ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newBacklogId}
                  onChange={(e) => setNewBacklogId(e.target.value)}
                  placeholder="BL-220"
                  className="w-28 px-3 py-2 font-mono font-bold bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-teal-600 dark:text-teal-400"
                />
                <input
                  type="text"
                  required
                  value={newBacklogTitle}
                  onChange={(e) => setNewBacklogTitle(e.target.value)}
                  placeholder="Judul item backlog"
                  className="flex-1 px-3 py-2 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ringkasan Eksekutif (Summary)
            </label>
            <input
              type="text"
              required
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="Deskripsi singkat urgensi dan dampak terhadap arsitektur LMS..."
              className="w-full px-3 py-2 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Dokumen Spesifikasi Lengkap (Markdown RFC)
            </label>
            <textarea
              rows={12}
              required
              value={newMarkdown}
              onChange={(e) => setNewMarkdown(e.target.value)}
              placeholder="# Judul RFC&#10;&#10;## 1. Latar Belakang&#10;...&#10;&#10;## 2. Spesifikasi Teknis&#10;..."
              className="w-full font-mono text-xs px-3 py-2 bg-[#F4F4F1] dark:bg-[#11141B] border border-[#D4D4CE] dark:border-[#282E3D] rounded text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4D4CE] dark:border-[#282E3D]">
            <button
              type="button"
              onClick={() => setActiveTab('proposals')}
              className="px-4 py-2 text-xs font-semibold rounded border border-[#D4D4CE] text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded bg-[#0F766E] text-white hover:bg-[#0D655E] flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Kirim Proposal ke Otorisasi Lead</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Release Deployment Arbiter Gate */}
      {activeTab === 'release_gate' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white dark:bg-[#161B22] max-w-4xl mx-auto w-full">
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Strict Deployment Blocker: Wewenang Mutlak Team Lead Rizco Renova (#0)
              </h2>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Setiap deployment rilis produksi (Vercel Production &amp; Git Release Tag) <strong>SECARA KETAT DIBEKUKAN</strong> sampai seluruh dokumen proposal di-approve dan tanda tangan otorisasi rilis diberikan langsung oleh Mas Rizco.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D] space-y-3 bg-[#F4F4F1]/60 dark:bg-[#11141B]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Pemeriksaan Kesiapan Rilis (Pre-Flight Checklist)
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>Proposal Dokumen Pending:</span>
                  <span className={`font-mono font-bold ${pendingCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {pendingCount} dokumen
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>LMS Automated Tests:</span>
                  <span className="font-mono font-bold text-emerald-600">186/186 PASS (100%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chat Hub Tests:</span>
                  <span className="font-mono font-bold text-emerald-600">15/15 PASS (100%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Visual QA &amp; WCAG Contrast:</span>
                  <span className="font-mono font-bold text-emerald-600">17.04:1 (AAA) 0 DEFECT</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D] space-y-3 bg-[#F4F4F1]/60 dark:bg-[#11141B]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Informasi Versi &amp; Target Deployment
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[11px] font-mono text-slate-500 block">Target Versi Rilis</label>
                  <input
                    type="text"
                    value={releaseVersion}
                    onChange={(e) => setReleaseVersion(e.target.value)}
                    className="w-full px-2 py-1 font-mono font-bold text-xs bg-white dark:bg-[#161B22] border border-[#D4D4CE] rounded"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-500 block">Catatan Rilis Ringkas</label>
                  <input
                    type="text"
                    value={releaseNotes}
                    onChange={(e) => setReleaseNotes(e.target.value)}
                    className="w-full px-2 py-1 text-xs bg-white dark:bg-[#161B22] border border-[#D4D4CE] rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Release Action Card */}
          <div className="p-5 rounded-lg border border-[#D4D4CE] dark:border-[#282E3D] bg-white dark:bg-[#161B22] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0F766E]" />
                  Otorisasi &amp; Eksekusi Rilis Produksi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mengeklik tombol ini akan membubuhkan digital signature Team Lead dan membuka kunci deployment rilis.
                </p>
              </div>

              {releaseAuthorized ? (
                <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                  ✅ RILIS RESMI DIIZINKAN OLEH RIZCO
                </span>
              ) : (
                <span className="px-3 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold font-mono">
                  ⚠️ MENUNGGU DIGITAL SIGNATURE LEAD
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E5E0] dark:border-[#282E3D]">
              <button
                type="button"
                onClick={handleAuthorizeRelease}
                disabled={releaseAuthorized}
                className="px-6 py-2.5 rounded bg-linear-to-r from-[#0F766E] to-[#042F2E] text-white hover:from-[#0D655E] hover:to-[#022120] font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Rocket className="w-4 h-4 text-amber-300" />
                <span>{releaseAuthorized ? 'Otorisasi Rilis Aktif' : `Beri Otorisasi & Buka Kunci Deployment (${releaseVersion})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
