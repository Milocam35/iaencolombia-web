import { cache } from 'react';
import { ACIA_API_URL } from './config';

export interface PublicNewsletter {
  id: string; slug: string; revision_id: string; version: number; title: string;
  summary: string; published_at: string; first_published_at: string; url: string;
  content_markdown: string;
}

async function read(path: string): Promise<unknown> {
  const response = await fetch(`${ACIA_API_URL}/public/newsletters${path}`, {
    cache: 'no-store', signal: AbortSignal.timeout(5000), headers: { Accept: 'application/json' },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Las publicaciones no están disponibles temporalmente.');
  return response.json();
}

export async function listNewsletters(limit = 12, offset = 0): Promise<PublicNewsletter[]> {
  const result = await read(`?limit=${limit}&offset=${offset}`);
  return Array.isArray(result) ? result as PublicNewsletter[] : [];
}

export const getNewsletter = cache(async (slug: string): Promise<PublicNewsletter | null> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 180) return null;
  return await read(`/${encodeURIComponent(slug)}`) as PublicNewsletter | null;
});
