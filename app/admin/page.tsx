import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  Users,
  Flame,
  CreditCard,
  Dumbbell,
  UserCheck,
  Award,
  Image as ImageIcon,
  Clock,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const [
    totalLeads,
    newLeads,
    totalTrials,
    newTrials,
    totalPrograms,
    totalMemberships,
    totalTrainers,
    totalTransformations,
    totalGallery,
    recentLeads,
    recentTrials,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.trialRequest.count(),
    prisma.trialRequest.count({ where: { status: 'new' } }),
    prisma.program.count({ where: { isPublished: true } }),
    prisma.membership.count({ where: { isPublished: true } }),
    prisma.trainer.count({ where: { isPublished: true } }),
    prisma.transformation.count({ where: { isPublished: true } }),
    prisma.galleryImage.count({ where: { isPublished: true } }),
    prisma.lead.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.trialRequest.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="space-y-10">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
            OPERATIONS DESK
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-wide">
            COMMAND OVERVIEW
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="px-4 py-2.5 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-1.5"
          >
            <span>VIEW ALL LEADS</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Inquiries */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-display font-black text-white">{totalLeads}</span>
            {newLeads > 0 && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                {newLeads} new
              </span>
            )}
          </div>
        </div>

        {/* Free Trials */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Trial Requests</span>
            <Flame className="w-4 h-4 text-accent" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-display font-black text-white">{totalTrials}</span>
            {newTrials > 0 && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                {newTrials} pending
              </span>
            )}
          </div>
        </div>

        {/* Active Programs */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Live Programs</span>
            <Dumbbell className="w-4 h-4 text-accent" />
          </div>
          <span className="text-4xl font-display font-black text-white">{totalPrograms}</span>
        </div>

        {/* Membership Plans */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Published Plans</span>
            <CreditCard className="w-4 h-4 text-accent" />
          </div>
          <span className="text-4xl font-display font-black text-white">{totalMemberships}</span>
        </div>
      </div>

      {/* Two-Column Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
            <h3 className="font-display font-bold uppercase text-lg text-white tracking-wide">
              Recent General & Membership Enquiries
            </h3>
            <Link
              href="/admin/leads"
              className="text-xs font-mono text-accent hover:underline uppercase"
            >
              See All ({totalLeads})
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center font-mono">
              No inquiries recorded yet. Test submissions from the public site will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-850 flex items-center justify-between gap-4"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold uppercase text-white truncate">
                        {lead.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                        {lead.type}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400 mt-0.5">
                      {lead.phone} {lead.interestedPlan ? `• ${lead.interestedPlan}` : ''}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-1 rounded uppercase font-bold shrink-0 ${
                      lead.status === 'new'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Trial Bookings */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
            <h3 className="font-display font-bold uppercase text-lg text-white tracking-wide">
              Recent Free Trial Requests
            </h3>
            <Link
              href="/admin/trials"
              className="text-xs font-mono text-accent hover:underline uppercase"
            >
              See All ({totalTrials})
            </Link>
          </div>

          {recentTrials.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center font-mono">
              No trial requests submitted yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentTrials.map((trial) => (
                <div
                  key={trial.id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-850 flex items-center justify-between gap-4"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold uppercase text-white truncate">
                        {trial.name}
                      </span>
                      {trial.fitnessGoal && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-accent uppercase">
                          {trial.fitnessGoal}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-zinc-400 mt-0.5">
                      {trial.phone} • {trial.preferredDate || 'Date open'} ({trial.preferredTime || 'Time open'})
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-1 rounded uppercase font-bold shrink-0 ${
                      trial.status === 'new'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {trial.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
