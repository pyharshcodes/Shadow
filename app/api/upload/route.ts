import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/storage';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const result = await saveUploadedFile(file);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 400 });
  }
}
