/**
 * Placeholder service layer for Quiz operations.
 * Uses config.apiBase/wsUrl and env vars. All functions return mocked promises to allow UI scaffolding.
 */
import { config } from './config';

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
  /** Start a quiz session (placeholder). */
  await delay(250);
  return { sessionId, status: 'running' };
}

// PUBLIC_INTERFACE
export async function stopSession(sessionId) {
  /** Stop/End a quiz session (placeholder). */
  await delay(250);
  return { sessionId, status: 'stopped' };
}

// PUBLIC_INTERFACE
export async function pushQuestion(sessionId, question) {
  /** Push a question to participants (placeholder). */
  await delay(200);
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
  /** Submit answer (placeholder). */
  await delay(300);
  const correct = Math.random() > 0.5;
  return {
    correct,
    scoreDelta: correct ? 10 : 0,
  };
}

// PUBLIC_INTERFACE
export function getWsUrl() {
  /** Get the WebSocket URL configured for live updates (placeholder). */
  return config.wsUrl || '';
}
