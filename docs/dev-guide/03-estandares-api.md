# 03 - Estándares de API

## Endpoints
- Prefijo: `/api`.
- Usar verbos HTTP correctamente:
  - `GET`: Recuperar datos.
  - `POST`: Crear entidades.
  - `PUT`: Actualizar entidades.
  - `DELETE`: Eliminar entidades.

## Respuestas JSON
Formato estándar de éxito:
```json
{
  "status": "success",
  "message": "...",
  "data": {}
}
```
Formato de error:
```json
{
  "status": "error",
  "message": "...",
  "errors": {}
}
```
