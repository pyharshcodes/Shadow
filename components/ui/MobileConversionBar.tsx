'use client';

import React from 'react';
import { Phone, MessageSquare, Flame } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';
import Link from 'next/link';

interface MobileConversionBarProps {
  phone?: string | null;
  whatsappNumber?: string | null;
  onOpenEnquiry?: () => void;
}

export function MobileConversionBar({
  phone,
  whatsappNumber,
  onOpenEnquiry,
}: MobileConversionBarProps) {
  const whatsappUrl = generateWhatsAppUrl(
    whatsappNumber,
    'Hi SHADOW FITNESS, I would like to book a free trial / visit the gym.'
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 p-2.5 px-4 flex items-center justify-between gap-2 shadow-[0_-8px_25px_rgba(0,0,0,0.8)]">
      {/* 1. Phone Call */}
      {phone ? (
        <a
          href={`tel:${phone}`}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:bg-zinc-800 transition-colors"
        >
          <Phone className="w-4 h-4 mb-1 text-zinc-400" />
          <span className="text-xs font-mono tracking-wider uppercase font-bold">CALL</span>
        </a>
      ) : (
        <button
          onClick={onOpenEnquiry}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:bg-zinc-800 transition-colors"
        >
          <Phone className="w-4 h-4 mb-1 text-zinc-400" />
          <span className="text-xs font-mono tracking-wider uppercase font-bold">CONTACT</span>
        </button>
      )}

      {/* 2. WhatsApp */}
      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] active:bg-[#25D366]/25 transition-colors"
        >
          <MessageSquare className="w-4 h-4 mb-1 fill-[#25D366]" />
          <span className="text-xs font-mono tracking-wider uppercase font-bold">WHATSAPP</span>
        </a>
      ) : null}

      {/* 3. Primary CTA: Join / Book Trial */}
      <Link
        href="#free-trial"
        className="flex-[1.4] flex items-center justify-center gap-1.5 py-3 px-3 rounded-lg bg-accent text-zinc-950 font-display font-black text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(212,249,51,0.3)] active:scale-95 transition-all"
      >
        <Flame className="w-4 h-4 fill-zinc-950" />
        <span>FREE TRIAL</span>
      </Link>
    </div>
  );
}
