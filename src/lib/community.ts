import { ACIA_API_URL } from '@/lib/config';
export const COMMUNITY_CONSENT_VERSION = 'community-communications-2026-11-13';

export const COMMUNITY_CONSENT = 'Quiero unirme a Comunidad ACIA y recibir por correo sus newsletters y comunicaciones sobre noticias, actividades, eventos, formación y oportunidades. Puedo darme de baja en cualquier momento.';
export const COMMUNITY_HELP = 'Comunidad es una suscripción gratuita a las comunicaciones de ACIA. No incluye acceso a Mi ACIA ni beneficios privados.';
export const COMMUNITY_REQUIREMENT = 'Para unirte a Comunidad, completa los campos obligatorios y marca por separado privacidad y la suscripción a comunicaciones. Una baja o supresión anterior se conserva; volver a suscribirte requiere verificar tu correo.';

export function communityRegistrationMessage(): string {
  return 'Recibimos tu registro y autorización de newsletters y comunicaciones de ACIA. No necesitas confirmar por correo para una nueva suscripción. Si esta dirección tenía una baja o supresión, se conserva: utiliza la opción de volver a suscribirte cuando corresponda. Comunidad no incluye acceso a Mi ACIA ni beneficios privados.';
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
