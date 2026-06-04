# UI Contract: Rutas administrativas y login

## Scope

Define el comportamiento esperado para las rutas visibles involucradas en la separacion entre panel administrativo interno y portal de repuestos.

## Routes

### `/admin/`

**Audience**: Administradores internos.

**When unauthenticated**: Muestra el login administrativo interno.

**When authenticated as internal administrator**: Muestra el panel administrativo interno.

**Must not**: Redirigir al login del portal de repuestos.

### `/login`

**Audience**: Usuarios del portal de repuestos.

**When unauthenticated**: Muestra el login del portal de repuestos.

**When reached from a protected portal route**: Permite que el usuario se autentique para regresar a la experiencia del portal segun el comportamiento existente.

**Must not**: Sustituir ni interceptar el login administrativo interno.

### Ruta administrativa del portal

**Audience**: Usuarios autenticados del portal con rol administrativo del portal.

**Path requirement**: Debe usar una ruta distinta de `/admin` y `/admin/`.

**When unauthenticated**: Redirige al login del portal de repuestos.

**When authenticated without required portal role**: Muestra o redirige a un destino seguro existente sin conceder acceso.

## Acceptance Checks

- Visitar `/admin/` sin sesion muestra el login administrativo interno.
- Visitar `/admin/` con sesion administrativa valida muestra el panel administrativo interno.
- Visitar `/login` sin sesion muestra el login del portal de repuestos.
- Visitar una ruta protegida del portal sin sesion redirige a `/login`.
- La ruta administrativa del portal no produce conflicto con `/admin/`.
