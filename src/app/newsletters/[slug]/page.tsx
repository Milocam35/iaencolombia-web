import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NewsletterArticle } from '@/components/newsletter/NewsletterArticle';
import { getNewsletter } from '@/lib/newsletters';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsletter(slug);
  if (!item) return { title: 'Publicación no disponible | ACIA', robots: { index: false, follow: false } };
  const url = `https://iaencolombia.org/newsletters/${item.slug}`;
  return { title: `${item.title} | ACIA al día`, description: item.summary.slice(0, 180), alternates: { canonical: url },
    openGraph: { type: 'article', title: item.title, description: item.summary, url, publishedTime: item.first_published_at, modifiedTime: item.published_at },
    twitter: { card: 'summary', title: item.title, description: item.summary.slice(0, 180) } };
}

export default async function NewsletterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsletter(slug);
  if (!item) notFound();
  const structured = { '@context': 'https://schema.org', '@type': 'Article', headline: item.title, description: item.summary,
    datePublished: item.first_published_at, dateModified: item.published_at, mainEntityOfPage: `https://iaencolombia.org/newsletters/${item.slug}`,
    author: { '@type': 'Organization', name: 'ACIA' }, publisher: { '@type': 'Organization', name: 'Asociación Colombiana de Inteligencia Artificial' } };
  return <><Header /><main className="bg-surface px-3 pb-16 pt-32 sm:px-6" data-newsletter-revision={item.revision_id}>
    <div className="mx-auto mb-6 max-w-[980px]"><Link className="text-sm font-semibold text-primary underline" href="/newsletters">← Todas las ediciones</Link></div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }} />
    <NewsletterArticle article={item} />
    <div className="mx-auto mt-6 max-w-[980px] text-sm text-muted-foreground"><Link className="underline" href="/comunidad/preferencias">Preferencias de comunicaciones</Link></div>
  </main><Footer /></>;
}
