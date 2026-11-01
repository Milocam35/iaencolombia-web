# ACIA · Ajustes a la opción 3 · 1/11/2026

El propietario aprobó la dirección visual y solicitó tres ajustes para aprobación definitiva. Se implementaron en el mismo worktree aislado `iaencolombia-web-opcion3`, rama `ux/opcion3-20261030`, con aprobación definitiva del propietario el 1/11/2026 para su registro en un commit local. Publicación pendiente.

## Resultado

- **Sin imágenes repetidas:** diez fotografías distintas en la portada, una vez cada una. Cuatro fotos reales del archivo entregado y seis ilustraciones generadas; dos ilustraciones editoriales son nuevas. La selección editorial evita duplicados también con cero, una o dos ediciones disponibles.
- **Planes en azul:** «Elige cómo ser parte» tiene fondo institucional `#041D77`, títulos y texto claros, pestaña seleccionada cian y tarjetas claras. Se comprobaron Personas, Empresas, Instituciones y Comunidad, incluido el bloque desplegable de aliados estratégicos.
- **Cierre claro:** «Hay un lugar para ti en el futuro de la IA» quedó blanco, con título azul, CTA cian y foto real. Contrasta con el footer `#080820`; el encuadre conserva las cabezas en escritorio y móvil.

## Selección del archivo real

| Sección | Fotografía | Relación con el mensaje |
|---|---|---|
| Conocimiento | Semana / `GTR_6324.JPG.jpeg` | Panel de conversación sobre IA |
| Conexiones | América Digital / `20260910_101604.jpg` | Participantes reunidos en un encuentro del ecosistema |
| Conoce ACIA | Semana / `GTR_6322.JPG.jpeg` | Intervención en un panel sobre IA |
| Cierre de afiliación | Semana / `GTR_6378.JPG.jpeg` | Foto de grupo como expresión de comunidad |

Se inspeccionaron 19 fotos. Cripto Latin Fest contiene únicamente un video de unos 499 MB; no se usó ni se extrajeron fotogramas. Las fotos reales se identifican como archivo ACIA; no se les atribuyen personas, cargos o acuerdos no verificados. Las noticias sobre agentes, formación y UNESCO conservan ilustraciones, porque esas fotos de eventos no documentan los hechos de los artículos. Hero y Universo mantienen sus imágenes generadas en un único lugar cada una.

[Procedencia, autorización, prompts y alt](../ASSETS_ACIA_OPCION3.md). Los originales permanecen intactos; hashes registrados en `assets.json`. Se aplicó orientación EXIF, reducción y codificación WebP. Las seis imágenes nuevas suman **334.156 bytes**; se sirven ya optimizadas con carga diferida y espacio reservado, evitando el bloqueo observado en el optimizador local de Next sobre OneDrive. Las cuatro ilustraciones previas conservan el optimizador y sus variantes adaptativas. Se archivó la caché generada local antes de regenerarla; no se cambió `next.config.ts`, dependencias ni servicios.

## Validación final

| Verificación | Resultado |
|---|---|
| Lint | PASS |
| TypeScript (`tsc --noEmit`) | PASS |
| Pruebas unitarias | PASS · 42 pruebas, incluida unicidad editorial con newsletters ausentes |
| Build Next | PASS · rutas conservadas |
| Navegación de afiliación | PASS · accesos canónicos y prioridad de Afíliate |
| Navegador funcional | PASS · 217 comprobaciones, 20 auditorías axe sin infracciones, cero errores JS |
| Revisión visual específica | PASS · 57 comprobaciones, 11 auditorías axe sin infracciones |
| Imágenes | PASS · 10 fotografías únicas en siete tamaños; 4 del archivo real |
| Responsive | PASS · 320, 360, 390, 768, 1024, 1280 y 1440 px; sin desbordamiento |
| Planes y contraste | PASS · cuatro categorías a 390 y 1440 px; aliados estratégicos desplegados |
| Integridad | PASS · 21 archivos críticos/configuración idénticos a la versión aprobada; 119 archivos de la segunda iteración intactos |
| Formularios y pagos | Simulados · cero altas, cobros o correos reales |
| Commit local | Autorizado tras aprobación definitiva del propietario |
| Push / PR / merge / publicación | No ejecutados |

Los logs y JSON están en `review-acia-opcion3/ajustes-20261101/`. Las capturas se tomaron tras completar la carga de las imágenes diferidas. Los recortes de sección ocultan temporalmente la cabecera fija únicamente durante la captura; las páginas completas y capturas de viewport la conservan. Se inspeccionaron visualmente fotos y recortes en escritorio y móvil. Las auditorías automatizadas no equivalen a una certificación integral de accesibilidad; no se añadió evaluación con lector de pantalla o dispositivos físicos. No se repitió medición de rendimiento de campo; las métricas del informe del 30/10 corresponden a aquella versión.

## Ver el resultado

- Sitio: **http://127.0.0.1:3201**
- Comparación con la versión aprobada: **http://127.0.0.1:3203/ajustes-20261101/REVIEW.html**
- [Galería como archivo local](../review-acia-opcion3/ajustes-20261101/REVIEW.html).
- Capturas completas: `after/home-390.png`, `home-768.png`, `home-1024.png`, `home-1440.png`; detalles de beneficios, perfiles, Universo, institucional, editorial, planes, cierre y contraste con footer en 390 y 1440. Capturas de las cuatro categorías de planes también disponibles.

Si los servidores están detenidos, desde el worktree abrir una terminal para `node scripts/review/mock-api.cjs`, otra para `$env:NEXT_PUBLIC_ACIA_API_URL='http://127.0.0.1:4399'` y `npm run start -- --hostname 127.0.0.1 --port 3201`, y una tercera para `node .local-review/serve-evidence.cjs`. El build final ya está generado. No se escribieron variables productivas.

## Pendientes

Aprobación definitiva recibida del propietario el 1/11/2026. Se registra esta versión en un commit local de la rama de revisión. El video institucional oficial y la captura autorizada de Universo continúan pendientes; sus alternativas honestas permanecen preparadas. Ninguna foto de evento sustituye una captura de producto ni activa un reproductor.

## Cambios frente a la versión aprobada

- `ASSETS_ACIA_OPCION3.md` · modificado
- `docs/OPCION-3-REVISION.md` · modificado
- `public/images/opcion3/america-digital-conexiones.webp` · nuevo
- `public/images/opcion3/editorial-agentes.webp` · nuevo
- `public/images/opcion3/editorial-educacion.webp` · nuevo
- `public/images/opcion3/semana-comunidad.webp` · nuevo
- `public/images/opcion3/semana-conocimiento.webp` · nuevo
- `public/images/opcion3/semana-institucional.webp` · nuevo
- `scripts/public-experience.browser.cjs` · modificado
- `scripts/public-experience.test.mjs` · modificado
- `src/app/opcion3.css` · modificado
- `src/components/sections/InstitutionalVideo.tsx` · modificado
- `README.md` · modificado
- `src/components/newsletter/NewsletterLanding.tsx` · modificado
- `src/components/sections/CTASection.tsx` · modificado
- `src/components/sections/ValueSection.tsx` · modificado

Este informe se registra junto con la implementación aprobada, sobre la base `041d503`. `git diff --check` PASS; capturas y evidencias locales conservadas fuera del commit.
