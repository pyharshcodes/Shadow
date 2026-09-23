import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, type, interestedPlan, fitnessGoal, preferredTime, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        type: type || 'general',
        interestedPlan: interestedPlan || null,
        fitnessGoal: fitnessGoal || null,
        preferredTime: preferredTime || null,
        message: message?.trim() || null,
        status: 'new',
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Failed to record enquiry' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const query = searchParams.get('q');

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (type && type !== 'all') where.type = type;
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { phone: { contains: query } },
      { email: { contains: query } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ leads });
}
