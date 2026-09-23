import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  const trainers = await prisma.trainer.findMany({
    where: all ? undefined : { isPublished: true },
    orderBy: { sortOrder: 'asc' },
    include: { programs: true },
  });

  return NextResponse.json({ trainers });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const trainer = await prisma.trainer.create({
      data: {
        slug,
        name: body.name,
        role: body.role,
        specializations: body.specializations,
        experience: body.experience,
        certifications: body.certifications,
        bio: body.bio,
        photoUrl: body.photoUrl,
        instagramUrl: body.instagramUrl,
        linkedinUrl: body.linkedinUrl,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        sortOrder: Number(body.sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, trainer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create trainer' }, { status: 500 });
  }
}
