import type { VercelRequest, VercelResponse } from '@vercel/node';
import { changePassword, requireAdmin } from '../_lib/auth';
import { readBody, sendError, sendJson } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Only POST is allowed');
  }

  const gate = await requireAdmin(req);
  if (!gate.ok) return sendError(res, gate.status, 'AUTH_INVALID', gate.message);

  const body = readBody(req);
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

  try {
    const { token } = await changePassword(currentPassword, newPassword);
    return sendJson(res, 200, { data: { ok: true, token } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to change password';
    return sendError(res, 400, 'PASSWORD_CHANGE_FAILED', message);
  }
}
