# ACIA · Segunda iteración UX/UI · revisión local

## Fase 0: versión comprobada
29 de octubre de 2026. Repositorio público `iaencolombia-web-redesign`, rama exclusiva `ux/public-redesign-20261028`, base `041d503` más primera iteración sin commit. Next 16.1.6, React 19.2.3, TypeScript, Tailwind 4. Se conservan las modificaciones previas; respaldo de 110 archivos con SHA-256 en `.local-review/iteration-2/before/source` y `manifest.json`. El checkout original permanece en `74a9688`, con `eventos/` sin seguimiento. No se trabaja en KpiChat ni plataforma-acia.

Referencia visual capturada desde la compilación local de la primera iteración (no desde producción): portada completa 1440 y 390 px. Alturas: 9.212 / 13.832 px. Inicio de planes: 3.302 / 4.430 px. Noticias y artículos proceden de la API local simulada, sin envíos. Medición de rendimiento previa con el mismo navegador y condiciones previstas para la comparación final.

## Fase 1: composición propuesta
Hero editorial azul: ACIA como asociación + conexiones/conocimiento/oportunidades + CTA. Visual de red conceptual con lenguaje de conversación, sin fotografías documentales inventadas.
→ Noticias externas verificadas, una por pantalla de lectura, transición horizontal lenta y reposo prolongado.
→ Selector de perfil y beneficios juntos; contenido específico desde planes existentes; enlace directo al grupo correspondiente.
→ Mensaje de Presidencia: diseño destacado solo en revisión local mientras falte material oficial.
→ Planes por categoría; valor antes de precio; todos los beneficios y condiciones conservados.
→ Universo: descubrimiento, perfiles y conexiones. Sin captura autorizada, esquema conceptual identificado y pendiente documentado.
→ Dos aliados + oportunidades compactas; septiembre 2026 en archivo.
→ ACIA al día independiente + recursos públicos y comunicados.
→ Confianza institucional resumida, detalles accesibles, CTA y pie.

No existen páginas independientes de identidad o hoja de ruta. Para preservar sus anclas y textos se consolidan en desplegables en portada; no se inventan rutas. Transparencia, normatividad, comunicados, newsletters, Observatorio y Papers mantienen sus páginas reales. Los proyectos en desarrollo quedan como enlaces secundarios, sin grandes tarjetas en el recorrido de afiliación. Equipo carece de contenido aprobado; no se inventan miembros. La barra fija superior ya ofrece afiliación persistente: no se añade una segunda barra móvil que compita o cubra controles.

## Límites y activos pendientes
No hay video, portada, subtítulos/transcripción ni captura anonimizada autorizada de Universo en el repositorio. Se pidió una URL oficial al propietario; a falta de ella, se mantiene el pendiente explícito. Ningún reproductor falso en una compilación publicable. No se altera la preselección del formulario, ni sus contratos.

## Fase 3: resultado y evidencia
La portada identifica a ACIA y presenta afiliación, conexiones, conocimiento y oportunidades en el hero. Los tres perfiles actualizan beneficios verificables (plan Afiliado, Micro empresa o Institución educativa) en el mismo bloque y llevan a su categoría de planes en dos interacciones, con foco en el destino. Los nueve planes conservan íntegramente importes, impuestos, descuentos, restricciones, beneficios y parámetros. El estado inicial muestra Personas; Comunidad tiene su categoría propia y la exclusión de plataforma explícita.

La nueva jerarquía conserva App Router, Header/Footer, contexto de perfiles y datos existentes. La fuente de planes sigue siendo `src/lib/membershipPlans.ts`; la de newsletters sigue siendo `listNewsletters(3)` del backend existente, interceptado por la API local en revisión. La cinta se edita en `src/data/publicExperience.ts`. Se añadieron cero dependencias de producción. No hay fotografías documentales inventadas ni capturas falsas del producto. No se muestra equipo sin material aprobado.

Los detalles institucionales se consolidaron bajo las anclas originales `#pilares`, `#que-hacemos`, `#hoja-de-ruta` y `#gobernanza`, con contenido desplegable y enlace a `/transparencia`. No existen páginas independientes de identidad/hoja de ruta a las que trasladarlos de forma segura. Normatividad y actualidad conservan accesos destacados; Observatorio y Papers quedan como enlaces secundarios con su estado real. Marketplace aparece únicamente donde afecta a los beneficios/condiciones de los planes. Septiembre de 2026 permanece en archivo, sin convocatoria activa inventada.

### Comparación de extensión
Compilaciones optimizadas locales, misma altura de viewport (1.000 px), movimiento reducido, paneles institucionales cerrados y estado inicial de cada versión. Antes: Comunidad; después: Personas. Esto refleja la experiencia inicial real, no una comparación con selecciones artificiales. La reserva del video solo aparece en desarrollo y se entrega por separado.

| Ancho | Alto de portada antes → después | Reducción | Inicio de planes antes → después | Adelanto |
|---|---|---|---|---|
| 1440 px | 9,212 → 6,085 px | 33.9 % | 3302 → 1341 px | 59.4 % |
| 390 px | 13,832 → 9,512 px | 31.2 % | 4430 → 1843 px | 58.4 % |

Capturas: `.local-review/iteration-2/REVIEW.html`. Incluye portadas completas 1440/390, hero, perfiles, beneficios, planes, noticias, Universo, alianzas, editorial, video pendiente y evidencia de preselección. Video del recorrido: `recorrido-local.webm` (grabación de pantalla; NO es el video presidencial). Se conserva el registro de captura de control del 29/10 en `before/home-*.png`; para comparar con imágenes ya cargadas, la galería usa las capturas completas del cierre de la primera iteración del 28/10, cuyas dimensiones coinciden exactamente con la verificación del 29/10. Respaldo de código y hashes disponible en `before/source`.

### Pruebas
| Comprobación | Resultado |
|---|---|
| `npm test` | PASS · 41/41; incluye 16 archivos protegidos por hash |
| `npm run lint` | PASS |
| `npx tsc --noEmit --incremental false` | PASS |
| `npm run build` | PASS · 16 páginas generadas, rutas dinámicas conservadas |
| `npm run test:member-access` | PASS |
| Suite de navegador `scripts/public-experience.browser.cjs` | PASS · 217 comprobaciones; seis anchos: 320/360/390/768/1024/1440 |
| Axe en compilación optimizada | PASS · 20 auditorías sin infracciones automatizadas WCAG 2.2 A/AA |
| `scripts/iteration-2.browser.cjs` | PASS · 51 comprobaciones adicionales, 2 auditorías axe con video local sin infracciones |
| Red de pruebas interactivas | Sin errores JS ni solicitudes externas/mutantes sin interceptar; resultados de formulario 503/202 simulados |
| Recorrido de foco por teclado | PASS · 258 posiciones, sin controles ocultos por cabecera; en paneles extensos se comprueba el inicio visible y sus controles por separado |
| Enlaces externos de portada | 8/8 HTTP 200 mediante GET público, sin autenticación |
| Git | Sin commit, staging, push, PR, merge ni despliegue |

La suite comprueba todos los precios y beneficios (abre los desplegables), nueve parámetros `plan`, cuatro tipos, validación de parámetro desconocido, foco/Escape del menú, pestañas con flechas/Home/End, navegación del carrusel y titulares íntegros en reposo a seis anchos. El ticker muestra un titular durante nueve segundos y cambia con transición horizontal de 900 ms; hover, foco, pausa, fuera de pantalla o pestaña oculta detienen el avance. Movimiento reducido usa navegación manual. No tiene scraping, cron, RSS, cookies nuevas ni servicios adicionales.

La prueba técnica HTML5 verifica `muted`, `defaultMuted`, controles voluntarios, `playsInline`, `preload=none`, ausencia de autoplay y posibilidad de activar audio. Usa un fixture de contrato; no equivale a probar reproducción, subtítulos sincronizados o transcripción de un recurso real, aún no disponible.

Estas pruebas automatizadas y la inspección visual/teclado no son una certificación completa de accesibilidad ni sustituyen pruebas con lectores de pantalla y usuarios.

### Rendimiento de laboratorio
Tres muestras por modo antes y después; Chrome local, caché de navegador desactivada, móvil 390 px con CPU 4×, 1,6 Mbps de descarga, 0,75 Mbps de subida y latencia de 40 ms. API local simulada, sin terceros. Las interacciones incluyen menú y cambio de categoría. Se conservan los JSON y logs.

| Modo | LCP mediano antes → después | CLS máximo antes → después | Máximo Event Timing de cada ejecución |
|---|---|---|---|
| desktop | 344 → 300 ms | 0.000000 → 0.000000 | [80, 32, 40] → [96, 32, 32] ms |
| mobile | 2092 → 2224 ms | 0.001352 → 0.000359 | [224, 232, 144] → [152, 144, 112] ms |

El LCP móvil mediano aumenta 132 ms (6,3 %); las tres muestras no permiten establecer significación ni garantizar ausencia de regresión en campo. CLS disminuye y las interacciones de la repetición aislada mejoran. Una primera pasada final registró 18,384 s en el primer arranque desktop y 304–368 ms de interacción móvil; se conserva como `after/performance-initial.json` y se repitió al aislar la ejecución. No se oculta esa anomalía ni se atribuye a una causa no demostrada. La inspección por control midió 184 ms al abrir el menú y 128 ms al cambiar a Empresas (CPU 4×). Estos máximos de laboratorio NO son INP p75 ni datos de usuarios reales. No se agregan analítica ni herramientas externas para medirlo.

## Noticias: fuentes y mantenimiento
Fecha de verificación: 29 de octubre de 2026. Cada enlace fue leído y respondió HTTP 200. Los titulares están resumidos en español, con fecha de publicación de la fuente (no fecha del evento ni de la última actualización). No se presentan como comunicados o acuerdos de ACIA:

- 28/10/2026 · UNESCO · [Almaty: educación superior, arte e IA](https://www.unesco.org/en/articles/almaty-brings-global-experts-together-explore-future-higher-education-arts-and-ai). La conferencia ocurrió el 26–27/10; el artículo se publicó el 28/10.
- 21/10/2026 · UNESCO-UNEVOC · [Guía de integración de IA en formación técnica](https://www.unevoc.unesco.org/en/articles/integrating-ai-tvet-practical-guide-institutions-0).
- 20/10/2026 · UNESCO · [Formación docente en América Latina](https://www.unesco.org/en/articles/faculties-education-latin-america-address-how-prepare-future-teachers-age-artificial-intelligence). Publicación 20/10; actualización 27/10; incluye experiencias de Colombia.
- 14/10/2026 · Radio Nacional de Colombia · [Colombia y Microsoft: formación en IA](https://www.radionacional.co/actualidad/tecnologia/microsoft-acuerdo). Se cita el medio; no se atribuye un acuerdo a ACIA.

Edición: modificar `NEWS` con `title`, `date`, `source`, `url`, `type`, `order`; mantener 4–6 elementos verificables (si faltan fuentes, reducir la lista y reportarlo), fechas reales y títulos breves sin copiar extensamente. Revisar enlaces y actualidad antes de cualquier publicación; no usar fechas futuras. Ejecutar unitarias y revisar los seis anchos después de editar. ACIA al día permanece separado, con hasta tres ediciones del servicio público existente.

## Pendientes y decisiones del propietario
1. **Video presidencial: bloqueado por falta de activo oficial.** El propietario autorizó continuar con este pendiente identificado. La reserva se ve en `http://127.0.0.1:3100/#conoce-acia`, únicamente con `NODE_ENV=development`. `http://127.0.0.1:3101` demuestra que una compilación publicable lo oculta. Para activar: entregar MP4, poster auténtico, VTT español y transcripción aprobada; colocar los archivos autorizados en `public/` y completar `PRESIDENT_VIDEO` (`src`, `poster`, `captions`, `transcript`, `approved: true`). Probar subtítulos, silencio por defecto y controles antes de autorizar publicación. No cambia el backend; no se sube ningún activo a terceros.
2. **Universo: falta captura autorizada y anonimizada.** Se conserva acceso real vía Mi ACIA y condiciones por plan; se muestra un esquema conceptual rotulado, sin perfiles ni datos personales. Una captura auténtica puede sustituir el esquema cuando esté autorizada. El esquema no prueba la UI interna de Universo.
3. **Preselección de afiliación: comportamiento previo confirmado.** `?plan=comunidad` y `?plan=profesional` dejan `plan_code` vacío; ambos derivan tipo `person`. Esto está documentado deliberadamente en README y pruebas anteriores; no es una regresión de esta iteración. Evidencia visual en `after/preseleccion-*.png` y pruebas para los nueve planes. Propuesta mínima, solo con autorización separada: inicializar el selector a partir de un código de plan válido y compatible con el tipo, manteniendo validaciones, cambio de tipo, payload, consentimientos y gate de pagos. No implementado.
4. **Revisión editorial y visual del presidente.** Confirmar copy y composición; mantener verificación manual de noticias. Logos oficiales se conservan desde la primera iteración, sin alteración de archivos. No se infieren beneficios jurídicos/comerciales de alianzas.
5. **Rendimiento real pendiente de futura publicación autorizada.** No hay medición de usuarios ni garantía p75. La build actual usa una API local simulada y debe recompilarse con la configuración oficial solo si se autoriza una publicación futura.

## Integridad y perímetro
La segunda iteración no cambia `AffiliationForm`, `affiliationPayments`, la fuente de planes, `config`, las preferencias/comunidad, los helpers Bold ni los 16 archivos protegidos. El informe de primera iteración explica las sustituciones anteriores del correo general `info` por `contacto`; no hay cambios nuevos en esos archivos. Correo legal de privacidad, metadatos, canonical, rutas secundarias y ajustes de infraestructura permanecen iguales al respaldo inicial. La lectura de newsletters reutiliza el servicio ya implementado. Ningún acceso autenticado a Mi ACIA/Admin, ningún backend, correo, pago, base de datos, endpoint o worker modificado.

El repositorio original permanece en `74a9688` con `?? eventos/`. La rama de revisión permanece en `041d503` con cambios sin commit. No se trabaja en plataforma-acia. Inventarios: [cambios exclusivos de esta iteración](ARCHIVOS-ITERACION-2.txt), [acumulado del rediseño](ARCHIVOS-MODIFICADOS.txt), [rutas y enlaces](ENLACES-ITERACION-2.md).

## Reproducir localmente
Carpeta: `D:\OneDrive\Proyectos DS\ACIA\webpage\iaencolombia-web-redesign`. Las dependencias ya están instaladas; no se modificó el lockfile. Ejecutar cada servidor en una terminal distinta (si el puerto ya está ocupado por esta revisión, reutilizarlo):

```powershell
node scripts/review/mock-api.cjs
```

```powershell
$env:NEXT_PUBLIC_ACIA_API_URL='http://127.0.0.1:4399'
$env:NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS='1'
npm run dev -- --hostname 127.0.0.1 --port 3100
```

Para comprobar la versión publicable local (oculta el video pendiente), cerrar antes el proceso propio que ocupe 3101:

```powershell
$env:NEXT_PUBLIC_ACIA_API_URL='http://127.0.0.1:4399'
$env:NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS='1'
npm run build
npm run start -- --hostname 127.0.0.1 --port 3101
```

```powershell
npm run lint
npx tsc --noEmit --incremental false
$env:ACIA_WRITE_VIDEO_FIXTURE='1'
npm test
npm run test:member-access
$env:ACIA_REVIEW_URL='http://127.0.0.1:3101'
node scripts/public-experience.browser.cjs
node scripts/iteration-2.browser.cjs
```

Las suites de navegador utilizan Playwright/axe ya disponibles en `.local-review/tools/node_modules` y Chromium local (`ACIA_REVIEW_CHROME` permite otra ruta). Son herramientas de revisión ignoradas por Git; no son dependencias del producto. API simulada de solo lectura en 4399 rechaza POST; los dos envíos de prueba se resuelven con interceptores locales sin salir del navegador. La opción TLS usa certificados del sistema, no deshabilita su verificación. No existen cambios en `.env`, hosting ni infraestructura.

**Parada de entrega:** todo permanece local, sin commit, push, PR, merge, preview remoto ni despliegue. Requiere revisión y autorización expresa del propietario para cualquier paso posterior.
