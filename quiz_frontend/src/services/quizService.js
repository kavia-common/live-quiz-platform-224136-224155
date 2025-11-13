/**
 * Placeholder service layer for Quiz operations with Supabase realtime integration.
 * Uses config.apiBase/wsUrl and env vars. All functions return mocked promises to allow UI scaffolding.
 */
import { config } from './config';
import {
  subscribeToQuiz,
  broadcastQuizEvent,
  isRealtimeEnabled,
} from './supabaseClient';

/**
 * Simulate network delay for placeholder services.
 */
const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

/**
 * Generate a random code for sessions when backend is not wired.
 */
const genCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();

/**
 * In a real implementation, these would call `${config.apiBase}/...`
 */

// PUBLIC_INTERFACE
export async function createSession({ title }) {
  /** Create a new quiz session (placeholder). */
  await delay();
  return {
    id: Date.now().toString(),
    title: title || 'Live Quiz',
    code: genCode(),
    status: 'idle',
    currentIndex: 0,
    totalQuestions: 5,
  };
}

// PUBLIC_INTERFACE
export async function startSession(sessionId) {
  /** Start a quiz session (placeholder) and broadcast status. */
  await delay(250);
  // Fire realtime event (best effort)
  broadcastQuizEvent(sessionId, 'SESSION_STATUS', { sessionId, status: 'running' }).catch(() => {});
  return { sessionId, status: 'running' };
}

// PUBLIC_INTERFACE
export async function stopSession(sessionId) {
  /** Stop/End a quiz session (placeholder) and broadcast status. */
  await delay(250);
  broadcastQuizEvent(sessionId, 'SESSION_STATUS', { sessionId, status: 'stopped' }).catch(() => {});
  return { sessionId, status: 'stopped' };
}

// PUBLIC_INTERFACE
export async function pushQuestion(sessionId, question) {
  /** Push a question to participants (placeholder) and broadcast update. */
  await delay(200);
  broadcastQuizEvent(sessionId, 'QUESTION_UPDATED', { sessionId, question }).catch(() => {});
  return { sessionId, question };
}

// PUBLIC_INTERFACE
export async function joinSession({ code, name }) {
  /** Join a session via code (placeholder). */
  await delay(250);
  return {
    participantId: Date.now().toString(),
    name,
    code,
  };
}

// PUBLIC_INTERFACE
export async function submitAnswer({ sessionId, participantId, answer }) {
  /** Submit answer (placeholder) and broadcast answer submitted. */
  await delay(300);
  const correct = Math.random() > 0.5;
  const res = {
    correct,
    scoreDelta: correct ? 10 : 0,
  };
  // Broadcast answer submit (anonymized for demo)
  broadcastQuizEvent(sessionId, 'ANSWER_SUBMITTED', {
    sessionId,
    participantId,
    answerIndex: Number(answer),
  }).catch(() => {});
  return res;
}

// PUBLIC_INTERFACE
export function getWsUrl() {
  /** Get the WebSocket URL configured for live updates (placeholder). */
  return config.wsUrl || '';
}

/**
 * Subscribe helpers
 */

// PUBLIC_INTERFACE
export function subscribeToQuestion(sessionId, onQuestion) {
  /** Subscribe to QUESTION_UPDATED for a session. Returns unsubscribe fn. */
  return subscribeToQuiz(sessionId, {
    onQuestionUpdated: (payload) => {
      const data = payload?.payload ?? payload;
      onQuestion && onQuestion(data?.question || data);
    },
  });
}

// PUBLIC_INTERFACE
export function subscribeToLeaderboard(sessionId, onLeaderboard) {
  /** Subscribe to LEADERBOARD_UPDATED for a session. Returns unsubscribe fn. */
  return subscribeToQuiz(sessionId, {
    onLeaderboardUpdated: (payload) => {
      const data = payload?.payload ?? payload;
      onLeaderboard && onLeaderboard(data?.leaderboard || data);
    },
  });
}

// PUBLIC_INTERFACE
export function publishLeaderboard(sessionId, leaderboard) {
  /** Publish leaderboard updates. */
  return broadcastQuizEvent(sessionId, 'LEADERBOARD_UPDATED', { sessionId, leaderboard });
}

// PUBLIC_INTERFACE
export function subscribeToSessionStatus(sessionId, onStatus) {
  /** Subscribe to SESSION_STATUS updates. Returns unsubscribe fn. */
  return subscribeToQuiz(sessionId, {
    onSessionStatus: (payload) => {
      const data = payload?.payload ?? payload;
      onStatus && onStatus(data?.status ? data : { status: data });
    },
  });
}

// PUBLIC_INTERFACE
export function realtimeEnabled() {
  /** Whether realtime is enabled. */
  return isRealtimeEnabled();
}
