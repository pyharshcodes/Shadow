'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Dumbbell, Check } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminProgramsPage() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Strength',
    description: '',
    targetAudience: '',
    approach: '',
    duration: '',
    schedule: '',
    ctaText: 'ENQUIRE ABOUT THIS PROGRAM',
    imageUrl: '',
    isFeatured: false,
    isPublished: true,
    trainerId: '',
  });

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const [progRes, trainRes] = await Promise.all([
        fetch('/api/programs?all=true'),
        fetch('/api/trainers?all=true'),
      ]);
      const progData = await progRes.json();
      const trainData = await trainRes.json();
      if (progData.programs) setPrograms(progData.programs);
      if (trainData.trainers) setTrainers(trainData.trainers);
    } catch {
      toast('Failed to load programs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const openCreateModal = () => {
    setEditingProgram(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Strength',
      description: '',
      targetAudience: '',
      approach: '',
      duration: '60 min',
      schedule: 'Mon / Wed / Fri',
      ctaText: 'ENQUIRE ABOUT THIS PROGRAM',
      imageUrl: '',
      isFeatured: false,
      isPublished: true,
      trainerId: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (prog: any) => {
    setEditingProgram(prog);
    setFormData({
      title: prog.title || '',
      slug: prog.slug || '',
      category: prog.category || 'Strength',
      description: prog.description || '',
      targetAudience: prog.targetAudience || '',
      approach: prog.approach || '',
      duration: prog.duration || '',
      schedule: prog.schedule || '',
      ctaText: prog.ctaText || 'ENQUIRE ABOUT THIS PROGRAM',
      imageUrl: prog.imageUrl || '',
      isFeatured: Boolean(prog.isFeatured),
      isPublished: Boolean(prog.isPublished),
      trainerId: prog.trainerId || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProgram
        ? `/api/programs/${editingProgram.id}`
        : '/api/programs';
      const method = editingProgram ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save program');

      toast(editingProgram ? 'Program updated' : 'Program created', 'success');
      setModalOpen(false);
      fetchPrograms();
    } catch (err: any) {
      toast(err.message || 'Error saving program', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this program?')) return;
    try {
      const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Program deleted', 'info');
        setPrograms((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      toast('Failed to delete program', 'error');
    }
  };

  const handleTogglePublish = async (prog: any) => {
    try {
      const res = await fetch(`/api/programs/${prog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !prog.isPublished }),
      });
      if (res.ok) {
        toast(prog.isPublished ? 'Program unpublished' : 'Program published', 'info');
        setPrograms((prev) =>
          prev.map((p) => (p.id === prog.id ? { ...p, isPublished: !prog.isPublished } : p))
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
            CURRICULUM ARCHITECTURE
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            PROGRAM CMS
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PROGRAM</span>
        </button>
      </div>

      {/* Program Grid */}
      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading programs...
        </div>
      ) : programs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No programs created yet. Click "Add New Program" to construct your offerings.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="rounded-2xl bg-zinc-950 border border-zinc-850 p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-accent uppercase font-bold">
                    {prog.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePublish(prog)}
                      className={`p-1.5 rounded text-xs transition-colors ${
                        prog.isPublished ? 'text-emerald-400 hover:text-emerald-300' : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                      title={prog.isPublished ? 'Published' : 'Hidden'}
                    >
                      {prog.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(prog)}
                      className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prog.id)}
                      className="p-1.5 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-display font-black uppercase text-white tracking-wide mb-2">
                  {prog.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans line-clamp-3 mb-4">
                  {prog.description}
                </p>

                <div className="text-[11px] font-mono text-zinc-500 space-y-1 border-t border-zinc-900 pt-3">
                  {prog.duration && <div>Duration: <span className="text-zinc-300">{prog.duration}</span></div>}
                  {prog.schedule && <div>Schedule: <span className="text-zinc-300">{prog.schedule}</span></div>}
                  {prog.trainer && <div>Coach: <span className="text-accent">{prog.trainer.name}</span></div>}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-zinc-600">
                <span>Slug: /{prog.slug}</span>
                <span className={prog.isPublished ? 'text-emerald-500' : 'text-amber-500'}>
                  {prog.isPublished ? 'LIVE' : 'DRAFT'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Program Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProgram ? 'EDIT TRAINING PROGRAM' : 'CREATE TRAINING PROGRAM'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Program Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Strength & Conditioning"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              >
                <option value="Strength">Strength</option>
                <option value="Muscle Building">Muscle Building</option>
                <option value="Functional">Functional Movement</option>
                <option value="Personal Training">Personal Training</option>
                <option value="Cardio">Cardio & Conditioning</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the focus, stimulus, and structure..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Session Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 60 - 75 min"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Schedule Slots
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g. Mon / Wed / Fri batches"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Target Audience (Who is it for?)
            </label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="e.g. Intermediate lifters aiming to master barbell compound form."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Methodology / Approach
            </label>
            <textarea
              rows={2}
              value={formData.approach}
              onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
              placeholder="Explain training periodization or biomechanic cueing..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Assign Lead Coach (Optional)
              </label>
              <select
                value={formData.trainerId}
                onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              >
                <option value="">Unassigned</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Image Uploader */}
          <ImageUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label="Hero / Showcase Image"
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-900 text-accent focus:ring-accent"
              />
              <span>Published (Visible on site)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-900 text-accent focus:ring-accent"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
          >
            {editingProgram ? 'UPDATE PROGRAM' : 'CREATE PROGRAM'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
