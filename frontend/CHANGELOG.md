# V0 - Primera versión de Front-End

## Vistas

Para esta primera versión se implementaron las siguientes vistas:

* Inicio de sesión.
* Registro.
* Recuperación de contraseña.
* Visualización, creación, edición y eliminación de reportes.
* Visualización de detalle de reportes.
* Vista y edición de perfil.
* Creacion y edición de respuestas.

## Testing

Para esta versión no se implementaron pruebas de ningún tipo.

## Diseño responsive

Se implementó parcialmente el diseño responsive dado que no fue la prioridad de la versión.

## Estructura de los componentes

![PatitasBog - Mockups](https://github.com/user-attachments/assets/3fd3ab6e-6d87-4693-827c-652b8e482e0b)

Se agrupó toda la estructura en un componente `Layout`; Las vistas se implementaban como hijo de este componente para ser visualizada dentro del `MainContainer`. Finalmente, es importante considerar que el  `LeftContainer` solo se visualiza cuando el usuario está logueado de forma segura.
