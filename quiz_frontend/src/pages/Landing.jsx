/**
 * Landing page: Join Quiz by code and name, and quick links.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { joinSession } from '../services/quizService';
import { useQuizStore } from '../state/store';

// PUBLIC_INTERFACE
export default function Landing() {
  /** Landing view for joining a quiz session. */
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { actions } = useQuizStore();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code || !name) return;
    setLoading(true);
    try {
      const res = await joinSession({ code: code.trim().toUpperCase(), name: name.trim() });
      actions.setParticipant({ id: res.participantId, name: res.name, joinedCode: res.code });
      // For placeholder flows, treat the code as session id to scope realtime channel
      actions.setSession({ id: res.code, code: res.code, title: 'Live Quiz', totalQuestions: 5 });
      navigate('/join');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="section-title">Join a Quiz</div>
      <form onSubmit={handleJoin}>
        <div className="row">
          <div>
            <label className="label" htmlFor="code">Session Code</label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input"
              placeholder="Enter code (e.g., 9ABCD)"
              maxLength={8}
              autoCapitalize="characters"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="name">Your Name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Display name"
              required
            />
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? 'Joining…' : 'Join Quiz'}
          </button>
          <Link className="button secondary" to="/host">Host Dashboard</Link>
        </div>
      </form>
    </div>
  );
}
