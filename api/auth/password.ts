import type { VercelRequest, VercelResponse } from '@vercel/node';
import { changePassword, requireAdmin } from '../_lib/auth.js';
import { readBody, sendError, sendJson } from '../_lib/http.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Only POST is allowed');
    }

    const gate = await requireAdmin(req);
    if (!gate.ok) return sendError(res, gate.status, 'AUTH_INVALID', gate.message);

    const body = readBody(req);
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    const { token } = await changePassword(currentPassword, newPassword);
    return sendJson(res, 200, { data: { ok: true, token } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to change password';
    const authFail = message.includes('AUTH_INVALID') || message.includes('not authorized');
    const status = authFail ? 401 : 400;
    return sendError(res, status, 'PASSWORD_CHANGE_FAILED', message);
  }
}
