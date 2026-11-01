# ACIA · Opción 3 · revisión local

**Actualización 1/11/2026:** dirección aprobada por el propietario; ajustes de imágenes y franjas en [el informe vigente](AJUSTES-OPCION3-20261101.md). Este documento conserva la evidencia de la entrega inicial.

## Base y autorización
30/10/2026. Referencia visual adjunta inspeccionada: cabecera blanca, hero fotográfico, ticker azul y dos bandas de tres bloques. El propietario autorizó expresamente usar la segunda iteración y aislar esta implementación, conservando los cambios sin commit. Nueva copia: `iaencolombia-web-opcion3`, rama `ux/opcion3-20261030`, base Git `041d503` más 119 archivos de la segunda iteración copiados con manifiesto SHA-256. El checkout anterior no se modifica. No se usa KpiChat ni plataforma-acia.

Next 16.1.6 / React 19.2.3 / TypeScript / Tailwind 4. Fuente de planes y contratos protegidos conservados; API de newsletters existente, simulada localmente. Dependencias existentes reutilizadas; sin nuevas dependencias de producción. Baseline completo recién capturado en 1440/390: 6.085/9.512 px; imágenes y logos cargados antes de capturar.

## Mapa de sustitución, previo a implementación
| Referencia | Implementación prevista | Sustitución de la segunda iteración |
|---|---|---|
| Cabecera blanca, Afíliate cian | Logo oficial, seis entradas, Mi ACIA secundario, menú modal en móvil | Prioridad y densidad del header; sin buscador inerte |
| Hero fotográfico panorámico | Fotografía ilustrativa original, degradado azul, personas a la derecha | Elimina diagrama y frases flotantes |
| Cinta azul de noticias | Cuatro noticias reales de octubre de 2026 con fuentes y controles | Conserva comportamiento accesible; cambia composición y contraste |
| Beneficios / perfiles / Universo | Tres fotografías de acciones distintas, perfiles funcionales y tarjeta azul de Universo | Sustituye las secciones verticales separadas por una banda real de tres columnas |
| Voz / aliados / actualidad | Módulo institucional honesto, dos aliados y retícula editorial con imagen destacada y noticias secundarias | Sin reserva de video pendiente ni reproductor ficticio |
| Planes | Categorías y nueve planes completos tras las bandas; perfiles llevan directamente a su categoría | Conserva todos los importes, condiciones y parámetros |
| Cierre y footer | CTA fotográfico, información institucional resumida y enlaces intactos | Mantiene rutas/anclas y documentos legales |

## Insumos y diferencias deliberadas
- La referencia es dirección visual, no una imagen que se publica como web ni fuente de hechos. No se usan sus textos fechados 2024/2025, estadísticas, personas, logos aproximados o supuesta UI.
- No hay video oficial ni poster/transcripción autorizados. `Conoce ACIA` sustituye la miniatura del presidente con contenido institucional real y enlaces; el reproductor permanece preparado y desactivado.
- No hay captura autorizada y anonimizada de Universo. No se extraen datos del portal ni se fabrica una interfaz. La tarjeta describe descubrimiento, perfiles y conexiones; una imagen ilustrativa se identifica como tal. Sustituirla por captura auténtica queda pendiente.
- Cuatro imágenes nuevas generadas con la herramienta integrada, optimizadas en WebP y sin marca ACIA. Son escenas genéricas, no documentación de eventos ni afiliados. Ver [manifiesto de imágenes](../ASSETS_ACIA_OPCION3.md).
- Alianzas: solo América Digital y Women in Tech, archivos oficiales ya existentes, sin alteración. Noticias verificadas nuevamente 30/10/2026.
- Responsive: tres columnas desde 1280; dos columnas intermedias; móvil con foto de hero arriba y texto en área azul inferior para proteger rostros y contraste, beneficios horizontales y perfiles en pila. No se comprime la web para imitar toda la maqueta en una sola pantalla.


## Resultado implementado

Nueva composición real en componentes HTML: hero de personas, ticker azul, banda de conversión de tres tratamientos y banda editorial con imágenes. `page.tsx` organiza las bandas; `opcion3.css` concentra la nueva capa visual sin alterar la hoja anterior. El selector de perfiles actualiza la categoría existente y desplaza el foco a los planes. La retícula editorial conserva una pieza principal y dos secundarias incluso si faltan newsletters, usando noticias verificadas y un aviso de indisponibilidad cuando corresponda. El servicio de newsletters no cambió.

Cabecera blanca de 80 px en escritorio / 76 px en móvil; navegación completa desde 1280 px. Tres columnas en 1280/1440; dos en 768/1024; una y tarjetas horizontales en móvil. Hero prioritario y resto de imágenes con carga diferida. Marketplace sigue «En construcción» y Universo conserva acceso según plan. El video oficial y la captura de producto no se simulan.

[Galería comparativa](../review-acia-opcion3/REVIEW.html) · [Inventario de cambios](../review-acia-opcion3/ARCHIVOS.md) · [Enlaces probados](ENLACES-OPCION-3.md) · [Assets y prompts](../ASSETS_ACIA_OPCION3.md).

## QA y límites

| Comprobación | Estado | Resultado / evidencia |
|---|---|---|
| `npm run lint` | PASS | `review-acia-opcion3/lint.log` |
| `npx --no-install tsc --noEmit` | PASS | Sin script types en package.json; se ejecutó TypeScript directamente, `types.log` |
| `npm test` | PASS | 42 pruebas; incluye integridad de 16 fuentes críticas, video y contingencia editorial |
| `npm run test:member-access` | PASS | Accesos canónicos y prioridad de afiliación |
| `npm run build` | PASS | Next genera las 16 páginas estáticas previstas y conserva rutas dinámicas; `build.log` |
| Navegador optimizado | PASS | 217 comprobaciones, 20 auditorías axe, cero infracciones automatizadas y cero errores JS; `after/browser-report.json` |
| QA visual complementario | PASS | 79 comprobaciones, 2 auditorías axe adicionales; `visual-report.json` |
| Responsive | PASS | 320, 360, 390, 768, 1024, 1280, 1440 sin desbordamiento; las cuatro categorías de planes comprobadas |
| Teclado | PASS | Menú modal con 30 pasos de Tab/Escape; 316 posiciones de foco revisadas en home y afiliación a 390/1440, controles visibles fuera de la cabecera; panel de contenido puede superar la altura de pantalla |
| Noticias y aliados | PASS | Cuatro titulares completos en siete anchos; pausa manual/hover/foco, modo reducido manual; carrusel con teclado, dos logos visibles sin flechas artificiales en desktop |
| Zoom / densidad | PASS acotado | Contextos equivalentes de reflow 720 CSS px / DPR 2 y 320 CSS px / DPR 4. No es una prueba de zoom nativo de todos los navegadores |
| Afiliación y Bold | PASS con mocks | Nueve parámetros, cuatro tipos, errores/éxito simulados, consentimiento y honeypot, pago bloqueado con gate desactivado. Cero altas, cobros o correos reales |
| Video preparado | PASS técnico | HTML5 silenciado y audio activable, controles, subtítulos/transcripción; fixture local sin grabación oficial |
| SEO y privacidad | PASS | Metadatos base conservados; plan privado ausente en `src`; rutas protegidas, datos y contratos intactos |
| Externos | PASS | Ocho URLs HTTP 200 con GET sin autenticar; [tabla](ENLACES-OPCION-3.md) |
| Safari, Firefox, dispositivos físicos y lector de pantalla | SKIP | No ejecutados; axe y teclado no equivalen a certificación integral WCAG |
| Galería local | PASS | 19 enlaces, 20 detalles, selector escritorio/móvil, video de 20,32 s y cero errores JS; `gallery-check.json` |
| Video y captura auténtica de Universo | PENDIENTE | Se aplicaron alternativas honestas; el criterio de captura auténtica no se declara satisfecho |
| Commit / push / PR / merge / despliegue | NO EJECUTADO | Trabajo local pendiente de aprobación |

Las capturas por elemento ocultan únicamente la cabecera fija y el enlace de salto durante la captura para evitar superposiciones del navegador en elementos más altos que el viewport. Las capturas completas y de hero conservan la cabecera. Todas las imágenes estaban decodificadas al capturar. Fechas y contenido de newsletter de la vista local proceden de los fixtures documentados, no de consultas al portal privado.

## Rendimiento de laboratorio

Tres repeticiones por versión y tamaño, Chromium local optimizado, caché del navegador desactivada. Desktop 1440×900 sin limitación; móvil 390×900 con CPU ×4 y red 1,6 Mbps bajada / 0,75 Mbps subida / latencia 40 ms. API GET simulada. Medición secuencial sin otras pruebas de navegador en paralelo. Optimización del servidor de imágenes ya caliente por las capturas. Datos crudos: `review-acia-opcion3/performance.json`; no se descartaron muestras.

| Versión | Pantalla | LCP mediana ms (rango) | CLS mediana | Evento observado máximo ms | Transferencia mediana KB |
|---|---|---:|---:|---:|---:|
| Segunda iteración | desktop | 300 (284–316) | 0.0000 | 80 | 520 |
| Segunda iteración | mobile | 2132 (2128–2164) | 0.0004 | 344 | 508 |
| Opción 3 | desktop | 268 (256–284) | 0.0000 | 136 | 687 |
| Opción 3 | mobile | 2028 (2012–2036) | 0.0147 | 192 | 595 |

Event Timing recoge las interacciones del menú y categorías de planes; su máximo observado **no es INP p75 de campo**. El CLS es la suma de desplazamientos sin entrada reciente durante este recorrido corto. No se midió INP de usuarios reales, Lighthouse ni comportamiento CDN/producción. Estos números sirven para comparar este laboratorio, no garantizan rendimiento real. La medición corresponde a la composición final con las dos ediciones de prueba; el ajuste posterior del caso sin newsletters conserva exactamente esa salida visible.

## Capturas y comparación de longitud

| Ancho | Antes | Después | Observación |
|---|---:|---:|---|
| 1440 | 6.085 px | 5.302 px | Dos bandas reúnen conversión y editorial; lectura menos dispersa |
| 390 | 9.512 px | 10.245 px | Aumenta 7,7 % con fotos y contenido editorial; se preservan tamaño de texto y controles, sin comprimir |

Completas: `before/home-1440.png`, `before/home-390.png`, `after/home-390.png`, `after/home-768.png`, `after/home-1024.png`, `after/home-1440.png`. Detalles de hero en siete anchos, y beneficios/perfiles/planes/Universo/ticker/institucional/alianzas/actualidad/bandas en 390 y 1440. Recorrido opcional: `recorrido-opcion3.webm`, grabación de pantalla local, no video institucional.

## Pendientes y decisión del propietario

1. Revisar fidelidad visual y aprobar las cuatro imágenes generadas antes de cualquier publicación. El logo real, las noticias y las proporciones legibles difieren deliberadamente de la maqueta.
2. Aportar captura autorizada y anonimizada de Universo para activar `UNIVERSE_PREVIEW`; no se cambió el producto ni su acceso.
3. Aportar video oficial, poster, subtítulos y transcripción para activar `PRESIDENT_VIDEO`. Actualmente se muestra contenido institucional útil, sin reserva vacía ni play.
4. La selección vacía con `?plan=` está documentada en el README original y permanece intacta. Si se desea preselección, requiere una tarea separada sobre el flujo transaccional, con revisión de su contrato.
5. La vista local usa API simulada; integración real de formularios, pagos, correo y despliegue queda fuera de este encargo. No se ha publicado nada.

## Ver y reproducir localmente (PowerShell)

Abrir **http://127.0.0.1:3201**. Galería servida localmente: **http://127.0.0.1:3203/REVIEW.html**. La galería también puede abrirse directamente desde `review-acia-opcion3/REVIEW.html`; no requiere red. Directorio de trabajo exclusivo:

```powershell
Set-Location -LiteralPath 'D:\OneDrive\Proyectos DS\ACIA\webpage\iaencolombia-web-opcion3'
```

Si los servidores ya no están activos, en una terminal ejecutar `node scripts/review/mock-api.cjs` (4399, GET solamente) y en otra, desde el mismo directorio:

```powershell
$env:NEXT_PUBLIC_ACIA_API_URL='http://127.0.0.1:4399'
$env:NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS='1'
npm run build
npm run start -- --hostname 127.0.0.1 --port 3201
```

Para servir de nuevo únicamente la evidencia en otra terminal: `node .local-review/serve-evidence.cjs`.

Las variables son solo del proceso local; no se escribió `.env` ni configuración productiva. El flag de certificados usa el almacén del sistema, no desactiva TLS. Se reutilizaron dependencias ya instaladas, sin cambiar package.json ni lockfile. Para reproducir navegador: Playwright y axe existentes en `.local-review/tools`, Chromium indicado en los scripts; no son nuevas dependencias de producción.

```powershell
$env:ACIA_WRITE_VIDEO_FIXTURE='1'
npm test
$env:ACIA_REVIEW_URL='http://127.0.0.1:3201'
node scripts/public-experience.browser.cjs
node scripts/opcion3.browser.cjs
```

La segunda iteración permanece intacta. La revisión está aislada en `ux/opcion3-20261030`; no hay commits nuevos ni archivos staged. **Detenido para revisión visual y aprobación expresa del siguiente paso.**
