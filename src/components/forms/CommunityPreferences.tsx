'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { COMMUNITY_CONSENT, COMMUNITY_CONSENT_VERSION, communityRequest, takeCommunityToken } from '@/lib/community';

export function CommunityPreferences({ confirm = false }: { confirm?: boolean }) {
  const token = useRef<string | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [action, setAction] = useState<'confirm' | 'resubscribe' | 'unsubscribe'>('unsubscribe');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const loaded = useRef(false);
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      token.current = takeCommunityToken();
      setHasToken(Boolean(token.current));
    }
  }, []);
  async function performTokenAction() {
    if (!token.current || busy) return;
    setBusy(true); setError('');
    try {
      await communityRequest(confirm ? 'confirm' : 'unsubscribe', { token: token.current });
      setMessage(confirm ? 'La acción de confirmación quedó registrada. Puedes gestionar tu suscripción o solicitar una baja desde esta página.' : 'La baja quedó registrada. Tu registro en Comunidad se conserva y tus afiliaciones no cambian.');
      token.current = null; setHasToken(false);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No fue posible completar la acción.'); }
    finally { setBusy(false); }
  }
  async function requestLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true); setError(''); setMessage('');
    try {
      setMessage(await communityRequest('request', { email: String(values.get('email') ?? '').trim(), action,
        communications_consent: values.get('communications_consent') === 'on', communications_consent_version: COMMUNITY_CONSENT_VERSION, website: String(values.get('website') ?? '') }));
      form.reset();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No fue posible completar la solicitud.'); }
    finally { setBusy(false); }
  }
  const control = 'mt-2 block w-full rounded-xl border border-border bg-white p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring';
  const button = 'mt-6 inline-flex w-full justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-[#031560] disabled:opacity-50';
  return <main className="min-h-[75vh] bg-surface px-5 py-20 sm:py-28"><div className="mx-auto max-w-xl"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary/60">Comunidad ACIA</p><h1 className="mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">{hasToken ? confirm ? 'Confirma tu suscripción' : 'Tú decides qué recibir' : 'Tus comunicaciones, a tu elección'}</h1><p className="mt-5 leading-7 text-muted-foreground">Gestiona las comunicaciones y newsletters que recibes de ACIA. No necesitas cuenta ni contraseña. Comunidad no incluye acceso a Mi ACIA ni beneficios privados.</p>
    <section className="mt-8 rounded-2xl border border-border bg-white p-6 sm:p-8">
      {hasToken ? <><p className="text-sm leading-6 text-muted-foreground">{confirm ? 'Confirma solo si solicitaste recibir comunicaciones y newsletters en este correo.' : 'Al confirmar, dejarás de recibir comunicaciones y newsletters. Conservaremos tu registro y respetaremos tu decisión.'}</p><button className={button} disabled={busy} onClick={performTokenAction}>{busy ? 'Procesando…' : confirm ? 'Confirmar mi suscripción' : 'Confirmar mi baja'}</button></> : <form onSubmit={requestLink}><label className="block text-sm font-semibold text-primary">Qué deseas hacer<select className={control} value={action} disabled={busy} onChange={e => setAction(e.target.value as typeof action)}><option value="unsubscribe">Darme de baja</option><option value="confirm">Solicitar confirmación de suscripción</option><option value="resubscribe">Volver a suscribirme después de una baja</option></select></label><label className="mt-5 block text-sm font-semibold text-primary">Correo electrónico<input className={control} name="email" type="email" autoComplete="email" maxLength={254} required disabled={busy} /></label><div className="hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" maxLength={500} /></div>{action !== 'unsubscribe' && <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-muted-foreground"><input name="communications_consent" type="checkbox" required className="mt-1 size-4 shrink-0 accent-primary" /><span>{COMMUNITY_CONSENT}</span></label>}<button className={button} disabled={busy}>{busy ? 'Solicitando…' : 'Solicitar enlace por correo'}</button><p className="mt-3 text-xs leading-5 text-muted-foreground">La solicitud no cambia tu suscripción. Debes completar la acción desde el enlace que recibas.</p></form>}
      {message && <p role="status" className="mt-5 border-l-2 border-accent bg-surface p-4 text-sm leading-6 text-primary">{message}</p>}{error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
    </section><Link href="/afiliate?plan=comunidad" className="mt-6 inline-block text-sm font-semibold text-primary underline underline-offset-4">Volver al registro de Comunidad</Link></div></main>;
}
