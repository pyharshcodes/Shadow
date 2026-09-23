'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

export default function AdminOffersPage() {
  const { toast } = useToast();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountBadge: 'Summer Strength',
    originalPrice: '',
    discountedPrice: '',
    ctaText: 'CLAIM OFFER',
    isActive: true,
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/offers?all=true');
      const data = await res.json();
      if (data.offers) setOffers(data.offers);
    } catch {
      toast('Failed to load offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save offer');

      toast('Offer created', 'success');
      setModalOpen(false);
      setFormData({
        title: '',
        description: '',
        discountBadge: '',
        originalPrice: '',
        discountedPrice: '',
        ctaText: 'CLAIM OFFER',
        isActive: true,
      });
      fetchOffers();
    } catch (err: any) {
      toast(err.message || 'Error saving offer', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promotional offer?')) return;
    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Offer deleted', 'info');
        setOffers((prev) => prev.filter((o) => o.id !== id));
      }
    } catch {
      toast('Error deleting offer', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            PROMOTIONAL CAMPAIGNS
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            OFFERS & PROMOTIONS CMS
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW OFFER</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading active campaigns...
        </div>
      ) : offers.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No promotional campaigns currently active. Create an offer to display seasonal perks or limited-period enrollment passes.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((off) => (
            <div
              key={off.id}
              className="rounded-2xl bg-zinc-950 border border-zinc-850 p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {off.discountBadge && (
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-accent/20 border border-accent/40 text-accent uppercase font-bold">
                      {off.discountBadge}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(off.id)}
                    className="p-1.5 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide mb-2">
                  {off.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  {off.description}
                </p>

                {(off.discountedPrice || off.originalPrice) && (
                  <div className="flex items-baseline gap-2 pt-2 border-t border-zinc-900">
                    {off.discountedPrice && (
                      <span className="text-2xl font-display font-black text-accent">
                        {off.discountedPrice}
                      </span>
                    )}
                    {off.originalPrice && (
                      <span className="text-xs font-mono text-zinc-500 line-through">
                        {off.originalPrice}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="CREATE PROMOTIONAL OFFER"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Campaign Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 3-Month Summer Strength Pass"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Campaign Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Special terms, inclusion details, and validity..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Discount Tag / Badge
              </label>
              <input
                type="text"
                value={formData.discountBadge}
                onChange={(e) => setFormData({ ...formData, discountBadge: e.target.value })}
                placeholder="e.g. Save 20%, Early Bird"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="CLAIM OFFER"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Promo Price (Optional)
              </label>
              <input
                type="text"
                value={formData.discountedPrice}
                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                placeholder="e.g. ₹5,500"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Standard Price (Optional)
              </label>
              <input
                type="text"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="e.g. ₹7,500"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
          >
            ACTIVATE OFFER
          </button>
        </form>
      </Modal>
    </div>
  );
}
