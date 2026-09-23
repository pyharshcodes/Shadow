import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  const memberships = await prisma.membership.findMany({
    where: all ? undefined : { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json({ memberships });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const membership = await prisma.membership.create({
      data: {
        slug,
        name: body.name,
        price: body.price || 'Contact Gym',
        duration: body.duration || '1 Month',
        features: typeof body.features === 'string' ? body.features : JSON.stringify(body.features || []),
        highlightBadge: body.highlightBadge || null,
        isPopular: Boolean(body.isPopular),
        personalTrainingIncluded: Boolean(body.personalTrainingIncluded),
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        sortOrder: Number(body.sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, membership }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create membership' }, { status: 500 });
  }
}
