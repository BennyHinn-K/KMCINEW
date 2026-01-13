import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from './upload';

vi.mock('@vercel/blob', () => ({
  createUploadUrl: vi.fn(async () => 'https://blob.example/upload-url'),
}));

type MockRes = VercelResponse & { jsonPayload?: unknown; statusCode: number };

function mockReqRes(
  method: string,
  opts?: { headers?: Record<string, string>; body?: unknown }
) {
  const req: VercelRequest = {
    method,
    headers: opts?.headers || {},
    body: opts?.body,
    query: {},
    cookies: {},
    env: {},
  } as unknown as VercelRequest;

  const res: MockRes = {
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.jsonPayload = payload;
      return this;
    },
    // minimal no-op implementations
    send: () => undefined,
    setHeader: () => undefined,
    getHeader: () => undefined,
    redirect: () => undefined,
  } as unknown as MockRes;

  return { req, res };
}

describe('upload API', () => {
  const adminPass = 'secret123';
  beforeEach(() => {
    process.env.ADMIN_PASSKEY = adminPass;
    process.env.JWT_SECRET = '';
  });

  it('rejects non-POST', async () => {
    const { req, res } = mockReqRes('GET');
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    const payload = (res.jsonPayload ?? {}) as { error?: { code?: string } };
    expect(payload.error?.code).toBe('METHOD_NOT_ALLOWED');
  });

  it('requires Authorization header', async () => {
    const { req, res } = mockReqRes('POST', { body: {} });
    await handler(req, res);
    expect(res.statusCode).toBe(401);
    const payload = (res.jsonPayload ?? {}) as { error?: { code?: string } };
    expect(payload.error?.code).toBe('AUTH_REQUIRED');
  });

  it('accepts raw ADMIN_PASSKEY as token', async () => {
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: `Bearer ${adminPass}` },
      body: { filename: 'a.mp4', contentType: 'video/mp4', sizeBytes: 1024 },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    const payload = (res.jsonPayload ?? {}) as { uploadUrl?: string; constraints?: { maxSizeBytes?: number } };
    expect(typeof payload.uploadUrl).toBe('string');
    expect((payload.constraints?.maxSizeBytes ?? 0)).toBeGreaterThan(0);
  });

  it('validates content type', async () => {
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: `Bearer ${adminPass}` },
      body: { filename: 'a.mp4', contentType: 'video/ogg', sizeBytes: 1024 },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(415);
    const payload = (res.jsonPayload ?? {}) as { error?: { code?: string } };
    expect(payload.error?.code).toBe('UNSUPPORTED_TYPE');
  });

  it('validates filename extension', async () => {
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: `Bearer ${adminPass}` },
      body: { filename: 'a.webm', contentType: 'video/mp4', sizeBytes: 1024 },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(415);
    const payload = (res.jsonPayload ?? {}) as { error?: { code?: string } };
    expect(payload.error?.code).toBe('UNSUPPORTED_EXTENSION');
  });

  it('rejects large sizes', async () => {
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: `Bearer ${adminPass}` },
      body: { filename: 'a.mp4', contentType: 'video/mp4', sizeBytes: 3 * 1024 * 1024 * 1024 },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(413);
    const payload = (res.jsonPayload ?? {}) as { error?: { code?: string } };
    expect(payload.error?.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('accepts JWT-like token with valid payload', async () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: 'admin', exp: Math.floor(Date.now() / 1000) + 60 };
    const b64 = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString('base64url');
    const token = `${b64(header)}.${b64(payload)}.sig`;
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: `Bearer ${token}` },
      body: { filename: 'a.mov', contentType: 'video/quicktime', sizeBytes: 2048 },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    const responsePayload = (res.jsonPayload ?? {}) as { uploadUrl?: string };
    expect(typeof responsePayload.uploadUrl).toBe('string');
  });
});
