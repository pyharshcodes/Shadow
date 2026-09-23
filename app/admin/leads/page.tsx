'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  MessageSquare,
  Phone,
  Trash2,
  CheckCircle,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { generateWhatsAppUrl, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function AdminLeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (search) params.set('q', search);

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
        // Initialize editing notes map
        const notesMap: any = {};
        data.leads.forEach((l: any) => {
          notesMap[l.id] = l.notes || '';
        });
        setEditingNotes(notesMap);
      }
    } catch {
      toast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast(`Lead status changed to ${newStatus}`, 'success');
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
      }
    } catch {
      toast('Error updating status', 'error');
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editingNotes[id] }),
      });
      if (res.ok) {
        toast('Internal notes updated', 'success');
      }
    } catch {
      toast('Error updating notes', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Lead removed', 'info');
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch {
      toast('Failed to delete lead', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            CLIENT ACQUISITION
          </span>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-wide">
            LEADS & INQUIRY CRM
          </h1>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Total Records: <span className="text-white font-bold">{leads.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
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

        {/* Status and Type Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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
              <option value="follow-up">Follow-Up</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="membership">Membership</option>
              <option value="program">Program</option>
              <option value="trainer">Personal Trainer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="p-16 text-center text-zinc-500 font-mono text-xs">
          Loading CRM records...
        </div>
      ) : leads.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950 border border-dashed border-zinc-850 text-zinc-500 font-mono text-xs">
          No leads matching the selected filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const whatsappMsg = `Hi ${lead.name}, this is SHADOW FITNESS regarding your ${lead.type} enquiry. How can we assist with your training goals?`;
            const whatsappUrl = generateWhatsAppUrl(lead.phone, whatsappMsg);

            return (
              <div
                key={lead.id}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition-colors flex flex-col lg:flex-row justify-between gap-6"
              >
                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display font-black text-xl uppercase text-white tracking-wide">
                      {lead.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-accent uppercase font-bold">
                      {lead.type}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-white">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      {lead.phone}
                    </span>
                    {lead.email && <span>{lead.email}</span>}
                    {lead.interestedPlan && (
                      <span className="text-accent font-semibold">
                        Plan: {lead.interestedPlan}
                      </span>
                    )}
                    {lead.fitnessGoal && (
                      <span>Goal: {lead.fitnessGoal}</span>
                    )}
                  </div>

                  {lead.message && (
                    <p className="text-xs text-zinc-300 font-sans bg-zinc-900/60 p-3 rounded-lg border border-zinc-850 italic mt-2">
                      "{lead.message}"
                    </p>
                  )}

                  {/* Notes Field */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add internal staff notes..."
                      value={editingNotes[lead.id] ?? ''}
                      onChange={(e) =>
                        setEditingNotes({ ...editingNotes, [lead.id]: e.target.value })
                      }
                      className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 font-mono w-full max-w-md focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={() => handleSaveNotes(lead.id)}
                      className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Right Actions: Status Selector & WhatsApp */}
                <div className="flex flex-row lg:flex-col items-end justify-between lg:justify-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Status:</span>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold focus:outline-none border ${
                        lead.status === 'new'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : lead.status === 'converted'
                          ? 'bg-accent/20 text-accent border-accent/40'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="follow-up">Follow-up</option>
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
                      onClick={() => handleDelete(lead.id)}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                      title="Delete lead"
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
