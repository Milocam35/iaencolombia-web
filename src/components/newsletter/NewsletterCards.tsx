import Link from 'next/link';
import type { PublicNewsletter } from '@/lib/newsletters';

export function NewsletterCards({ items }: { items: PublicNewsletter[] }) {
  return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <Link key={item.id} href={`/newsletters/${item.slug}`} className="group flex flex-col border border-primary/15 bg-white p-7 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
    <div className="flex items-center justify-between border-b border-primary/10 pb-5 text-xs text-primary/60"><span className="font-mono">ACIA AL DÍA</span><span className="text-accent">{item.edition_number ? `Edición ${String(item.edition_number).padStart(2, '0')}` : ''}</span></div>
    <h3 className="mt-7 font-serif text-3xl leading-tight text-primary">{item.title}</h3>
    <p className="mt-5 flex-1 text-sm leading-7 text-muted-foreground">{item.summary}</p>
    <div className="mt-8 flex flex-wrap justify-between gap-3 text-xs text-primary"><time dateTime={item.first_published_at}>{new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeZone: 'America/Bogota' }).format(new Date(item.first_published_at))}</time><span className="font-bold">Leer edición →</span></div>
  </Link>)}</div>;
}
