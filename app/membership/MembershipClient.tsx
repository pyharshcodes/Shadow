'use client';

import React, { useState } from 'react';
import { Check, Flame, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { EnquiryModal } from '@/components/ui/EnquiryModal';

const FAQS = [
  {
    q: 'Can I test the gym before committing to a membership?',
    a: 'Yes, if the free trial option is currently enabled, you can reserve a complimentary guest day pass right on our website to tour the facilities and train.',
  },
  {
    q: 'Are personal training sessions included in standard plans?',
    a: 'Certain elite tiers include dedicated coaching assessments and PT sessions. Additional 1-on-1 private coaching packages can be arranged directly with our head trainers.',
  },
  {
    q: 'Are there any hidden maintenance fees or registration charges?',
    a: 'No. Shadow Fitness operates on transparent pricing with zero surprise renewal or equipment maintenance deductions.',
  },
  {
    q: 'Can I freeze my membership if traveling or recovering?',
    a: 'Yes, quarterly and annual memberships include designated freeze privileges with prior notification to gym management.',
  },
];

export function MembershipClient({
  memberships,
  settings,
}: {
  memberships: any[];
  settings: any;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleEnquire = (planName: string) => {
    setSelectedPlan(planName);
    setModalOpen(true);
  };

  return (
    <main className="flex-1 pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
            MEMBERSHIP COMMITMENT
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase text-white leading-none">
            INVEST IN UNCOMPROMISING STRENGTH
          </h1>
          <p className="mt-4 text-zinc-400 text-base sm:text-lg font-sans">
            Choose the membership timeline that matches your discipline. Every tier provides complete access to our calibrated barbell compound and machines.
          </p>
        </div>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
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
                className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-zinc-900 border-2 border-accent shadow-[0_0_35px_rgba(212,249,51,0.15)] md:-translate-y-2'
                    : 'bg-zinc-950 border border-zinc-850 hover:border-zinc-700'
                }`}
              >
                {plan.highlightBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-zinc-950 text-[11px] font-mono font-black uppercase tracking-widest shadow-lg">
                    {plan.highlightBadge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                      {plan.duration}
                    </span>
                    {plan.personalTrainingIncluded && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-accent font-semibold uppercase">
                        PT Included
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl font-display font-black uppercase text-white tracking-wide mb-3">
                    {plan.name}
                  </h3>

                  <div className="mb-6 pb-6 border-b border-zinc-800">
                    <span className="text-3xl sm:text-4xl font-display font-black text-white">
                      {plan.price}
                    </span>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {featureList.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300 font-sans">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleEnquire(plan.name)}
                  className={`w-full py-4 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    plan.isPopular
                      ? 'bg-accent hover:bg-accent-hover text-zinc-950 shadow-[0_0_20px_rgba(212,249,51,0.3)]'
                      : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-white hover:text-accent'
                  }`}
                >
                  <span>SELECT {plan.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto pt-12 border-t border-zinc-900">
          <div className="text-center mb-12">
            <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-2">
              CLARITY & STANDARDS
            </span>
            <h3 className="text-3xl font-display font-black uppercase text-white tracking-wide">
              FREQUENTLY ASKED QUESTIONS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-2">
                <h4 className="text-base font-display font-bold uppercase text-white tracking-wide flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-accent shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultPlan={selectedPlan}
        defaultType="membership"
        whatsappNumber={settings?.whatsappNumber}
      />
    </main>
  );
}
