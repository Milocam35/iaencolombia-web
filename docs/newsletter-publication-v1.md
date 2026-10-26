# Newsletter público y preferencias

Backend autoritativo: `GET /public/newsletters` y `GET /public/newsletters/{slug}`.
Rutas web `/newsletters` y `/newsletters/{slug}`. La landing consume las tres últimas
ediciones públicas. No hay artículos nuevos guardados manualmente en esta web.

Requiere desplegar previamente la migración y API del bloque editorial de plataforma.
Preservar `NEXT_PUBLIC_ACIA_API_URL` y las opciones actuales de afiliación, Bold y Comunidad.
No cambiar el webhook Elestio desde este repositorio. El despliegue Vercel es independiente.

La lectura dinámica `no-store` evita publicar por build y conservar artículos retirados
en caché. La landing pasa a SSR; observar latencia y uso de funciones. Las peticiones se
limitan a cinco segundos y no contienen JWT, cookies ni datos de destinatarios.

El identificador público de revisión en el HTML y el marcador de
`/newsletters/preferencias` permiten al backend verificar disponibilidad antes de SMTP.
La web no envía correos. La baja exige una confirmación explícita en esa página:
el fragmento se retira de la URL y se remite solo en el cuerpo del POST a
`/public/newsletter-preferences/unsubscribe`. No requiere cuenta ni altera beneficios.
Las tarjetas usan el consecutivo asignado por el backend; no su posición en la lista.

`src/components/newsletter/NewsletterArticle.tsx` y su CSS deben ser idénticos al contrato
de presentación en Admin/Mi ACIA. HTML crudo e imágenes no están admitidos inicialmente.
Cambiar formato requiere revisión visual de móvil/escritorio en los tres clientes.

Desplegar únicamente después de las dos migraciones de newsletter y API/worker
compatibles, inicialmente con `NEWSLETTER_DELIVERY_MODE=disabled`. El paquete
coordinado está en `plataforma-acia/docs/newsletter-release-v1.md`; el webhook Elestio
debe permanecer apagado. Un Draft PR/preview de Vercel no equivale a producción.

Rollback: apagar solo distribución de newsletter. Después de un correo real no se
debe retirar esta ruta ni el endpoint de baja: los enlaces ya recibidos deben seguir
funcionando. Conservar consentimiento, bajas, SMTP y las automatizaciones existentes.
No restaurar un frontend anterior que rompa enlaces distribuidos.
