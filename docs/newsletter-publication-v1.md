# Newsletter público: primer bloque

Backend autoritativo: `GET /public/newsletters` y `GET /public/newsletters/{slug}`.
Rutas web `/newsletters` y `/newsletters/{slug}`. La landing consume las tres últimas
ediciones públicas. No hay artículos nuevos guardados manualmente en esta web.

Requiere desplegar previamente la migración y API del bloque editorial de plataforma.
Preservar `NEXT_PUBLIC_ACIA_API_URL` y las opciones actuales de afiliación, Bold y Comunidad.
No cambiar el webhook Elestio desde este repositorio. El despliegue Vercel es independiente.

La lectura dinámica `no-store` evita publicar por build y conservar artículos retirados
en caché. La landing pasa a SSR; observar latencia y uso de funciones. Las peticiones se
limitan a cinco segundos y no contienen JWT, cookies ni datos de destinatarios.

El identificador público de revisión en el HTML servirá al gate de disponibilidad de
campañas futuras. Este release no envía correos ni modifica suscripciones.

`src/components/newsletter/NewsletterArticle.tsx` y su CSS deben ser idénticos al contrato
de presentación en Admin/Mi ACIA. HTML crudo e imágenes no están admitidos inicialmente.
Cambiar formato requiere revisión visual de móvil/escritorio en los tres clientes.

Rollback: volver al frontend anterior junto con el rollback coordinado del backend,
conservando la base y los consentimientos. La web nueva no debe quedar dependiendo de
endpoints ausentes en un backend anterior.
