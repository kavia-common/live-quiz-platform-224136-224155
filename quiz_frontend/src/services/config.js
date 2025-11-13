/**
 * Configuration helper that safely reads environment variables.
 * No secrets are hardcoded; values are injected at build/runtime via REACT_APP_*.
 */
export const config = {
  env: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development',
  apiBase: process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '',
  frontendUrl: process.env.REACT_APP_FRONTEND_URL || '',
  wsUrl: process.env.REACT_APP_WS_URL || '',
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || '',
    key: process.env.REACT_APP_SUPABASE_KEY || '',
  },
  flags: {
    experiments: (process.env.REACT_APP_EXPERIMENTS_ENABLED || 'false') === 'true',
    features: process.env.REACT_APP_FEATURE_FLAGS || '',
  }
};

/**
 * Utility to assert required vars without crashing the app.
 * Returns a list of missing keys for visibility in the console.
 */
// PUBLIC_INTERFACE
export function validateEnv(requiredKeys = []) {
  /** Validate required env vars and return missing ones. */
  const missing = requiredKeys.filter((k) => !process.env[k]);
  if (missing.length) {
    // Do not log secrets; only names of missing keys.
    // eslint-disable-next-line no-console
    console.warn('Missing environment variables:', missing.join(', '));
  }
  return missing;
}
