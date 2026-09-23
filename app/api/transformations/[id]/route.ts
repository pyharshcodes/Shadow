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

    if (body.isPublished && !body.consentConfirmed) {
      return NextResponse.json(
        { error: 'Member consent confirmation is mandatory before publishing transformation stories.' },
        { status: 400 }
      );
    }

    const updated = await prisma.transformation.update({
      where: { id },
      data: {
        name: body.name,
        beforeImage: body.beforeImage,
        afterImage: body.afterImage,
        duration: body.duration,
        goal: body.goal,
        story: body.story,
        consentConfirmed: body.consentConfirmed !== undefined ? Boolean(body.consentConfirmed) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      },
    });

    return NextResponse.json({ success: true, transformation: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update transformation' }, { status: 500 });
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
    await prisma.transformation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete transformation' }, { status: 500 });
  }
}
