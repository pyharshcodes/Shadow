'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

interface WhatsAppButtonProps {
  whatsappNumber?: string | null;
  message?: string;
  label?: string;
  className?: string;
  floating?: boolean;
}

export function WhatsAppButton({
  whatsappNumber,
  message = 'Hi SHADOW FITNESS, I would like to enquire about memberships and training programs.',
  label = 'Chat on WhatsApp',
  className = '',
  floating = false,
}: WhatsAppButtonProps) {
  if (!whatsappNumber) {
    // If owner hasn't configured a WhatsApp number yet, do not output an unverified or broken link
    return null;
  }

  const url = generateWhatsAppUrl(whatsappNumber, message);
  if (!url) return null;

  if (floating) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Shadow Fitness"
        className={`fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-200 ${className}`}
      >
        <MessageSquare className="w-5 h-5 fill-black" />
        <span className="hidden sm:inline">{label}</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-xs uppercase tracking-widest rounded-lg transition-all duration-200 hover:border-[#25D366] ${className}`}
    >
      <MessageSquare className="w-4 h-4 fill-current" />
      <span>{label}</span>
    </a>
  );
}
