'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, Plus, Trash2, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    gymName: 'SHADOW FITNESS',
    tagline: 'DISCIPLINE OVER MOTIVATION.',
    phone: '',
    whatsappNumber: '',
    email: '',
    address: '',
    googleMapsEmbedUrl: '',
    googleMapsLink: '',
    parkingInfo: '',
    accentColor: '#d4f933',
    freeTrialEnabled: true,
    instagramUrl: '',
    youtubeUrl: '',
    facebookUrl: '',
    aboutText: '',
    footerText: '',
  });

  const [hoursList, setHoursList] = useState<{ days: string; hours: string }[]>([
    { days: 'Monday - Friday', hours: '05:30 AM - 10:30 PM' },
    { days: 'Saturday', hours: '06:00 AM - 09:00 PM' },
    { days: 'Sunday', hours: '07:00 AM - 01:00 PM' },
  ]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.settings) {
        setFormData({
          gymName: data.settings.gymName || 'SHADOW FITNESS',
          tagline: data.settings.tagline || 'DISCIPLINE OVER MOTIVATION.',
          phone: data.settings.phone || '',
          whatsappNumber: data.settings.whatsappNumber || '',
          email: data.settings.email || '',
          address: data.settings.address || '',
          googleMapsEmbedUrl: data.settings.googleMapsEmbedUrl || '',
          googleMapsLink: data.settings.googleMapsLink || '',
          parkingInfo: data.settings.parkingInfo || '',
          accentColor: data.settings.accentColor || '#d4f933',
          freeTrialEnabled: data.settings.freeTrialEnabled !== undefined ? Boolean(data.settings.freeTrialEnabled) : true,
          instagramUrl: data.settings.instagramUrl || '',
          youtubeUrl: data.settings.youtubeUrl || '',
          facebookUrl: data.settings.facebookUrl || '',
          aboutText: data.settings.aboutText || '',
          footerText: data.settings.footerText || '',
        });

        try {
          const parsed = JSON.parse(data.settings.openingHours || '[]');
          if (Array.isArray(parsed) && parsed.length > 0) setHoursList(parsed);
        } catch {}
      }
    } catch {
      toast('Failed to load business settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const addHourRow = () => {
    setHoursList([...hoursList, { days: '', hours: '' }]);
  };

  const removeHourRow = (index: number) => {
    setHoursList(hoursList.filter((_, idx) => idx !== index));
  };

  const updateHourRow = (index: number, field: 'days' | 'hours', val: string) => {
    const updated = [...hoursList];
    updated[index][field] = val;
    setHoursList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          openingHours: hoursList,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      toast('Business settings updated successfully', 'success');
    } catch (err: any) {
      toast(err.message || 'Error updating settings', 'error');
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
            FACILITY MASTER RECORDS
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            BUSINESS & LOCATION SETTINGS
          </h1>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-xs font-mono text-zinc-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="block text-white mb-0.5">Source of Truth Architecture</strong>
          All public contact details, WhatsApp routing, Google Maps embeds, and operating schedules are dynamically populated from this panel.
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identity */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-6">
            <h3 className="text-xl font-display font-black uppercase text-white tracking-wide pb-4 border-b border-zinc-850">
              01 — BRAND IDENTITY & THEME
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Gym Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.gymName}
                  onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Brand Accent Color Hex
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-32 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-zinc-300 pt-4">
                  <input
                    type="checkbox"
                    checked={formData.freeTrialEnabled}
                    onChange={(e) => setFormData({ ...formData, freeTrialEnabled: e.target.checked })}
                    className="rounded border-zinc-700 bg-zinc-900 text-accent focus:ring-accent"
                  />
                  <span>Enable Free Trial Booking System</span>
                </label>
              </div>
            </div>
          </div>

          {/* Contact & WhatsApp */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-6">
            <h3 className="text-xl font-display font-black uppercase text-white tracking-wide pb-4 border-b border-zinc-850">
              02 — VERIFIED CONTACT CHANNELS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Official Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  placeholder="+919876543210"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Public Email Address
                </label>
                <input
                  type="email"
                  placeholder="contact@shadowfitness.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Location & Google Maps */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-6">
            <h3 className="text-xl font-display font-black uppercase text-white tracking-wide pb-4 border-b border-zinc-850">
              03 — LOCATION & GOOGLE MAPS
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Physical Street Address
              </label>
              <textarea
                rows={2}
                placeholder="Building, street, sector, city, state, postal code..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Google Maps Directions Link
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={formData.googleMapsLink}
                  onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Google Maps Embed Iframe URL
                </label>
                <input
                  type="text"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={formData.googleMapsEmbedUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsEmbedUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Parking & Transit Details
              </label>
              <input
                type="text"
                placeholder="e.g. Dedicated valet & member parking lot available behind building."
                value={formData.parkingInfo}
                onChange={(e) => setFormData({ ...formData, parkingInfo: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Operating Hours */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-850">
              <h3 className="text-xl font-display font-black uppercase text-white tracking-wide">
                04 — OPERATING HOURS SCHEDULE
              </h3>
              <button
                type="button"
                onClick={addHourRow}
                className="text-xs font-mono uppercase text-accent hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Time Slot</span>
              </button>
            </div>

            <div className="space-y-3">
              {hoursList.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="e.g. Monday - Friday"
                    value={slot.days}
                    onChange={(e) => updateHourRow(idx, 'days', e.target.value)}
                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    placeholder="e.g. 05:30 AM - 10:30 PM"
                    value={slot.hours}
                    onChange={(e) => updateHourRow(idx, 'hours', e.target.value)}
                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => removeHourRow(idx)}
                    className="p-2 rounded bg-zinc-900 text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-6">
            <h3 className="text-xl font-display font-black uppercase text-white tracking-wide pb-4 border-b border-zinc-850">
              05 — SOCIAL MEDIA PRESENCE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Instagram Profile Link
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  YouTube Channel Link
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Facebook Page Link
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(212,249,51,0.25)] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING SETTINGS...' : 'SAVE ALL BUSINESS SETTINGS'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
