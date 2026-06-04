# Feature Specification: Resolver conflicto de acceso admin

**Feature Branch**: `main`  
**Created**: 2026-06-04  
**Status**: Draft  
**Input**: User description: "se tiene un problema con el endpoint admin y tiene conflictos con el admin de django, cada que se quiere ingresar al admin de django redirige al login del portal de repuestos. podrias cambiar para que no tenga ese conflicto."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceder al panel administrativo interno (Priority: P1)

Como administrador interno, quiero ingresar al panel administrativo de gestion sin ser redirigido al login del portal de repuestos, para poder administrar el sistema desde el acceso reservado correspondiente.

**Why this priority**: Es el bloqueo principal reportado: impide a usuarios administrativos acceder a herramientas criticas de gestion.

**Independent Test**: Se puede probar navegando directamente al acceso administrativo interno y verificando que la pantalla mostrada corresponda al panel administrativo, no al portal de repuestos.

**Acceptance Scenarios**:

1. **Given** un usuario no autenticado que necesita entrar al panel administrativo interno, **When** visita el acceso administrativo, **Then** ve el login administrativo interno correspondiente.
2. **Given** un usuario con credenciales administrativas validas, **When** completa el login administrativo, **Then** ingresa al panel administrativo interno sin pasar por el portal de repuestos.
3. **Given** un usuario ya autenticado como administrador interno, **When** visita el acceso administrativo, **Then** permanece en el panel administrativo interno.

---

### User Story 2 - Mantener login del portal de repuestos (Priority: P2)

Como usuario del portal de repuestos, quiero seguir accediendo al login publico del portal desde su ruta correspondiente, para que el cambio administrativo no afecte mi flujo normal de ingreso.

**Why this priority**: El arreglo debe separar accesos sin romper el flujo publico existente.

**Independent Test**: Se puede probar visitando el acceso de login del portal y verificando que siga mostrando el login del portal de repuestos.

**Acceptance Scenarios**:

1. **Given** un usuario publico no autenticado, **When** visita el acceso del portal de repuestos, **Then** ve el login del portal de repuestos.
2. **Given** un usuario publico no autenticado, **When** intenta entrar a una seccion protegida del portal, **Then** es redirigido al login del portal de repuestos y no al login administrativo interno.

---

### User Story 3 - Evitar rutas ambiguas de administracion (Priority: P3)

Como responsable de soporte, quiero que las rutas administrativas y del portal sean distinguibles, para diagnosticar accesos incorrectos sin confundir los dos tipos de login.

**Why this priority**: Reduce futuras regresiones y tickets de soporte relacionados con redirecciones inesperadas.

**Independent Test**: Se puede probar revisando los accesos principales protegidos y confirmando que cada uno lleva al login que corresponde a su audiencia.

**Acceptance Scenarios**:

1. **Given** una ruta reservada para administracion interna, **When** se accede sin sesion valida, **Then** dirige al login administrativo interno.
2. **Given** una ruta reservada para usuarios del portal, **When** se accede sin sesion valida, **Then** dirige al login del portal de repuestos.

### Edge Cases

- Un usuario no autenticado intenta acceder al panel administrativo interno desde un enlace guardado o escribiendo la ruta manualmente.
- Un usuario autenticado en el portal de repuestos intenta acceder al panel administrativo interno sin permisos administrativos.
- Un usuario autenticado como administrador interno visita el login del portal de repuestos.
- Una ruta inexistente o mal escrita que empieza con un prefijo similar a administracion no debe terminar en un login incorrecto si no corresponde a ese flujo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir que el acceso administrativo interno muestre su login administrativo propio cuando no exista una sesion administrativa valida.
- **FR-002**: El sistema MUST evitar que el acceso administrativo interno redirija al login del portal de repuestos.
- **FR-003**: El sistema MUST permitir que usuarios con permisos administrativos ingresen al panel administrativo interno despues de autenticarse correctamente.
- **FR-004**: El sistema MUST mantener el login del portal de repuestos disponible para usuarios publicos o comerciales desde su acceso correspondiente.
- **FR-005**: El sistema MUST redirigir a usuarios no autenticados del portal de repuestos al login del portal, sin mezclarlo con el login administrativo interno.
- **FR-006**: El sistema MUST impedir que usuarios sin permisos administrativos entren al panel administrativo interno aunque tengan una sesion valida en el portal de repuestos.
- **FR-007**: El sistema MUST conservar una separacion clara entre rutas de administracion interna y rutas del portal para que cada flujo use su propio acceso de autenticacion.
- **FR-008**: El sistema MUST presentar un resultado consistente y comprensible cuando un usuario intente acceder a una ruta protegida sin los permisos requeridos.

### Key Entities

- **Administrador interno**: Usuario con permisos para acceder al panel administrativo de gestion.
- **Usuario del portal de repuestos**: Usuario que accede al portal publico o comercial y utiliza el login del portal.
- **Acceso administrativo interno**: Ruta reservada para administracion y configuracion interna del sistema.
- **Acceso del portal de repuestos**: Ruta de autenticacion destinada a usuarios del portal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de los intentos de acceso directo al panel administrativo interno muestran el login administrativo interno cuando no hay sesion administrativa valida.
- **SC-002**: 0 redirecciones desde el acceso administrativo interno hacia el login del portal de repuestos durante pruebas de navegacion no autenticada.
- **SC-003**: Usuarios con credenciales administrativas validas pueden completar el acceso al panel administrativo interno en menos de 1 minuto.
- **SC-004**: El login del portal de repuestos sigue disponible y funcional en 100% de las pruebas del flujo publico existente.
- **SC-005**: Los casos principales de rutas protegidas administrativas y del portal producen el login correcto en 100% de las pruebas de aceptacion.

## Assumptions

- El panel administrativo interno y el portal de repuestos son dos experiencias de usuario distintas con audiencias y permisos diferentes.
- El objetivo es corregir el conflicto de acceso y redireccion, no redisenar los formularios de login ni cambiar las reglas de permisos existentes.
- Los usuarios administrativos ya cuentan con credenciales y permisos asignados por el sistema actual.
- Las rutas publicas y protegidas existentes del portal de repuestos deben mantener su comportamiento esperado salvo por la eliminacion del conflicto con administracion interna.
