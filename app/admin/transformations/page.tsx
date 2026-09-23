'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Award, ShieldCheck, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminTransformationsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    beforeImage: '',
    afterImage: '',
    duration: '16 Weeks',
    goal: 'Hypertrophy & Body Recomposition',
    story: '',
    consentConfirmed: false,
    isPublished: false,
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transformations?all=true');
      const data = await res.json();
      if (data.transformations) setItems(data.transformations);
    } catch {
      toast('Failed to load transformations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      beforeImage: '',
      afterImage: '',
      duration: '12 Weeks',
      goal: 'Strength & Body Recomp',
      story: 'Consistent progressive overload with strict adherence to sleep and recovery.',
      consentConfirmed: false,
      isPublished: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingItem(t);
    setFormData({
      name: t.name || '',
      beforeImage: t.beforeImage || '',
      afterImage: t.afterImage || '',
      duration: t.duration || '',
      goal: t.goal || '',
      story: t.story || '',
      consentConfirmed: Boolean(t.consentConfirmed),
      isPublished: Boolean(t.isPublished),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.isPublished && !formData.consentConfirmed) {
      toast('You must certify member consent before publishing customer results', 'error');
      return;
    }

    try {
      const url = editingItem
        ? `/api/transformations/${editingItem.id}`
        : '/api/transformations';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save transformation');

      toast(editingItem ? 'Transformation updated' : 'Transformation added', 'success');
      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      toast(err.message || 'Error saving transformation', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this transformation record?')) return;
    try {
      const res = await fetch(`/api/transformations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Record deleted', 'info');
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      toast('Error deleting record', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            VERIFIED OUTCOMES
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            TRANSFORMATION CMS
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>ADD REAL TRANSFORMATION</span>
        </button>
      </div>

      {/* Compliance Note */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <div>
          <strong className="block text-amber-300 mb-0.5">Strict Authenticity & Privacy Policy</strong>
          Only upload genuine before/after photos provided by consenting members. Publication requires the explicit consent verification toggle to be activated.
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading transformations...
        </div>
      ) : items.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No transformation records yet. Real member case studies will appear once uploaded and verified here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-zinc-950 border border-zinc-850 p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-accent uppercase font-bold">
                    {item.duration}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden aspect-[16/9] bg-zinc-900 mb-4">
                  <img
                    src={item.beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <img
                    src={item.afterImage}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-display font-black uppercase text-white tracking-wide mb-1">
                  {item.name}
                </h3>
                <p className="text-xs font-mono text-zinc-400 mb-2">
                  Target: {item.goal}
                </p>
                <p className="text-xs text-zinc-300 font-sans italic line-clamp-2">
                  "{item.story}"
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-zinc-900">
                <span className={item.consentConfirmed ? 'text-emerald-400' : 'text-rose-400'}>
                  {item.consentConfirmed ? '✓ Consent Verified' : '⚠ No Consent'}
                </span>
                <span className={item.isPublished ? 'text-emerald-500' : 'text-amber-500'}>
                  {item.isPublished ? 'LIVE' : 'DRAFT'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'EDIT TRANSFORMATION' : 'ADD REAL TRANSFORMATION'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Member Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikram S."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Duration / Timeline *
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 16 Weeks"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Physical Goal / Target
            </label>
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="e.g. Body Recomposition & 100kg Squat Milestone"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Story / Brief Context
            </label>
            <textarea
              rows={3}
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Short testimonial quote or progression commentary..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploader
              value={formData.beforeImage}
              onChange={(url) => setFormData({ ...formData, beforeImage: url })}
              label="Before Photo *"
            />
            <ImageUploader
              value={formData.afterImage}
              onChange={(url) => setFormData({ ...formData, afterImage: url })}
              label="After Photo *"
            />
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-mono text-zinc-200">
              <input
                type="checkbox"
                required
                checked={formData.consentConfirmed}
                onChange={(e) => setFormData({ ...formData, consentConfirmed: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-950 text-accent focus:ring-accent mt-0.5"
              />
              <span>
                I certify that the member has given formal consent to feature their authentic before/after photographs and progress story.
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-950 text-accent focus:ring-accent"
              />
              <span>Publish to live website</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
          >
            {editingItem ? 'UPDATE TRANSFORMATION' : 'SAVE TRANSFORMATION'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
