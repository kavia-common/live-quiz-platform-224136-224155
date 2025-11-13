/**
 * Participant View: shows current question and allows answer submission.
 */
import React, { useEffect, useState } from 'react';
import { submitAnswer, subscribeToQuestion, realtimeEnabled } from '../services/quizService';
import { RealtimeNotice } from '../services/supabaseClient';
import { useQuizStore } from '../state/store';

// PUBLIC_INTERFACE
export default function Participant() {
  /** Participant view with question display and answer input. */
  const { state, actions } = useQuizStore();
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Subscribe to question updates for joined session
    if (!state.session.id) return;
    const unsubscribe = subscribeToQuestion(state.session.id, (question) => {
      actions.pushQuestion(question);
      setSelected(null);
    });
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [state.session.id, actions]);

  const hasQuestion = !!state.session.currentQuestion;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (selected == null) return;
    setBusy(true);
    try {
      const res = await submitAnswer({
        sessionId: state.session.id,
        participantId: state.participant.id,
        answer: selected,
      });
      actions.setParticipant({
        lastSubmission: selected,
        lastFeedback: res.correct ? 'Correct!' : 'Incorrect',
      });

      // Adjust local leaderboard to simulate points
      const meName = state.participant.name || 'You';
      const updated = [...state.leaderboard];
      const meIdx = updated.findIndex((p) => p.name === meName);
      if (meIdx >= 0) {
        updated[meIdx] = { ...updated[meIdx], score: (updated[meIdx].score || 0) + (res.scoreDelta || 0) };
      } else {
        updated.push({ name: meName, score: res.scoreDelta || 0 });
      }
      actions.setLeaderboard(updated);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <div className="section-title">Participant</div>
      {!realtimeEnabled() && <RealtimeNotice />}
      {!state.participant.id ? (
        <div className="empty">You have not joined a session from the Landing page.</div>
      ) : !hasQuestion ? (
        <div className="empty">Waiting for host to push a question…</div>
      ) : (
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 10, fontWeight: 800, fontSize: 18 }}>
            {state.session.currentQuestion.text}
          </div>
          <div className="row">
            {state.session.currentQuestion.choices.map((c, i) => (
              <label key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="radio"
                  name="choice"
                  value={i}
                  checked={Number(selected) === i}
                  onChange={() => setSelected(i)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="button primary" type="submit" disabled={busy || selected == null}>
              {busy ? 'Submitting…' : 'Submit Answer'}
            </button>
          </div>
          {state.participant.lastFeedback && (
            <div style={{ marginTop: 12, fontWeight: 700, color: state.participant.lastFeedback === 'Correct!' ? 'var(--success)' : 'var(--error)' }}>
              {state.participant.lastFeedback}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
