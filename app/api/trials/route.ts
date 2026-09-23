import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Check if free trial is enabled
    const settings = await prisma.businessSettings.findUnique({ where: { id: 1 } });
    if (settings && !settings.freeTrialEnabled) {
      return NextResponse.json({ error: 'Free trial booking is currently inactive' }, { status: 403 });
    }

    const body = await request.json();
    const { name, phone, preferredDate, preferredTime, fitnessGoal, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
    }

    const trial = await prisma.trialRequest.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        fitnessGoal: fitnessGoal || null,
        message: message?.trim() || null,
        status: 'new',
      },
    });

    return NextResponse.json({ success: true, trial }, { status: 201 });
  } catch (error) {
    console.error('Trial submission error:', error);
    return NextResponse.json({ error: 'Failed to book trial' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const query = searchParams.get('q');

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { phone: { contains: query } },
    ];
  }

  const trials = await prisma.trialRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ trials });
}
