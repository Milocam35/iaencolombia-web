import { ACIA_API_URL } from '@/lib/config';

export async function unsubscribeNewsletter(token:string):Promise<void> {
  const response=await fetch(`${ACIA_API_URL}/public/newsletter-preferences/unsubscribe`,{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token}),
    cache:'no-store',referrerPolicy:'no-referrer',
  });
  if(!response.ok) throw new Error('No fue posible registrar la baja. Usa el enlace de tu newsletter o intenta más tarde.');
}
