# Research: Resolver conflicto de acceso admin

## Decision: Reservar `/admin/` para el panel administrativo del backend

**Rationale**: El backend ya registra el panel administrativo en `/admin/`, que es una ruta convencional y esperada para administradores internos. El problema reportado ocurre porque el frontend tambien declara una ruta protegida en `/admin`, provocando que el navegador resuelva esa ruta hacia el portal y redirija a `/login`.

**Alternatives considered**: Cambiar el panel administrativo del backend a otra ruta fue descartado porque rompe expectativas existentes, enlaces guardados y convenciones operativas. Mantener ambas rutas con el mismo nombre fue descartado porque conserva la ambiguedad.

## Decision: Mover la ruta administrativa del portal a una ruta no conflictiva

**Rationale**: La ruta del portal en `/admin` actualmente es una pantalla interna minima dentro de la experiencia autenticada del frontend. Renombrarla evita que el portal capture el acceso reservado para el panel administrativo del backend y mantiene el login del portal en `/login`.

**Alternatives considered**: Agregar logica especial para detectar si `/admin` debe ir al backend o frontend fue descartado porque aumenta complejidad y mantiene una ruta ambigua. Eliminar la pantalla del portal sin reemplazo fue descartado porque podria ocultar una entrada futura para funciones administrativas del portal.

## Decision: Mantener separadas las redirecciones de autenticacion

**Rationale**: Los usuarios del portal deben seguir siendo enviados a `/login`, mientras el panel administrativo del backend debe mostrar su propio login cuando no haya sesion administrativa valida. Esta separacion cumple los requisitos sin modificar el modelo de permisos.

**Alternatives considered**: Unificar ambos logins fue descartado porque cambia la experiencia de usuarios y permisos fuera del alcance de la correccion. Cambiar permisos o credenciales fue descartado porque el problema es de routing, no de autorizacion.

## Decision: Verificar con build frontend y navegacion manual

**Rationale**: El cambio esperado es de routing visible para usuarios. `npm run build` detecta errores de tipos o rutas, y la navegacion manual valida que `/admin/`, `/login` y la nueva ruta administrativa del portal resuelvan a pantallas correctas.

**Alternatives considered**: Crear pruebas automatizadas de navegador fue considerado, pero el proyecto no muestra una suite E2E existente y el alcance del cambio es pequeno. Puede agregarse posteriormente si se introduce infraestructura de pruebas de navegacion.
