import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { del, list, put } from '@vercel/blob';
import type { IEvent, INewsItem, ISermon } from '../../src/types';
import { DEFAULT_EVENTS, DEFAULT_NEWS, DEFAULT_SERMONS } from './defaults';

export interface AuthRecord {
  salt: string;
  hash: string;
  tokenVersion: number;
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
  delivered: boolean;
}

export interface AppStore {
  events: IEvent[];
  announcements: INewsItem[];
  sermons: ISermon[];
  contacts: ContactMessage[];
  auth: AuthRecord;
}

const BLOB_PATH = 'kmci/store.json';
const EMPTY_AUTH: AuthRecord = { salt: '', hash: '', tokenVersion: 1 };
const MAX_LOCAL_STORE_BYTES = 1024 * 1024;

function seedStore(): AppStore {
  return {
    events: DEFAULT_EVENTS,
    announcements: DEFAULT_NEWS,
    sermons: DEFAULT_SERMONS,
    contacts: [],
    auth: { ...EMPTY_AUTH },
  };
}

function projectRootDir(): string {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, '..', '..');
  } catch {
    return process.cwd();
  }
}

function runtimeFilePath(): string {
  if (process.env.VERCEL) return path.join('/tmp', 'kmci-store.json');
  return path.join(projectRootDir(), 'data', 'kmci-store.json');
}

function bundledDataFilePath(): string | null {
  if (!process.env.VERCEL) return null;
  return path.join(projectRootDir(), 'data', 'kmci-store.json');
}

async function readFromFile(pathToFile: string): Promise<AppStore | null> {
  try {
    const file = await fs.readFile(pathToFile, 'utf8');
    return normalize(JSON.parse(file) as Partial<AppStore>);
  } catch {
    return null;
  }
}

function localFilePath(): string {
  return runtimeFilePath();
}

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function normalize(raw: Partial<AppStore> | null | undefined): AppStore {
  const seed = seedStore();
  return {
    events: Array.isArray(raw?.events) ? raw!.events : seed.events,
    announcements: Array.isArray(raw?.announcements) ? raw!.announcements : seed.announcements,
    sermons: Array.isArray(raw?.sermons) ? raw!.sermons : seed.sermons,
    contacts: Array.isArray(raw?.contacts) ? raw!.contacts : [],
    auth: {
      salt: raw?.auth?.salt || '',
      hash: raw?.auth?.hash || '',
      tokenVersion: typeof raw?.auth?.tokenVersion === 'number' ? raw.auth.tokenVersion : 1,
    },
  };
}

async function readFromFs(): Promise<AppStore | null> {
  const runtime = await readFromFile(runtimeFilePath());
  if (runtime) return runtime;
  const bundled = bundledDataFilePath();
  if (bundled) return readFromFile(bundled);
  return null;
}

async function writeToFs(store: AppStore): Promise<void> {
  const body = JSON.stringify(store, null, 2);
  if (Buffer.byteLength(body, 'utf8') > MAX_LOCAL_STORE_BYTES) {
    throw new Error('Store data exceeds safe size limit (1MB) — check for oversized embedded image data in events or remove old entries.');
  }
  const file = localFilePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body, 'utf8');
}

async function readFromBlob(): Promise<AppStore | null> {
  try {
    const listed = await list({ prefix: BLOB_PATH });
    const blob = listed.blobs.find((b) => b.pathname === BLOB_PATH) || listed.blobs[0];
    if (!blob) return null;
    const res = await fetch(blob.url);
    if (!res.ok) return null;
    return normalize((await res.json()) as Partial<AppStore>);
  } catch {
    return null;
  }
}

async function writeToBlob(store: AppStore): Promise<void> {
  const body = JSON.stringify(store);
  const options = {
    access: 'private' as const,
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  };
  try {
    await put(BLOB_PATH, body, options);
  } catch {
    const listed = await list({ prefix: 'kmci/' });
    if (listed.blobs.length) {
      await del(listed.blobs.map((b) => b.url));
    }
    await put(BLOB_PATH, body, { access: 'private', contentType: 'application/json', addRandomSuffix: false });
  }
}

let chain: Promise<unknown> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export async function readStore(): Promise<AppStore> {
  return enqueue(async () => {
    if (hasBlobToken()) {
      const fromBlob = await readFromBlob();
      if (fromBlob) return fromBlob;
    }
    const fromFs = await readFromFs();
    if (fromFs) return fromFs;
    const seeded = seedStore();
    if (hasBlobToken()) await writeToBlob(seeded);
    else await writeToFs(seeded);
    return seeded;
  });
}

export async function writeStore(store: AppStore): Promise<void> {
  return enqueue(async () => {
    const normalized = normalize(store);
    if (hasBlobToken()) await writeToBlob(normalized);
    else await writeToFs(normalized);
  });
}

export async function updateStore(mutator: (current: AppStore) => AppStore): Promise<AppStore> {
  return enqueue(async () => {
    let current: AppStore | null = null;
    if (hasBlobToken()) current = await readFromBlob();
    if (!current) current = await readFromFs();
    if (!current) current = seedStore();
    const next = normalize(mutator(current));
    if (hasBlobToken()) await writeToBlob(next);
    else await writeToFs(next);
    return next;
  });
}
