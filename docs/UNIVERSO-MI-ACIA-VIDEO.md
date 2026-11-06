# Universo ACIA · Video promocional de Mi ACIA

Revisión del 6/11/2026 sobre `main` `4525628`. Rama `feat/universo-mi-acia-video`. Cambio preparado para Draft PR y aprobación; sin merge ni despliegue productivo.

## Comportamiento

El espacio de imagen de `UniverseSection.tsx` ahora contiene `UniverseVideo.tsx`. Se conservan íntegros el encabezado, las tres capacidades, el CTA «Conoce Universo ACIA», su destino `https://mi.iaencolombia.org` y las condiciones de acceso. No se añade ninguna sección ni se modifica Marketplace.

El propietario pidió después del encargo inicial **reproducción automática con el audio muteado**. Esta indicación sustituye el inicio exclusivamente tras clic: el iframe se monta cuando al menos el 25 % de su espacio entra en pantalla. Antes de ese momento no se realizan conexiones con YouTube. La portada local permanece disponible antes de cargar; con `prefers-reduced-motion: reduce` se mantiene como alternativa manual accesible.

- Iframe: `https://www.youtube-nocookie.com/embed/fDKVNBuN9zw?autoplay=1&mute=1&playsinline=1&controls=1&rel=0`.
- Proporción 16:9 fija, sin recortar el reproductor y sin cambio de dimensiones al sustituir la portada.
- Controles nativos, pantalla completa, reproducción móvil inline y permisos limitados a autoplay, medios cifrados, fullscreen y picture-in-picture.
- `referrerPolicy="strict-origin-when-cross-origin"`; título descriptivo y alternativa «Ver en YouTube».
- En inicio automático no se cambia el foco. Al activar el botón manual con teclado, se mueve al iframe y se mantiene un indicador visible dentro de su borde.
- Sin SDK, nuevas dependencias, descargas de video, alojamiento de archivos de video ni cambios de backend/worker/correo/pagos/Elestio.

La portada reutiliza `/images/opcion3/conexiones.webp`, servida y optimizada por el frontend. Conserva su identificación «Imagen ilustrativa» mientras es portada. No se utiliza una miniatura remota de YouTube ni una imagen de Elestio. La URL y autoría públicas del video se comprobaron mediante oEmbed: «Descubre Mi ACIA: Tu puerta de entrada al ecosistema de IA en Colombia (video-promo)», canal Asociación Colombiana de Inteligencia Artificial.

## CSP y privacidad

Se revisaron `next.config.ts`, archivos de configuración y cabeceras de `https://www.iaencolombia.org/`. No existe CSP ni CSP Report-Only activa que requiera una excepción; no se alteran cabeceras globales ni se relaja seguridad. El único dominio del iframe codificado en el componente es `www.youtube-nocookie.com`. Sus recursos internos se cargan al entrar el bloque en pantalla, según la preferencia posterior de autoplay. La carga automática implica conexión con YouTube sin esperar un clic; no se afirma que el reproductor sea anónimo.

## Validación específica

| Comprobación                      | Resultado                                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| HTML inicial                      | PASS · prueba SSR sin iframe, scripts ni preconexiones de YouTube; portada local y alternativa accesible                                                                                               |
| ESLint                            | PASS · componentes y scripts nuevos/modificados                                                                                                                                                        |
| TypeScript                        | PASS · `tsc --noEmit`                                                                                                                                                                                  |
| Build                             | PASS · Next 16.4.4, sin cambios de lockfile/dependencias                                                                                                                                               |
| Navegador                         | PASS · 59 comprobaciones específicas                                                                                                                                                                   |
| Red                               | PASS · cero solicitudes a YouTube antes de ver el bloque, en 1440 y 390 px                                                                                                                             |
| Movimiento reducido               | PASS · portada sin conexiones a YouTube hasta pulsar el botón, en 320/390/768/1440 px                                                                                                                  |
| Teclado y foco                    | PASS · Tab/Enter, foco al iframe en inicio manual; sin robo de foco automático                                                                                                                         |
| Responsive                        | PASS · 16:9 y ausencia de desbordamiento en 320/390/768/1440 px; sin cambio de espacio al montar iframe                                                                                                |
| Contenido existente               | PASS · comparación exacta con el bloque real publicado: textos, capacidades, CTA y condiciones                                                                                                         |
| Reproducción real                 | PASS · Chromium, escritorio 1440 px y móvil emulado 390 px; `paused=false`, `muted=true` y tiempo avanzando                                                                                            |
| Accesibilidad del código ACIA     | PASS · seis auditorías axe del bloque sin infracciones propias                                                                                                                                         |
| Accesibilidad del proveedor       | Incidencia externa · YouTube genera `aria-level="2"` en su enlace de título, sin rol compatible (`aria-allowed-attr`); registrada por separado en el informe y no modificable desde el documento padre |
| Safari/iOS y dispositivos físicos | No ejecutados; la verificación móvil usa emulación de Chromium                                                                                                                                         |

La reproducción automática depende de las políticas del navegador; si se bloquea, siguen disponibles los controles de YouTube, la alternativa manual con movimiento reducido y «Ver en YouTube». No se modificó el entorno para eludir esas políticas. Los controles y el iframe son reales; no se sustituyó el reproductor por una simulación.

## Evidencia y revisión

Los archivos locales están en `review-acia-opcion3/universo-video-20261106/` (ignorado por Git):

- `before-1440.png` / `before-390.png`: bloque actual de producción, capturado el 6/11.
- `cover-1440.png` / `cover-390.png`: portada accesible con movimiento reducido; variantes 320 y 768 incluidas.
- `player-1440.png` / `player-390.png`: reproductor real abierto y controles visibles.
- `browser-report.json`: red, dimensiones, foco, reproducción y hallazgos propios/del proveedor.
- `content-preserved.json`, `unit.log`, `lint.log`, `types.log` y `build.log`.

Los recortes por bloque ocultan temporalmente la cabecera fija y la firma global durante la captura para evitar que atraviesen el recorte. `viewport-390.png` conserva el marco real de la página. No se cambia ese comportamiento en el producto.

Para ejecutar el QA local: instalar las dependencias del lockfile; iniciar el servidor GET simulado existente y configurar `NEXT_PUBLIC_ACIA_API_URL` únicamente en el proceso local; usar `npm run build` y `npm run start -- --hostname 127.0.0.1 --port 3301`. La evidencia entregada usa una copia local del mock en 4409. Para el navegador se reutilizan Playwright y axe externos al bundle, indicados por `ACIA_REVIEW_TOOLS`; no se añaden al proyecto productivo.

```powershell
node --test scripts/universe-video.test.mjs
npx --no-install eslint src/components/sections/UniverseVideo.tsx src/components/sections/UniverseSection.tsx scripts/universe-video.test.mjs scripts/universe-video.browser.cjs
npx --no-install tsc --noEmit
$env:ACIA_REVIEW_URL='http://127.0.0.1:3301'
node scripts/universe-video.browser.cjs
```

No se repitieron manualmente suites de pagos, correos o servicios ajenos al cambio. El flujo normal de GitHub ejecuta sus controles de repositorio al abrir el Draft PR. Publicación productiva pendiente de aprobación.
