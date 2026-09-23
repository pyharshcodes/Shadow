'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Search,
  MessageSquare,
  Phone,
  Trash2,
  Calendar,
  Clock,
  Target,
} from 'lucide-react';
import { generateWhatsAppUrl, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function AdminTrialsPage() {
  const { toast } = useToast();
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});

  const fetchTrials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('q', search);

      const res = await fetch(`/api/trials?${params.toString()}`);
      const data = await res.json();
      if (data.trials) {
        setTrials(data.trials);
        const notesMap: any = {};
        data.trials.forEach((t: any) => {
          notesMap[t.id] = t.notes || '';
        });
        setEditingNotes(notesMap);
      }
    } catch {
      toast('Failed to load trial requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrials();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrials();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/trials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast(`Trial booking updated to ${newStatus}`, 'success');
        setTrials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
      }
    } catch {
      toast('Error updating status', 'error');
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/trials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editingNotes[id] }),
      });
      if (res.ok) {
        toast('Staff notes saved', 'success');
      }
    } catch {
      toast('Error saving notes', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trial booking record?')) return;
    try {
      const res = await fetch(`/api/trials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Trial booking removed', 'info');
        setTrials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch {
      toast('Error removing trial', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            GUEST INTAKE PIPELINE
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            FREE TRIAL REQUESTS
          </h1>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Total Bookings: <span className="text-white font-bold">{trials.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-9 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-accent"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-accent"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="visited">Visited</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading guest passes...
        </div>
      ) : trials.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No trial bookings found.
        </div>
      ) : (
        <div className="space-y-4">
          {trials.map((trial) => {
            const whatsappMsg = `Hi ${trial.name}, this is SHADOW FITNESS regarding your free trial pass request. We would love to confirm your visit time. When works best for you?`;
            const whatsappUrl = generateWhatsAppUrl(trial.phone, whatsappMsg);

            return (
              <div
                key={trial.id}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition-colors flex flex-col lg:flex-row justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display font-black text-xl uppercase text-white tracking-wide">
                      {trial.name}
                    </h3>
                    {trial.fitnessGoal && (
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-accent uppercase font-bold">
                        {trial.fitnessGoal}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-zinc-500">
                      Booked on {formatDate(trial.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-white">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      {trial.phone}
                    </span>
                    {trial.preferredDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        Target: {trial.preferredDate}
                      </span>
                    )}
                    {trial.preferredTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        {trial.preferredTime}
                      </span>
                    )}
                  </div>

                  {trial.message && (
                    <p className="text-xs text-zinc-300 font-sans bg-zinc-900/60 p-3 rounded-lg border border-zinc-850 italic mt-2">
                      "{trial.message}"
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add staff notes or schedule confirmation..."
                      value={editingNotes[trial.id] ?? ''}
                      onChange={(e) =>
                        setEditingNotes({ ...editingNotes, [trial.id]: e.target.value })
                      }
                      className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 font-mono w-full max-w-md focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={() => handleSaveNotes(trial.id)}
                      className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-end justify-between lg:justify-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Status:</span>
                    <select
                      value={trial.status}
                      onChange={(e) => handleStatusChange(trial.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold focus:outline-none border ${
                        trial.status === 'new'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : trial.status === 'scheduled'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : trial.status === 'converted'
                          ? 'bg-accent/20 text-accent border-accent/40'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="visited">Visited</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-mono uppercase font-bold hover:bg-[#25D366]/30 flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(trial.id)}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                      title="Delete booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
