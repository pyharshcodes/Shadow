import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [programs, trainers] = await Promise.all([
    prisma.program.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.trainer.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes = [
    '',
    '/about',
    '/programs',
    '/trainers',
    '/membership',
    '/gallery',
    '/transformations',
    '/free-trial',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const programRoutes = programs.map((p) => ({
    url: `${baseUrl}/programs/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const trainerRoutes = trainers.map((t) => ({
    url: `${baseUrl}/trainers/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...programRoutes, ...trainerRoutes];
}
