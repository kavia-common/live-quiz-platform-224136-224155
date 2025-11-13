# Supabase Realtime Integration (Frontend)

This frontend uses Supabase Realtime channels to broadcast and listen to quiz session events.

## Environment Variables

Set these in `.env` (never hardcode secrets in code):

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Optional:
- REACT_APP_API_BASE
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL

See `.env.example` for a template.

## Client Initialization

- The client is created in `src/services/supabaseClient.js` using the env variables.
- If env vars are missing, Realtime is disabled gracefully and a small UI notice is shown.

## Channels and Events

- Channel name: `quiz:<sessionId>`
- Broadcast events:
  - QUESTION_UPDATED
  - ANSWER_SUBMITTED
  - LEADERBOARD_UPDATED
  - SESSION_STATUS

## Usage

Publishing:
- Use `broadcastQuizEvent(sessionId, event, payload)` (wrapped by `quizService` helpers like `publishLeaderboard`).

Subscribing:
- Use `subscribeToQuiz(sessionId, handlers)` or specific helpers:
  - `subscribeToQuestion(sessionId, onQuestion)`
  - `subscribeToLeaderboard(sessionId, onLeaderboard)`
  - `subscribeToSessionStatus(sessionId, onStatus)`

Always store the unsubscribe function and call it on component unmount to avoid leaks.

## UI Wiring

- HostDashboard: Create/start/stop session, push questions; publishes status and question updates. Also publishes leaderboard snapshots.
- Participant: Subscribes to questions and submits answers; client broadcasts answer submissions.
- LeaderboardSidebar: Subscribes to leaderboard updates.

## Notes

- This is a frontend-only demo wiring. Backend persistence is not required for the realtime demo to work, but the sessionId must be consistent across host and participants.
- In the placeholder flow, the Landing page sets `session.id` to the `code` after join to ensure a common channel.
