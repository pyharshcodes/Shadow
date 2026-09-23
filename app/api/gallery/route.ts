import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';
  const category = searchParams.get('category');

  const where: any = {};
  if (!all) where.isPublished = true;
  if (category && category !== 'All') where.category = category;

  const images = await prisma.galleryImage.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const image = await prisma.galleryImage.create({
      data: {
        title: body.title,
        category: body.category || 'Gym',
        imageUrl: body.imageUrl,
        caption: body.caption || null,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        sortOrder: Number(body.sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, image }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add image' }, { status: 500 });
  }
}
