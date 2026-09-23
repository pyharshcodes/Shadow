'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Star, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

export default function AdminTestimonialsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    authorName: '',
    rating: 5,
    reviewText: '',
    reviewDate: 'Recent',
    source: 'Google Review',
    isPublished: true,
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials?all=true');
      const data = await res.json();
      if (data.testimonials) setReviews(data.testimonials);
    } catch {
      toast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add review');

      toast('Verified review added', 'success');
      setModalOpen(false);
      setFormData({
        authorName: '',
        rating: 5,
        reviewText: '',
        reviewDate: 'Recent',
        source: 'Google Review',
        isPublished: true,
      });
      fetchReviews();
    } catch (err: any) {
      toast(err.message || 'Error saving review', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Review deleted', 'info');
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      toast('Error deleting review', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            VERIFIED SOCIAL PROOF
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            TESTIMONIALS & REVIEWS CMS
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>ADD VERIFIED REVIEW</span>
        </button>
      </div>

      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
        <span>
          Policy: Only enter genuine reviews received from Google Maps or direct member feedback.
        </span>
      </div>

      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No reviews entered yet. Click "Add Verified Review" to record member feedback.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl bg-zinc-950 border border-zinc-850 p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-zinc-300 font-sans italic mb-4">
                  "{r.reviewText}"
                </p>

                <div className="border-t border-zinc-900 pt-3 flex items-center justify-between">
                  <span className="font-display font-bold uppercase text-white text-base">
                    {r.authorName}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {r.source || 'Verified'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="ADD VERIFIED REVIEW"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Member Name *
            </label>
            <input
              type="text"
              required
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Rating (1 - 5)
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Review Source
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="e.g. Google Review, Member Survey"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Review Quote *
            </label>
            <textarea
              rows={4}
              required
              value={formData.reviewText}
              onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
              placeholder="The authentic words of the member..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
          >
            SAVE REVIEW
          </button>
        </form>
      </Modal>
    </div>
  );
}
