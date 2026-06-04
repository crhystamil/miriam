# Data Model: Acceso por celular para mayoristas

## Entities

### Mayorista

Persona que quiere consultar la vista de productos mayorista sin crear una cuenta.

**Fields**:

- `phone_number`: Numero de celular ingresado para habilitar el acceso.
- `access_status`: Estado de acceso, como no iniciado, habilitado o expirado.

**Validation Rules**:

- Debe ingresar un numero de celular con formato aceptable para habilitar la vista.
- No debe requerir usuario, contrasena ni registro de cuenta.

### Numero de celular

Dato minimo solicitado para habilitar la vista mayorista.

**Fields**:

- `raw_value`: Texto ingresado por el usuario.
- `normalized_value`: Numero limpiado para validacion y uso temporal.
- `validation_status`: Valido, vacio, incompleto o invalido.

**Validation Rules**:

- Debe contener solo digitos despues de normalizar espacios y separadores comunes.
- Debe cumplir una longitud razonable de numero celular local o internacional.
- Si esta vacio, incompleto o contiene caracteres no aceptables, debe bloquear el acceso y mostrar mensaje claro.

### Sesion de acceso mayorista

Estado temporal que habilita la vista mayorista despues de ingresar un numero valido.

**Fields**:

- `is_enabled`: Indica si la vista mayorista puede mostrarse.
- `phone_number`: Numero normalizado asociado a la sesion temporal.
- `started_at`: Momento en que se habilito el acceso.
- `expires_at`: Momento o condicion en que el acceso deja de estar vigente.

**Validation Rules**:

- Debe existir y estar vigente para mostrar la vista mayorista.
- Debe expirar al finalizar la sesion del navegador o al cumplirse la politica temporal definida.
- Si no existe o expiro, la vista debe solicitar nuevamente el numero.

### Vista de productos mayorista

Informacion comercial que queda protegida por la barrera de acceso.

**Fields**:

- `access_required`: Siempre verdadero para rutas mayoristas.
- `visible_content`: Tabla o detalle mayorista que solo se muestra con sesion vigente.

**Validation Rules**:

- No debe mostrarse sin sesion de acceso mayorista vigente.
- Los enlaces internos de mayorista deben pasar por la misma validacion de acceso.

## State Transitions

- `Sin acceso` + abre ruta mayorista -> `Solicitar celular`.
- `Solicitar celular` + numero valido -> `Acceso habilitado`.
- `Solicitar celular` + numero invalido -> `Mensaje de correccion`.
- `Acceso habilitado` + refresca pagina durante sesion vigente -> `Vista mayorista visible`.
- `Acceso habilitado` + sesion expirada -> `Solicitar celular`.
- `Sin acceso` + abre enlace interno mayorista -> `Solicitar celular`.
