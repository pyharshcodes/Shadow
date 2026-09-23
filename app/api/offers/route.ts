import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  const where: any = {};
  if (!all) {
    where.isActive = true;
    where.OR = [
      { endDate: null },
      { endDate: { gte: new Date() } },
    ];
  }

  const offers = await prisma.offer.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ offers });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const offer = await prisma.offer.create({
      data: {
        title: body.title,
        description: body.description,
        discountBadge: body.discountBadge || null,
        originalPrice: body.originalPrice || null,
        discountedPrice: body.discountedPrice || null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        ctaText: body.ctaText || 'CLAIM OFFER',
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return NextResponse.json({ success: true, offer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create offer' }, { status: 500 });
  }
}
