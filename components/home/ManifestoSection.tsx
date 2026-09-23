'use client';

import React, { useState, useEffect } from 'react';

interface ManifestoProps {
  title?: string;
  text?: string;
  tickerText?: string;
}

export function ManifestoSection({
  title = 'More than a gym.',
  text = 'SHADOW FITNESS is a place to train with purpose, build discipline and become stronger—one session at a time.',
  tickerText = "You don't need more motivation. | You need a routine. | Show up. | Do the work.",
}: ManifestoProps) {
  const steps = tickerText
    ? tickerText.split('|').map((s) => s.trim())
    : [
        "You don't need more motivation.",
        'You need a routine.',
        'Show up.',
        'Do the work.',
      ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="py-24 sm:py-32 bg-zinc-950 border-t border-b border-zinc-900 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Statement */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-accent uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>THE MANIFESTO</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-[0.95]">
              {title}
            </h2>
            <p className="text-lg sm:text-xl text-zinc-300 font-sans leading-relaxed">
              {text}
            </p>
            <div className="pt-2 flex items-center gap-6 text-xs font-mono text-zinc-500 uppercase tracking-wider">
              <span>ESTABLISHED ON RESULTS</span>
              <span>•</span>
              <span>PURPOSE DRIVEN</span>
            </div>
          </div>

          {/* Right Column: Interactive Staggered Progression Loop */}
          <div className="lg:col-span-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 sm:p-12 relative flex flex-col justify-center min-h-[300px]">
            <div className="text-xs font-mono tracking-wider text-zinc-500 uppercase mb-6 flex items-center justify-between">
              <span>PHILOSOPHY SEQUENCE</span>
              <span className="text-accent font-bold">
                0{activeStep + 1} / 0{steps.length}
              </span>
            </div>

            <div className="relative h-28 flex items-center">
              {steps.map((phrase, idx) => {
                const isActive = idx === activeStep;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 flex items-center transition-all duration-700 ease-out ${
                      isActive
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
                    }`}
                  >
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
                      <span className="text-accent">{phrase.slice(0, 1)}</span>
                      {phrase.slice(1)}
                    </h3>
                  </div>
                );
              })}
            </div>

            {/* Stepper Progress Indicator with Accessible Touch Target */}
            <div className="flex items-center gap-1.5 mt-8" role="tablist" aria-label="Philosophy sequence pagination">
              {steps.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeStep}
                  onClick={() => setActiveStep(i)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  aria-label={`Go to statement 0${i + 1}`}
                >
                  <span
                    className={`h-2.5 rounded-full transition-all duration-300 block ${
                      i === activeStep ? 'w-14 bg-accent' : 'w-7 bg-zinc-700 hover:bg-zinc-500'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
