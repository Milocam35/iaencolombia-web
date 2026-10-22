import { ACIA_API_URL } from '@/lib/config';
export const COMMUNITY_CONSENT_VERSION = 'community-communications-2026-10-22';

export const COMMUNITY_CONSENT = 'Autorizo voluntariamente recibir comunicaciones y newsletters de ACIA por correo electrónico. Puedo darme de baja cuando quiera. Esta autorización no concede acceso a Mi ACIA ni otros beneficios privados.';

export function communityRegistrationMessage(consent: boolean): string {
  return consent
    ? 'Hemos recibido tu registro en Comunidad. La suscripción necesita confirmar tu correo; aún no está habilitada para newsletters. Si ya te habías dado de baja, utiliza la opción de volver a suscribirte. Comunidad no incluye acceso a Mi ACIA.'
    : 'Hemos recibido tu registro en Comunidad. No has autorizado newsletters. El registro no incluye acceso a Mi ACIA ni otros beneficios privados.';
}

export function takeCommunityToken(): string | null {
  const value = new URLSearchParams(window.location.hash.slice(1)).get('token');
  window.history.replaceState(null, '', window.location.pathname);
  return value && /^[A-Za-z0-9_-]{32,128}$/.test(value) ? value : null;
}

export async function communityRequest(path: 'request' | 'confirm' | 'unsubscribe', payload: object): Promise<string> {
  const response = await fetch(`${ACIA_API_URL}/public/community/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store',
  });
  if (!response.ok) throw new Error(response.status === 429 ? 'Demasiados intentos. Intenta más tarde.' : response.status === 400 ? 'El enlace no está disponible. Solicita uno nuevo.' : 'No fue posible completar la solicitud. Intenta nuevamente.');
  const body = await response.json() as { message: string };
  return body.message;
}
