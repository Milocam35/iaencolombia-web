# ACIA · Rediseño público para revisión local

Fecha de revisión: **28 de octubre de 2026**, America/Bogota. No se ha hecho commit, push, PR, merge ni despliegue.

## Abrir la revisión

- **Compilación optimizada:** http://127.0.0.1:3101
- **Desarrollo, con reserva del video visible:** http://127.0.0.1:3100
- [Galería local de capturas](../.local-review/REVIEW.html)
- [Lista exacta de archivos modificados y nuevos](ARCHIVOS-MODIFICADOS.txt)

Carpeta: `D:\OneDrive\Proyectos DS\ACIA\webpage\iaencolombia-web-redesign`.
Rama: `ux/public-redesign-20261028`. Base: **origin/main, 041d503**.

La revisión usa exclusivamente un servidor simulado en `127.0.0.1:4399`. Rechaza todos los métodos distintos de GET. Los artículos completos no se copian: las rutas de edición muestran una alternativa identificada como prueba local; los títulos, fechas y enlaces del ticker corresponden a publicaciones reales. Ningún envío de esta revisión puede registrar prospectos, enviar correos, iniciar pagos o activar membresías reales.

## Prevuelo y perímetro

Se verificó el remoto `https://github.com/Milocam35/iaencolombia-web.git`. El checkout original estaba en `main`, commit `74a9688`, con **`?? eventos/`**. Esa carpeta y sus archivos permanecen intactos. `origin/main` incorporaba posteriormente comunidad y newsletters; se consultó el remoto y se creó un worktree aislado desde `041d503`, conservando estas funciones ya publicadas. No se editó ningún otro repositorio.

Stack instalado: Next.js **16.1.6**, React **19.2.3**, TypeScript **5.9.3**, Tailwind CSS 4. Se conservan las dependencias de ejecución y `package-lock.json`. No se añadieron servicios, endpoints de aplicación, scraping, cron, migraciones ni infraestructura. Las herramientas Playwright/axe son locales de QA, fuera del bundle.

La configuración de Mi ACIA, Administración, API y feature gates permanece idéntica. La CI existente valida pull requests y push a main; no se modificó `.github/workflows/ci.yml`, `next.config.ts` ni variables productivas. Las pruebas nunca visitan Mi ACIA ni Administración: comprueban sus destinos literales.

Referencia previa: 35 pruebas unitarias, lint, tipos y comprobación de navegación aprobados. Capturas previas: [escritorio](../.local-review/baseline-home-1440.png), [móvil](../.local-review/baseline-home-390.png), [formulario escritorio](../.local-review/baseline-afiliate-1440.png), [formulario móvil](../.local-review/baseline-afiliate-390.png). El entorno inicial usó fuentes de respaldo por un problema local de certificados; la compilación final utiliza las fuentes originales con los certificados del sistema.

## Cambios y arquitectura

La aplicación existente se mantiene. `src/app/page.tsx` compone las secciones; `Header`, `Footer` y `PublicPage` extienden la misma identidad al resto de rutas. `public-experience.css` reúne los estilos responsive y las correcciones de contraste. `layout.tsx` conserva metadatos y esquema institucional; solo incorpora la hoja de estilos.

1. Encabezado fijo, cinco grupos de navegación, afiliación destacada y Mi ACIA secundario. En móvil, ambos accesos están al principio del menú. Menú modal nativo, cierre con Escape, retorno de foco y recorrido contenido de Tab. Administración queda en el pie con la URL exacta original.
2. Hero con identidad institucional, propuesta comprensible, afiliación y gráfico abstracto de conexiones. Se eliminan de la portada las animaciones continuas de canvas y la escritura de terminal.
3. Ticker editorial con fechas y fuentes. Avanza suavemente, pausa con cursor, foco, botón, pestaña oculta o fuera de pantalla. Tiene avance/retroceso manual; con movimiento reducido se conserva una sola lista sin desplazamiento automático. Las copias visuales no entran en el árbol accesible ni en Tab.
4. Selector para personas, empresas e instituciones/academia. `MembershipProfileProvider` comparte únicamente la categoría de visualización de planes; no interviene en el formulario ni su selección.
5. Beneficios por perfil, Universo ACIA como plataforma existente y Marketplace identificado como **en construcción**, sin prometer fecha ni alterar el tarifario.
6. Carrusel de exactamente **América Digital** y **Women in Tech**, con archivos oficiales locales. Dos tarjetas en escritorio y una por vista en móvil, scroll táctil nativo, botones y teclado; sin autoplay. Las descripciones explican la actividad de las organizaciones, sin inventar beneficios del acuerdo.
7. Planes obtenidos del mismo `membershipPlans.ts`: nueve códigos, cuatro categorías, precios, restricciones y condiciones intactos. Freemium explica que no incluye Mi ACIA; los beneficios Marketplace llevan una indicación de construcción. Los enlaces mantienen `?plan=` y `?type=strategic_ally`.
8. Oportunidades con destinos reales; el congreso del 9–10 de septiembre de 2026 queda en archivo como **actividad finalizada**. No se anuncian inscripciones vigentes ni se reofrece el descuento de esa edición.
9. Normatividad disponible, Observatorio en desarrollo y Papers en preparación. La sección existente de newsletters sigue leyendo la misma API editorial, dentro de Suspense; el ticker no sustituye esa integración.
10. Pilares, capacidades, hoja de ruta, gobernanza, transparencia y cierre de afiliación. Equipo conserva su URL, pero no se anuncia en navegación porque no hay integrantes publicados en la fuente local.

`src/data/publicExperience.ts` contiene noticias, alianzas, recurso de video, perfiles y presentación de beneficios. `constants.ts` conserva el contenido institucional y la navegación. Las fuentes comerciales, jurídicas, de pagos y editoriales de backend permanecen separadas y protegidas.

## Inventario de rutas y anclas

| Ruta | Conservación y comprobación |
| --- | --- |
| `/` | Portada renovada; CTA, perfiles, noticias, alianzas y recursos |
| `/afiliate` | Mismos campos, tipo/plan, validación, consentimiento, honeypot y estados |
| `/afiliate/pago/resultado` | Mismo resultado, sesiones, polling y metadatos noindex |
| `/observatorio`, `/papers` | Estado de desarrollo/preparación explícito |
| `/normatividad` | Recursos y enlaces existentes intactos |
| `/comunicados`, `/comunicados/terremoto-colombia-10-agosto-2026` | Contenido y PDF existentes intactos |
| `/newsletters`, `/newsletters/[slug]` | Mismas llamadas, paginación, canonical y render de artículos |
| `/newsletters/preferencias` | Mismo flujo privado y noindex; sin tokens reales |
| `/comunidad/confirmar`, `/comunidad/preferencias` | Mismo comportamiento y noindex; sin activar enlaces reales |
| `/transparencia`, `/equipo` | Rutas existentes conservadas |
| `/politica-tratamiento-datos` | Texto, versión, vigencia y correo jurídico intactos; mejoras de contraste y reflow |

Fragmentos conservados: `#hero`, `#pilares`, `#que-hacemos`, `#valor`, `#planes`, `#eventos`, `#internacional`, `#hoja-de-ruta`, `#conocimiento`, `#comunicados`, `#newsletters`, `#gobernanza`, `#cta`. Se añaden únicamente fragmentos de interfaz: `#contenido`, `#perfiles`, `#noticias`, `#universo`, `#oportunidades`. `#conoce-acia` se publica solo cuando el recurso audiovisual esté aprobado.

No existían archivos propios sitemap/robots en esta base. No se crearon ni alteraron reglas de rastreo, redirecciones o slugs. Los metadatos canonical y noindex existentes se mantienen.

## Contratos y componentes críticos

- `POST /public/affiliation-prospects`: mismos campos `prospect_type`, `plan_code`, `contact_name`, `email`, `phone`, `organization_name`, `organization_role`, `city`, `message`, `privacy_accepted`, `website`; Comunidad conserva sus campos opcionales de consentimiento y versión. Se mantiene respuesta `202`, `status: received` y `payment_context` en memoria.
- `POST /public/membership-payments/bold/checkout`: únicamente `payment_context` y `plan_code`; sin cálculo de montos o firmas en el frontend.
- `GET /public/membership-payments/{public_token}`: mismo polling y autoridad del backend. Sin cambios al loader Bold, checkout, TTL, sessionStorage, rehidratación, estados o limpieza de sesión.
- Misma integración de comunidad y preferencias; mismos contratos y lecturas públicas de newsletters. No se tocan autenticación, permisos, pagos, correos ni administración.
- **Única modificación en `AffiliationForm.tsx` y `affiliationPayments.ts`:** sustituir el correo general `info@...` por `contacto@...` en textos de ayuda y enlace de contacto. La implementación es idéntica fuera de esas cadenas. El canal de privacidad sigue intacto.
- En las páginas de afiliación y resultado solo se añadió el destino de salto accesible al `<main>`.

`scripts/review/protected-files.json` registra hashes normalizados de 16 archivos críticos contra la base 041d503, incorporando exclusivamente esas sustituciones de correo. Su prueba funciona también en CI con historial superficial. No actualizar estos hashes para aceptar cambios funcionales dentro de este rediseño.

### Diagnóstico de la preselección

Se reprodujo `/afiliate?plan=comunidad` y `/afiliate?plan=profesional` en la referencia, escritorio y móvil, y se comprobaron los nueve códigos en la versión final. El parámetro es reconocido: determina el tipo. El estado `planCode` comienza expresamente vacío y exige elegir el plan. README y las pruebas ya documentaban esta decisión; aparece en el cambio previo `e692a0d`.

**No se corrigió como defecto**, porque es un comportamiento deliberado y su modificación no está autorizada. Si ACIA decide preseleccionar en una tarea posterior, la propuesta mínima es inicializar `planCode` con un `initialMembershipPlan` válido del tipo resultante, conservando el vacío para valores desconocidos, las reglas al cambiar tipo y los gates. Esto requiere aprobación explícita y actualizar las pruebas de esa decisión; no exige endpoints nuevos.

## Fuentes y mantenimiento editorial

Verificación: 28/10/2026. Las páginas siguientes son fuentes públicas; no se consultaron datos de miembros.

- [ACIA al día, edición 02: Cuando un agente de IA actúa en nombre de su empresa](https://www.iaencolombia.org/newsletters/cuando-un-agente-de-ia-actua-en-nombre-de-su-empresa-21e97a325f844cbbb180007944f8bc56), publicada el 27/10/2026.
- [ACIA al día, edición 01: ¿Qué debería quedar después de un curso de inteligencia artificial?](https://www.iaencolombia.org/newsletters/que-deberia-quedar-despues-de-un-curso-de-inteligencia-artificial-4228750506f54cf2ab45296449554d10), publicada el 26/10/2026.
- [América Digital, sitio oficial](https://congreso.america-digital.com/). [Logo servido en su encabezado oficial](https://congreso.america-digital.com/wp-content/uploads/2016/06/logoweb.png).
- [Women in Tech Colombia, capítulo oficial](https://women-in-tech.org/colombia/). [Logo oficial](https://women-in-tech.org/wp-content/uploads/2023/12/Logo_Colombia.png).

Para actualizar noticias, editar `NEWS` en `publicExperience.ts`: título fiel o resumen editorial breve, URL pública, fuente, fecha real `AAAA-MM-DD` y orden. Revisar al publicar una edición y al menos semanalmente; mantener hasta seis titulares y retirar entradas desactualizadas o retiradas. Verificar que el enlace resuelva, que la fecha no sea futura y que el contenido sea público. No usar «hoy» ni alterar fechas para aparentar actualidad. No existe scraping ni automatización nueva.

Para añadir una alianza futura, obtener aprobación institucional y recurso oficial, añadir un registro a `ALLIANCES`, conservar las dimensiones, el enlace oficial y una descripción comprobada, y actualizar la comprobación de organizaciones confirmadas. El componente calcula sus controles a partir de la lista; no requiere backend. No se atribuyen beneficios comerciales a partir de la actividad general del aliado.

## Video pendiente

`PRESIDENT_VIDEO.approved` permanece en `false`. La versión optimizada no muestra el bloque. En desarrollo se ve una reserva explícitamente identificada, sin imagen del presidente ni discurso inventado.

Para activarlo, ACIA debe suministrar o aprobar:

1. MP4 optimizado con alojamiento autorizado y URL definitiva.
2. Portada auténtica.
3. Subtítulos en español en formato VTT y transcripción aprobada.
4. Autorización editorial para habilitar el recurso.

Completar `src`, `poster`, `captions`, `transcript` y finalmente `approved: true` en `publicExperience.ts`. Se exige transcripción para publicar. El elemento HTML5 usa `controls`, `playsInline`, `muted`, `defaultMuted`, `preload="none"` y no tiene autoplay. El visitante controla voluntariamente el audio. Los subtítulos se incorporan cuando existe su archivo.

Se verificaron la ocultación, el contrato HTML5 silenciado, controles, pista de subtítulos, transcripción y cambio voluntario de mute con una fixture técnica sin audiovisual. **La reproducción, sincronización de subtítulos y mezcla de audio del video real quedan pendientes de recibirlo.** No se inició sesión, subió material ni abrió conexión a YouTube.

## Resultados de QA

- **41/41 pruebas unitarias aprobadas**: 35 existentes y 6 nuevas. Incluyen contratos/payloads, gates, mocks Bold, privacidad, sesiones, integridad crítica, video y contenido público.
- **179 comprobaciones de navegador aprobadas** en la compilación optimizada: rutas, anclas, categorías, tarifas y enlaces de los nueve planes, los cuatro tipos, parámetros desconocidos, menús, teclado, noticias, carrusel y formulario.
- **20 auditorías automatizadas WCAG A/AA sin infracciones detectadas**, en portada, menú y páginas interiores. Esto no equivale a una certificación completa WCAG ni a pruebas de lector de pantalla.
- **257 posiciones de foco verificadas** en portada y afiliación, 390 y 1440 px, sin controles ocultos por el encabezado o fuera del viewport.
- Anchos de portada y todos los grupos de planes: **320, 360, 390, 768, 1024 y 1440 px**, sin desbordamiento horizontal. Revisión visual de capturas de portada, planes, alianzas, menú y páginas informativas.
- Formularios: respuestas `503` y `202` interceptadas en Playwright, datos ficticios `revision@example.test`, consentimiento voluntario desmarcado, ninguna solicitud enviada al servidor real. Pagos reales y correos: **cero**.
- Lint, TypeScript, build y `test:member-access` aprobados; `git diff --check` limpio.
- API editorial intacta. Pruebas y revisión visual usan fixtures; no prueban disponibilidad o latencia del backend productivo.

Evidencia: [unitarias](../.local-review/tests.txt), [lint](../.local-review/lint.txt), [tipos](../.local-review/types.txt), [build](../.local-review/build.txt), [navegador](../.local-review/browser-report.json), [foco](../.local-review/focus-report.json), [rendimiento](../.local-review/performance.json).

## Rendimiento y límites de medición

Se retiró de la portada la dependencia de animaciones Framer Motion/canvas y la ocultación de contenido hasta scroll. Se mantienen las fuentes originales, imágenes optimizadas con dimensiones reservadas, recursos de aliados locales y video sin descarga previa. El ticker se pausa fuera del viewport, con documento oculto y ante movimiento reducido.

Los resultados de laboratorio se adjuntan en `performance.json`: tres muestras de escritorio y tres móviles, caché del navegador deshabilitada, compilación optimizada y API simulada. Móvil: 390 px, CPU 4×, descarga 1,6 Mbps, subida 0,75 Mbps, latencia 40 ms. Se usa PerformanceObserver, no una puntuación Lighthouse inventada.

| Muestra | LCP | CLS | Máxima interacción observada |
| --- | ---: | ---: | ---: |
| desktop 1 | 0.336 s | 0.0000 | 64 ms |
| desktop 2 | 0.276 s | 0.0000 | 32 ms |
| desktop 3 | 0.284 s | 0.0000 | 32 ms |
| mobile 1 | 1.924 s | 0.0014 | 136 ms |
| mobile 2 | 2.000 s | 0.0014 | 136 ms |
| mobile 3 | 1.936 s | 0.0014 | 144 ms |

La columna de interacción es el máximo observado de Event Timing en el recorrido probado, no INP p75 de usuarios reales. No hay datos de campo ni medición comparable de rendimiento productivo previo; por ello no se afirma una mejora porcentual o cumplimiento p75. La revisión automatizada se ejecutó en Chromium; Safari, Firefox y NVDA/VoiceOver quedan fuera de esta verificación.

## Repetir la revisión local

En una terminal PowerShell, desde la carpeta del worktree:

```powershell
node scripts/review/mock-api.cjs
```

En otra terminal:

```powershell
$env:NEXT_PUBLIC_ACIA_API_URL = 'http://127.0.0.1:4399'
$env:NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS = '1'
npm run dev -- --hostname 127.0.0.1 --port 3100
```

Para revisar el build optimizado:

```powershell
$env:NEXT_PUBLIC_ACIA_API_URL = 'http://127.0.0.1:4399'
$env:NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS = '1'
npm run build
npm run start -- --hostname 127.0.0.1 --port 3101
```

El ajuste TLS es de proceso y usa los certificados del sistema; no desactiva la verificación. No se crearon archivos `.env`. La compilación guardada en `.next` es de revisión, apunta a localhost y no debe reutilizarse para publicar; una publicación futura requiere recompilar con configuración autorizada.

Comprobaciones:

```powershell
npm run lint
npx tsc --noEmit --incremental false
$env:ACIA_WRITE_VIDEO_FIXTURE = '1'
npm test
npm run test:member-access
$env:ACIA_REVIEW_URL = 'http://127.0.0.1:3101'
node scripts/public-experience.browser.cjs
git diff --check
```

Playwright y axe ya están disponibles en `.local-review/tools`. Para reproducir en otro entorno, instalar allí `playwright` y `@axe-core/playwright`, instalar Chromium y definir `ACIA_REVIEW_CHROME` con la ruta de su ejecutable. Son dependencias exclusivas de revisión; no forman parte de `package.json` ni del despliegue. El navegador rechaza hosts externos y métodos mutantes, salvo las respuestas simuladas que intercepta sin transmitir.

## Pendientes y aprobación

Pendiente editorial indispensable para activar el video: archivo/URL, portada, subtítulos y transcripción aprobados. No hay otros recursos visuales inventados ni alianzas sin confirmar añadidas.

El rediseño está preparado para revisión local. La aprobación solicitada en esta entrega es del resultado visual y de navegación. **Commit, push, PR, merge y despliegue requieren una orden posterior expresa**. No se ha modificado `plataforma-acia`, Mi ACIA, administración, FastAPI, PostgreSQL, worker, plantillas de correo, Bold ni infraestructura.
