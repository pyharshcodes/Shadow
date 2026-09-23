'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Flame, Lock } from 'lucide-react';

interface NavbarProps {
  gymName?: string;
  freeTrialEnabled?: boolean;
  onOpenTrial?: () => void;
}

export function Navbar({ gymName = 'SHADOW FITNESS', freeTrialEnabled = true, onOpenTrial }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Programs', href: '/programs' },
    { name: 'Membership', href: '/membership' },
    { name: 'Facility', href: '/#facilities' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 py-3.5 shadow-2xl'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3 py-0.5">
          <img
            src="/images/brand/logo_white.png"
            alt="SHADOW FITNESS"
            className="h-9 sm:h-11 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Nav - Streamlined 5 Key Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-mono uppercase tracking-widest text-zinc-300 hover:text-white transition-colors relative py-1.5 hover:border-b-2 hover:border-accent"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/admin/login"
            className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-accent transition-colors py-2 px-2.5 flex items-center gap-1.5 rounded-lg border border-transparent hover:border-zinc-800"
            title="Admin CMS Portal"
          >
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Admin</span>
          </Link>
          <Link
            href="/contact"
            className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors py-2 px-3"
          >
            Find Us
          </Link>
          {freeTrialEnabled ? (
            <Link
              href="/free-trial"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(212,249,51,0.25)] hover:scale-105 active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>FREE TRIAL</span>
            </Link>
          ) : (
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-zinc-950 font-display font-black text-xs uppercase tracking-wider transition-all duration-200"
            >
              <span>JOIN TODAY</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {freeTrialEnabled && (
            <Link
              href="/free-trial"
              className="px-3.5 py-2 rounded-xl bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider"
            >
              TRIAL
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/98 backdrop-blur-2xl border-b border-zinc-850 px-6 py-6 animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-display uppercase tracking-widest text-zinc-300 hover:text-accent transition-colors py-2 border-b border-zinc-900"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/free-trial"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 rounded bg-accent text-zinc-950 font-display font-black text-sm tracking-wider uppercase"
              >
                BOOK FREE TRIAL PASS
              </Link>
              <Link
                href="/membership"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded bg-zinc-900 border border-zinc-800 text-white font-mono text-xs uppercase tracking-wider"
              >
                EXPLORE MEMBERSHIPS
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-accent font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-1"
              >
                <Lock className="w-3.5 h-3.5 text-accent" />
                <span>Admin Login / CMS</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
