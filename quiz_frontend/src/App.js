import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import './index.css';
import Landing from './pages/Landing';
import HostDashboard from './pages/HostDashboard';
import Participant from './pages/Participant';
import { LeaderboardSidebar } from './components/LeaderboardSidebar';
import { SessionProgress } from './components/SessionProgress';
import { useQuizStore, QuizProvider } from './state/store';
import { RealtimeNotice } from './services/supabaseClient';

/**
 * AppShell renders the global layout containing header, main content with optional sidebar,
 * and footer with session progress. It also hosts the theme toggle and navigation links.
 */
function AppShell() {
  const { state } = useQuizStore();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const currentRoute = window.location.pathname.startsWith('/host')
    ? 'host'
    : window.location.pathname.startsWith('/join')
    ? 'participant'
    : 'landing';

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <Link to="/" className="brand-link" aria-label="Go to Landing">
            <span className="brand-icon">🌊</span>
            <span className="brand-text">Ocean Quiz</span>
          </Link>
        </div>
        <div className="session-info">
          <div className="session-title">{state.session.title || 'Live Quiz'}</div>
          {state.session.code && (
            <div className="session-code" aria-label="Session Code">
              Code: <strong>{state.session.code}</strong>
            </div>
          )}
        </div>
        <div className="header-actions">
          <nav className="nav">
            <Link className={`nav-link ${currentRoute==='landing'?'active':''}`} to="/">Home</Link>
            <Link className={`nav-link ${currentRoute==='host'?'active':''}`} to="/host">Host</Link>
            <Link className={`nav-link ${currentRoute==='participant'?'active':''}`} to="/join">Join</Link>
          </nav>
          <button
            className="theme-toggle"
            onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <div className="content">
        <main className="main">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/join" element={<Participant />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <aside className="sidebar" aria-label="Live Leaderboard">
          <LeaderboardSidebar />
        </aside>
      </div>

      <footer className="footer" aria-label="Session Progress">
        <SessionProgress />
        <RealtimeNotice />
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root App wrapped with QuizProvider and BrowserRouter */
  return (
    <QuizProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </QuizProvider>
  );
}

export default App;
