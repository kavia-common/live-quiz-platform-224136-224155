/**
 * Live Leaderboard Sidebar
 */
import React, { useEffect } from 'react';
import { useQuizStore } from '../state/store';
import { subscribeToLeaderboard, realtimeEnabled } from '../services/quizService';
import { RealtimeNotice } from '../services/supabaseClient';

// PUBLIC_INTERFACE
export function LeaderboardSidebar() {
  /** Renders the live leaderboard based on store state. */
  const { state, actions } = useQuizStore();

  useEffect(() => {
    if (!state.session.id) return;
    const unsubscribe = subscribeToLeaderboard(state.session.id, (leaderboard) => {
      if (Array.isArray(leaderboard)) {
        actions.setLeaderboard(leaderboard);
      }
    });
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [state.session.id, actions]);

  const top = [...state.leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div>
      <div className="section-title">Leaderboard</div>
      {!realtimeEnabled() && <RealtimeNotice />}
      {!top.length ? (
        <div className="empty">No scores yet. Participate to climb the board!</div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {top.map((p, idx) => (
            <li
              key={`${p.name}-${idx}`}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}
            >
              <div
                className="badge"
                aria-label={`Rank ${idx + 1}`}
                style={{ minWidth: 34, textAlign: 'center' }}
              >
                #{idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div className="label">Score</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 16 }}>{p.score}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
