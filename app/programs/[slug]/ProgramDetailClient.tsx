'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Check, User, ArrowRight, MessageSquare } from 'lucide-react';
import { EnquiryModal } from '@/components/ui/EnquiryModal';
import { generateWhatsAppUrl } from '@/lib/utils';

export function ProgramDetailClient({
  program,
  settings,
}: {
  program: any;
  settings: any;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const whatsappMessage = `Hi SHADOW FITNESS, I would like to enquire about the ${program.title} program.`;
  const whatsappUrl = generateWhatsAppUrl(settings?.whatsappNumber, whatsappMessage);

  return (
    <main className="flex-1 pt-28 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all programs</span>
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-zinc-950 border border-zinc-800 mb-12 shadow-2xl">
          <img
            src={
              program.imageUrl ||
              'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80'
            }
            alt={program.title}
            className="w-full h-full object-cover brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <span className="px-3.5 py-1.5 rounded bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold uppercase tracking-wider mb-3 inline-block">
              {program.category}
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-black uppercase text-white tracking-tight leading-none">
              {program.title}
            </h1>
          </div>
        </div>

        {/* Two-Column Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-black uppercase text-white tracking-wide">
                OVERVIEW & INTENT
              </h2>
              <p className="text-zinc-300 font-sans leading-relaxed text-base sm:text-lg">
                {program.description}
              </p>
            </div>

            {/* Who is it for */}
            {program.targetAudience && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
                <h3 className="text-lg font-display font-bold uppercase text-white tracking-wide flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent" />
                  <span>WHO THIS PROGRAM IS BUILT FOR</span>
                </h3>
                <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                  {program.targetAudience}
                </p>
              </div>
            )}

            {/* Approach */}
            {program.approach && (
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-black uppercase text-white tracking-wide">
                  TRAINING METHODOLOGY & APPROACH
                </h2>
                <p className="text-zinc-300 font-sans leading-relaxed text-base">
                  {program.approach}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Info & Sticky Booking Box */}
          <div className="lg:col-span-4">
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6 sticky top-28 shadow-xl">
              <h3 className="text-xl font-display font-bold uppercase text-white tracking-wide pb-4 border-b border-zinc-850">
                PROGRAM SPECIFICATIONS
              </h3>

              <div className="space-y-4 text-xs font-mono">
                {program.duration && (
                  <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                    <span className="text-zinc-500">SESSION DURATION</span>
                    <span className="text-white font-bold">{program.duration}</span>
                  </div>
                )}
                {program.schedule && (
                  <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                    <span className="text-zinc-500">BATCH SCHEDULE</span>
                    <span className="text-white font-bold">{program.schedule}</span>
                  </div>
                )}
                {program.trainer && (
                  <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                    <span className="text-zinc-500">LEAD COACH</span>
                    <span className="text-accent font-bold">{program.trainer.name}</span>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-4 rounded-xl bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,249,51,0.25)] flex items-center justify-center gap-2"
                >
                  <span>{program.ctaText || 'ENQUIRE ABOUT THIS PROGRAM'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Ask via WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultPlan={program.title}
        defaultType="program"
        whatsappNumber={settings?.whatsappNumber}
      />
    </main>
  );
}
