import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  const transformations = await prisma.transformation.findMany({
    where: all ? undefined : { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json({ transformations });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const consentConfirmed = Boolean(body.consentConfirmed);

    // If publishing, consent confirmation MUST be confirmed
    if (body.isPublished && !consentConfirmed) {
      return NextResponse.json(
        { error: 'Member consent confirmation is mandatory before publishing transformation stories.' },
        { status: 400 }
      );
    }

    const transformation = await prisma.transformation.create({
      data: {
        name: body.name,
        beforeImage: body.beforeImage,
        afterImage: body.afterImage,
        duration: body.duration || '',
        goal: body.goal || '',
        story: body.story || '',
        consentConfirmed,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : false,
        sortOrder: Number(body.sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, transformation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create transformation' }, { status: 500 });
  }
}
