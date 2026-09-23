'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export interface ProgramItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  targetAudience?: string | null;
  approach?: string | null;
  duration?: string | null;
  schedule?: string | null;
  ctaText?: string;
  imageUrl?: string | null;
  isFeatured: boolean;
  trainer?: {
    name: string;
    role: string;
  } | null;
}

interface ProgramsSectionProps {
  programs: ProgramItem[];
  filterCategory?: string;
  onSelectProgram?: (program: ProgramItem) => void;
}

export function ProgramsSection({
  programs,
  filterCategory,
  onSelectProgram,
}: ProgramsSectionProps) {
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(programs.map((p) => p.category)))];

  const effectiveCat = filterCategory || selectedCat;

  const filteredPrograms = effectiveCat === 'All'
    ? programs
    : programs.filter((p) => p.category === effectiveCat);

  return (
    <section id="programs" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
              TARGETED DISCIPLINES
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight uppercase text-white leading-none">
              TRAINING PROGRAMS
            </h2>
            <p className="mt-3 text-zinc-400 text-base max-w-xl">
              Structured protocols designed to elicit distinct adaptations. Find the training system that aligns with your physical target.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                  effectiveCat === cat
                    ? 'bg-accent text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Program Cards Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-zinc-800 text-zinc-500">
            No programs listed under this category. Check back soon or visit admin to add programs.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="group rounded-2xl overflow-hidden bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                    <img
                      src={
                        prog.imageUrl ||
                        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={prog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-zinc-700/60 text-xs font-mono tracking-wider text-accent font-bold uppercase">
                      {prog.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide group-hover:text-accent transition-colors mb-3">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-sans line-clamp-3 mb-6">
                      {prog.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400 border-t border-zinc-800/80 pt-4">
                      {prog.duration && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          <span>{prog.duration}</span>
                        </div>
                      )}
                      {prog.schedule && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>{prog.schedule}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions - Proper Visual Hierarchy */}
                <div className="p-6 pt-0 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectProgram && onSelectProgram(prog)}
                    className="flex-1 py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(212,249,51,0.2)] flex items-center justify-center gap-1.5"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    href={`/programs/${prog.slug}`}
                    className="py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-350 hover:text-white font-mono text-xs uppercase tracking-wider text-center transition-colors"
                  >
                    Details
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
