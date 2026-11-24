# Publicación de Mesas técnicas sectoriales en la web

Diseño, siete imágenes y textos aprobados sobre `c7804bc3f0a0570a11a8104eeb0faa8b07c92c9f`.
El usuario autorizó después la actualización de seguridad, PR, merge con CI verde
y publicación únicamente de la web pública por su integración Vercel existente.
Base revisada: `bad97b43b990f5894882ef4560a382c7ef2f6fce`, repositorio
`Milocam35/iaencolombia-web`. Backend, Admin y Mi ACIA son otros despliegues.

## Cambios después de la aprobación visual

- Next y eslint-config-next pasan de 16.4.4 a 16.4.6, con sus paquetes asociados
  del lockfile. No se cambia React ni se añaden bibliotecas.
- Se retira el marcador de revisión local y se permite indexación de la página,
  con canonical y Open Graph en la URL pública definitiva.
- Se conserva la indicación de imágenes ilustrativas generadas con IA, sin
  participantes reales ni respaldo institucional atribuido.
- La prueba de runtime existente incorpora la ruta pública y verifica que renderiza
  sus seis controles. El optimizador nativo continúa comprobándose.

Los siete WebP y el catálogo editorial son idénticos a los aprobados. No se altera
la disposición, la interacción, el encabezado, el pie, el formulario, los planes,
los contratos de pago, los consentimientos ni las preferencias de comunicaciones.

## Validación local del release

- 63 pruebas aprobadas; cero fallos y cero skips.
- Guarda de navegación de afiliación/Mi ACIA aprobada.
- Lint sin errores; permanece el aviso anterior de img en NewsletterArticle.
- Build y TypeScript aprobados con Next 16.4.6. El worktree anidado usa la opción
  soportada `--webpack`; CI y Vercel conservan su comando normal `npm run build`.
- `npm audit --omit=dev --audit-level=moderate`: cero vulnerabilidades.
- Runtime local y optimizador nativo aprobados; proceso y puerto liberados.
- Navegador real: 13 comprobaciones aprobadas, incluyendo seis aperturas/cierres,
  teclado, tacto, movimiento reducido, una sola mesa abierta y reflow 320–1440 px.
  Evidencia final en `.local-review/sector-tables-release/`; las capturas aprobadas
  permanecen en `.local-review/sector-tables/`.

La validación de CI debe corresponder al HEAD exacto del PR; su enlace y resultado
se registran en el PR. No se integra si main incorpora un árbol adicional no revisado.

## Despliegue coordinado y comprobación

La integración GitHub/Vercel existente publica la web al integrar main. No se
ejecuta despliegue manual en Elestio ni se cambian variables de Vercel. Los valores
loopback de las pruebas son variables del proceso local, no archivos ni configuración
productiva. No se transfieren `.next`, node_modules o la carpeta `.local-review`.

Después del CI verde y el merge autorizado:

1. Verificar árbol del merge idéntico al HEAD revisado.
2. Esperar el deployment Vercel de ese SHA, entorno Production, estado success.
3. Abrir `https://www.iaencolombia.org/` y comprobar la nueva sección inmediatamente
   después de beneficios, selector y Universo, conservando el bloque posterior.
4. Abrir `/mesas-tecnicas-sectoriales`: seis tarjetas, imágenes decodificadas,
   apertura/cierre sin navegación, un único panel, CTA a `/afiliate` y enlace a Mi ACIA.
5. Verificar canonical/indexación, los siete WebP públicos y sus hashes contra el
   manifiesto aprobado. Usar solo GET/HEAD; no enviar formularios ni crear registros.

No se accede al catálogo privado desde la web. El contenido público sigue siendo
editorial versionado; no se declara sincronización automática con Admin. El módulo
privado, sus imágenes, membresías, inscripciones y controles de correo no cambian.

## Reversión

Deployment anterior de la web identificado para contingencia:
`https://iaencolombia-60wf21bvx-kpi-chat-s-projects.vercel.app`, asociado a
`bad97b43b990f5894882ef4560a382c7ef2f6fce`, registro GitHub Production `7822259168`.

Ese deployment utiliza Next 16.4.4 y recuperaría su aviso de seguridad. Por ello se
prefiere una corrección o reversión de la integración visual que conserve Next 16.4.6;
una restauración temporal del deployment previo requiere evaluar ese riesgo.
No se restaura PostgreSQL ni se revierten imágenes de API/worker por esta publicación.
