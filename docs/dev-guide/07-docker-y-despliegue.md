# 07 - Docker y Despliegue

## Docker Compose
El proyecto se despliega orquestado con `docker-compose.yml`.

## Servicios
- **Neo4j**: Incluye un `healthcheck` para asegurar disponibilidad.
- **Backend**: Depende de `neo4j` y carga variables de entorno desde `.env`.
- **Frontend**: Sirve el entorno de desarrollo con proxy al backend.

## Comandos Útiles
```bash
docker compose up --build -d
docker compose logs -f backend
docker compose down
```
