'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminGalleryPage() {
  const { toast } = useToast();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Gym',
    imageUrl: '',
    caption: '',
    isPublished: true,
  });

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery?all=true');
      const data = await res.json();
      if (data.images) setImages(data.images);
    } catch {
      toast('Failed to load gallery', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast('Please upload an image first', 'error');
      return;
    }

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add image');

      toast('Photo added to gallery', 'success');
      setModalOpen(false);
      setFormData({
        title: '',
        category: 'Gym',
        imageUrl: '',
        caption: '',
        isPublished: true,
      });
      fetchImages();
    } catch (err: any) {
      toast(err.message || 'Error adding image', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this photo from gallery?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Photo removed', 'info');
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } catch {
      toast('Failed to delete photo', 'error');
    }
  };

  const handleTogglePublish = async (img: any) => {
    try {
      const res = await fetch(`/api/gallery/${img.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !img.isPublished }),
      });
      if (res.ok) {
        toast(img.isPublished ? 'Photo hidden' : 'Photo published', 'info');
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, isPublished: !img.isPublished } : i))
        );
      }
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            VISUAL MEDIA
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            PHOTO GALLERY CMS
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>UPLOAD NEW PHOTO</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading gallery photos...
        </div>
      ) : images.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No photos in gallery yet. Upload facility and equipment pictures.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-850 group relative flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-accent uppercase font-bold">
                  {img.category}
                </span>

                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(img)}
                    className="p-1.5 rounded bg-black/80 text-white hover:text-accent"
                    title={img.isPublished ? 'Live' : 'Hidden'}
                  >
                    {img.isPublished ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 rounded bg-black/80 text-white hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-display font-bold uppercase text-white truncate text-sm">
                  {img.title}
                </h4>
                {img.caption && (
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-1 mt-0.5">
                    {img.caption}
                  </p>
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
        title="ADD GALLERY PHOTO"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Photo Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Competition Rig at Dusk"
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
              <option value="Gym">Gym Floor</option>
              <option value="Equipment">Equipment</option>
              <option value="Training">Training Action</option>
              <option value="Trainers">Coaches</option>
              <option value="Community">Community</option>
              <option value="Events">Workshops & Events</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Short Caption (Optional)
            </label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="e.g. Calibrated Eleiko plates and knurled power bars."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <ImageUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label="Upload High-Resolution Photo *"
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
            ADD TO GALLERY
          </button>
        </form>
      </Modal>
    </div>
  );
}
