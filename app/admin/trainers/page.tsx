'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, UserCheck, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminTrainersPage() {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    role: 'Head Coach',
    specializations: '',
    experience: '5+ Years',
    certifications: '',
    bio: '',
    photoUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    isPublished: true,
  });

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trainers?all=true');
      const data = await res.json();
      if (data.trainers) setTrainers(data.trainers);
    } catch {
      toast('Failed to load coaches', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const openCreateModal = () => {
    setEditingTrainer(null);
    setFormData({
      name: '',
      slug: '',
      role: 'Strength & Biomechanics Coach',
      specializations: 'Barbell Compound Mastery, Injury Prevention',
      experience: '6 Years Coaching',
      certifications: 'CSCS, ACE Certified Personal Trainer',
      bio: 'Focused on progressive barbell loading, movement analysis, and long-term joint integrity.',
      photoUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingTrainer(t);
    setFormData({
      name: t.name || '',
      slug: t.slug || '',
      role: t.role || '',
      specializations: t.specializations || '',
      experience: t.experience || '',
      certifications: t.certifications || '',
      bio: t.bio || '',
      photoUrl: t.photoUrl || '',
      instagramUrl: t.instagramUrl || '',
      linkedinUrl: t.linkedinUrl || '',
      isPublished: Boolean(t.isPublished),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTrainer
        ? `/api/trainers/${editingTrainer.id}`
        : '/api/trainers';
      const method = editingTrainer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save coach profile');

      toast(editingTrainer ? 'Coach profile updated' : 'Coach profile added', 'success');
      setModalOpen(false);
      fetchTrainers();
    } catch (err: any) {
      toast(err.message || 'Error saving coach', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trainer profile?')) return;
    try {
      const res = await fetch(`/api/trainers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Trainer removed', 'info');
        setTrainers((prev) => prev.filter((t) => t.id !== id));
      }
    } catch {
      toast('Failed to delete trainer', 'error');
    }
  };

  const handleTogglePublish = async (t: any) => {
    try {
      const res = await fetch(`/api/trainers/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !t.isPublished }),
      });
      if (res.ok) {
        toast(t.isPublished ? 'Coach profile hidden' : 'Coach profile published', 'info');
        setTrainers((prev) =>
          prev.map((item) => (item.id === t.id ? { ...item, isPublished: !t.isPublished } : item))
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
            COACHING ROSTER
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            TRAINERS & COACHES CMS
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW COACH</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading coaches...
        </div>
      ) : trainers.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No coaches added yet. Click "Add New Coach" to display your certified training staff.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-zinc-950 border border-zinc-850 p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-accent uppercase font-bold">
                    {t.role}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePublish(t)}
                      className={`p-1.5 rounded text-xs transition-colors ${
                        t.isPublished ? 'text-emerald-400 hover:text-emerald-300' : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                      title={t.isPublished ? 'Live' : 'Hidden'}
                    >
                      {t.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide mb-1">
                  {t.name}
                </h3>
                {t.specializations && (
                  <p className="text-xs font-mono text-zinc-400 mb-3">
                    {t.specializations}
                  </p>
                )}
                {t.bio && (
                  <p className="text-xs text-zinc-400 font-sans line-clamp-3 mb-3">
                    {t.bio}
                  </p>
                )}
                {t.certifications && (
                  <div className="text-[10px] font-mono text-zinc-500 border-t border-zinc-900 pt-2">
                    Certs: {t.certifications}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-zinc-900">
                <span>/{t.slug}</span>
                <span className={t.isPublished ? 'text-emerald-500' : 'text-amber-500'}>
                  {t.isPublished ? 'LIVE' : 'DRAFT'}
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
        title={editingTrainer ? 'EDIT COACH PROFILE' : 'ADD NEW COACH'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Marcus Vance"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Head Strength Coach"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Specializations
              </label>
              <input
                type="text"
                value={formData.specializations}
                onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                placeholder="e.g. Powerlifting, Hypertrophy, Mobility"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 7+ Years Competitive Coaching"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Certifications & Accreditations
            </label>
            <input
              type="text"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              placeholder="e.g. NSCA-CPT, Precision Nutrition Level 1"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Biography & Training Philosophy
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Coach background, athletic credentials, and personal philosophy..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <ImageUploader
            value={formData.photoUrl}
            onChange={(url) => setFormData({ ...formData, photoUrl: url })}
            label="Coach Portrait Photo"
          />

          <div className="pt-2">
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
            {editingTrainer ? 'UPDATE COACH' : 'SAVE COACH'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
