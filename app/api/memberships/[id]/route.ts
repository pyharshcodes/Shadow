import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await prisma.membership.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        price: body.price,
        duration: body.duration,
        features: typeof body.features === 'string' ? body.features : JSON.stringify(body.features || []),
        highlightBadge: body.highlightBadge,
        isPopular: body.isPopular !== undefined ? Boolean(body.isPopular) : undefined,
        personalTrainingIncluded: body.personalTrainingIncluded !== undefined ? Boolean(body.personalTrainingIncluded) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      },
    });

    return NextResponse.json({ success: true, membership: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update membership' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.membership.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete membership' }, { status: 500 });
  }
}
