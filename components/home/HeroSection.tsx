'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Flame, Shield } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  cta1Text?: string;
  cta1Link?: string;
  cta2Text?: string;
  cta2Link?: string;
  mediaUrl?: string | null;
  onOpenEnquiry?: () => void;
}

export function HeroSection({
  title = 'BUILD YOUR\nSTRONGER SELF.',
  subtitle = 'Train with purpose. Build strength. Become better every day.',
  badge = 'TRAIN • BUILD • TRANSFORM',
  cta1Text = 'START YOUR JOURNEY',
  cta1Link = '#membership',
  cta2Text = 'EXPLORE THE GYM',
  cta2Link = '#programs',
  mediaUrl,
  onOpenEnquiry,
}: HeroProps) {
  const formattedTitle = title.split('\n');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20 pb-16">
      {/* Background Media & Atmospheric Fitness Visual */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={mediaUrl || '/images/gym/photo_2.png'}
          alt="Shadow Fitness Club"
          className="w-full h-full object-cover object-center brightness-[0.62] contrast-110 blur-[1.5px] scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Subtle cinematic overlays allowing the gym photo to be clearly visible while maintaining typography contrast */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/40 pointer-events-none" />
      </div>

      {/* Floating subtle brand motif */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Top Metadata Strip */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-md mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-mono tracking-wider uppercase text-zinc-300 font-bold">
            {badge}
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="font-display font-black text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tight text-white leading-[0.92] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] mb-6 break-words">
          {formattedTitle.map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-base sm:text-xl text-zinc-400 font-sans leading-relaxed mb-10 font-normal">
          {subtitle}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href={cta1Link}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(212,249,51,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{cta1Text}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={cta2Link}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs uppercase tracking-wider transition-all duration-200 hover:border-zinc-500 flex items-center justify-center gap-2"
          >
            <span>{cta2Text}</span>
          </Link>
        </div>

        {/* Bottom Scroll Cue */}
        <div className="mt-16 flex flex-col items-center gap-2 text-zinc-500 animate-bounce">
          <span className="text-xs font-mono tracking-wider uppercase">SCROLL TO DISCOVER</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
