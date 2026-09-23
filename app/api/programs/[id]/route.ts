import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const program = await prisma.program.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { trainer: true },
  });

  if (!program) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  return NextResponse.json({ program });
}

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
    const updated = await prisma.program.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category,
        description: body.description,
        targetAudience: body.targetAudience,
        approach: body.approach,
        duration: body.duration,
        schedule: body.schedule,
        ctaText: body.ctaText,
        imageUrl: body.imageUrl,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
        trainerId: body.trainerId,
      },
    });

    return NextResponse.json({ success: true, program: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update program' }, { status: 500 });
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
    await prisma.program.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete program' }, { status: 500 });
  }
}
