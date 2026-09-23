'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, CreditCard, Check } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

export default function AdminMembershipsPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    duration: '1 Month',
    featuresText: '',
    highlightBadge: '',
    isPopular: false,
    personalTrainingIncluded: false,
    isPublished: true,
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/memberships?all=true');
      const data = await res.json();
      if (data.memberships) setPlans(data.memberships);
    } catch {
      toast('Failed to load membership plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      slug: '',
      price: '₹2,500 / mo',
      duration: '1 Month',
      featuresText: 'Full floor & locker access\nStandard equipment usage\nFree initial movement assessment',
      highlightBadge: '',
      isPopular: false,
      personalTrainingIncluded: false,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (plan: any) => {
    setEditingPlan(plan);
    let parsedFeatures: string[] = [];
    try {
      parsedFeatures = JSON.parse(plan.features || '[]');
    } catch {
      parsedFeatures = [];
    }

    setFormData({
      name: plan.name || '',
      slug: plan.slug || '',
      price: plan.price || '',
      duration: plan.duration || '1 Month',
      featuresText: parsedFeatures.join('\n'),
      highlightBadge: plan.highlightBadge || '',
      isPopular: Boolean(plan.isPopular),
      personalTrainingIncluded: Boolean(plan.personalTrainingIncluded),
      isPublished: Boolean(plan.isPublished),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const features = formData.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const url = editingPlan
        ? `/api/memberships/${editingPlan.id}`
        : '/api/memberships';
      const method = editingPlan ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: JSON.stringify(features),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save plan');

      toast(editingPlan ? 'Plan updated' : 'Plan created', 'success');
      setModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      toast(err.message || 'Error saving membership plan', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership plan?')) return;
    try {
      const res = await fetch(`/api/memberships/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Plan deleted', 'info');
        setPlans((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      toast('Failed to delete plan', 'error');
    }
  };

  const handleTogglePublish = async (plan: any) => {
    try {
      const res = await fetch(`/api/memberships/${plan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !plan.isPublished }),
      });
      if (res.ok) {
        toast(plan.isPublished ? 'Plan unpublished' : 'Plan published', 'info');
        setPlans((prev) =>
          prev.map((p) => (p.id === plan.id ? { ...p, isPublished: !plan.isPublished } : p))
        );
      }
    } catch {
      toast('Failed to toggle publish status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            TIER ENGINE
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            MEMBERSHIP CMS
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE MEMBERSHIP PLAN</span>
        </button>
      </div>

      {/* Plans List */}
      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading membership plans...
        </div>
      ) : plans.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No membership plans configured. Click "Create Membership Plan" to set up your gym offerings.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            let features: string[] = [];
            try {
              features = JSON.parse(plan.features || '[]');
            } catch {
              features = [];
            }

            return (
              <div
                key={plan.id}
                className="rounded-2xl bg-zinc-950 border border-zinc-850 p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-zinc-400 uppercase">
                      {plan.duration}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePublish(plan)}
                        className={`p-1.5 rounded text-xs transition-colors ${
                          plan.isPublished ? 'text-emerald-400 hover:text-emerald-300' : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                        title={plan.isPublished ? 'Live' : 'Hidden'}
                      >
                        {plan.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(plan)}
                        className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-1.5 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide">
                    {plan.name}
                  </h3>
                  <p className="text-2xl font-display font-black text-accent mt-1 mb-4">
                    {plan.price}
                  </p>

                  <ul className="space-y-2 border-t border-zinc-900 pt-4 text-xs font-sans text-zinc-400">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-zinc-900">
                  <span>{plan.highlightBadge || 'No badge'}</span>
                  <span className={plan.isPublished ? 'text-emerald-500' : 'text-amber-500'}>
                    {plan.isPublished ? 'LIVE' : 'DRAFT'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlan ? 'EDIT MEMBERSHIP PLAN' : 'CREATE MEMBERSHIP PLAN'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Quarterly Commitment"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Duration *
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 3 Months"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Price Display *
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. ₹6,500 / 3 mo or Contact Reception"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Highlight Badge (Optional)
              </label>
              <input
                type="text"
                value={formData.highlightBadge}
                onChange={(e) => setFormData({ ...formData, highlightBadge: e.target.value })}
                placeholder="e.g. Most Popular, Best Value"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Features Checklist (1 per line)
            </label>
            <textarea
              rows={4}
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              placeholder="Full facility access&#10;Locker & shower facilities&#10;Complimentary assessment"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-900 text-accent focus:ring-accent"
              />
              <span>Highlight Card as "Most Popular" (Accent Border & Glow)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
              <input
                type="checkbox"
                checked={formData.personalTrainingIncluded}
                onChange={(e) => setFormData({ ...formData, personalTrainingIncluded: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-900 text-accent focus:ring-accent"
              />
              <span>Personal Training Included</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-900 text-accent focus:ring-accent"
              />
              <span>Published (Visible on site)</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
          >
            {editingPlan ? 'UPDATE MEMBERSHIP PLAN' : 'CREATE MEMBERSHIP PLAN'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
