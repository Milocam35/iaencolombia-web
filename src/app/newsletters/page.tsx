import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NewsletterListing } from '@/components/newsletter/NewsletterListing';
import { listNewsletters } from '@/lib/newsletters';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'ACIA al día · Newsletters', description: 'Análisis y señales de inteligencia artificial para la comunidad ACIA.', alternates: { canonical: '/newsletters' } };

export default async function NewslettersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const query = await searchParams;
  const page = /^\d{1,4}$/.test(query.page ?? '') ? Math.max(1, Math.min(1000, Number(query.page))) : 1;
  const items = await listNewsletters(12, (page - 1) * 12).catch(() => null);
  return <><Header/><main className="pt-24"><NewsletterListing items={items} page={page}/></main><Footer/></>;
}
