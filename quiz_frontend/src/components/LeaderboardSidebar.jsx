/**
 * Live Leaderboard Sidebar
 */
import React from 'react';
import { useQuizStore } from '../state/store';

// PUBLIC_INTERFACE
export function LeaderboardSidebar() {
  /** Renders the live leaderboard based on store state. */
  const { state } = useQuizStore();
  const top = [...state.leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div>
      <div className="section-title">Leaderboard</div>
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
