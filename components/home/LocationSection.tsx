'use client';

import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Car, Navigation, ArrowUpRight } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

interface LocationSectionProps {
  gymName?: string;
  address?: string | null;
  googleMapsEmbedUrl?: string | null;
  googleMapsLink?: string | null;
  phone?: string | null;
  whatsappNumber?: string | null;
  openingHours?: string;
  parkingInfo?: string | null;
  onOpenEnquiry?: () => void;
}

export function LocationSection({
  gymName = 'SHADOW FITNESS',
  address,
  googleMapsEmbedUrl,
  googleMapsLink,
  phone,
  whatsappNumber,
  openingHours,
  parkingInfo,
  onOpenEnquiry,
}: LocationSectionProps) {
  let parsedHours: { days: string; hours: string }[] = [];
  try {
    parsedHours = JSON.parse(openingHours || '[]');
  } catch {
    parsedHours = [];
  }

  const whatsappUrl = generateWhatsAppUrl(
    whatsappNumber,
    'Hi SHADOW FITNESS, I would like directions / visiting information.'
  );

  return (
    <section id="location" className="py-24 sm:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-ultra-wide uppercase text-accent font-bold block mb-3">
            ACCESSIBILITY & VISIT
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight uppercase text-white leading-none">
            FIND SHADOW FITNESS
          </h2>
          <p className="mt-4 text-zinc-400 text-base sm:text-lg font-sans">
            Visit our training grounds. We welcome serious lifters and individuals ready to commit to their physical transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Address & Directions Card */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
              <div className="flex items-center gap-2 text-accent">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-mono tracking-wider uppercase font-bold">
                  FACILITY ADDRESS
                </span>
              </div>
              <h3 className="text-2xl font-display font-black uppercase text-white tracking-wide">
                {gymName}
              </h3>
              {address ? (
                <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                  {address}
                </p>
              ) : (
                <p className="text-sm text-zinc-500 font-mono italic">
                  Exact address configurable in Admin Dashboard.
                </p>
              )}

              {/* Action Buttons: Directions & Map */}
              <div className="pt-2 flex flex-wrap gap-3">
                {googleMapsLink && (
                  <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-zinc-950 font-display font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(212,249,51,0.2)] hover:bg-accent-hover transition-all"
                  >
                    <Navigation className="w-4 h-4 fill-zinc-950" />
                    <span>GET DIRECTIONS</span>
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono text-xs uppercase tracking-wider hover:border-zinc-600 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-accent" />
                    <span>CALL US</span>
                  </a>
                )}

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-mono text-xs uppercase tracking-wider hover:bg-[#25D366]/25 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-[#25D366]" />
                    <span>WHATSAPP</span>
                  </a>
                )}
              </div>
            </div>

            {/* Operating Hours & Parking Card */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-accent mb-3">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-mono tracking-wider uppercase font-bold">
                    OPERATING TIMINGS
                  </span>
                </div>
                {parsedHours.length > 0 ? (
                  <div className="space-y-2 text-xs font-mono">
                    {parsedHours.map((slot, i) => (
                      <div key={i} className="flex justify-between border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-400">{slot.days}</span>
                        <span className="text-white font-bold">{slot.hours}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 font-mono">
                    Timings to be updated in admin settings.
                  </p>
                )}
              </div>

              {parkingInfo && (
                <div className="pt-2 border-t border-zinc-900 flex items-start gap-2.5 text-xs text-zinc-400 font-sans">
                  <Car className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{parkingInfo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Embed or Interactive Map Stage */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[380px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative shadow-2xl">
              {googleMapsEmbedUrl ? (
                <iframe
                  title="Shadow Fitness Location"
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0 grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-700 min-h-[420px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center p-8 text-center bg-zinc-900/60 relative">
                  <div className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-accent mb-4">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-display uppercase tracking-wider text-white font-bold mb-2">
                    GOOGLE MAPS INTEGRATION
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
                    Paste the gym's Google Maps Embed URL or Place ID in the <strong className="text-white">Admin Settings &gt; Business Settings</strong> to display an interactive live map view here.
                  </p>
                  {googleMapsLink && (
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase tracking-wider border border-zinc-650"
                    >
                      <span>Open Provided Link</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
