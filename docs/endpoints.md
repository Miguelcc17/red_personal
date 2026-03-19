# Endpoints de la API

## Salud
- `GET /api/health`: Verifica el estado del backend.

## Personas
- `GET /api/persons`: Lista todas las personas.
- `POST /api/persons`: Crea una nueva persona.
- `GET /api/persons/<id>`: Detalle de una persona.
- `PUT /api/persons/<id>`: Actualiza una persona.
- `DELETE /api/persons/<id>`: Elimina una persona y sus relaciones.

## Relaciones
- `GET /api/relationships`: Lista todas las relaciones.
- `POST /api/relationships`: Crea una relación entre dos personas.
- `GET /api/relationships/<id>`: Detalle de una relación.
- `PUT /api/relationships/<id>`: Actualiza una relación.
- `DELETE /api/relationships/<id>`: Elimina una relación.

## Grafo
- `GET /api/graph`: Devuelve la red completa (nodos y enlaces).
- `GET /api/graph/person/<id>`: Devuelve la red inmediata de una persona.

## Formato de Respuesta
Todas las respuestas siguen el formato:
```json
{
  "status": "success",
  "message": "Mensaje informativo",
  "data": { ... }
}
```
o en caso de error:
```json
{
  "status": "error",
  "message": "Error descriptivo",
  "errors": { ... }
}
```
