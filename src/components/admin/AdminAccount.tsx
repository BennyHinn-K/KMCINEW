import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { KeyRound, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { setAdminSession } from '../../lib/session';
import { cn } from '../../lib/utils';

interface AdminAccountProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

const AdminAccount: React.FC<AdminAccountProps> = ({ onNotify }) => {
  const reduceMotion = useReducedMotion();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      onNotify('New password must be at least 8 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      onNotify('New passwords do not match', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      if (res.status === 200 && res.data?.token) {
        setAdminSession(res.data.token);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onNotify('Password updated. You are still signed in.', 'success');
      } else if (res.status === 200) {
        onNotify('Password updated. Please sign in again.', 'success');
      } else {
        onNotify(res.error?.message || 'Unable to change password', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="surface-glass relative overflow-hidden rounded-xl border border-border/60 p-md sm:p-lg shadow-1 max-w-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-mesh-aurora opacity-40" aria-hidden />
      <div className="relative z-10">
        <span className="eyebrow text-[11px] uppercase tracking-[0.18em] text-accent font-semibold inline-flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5" />
          Account security
        </span>
        <h2 className="headline font-display font-bold text-2xl mt-1 mb-xs text-primary">Change password</h2>
        <p className="text-sm text-ink-muted mb-lg max-w-measure">
          This updates the hashed password on the server. Other admin sessions will be signed out.
        </p>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label htmlFor="current-password" className="block text-sm font-semibold text-primary mb-1">
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={cn(
                'w-full rounded-lg px-3 py-2.5 text-sm',
                'bg-surface-elevated/60 border border-border/70 text-primary',
                'outline-none transition-all duration-fast ease-standard',
                'focus:border-accent/60 focus:ring-2 focus:ring-accent/50'
              )}
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-semibold text-primary mb-1">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={cn(
                'w-full rounded-lg px-3 py-2.5 text-sm',
                'bg-surface-elevated/60 border border-border/70 text-primary',
                'outline-none transition-all duration-fast ease-standard',
                'focus:border-accent/60 focus:ring-2 focus:ring-accent/50'
              )}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-primary mb-1">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className={cn(
                'w-full rounded-lg px-3 py-2.5 text-sm',
                'bg-surface-elevated/60 border border-border/70 text-primary',
                'outline-none transition-all duration-fast ease-standard',
                'focus:border-accent/60 focus:ring-2 focus:ring-accent/50'
              )}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-pill px-4 py-2.5 text-sm font-bold',
              'text-accent-foreground bg-accent press-lift shadow-2 hover:shadow-glow',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60'
            )}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Update password
          </button>
        </form>
      </div>
    </motion.section>
  );
};

export default AdminAccount;
