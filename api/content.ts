import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from './_lib/auth.js';
import { readBody, sendError, sendJson, queryString } from './_lib/http.js';
import { readStore, updateStore } from './_lib/store.js';
import { asContentItem, isManagedCategory, validateItem } from './_lib/validate.js';
import type { ContentItem, IEvent, INewsItem } from '../src/types/index.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method || 'GET';
  const category = queryString(req, 'category');

  try {
    if (method === 'GET') {
      const store = await readStore();
      if (category === 'event') return sendJson(res, 200, { data: store.events });
      if (category === 'announcement') return sendJson(res, 200, { data: store.announcements });
      if (category === 'sermon') return sendJson(res, 200, { data: store.sermons });
      return sendJson(res, 200, {
        data: {
          events: store.events,
          announcements: store.announcements,
          sermons: store.sermons,
        },
      });
    }

    const gate = await requireAdmin(req);
    if (!gate.ok) {
      const fail = gate as { ok: false; status: number; message: string };
      return sendError(res, fail.status, 'AUTH_INVALID', fail.message);
    }

    if (!isManagedCategory(category)) {
      return sendError(res, 400, 'UNSUPPORTED_CATEGORY', 'Only events and announcements can be managed');
    }

    if (method === 'POST') {
      const body = readBody(req);
      validateItem({ ...body, category }, category);
      const created = asContentItem({ ...(body as Omit<ContentItem, 'id'>), category }, `${Date.now()}`);
      await updateStore((store) => {
        if (category === 'event') {
          return { ...store, events: [created as IEvent, ...store.events] };
        }
        return { ...store, announcements: [created as INewsItem, ...store.announcements] };
      });
      return sendJson(res, 200, { data: created });
    }

    if (method === 'PUT') {
      const id = queryString(req, 'id');
      if (!id) return sendError(res, 400, 'VALIDATION', 'ID is required for update');
      const updates = readBody(req);
      await updateStore((store) => {
        if (category === 'event') {
          return {
            ...store,
            events: store.events.map((item) => (item.id === id ? { ...item, ...updates, category: 'event', id } : item)),
          };
        }
        return {
          ...store,
          announcements: store.announcements.map((item) =>
            item.id === id ? { ...item, ...updates, category: 'announcement', id } : item
          ),
        };
      });
      return sendJson(res, 200, { data: null });
    }

    if (method === 'DELETE') {
      const id = queryString(req, 'id');
      if (!id) return sendError(res, 400, 'VALIDATION', 'ID is required for deletion');
      await updateStore((store) => {
        if (category === 'event') {
          return { ...store, events: store.events.filter((item) => item.id !== id) };
        }
        return { ...store, announcements: store.announcements.filter((item) => item.id !== id) };
      });
      return sendJson(res, 200, { data: null });
    }

    return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed';
    const status = method === 'GET' ? 500 : 400;
    const code = method === 'GET' ? 'INTERNAL' : 'VALIDATION';
    return sendError(res, status, code, message);
  }
}
