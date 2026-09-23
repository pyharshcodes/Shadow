'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@shadowfitness.com');
  const [password, setPassword] = useState('shadowfitness123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-accent text-zinc-950 flex items-center justify-center font-display font-black text-2xl mx-auto shadow-[0_0_20px_rgba(212,249,51,0.3)]">
            S
          </div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-wider">
            SHADOW FITNESS CMS
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            ADMINISTRATIVE CONTROL PANEL
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(212,249,51,0.25)] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>ENTER DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Credentials Reminder Box */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-850 text-xs font-mono space-y-1.5 text-zinc-400">
          <div className="flex items-center gap-1.5 text-accent font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Default Seed Credentials</span>
          </div>
          <div className="text-[11px]">
            Email: <span className="text-white">admin@shadowfitness.com</span>
          </div>
          <div className="text-[11px]">
            Password: <span className="text-white">shadowfitness123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
