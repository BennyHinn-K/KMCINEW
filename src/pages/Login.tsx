/// <reference types="vite/client" />
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { Logger } from '../lib/logger';

const Login = () => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 60000; // 1 minute

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Account temporarily locked. Please try again later.');
      return;
    }

    const envPasskey = import.meta.env.VITE_ADMIN_PASSKEY;
    
    if (!envPasskey) {
      Logger.error('System Configuration Error: VITE_ADMIN_PASSKEY is missing');
      setError('System configuration error: Passkey not configured.');
      return;
    }

    const trimmedPasskey = passkey.trim();
    
    if (trimmedPasskey === envPasskey) {
      try {
        localStorage.setItem('kmci_admin_session', 'true');
        const tokenPayload = {
          sub: 'admin',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        };
        const header = { alg: 'HS256', typ: 'JWT' };
        const b64 = (obj: unknown) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const unsigned = `${b64(header)}.${b64(tokenPayload)}`;
        const signature = btoa('sig').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const token = `${unsigned}.${signature}`;
        localStorage.setItem('kmci_admin_token', token);
        Logger.access('Admin login successful');
        setAttempts(0);
        navigate('/admin/dashboard');
      } catch (err) {
        Logger.error('Login Storage Error', { error: err });
        setError('Failed to save session. Check browser settings.');
      }
    } else {
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
        setError(`Invalid passkey provided. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-500">Please enter your security passkey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 outline-none"
              placeholder="Enter Passkey"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
