import Link from 'next/link';
import { listNewsletters } from '@/lib/newsletters';
import { NewsletterCards } from '@/components/newsletter/NewsletterCards';

export async function NewslettersSection() {
  // A mail/backend outage must not take the institutional homepage offline.
  const items = await listNewsletters(3).catch(() => null);
  return <section id="newsletters" className="bg-white px-6 py-20 sm:py-28"><div className="mx-auto max-w-screen-xl">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono text-xs uppercase tracking-[.24em] text-primary/60">ACIA al día</p><h2 className="mt-4 font-serif text-4xl text-primary sm:text-5xl">Ideas que merecen una conversación.</h2><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">Lecturas, análisis y señales de inteligencia artificial para nuestra comunidad.</p></div><Link className="border-b-2 border-accent pb-2 text-sm font-bold text-primary" href="/newsletters">Todas las ediciones →</Link></div>
    {items?.length ? <NewsletterCards items={items} /> : <p className="border-t border-primary/10 pt-6 text-sm text-muted-foreground">{items ? 'Aquí encontrarás las próximas ediciones públicas de ACIA al día.' : 'Las ediciones no están disponibles temporalmente. Puedes volver a consultarlas más tarde.'}</p>}
  </div></section>;
}
