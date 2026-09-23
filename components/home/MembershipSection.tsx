'use client';

import React from 'react';
import { Check, Flame, ArrowRight, ShieldCheck } from 'lucide-react';

export interface MembershipItem {
  id: string;
  slug: string;
  name: string;
  price: string;
  duration: string;
  features: string; // JSON array
  highlightBadge?: string | null;
  isPopular: boolean;
  personalTrainingIncluded: boolean;
}

interface MembershipSectionProps {
  memberships: MembershipItem[];
  onSelectPlan: (plan: MembershipItem) => void;
}

export function MembershipSection({
  memberships,
  onSelectPlan,
}: MembershipSectionProps) {
  if (!memberships || memberships.length === 0) {
    return null;
  }

  return (
    <section id="membership" className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
            COMMITMENT TIERS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight uppercase text-white leading-none">
            MEMBERSHIP PLANS
          </h2>
          <p className="mt-4 text-zinc-400 text-base sm:text-lg font-sans">
            Choose your level of dedication. Transparent, zero hidden fees, and built for people who show up consistently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {memberships.map((plan) => {
            let featureList: string[] = [];
            try {
              featureList = JSON.parse(plan.features || '[]');
            } catch {
              featureList = [];
            }

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-zinc-900 border-2 border-accent shadow-[0_0_35px_rgba(212,249,51,0.15)] md:-translate-y-2'
                    : 'bg-zinc-950 border border-zinc-850 hover:border-zinc-700'
                }`}
              >
                {/* Popular or Custom Badge */}
                {plan.highlightBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-zinc-950 text-xs font-mono font-black uppercase tracking-wider shadow-md">
                    {plan.highlightBadge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                      {plan.duration}
                    </span>
                    {plan.personalTrainingIncluded && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-accent font-semibold uppercase">
                        PT Included
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl font-display font-black uppercase text-white tracking-wide mb-3">
                    {plan.name}
                  </h3>

                  <div className="mb-6 pb-6 border-b border-zinc-800">
                    <span className="text-3xl sm:text-4xl font-display font-black text-white">
                      {plan.price && plan.price !== 'Configurable in Admin'
                        ? plan.price
                        : 'Custom Tier'}
                    </span>
                    {(!plan.price || plan.price === 'Configurable in Admin') && (
                      <p className="text-xs font-mono text-zinc-400 mt-1">Flexible billing & seasonal rates</p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 mb-8">
                    {featureList.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300 font-sans">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Enquiry CTA */}
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-4 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    plan.isPopular
                      ? 'bg-accent hover:bg-accent-hover text-zinc-950 shadow-[0_0_20px_rgba(212,249,51,0.3)]'
                      : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-white hover:text-accent'
                  }`}
                >
                  <span>ENQUIRE ABOUT {plan.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
