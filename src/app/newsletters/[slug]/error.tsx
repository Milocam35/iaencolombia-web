'use client';
export default function NewsletterError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-2xl px-6 py-24"><h1 className="text-3xl font-bold text-primary">No pudimos cargar la edición</h1><p className="my-6">Intenta nuevamente más tarde.</p><button className="rounded bg-primary px-5 py-3 text-white" onClick={reset}>Reintentar</button></main>;
}
