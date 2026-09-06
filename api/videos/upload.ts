import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { parseBearer, verifyAdminJwt } from '../_lib/auth';
import { readBody, sendError, sendJson } from '../_lib/http';

const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024;
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.avi'];

function hasValidExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Only POST is allowed');
  }

  const token = parseBearer(req);
  if (!token) {
    return sendError(res, 401, 'AUTH_REQUIRED', 'Missing Authorization bearer token');
  }

  const ok = await verifyAdminJwt(token);
  if (!ok) {
    return sendError(res, 401, 'AUTH_INVALID', 'Invalid token');
  }

  const body = readBody(req);
  const filename = typeof body.filename === 'string' ? body.filename : '';
  const contentType = typeof body.contentType === 'string' ? body.contentType : '';
  const sizeBytes = typeof body.sizeBytes === 'number' ? body.sizeBytes : NaN;
  const dataBase64 = typeof body.dataBase64 === 'string' ? body.dataBase64 : '';

  if (!filename) {
    return sendError(res, 400, 'VALIDATION', 'filename is required');
  }
  if (!contentType) {
    return sendError(res, 400, 'VALIDATION', 'contentType is required');
  }
  if (!ALLOWED_TYPES.includes(contentType)) {
    return sendError(res, 415, 'UNSUPPORTED_TYPE', 'Only MP4, MOV, AVI are allowed');
  }
  if (Number.isNaN(sizeBytes) || sizeBytes <= 0) {
    return sendError(res, 400, 'VALIDATION', 'sizeBytes must be a positive number');
  }
  if (sizeBytes > MAX_SIZE_BYTES) {
    return sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'Max size is 2GB per video');
  }
  if (!hasValidExtension(filename)) {
    return sendError(res, 415, 'UNSUPPORTED_EXTENSION', 'Filename must end with .mp4, .mov, or .avi');
  }
  if (!dataBase64) {
    return sendError(res, 400, 'VALIDATION', 'dataBase64 is required');
  }

  try {
    const buffer = Buffer.from(dataBase64, 'base64');
    const blob = await put(`sermons/${Date.now()}-${filename}`, buffer, {
      access: 'public',
      contentType,
    });

    return sendJson(res, 200, {
      uploadUrl: blob.url,
      constraints: {
        maxSizeBytes: MAX_SIZE_BYTES,
        allowedTypes: ALLOWED_TYPES,
      },
    });
  } catch {
    return sendError(res, 500, 'STORAGE_ERROR', 'Failed to create upload URL');
  }
}
