# Comunidad/Freemium: contrato web y despliegue

Esta entrega registra Comunidad y gestiona confirmación, baja y resuscripción.
No añade campañas, cuenta de Mi ACIA ni beneficios privados. El backend y Admin
se implementan en el PR compañero de `milcio79/plataforma-acia`, rama
`feature/community-audience-v1`.

## Experiencia

- Comunidad solicita nombre, email y privacidad. La autorización de comunicaciones
  y newsletters es otra casilla, opcional y desmarcada.
- No se pide teléfono/ciudad/mensaje para el nuevo formulario gratuito. El backend
  mantiene compatible el formulario previo.
- Se retira la promesa de directorio parcial. No hay checkout ni acceso privado.
- El mensaje distingue registro recibido, ausencia de autorización y confirmación
  pendiente; no afirma que un correo se haya entregado ni que exista una cuenta.
- `/comunidad/preferencias` permite solicitar baja o confirmación/resuscripción
  sin login. Una solicitud conocida y una desconocida muestran la misma respuesta.
- `/comunidad/confirmar#token=...` y `/comunidad/preferencias#token=...` mantienen
  el secreto solo en memoria; eliminan el fragmento de la dirección. El token
  nunca se guarda en localStorage/sessionStorage ni se envía como query/path.
- Visitar un enlace no cambia estado. El usuario debe pulsar el botón que envía
  POST. Las páginas declaran noindex y no-referrer.

## Contrato

Se conserva el POST y respuesta 202 de `/public/affiliation-prospects`.
Solo Comunidad añade:

```json
{
  "communications_consent": false,
  "communications_consent_version": "community-communications-2026-10-22"
}
```

El consentimiento verdadero exige la versión exacta. La ausencia de campos en el
formulario antiguo se interpreta como no autorizado; nunca como opt-in.

`POST /public/community/request`: email, action (`confirm`, `resubscribe`,
`unsubscribe`), honeypot website y consentimiento/versionado cuando corresponde.
`POST /public/community/confirm` y `/unsubscribe`: token en cuerpo JSON.
No existe operación mutante GET ni secreto SMTP en el navegador.

## Orden de despliegue y rollback

1. Revisión y autorización humana de ambos PRs. No fusionar la web primero.
2. Backend: respaldo, migración aditiva `20261022_0001_community_audience.sql`,
   postflight, API/Admin y worker de la misma imagen inmutable; canal nuevo disabled.
3. Verificar que el backend acepta el nuevo contrato; después desplegar esta web.
   Backend anterior rechaza los campos nuevos con 422: ese orden es obligatorio.
4. Canary de Comunidad usa su control independiente; conservar los tres correos
   transaccionales live, SMTP, cutoff, recordatorios apagados e invitaciones bloqueadas.
5. GO humano antes de live; comprobar el próximo registro legítimo, sin fixtures
   ni envíos reales creados por el desarrollo.

No hay nuevas variables frontend. Se conserva `NEXT_PUBLIC_ACIA_API_URL`.
`COMMUNITY_EMAIL_DELIVERY_MODE` pertenece exclusivamente al backend Elestio.

Rollback: desactivar solo el canal nuevo y conservar contactos/consentimientos/
bajas. Revertir primero la web antes de revertir el contrato backend. Restaurar
API y worker juntos al mismo release anterior, sin eliminar tablas. La web anterior
carece de opt-in nuevo y no reactiva contactos dados de baja.

El runbook backend versionado contiene la coordinación del worker fijado por
`mail-worker-operations/context.json`, comprobación de imagen/heartbeat y la
prohibición de `compose down`/`--remove-orphans` sobre servicios compartidos:
https://github.com/milcio79/plataforma-acia/blob/feature/community-audience-v1/docs/community-audience-v1.md

## Validación local

- `npm test`: 30 PASS (26 existentes y 4 nuevos).
- `npm run test:member-access`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS con Turbopack, TypeScript y 15 páginas.
- También compiló con webpack durante el diagnóstico de fuentes.
- Windows necesitó `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` para usar
  el almacén de certificados del sistema. No se desactivó TLS ni se modificaron
  fuentes/layout/dependencias. La base 74a9688 compiló con esa misma configuración.

Pruebas locales usaron `NEXT_PUBLIC_ACIA_API_URL=https://api.example.test`; no se
crearon registros ni se hicieron envíos productivos. Los tests backend del PR
compañero validan PostgreSQL, confirmación, baja, concurrencia y SMTP falso.

Faltan otros bloques para completar el recorrido general: provisión pospago,
invitación segura de Mi ACIA, conciliación/renovaciones y distribución de campañas.
