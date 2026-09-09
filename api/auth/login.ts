import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loginWithPassword } from '../_lib/auth';
import { readBody, sendError, sendJson } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Only POST is allowed');
  }

  const body = readBody(req);
  const password = typeof body.password === 'string' ? body.password : typeof body.passkey === 'string' ? body.passkey : '';

  try {
    const { token } = await loginWithPassword(password, req);
    return sendJson(res, 200, { token });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    const status = message.includes('not configured') ? 500 : 401;
    return sendError(res, status, 'AUTH_FAILED', message);
  }
}
