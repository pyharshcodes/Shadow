'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminFacilitiesPage() {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    tag: 'Strength Zone',
    description: '',
    specsText: '',
    imageUrl: '',
    isPublished: true,
  });

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/facilities?all=true');
      const data = await res.json();
      if (data.facilities) setFacilities(data.facilities);
    } catch {
      toast('Failed to load facilities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      tag: 'Strength Zone',
      description: 'Engineered for barbell compound lifts and heavy pulling.',
      specsText: 'Olympic Platforms\nPower Cages\nSpecialty Barbells\nCompetition Bumpers',
      imageUrl: '',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    let parsedSpecs: string[] = [];
    try {
      parsedSpecs = JSON.parse(item.specs || '[]');
    } catch {
      parsedSpecs = [];
    }

    setFormData({
      name: item.name || '',
      tag: item.tag || 'Zone',
      description: item.description || '',
      specsText: parsedSpecs.join('\n'),
      imageUrl: item.imageUrl || '',
      isPublished: Boolean(item.isPublished),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const specs = formData.specsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const url = editingItem
        ? `/api/facilities/${editingItem.id}`
        : '/api/facilities';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          specs: JSON.stringify(specs),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save facility zone');

      toast(editingItem ? 'Facility zone updated' : 'Facility zone created', 'success');
      setModalOpen(false);
      fetchFacilities();
    } catch (err: any) {
      toast(err.message || 'Error saving facility', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this facility zone?')) return;
    try {
      const res = await fetch(`/api/facilities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Zone removed', 'info');
        setFacilities((prev) => prev.filter((f) => f.id !== id));
      }
    } catch {
      toast('Error deleting facility', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            FACILITY ARCHITECTURE
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            FACILITIES & ZONES CMS
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>ADD FACILITY ZONE</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading facility zones...
        </div>
      ) : facilities.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No facility zones configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((fac) => {
            let specs: string[] = [];
            try {
              specs = JSON.parse(fac.specs || '[]');
            } catch {
              specs = [];
            }

            return (
              <div
                key={fac.id}
                className="rounded-2xl bg-zinc-950 border border-zinc-850 p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-accent uppercase font-bold">
                      {fac.tag}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(fac)}
                        className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fac.id)}
                        className="p-1.5 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide mb-2">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                    {fac.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 border-t border-zinc-900 pt-3">
                    {specs.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'EDIT FACILITY ZONE' : 'ADD FACILITY ZONE'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Zone / Area Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Olympic Barbell Compound"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Category Tag
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              placeholder="e.g. Strength Zone, Functional Turf, Recovery"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Zone architecture, equipment layout, and purpose..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Equipment Specs / Highlights (1 per line)
            </label>
            <textarea
              rows={3}
              value={formData.specsText}
              onChange={(e) => setFormData({ ...formData, specsText: e.target.value })}
              placeholder="Olympic Platforms&#10;Power Cages&#10;Bumper Plates"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <ImageUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label="Zone Photograph"
          />

          <button
            type="submit"
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
          >
            {editingItem ? 'UPDATE ZONE' : 'SAVE ZONE'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
