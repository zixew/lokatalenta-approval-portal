export interface SDLCEventPayload {
  type:
    | 'proposal_approved'
    | 'proposal_revision_requested'
    | 'proposal_rejected'
    | 'proposal_created'
    | 'release_authorized';
  proposalId?: string;
  proposalTitle?: string;
  authorId?: number;
  authorName?: string;
  targetBacklogId?: string;
  targetBacklogTitle?: string;
  version?: string;
  notes?: string;
  timestamp: string;
}

const CHANNEL_NAME = 'lokatalenta-sdlc-events';

export function dispatchSDLCEvent(payload: SDLCEventPayload) {
  // 1. BroadcastChannel for modern cross-tab/cross-origin local messaging
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch {
    // Ignore BroadcastChannel errors in unsupported environments
  }

  // 2. Storage event bus fallback
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const wrapped = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...payload,
      };
      window.localStorage.setItem('lokatalenta-latest-sdlc-event', JSON.stringify(wrapped));
    }
  } catch {
    // Ignore localStorage errors
  }
}
