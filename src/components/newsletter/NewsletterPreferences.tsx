'use client';
import { useEffect, useRef, useState } from 'react';
import { takeCommunityToken } from '@/lib/community';
import { unsubscribeNewsletter } from '@/lib/newsletterPreferences';

export function NewsletterPreferences() {
  const token=useRef<string | null>(null);
  const loaded=useRef(false);
  const [available,setAvailable]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  useEffect(()=>{
    if (!loaded.current) { loaded.current=true;token.current=takeCommunityToken();setAvailable(Boolean(token.current)); }
  },[]);
  async function unsubscribe() {
    if (!token.current || busy) return;
    setBusy(true);setError('');
    try {
      await unsubscribeNewsletter(token.current);
      token.current=null;setAvailable(false);
      setMessage('La baja de newsletters quedó registrada. Tus servicios y correos transaccionales no cambian.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Intenta nuevamente más tarde.'); }
    finally { setBusy(false); }
  }
  return <main data-newsletter-preferences="v1" className="min-h-[75vh] bg-surface px-5 py-24"><div className="mx-auto max-w-xl">
    <p className="font-serif text-xl text-primary">ACIA al día</p><h1 className="mt-5 text-3xl font-bold text-primary">Preferencias del newsletter</h1>
    <p className="mt-6 leading-7 text-muted-foreground">Puedes dejar de recibir el boletín sin iniciar sesión. La baja no modifica tu afiliación ni tu acceso a Mi ACIA.</p>
    {available ? <button type="button" className="mt-8 rounded bg-primary px-6 py-4 font-semibold text-white disabled:opacity-50" disabled={busy} onClick={()=>void unsubscribe()}>{busy?'Registrando…':'Confirmar baja de newsletters'}</button>
      : !message && <p className="mt-8 rounded border border-border bg-white p-6">Abre «Preferencias» o «Cancelar suscripción» en el correo que recibiste. Si necesitas ayuda, escribe a <a className="underline" href="mailto:contacto@iaencolombia.org">contacto@iaencolombia.org</a>.</p>}
    {message && <p role="status" className="mt-8 border-l-2 border-accent p-5">{message}</p>}
    {error && <p role="alert" className="mt-8 text-red-700">{error}</p>}
  </div></main>;
}
