import type { Metadata } from 'next';
import './globals.css';
import { prisma } from '@/lib/prisma';
import { ToastProvider } from '@/components/ui/Toast';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.businessSettings.findUnique({ where: { id: 1 } });
  const gymName = settings?.gymName || 'SHADOW FITNESS';
  const tagline = settings?.tagline || 'DISCIPLINE OVER MOTIVATION.';

  return {
    title: {
      default: `${gymName} — Premium Performance Club`,
      template: `%s | ${gymName}`,
    },
    description: `${gymName} is an elite fitness center built on discipline, strength, and authentic progress. ${tagline}`,
    keywords: [
      'gym',
      'fitness center',
      'strength training',
      'personal trainer',
      'muscle building',
      'functional training',
      gymName.toLowerCase(),
    ],
    authors: [{ name: gymName }],
    openGraph: {
      title: `${gymName} — Premium Performance Club`,
      description: `${gymName} — ${tagline}. Train with purpose, build discipline, and become stronger.`,
      siteName: gymName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${gymName} — Premium Performance Club`,
      description: `${gymName} — ${tagline}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.businessSettings.findUnique({ where: { id: 1 } });

  // Dynamic CSS variables for accent color
  const accentColor = settings?.accentColor || '#d4f933';
  const customStyles = `
    :root {
      --color-accent: ${accentColor};
      --color-accent-hover: ${accentColor}dd;
      --color-accent-glow: ${accentColor}33;
    }
  `;

  // LocalBusiness structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: settings?.gymName || 'SHADOW FITNESS',
    description: settings?.aboutText || 'Elite performance and strength fitness facility.',
    telephone: settings?.phone || undefined,
    address: settings?.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
        }
      : undefined,
  };

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-zinc-100 antialiased min-h-screen flex flex-col">
        <ToastProvider>
          {children}
          {/* Floating WhatsApp button */}
          <WhatsAppButton
            whatsappNumber={settings?.whatsappNumber}
            floating
          />
        </ToastProvider>
      </body>
    </html>
  );
}
