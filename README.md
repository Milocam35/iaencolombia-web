# ACIA — Landing Page

Sitio web oficial de la **Asociación Colombiana de Inteligencia Artificial** (ACIA), disponible en [iaencolombia.org](https://iaencolombia.org).

## Configuración pública

- Accesos canónicos del encabezado: Mi ACIA (`https://mi.iaencolombia.org`) y Admin (`https://admin.iaencolombia.org`), definidos explícitamente en `src/lib/config.ts`.
- `NEXT_PUBLIC_ACIA_API_URL`: URL base pública del backend FastAPI, sin barra final. Es necesaria para enviar el formulario de `/afiliate` y no contiene secretos.

## Afiliación pública y Bold Checkout V1

La experiencia pública mantiene un único recorrido: todos los CTA “Afíliate” llevan a `/afiliate`, las tarjetas añaden `?plan=<plan_code>` y el mismo formulario registra el prospecto antes de cualquier pago.

El plan empieza sin seleccionar, incluso al llegar desde una tarjeta; el parámetro `plan` orienta el tipo de vinculación. Es obligatorio elegir un plan del tipo seleccionado. Cambiar el tipo reinicia el plan, conserva los datos de contacto entre personas, empresas e instituciones y muestra un aviso visual. El mensaje es opcional.

Con pagos habilitados, los siete planes de tarifa fija continúan directamente a Bold. Solo Comunidad / Freemium y Gran empresa terminan en una solicitud sin checkout. Las entidades públicas y embajadas tienen contacto directo por correo para gestionar su alianza estratégica.

### Feature gate

- `NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_ENABLED=false`: gate frontend equivalente para Next.js a `VITE_BOLD_MEMBERSHIP_PAYMENTS_ENABLED`. Solo el valor literal `true` activa el checkout; ausente, vacío o cualquier otro valor permanece fail-closed.
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

## Stack Tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16.1.6 | Framework principal (App Router) |
| React | 19.2.3 | UI runtime |
| TypeScript | ^5 | Tipado estático |
| Tailwind CSS | ^4 | Estilos (CSS-first, sin `tailwind.config.ts`) |
| Framer Motion | ^12 | Animaciones |
| CVA | ^0.7 | Variantes de componentes |
| clsx + tailwind-merge | ^2 / ^3 | Composición de clases |

---

## Estructura del Proyecto

```
iaencolombia-web/
├── public/
│   ├── logos/                        # Variantes del logo ACIA
│   │   ├── ACIA-GIFT.gif             # Logo animado (header)
│   │   ├── LOGO ACIA CIRCULAR FONDO AZUL OSCURO.png    # Favicon
│   │   ├── LOGO ACIA CIRCULAR FONDO BLANCO.png
│   │   ├── LOGO ACIA RECTANGULAR FONDO AZUL OSCURO.png
│   │   ├── LOGO ACIA RECTANGULAR FONDO BLANCO.png
│   │   ├── LOGO ACIA TRANSPARENTE PARA FONDO AZUL OSCURO.png  # Footer
│   │   └── LOGO ACIA TRANSPARENTE PARA FONDO BLANCO.png       # Hero
│   └── sections/                     # Imágenes de secciones (WebP)
│       ├── NewStage.webp
│       ├── Gobernanza.webp
│       ├── Ecosistema.webp
│       ├── Proyectos.webp
│       ├── Convocatoria.webp
│       ├── Eventos.webp
│       ├── Espacio_trabajo.webp
│       └── International.webp
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout, metadatos SEO, fuentes
│   │   ├── page.tsx                  # Página principal (composición de secciones)
│   │   └── globals.css               # @theme Tailwind v4, keyframes, utilidades
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navegación fija, logo animado
│   │   │   └── Footer.tsx            # Footer institucional oscuro
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx       # Hero unificado: logo, título, imagen + nueva etapa, CTAs
│   │   │   ├── PillarsSection.tsx    # Carrusel de los 3 pilares de ACIA
│   │   │   ├── ValueSection.tsx      # Beneficios afiliados (terminal typewriter)
│   │   │   ├── EventsSection.tsx     # Tarjetas de eventos con imágenes
│   │   │   ├── GovernanceSection.tsx  # Internacional (marquee aliados) + Gobernanza (principios)
│   │   │   └── CTASection.tsx        # Llamado a la acción final
│   │   └── ui/
│   │       ├── Button.tsx            # Variantes CVA: default, secondary, outline, ghost
│   │       ├── Container.tsx         # Contenedor centrado con max-width
│   │       ├── SectionWrapper.tsx    # Wrapper con padding y animación de entrada
│   │       ├── FloatingDots.tsx      # Fondo de puntos flotantes animados (Canvas)
│   │       └── CircuitPattern.tsx    # Fondo de circuito electrónico (Canvas)
│   ├── lib/
│   │   ├── utils.ts                  # Utilidad: clsx + tailwind-merge (cn)
│   │   └── constants.ts              # Todo el contenido textual del sitio
│   └── types/                        # Tipos TypeScript compartidos
└── CLAUDE.md                         # Guía de desarrollo e identidad de marca
```

---

## Identidad Visual

### Colores Corporativos

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-dark` | `#080820` | Fondo institucional oscuro |
| `--color-primary` | `#041D77` | Azul corporativo principal |
| `--color-accent` | `#4EC7F0` | Azul celeste — letras I y A del logo |
| `--color-background` | `#FFFFFF` | Fondo claro |
| `--color-foreground` | `#080820` | Texto sobre fondo claro |

### Regla del Logo

- **Sobre blanco:** A y C iniciales → `#041D77` · I y A final → `#4EC7F0`
- **Sobre azul oscuro:** A y C iniciales → `#FFFFFF` · I y A final → `#4EC7F0`
- La I y la A finales **siempre** conservan `#4EC7F0`

### Tipografía

| Variable CSS | Fuente | Uso |
|---|---|---|
| `--font-sans` | Plus Jakarta Sans | Cuerpo, títulos, UI general |
| `--font-mono` | JetBrains Mono | Terminal, bloques de código |

---

## Secciones de la Landing

| Sección | ID | Descripción |
|---|---|---|
| Header | — | Navegación fija. Logo GIF animado. Scroll activo. |
| Hero | `#hero` | Logo centrado, título, badge "Nueva etapa 2026". Split: imagen NewStage + texto nueva etapa + CTAs. Fondo claro con FloatingDots. |
| Qué es ACIA | `#pilares` | Carrusel de los 3 pilares: Gobernanza, Ecosistema, Proyectos. Auto-avance cada 6s. Fondo claro con FloatingDots. |
| Afiliados | `#valor` | Terminal con efecto typewriter. Lista de beneficios de afiliación. Fondo oscuro con CircuitPattern. |
| Eventos | `#eventos` | 4 tarjetas con imagen de cabecera: Convocatorias, Eventos, Mesas técnicas, Internacional. Fondo claro con FloatingDots. |
| Gobernanza | `#gobernanza` | Proyección internacional (marquee aliados) + divider + Gobernanza responsable (principios 2×2). Fondo oscuro con CircuitPattern. |
| Afíliate | `#cta` | CTA final con dos botones. Fondo oscuro con CircuitPattern. |
| Footer | — | Logo ACIA, columnas de navegación, información de contacto. Fondo oscuro. |

---

## Componentes UI Reutilizables

### `Button`
Variantes via CVA: `default` (azul primario), `secondary` (azul claro), `outline` (borde), `ghost` (sin fondo). Tamaños: `sm`, `md`, `lg`.

### `Container`
`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Wrapper estándar de ancho máximo.

### `SectionWrapper`
Envuelve secciones con `py-24 sm:py-32`. Animación `fadeUp` con `useInView` de Framer Motion. Soporte para fondos: `"white"` | `"surface"` | `"dark"`.

### `FloatingDots`
Canvas API. Genera puntos animados con trayectorias flotantes aleatorias. Colores ACIA: `#4EC7F0` y `#041D77`. Optimizado con IntersectionObserver (pausa fuera de viewport) y throttle a ~30fps. Usado en HeroSection, PillarsSection y EventsSection.

### `CircuitPattern`
Canvas API. Dibuja nodos y trazos de circuito electrónico cubriendo toda la sección padre. Detecta el contenedor con `closest("section") ?? closest("footer")`. Optimizado con IntersectionObserver y throttle a ~30fps. Usado en ValueSection, GovernanceSection y CTASection.

---

## Animaciones

| Animación | Implementación | Secciones |
|---|---|---|
| Fade-up en scroll | Framer Motion `useInView` | Todas las secciones |
| Carrusel de pilares | `AnimatePresence` + `slideVariants` | PillarsSection |
| Typewriter terminal | Intervalo JS + `useInView` | ValueSection |
| Marquee infinito | `motion.div` con `animate={{ x: ["0%", "-50%"] }}` | GovernanceSection (aliados) |
| Puntos flotantes | Canvas API + `requestAnimationFrame` | HeroSection, PillarsSection, EventsSection |
| Circuito electrónico | Canvas API + `requestAnimationFrame` | ValueSection, GovernanceSection, CTASection |

> **Nota Tailwind v4:** Los `@keyframes` deben declararse **fuera** del bloque `@theme {}` para funcionar correctamente a nivel global.

---

## Metadatos SEO

```ts
title:       "ACIA - Asociación Colombiana de Inteligencia Artificial"
description: "Articulamos el ecosistema de inteligencia artificial en Colombia..."
keywords:    ["inteligencia artificial", "Colombia", "ACIA", "IA", "gobernanza", ...]
openGraph:   { url: "https://iaencolombia.org", locale: "es_CO", type: "website" }
twitter:     { card: "summary_large_image" }
favicon:     "/logos/LOGO ACIA CIRCULAR FONDO AZUL OSCURO.png"
lang:        "es"
```

---

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:3000)
npm run dev

# Build de producción
npm run build

# Servidor de producción
npm start

# Linting
npm run lint

# Verificación de la jerarquía Mi ACIA / Admin
npm run test:member-access
```

---

## Convenciones de Desarrollo

- **Contenido textual:** todo vive en [`src/lib/constants.ts`](src/lib/constants.ts). No hardcodear strings en componentes.
- **Imágenes:** logos en `public/logos/`, fotos de secciones en `public/sections/` (formato WebP).
- **GIFs:** usar `unoptimized` en `next/image` para preservar la animación.
- **Idioma:** el sitio es **español únicamente** (`lang="es"`). No agregar inglés.
- **Tailwind:** no usar `tailwind.config.ts`. Toda la configuración es CSS-first en `globals.css` con `@theme`.
- **`"use client"`:** solo agregar cuando el componente usa estado (`useState`), efectos (`useEffect`) o eventos del navegador. Componentes de solo presentación no lo necesitan.
- **Imágenes del logo:** respetar las variantes según el fondo (oscuro / blanco). Ver sección de Identidad Visual.
- **Canvas animations:** usar IntersectionObserver para pausar cuando están fuera del viewport. Throttle a ~30fps.
