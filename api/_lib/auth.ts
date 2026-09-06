import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { VercelRequest } from '@vercel/node';
import { readStore, updateStore, type AuthRecord } from './store';

const scrypt = promisify(scryptCb);

const TOKEN_TTL_SEC = 60 * 60 * 8;

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.ADMIN_PASSKEY;
  if (secret && secret.length >= 8) return secret;
  if (process.env.VERCEL) {
    throw new Error('JWT_SECRET or ADMIN_PASSKEY must be configured');
  }
  return 'kmci-local-dev-secret';
}

function bootstrapPassword(): string {
  return process.env.ADMIN_PASSKEY || process.env.VITE_ADMIN_PASSKEY || '';
}

export function parseBearer(req: VercelRequest): string | null {
  const auth = req.headers['authorization'];
  const header = Array.isArray(auth) ? auth[0] : auth;
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

function b64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64url');
}

function signPayload(payload: Record<string, unknown>): string {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const sig = createHmac('sha256', jwtSecret()).update(data).digest();
  return `${data}.${b64url(sig)}`;
}

export function signAdminToken(tokenVersion: number): string {
  const now = Math.floor(Date.now() / 1000);
  return signPayload({
    sub: 'admin',
    ver: tokenVersion,
    iat: now,
    exp: now + TOKEN_TTL_SEC,
  });
}

export async function hashPassword(password: string): Promise<{ salt: string; hash: string }> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return { salt, hash: derived.toString('hex') };
}

export async function verifyPassword(password: string, record: AuthRecord): Promise<boolean> {
  const derived = (await scrypt(password, record.salt, 64)) as Buffer;
  const stored = Buffer.from(record.hash, 'hex');
  if (derived.length !== stored.length) return false;
  return timingSafeEqual(derived, stored);
}

export async function ensureAuthRecord(): Promise<AuthRecord> {
  const store = await readStore();
  if (store.auth.hash && store.auth.salt) return store.auth;

  const bootstrap = bootstrapPassword();
  if (!bootstrap) {
    throw new Error('ADMIN_PASSKEY is not configured');
  }
  const { salt, hash } = await hashPassword(bootstrap);
  const auth: AuthRecord = { salt, hash, tokenVersion: 1 };
  await updateStore((current) => ({ ...current, auth }));
  return auth;
}

export async function verifyAdminJwt(token: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [header, body, sig] = parts;
  const data = `${header}.${body}`;
  const expected = b64url(createHmac('sha256', jwtSecret()).update(data).digest());
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as {
      sub?: string;
      exp?: number;
      ver?: number;
    };
    if (payload.sub !== 'admin') return false;
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) return false;
    const auth = await ensureAuthRecord();
    if (typeof payload.ver === 'number' && payload.ver !== auth.tokenVersion) return false;
    return true;
  } catch {
    return false;
  }
}

export async function requireAdmin(req: VercelRequest): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const token = parseBearer(req);
  if (!token) return { ok: false, status: 401, message: 'Missing Authorization bearer token' };
  const valid = await verifyAdminJwt(token);
  if (!valid) return { ok: false, status: 401, message: 'Invalid or expired token' };
  return { ok: true };
}

export async function loginWithPassword(password: string): Promise<{ token: string }> {
  const trimmed = password.trim();
  if (!trimmed) throw new Error('Password is required');
  const auth = await ensureAuthRecord();
  const ok = await verifyPassword(trimmed, auth);
  if (!ok) throw new Error('Invalid password');
  return { token: signAdminToken(auth.tokenVersion) };
}

export async function changePassword(
  currentPassword: string,
  nextPassword: string
): Promise<{ token: string }> {
  if (!nextPassword || nextPassword.trim().length < 8) {
    throw new Error('New password must be at least 8 characters');
  }
  const auth = await ensureAuthRecord();
  const ok = await verifyPassword(currentPassword.trim(), auth);
  if (!ok) throw new Error('Current password is incorrect');
  const { salt, hash } = await hashPassword(nextPassword.trim());
  const next = await updateStore((current) => ({
    ...current,
    auth: { salt, hash, tokenVersion: current.auth.tokenVersion + 1 },
  }));
  return { token: signAdminToken(next.auth.tokenVersion) };
}
