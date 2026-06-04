# Feature Specification: Acceso por celular para mayoristas

**Feature Branch**: `main`  
**Created**: 2026-06-04  
**Status**: Draft  
**Input**: User description: "debemos darle seguridad a la vista de mayorista, debe ser facil acceder, no tendra credenciales de acceso pero quiza se puede ayudar a acceder con su numero de celular a esta vista."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ingresar con numero de celular (Priority: P1)

Como mayorista, quiero acceder a la vista de productos ingresando mi numero de celular, para consultar el catalogo de forma simple sin crear ni recordar credenciales.

**Why this priority**: Es el flujo principal solicitado: proteger la vista sin convertir el acceso en un login tradicional complejo.

**Independent Test**: Se puede probar ingresando un numero de celular valido en la pantalla de acceso y verificando que se habilite la vista de productos para mayoristas.

**Acceptance Scenarios**:

1. **Given** que un mayorista no ha ingresado a la vista, **When** abre el acceso de mayoristas, **Then** ve una solicitud clara para ingresar su numero de celular.
2. **Given** que el mayorista ingresa un numero de celular valido, **When** confirma el acceso, **Then** puede ver la vista de productos para mayoristas.
3. **Given** que el mayorista ya habilito el acceso durante la sesion actual, **When** vuelve a la vista de mayoristas, **Then** no tiene que ingresar nuevamente el numero mientras la sesion siga vigente.

---

### User Story 2 - Bloquear acceso sin numero valido (Priority: P2)

Como responsable del negocio, quiero que la vista de mayoristas no quede completamente abierta, para reducir accesos casuales o no identificados a informacion comercial sensible.

**Why this priority**: Aporta la capa minima de seguridad pedida sin exigir usuario y contrasena.

**Independent Test**: Se puede probar intentando acceder a la vista sin ingresar numero, con un numero incompleto o con formato invalido, y verificando que no se muestre la tabla de productos mayorista.

**Acceptance Scenarios**:

1. **Given** que una persona abre la vista de mayoristas sin haber ingresado numero, **When** intenta ver los productos, **Then** el sistema solicita el numero antes de mostrar la tabla.
2. **Given** que una persona ingresa un numero incompleto o invalido, **When** intenta continuar, **Then** ve un mensaje claro para corregirlo y no accede a la tabla.
3. **Given** que una persona abandona el flujo de acceso, **When** no completa el numero, **Then** la informacion mayorista permanece oculta.

---

### User Story 3 - Informar uso del numero (Priority: P3)

Como mayorista, quiero entender por que se pide mi numero de celular, para confiar en el acceso y saber que informacion estoy entregando.

**Why this priority**: Mejora la confianza y reduce friccion en un acceso que pide un dato personal.

**Independent Test**: Se puede probar revisando la pantalla de acceso y verificando que explique de forma breve que el numero se usa para habilitar el acceso mayorista y no solicita contrasena.

**Acceptance Scenarios**:

1. **Given** que un mayorista llega al acceso, **When** ve el formulario de celular, **Then** tambien ve una explicacion breve del motivo de la solicitud.
2. **Given** que el mayorista debe ingresar su numero, **When** revisa el acceso, **Then** queda claro que no necesita usuario ni contrasena.

### Edge Cases

- El numero ingresado tiene menos digitos de los esperados.
- El numero ingresado contiene letras, simbolos no permitidos o espacios innecesarios.
- El mayorista actualiza la pagina despues de habilitar el acceso.
- El mayorista cierra el navegador o vuelve despues de que la sesion expiro.
- Una persona intenta abrir directamente un enlace interno de la vista mayorista sin haber ingresado el numero.
- El mayorista no quiere entregar su numero y decide no continuar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST solicitar un numero de celular antes de mostrar la vista de productos para mayoristas.
- **FR-002**: El sistema MUST permitir acceso sin usuario, contrasena ni registro de cuenta tradicional.
- **FR-003**: El sistema MUST validar que el numero ingresado tenga un formato de celular aceptable antes de habilitar la vista.
- **FR-004**: El sistema MUST impedir que se muestre la informacion mayorista si no existe un numero de celular valido para la sesion de acceso.
- **FR-005**: El sistema MUST mostrar mensajes claros cuando el numero este vacio, incompleto o tenga formato invalido.
- **FR-006**: El sistema MUST mantener habilitado el acceso durante la sesion vigente despues de ingresar un numero valido.
- **FR-007**: El sistema MUST volver a solicitar el numero cuando la sesion de acceso ya no este vigente.
- **FR-008**: El sistema MUST explicar de forma breve por que se solicita el numero de celular.
- **FR-009**: El sistema MUST indicar que no se requiere usuario ni contrasena para este acceso.
- **FR-010**: El sistema MUST evitar exponer la tabla mayorista al abrir directamente enlaces internos sin haber completado el acceso por celular.
- **FR-011**: El sistema MUST limitar la informacion solicitada al minimo necesario para habilitar este acceso.
- **FR-012**: El sistema MUST permitir que el mayorista abandone el flujo sin entregar su numero, manteniendo oculta la vista mayorista.

### Key Entities

- **Mayorista**: Persona que necesita consultar la vista de productos mayorista de forma simple.
- **Numero de celular**: Dato ingresado por el mayorista para habilitar el acceso sin credenciales tradicionales.
- **Sesion de acceso mayorista**: Estado temporal que permite ver la vista mayorista despues de ingresar un numero valido.
- **Vista de productos mayorista**: Informacion comercial protegida por el acceso simple con numero de celular.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un mayorista puede habilitar el acceso a la vista en menos de 30 segundos ingresando un numero de celular valido.
- **SC-002**: 100% de los intentos de acceso sin numero valido mantienen oculta la informacion mayorista.
- **SC-003**: 100% de los numeros vacios, incompletos o con formato invalido muestran un mensaje de correccion antes de permitir continuar.
- **SC-004**: 90% de usuarios de prueba comprenden que no necesitan usuario ni contrasena para entrar.
- **SC-005**: 100% de los accesos directos a rutas internas de la vista mayorista requieren haber completado primero el acceso por celular.

## Assumptions

- Este acceso es una barrera simple de seguridad y no reemplaza una autenticacion fuerte con usuario, contrasena o verificacion externa.
- Se asume que el objetivo es reducir accesos anonimos casuales sin crear friccion alta para los mayoristas.
- El numero de celular se usa inicialmente para habilitar acceso a la vista y no para aprobar compras, crear cuentas ni verificar identidad legal.
- La sesion de acceso mayorista debe ser temporal para equilibrar comodidad y proteccion de la informacion.
- La especificacion complementa la vista de productos para mayoristas previamente definida.
