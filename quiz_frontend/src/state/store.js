/* Simple context-based state management for the quiz app */
import React, { createContext, useContext, useMemo, useReducer } from 'react';

const initialState = {
  session: {
    id: null,
    title: '',
    code: '',
    status: 'idle', // 'idle' | 'running' | 'stopped'
    currentIndex: 0,
    totalQuestions: 0,
    currentQuestion: null,
  },
  participant: {
    id: null,
    name: '',
    joinedCode: '',
    lastSubmission: null,
    lastFeedback: null,
  },
  leaderboard: [], // [{ name, score }]
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: { ...state.session, ...action.payload } };
    case 'SET_PARTICIPANT':
      return { ...state, participant: { ...state.participant, ...action.payload } };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload || [] };
    case 'PUSH_QUESTION':
      return {
        ...state,
        session: {
          ...state.session,
          currentQuestion: action.payload,
        },
      };
    case 'INCREMENT_INDEX':
      return {
        ...state,
        session: {
          ...state.session,
          currentIndex: state.session.currentIndex + 1,
        },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const QuizContext = createContext(null);

// PUBLIC_INTERFACE
export function QuizProvider({ children }) {
  /** Provide quiz state and dispatch helpers to the app. */
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      setSession: (payload) => dispatch({ type: 'SET_SESSION', payload }),
      setParticipant: (payload) => dispatch({ type: 'SET_PARTICIPANT', payload }),
      setLeaderboard: (payload) => dispatch({ type: 'SET_LEADERBOARD', payload }),
      pushQuestion: (payload) => dispatch({ type: 'PUSH_QUESTION', payload }),
      incrementIndex: () => dispatch({ type: 'INCREMENT_INDEX' }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// PUBLIC_INTERFACE
export function useQuizStore() {
  /** Hook to access quiz store. */
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error('useQuizStore must be used within a QuizProvider');
  }
  return ctx;
}
