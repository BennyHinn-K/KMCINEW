import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from './_lib/auth';
import { readBody, sendError, sendJson } from './_lib/http';
import { readStore, updateStore } from './_lib/store';
import type { IEvent, INewsItem } from '../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) {
      const fail = gate as { ok: false; status: number; message: string };
      return sendError(res, fail.status, 'AUTH_INVALID', fail.message);
    }

    if (req.method === 'GET') {
      const store = await readStore();
      return sendJson(res, 200, {
        data: {
          events: store.events,
          announcements: store.announcements,
        },
      });
    }

    if (req.method === 'POST') {
      const body = readBody(req);
      const events = Array.isArray(body.events) ? (body.events as IEvent[]) : null;
      const announcements = Array.isArray(body.announcements) ? (body.announcements as INewsItem[]) : null;
      if (!events || !announcements) {
        return sendError(res, 400, 'VALIDATION', 'Backup must include events and announcements arrays');
      }
      await updateStore((store) => ({
        ...store,
        events,
        announcements,
      }));
      return sendJson(res, 200, { data: { ok: true } });
    }

    return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Only GET and POST are allowed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return sendError(res, 500, 'INTERNAL', message);
  }
}
