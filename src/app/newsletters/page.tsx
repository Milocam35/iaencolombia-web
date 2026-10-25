import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicPage } from '@/components/layout/PublicPage';
import { NewsletterCards } from '@/components/newsletter/NewsletterCards';
import { listNewsletters } from '@/lib/newsletters';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'ACIA al día · Newsletters', description: 'Análisis y señales de inteligencia artificial para la comunidad ACIA.', alternates: { canonical: '/newsletters' } };

export default async function NewslettersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const query = await searchParams;
  const page = /^\d{1,4}$/.test(query.page ?? '') ? Math.max(1, Math.min(1000, Number(query.page))) : 1;
  const items = await listNewsletters(12, (page - 1) * 12).catch(() => null);
  return <PublicPage eyebrow="ACIA al día" title="Newsletters" description="Una mirada a la inteligencia artificial desde Colombia. Lectura pública, sin cuenta ni contraseña.">
    {items?.length ? <NewsletterCards items={items} /> : <p role="status">{items ? 'No hay ediciones públicas en esta página.' : 'No fue posible cargar las ediciones. Intenta nuevamente más tarde.'}</p>}
    <nav aria-label="Páginas de newsletters" className="mt-10 flex justify-between text-sm font-semibold text-primary">{page > 1 ? <Link href={`/newsletters?page=${page - 1}`}>← Anteriores</Link> : <span />}{items?.length === 12 && <Link href={`/newsletters?page=${page + 1}`}>Más ediciones →</Link>}</nav>
  </PublicPage>;
}
