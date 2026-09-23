import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GallerySection } from '@/components/home/GallerySection';

export const revalidate = 0;

export default async function GalleryPage() {
  const [settings, images] = await Promise.all([
    prisma.businessSettings.findUnique({ where: { id: 1 } }),
    prisma.galleryImage.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <>
      <Navbar gymName={settings?.gymName} freeTrialEnabled={settings?.freeTrialEnabled} />
      <main className="flex-1 pt-12 bg-background">
        <GallerySection images={images} />
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
