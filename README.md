# ACIA — Web pública

Sitio web oficial de la **Asociación Colombiana de Inteligencia Artificial** (ACIA), disponible en [iaencolombia.org](https://iaencolombia.org).


**Ajustes de la opción 3 · 1/11/2026:** [resultado, pruebas y fotos seleccionadas](docs/AJUSTES-OPCION3-20261101.md) · [comparación con la versión aprobada](review-acia-opcion3/ajustes-20261101/REVIEW.html). Versión aprobada definitivamente por el propietario el 1/11/2026. Publicación pendiente.

**Opción 3 · revisión local:** [informe y pruebas](docs/OPCION-3-REVISION.md) · [galería antes/después](review-acia-opcion3/REVIEW.html) · [procedencia de imágenes](ASSETS_ACIA_OPCION3.md). Rama aislada `ux/opcion3-20261030`, basada en la segunda iteración autorizada. Sin commit ni despliegue.

**Segunda iteración UX/UI:** [informe, comparación, pruebas y pendientes](docs/ITERACION-2.md). [Primera iteración: archivo de revisión](docs/REVISION-LOCAL.md). Rama `ux/public-redesign-20261028`, base `041d503`. La evidencia histórica se conserva. Para probar sin envíos reales, utilizar el servidor simulado y las instrucciones del informe.

## Configuración pública

- Accesos canónicos (Mi ACIA en encabezado; Admin en pie): Mi ACIA (`https://mi.iaencolombia.org`) y Admin (`https://admin.iaencolombia.org`), definidos explícitamente en `src/lib/config.ts`.
- `NEXT_PUBLIC_ACIA_API_URL`: URL base pública del backend FastAPI, sin barra final. Es necesaria para enviar el formulario de `/afiliate` y no contiene secretos.

## Afiliación pública y Bold Checkout V1

La experiencia pública mantiene un único recorrido: todos los CTA “Afíliate” llevan a `/afiliate`, las tarjetas añaden `?plan=<plan_code>` y el mismo formulario registra el prospecto antes de cualquier pago.

El plan empieza sin seleccionar, incluso al llegar desde una tarjeta; el parámetro `plan` orienta el tipo de vinculación. Es obligatorio elegir un plan del tipo seleccionado. Cambiar el tipo reinicia el plan, conserva los datos de contacto entre personas, empresas e instituciones y muestra un aviso visual. El mensaje es opcional.

Con pagos habilitados, los siete planes de tarifa fija continúan directamente a Bold. Solo Comunidad / Freemium y Gran empresa terminan en una solicitud sin checkout. Las entidades públicas y embajadas tienen contacto directo por correo para gestionar su alianza estratégica.

### Feature gate

- `NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_ENABLED=false`: gate frontend equivalente para Next.js a `VITE_BOLD_MEMBERSHIP_PAYMENTS_ENABLED`. Solo `true`, tras normalizar espacios y mayúsculas, activa el checkout; ausente, vacío o cualquier otro valor permanece fail-closed.
- `NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_SANDBOX_NOTICE_ENABLED=false`: muestra la indicación discreta de sandbox únicamente cuando se habilita explícitamente. Nunca se infiere el ambiente mediante la identity key.

Con el gate principal desactivado, la landing conserva el copy tradicional de sus CTA y no se carga ni abre Bold. Los planes de tarifa fija muestran que el pago no está disponible y bloquean el envío antes de registrar un prospecto; no se convierten en solicitudes sin pago. Comunidad / Freemium y Gran empresa conservan su solicitud. La habilitación es una variable de build/deploy de Vercel; no contiene secretos. El gate frontend no sustituye `BOLD_PAYMENTS_ENABLED` ni `online_payment_enabled` del backend.

### Contrato y rutas

- `POST /public/affiliation-prospects`: conserva el payload actual, incluidos `privacy_accepted` y el honeypot `website`. Al `202`, `payment_context` permanece solo en memoria durante el flujo.
- `POST /public/membership-payments/bold/checkout`: recibe exclusivamente `payment_context` y `plan_code`. El frontend nunca envía ni calcula el monto o la firma.
- `/afiliate/pago/resultado`: consulta `GET /public/membership-payments/{public_token}`; no confía en parámetros de retorno de Bold.

Los planes fijos muestran “Afiliarme y pagar” cuando el gate está activo; Comunidad usa “Afiliarme gratis” y los planes negociados usan “Solicitar afiliación”. Esta clasificación describe el tarifario visible, no replica `online_payment_enabled`: el backend sigue siendo la autoridad final.

### Loader, resultado y almacenamiento temporal

El loader añade una sola vez el script oficial `https://checkout.bold.co/library/boldPaymentButton.js`. `BoldCheckout` se construye únicamente con `apiKey`, `orderId`, `amount`, `currency`, `integritySignature`, `description`, `redirectionUrl` y el `originUrl` opcional recibidos del backend.

Después de crear una orden (`201`) y antes de `checkout.open()`, el frontend guarda en `sessionStorage` un envelope versionado con timestamp y únicamente el payload seguro de checkout: `apiKey`, `orderId`, `amount`, `currency`, `integritySignature`, `description`, `redirectionUrl`, el `originUrl` opcional y `publicToken`. El TTL es de 30 minutos. La lectura exige schema cerrado, identificadores y firma válidos, moneda COP y URLs HTTPS; cualquier valor inválido, alterado o vencido se elimina. Nunca se persisten `payment_context`, datos del formulario, PII ni secretos, y no se usa `localStorage`.

El checkout preparado se rehidrata únicamente cuando el feature gate de pagos está activo. Mientras exista, `/afiliate` muestra solo la opción de reabrir Bold, sin repetir el POST del prospecto ni el POST de checkout; iniciar otra afiliación exige abandonar explícitamente la vista recuperable. Cerrar Bold no borra la sesión. La página de resultado conserva tanto el token como el checkout durante estados `created`/`pending` y elimina ambos cuando el backend informa `approved`, `rejected`, `cancelled` o `expired`.

`originUrl` sigue siendo un valor HTTPS definido por el backend dentro de la configuración segura; el frontend no configura `BOLD_ORIGIN_URL` ni supone que Bold ejecutará un callback JavaScript. La persistencia temporal existe precisamente porque Bold puede navegar fuera de la página y el componente React puede montarse de nuevo tras retorno o reload.

### Sandbox y producción

Para un sandbox integrado:

1. desplegar el frontend con ambos flags frontend en `true`;
2. apuntar `NEXT_PUBLIC_ACIA_API_URL` al API sandbox autorizado;
3. configurar en el backend sandbox el redirect HTTPS exacto `/afiliate/pago/resultado`, llaves TEST y sus gates propios;
4. usar una submission nueva para cada prueba y confirmar el estado mediante el webhook sandbox.

No activar los flags frontend en producción hasta completar prueba E2E sandbox, decisión fiscal, límites operativos, monitoreo y autorización separada. Sigue abierto el P2 backend conocido: si la primera respuesta del prospecto se pierde, el retry deduplicado recibe una capability señuelo y no puede continuar al pago. No se consulta por email ni se debilita anti-enumeración; este P2 es gate pendiente para el GO final de pagos públicos.

---

## Interfaz pública

Next.js 16.1.6 (App Router), React 19.2.3, TypeScript y Tailwind CSS 4. Paleta institucional `#080820`, `#041D77`, `#4EC7F0`. Se conservan Plus Jakarta Sans y JetBrains Mono; los énfasis editoriales usan Georgia.

- `src/app/page.tsx`: composición de portada; mantiene las rutas existentes y la sección editorial conectada.
- `src/components/layout`: encabezado, pie y páginas informativas compartidos.
- `src/components/sections`: hero, ticker, perfiles, beneficios, video, Universo, alianzas, planes y contenido institucional.
- `src/app/public-experience.css`: diseño responsive, foco, contraste y movimiento reducido.
- `src/data/publicExperience.ts`: noticias editoriales, alianzas y recurso audiovisual pendiente.
- `src/lib/membershipPlans.ts`: fuente comercial existente, sin modificaciones.
- `src/lib/newsletters.ts`, `community.ts`, `newsletterPreferences.ts`: contratos existentes, sin modificaciones.
- `scripts/public-experience.browser.cjs`: QA local con bloqueo de red externa y envíos interceptados.
- `scripts/review`: servidor de fixtures de solo lectura e integridad de archivos críticos.

El menú prioriza Afíliate. Mi ACIA conserva su destino y el acceso administrativo queda en el pie. Marketplace se identifica en construcción y Universo como plataforma existente. El video permanece oculto en producción hasta aprobación del material.

## Comandos

```powershell
npm ci
npm run lint
npx tsc --noEmit --incremental false
npm test
npm run test:member-access
npm run build
```

Para desarrollo, compilación y pruebas visuales sin efectos reales, seguir [Revisión local](docs/REVISION-LOCAL.md#repetir-la-revisión-local). Los metadatos, canonical, noindex, consentimiento y comportamiento de afiliación/pago se conservan.
