/// <reference types="vite/client" />
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { Logger } from '../lib/logger';
import { api } from '../lib/api';
import { setAdminSession } from '../lib/session';
import { cn } from '../lib/utils';

const Login = () => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 60000;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setError('Account temporarily locked. Please try again later.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.login(passkey.trim());
      if (res.status === 200 && res.data?.token) {
        setAdminSession(res.data.token);
        Logger.access('Admin login successful');
        setAttempts(0);
        navigate('/admin/dashboard');
        return;
      }

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setError(`Too many failed attempts. Locked for ${LOCKOUT_TIME / 1000} seconds.`);
        Logger.warn('Account locked due to excessive failed attempts');
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
          setError('');
        }, LOCKOUT_TIME);
      } else {
        Logger.warn('Failed login attempt', { timestamp: new Date(), attempts: newAttempts });
        setError(res.error?.message || `Invalid password. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-sm py-section">
      <div className="surface-glass w-full max-w-md rounded-2xl p-lg shadow-3 border border-border/70">
        <div className="text-center mb-lg">
          <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-md shadow-2">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="eyebrow text-accent mb-xs">Restricted</p>
          <h1 className="headline font-display font-bold text-primary">Admin Access</h1>
          <p className="text-ink-muted mt-xs">Sign in with your server password</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-md">
          <div>
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className={cn(
                'w-full px-4 py-3 rounded-lg border border-border bg-surface text-ink',
                'focus:ring-2 focus:ring-accent/60 outline-none transition-colors duration-fast'
              )}
              placeholder="Enter password"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="flex items-center text-destructive text-sm" role="alert">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || isLocked}
            className="w-full bg-accent text-accent-foreground font-bold py-3 rounded-pill press-lift shadow-2 hover:shadow-glow disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
