# Data Model: Resolver conflicto de acceso admin

## Entities

### Administrador interno

Representa a una persona con permisos para usar el panel administrativo del backend.

**Fields**:

- `identity`: Credenciales existentes de usuario administrativo.
- `permissions`: Permisos administrativos existentes.
- `session`: Estado de autenticacion administrativa vigente o ausente.

**Validation Rules**:

- Debe tener permisos administrativos validos para ingresar al panel administrativo interno.
- Una sesion del portal sin permisos administrativos no otorga acceso al panel administrativo interno.

### Usuario del portal de repuestos

Representa a una persona que ingresa a la experiencia del portal mediante el login del portal.

**Fields**:

- `identity`: Credenciales existentes del portal.
- `role`: Rol existente utilizado por la aplicacion del portal.
- `session`: Estado de autenticacion del portal vigente o ausente.

**Validation Rules**:

- Si no tiene sesion valida para una ruta protegida del portal, debe ir al login del portal.
- Si no tiene permisos administrativos internos, no debe entrar al panel administrativo interno.

### Acceso administrativo interno

Representa la ruta reservada para el panel administrativo del backend.

**Fields**:

- `path`: `/admin/`.
- `audience`: Administradores internos.
- `unauthenticated_result`: Login administrativo interno.
- `authenticated_result`: Panel administrativo interno.

**Validation Rules**:

- No debe redirigir al login del portal.
- Debe permanecer reservado para administracion interna.

### Acceso del portal de repuestos

Representa las rutas de autenticacion y administracion propia del portal.

**Fields**:

- `login_path`: `/login`.
- `portal_admin_path`: Ruta administrativa del portal no conflictiva con `/admin/`.
- `audience`: Usuarios autenticados del portal con el rol correspondiente.

**Validation Rules**:

- El login del portal debe seguir disponible en `/login`.
- La ruta administrativa del portal no debe usar `/admin` ni capturar `/admin/`.

## State Transitions

- `Sin sesion administrativa` + visita `/admin/` -> `Login administrativo interno visible`.
- `Sesion administrativa valida` + visita `/admin/` -> `Panel administrativo interno visible`.
- `Sin sesion del portal` + visita ruta protegida del portal -> `Login del portal visible`.
- `Sesion del portal sin permisos administrativos internos` + visita `/admin/` -> `Acceso administrativo interno no concedido`.
