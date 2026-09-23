import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  const programs = await prisma.program.findMany({
    where: all ? undefined : { isPublished: true },
    orderBy: { sortOrder: 'asc' },
    include: { trainer: true },
  });

  return NextResponse.json({ programs });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const program = await prisma.program.create({
      data: {
        slug,
        title: body.title,
        category: body.category || 'Strength',
        description: body.description,
        targetAudience: body.targetAudience,
        approach: body.approach,
        duration: body.duration,
        schedule: body.schedule,
        ctaText: body.ctaText || 'ENQUIRE ABOUT THIS PROGRAM',
        imageUrl: body.imageUrl,
        isFeatured: Boolean(body.isFeatured),
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        sortOrder: Number(body.sortOrder) || 0,
        trainerId: body.trainerId || null,
      },
    });

    return NextResponse.json({ success: true, program }, { status: 201 });
  } catch (error: any) {
    console.error('Program creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create program' }, { status: 500 });
  }
}
