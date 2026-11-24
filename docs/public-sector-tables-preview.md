# Mesas técnicas sectoriales: propuesta pública local

Registro de la etapa visual aprobada en `c7804bc`. La preparación de publicación
y la resolución del aviso de Next se documentan en `public-sector-tables-release.md`.

Base de la web: `bad97b43b990f5894882ef4560a382c7ef2f6fce` de origin/main,
repositorio `Milocam35/iaencolombia-web`. Rama local independiente
`feature/public-sector-tables-preview`. Los otros checkouts y sus revisiones
pendientes permanecen intactos. No se publica esta etapa.

## Abrir y revisar

1. Abrir `.local-review/sector-tables/index.html`: galería de capturas y los seis
   objetivos/impactos propuestos. Funciona sin servidor.
2. Para interactuar, ejecutar `VER-PROPUESTA-MESAS.cmd` desde este worktree.
3. Abrir `http://127.0.0.1:3187/` y pulsar «Conoce las seis mesas», o entrar en
   `http://127.0.0.1:3187/mesas-tecnicas-sectoriales`.
4. Mantener la terminal abierta; Ctrl+C detiene el servidor. Si el puerto está
   ocupado, revisar el proceso existente; no matar servicios ajenos.

El launcher reutiliza el build local y las dependencias instaladas. No configura
variables de producción: `NEXT_PUBLIC_ACIA_API_URL=http://127.0.0.1:9` aísla los
lectores públicos existentes de newsletters/planes. No se publican esos valores.
La portada conserva los bloques reales; los lectores públicos usan sus estados
vacíos durante esta revisión. La captura del video de Universo usa la preferencia
de movimiento reducido y muestra su miniatura existente, sin cambiar el componente.

## Implementación

- Se añade `SectorTablesSection` inmediatamente después de `.op3-conversion`, que
  contiene ValueSection, ProfileSelector y UniverseSection completos, antes de la
  franja editorial. Los componentes restantes conservan su orden.
- La página dedicada reutiliza PublicPage, Header y Footer, los botones existentes,
  Plus Jakarta Sans y los colores institucionales. Su CSS es local al módulo.
- Las tarjetas son botones semánticos asociados a sus paneles. Solo una queda
  expandida. En escritorio el panel ocupa la fila bajo la pareja; en móvil queda
  inmediatamente después de su tarjeta. El DOM conserva el orden 1–6.
- La sexta mesa se identifica como Transversal visualmente y mediante descripción
  accesible. Hay foco visible, teclado y respeto de movimiento reducido.
- Los CTA reutilizan `/afiliate` y `MEMBER_PORTAL_URL`. No se crea un formulario
  paralelo ni se modifica el derecho de acceso a las mesas.
- La ruta de propuesta se marca noindex. Ese estado y la nota editorial local se
  revisarán expresamente antes de una eventual publicación.

## Contenido y fuente

Se revisó `acia.sector_tables` y sus nombres/objetivos iniciales en
`plataforma-acia`, migración `20261123_0001_sector_technical_tables.sql`, commit
`e6c10cec2e363b7caf3491db23728152f87f704e`. La implementación no tiene un campo de
impacto esperado; los impactos de esta entrega son propuestas editoriales.
No se consultaron registros ni endpoints privados de producción.

Los textos completos están en `public-sector-tables-editorial.md` y en la galería.
La fuente de esta propuesta es `src/data/sectorTables.ts`, con los seis slugs
canónicos y exclusivamente campos públicos. Para una primera implementación, la
opción más sencilla es conservar este catálogo editorial versionado y revisar sus
actualizaciones mediante PR cuando cambien los objetivos aprobados.

Esto no ofrece sincronización automática con las ediciones de Admin. Si se desea
gestión pública desde Admin, una fase posterior debe aprobar una proyección pública
explícita de nombre, imagen, objetivo e impacto, sin participantes, documentos,
calendarios o links privados. No se debe consumir el catálogo privado y ocultar
datos en el navegador. Esa API y cualquier schema nuevo no forman parte de esta etapa.

## Recursos gráficos

Siete imágenes nuevas: seis mesas y una escena de colaboración para el inicio.
Generadas con la herramienta integrada image_gen, sin fotografías de terceros,
collages, texto incrustado o logos recreados. Las originales generadas se conservan
en el directorio de salida de Codex; los WebP del proyecto están en
`public/images/mesas-publicas/`. No se reemplaza ninguna imagen de Mi ACIA.

Prompts: `public-sector-tables-image-prompts.json`. Procedencia, tamaños y hashes:
`public-sector-tables-image-manifest.json`. Siete WebP, aproximadamente 1,1 MB en
total; el inicio consume únicamente su escena de colaboración. Los recortes son
responsivos y cada fotografía incluye texto alternativo ilustrativo.

## Validación

- `npm test`: 63 pruebas aprobadas, cero fallos y cero skips.
- `npm run lint`: cero errores, un aviso previo de img en NewsletterArticle.
- `npm run build -- --webpack`: build y TypeScript completados. Webpack es una
  opción soportada de Next; no se cambia la configuración del producto para el
  worktree anidado. Se documenta abajo el aviso de seguridad de la versión existente.
- `node scripts/public-sector-tables-browser.mjs`: Next real, navegador real,
  solo GET/HEAD a loopback, sin bypass de autenticación ni respuestas privadas falsas.
  Se verifican orden, navegación, apertura/cierre, un panel abierto, teclado/foco,
  tacto, movimiento reducido y ausencia de overflow entre 320 y 1440 px.
- Se generan capturas de contexto, tarjetas cerradas y abiertas en escritorio/móvil;
  `browser-evidence.json` relaciona las comprobaciones con hashes y build local.
- `node scripts/export-public-sector-review.mjs` prepara galería y textos editoriales.

La grabación opcional se retiró del helper al detectar que faltaba FFmpeg; no se
añadieron dependencias para ella. La comprobación inicial de foco programático se
corrigió para usar Tab/Shift+Tab reales antes de Enter/Space. No se relajó CSS ni se
omitió ninguna comprobación. Las capturas finales se generan sin scroll animado.

## Aviso previo de Next y aprobación pendiente

La dependencia existente Next 16.4.4 fue señalada por el build y `npm audit` por
avisos moderados; el registro npm propone Next 16.4.6. El primer build se detuvo
tras compilar para mostrar el recordatorio; el reintento admitido completó el build
manteniendo la advertencia. No se desactivó TLS ni se cambiaron dependencias.

La vista previa local no certifica la seguridad de un release productivo con esa
versión. Antes de publicar: revisar la actualización de seguridad en otra rama,
aprobar imágenes/textos/diseño y preparar la publicación mediante el flujo real.
No se hizo push, PR, merge, migración, despliegue ni envío de correo en esta etapa.
