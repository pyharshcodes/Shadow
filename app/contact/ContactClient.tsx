'use client';

import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Navigation, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

export function ContactClient({ settings }: { settings: any }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'general',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error sending inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = `Hi SHADOW FITNESS, I would like to get in touch regarding the gym. My name is ${formData.name || 'a visitor'}.`;
  const whatsappUrl = generateWhatsAppUrl(settings?.whatsappNumber, whatsappMessage);

  return (
    <main className="flex-1 pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
            DIRECT COMMUNICATION
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase text-white leading-none">
            CONNECT WITH SHADOW FITNESS
          </h1>
          <p className="mt-4 text-zinc-400 text-lg font-sans">
            Reach out directly for membership admissions, coaching consultations, or general facility inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-850 p-8 sm:p-10 rounded-3xl shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-display uppercase tracking-wider text-white font-bold mb-2">
                    Message Dispatched
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white font-medium">{formData.name}</span>. A representative will contact you via phone or email shortly.
                  </p>
                </div>

                {whatsappUrl && (
                  <div className="pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 py-3 px-6 bg-[#25D366] text-black font-bold uppercase text-xs tracking-wider rounded-lg hover:brightness-110 transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                    >
                      <MessageSquare className="w-4 h-4 fill-black" />
                      <span>Continue on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide">
                  SEND AN ENQUIRY
                </h3>

                {error && (
                  <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Cameron Diaz"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="cameron@domain.com"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Your Message or Inquiry
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you would like to know..."
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(212,249,51,0.25)] flex items-center justify-center gap-2"
                >
                  {loading ? <span>SENDING...</span> : <><span>SUBMIT MESSAGE</span><Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Quick Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-6">
              <h3 className="text-xl font-display font-black uppercase text-white tracking-wide pb-4 border-b border-zinc-850">
                DIRECT CONTACT CHANNELS
              </h3>

              <div className="space-y-4">
                {settings?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
                        Telephone
                      </span>
                      <a href={`tel:${settings.phone}`} className="text-base font-mono text-white hover:text-accent transition-colors font-bold">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.whatsappNumber && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0">
                      <MessageSquare className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
                        WhatsApp Live
                      </span>
                      <a
                        href={whatsappUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-mono text-[#25D366] hover:underline font-bold"
                      >
                        Message On WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
                      Physical Location
                    </span>
                    {settings?.address ? (
                      <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                        {settings.address}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-500 font-mono">
                        Configurable via Admin Dashboard Settings.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {settings?.googleMapsLink && (
                <div className="pt-2">
                  <a
                    href={settings.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors hover:text-accent"
                  >
                    <Navigation className="w-4 h-4 text-accent" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
