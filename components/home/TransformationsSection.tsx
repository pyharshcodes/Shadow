'use client';

import React from 'react';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import { ShieldCheck, Award } from 'lucide-react';

export interface TransformationItem {
  id: string;
  name: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  goal: string;
  story: string;
  consentConfirmed: boolean;
}

export function TransformationsSection({
  transformations,
}: {
  transformations: TransformationItem[];
}) {
  return (
    <section className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono tracking-wider text-accent uppercase mb-3 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AUTHENTIC MEMBER MILESTONES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight uppercase text-white leading-none">
            REAL TRANSFORMATION STORIES
          </h2>
          <p className="mt-4 text-zinc-400 text-base sm:text-lg font-sans">
            We do not fabricate results. Every profile displayed here represents documented hard work, structured routine, and explicit member consent.
          </p>
        </div>

        {(!transformations || transformations.length === 0) ? (
          <div className="max-w-2xl mx-auto p-10 rounded-2xl bg-zinc-900/40 border border-zinc-850 text-center">
            <Award className="w-10 h-10 text-accent/80 mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold uppercase tracking-wider text-white mb-2">
              AUTHENTICITY FIRST POLICY
            </h3>
            <p className="text-sm text-zinc-400 font-sans leading-relaxed">
              We never use stock photos or staged actor transformations. Verified member progress logs are submitted and authorized through our coaching staff. Real member spotlights will appear here as soon as approved.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {transformations.map((t) => (
              <div
                key={t.id}
                className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 sm:p-8 space-y-6"
              >
                <BeforeAfterSlider
                  beforeImage={t.beforeImage}
                  afterImage={t.afterImage}
                />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide">
                      {t.name}
                    </h3>
                    <span className="text-xs font-mono px-3 py-1 rounded bg-zinc-800 text-accent font-semibold">
                      {t.duration}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
                    FOCUS: <span className="text-zinc-200">{t.goal}</span>
                  </div>
                  <p className="text-sm text-zinc-400 font-sans leading-relaxed italic border-l-2 border-accent/60 pl-4 py-1">
                    "{t.story}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
