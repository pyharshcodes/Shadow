import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Clock, Calendar, Check, User, ArrowLeft, MessageSquare, ArrowRight } from 'lucide-react';
import { ProgramDetailClient } from './ProgramDetailClient';

export const revalidate = 0;

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [settings, program] = await Promise.all([
    prisma.businessSettings.findUnique({ where: { id: 1 } }),
    prisma.program.findFirst({
      where: { slug, isPublished: true },
      include: { trainer: true },
    }),
  ]);

  if (!program) {
    notFound();
  }

  return (
    <>
      <Navbar gymName={settings?.gymName} freeTrialEnabled={settings?.freeTrialEnabled} />
      <ProgramDetailClient program={program} settings={settings} />
      <Footer
        gymName={settings?.gymName}
        tagline={settings?.tagline}
        phone={settings?.phone}
        whatsappNumber={settings?.whatsappNumber}
        email={settings?.email}
        address={settings?.address}
        googleMapsLink={settings?.googleMapsLink}
        openingHours={settings?.openingHours}
      />
    </>
  );
}
