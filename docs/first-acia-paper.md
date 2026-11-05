# Primer paper de ACIA: revisión y publicación

## Alcance y arquitectura

Implementación en el repositorio `Milocam35/iaencolombia-web`, desde `origin/main` b15614e7bceae3b1b22fe7a125ed0ab89ac0a6e8, rama `feature/first-acia-paper`.

La ruta pública existente `/papers` usa `src/data/papers.ts`: contenido versionado, sin API ni gestión Admin asociada a esta sección. Se conserva ese mecanismo; no hay CMS, migración ni cambios de backend. Una única entrada estable por slug y registro MPRA; compilar o desplegar de nuevo no inserta registros ni dispara campañas. No se modifican pagos, afiliación, Mi ACIA o automatizaciones de correo.

Se mantiene PublicPage, Header, Footer, las cuatro colecciones y la navegación. La ficha real sustituye el estado vacío, dentro de la sección Research Papers. La tarjeta de la colección indica una publicación y enlaza a esa sección; las otras tres colecciones conservan su lugar y muestran cero. Se actualiza únicamente el enlace de Papers de la sección Conocimiento del inicio, de “En preparación” a “Ver publicaciones”.

## Fuentes y decisión editorial

Verificadas el 4 de noviembre de 2026:

- Registro: https://mpra.ub.uni-muenchen.de/131077/
- Original: https://mpra.ub.uni-muenchen.de/131077/1/MPRA_paper_131077.pdf
- PDF: 22 páginas, 1.137.472 bytes. Portada externa (página 1): título en inglés, autores “Varela, Angel and Cortez, Juan and Colmenares, Alejandro”, fecha 17 June 2026 y depósito 30 Sep 2026 06:17 UTC.
- Portada interna (página 2): “Septiembre 29 de 2026”; Angel Varela, Alejandro Colmenares, Juan Camilo Cortes, en ese orden. La página 3 contiene el título español completo y repite ese orden de autores. Su abstract respalda el resumen suministrado por ACIA.
- Se usa la autoría interna en ficha y cita. Se conserva el título completo proporcionado, confirmado en la página 3 y el registro. La web muestra solamente año 2026 y “Depósito en MPRA: 30 de septiembre de 2026”; no se atribuye fecha del despliegue al documento ni se elige una de las dos fechas de portada como fecha original de publicación.
- Tras la revisión, el usuario aprobó expresamente incluir este documento en Research Papers y utilizar el formato institucional existente. Se asigna `ACIA-RP-2026-001`: RP = Research Paper, 2026 = año del documento, 001 = primer consecutivo de esa serie anual. No había otro identificador asignado en el catálogo versionado. El código queda persistido como contenido; no se recalcula ni incrementa al compilar, cambiar el orden o desplegar. El siguiente paper de la misma serie y año deberá usar el siguiente consecutivo disponible, previa revisión del catálogo.
- El código ACIA identifica la ficha institucional y se muestra también en la referencia copiable. Es independiente de MPRA Paper n.º 131077 y no cambia los bytes ni las portadas del PDF. La clasificación editorial Research Paper no implica revisión por pares. No se asignan DOI, versión, licencia ni estado de revisión.
- La institución es Asociación Colombiana de Inteligencia Artificial — ACIA. MPRA se presenta como repositorio; no como autor, institución autora ni aval académico.

## Archivos y preservación

Original sin recomponer, editar ni añadir marcas:

`public/papers/gobernanza-ia-infraestructura-economica-mpra-131077.pdf`

SHA-256 de la descarga de MPRA, copia pública, respuesta HTTP y descarga del navegador:

`d061b9cd2ddc90e391181e164f4dacb057e7996d9a9cf88d9a2ef10486307aa4`

Miniatura: `public/papers/gobernanza-ia-infraestructura-economica-portada.png`, render de la página interna 2, 640 × 906 px; no es una portada generada ni altera el PDF.

## URLs previstas después de aprobación y despliegue

- Ficha y canónica: https://www.iaencolombia.org/papers
- Lectura y descarga: https://www.iaencolombia.org/papers/gobernanza-ia-infraestructura-economica-mpra-131077.pdf
- Registro externo: https://mpra.ub.uni-muenchen.de/131077/

No se crea una ruta de detalle adicional: la sección existente contiene la ficha completa. El proyecto no tiene sitemap y no se añade otra URL HTML que requiera incorporarse a uno. Se configura canónica de `/papers`, Open Graph y Twitter con datos reales y miniatura original, sin fecha de despliegue.

Leer PDF abre el archivo público en una pestaña nueva para el visor nativo, con enlace de descarga alternativo independiente de sesión. Descargar PDF usa el mismo archivo y el atributo download del mismo origen. Los enlaces externos usan noopener/noreferrer. La referencia está disponible en un textarea de solo lectura aun sin JavaScript; el botón copia el texto y, si el portapapeles no está disponible, selecciona la referencia para copiarla manualmente.

## Validación

- Suite web: 54 pruebas aprobadas, incluidas 7 del paper (integridad original, autoría, ausencia de metadatos inventados, clasificación, enlaces, cita, SEO, deduplicación y ausencia de efectos de correo).
- Navegación member-access, TypeScript y build Next: PASS.
- Lint: sin errores; permanece el warning anterior de img en NewsletterArticle, ajeno a esta entrega.
- Auditoría de dependencias de producción: 0 vulnerabilidades. Sin cambios de dependencias o lockfile.
- Navegador Chromium sobre Next compilado real, sin login y con red externa bloqueada: escritorio 1440 × 1000, móvil 390 × 844 y 320 × 844, sin overflow horizontal. Una ficha, sin estado vacío, navegación y colecciones presentes; sin errores JavaScript.
- PDF público: GET 200 application/pdf; Range 206; descarga mediante botón del navegador con nombre y SHA-256 originales.
- Copia real al portapapeles, alternativa con selección de texto y foco por teclado: PASS.
- No hubo peticiones distintas de GET/HEAD ni envíos SMTP. Ningún servicio de revisión queda activo.
- `git diff --check`: PASS.

Capturas: `docs/review/first-paper/index.html`; evidencia estructurada: `validation.json`. El helper `scripts/papers-browser.mjs` requiere Playwright y Chromium disponibles indicados por `ACIA_MAIL_PLAYWRIGHT_MODULE` y `ACIA_MAIL_CHROMIUM_PATH`, sirve el build en un puerto localhost efímero y detiene sus procesos al terminar. No incorpora dependencias de navegador al producto.

## Procedimiento de publicación (no ejecutado)

1. Revisar el Draft PR y las capturas. Confirmar autoría interna, fechas etiquetadas, texto y descarga. La vista previa de Vercel asociada al PR permite revisar el contenido sin modificar el dominio productivo.
2. Verificar que los checks corresponden exactamente al HEAD final del PR: auditoría productiva, tests, member-access, lint, build, smoke del runtime e integridad del diff. Si main avanza, revisar diferencias e integrar sin reescritura destructiva, validando lo afectado.
3. Obtener autorización explícita para merge y despliegue. No hacer merge antes: la integración de Vercel con main puede desplegar automáticamente.
4. Hacer merge del HEAD revisado y esperar SUCCESS del despliegue Production sobre el commit fusionado. No se requiere Elestio, base de datos, configuración SMTP ni nuevas variables de entorno.
5. Verificar el dominio público: HTTP 200 de `/papers`, ficha única, portada cargada y estado vacío ausente; revisar móvil, canónica y metadatos; usar Leer PDF, Descargar PDF y Copiar referencia. Comprobar el hash anterior sobre el PDF descargado. Los enlaces MPRA deben continuar apuntando al registro exacto.
6. Registrar SHA fusionado y despliegue. Si hubiera un defecto de ficha, preparar una corrección conservando la URL y bytes del PDF ya compartido; evitar borrar o renombrar el archivo público.

Estado de esta entrega: preparada para revisión, sin merge ni despliegue productivo. No se ejecuta ninguno de estos pasos contra producción.

## Revisión de colección e identificador

Cambio solicitado después del primer Draft: Research Papers con código ACIA-RP-2026-001. Se actualizan únicamente clasificación, agrupación de la página, identificador en ficha y cita, pruebas focales y capturas. Se mantienen intactos el PDF, autoría, fechas, resumen, URLs y metadatos sociales. No se repiten las suites locales ajenas al cambio; CI valida el HEAD actualizado del mismo Draft PR.
