import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { VercelRequest } from '@vercel/node';
import { readStore, updateStore, type AuthRecord, type AuthAuditEntry } from './store.js';

const scrypt = promisify(scryptCb);

const TOKEN_TTL_SEC = 60 * 60 * 8;

const ONLY_ALLOWED_PASSKEY = 'ADMIN@kmci';
const FIXED_TOKEN_VERSION = 1;
const MAX_AUDIT_LOGS = 1000;

function deriveJwtSecret(): string {
  const fallbacks = [process.env.JWT_SECRET, ONLY_ALLOWED_PASSKEY + '-jwt-seed'];
  const chosen = fallbacks.find((s) => typeof s === 'string' && s.length >= 8) as string;
  return createHmac('sha256', 'kmci-jwt-salt').update(chosen).digest('hex');
}

const JWT_SECRET_STATIC = deriveJwtSecret();

function extractIp(req: VercelRequest): string | null {
  const forward = req.headers['x-forwarded-for'];
  if (forward) {
    const first = Array.isArray(forward) ? forward[0] : forward.split(',')[0]?.trim();
    return first || null;
  }
  const realIp = req.headers['x-real-ip'];
  if (realIp) return Array.isArray(realIp) ? realIp[0] : realIp;
  const remote = (req as unknown as { socket?: { remoteAddress?: string } }).socket?.remoteAddress;
  return remote || null;
}

function extractUserAgent(req: VercelRequest): string | null {
  const ua = req.headers['user-agent'];
  return Array.isArray(ua) ? ua[0] : ua || null;
}

function extractPath(req: VercelRequest): string | null {
  const url = (req as unknown as { url?: string }).url;
  return url || null;
}

export async function writeAudit(entry: Omit<AuthAuditEntry, 'id' | 'timestamp'>): Promise<void> {
  const record: AuthAuditEntry = {
    ...entry,
    id: `${Date.now()}-${randomBytes(6).toString('hex')}`,
    timestamp: new Date().toISOString(),
  };
  try {
    await updateStore((store) => {
      const existing = Array.isArray(store.authAuditLogs) ? store.authAuditLogs : [];
      const next = [record, ...existing].slice(0, MAX_AUDIT_LOGS);
      return { ...store, authAuditLogs: next };
    });
  } catch {
    /* audit write must not cascade to 500s */
  }
  const prefix = `[AUDIT][${record.status}] ${record.event}`;
  const line = `${prefix} ip=${record.ip || '-'} ua=${(record.userAgent || '-').slice(0, 80)} path=${record.path || '-'} ts=${record.timestamp}`;
  if (record.status === 'DENIED') console.warn(line, record.details);
  else console.log(line, record.details);
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
  const sig = createHmac('sha256', JWT_SECRET_STATIC).update(data).digest();
  return `${data}.${b64url(sig)}`;
}

export function signAdminToken(): string {
  const now = Math.floor(Date.now() / 1000);
  return signPayload({
    sub: 'admin',
    ver: FIXED_TOKEN_VERSION,
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

async function fixedAuthRecord(): Promise<AuthRecord> {
  const store = await readStore();
  const stored = store.auth;

  if (stored.hash && stored.salt) {
    const matchesAllowed = await verifyPassword(ONLY_ALLOWED_PASSKEY, stored);
    if (matchesAllowed) return stored;
  }

  const { salt, hash } = await hashPassword(ONLY_ALLOWED_PASSKEY);
  const auth: AuthRecord = { salt, hash, tokenVersion: FIXED_TOKEN_VERSION };
  await updateStore((current) => ({ ...current, auth }));
  return auth;
}

export async function ensureAuthRecord(): Promise<AuthRecord> {
  return fixedAuthRecord();
}

export async function verifyAdminJwt(token: string, req?: VercelRequest): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    if (req) await writeAudit({ event: 'JWT_VERIFY_FAILURE', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'DENIED', details: { reason: 'malformed_token' } });
    return false;
  }
  const [header, body, sig] = parts;
  const data = `${header}.${body}`;
  const expected = b64url(createHmac('sha256', JWT_SECRET_STATIC).update(data).digest());
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    if (req) await writeAudit({ event: 'JWT_VERIFY_FAILURE', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'DENIED', details: { reason: 'bad_signature' } });
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as {
      sub?: string;
      exp?: number;
      ver?: number;
    };
    if (payload.sub !== 'admin') {
      if (req) await writeAudit({ event: 'JWT_VERIFY_FAILURE', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'DENIED', details: { reason: 'bad_subject' } });
      return false;
    }
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
      if (req) await writeAudit({ event: 'JWT_VERIFY_FAILURE', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'DENIED', details: { reason: 'expired' } });
      return false;
    }
    if (typeof payload.ver === 'number' && payload.ver !== FIXED_TOKEN_VERSION) {
      if (req) await writeAudit({ event: 'JWT_VERIFY_FAILURE', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'DENIED', details: { reason: 'token_version_mismatch' } });
      return false;
    }
    if (req) await writeAudit({ event: 'JWT_VERIFY_SUCCESS', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'ALLOWED' });
    return true;
  } catch {
    if (req) await writeAudit({ event: 'JWT_VERIFY_FAILURE', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'DENIED', details: { reason: 'payload_parse_error' } });
    return false;
  }
}

export async function requireAdmin(req: VercelRequest): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const token = parseBearer(req);
  if (!token) {
    await writeAudit({ event: 'UNAUTHORIZED_ROUTE_ATTEMPT', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'DENIED', details: { reason: 'missing_bearer_token' } });
    return { ok: false, status: 401, message: 'Missing Authorization bearer token' };
  }
  const valid = await verifyAdminJwt(token, req);
  if (!valid) {
    await writeAudit({ event: 'UNAUTHORIZED_ROUTE_ATTEMPT', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'DENIED', details: { reason: 'invalid_or_expired_token' } });
    return { ok: false, status: 401, message: 'Invalid or expired token' };
  }
  await writeAudit({ event: 'ADMIN_ROUTE_ACCESS', ip: extractIp(req), userAgent: extractUserAgent(req), path: extractPath(req), status: 'ALLOWED' });
  return { ok: true };
}

export async function loginWithPassword(password: string, req?: VercelRequest): Promise<{ token: string }> {
  const raw = typeof password === 'string' ? password : '';
  const trimmed = raw.trim();
  const ip = req ? extractIp(req) : null;
  const userAgent = req ? extractUserAgent(req) : null;
  const path = req ? extractPath(req) : null;

  await writeAudit({
    event: 'LOGIN_ATTEMPT',
    ip,
    userAgent,
    path,
    status: 'DENIED',
    details: { rawLength: raw.length, trimmedLength: trimmed.length },
  });

  if (!trimmed) {
    await writeAudit({ event: 'LOGIN_FAILURE', ip, userAgent, path, status: 'DENIED', details: { reason: 'empty_password' } });
    throw new Error('Password is required');
  }

  if (raw.length !== ONLY_ALLOWED_PASSKEY.length || trimmed.length !== ONLY_ALLOWED_PASSKEY.length) {
    await writeAudit({
      event: 'LOGIN_FAILURE',
      ip,
      userAgent,
      path,
      status: 'DENIED',
      details: { reason: 'length_mismatch', rawLength: raw.length, trimmedLength: trimmed.length, expected: ONLY_ALLOWED_PASSKEY.length },
    });
    throw new Error('Invalid password');
  }

  const auth = await fixedAuthRecord();

  const rawNotEqual = raw.length !== ONLY_ALLOWED_PASSKEY.length
    ? true
    : !timingSafeEqual(Buffer.from(raw, 'utf8'), Buffer.from(ONLY_ALLOWED_PASSKEY, 'utf8'));
  const trimmedNotEqual = !timingSafeEqual(Buffer.from(trimmed, 'utf8'), Buffer.from(ONLY_ALLOWED_PASSKEY, 'utf8'));
  if (rawNotEqual || trimmedNotEqual) {
    await verifyPassword(trimmed, auth);
    await writeAudit({ event: 'LOGIN_FAILURE', ip, userAgent, path, status: 'DENIED', details: { reason: 'password_mismatch' } });
    throw new Error('Invalid password');
  }

  const scryptOk = await verifyPassword(ONLY_ALLOWED_PASSKEY, auth);
  if (!scryptOk) {
    await writeAudit({ event: 'LOGIN_FAILURE', ip, userAgent, path, status: 'DENIED', details: { reason: 'stored_hash_mismatch_regenerated' } });
    throw new Error('Invalid password');
  }

  await writeAudit({ event: 'LOGIN_SUCCESS', ip, userAgent, path, status: 'ALLOWED' });
  return { token: signAdminToken() };
}

export async function changePassword(
  _currentPassword: string,
  _nextPassword: string,
  req?: VercelRequest
): Promise<{ token: string }> {
  const ip = req ? extractIp(req) : null;
  const userAgent = req ? extractUserAgent(req) : null;
  const path = req ? extractPath(req) : null;

  await writeAudit({
    event: 'PASSWORD_CHANGE_ATTEMPT',
    ip,
    userAgent,
    path,
    status: 'DENIED',
    details: { reason: 'password_change_disabled' },
  });
  await writeAudit({
    event: 'PASSWORD_CHANGE_BLOCKED',
    ip,
    userAgent,
    path,
    status: 'DENIED',
    details: { message: 'System is locked to the single fixed passkey ADMIN@kmci. No password changes are permitted.' },
  });
  throw new Error('Password changes are disabled. Only the fixed passkey "ADMIN@kmci" is accepted.');
}
