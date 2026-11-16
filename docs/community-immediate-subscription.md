# Comunidad: registro y suscripción en una interacción

PR compañero: plataforma-acia, rama feature/community-immediate-subscription.

- Se conserva el formulario existente. Solo Comunidad exige privacidad y comunicaciones por separado. Ambas casillas arrancan sin marcar; el botón «Unirme a Comunidad» exige además los campos HTML válidos.
- Explicación visible junto al botón y aria-describedby. El requisito no depende del color del botón. Desmarcar cualquiera de las casillas deshabilita el envío.
- Contrato existente POST /public/affiliation-prospects; la versión nueva es community-communications-2026-11-13. No se añade cuenta, acceso privado, checkout ni beneficios.
- La respuesta de éxito no revela identidad ni estado anterior. Explica alta sin confirmación y conservación de bajas/supresiones. No afirma verificación de correo.
- Preferencias/baja/resuscripción por enlace se conservan. No se reactiva una dirección retirada mediante un registro duplicado.
- Aclaración de política aprobada expresamente el 16 de noviembre de 2026 e incorporada literalmente: Comunidad es una suscripción gratuita con autorización expresa; las afiliaciones de pago, Visionarios y otras vinculaciones no dependen de ella. La página muestra fecha propia de la aclaración; conserva la vigencia y los identificadores previos para no reetiquetar registros históricos. El pie de privacidad mantiene aceptación separada.

## Despliegue coordinado aprobado; ejecución por etapas

1. Verificar el HEAD actualizado de esta web y su nuevo CI antes del merge. Plataforma #56 ya fusionada (99d44d5) y backend desplegado; migración y salud aprobadas por el operador. El diagnóstico inicial identifica 4 candidatos, sin conversión ejecutada. No repetir migración/despliegue de backend.
2. Respaldar y aplicar únicamente 20261113_0001_community_immediate_subscription.sql del PR backend.
3. Mantener webhook Elestio Disabled y 0 ejecuciones; desplegar API/worker coordinados, con misma imagen inmutable y una instancia supervisada.
4. Activar COMMUNITY_IMMEDIATE_SUBSCRIPTION_ENABLED=true y recrear API/worker. Verificar Settings efectivos en Admin Comunidad, además del diagnóstico nuevo.
5. Solo entonces merge/despliegue de esta web. Esto evita mostrar alta inmediata mientras el backend aún genera pendientes.
6. Obtener lote final con corte posterior a terminar todos los procesos API anteriores. Revisarlo, respaldarlo de nuevo y aprobar antes de activar históricos. El backend revalida bajas con bloqueos; no hay catch-up ni cambios a campañas preparadas.

Durante la ventana, clientes antiguos con consentimiento válido siguen funcionando; sin consentimiento reciben 422 y deben recargar. Los pending generados mientras se instalaba el backend se incluyen en la revisión final; nunca se convierten sin el lote específico aprobado.

Rollback: restaurar web anterior primero, luego desactivar únicamente el flag nuevo con backend compatible. Conservar suscripciones/evidencia/bajas y schema; no borrar histórico ni encolar campañas. La web anterior sin casilla marcada no podrá registrar Comunidad, por validación del backend.

## Validación

npm test, lint, build y test:member-access. scripts/community-browser.mjs verifica DOM real, teclado, validez requerida, móvil, un envío sintético local y separación de pagos. Requiere Playwright/Chromium de pruebas disponibles; permite ACIA_PLAYWRIGHT_MODULE y ACIA_CHROMIUM_EXECUTABLE. Bloquea red no local y simula solo la respuesta del formulario; las pruebas FastAPI/PostgreSQL reales del PR backend prueban escritura, audiencia y concurrencia. No es evidencia de un evento productivo.

El manifiesto scripts/review/protected-files.json se actualiza únicamente para los contratos de Comunidad y el texto de su plan cambiados por este alcance. No se eliminan guardas de pagos, preferencias ni privacidad.

Aprobación del texto de política: 16 de noviembre de 2026, explícita del operador. La guarda de no publicar el plan privado admite únicamente la frase exacta aprobada en privacyPolicy.ts; continúa bloqueando cualquier otra mención en fuentes, contenido o metadatos públicos. No se publican catálogo, condiciones ni precios de ese plan.
