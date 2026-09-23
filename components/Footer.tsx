'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Phone, Clock, Shield, Lock } from 'lucide-react';

interface FooterProps {
  gymName?: string;
  tagline?: string;
  phone?: string | null;
  whatsappNumber?: string | null;
  email?: string | null;
  address?: string | null;
  googleMapsLink?: string | null;
  openingHours?: string;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  footerText?: string | null;
}

export function Footer({
  gymName = 'SHADOW FITNESS',
  tagline = 'DISCIPLINE OVER MOTIVATION.',
  phone,
  whatsappNumber,
  email,
  address,
  googleMapsLink,
  openingHours,
  instagramUrl,
  youtubeUrl,
  facebookUrl,
  footerText,
}: FooterProps) {
  let parsedHours: { days: string; hours: string }[] = [];
  try {
    parsedHours = JSON.parse(openingHours || '[]');
  } catch {
    parsedHours = [];
  }

  return (
    <footer className="bg-zinc-950 border-t border-zinc-850 pt-16 pb-24 md:pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-zinc-900">
          {/* Brand Manifesto Col */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group py-1">
              <img
                src="/images/brand/logo_white.png"
                alt="SHADOW FITNESS"
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
            <p className="font-display text-lg font-bold tracking-normal text-zinc-300">
              {tagline}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-sm">
              {footerText || 'Engineered for those who respect the process. Serious training, authentic community, and relentless progression.'}
            </p>

            {/* Social Links (only display if configured) */}
            {(instagramUrl || youtubeUrl || facebookUrl) && (
              <div className="flex items-center gap-3 pt-2">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-accent transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-accent transition-colors"
                  >
                    YouTube
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-accent transition-colors"
                  >
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold">
              Directory
            </h5>
            <ul className="space-y-3 text-xs font-mono">
              <li>
                <Link href="/" className="inline-block py-1 text-zinc-400 hover:text-accent transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="inline-block py-1 text-zinc-400 hover:text-accent transition-colors">About Club</Link>
              </li>
              <li>
                <Link href="/programs" className="inline-block py-1 text-zinc-400 hover:text-accent transition-colors">Programs</Link>
              </li>
              <li>
                <Link href="/trainers" className="inline-block py-1 text-zinc-400 hover:text-accent transition-colors">Coaches</Link>
              </li>
              <li>
                <Link href="/membership" className="inline-block py-1 text-zinc-400 hover:text-accent transition-colors">Memberships</Link>
              </li>
              <li>
                <Link href="/gallery" className="inline-block py-1 text-zinc-400 hover:text-accent transition-colors">Gallery</Link>
              </li>
              <li>
                <Link href="/admin/login" className="inline-flex items-center gap-1.5 py-1 text-accent hover:underline transition-colors font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>Training Hours</span>
            </h5>
            {parsedHours.length > 0 ? (
              <div className="space-y-2 text-xs font-mono">
                {parsedHours.map((slot, i) => (
                  <div key={i} className="flex flex-col border-b border-zinc-900 pb-1.5">
                    <span className="text-zinc-400">{slot.days}</span>
                    <span className="text-white font-medium">{slot.hours}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">
                Operating hours available upon inquiry or configured in Admin.
              </p>
            )}
          </div>

          {/* Location & Contact Info */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>Facility Location</span>
            </h5>
            {address ? (
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{address}</p>
            ) : (
              <p className="text-xs text-zinc-500 font-mono">
                Location configurable in Admin Settings.
              </p>
            )}

            {googleMapsLink && (
              <div>
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            )}

            {phone && (
              <div className="pt-2 text-xs font-mono text-zinc-300">
                <span className="text-zinc-500 block">Phone</span>
                <a href={`tel:${phone}`} className="hover:text-accent transition-colors">
                  {phone}
                </a>
              </div>
            )}

            {email && (
              <div className="text-xs font-mono text-zinc-300">
                <span className="text-zinc-500 block">Email</span>
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors">
                  {email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar with Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <p>© {new Date().getFullYear()} {gymName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-zinc-200 transition-colors">
              Contact Us
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-750 text-zinc-300 hover:text-accent hover:border-accent transition-all shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-accent" />
              <span>Admin Portal / Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
