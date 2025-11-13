import { createClient } from '@supabase/supabase-js';
import { config, validateEnv } from './config';

/**
 * Supabase client and realtime helpers for quiz events.
 * Reads URL/KEY from REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.
 * Provides safe fallbacks if env vars are missing (no-ops with console warnings).
 */

// Validate at module load but do not block UI
const missing = validateEnv(['REACT_APP_SUPABASE_URL', 'REACT_APP_SUPABASE_KEY']);

// Create client only if env vars are present
const hasSupabase = !!(config?.supabase?.url && config?.supabase?.key);

let supabase = null;
if (hasSupabase) {
  try {
    supabase = createClient(config.supabase.url, config.supabase.key, {
      realtime: { params: { eventsPerSecond: 5 } },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to initialize Supabase client. Falling back to no-op realtime.', err);
    supabase = null;
  }
} else {
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn('Supabase env vars missing. Realtime disabled. Missing:', missing.join(', '));
  }
}

/**
 * Build a consistent channel name for a quiz session.
 */
function channelName(sessionId) {
  return `quiz:${sessionId}`;
}

/**
 * Subscribe to quiz events for a session. Returns an unsubscribe function.
 *
 * @param {string} sessionId - The quiz session ID.
 * @param {Object} handlers - Event handlers for various events.
 * @param {function} handlers.onQuestionUpdated - Called with payload when question is updated.
 * @param {function} handlers.onAnswerSubmitted - Called with payload when an answer is submitted.
 * @param {function} handlers.onLeaderboardUpdated - Called with payload when leaderboard updates.
 * @param {function} handlers.onSessionStatus - Called with payload when session status changes.
 * @returns {function} unsubscribe - Cleanly remove listeners and channel.
 */
// PUBLIC_INTERFACE
export function subscribeToQuiz(sessionId, handlers = {}) {
  /** Subscribe to realtime quiz events for a given session. */
  if (!sessionId) {
    // eslint-disable-next-line no-console
    console.warn('subscribeToQuiz called without sessionId');
    return () => {};
  }
  if (!supabase) {
    // Fallback: no-op unsubscribe
    return () => {};
  }

  const chan = supabase.channel(channelName(sessionId), {
    config: { broadcast: { ack: true } },
  });

  // Register broadcast listeners
  chan
    .on('broadcast', { event: 'QUESTION_UPDATED' }, (payload) => {
      handlers.onQuestionUpdated && handlers.onQuestionUpdated(payload?.payload ?? payload);
    })
    .on('broadcast', { event: 'ANSWER_SUBMITTED' }, (payload) => {
      handlers.onAnswerSubmitted && handlers.onAnswerSubmitted(payload?.payload ?? payload);
    })
    .on('broadcast', { event: 'LEADERBOARD_UPDATED' }, (payload) => {
      handlers.onLeaderboardUpdated && handlers.onLeaderboardUpdated(payload?.payload ?? payload);
    })
    .on('broadcast', { event: 'SESSION_STATUS' }, (payload) => {
      handlers.onSessionStatus && handlers.onSessionStatus(payload?.payload ?? payload);
    })
    .subscribe((status) => {
      // eslint-disable-next-line no-console
      if (status === 'SUBSCRIBED') {
        // Subscription ready
      }
    });

  // Return unsubscribe function
  return () => {
    try {
      supabase?.removeChannel(chan);
    } catch (e) {
      // ignore
    }
  };
}

/**
 * Broadcast a quiz event for a session. No-op if no Supabase.
 *
 * @param {string} sessionId - The quiz session ID.
 * @param {string} event - One of QUESTION_UPDATED, ANSWER_SUBMITTED, LEADERBOARD_UPDATED, SESSION_STATUS.
 * @param {any} payload - The payload to broadcast.
 * @returns {Promise<void>}
 */
// PUBLIC_INTERFACE
export async function broadcastQuizEvent(sessionId, event, payload) {
  /** Broadcast a realtime quiz event to session channel. */
  if (!sessionId || !event) return;
  if (!supabase) return;

  const chan = supabase.channel(channelName(sessionId), {
    config: { broadcast: { ack: true } },
  });

  try {
    // Ensure subscribed before sending (idempotent)
    await chan.subscribe();
    await chan.send({
      type: 'broadcast',
      event,
      payload,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to broadcast event', event, e);
  } finally {
    try {
      supabase.removeChannel(chan);
    } catch (_) {
      // ignore
    }
  }
}

/**
 * Simple helper for UI to know if realtime is enabled.
 */
// PUBLIC_INTERFACE
export function isRealtimeEnabled() {
  /** Whether Supabase realtime is enabled via env. */
  return !!supabase;
}

/**
 * UI notice component for missing env; non-blocking.
 */
// PUBLIC_INTERFACE
export function RealtimeNotice({ className = '' }) {
  /** Renders a small inline notice when realtime is disabled. */
  if (isRealtimeEnabled()) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={className}
      style={{
        marginTop: 8,
        fontSize: 12,
        color: '#6B7280',
      }}
    >
      Realtime disabled (missing REACT_APP_SUPABASE_URL/KEY)
    </div>
  );
}
