import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const content = await prisma.homepageSection.findUnique({
    where: { id: 1 },
  });
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await prisma.homepageSection.upsert({
      where: { id: 1 },
      update: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroBadge: body.heroBadge,
        heroCta1Text: body.heroCta1Text,
        heroCta1Link: body.heroCta1Link,
        heroCta2Text: body.heroCta2Text,
        heroCta2Link: body.heroCta2Link,
        manifestoTitle: body.manifestoTitle,
        manifestoText: body.manifestoText,
        scrollTickerText: body.scrollTickerText,
        heroMediaUrl: body.heroMediaUrl,
      },
      create: {
        id: 1,
        heroTitle: body.heroTitle || 'BUILD YOUR\nSTRONGER SELF.',
        heroSubtitle: body.heroSubtitle || 'Train with purpose. Build strength. Become better every day.',
        heroBadge: body.heroBadge || 'TRAIN • BUILD • TRANSFORM',
        heroCta1Text: body.heroCta1Text || 'START YOUR JOURNEY',
        heroCta1Link: body.heroCta1Link || '#membership',
        heroCta2Text: body.heroCta2Text || 'EXPLORE THE GYM',
        heroCta2Link: body.heroCta2Link || '#programs',
        manifestoTitle: body.manifestoTitle || 'MORE THAN A GYM.',
        manifestoText: body.manifestoText || 'SHADOW FITNESS is a place to train with purpose, build discipline and become stronger—one session at a time.',
        scrollTickerText: body.scrollTickerText || "YOU DON'T NEED MORE MOTIVATION. | YOU NEED A ROUTINE. | SHOW UP. | DO THE WORK.",
        heroMediaUrl: body.heroMediaUrl,
      },
    });

    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error('Homepage update error:', error);
    return NextResponse.json({ error: 'Failed to update homepage content' }, { status: 500 });
  }
}
