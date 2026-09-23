import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MembershipClient } from './MembershipClient';

export const revalidate = 0;

export default async function MembershipPage() {
  const [settings, memberships] = await Promise.all([
    prisma.businessSettings.findUnique({ where: { id: 1 } }),
    prisma.membership.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <>
      <Navbar gymName={settings?.gymName} freeTrialEnabled={settings?.freeTrialEnabled} />
      <MembershipClient memberships={memberships} settings={settings} />
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
