import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

vi.mock('../_lib/auth', () => ({
  parseBearer: (req: VercelRequest) => {
    const auth = req.headers['authorization'];
    const header = Array.isArray(auth) ? auth[0] : auth;
    if (!header) return null;
    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    return parts[1];
  },
  verifyAdminJwt: async (token: string) => token === 'valid-jwt',
}));

vi.mock('@vercel/blob', () => ({
  put: vi.fn(async () => ({
    url: 'https://blob.example/uploaded-video-url',
  })),
}));

import handler from './upload.js';

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

  const res = {} as MockRes;
  res.statusCode = 200;
  res.send = (() => undefined) as unknown as MockRes['send'];
  res.setHeader = (() => undefined) as unknown as MockRes['setHeader'];
  res.getHeader = (() => undefined) as unknown as MockRes['getHeader'];
  res.redirect = (() => undefined) as unknown as MockRes['redirect'];
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: unknown) => {
    res.jsonPayload = payload;
    return res;
  };

  return { req, res };
}

describe('upload API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('rejects unsigned tokens', async () => {
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: 'Bearer not-a-jwt' },
      body: {
        filename: 'a.mp4',
        contentType: 'video/mp4',
        sizeBytes: 1024,
        dataBase64: Buffer.from('test-data').toString('base64'),
      },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(401);
  });

  it('uploads with a verified JWT', async () => {
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: 'Bearer valid-jwt' },
      body: {
        filename: 'a.mp4',
        contentType: 'video/mp4',
        sizeBytes: 1024,
        dataBase64: Buffer.from('test-data').toString('base64'),
      },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    const payload = (res.jsonPayload ?? {}) as { uploadUrl?: string; constraints?: { maxSizeBytes?: number } };
    expect(typeof payload.uploadUrl).toBe('string');
    expect((payload.constraints?.maxSizeBytes ?? 0)).toBeGreaterThan(0);
  });

  it('validates content type', async () => {
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: 'Bearer valid-jwt' },
      body: { filename: 'a.mp4', contentType: 'video/ogg', sizeBytes: 1024 },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(415);
    const payload = (res.jsonPayload ?? {}) as { error?: { code?: string } };
    expect(payload.error?.code).toBe('UNSUPPORTED_TYPE');
  });

  it('validates filename extension', async () => {
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: 'Bearer valid-jwt' },
      body: { filename: 'a.webm', contentType: 'video/mp4', sizeBytes: 1024 },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(415);
    const payload = (res.jsonPayload ?? {}) as { error?: { code?: string } };
    expect(payload.error?.code).toBe('UNSUPPORTED_EXTENSION');
  });

  it('rejects large sizes', async () => {
    const { req, res } = mockReqRes('POST', {
      headers: { authorization: 'Bearer valid-jwt' },
      body: { filename: 'a.mp4', contentType: 'video/mp4', sizeBytes: 3 * 1024 * 1024 * 1024 },
    });
    await handler(req, res);
    expect(res.statusCode).toBe(413);
    const payload = (res.jsonPayload ?? {}) as { error?: { code?: string } };
    expect(payload.error?.code).toBe('PAYLOAD_TOO_LARGE');
  });
});
