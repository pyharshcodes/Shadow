'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, UserCheck, Shield } from 'lucide-react';

export interface TrainerItem {
  id: string;
  slug: string;
  name: string;
  role: string;
  specializations?: string | null;
  experience?: string | null;
  certifications?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
}

export function TrainersSection({ trainers }: { trainers: TrainerItem[] }) {
  return (
    <section className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className={trainers?.length === 1 ? 'text-center md:text-left max-w-2xl' : ''}>
            <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
              COACHING & LEADERSHIP
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight uppercase text-white leading-none">
              {trainers?.length === 1 ? 'OUR COACH & MENTOR' : 'OUR COACHES & MENTORS'}
            </h2>
            <p className="mt-3 text-zinc-400 text-base max-w-xl">
              Coaches who lead by example. We focus on mechanical efficiency, structured progressive overload, and disciplined execution.
            </p>
          </div>

          <Link
            href="/trainers"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-accent transition-colors self-start md:self-end"
          >
            <span>View Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {(!trainers || trainers.length === 0) ? (
          <div className="max-w-xl mx-auto p-10 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center">
            <UserCheck className="w-10 h-10 text-accent/80 mx-auto mb-3" />
            <h3 className="text-xl font-display font-bold uppercase tracking-wider text-white mb-2">
              COACHING ROSTER UPDATING
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans mb-5">
              Verified trainer profiles and certifications are maintained by gym administration to guarantee authentic credentialing.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors"
            >
              <span>Enquire About Personal Training</span>
            </Link>
          </div>
        ) : (
          <div className={trainers.length === 1 ? 'grid grid-cols-1 max-w-md mx-auto gap-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
            {trainers.map((t) => (
              <div
                key={t.id}
                className="group rounded-2xl overflow-hidden bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
                    <img
                      src={
                        t.photoUrl ||
                        'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={t.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-zinc-700/60 text-xs font-mono tracking-wider text-accent font-bold uppercase">
                      {t.role}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide group-hover:text-accent transition-colors mb-1">
                      {t.name}
                    </h3>
                    {t.specializations && (
                      <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
                        {t.specializations}
                      </p>
                    )}
                    {t.bio && (
                      <p className="text-sm text-zinc-400 font-sans leading-relaxed line-clamp-3 mb-4">
                        {t.bio}
                      </p>
                    )}
                    {t.certifications && (
                      <div className="text-xs font-mono text-zinc-500 border-t border-zinc-800/80 pt-3">
                        <span className="text-zinc-400 font-bold block mb-1">CREDENTIALS</span>
                        {t.certifications}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/trainers/${t.slug}`}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 font-mono text-xs uppercase tracking-wider text-center block transition-colors hover:text-white"
                  >
                    View Coach Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
