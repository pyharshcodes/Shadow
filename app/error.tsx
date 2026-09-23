'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <span className="text-xs font-mono tracking-ultra-wide uppercase text-rose-400 font-bold">
          SYSTEM NOTICE
        </span>
        <h1 className="text-4xl font-display font-black uppercase text-white tracking-tight leading-none">
          UNEXPECTED INTERRUPTION
        </h1>
        <p className="text-zinc-400 text-sm font-sans leading-relaxed">
          The requested station could not complete the operation. Please refresh the connection or try again.
        </p>
        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RETRY CONNECTION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
