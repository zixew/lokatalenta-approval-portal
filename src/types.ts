export type Division = 'executive' | 'architecture' | 'engineering' | 'qa' | 'devops' | 'lounge';

export type ProposalStatus = 'pending_approval' | 'approved' | 'revision_requested' | 'rejected';

export interface DocumentProposal {
  id: string; // e.g. PRP-2101
  title: string;
  summary: string;
  fullDocMarkdown: string;
  authorId: number;
  authorName: string;
  author?: string;
  approvedBy?: string;
  authorRole: string;
  authorDivision: Division;
  targetBacklogId: string;
  targetBacklogTitle: string;
  status: ProposalStatus;
  submittedAt: string;
  reviewedAt?: string;
  leadNotes?: string;
}

export interface ReleaseGateInfo {
  version: string;
  status: 'locked' | 'authorized' | 'deployed';
  authorizedAt?: string;
  leadNotes: string;
  targetCommit: string;
}

export interface ReleaseGateItem {
  id: string;
  title: string;
  status: string;
  metric: string;
}
