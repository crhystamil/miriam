# Research: Actualizar contacto y WhatsApp

## Decision: Usar WhatsApp como destino del formulario sin backend

**Rationale**: El requerimiento pide que al hacer click se envie un mensaje a WhatsApp con la informacion llenada. Abrir un enlace de WhatsApp con texto prellenado cumple el objetivo sin agregar almacenamiento, email ni endpoints nuevos.

**Alternatives considered**:

- Guardar mensajes en backend: excede alcance y contradice la premisa de envio por WhatsApp.
- Enviar email: no solicitado y menos directo para atencion inmediata.
- Mantener formulario visual sin accion: no cumple el requerimiento.

## Decision: Validar campos obligatorios antes de abrir WhatsApp

**Rationale**: Evita mensajes vacios o inutiles para el negocio. La validacion local es suficiente porque no hay persistencia ni backend.

**Alternatives considered**:

- Permitir envio con campos vacios: reduce friccion, pero genera mensajes poco accionables.
- Validacion en backend: innecesaria al no existir backend para este flujo.

## Decision: Actualizar enlaces WhatsApp en todas las superficies publicas detectadas

**Rationale**: Existen enlaces antiguos en layout publico, tarjetas de producto y detalle. Mantenerlos crearia inconsistencia y clientes contactarian un numero incorrecto.

**Alternatives considered**:

- Cambiar solo ContactPage: incompleto; usuarios pueden iniciar contacto desde productos.
- Redirigir todos los contactos a la pagina de contacto: agrega un paso innecesario cuando WhatsApp directo ya existe.

## Decision: Mantener direccion textual visible junto al mapa embebido

**Rationale**: El iframe puede fallar por red, bloqueo o privacidad. La direccion textual garantiza que el visitante conserve informacion util.

**Alternatives considered**:

- Mostrar solo mapa: mala degradacion si no carga.
- Mostrar solo direccion: pierde valor visual y navegacional del mapa solicitado.

## Decision: Consolidar datos de contacto si resulta mas simple que duplicarlos

**Rationale**: La misma informacion se usa en varias superficies publicas. Una constante compartida reduce riesgo de futuros datos divergentes.

**Alternatives considered**:

- Repetir literales en cada componente: rapido, pero propenso a inconsistencias.
- Crear configuracion backend: innecesario para datos estaticos publicos.
