# Enlaces comprobados · Opción 3

30/10/2026. Chromium en `http://127.0.0.1:3201`, API GET simulada en 4399. Ningún pago, alta o correo real. Los estados no son una garantía de disponibilidad futura.

## Rutas públicas

| Destino | Resultado | Alcance |
|---|---|---|
| `/` | PASS | Composición, SEO, imágenes, enlaces y reflow |
| `/afiliate` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/observatorio` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/papers` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/normatividad` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/comunicados` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/comunicados/terremoto-colombia-10-agosto-2026` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/newsletters` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/newsletters/cuando-un-agente-de-ia-actua-en-nombre-de-su-empresa-21e97a325f844cbbb180007944f8bc56` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/newsletters/que-deberia-quedar-despues-de-un-curso-de-inteligencia-artificial-4228750506f54cf2ab45296449554d10` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/transparencia` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/politica-tratamiento-datos` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/equipo` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/afiliate/pago/resultado` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/comunidad/confirmar` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/comunidad/preferencias` | PASS | Respuesta/render y reflow; newsletters con fixture local |
| `/newsletters/preferencias` | PASS | Respuesta/render y reflow; newsletters con fixture local |

## Navegación y parámetros

| Grupo | Resultado | Evidencia |
|---|---|---|
| Todos los fragmentos visibles de la home | PASS | Cada `href` con fragmento tiene un ID real; inventario en `visual-report.json` |
| Cabecera desktop y móvil | PASS | Submenús, Escape, foco retenido en diálogo, retorno al botón; CTA persistente |
| Perfiles Personas / Empresas / Instituciones | PASS | Categoría correcta y foco en `#planes` |
| Nueve `/afiliate?plan=...` | PASS | comunidad, afiliado, estudiante, profesional, micro_empresa, pequena_empresa, mediana_empresa, gran_empresa, institucion_educativa; conserva tipo y selección de plan vacía |
| `?type=person/company/institution/strategic_ally` | PASS | Tipo derivado sin alterar contrato |
| Plan desconocido | PASS | Aviso existente |
| `mailto:contacto@iaencolombia.org` | PASS estático | Destino revisado, sin lanzar cliente ni enviar correo |
| Correo de privacidad | CONSERVADO | Texto jurídico y hash idénticos; no se redirigió a contacto general |

## Enlaces externos (GET público, sin sesión)

| URL | HTTP | Resultado |
|---|---:|---|
| [https://www.unesco.org/en/articles/almaty-brings-global-experts-together-explore-future-higher-education-arts-and-ai](https://www.unesco.org/en/articles/almaty-brings-global-experts-together-explore-future-higher-education-arts-and-ai) | 200 | PASS |
| [https://www.unevoc.unesco.org/en/articles/integrating-ai-tvet-practical-guide-institutions-0](https://www.unevoc.unesco.org/en/articles/integrating-ai-tvet-practical-guide-institutions-0) | 200 | PASS |
| [https://www.unesco.org/en/articles/faculties-education-latin-america-address-how-prepare-future-teachers-age-artificial-intelligence](https://www.unesco.org/en/articles/faculties-education-latin-america-address-how-prepare-future-teachers-age-artificial-intelligence) | 200 | PASS |
| [https://www.radionacional.co/actualidad/tecnologia/microsoft-acuerdo](https://www.radionacional.co/actualidad/tecnologia/microsoft-acuerdo) | 200 | PASS |
| [https://congreso.america-digital.com/](https://congreso.america-digital.com/) | 200 | PASS |
| [https://women-in-tech.org/colombia/](https://women-in-tech.org/colombia/) | 200 | PASS |
| [https://mi.iaencolombia.org](https://mi.iaencolombia.org) | 200 | PASS |
| [https://admin.iaencolombia.org](https://admin.iaencolombia.org) | 200 | PASS |

Los cuatro titulares editoriales se contrastaron con sus fuentes oficiales el 30/10/2026. Fechas de publicación: UNESCO Almaty 28/10 (actualización 29/10); UNEVOC 21/10; UNESCO formación docente 20/10 (actualización 27/10); Radio Nacional 14/10. No se sustituyen por la fecha de actualización. Los resúmenes y fechas de ACIA al día se sirven mediante el contrato existente; las capturas usan dos fixtures de ediciones del 27 y 26/10 y un cuerpo explícitamente de prueba.

Mi ACIA y Admin se comprobaron únicamente como páginas públicas de acceso; no se autenticó, extrajo información ni se probaron roles.
