# UI Contract: Acceso por celular para mayoristas

## Scope

Define el comportamiento visible del acceso a la vista mayorista mediante numero de celular.

## Entry: Ruta de mayoristas

**Audience**: Mayoristas o visitantes con interes comercial.

**When no mayorista access session exists**: Mostrar una pantalla o bloque de acceso que solicita numero de celular.

**When mayorista access session is valid**: Mostrar la vista de productos mayorista.

**Must not**: Mostrar la informacion mayorista antes de validar un numero de celular aceptable.

## Access Form

**Required field**: Numero de celular.

**Required copy**:

- Indicar que el numero se usa para habilitar el acceso a la vista mayorista.
- Indicar que no se requiere usuario ni contrasena.

**Validation behavior**:

- Numero vacio: mostrar mensaje solicitando ingresar un numero.
- Numero incompleto: mostrar mensaje indicando que el numero parece incompleto.
- Formato invalido: mostrar mensaje indicando que solo se aceptan numeros de celular validos.
- Numero valido: habilitar la vista mayorista inmediatamente.

## Protected Mayorista Content

**When access is enabled**: La tabla o contenido mayorista queda visible.

**When the browser page refreshes during a valid session**: El acceso permanece habilitado.

**When session is no longer valid**: El acceso vuelve a solicitar numero de celular.

**When a direct internal mayorista link is opened without access**: Mostrar el acceso por celular antes del contenido.

## Acceptance Checks

- Sin numero valido, la tabla mayorista no se muestra.
- Con numero valido, la tabla mayorista se muestra en menos de 30 segundos.
- Numeros vacios, incompletos o invalidos muestran mensajes claros.
- Refrescar la pagina durante la sesion vigente conserva el acceso.
- Abrir un enlace interno mayorista sin sesion solicita celular.
- La pantalla indica que no se necesita usuario ni contrasena.
