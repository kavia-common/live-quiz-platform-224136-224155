/**
 * Host Dashboard: manage session, push questions.
 */
import React, { useState } from 'react';
import { createSession, startSession, stopSession, pushQuestion } from '../services/quizService';
import { useQuizStore } from '../state/store';

// PUBLIC_INTERFACE
export default function HostDashboard() {
  /** Host view to control the quiz session. */
  const { state, actions } = useQuizStore();
  const [title, setTitle] = useState(state.session.title || 'Live Quiz');
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [answerIdx, setAnswerIdx] = useState(0);
  const [busy, setBusy] = useState(false);

  const onCreate = async () => {
    setBusy(true);
    try {
      const sess = await createSession({ title });
      actions.setSession(sess);
      actions.setLeaderboard([]);
    } finally {
      setBusy(false);
    }
  };

  const onStart = async () => {
    if (!state.session.id) return;
    setBusy(true);
    try {
      await startSession(state.session.id);
      actions.setSession({ status: 'running' });
    } finally {
      setBusy(false);
    }
  };

  const onStop = async () => {
    if (!state.session.id) return;
    setBusy(true);
    try {
      await stopSession(state.session.id);
      actions.setSession({ status: 'stopped' });
    } finally {
      setBusy(false);
    }
  };

  const onPushQuestion = async () => {
    if (!state.session.id) return;
    const q = {
      text: question,
      choices: choices.map((c) => c.trim()).filter(Boolean),
      answerIndex: Number(answerIdx) || 0,
    };
    if (!q.text || q.choices.length < 2) return;
    setBusy(true);
    try {
      await pushQuestion(state.session.id, q);
      actions.pushQuestion(q);
      actions.incrementIndex();
      // simulate minimal leaderboard change
      actions.setLeaderboard([
        { name: 'Ava', score: Math.floor(Math.random() * 40) + 10 },
        { name: 'Noah', score: Math.floor(Math.random() * 40) + 10 },
        { name: 'Liam', score: Math.floor(Math.random() * 40) + 10 },
      ]);
      setQuestion('');
      setChoices(['', '', '', '']);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <div className="section-title">Host Dashboard</div>
      <div className="row">
        <div className="card">
          <label className="label" htmlFor="title">Session Title</label>
          <input id="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className="button primary" onClick={onCreate} disabled={busy}>Create Session</button>
            <button className="button success" onClick={onStart} disabled={busy || !state.session.id}>Start</button>
            <button className="button error" onClick={onStop} disabled={busy || !state.session.id}>Stop</button>
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="label">Session Code</div>
            <div className="badge">{state.session.code || '—'}</div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Push Question</div>
          <label className="label" htmlFor="qtext">Question</label>
          <input
            id="qtext"
            className="input"
            placeholder="Type your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="row" style={{ marginTop: 8 }}>
            {choices.map((c, i) => (
              <div key={i}>
                <label className="label" htmlFor={`choice-${i}`}>Choice {i + 1}</label>
                <input
                  id={`choice-${i}`}
                  className="input"
                  placeholder={`Choice ${i + 1}`}
                  value={c}
                  onChange={(e) => {
                    const next = [...choices];
                    next[i] = e.target.value;
                    setChoices(next);
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <label className="label" htmlFor="answerIdx">Correct Answer Index</label>
            <select
              id="answerIdx"
              className="select"
              value={answerIdx}
              onChange={(e) => setAnswerIdx(e.target.value)}
            >
              {choices.map((_, i) => (
                <option key={i} value={i}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: 10 }}>
            <button className="button secondary" onClick={onPushQuestion} disabled={busy || !state.session.id}>
              Push Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
