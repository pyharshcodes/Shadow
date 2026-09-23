'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
  defaultType?: 'general' | 'membership' | 'program' | 'trainer';
  whatsappNumber?: string | null;
}

export function EnquiryModal({
  isOpen,
  onClose,
  defaultPlan = '',
  defaultType = 'general',
  whatsappNumber,
}: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interestedPlan: defaultPlan,
    fitnessGoal: '',
    preferredTime: 'Evening',
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
          type: defaultType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      interestedPlan: '',
      fitnessGoal: '',
      preferredTime: 'Evening',
      message: '',
    });
    onClose();
  };

  const whatsappMessage = `Hi SHADOW FITNESS, I submitted an enquiry for ${formData.interestedPlan || defaultPlan || 'training'}. My name is ${formData.name}.`;
  const whatsappUrl = generateWhatsAppUrl(whatsappNumber, whatsappMessage);

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={submitted ? 'ENQUIRY CONFIRMED' : 'START YOUR CONVERSATION'}
    >
      {submitted ? (
        <div className="py-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-display uppercase tracking-wider font-bold text-white mb-2">
              We Have Received Your Details
            </h4>
            <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
              A coach from SHADOW FITNESS will review your enquiry and get back to you shortly.
            </p>
          </div>

          {whatsappUrl && (
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] text-black font-bold uppercase text-xs tracking-wider rounded-lg hover:brightness-110 transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)]"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Continue on WhatsApp Immediately</span>
              </a>
            </div>
          )}

          <button
            onClick={resetAndClose}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Close Window
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Hunter"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-accent text-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-accent text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@domain.com"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-accent text-sm transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Primary Goal
              </label>
              <select
                value={formData.fitnessGoal}
                onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Select your goal...</option>
                <option value="Muscle Building">Muscle Building</option>
                <option value="Strength & Power">Strength & Power</option>
                <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                <option value="Athletic Mobility">Athletic Mobility</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Preferred Training Slot
              </label>
              <select
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="Early Morning (06:00 - 09:00)">Early Morning (06:00 - 09:00)</option>
                <option value="Midday (11:00 - 15:00)">Midday (11:00 - 15:00)</option>
                <option value="Evening (17:00 - 21:00)">Evening (17:00 - 21:00)</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Note or Specific Question
            </label>
            <textarea
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what you're looking for..."
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-accent text-sm transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-sm tracking-wider uppercase rounded-lg transition-all shadow-[0_0_20px_rgba(212,249,51,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>SENDING...</span>
            ) : (
              <>
                <span>SEND ENQUIRY</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
}
