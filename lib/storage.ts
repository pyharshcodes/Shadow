import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, AVIF, and GIF are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 10MB limit.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const hash = crypto.randomBytes(12).toString('hex');
  const ext = path.extname(file.name) || '.jpg';
  const filename = `${hash}${ext}`;

  // Ensure public/uploads directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${filename}`,
    filename,
    size: file.size,
  };
}
