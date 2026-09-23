'use client';

import React, { useState } from 'react';
import { Flame, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

interface TrialSectionProps {
  freeTrialEnabled?: boolean;
  whatsappNumber?: string | null;
}

export function TrialSection({
  freeTrialEnabled = true,
  whatsappNumber,
}: TrialSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredDate: '',
    preferredTime: 'Evening (17:00 - 21:00)',
    fitnessGoal: 'Build Muscle',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!freeTrialEnabled) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit trial booking');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = `Hi SHADOW FITNESS, I booked a free trial pass for ${formData.preferredDate || 'this week'}. Name: ${formData.name}.`;
  const whatsappUrl = generateWhatsAppUrl(whatsappNumber, whatsappMessage);

  return (
    <section id="free-trial" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          {/* Accent glow corner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            {/* Left Column: Trial Value Pitch */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>EXPERIENCE SHADOW FIRSTHAND</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight uppercase text-white leading-[0.95]">
                BOOK YOUR <br />
                <span className="text-accent">FREE TRIAL PASS</span>
              </h2>
              <p className="text-zinc-400 text-base font-sans leading-relaxed">
                Step inside, tour the strength floor, test our equipment, and experience the focused atmosphere before committing to a membership.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                  <span>Zero commitment or mandatory contract sign-up</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                  <span>Access to complete barbell & machine compound floor</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                  <span>Complimentary movement & form guidance from coach</span>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Form */}
            <div className="lg:col-span-7 bg-zinc-950/80 border border-zinc-800 p-7 sm:p-10 rounded-2xl shadow-xl">
              {submitted ? (
                <div className="text-center py-8 space-y-5">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display uppercase tracking-wider text-white font-bold mb-2">
                      Trial Pass Reserved
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
                      Thank you, <span className="text-white font-medium">{formData.name}</span>. We will confirm your preferred timing and prepare your guest entry pass.
                    </p>
                  </div>

                  {whatsappUrl && (
                    <div className="pt-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#25D366] text-black font-bold uppercase text-xs tracking-wider rounded-xl hover:brightness-110 transition-all"
                      >
                        <MessageSquare className="w-4 h-4 fill-black" />
                        <span>Instant Confirmation via WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 font-semibold">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jordan Miller"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-750 rounded-xl text-white text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 font-semibold">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-750 rounded-xl text-white text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 font-semibold">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-750 rounded-xl text-white text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 font-semibold">
                        Time of Day
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-750 rounded-xl text-white text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                      >
                        <option value="Morning (06:00 - 11:00)">Morning (06:00 - 11:00)</option>
                        <option value="Afternoon (11:00 - 16:00)">Afternoon (11:00 - 16:00)</option>
                        <option value="Evening (17:00 - 21:00)">Evening (17:00 - 21:00)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 font-semibold">
                      Primary Fitness Goal
                    </label>
                    <select
                      value={formData.fitnessGoal}
                      onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-750 rounded-xl text-white text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    >
                      <option value="Strength & Power">Strength & Power</option>
                      <option value="Build Muscle">Build Muscle</option>
                      <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                      <option value="Mobility & General Health">Mobility & General Health</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(212,249,51,0.25)] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'RESERVING PASS...' : 'CONFIRM FREE TRIAL PASS'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
