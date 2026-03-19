# Arquitectura del Proyecto "People Network"

## Descripción General
El proyecto sigue una arquitectura de tres capas (Frontend, Backend, Base de Datos) orquestada mediante Docker.

## Tecnologías
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React.
- **Backend**: Flask (Python 3.11), Neo4j Driver, Marshmallow.
- **Base de Datos**: Neo4j (Base de datos de grafos).
- **Contenedores**: Docker & Docker Compose.

## Estructura de Capas
1. **Capa de Presentación (Frontend)**:
   - Componentes React organizados por funcionalidad.
   - Hooks personalizados para la gestión de datos.
   - Visualización de grafos con `react-force-graph` (2D y 3D).

2. **Capa de Aplicación (Backend)**:
   - **Routes**: Endpoints RESTful usando Blueprints.
   - **Services**: Lógica de negocio y orquestación.
   - **Repositories**: Acceso directo a Neo4j mediante consultas Cypher.
   - **Schemas**: Validación y serialización con Marshmallow.

3. **Capa de Datos (Neo4j)**:
   - Modelo de grafos con nodos `Person` y relaciones `RELATED_TO`.

## Flujo de Datos
- El usuario interactúa con el frontend.
- El frontend realiza peticiones HTTP al backend Flask.
- El backend procesa la petición, valida datos y consulta a Neo4j.
- Neo4j devuelve resultados que el backend transforma en JSON.
- El frontend recibe el JSON y actualiza la UI o el grafo.
