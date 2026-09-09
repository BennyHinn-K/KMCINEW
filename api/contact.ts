import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readBody, sendError, sendJson } from './_lib/http.js';
import { updateStore, type ContactMessage } from './_lib/store.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function deliverMail(payload: ContactMessage): Promise<boolean> {
  const to = process.env.CONTACT_TO_EMAIL || 'info@kmci.org';
  const resendKey = process.env.RESEND_API_KEY;
  const subject = `KMCI contact: ${payload.firstName} ${payload.lastName}`;
  const text = [
    `Name: ${payload.firstName} ${payload.lastName}`,
    `Email: ${payload.email}`,
    '',
    payload.message,
  ].join('\n');

  if (resendKey) {
    const from = process.env.CONTACT_FROM_EMAIL || 'KMCI <onboarding@resend.dev>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, reply_to: payload.email, subject, text }),
    });
    return res.ok;
  }

  const formSubmit = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      message: payload.message,
      _subject: subject,
    }),
  });
  return formSubmit.ok;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Only POST is allowed');
    }

    const body = readBody(req);
    const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
    const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!firstName || !lastName || !email || !message) {
      return sendError(res, 400, 'VALIDATION', 'All fields are required');
    }
    if (!EMAIL_RE.test(email)) {
      return sendError(res, 400, 'VALIDATION', 'Enter a valid email address');
    }

    const record: ContactMessage = {
      id: `${Date.now()}`,
      firstName,
      lastName,
      email,
      message,
      createdAt: new Date().toISOString(),
      delivered: false,
    };

    try {
      record.delivered = await deliverMail(record);
    } catch {
      record.delivered = false;
    }

    try {
      await updateStore((store) => ({
        ...store,
        contacts: [record, ...store.contacts].slice(0, 200),
      }));
    } catch {
      return sendJson(res, 200, {
        ok: true,
        delivered: record.delivered,
        stored: false,
      });
    }

    return sendJson(res, 200, {
      ok: true,
      delivered: record.delivered,
      stored: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return sendError(res, 500, 'INTERNAL', message);
  }
}
