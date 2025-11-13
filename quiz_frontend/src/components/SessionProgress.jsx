/**
 * Footer progress indicator for the session.
 */
import React from 'react';
import { useQuizStore } from '../state/store';

// PUBLIC_INTERFACE
export function SessionProgress() {
  /** Renders a simple progress bar for question progression. */
  const { state } = useQuizStore();
  const total = state.session.totalQuestions || 0;
  const idx = state.session.currentIndex || 0;
  const pct = total > 0 ? Math.min(100, Math.round(((idx) / total) * 100)) : 0;

  return (
    <div className="progress-container" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="row" style={{ alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700 }}>Session Status</div>
          <div className="label"> {state.session.status || 'idle'}</div>
        </div>
        <div>
          <div className="label" style={{ textAlign: 'right' }}>
            {total ? `Question ${Math.min(idx + 1, total)} of ${total}` : 'No questions yet'}
          </div>
          <div
            style={{
              width: '100%',
              height: 10,
              background: 'rgba(55,65,81,0.1)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                transition: 'width .3s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
