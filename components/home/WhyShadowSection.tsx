'use client';

import React from 'react';
import { Target, Activity, ShieldCheck, Zap } from 'lucide-react';

const PILLARS = [
  {
    icon: Target,
    title: 'ZERO GIMMICKS. ZERO NOISE.',
    desc: 'No vibrating platforms or fad workout trends. We focus exclusively on time-tested biomechanics, progressive resistance, and intentional training.',
  },
  {
    icon: ShieldCheck,
    title: 'HIGH-CALIBER EQUIPMENT',
    desc: 'From competition-calibrated barbells and rigid power cages to ergonomically dialed isolation leverage machines that protect joints while loading muscles.',
  },
  {
    icon: Activity,
    title: 'DISCIPLINED CULTURE',
    desc: 'An environment designed for individuals who value concentration. Here, everyone is working toward a tangible goal with focus and mutual respect.',
  },
  {
    icon: Zap,
    title: 'COACHING INTEGRITY',
    desc: 'Trainers who prioritize safety, movement literacy, and long-term joint health over quick-fix promises. We build habits that last for life.',
  },
];

export function WhyShadowSection() {
  return (
    <section className="py-24 sm:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
            THE SHADOW ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase text-white leading-none">
            WHY TRAIN AT SHADOW FITNESS?
          </h2>
          <p className="mt-4 text-zinc-400 text-base sm:text-lg font-sans">
            We built this facility as an antidote to crowded, chaotic big-box gyms. Every square foot is engineered for meaningful athletic output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-black transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-black uppercase tracking-wide text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-600">
                  <span>STANDARD 0{idx + 1}</span>
                  <span className="text-accent/60">VERIFIED</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
