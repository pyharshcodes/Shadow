import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  const facilities = await prisma.facility.findMany({
    where: all ? undefined : { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json({ facilities });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const facility = await prisma.facility.create({
      data: {
        name: body.name,
        tag: body.tag || 'Facility',
        description: body.description,
        specs: typeof body.specs === 'string' ? body.specs : JSON.stringify(body.specs || []),
        imageUrl: body.imageUrl,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        sortOrder: Number(body.sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, facility }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create facility' }, { status: 500 });
  }
}
