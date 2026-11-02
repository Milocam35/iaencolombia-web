# Corrección de seguridad Next.js — 2 de noviembre de 2026

La revisión de `iaencolombia-web` identificó Next.js 16.1.6 y sharp 0.34.5 en el lockfile. La versión de Next tenía varios avisos críticos, incluidos procesamiento de imágenes, escenarios Windows y funciones `use cache`. El sitio usa App Router y next/image; no usa funciones `use cache` ni Server Actions propias y conserva `dangerouslyAllowSVG=false` por defecto. No se intentó explotar ninguna vulnerabilidad ni se inspeccionó producción para determinar incidentes.

## Cambios

- Next.js 16.4.4 y eslint-config-next 16.4.4 fijados exactamente.
- sharp 0.35.5 resuelto por la dependencia opcional de Next, sin override.
- source-map-js 1.2.2 mediante actualización compatible dentro de ^1.2.1. Corrige el aviso alto restante en la cadena Next → PostCSS → source-map-js.
- React/React DOM permanecen en 19.2.3. No se modificaron páginas, formularios, planes, Bold, consentimiento, baja, newsletter ni estilos.
- CI incorpora `npm audit --omit=dev --audit-level=high` y una comprobación del servidor construido y de su optimizador nativo mediante peticiones GET a 127.0.0.1.

No se utilizó `npm audit fix --force` ni se desactivó TLS ni se añadieron excepciones a controles de seguridad.

## Validación

- Auditoría de dependencias de producción: **0 vulnerabilidades conocidas** en el registro consultado.
- Auditoría completa: quedan **7 avisos en herramientas de desarrollo (5 altos y 2 moderados)**. No equivale a una auditoría global sin hallazgos; se mantienen fuera de esta corrección de dependencias de producción.
- 47 pruebas web, navegación de afiliación/Mi ACIA, lint sin errores y build de producción local. Permanece el aviso previo de Next sobre img de la portada; la imagen controlada del backend se conserva sin cambios.
- Servidor Next local construido: rutas de afiliación, resultado de pago y preferencias devuelven HTML 200; optimización real del recurso local hero.webp devuelve una imagen 200. No se hacen POSTs ni se generan tokens ni se crean registros de negocio. El proceso propio termina y se comprueba el cierre de su puerto.
- Se repitió la validación tras el parche de source-map-js porque cambió el lockfile; no se alteraron límites de tiempo ni tests para obtener PASS.
- El CI del HEAD final del Draft PR debe aprobar antes de cualquier merge. La evidencia anterior al cambio de dependencias no se usa como certificación del nuevo HEAD.

## Publicación y rollback

Corrección incorporada como commit separado en la entrega de la web del PR 18, conservando tablas y portada. No requiere migraciones, secretos, cambios SMTP o reinicios de API/worker de Elestio. Se mantiene el procedimiento coordinado de la entrega Newsletter y la autorización humana antes de merge/deploy; un merge a main puede disparar Vercel Production.

Preparar una vista previa Vercel del HEAD corregido y comprobar navegación, lectura pública, imágenes y preferencias antes de promoverlo. No publicar piezas ni enviar correos como parte de esta corrección. No volver silenciosamente a Next 16.1.6 si falla una publicación: restauraría vulnerabilidades conocidas. Conservar el despliegue anterior como referencia operativa y decidir una recuperación segura según el fallo; preferir corrección hacia delante sobre la versión parcheada.

No se hicieron merge, despliegues ni cambios productivos para esta corrección.

## Fuentes

- https://github.com/vercel/next.js/releases/tag/v16.4.4
- https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw
- https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4
- https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr
- https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36
- https://github.com/advisories/GHSA-68fv-2mgg-jv7q
