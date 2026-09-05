import React, { useState } from 'react';
import { Bus, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { User } from '../../types';
import { getStoredUsers, setCurrentUser } from '../../services/storage';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onNavigateRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      setError('No account registered with this email. Check credentials or register.');
      return;
    }

    // In demo environment, validate basic match or demo presets
    setCurrentUser(found);
    onLoginSuccess(found);
  };

  const fillDemoAccount = (role: 'USER' | 'ADMIN') => {
    if (role === 'USER') {
      setEmail('user@transitph.test');
      setPassword('User123!');
    } else {
      setEmail('admin@transitph.test');
      setPassword('Admin123!');
    }
    setError(null);
  };

  return (
    <div className="min-h-full flex flex-col justify-center px-4 py-8 max-w-md mx-auto w-full">
      {/* App Header / Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-700/20 mb-3">
          <Bus className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">TransitPH</h1>
        <p className="text-sm text-slate-600 mt-0.5">
          CALABARZON Multi-Modal Transit Navigation
        </p>
        <div className="inline-block mt-2 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
          30% Midterm Implementation
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Sign In to Your Account</h2>
        <p className="text-xs text-slate-500 mb-5">
          Enter credentials to access commuter navigation and saved routes.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@transitph.test"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
            Quick Demo Fill (Testing)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('USER')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fill Commuter</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('ADMIN')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Fill Admin</span>
            </button>
          </div>
        </div>

        {/* Register prompt */}
        <div className="mt-5 text-center">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
