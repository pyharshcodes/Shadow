'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Flame,
  CreditCard,
  Dumbbell,
  UserCheck,
  Award,
  Image as ImageIcon,
  Building2,
  MessageSquareQuote,
  Tag,
  Sliders,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Leads & Enquiries', href: '/admin/leads', icon: Users },
  { name: 'Trial Requests', href: '/admin/trials', icon: Flame },
  { name: 'Memberships', href: '/admin/memberships', icon: CreditCard },
  { name: 'Programs', href: '/admin/programs', icon: Dumbbell },
  { name: 'Trainers & Coaches', href: '/admin/trainers', icon: UserCheck },
  { name: 'Transformations', href: '/admin/transformations', icon: Award },
  { name: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Facility & Zones', href: '/admin/facilities', icon: Building2 },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { name: 'Offers & Promos', href: '/admin/offers', icon: Tag },
  { name: 'Homepage CMS', href: '/admin/homepage', icon: Sliders },
  { name: 'Business Settings', href: '/admin/settings', icon: Settings },
];

export function AdminNav({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden bg-zinc-950 border-b border-zinc-850 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-accent text-zinc-950 flex items-center justify-center font-display font-black text-sm">
            S
          </div>
          <span className="font-display font-black uppercase text-lg text-white">
            SHADOW ADMIN
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-zinc-950 border-r border-zinc-850 flex flex-col justify-between shrink-0 z-30 sticky top-0 md:h-screen overflow-y-auto`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-zinc-850 hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-accent text-zinc-950 flex items-center justify-center font-display font-black text-base shadow-[0_0_12px_rgba(212,249,51,0.3)]">
              S
            </div>
            <div>
              <h2 className="font-display font-black tracking-wider uppercase text-white leading-none">
                SHADOW FITNESS
              </h2>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                CMS CONTROL PANEL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-accent/15 text-accent font-bold border border-accent/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-zinc-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer & External Link */}
        <div className="p-4 border-t border-zinc-850 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="pt-2 px-1 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace Container */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
