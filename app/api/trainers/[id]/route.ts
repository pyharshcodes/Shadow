import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const trainer = await prisma.trainer.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { programs: true },
  });

  if (!trainer) {
    return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
  }

  return NextResponse.json({ trainer });
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
    const updated = await prisma.trainer.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        role: body.role,
        specializations: body.specializations,
        experience: body.experience,
        certifications: body.certifications,
        bio: body.bio,
        photoUrl: body.photoUrl,
        instagramUrl: body.instagramUrl,
        linkedinUrl: body.linkedinUrl,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      },
    });

    return NextResponse.json({ success: true, trainer: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update trainer' }, { status: 500 });
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
    await prisma.trainer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete trainer' }, { status: 500 });
  }
}
