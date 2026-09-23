import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      totalLeads,
      newLeads,
      totalTrials,
      newTrials,
      totalPrograms,
      totalMemberships,
      totalTrainers,
      totalTransformations,
      totalGallery,
      recentLeads,
      recentTrials,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'new' } }),
      prisma.trialRequest.count(),
      prisma.trialRequest.count({ where: { status: 'new' } }),
      prisma.program.count({ where: { isPublished: true } }),
      prisma.membership.count({ where: { isPublished: true } }),
      prisma.trainer.count({ where: { isPublished: true } }),
      prisma.transformation.count({ where: { isPublished: true } }),
      prisma.galleryImage.count({ where: { isPublished: true } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.trialRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalLeads,
        newLeads,
        totalTrials,
        newTrials,
        totalPrograms,
        totalMemberships,
        totalTrainers,
        totalTransformations,
        totalGallery,
      },
      recentLeads,
      recentTrials,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
