'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminHomepageCMSPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroBadge: '',
    heroCta1Text: '',
    heroCta1Link: '',
    heroCta2Text: '',
    heroCta2Link: '',
    manifestoTitle: '',
    manifestoText: '',
    scrollTickerText: '',
    heroMediaUrl: '',
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/homepage');
      const data = await res.json();
      if (data.content) {
        setFormData({
          heroTitle: data.content.heroTitle || '',
          heroSubtitle: data.content.heroSubtitle || '',
          heroBadge: data.content.heroBadge || '',
          heroCta1Text: data.content.heroCta1Text || '',
          heroCta1Link: data.content.heroCta1Link || '',
          heroCta2Text: data.content.heroCta2Text || '',
          heroCta2Link: data.content.heroCta2Link || '',
          manifestoTitle: data.content.manifestoTitle || '',
          manifestoText: data.content.manifestoText || '',
          scrollTickerText: data.content.scrollTickerText || '',
          heroMediaUrl: data.content.heroMediaUrl || '',
        });
      }
    } catch {
      toast('Failed to load homepage content', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update homepage');

      toast('Homepage content updated instantly', 'success');
    } catch (err: any) {
      toast(err.message || 'Error saving changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            EXPERIENCE EDITOR
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            HOMEPAGE CMS
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading homepage settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Hero */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-6">
            <h3 className="text-xl font-display font-black uppercase text-white tracking-wide pb-4 border-b border-zinc-850">
              01 — HERO HEADER & CALLS TO ACTION
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Main Hero Headline (Use newline for stacked rows)
              </label>
              <textarea
                rows={2}
                required
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-display uppercase text-xl focus:outline-none focus:border-accent resize-none font-black"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Supporting Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Small Information Strip / Badge
              </label>
              <input
                type="text"
                value={formData.heroBadge}
                onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Primary Button Text (CTA 1)
                </label>
                <input
                  type="text"
                  value={formData.heroCta1Text}
                  onChange={(e) => setFormData({ ...formData, heroCta1Text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={formData.heroCta1Link}
                  onChange={(e) => setFormData({ ...formData, heroCta1Link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Secondary Button Text (CTA 2)
                </label>
                <input
                  type="text"
                  value={formData.heroCta2Text}
                  onChange={(e) => setFormData({ ...formData, heroCta2Text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Secondary Button Link
                </label>
                <input
                  type="text"
                  value={formData.heroCta2Link}
                  onChange={(e) => setFormData({ ...formData, heroCta2Link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <ImageUploader
              value={formData.heroMediaUrl}
              onChange={(url) => setFormData({ ...formData, heroMediaUrl: url })}
              label="Hero Background Media / Image"
            />
          </div>

          {/* Section 2: Brand Statement & Scroll Ticker */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-6">
            <h3 className="text-xl font-display font-black uppercase text-white tracking-wide pb-4 border-b border-zinc-850">
              02 — BRAND MANIFESTO & PHILOSOPHY SEQUENCE
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Manifesto Section Headline
              </label>
              <input
                type="text"
                value={formData.manifestoTitle}
                onChange={(e) => setFormData({ ...formData, manifestoTitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Manifesto Statement Body
              </label>
              <textarea
                rows={3}
                value={formData.manifestoText}
                onChange={(e) => setFormData({ ...formData, manifestoText: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-accent resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Scroll Transition Phrases (Separated by | pipe character)
              </label>
              <input
                type="text"
                value={formData.scrollTickerText}
                onChange={(e) => setFormData({ ...formData, scrollTickerText: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                Example: YOU DON'T NEED MORE MOTIVATION. | YOU NEED A ROUTINE. | SHOW UP. | DO THE WORK.
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(212,249,51,0.25)] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING CHANGES...' : 'SAVE HOMEPAGE CONFIGURATION'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
