import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  const testimonials = await prisma.testimonial.findMany({
    where: all ? undefined : { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const testimonial = await prisma.testimonial.create({
      data: {
        authorName: body.authorName,
        rating: Number(body.rating) || 5,
        reviewText: body.reviewText,
        reviewDate: body.reviewDate || null,
        photoUrl: body.photoUrl || null,
        source: body.source || 'Google Review',
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      },
    });

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create review' }, { status: 500 });
  }
}
