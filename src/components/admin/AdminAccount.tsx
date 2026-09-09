import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { KeyRound, ShieldAlert, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminAccountProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

const AdminAccount: React.FC<AdminAccountProps> = ({ onNotify: _onNotify }) => {
  const reduceMotion = useReducedMotion();

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
        <div className="flex items-start gap-3 mt-md">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              'bg-amber-500/10 text-amber-500 ring-1 ring-inset ring-amber-500/30'
            )}
            aria-hidden
          >
            <Lock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="headline font-display font-bold text-xl text-primary">Password changes are disabled</h2>
            <p className="text-sm text-ink-muted mt-1 leading-relaxed">
              This system is locked to a single fixed passkey. Only the credential{' '}
              <code className="rounded bg-surface-elevated/80 px-1.5 py-0.5 text-[0.8em] font-semibold text-accent ring-1 ring-border/60">
                ADMIN@kmci
              </code>{' '}
              is accepted for authentication.
            </p>
            <ul className="mt-md space-y-1.5 text-sm text-ink-muted">
              <li className="flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                No alternative passkeys or credentials are configured.
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                All password change requests are automatically rejected and audited.
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                Every authentication attempt is logged (IP, user agent, timestamp, outcome).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AdminAccount;
