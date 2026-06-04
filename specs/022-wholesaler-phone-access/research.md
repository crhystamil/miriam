# Research: Acceso por celular para mayoristas

## Decision: Usar una barrera de acceso con numero de celular, no autenticacion fuerte

**Rationale**: La especificacion pide seguridad simple y facil acceso, sin credenciales. Pedir el celular reduce accesos casuales y permite identificar de forma ligera al visitante sin crear cuentas ni contrasenas.

**Alternatives considered**: Usuario y contrasena fue descartado porque contradice el requisito de no usar credenciales. Verificacion por codigo SMS fue descartada para esta fase porque agrega costo, dependencia externa y friccion. Enlace secreto compartido fue descartado porque es facil de reenviar y no captura un dato de contacto.

## Decision: Validar formato localmente y permitir acceso inmediato

**Rationale**: El objetivo es que el mayorista acceda rapido. La validacion de formato evita datos vacios o claramente invalidos y permite completar el acceso en menos de 30 segundos sin depender de servicios externos.

**Alternatives considered**: Validar contra una lista de mayoristas aprobados fue descartado para esta fase porque requiere una fuente de datos administrable y cambia el alcance hacia control de permisos. Validacion manual por personal del negocio fue descartada porque no es inmediata.

## Decision: Mantener sesion temporal en el navegador

**Rationale**: La especificacion requiere que el acceso siga habilitado durante una sesion vigente y vuelva a pedir el numero cuando expire. Una sesion temporal del navegador equilibra comodidad y proteccion ligera sin persistir credenciales.

**Alternatives considered**: Recordar el acceso indefinidamente fue descartado por debilitar la barrera. Pedir el numero en cada navegacion fue descartado por friccion innecesaria. Persistir el numero en una base de datos fue descartado por no ser necesario para el valor inicial y por ampliar responsabilidades de privacidad.

## Decision: Proteger todas las rutas de mayoristas con una compuerta comun

**Rationale**: La tabla y cualquier enlace interno mayorista deben requerir haber completado el acceso por celular. Una compuerta comun evita duplicacion y reduce el riesgo de dejar rutas internas expuestas.

**Alternatives considered**: Proteger solo la pagina inicial fue descartado porque los accesos directos a rutas internas podrian exponer informacion mayorista. Ocultar solo elementos visuales fue descartado porque no cumple el requisito de mantener oculta la informacion.

## Decision: Mostrar explicacion breve de privacidad y ausencia de contrasena

**Rationale**: El usuario entrega un dato personal. Explicar que el numero habilita el acceso y que no necesita contrasena mejora confianza y reduce abandono.

**Alternatives considered**: No mostrar explicacion fue descartado por generar desconfianza. Mostrar politicas largas en el flujo principal fue descartado por friccion; puede enlazarse informacion adicional si existe.
