import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type ApiHandler = (req: VercelRequest, res: VercelResponse) => Promise<unknown> | unknown;

async function readRawBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function send(res: ServerResponse, status: number, payload: unknown) {
  if (res.headersSent) return;
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function adaptResponse(res: ServerResponse): VercelResponse {
  const adapted = res as unknown as VercelResponse & { statusCode: number };
  adapted.status = ((code: number) => {
    res.statusCode = code;
    return adapted;
  }) as VercelResponse['status'];
  adapted.json = ((payload: unknown) => {
    send(res, res.statusCode || 200, payload);
    return adapted;
  }) as VercelResponse['json'];
  adapted.send = ((payload: unknown) => {
    if (typeof payload === 'object') send(res, res.statusCode || 200, payload);
    else {
      res.statusCode = res.statusCode || 200;
      res.end(String(payload ?? ''));
    }
    return adapted;
  }) as VercelResponse['send'];
  return adapted;
}

function attachApi(server: {
  middlewares: {
    use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void | Promise<void>) => void;
  };
}) {
  server.middlewares.use(async (req, res, next) => {
    const url = req.url || '';
    if (!url.startsWith('/api/')) {
      next();
      return;
    }

    const parsed = new URL(url, 'http://localhost');
    const query: Record<string, string | string[]> = {};
    parsed.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    let body: unknown = {};
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const raw = await readRawBody(req);
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch {
          body = raw;
        }
      }
    }

    const vercelReq = Object.assign(req, {
      query,
      body,
      cookies: {},
    }) as unknown as VercelRequest;

    const vercelRes = adaptResponse(res);

    try {
      const pathname = parsed.pathname.replace(/\/$/, '') || '/';
      let handler: ApiHandler | null = null;
      if (pathname === '/api/auth/login') {
        handler = (await import('../api/auth/login')).default;
      } else if (pathname === '/api/auth/password') {
        handler = (await import('../api/auth/password')).default;
      } else if (pathname === '/api/content') {
        handler = (await import('../api/content')).default;
      } else if (pathname === '/api/contact') {
        handler = (await import('../api/contact')).default;
      } else if (pathname === '/api/backup') {
        handler = (await import('../api/backup')).default;
      } else if (pathname === '/api/videos/upload') {
        handler = (await import('../api/videos/upload')).default;
      }

      if (!handler) {
        send(res, 404, { error: { code: 'NOT_FOUND', message: 'Unknown API route' } });
        return;
      }
      await handler(vercelReq, vercelRes);
      if (!res.writableEnded) {
        res.end();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal error';
      send(res, 500, { error: { code: 'INTERNAL', message } });
    }
  });
}

export function localApiPlugin(): Plugin {
  return {
    name: 'kmci-local-api',
    configureServer(server) {
      attachApi(server);
    },
    configurePreviewServer(server) {
      attachApi(server);
    },
  };
}
