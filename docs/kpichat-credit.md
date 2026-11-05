# Firma global KpiChat.ai

Firma solicitada por el usuario, basada en https://fonomia.com/ (verificada el 5 de noviembre de 2026): cápsula inferior izquierda con “By”, logotipo azul y enlace https://www.kpichat.ai en pestaña nueva, con noopener/noreferrer.

Componente global único KpiChatSignature, montado fuera de la autorización y de las rutas en React, o en el RootLayout de Next: incluye ingreso, recuperación, páginas públicas y privadas. No altera permisos ni contratos API. Logotipo local original de https://fonomia.com/brand/kpichat-blue.png; SHA-256 c35d976601b061cb90ff765937aaf45e2bb02ca5a0091cf2979a9ca93b65c125. No hay solicitudes al servidor de Fonomia, tracking, scripts externos ni dependencias nuevas.

Estilo de la referencia: logo de 16 px, 14 px en móvil (hasta 560 px), separación inferior de 18 px o 64 px en móvil, con safe area. Z-index reducido a 20 y firma oculta al abrir un diálogo modal para conservar las capas y el foco. Foco de teclado visible; sin animaciones ni cambios en el flujo de página.

Despliegue autorizado para los frontends existentes mediante sus integraciones Vercel. Este cambio no requiere despliegue de FastAPI/worker, Elestio, SQL, migraciones, cambios de correo ni variables de entorno.

## Validación local

Compilación y TypeScript aprobados. Guardias del bundle y encabezados existentes conservadas. Pruebas focales de autenticación/layout: Admin 14, Mi ACIA 15; web compilada con lint sin errores (warning anterior de imagen de newsletter sin cambios).

Navegador real sobre el build: una firma en distintas rutas, ingreso y rutas protegidas redirigidas sin sesión; para web también 404. Escritorio 1440 px y móvil 390/320 px: logo local decodificado, tamaño y posición comprobados, foco por Tab, enlace externo con noopener/noreferrer y ocultación durante diálogo modal. Hash del archivo público coincide con el original de Fonomia. Red externa bloqueada, sin login, sin datos reales y sin escrituras de negocio. Evidencia y capturas en `docs/review/kpichat-credit/`. Procesos locales detenidos.
