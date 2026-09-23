import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TrialSection } from '@/components/home/TrialSection';

export const revalidate = 0;

export default async function FreeTrialPage() {
  const settings = await prisma.businessSettings.findUnique({ where: { id: 1 } });

  return (
    <>
      <Navbar gymName={settings?.gymName} freeTrialEnabled={settings?.freeTrialEnabled} />
      <main className="flex-1 pt-16 bg-background">
        <TrialSection
          freeTrialEnabled={settings?.freeTrialEnabled}
          whatsappNumber={settings?.whatsappNumber}
        />
      </main>
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
