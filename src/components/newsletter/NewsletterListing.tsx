import Link from 'next/link';
import type { PublicNewsletter } from '@/lib/newsletters';
import { NewsletterCards } from './NewsletterCards';
export function NewsletterListing({items,page=1}:{items:PublicNewsletter[] | null;page?:number}) {
  return <section className="mx-auto max-w-screen-xl px-6 py-20"><p className="font-mono text-xs uppercase tracking-[.24em] text-primary/60">ACIA al día</p><h1 className="mt-4 font-serif text-4xl text-primary sm:text-5xl">Newsletters</h1><p className="my-8 max-w-2xl leading-7 text-muted-foreground">Una mirada a la inteligencia artificial desde Colombia. Lectura pública, sin cuenta ni contraseña.</p>
    {items?.length ? <NewsletterCards items={items} /> : <p role="status">{items ? 'No hay ediciones públicas en esta página.' : 'No fue posible cargar las ediciones. Intenta nuevamente más tarde.'}</p>}
    <nav aria-label="Páginas de newsletters" className="mt-10 flex justify-between text-sm font-semibold text-primary">{page > 1 ? <Link href={`/newsletters?page=${page - 1}`}>← Anteriores</Link> : <span />}{items?.length === 12 && <Link href={`/newsletters?page=${page + 1}`}>Más ediciones →</Link>}</nav>
  </section>;
}
