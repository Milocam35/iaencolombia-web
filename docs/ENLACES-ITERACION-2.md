# URLs verificadas · segunda iteración

29/10/2026. GET de páginas públicas; sin autenticación, envío ni checkout. Las respuestas de las rutas de gestión sin token muestran su estado seguro, no activan preferencias. Anclas comprobadas en DOM y navegación; mailto se revisa sintácticamente y no se envía correo.

| Destino | Estado |
|---|---|
| `#contenido` | Ancla existente única; navegación local comprobada |
| `#perfiles` | Ancla existente única; navegación local comprobada |
| `#planes` | Ancla existente única; navegación local comprobada |
| `/` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/#eventos` | Ancla existente única; navegación local comprobada |
| `/#hoja-de-ruta` | Ancla existente única; navegación local comprobada |
| `/#internacional` | Ancla existente única; navegación local comprobada |
| `/#noticias` | Ancla existente única; navegación local comprobada |
| `/#oportunidades` | Ancla existente única; navegación local comprobada |
| `/#pilares` | Ancla existente única; navegación local comprobada |
| `/#planes` | Ancla existente única; navegación local comprobada |
| `/#universo` | Ancla existente única; navegación local comprobada |
| `/#valor` | Ancla existente única; navegación local comprobada |
| `/afiliate` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/afiliate/pago/resultado` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/afiliate?plan=afiliado` | Ruta 200; parámetro conservado; selector vacío por contrato previo |
| `/afiliate?plan=comunidad` | Ruta 200; parámetro conservado; selector vacío por contrato previo |
| `/afiliate?plan=estudiante` | Ruta 200; parámetro conservado; selector vacío por contrato previo |
| `/afiliate?plan=gran_empresa` | Ruta 200; parámetro conservado; selector vacío por contrato previo |
| `/afiliate?plan=institucion_educativa` | Ruta 200; parámetro conservado; selector vacío por contrato previo |
| `/afiliate?plan=mediana_empresa` | Ruta 200; parámetro conservado; selector vacío por contrato previo |
| `/afiliate?plan=micro_empresa` | Ruta 200; parámetro conservado; selector vacío por contrato previo |
| `/afiliate?plan=pequena_empresa` | Ruta 200; parámetro conservado; selector vacío por contrato previo |
| `/afiliate?plan=profesional` | Ruta 200; parámetro conservado; selector vacío por contrato previo |
| `/afiliate?type=strategic_ally` | Ruta 200; tipo válido comprobado |
| `/comunicados` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/comunicados/terremoto-colombia-10-agosto-2026` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/comunidad/confirmar` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/comunidad/preferencias` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/equipo` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/newsletters` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/newsletters/cuando-un-agente-de-ia-actua-en-nombre-de-su-empresa-21e97a325f844cbbb180007944f8bc56` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/newsletters/preferencias` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/newsletters/que-deberia-quedar-despues-de-un-curso-de-inteligencia-artificial-4228750506f54cf2ab45296449554d10` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/normatividad` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/observatorio` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/papers` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/politica-tratamiento-datos` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `/transparencia` | HTTP 200 en servidor local; fixture de lectura para newsletters |
| `https://admin.iaencolombia.org` | 200 · GET público |
| `https://congreso.america-digital.com/` | 200 · GET público |
| `https://mi.iaencolombia.org` | 200 · GET público |
| `https://women-in-tech.org/colombia/` | 200 · GET público |
| `https://www.radionacional.co/actualidad/tecnologia/microsoft-acuerdo` | 200 · GET público |
| `https://www.unesco.org/en/articles/almaty-brings-global-experts-together-explore-future-higher-education-arts-and-ai` | 200 · GET público |
| `https://www.unesco.org/en/articles/faculties-education-latin-america-address-how-prepare-future-teachers-age-artificial-intelligence` | 200 · GET público |
| `https://www.unevoc.unesco.org/en/articles/integrating-ai-tvet-practical-guide-institutions-0` | 200 · GET público |
| `mailto:contacto@iaencolombia.org` | Dirección pública conservada; sin envío |
