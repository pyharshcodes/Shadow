import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const settings = await prisma.businessSettings.findUnique({
    where: { id: 1 },
  });
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const updated = await prisma.businessSettings.upsert({
      where: { id: 1 },
      update: {
        gymName: body.gymName,
        tagline: body.tagline,
        phone: body.phone,
        whatsappNumber: body.whatsappNumber,
        email: body.email,
        address: body.address,
        googleMapsEmbedUrl: body.googleMapsEmbedUrl,
        googleMapsLink: body.googleMapsLink,
        openingHours: typeof body.openingHours === 'string' ? body.openingHours : JSON.stringify(body.openingHours || []),
        parkingInfo: body.parkingInfo,
        accentColor: body.accentColor || '#d4f933',
        freeTrialEnabled: body.freeTrialEnabled !== undefined ? Boolean(body.freeTrialEnabled) : true,
        instagramUrl: body.instagramUrl,
        youtubeUrl: body.youtubeUrl,
        facebookUrl: body.facebookUrl,
        aboutText: body.aboutText,
        footerText: body.footerText,
      },
      create: {
        id: 1,
        gymName: body.gymName || 'SHADOW FITNESS',
        tagline: body.tagline || 'DISCIPLINE OVER MOTIVATION.',
        phone: body.phone,
        whatsappNumber: body.whatsappNumber,
        email: body.email,
        address: body.address,
        googleMapsEmbedUrl: body.googleMapsEmbedUrl,
        googleMapsLink: body.googleMapsLink,
        openingHours: typeof body.openingHours === 'string' ? body.openingHours : JSON.stringify(body.openingHours || []),
        parkingInfo: body.parkingInfo,
        accentColor: body.accentColor || '#d4f933',
        freeTrialEnabled: body.freeTrialEnabled !== undefined ? Boolean(body.freeTrialEnabled) : true,
        instagramUrl: body.instagramUrl,
        youtubeUrl: body.youtubeUrl,
        facebookUrl: body.facebookUrl,
        aboutText: body.aboutText,
        footerText: body.footerText,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
