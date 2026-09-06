import type { VercelRequest, VercelResponse } from '@vercel/node';

export function sendJson(res: VercelResponse, status: number, payload: unknown): VercelResponse {
  res.setHeader?.('Cache-Control', 'no-store');
  return res.status(status).json(payload);
}

export function sendError(res: VercelResponse, status: number, code: string, message: string): VercelResponse {
  return sendJson(res, status, { error: { code, message } });
}

export function readBody(req: VercelRequest): Record<string, unknown> {
  const raw = (req as unknown as { body?: unknown }).body;
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof raw === 'object') return raw as Record<string, unknown>;
  return {};
}

export function queryString(req: VercelRequest, key: string): string {
  const value = req.query?.[key];
  if (Array.isArray(value)) return String(value[0] || '');
  return typeof value === 'string' ? value : '';
}
