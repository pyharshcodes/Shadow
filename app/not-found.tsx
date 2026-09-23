import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold">
          ERROR 404
        </span>
        <h1 className="text-6xl sm:text-7xl font-display font-black uppercase text-white tracking-tight leading-none">
          OFF THE TRACK
        </h1>
        <p className="text-zinc-400 text-sm font-sans leading-relaxed">
          The pathway or facility station you are looking for does not exist or has been relocated.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO GYM FLOOR</span>
          </Link>
          <Link
            href="/programs"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors"
          >
            VIEW PROGRAMS
          </Link>
        </div>
      </div>
    </div>
  );
}
