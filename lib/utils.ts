import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWhatsAppUrl(
  phone: string | null | undefined,
  message: string
): string | null {
  if (!phone) return null;
  const cleanPhone = phone.replace(/[^\d+]/g, '').replace('+', '');
  if (!cleanPhone) return null;
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function truncateText(text: string, maxLen: number): string {
  if (!text || text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}
