import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const AUTH_COOKIE_NAME = 'shadow_fitness_session';
const SECRET = process.env.AUTH_SECRET || 'shadow_fitness_default_secret_key_change_me';

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(payload: Omit<SessionPayload, 'exp'>): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const data: SessionPayload = { ...payload, exp };
  const encodedData = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(encodedData)
    .digest('base64url');
  return `${encodedData}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedData, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', SECRET)
      .update(encodedData)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const data: SessionPayload = JSON.parse(Buffer.from(encodedData, 'base64url').toString());
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  return user;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  const isSecure =
    process.env.NODE_ENV === 'production' &&
    !process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost');

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
