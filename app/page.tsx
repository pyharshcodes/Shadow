import { prisma } from '@/lib/prisma';
import { HomeClient } from '@/components/home/HomeClient';

export const revalidate = 0; // Dynamic server rendering to always reflect admin changes immediately

export default async function HomePage() {
  const [
    settings,
    homepage,
    programs,
    facilities,
    trainers,
    memberships,
    transformations,
    gallery,
  ] = await Promise.all([
    prisma.businessSettings.findUnique({ where: { id: 1 } }),
    prisma.homepageSection.findUnique({ where: { id: 1 } }),
    prisma.program.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      include: { trainer: true },
    }),
    prisma.facility.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.trainer.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.membership.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.transformation.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.galleryImage.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <HomeClient
      settings={settings}
      homepage={homepage}
      programs={programs}
      facilities={facilities}
      trainers={trainers}
      memberships={memberships}
      transformations={transformations}
      gallery={gallery}
    />
  );
}
