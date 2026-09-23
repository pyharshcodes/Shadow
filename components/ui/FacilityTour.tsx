'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';

export interface FacilityItem {
  id: string;
  name: string;
  tag: string;
  description: string;
  specs: string; // JSON array
  imageUrl?: string | null;
}

export function FacilityTour({ facilities }: { facilities: FacilityItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!facilities || facilities.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500">
        Facility details are being configured in the admin dashboard.
      </div>
    );
  }

  const current = facilities[activeIndex] || facilities[0];
  let specsList: string[] = [];
  try {
    specsList = JSON.parse(current.specs || '[]');
  } catch {
    specsList = [];
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Column: Interactive Area Selector */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        {facilities.map((fac, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={fac.id}
              onClick={() => setActiveIndex(idx)}
              className={`text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? 'bg-zinc-900/90 border-accent/70 shadow-[0_0_20px_rgba(212,249,51,0.08)]'
                  : 'bg-zinc-950/60 border-zinc-850 hover:border-zinc-700/80 hover:bg-zinc-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-mono tracking-widest uppercase font-semibold ${isActive ? 'text-accent' : 'text-zinc-500'}`}>
                  {fac.tag || `ZONE 0${idx + 1}`}
                </span>
                <span className={`text-xs font-mono ${isActive ? 'text-accent' : 'text-zinc-600'}`}>
                  0{idx + 1}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white group-hover:text-accent transition-colors">
                {fac.name}
              </h3>
              {isActive && (
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed line-clamp-2">
                  {fac.description}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Column: Visual Stage */}
      <div className="lg:col-span-7">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[16/10] shadow-2xl group">
          {current.imageUrl ? (
            <img
              src={current.imageUrl}
              alt={current.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 font-mono text-sm">
              [Image to be uploaded via CMS]
            </div>
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* Floating specs pill box */}
          <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold rounded uppercase">
                {current.tag}
              </span>
              <span className="text-white/80 text-xs font-mono uppercase tracking-wider">
                Elite Standard Equipment
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              {current.name}
            </h3>
            {specsList.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {specsList.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 text-xs font-mono text-zinc-300"
                  >
                    <Check className="w-3.5 h-3.5 text-accent" />
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
