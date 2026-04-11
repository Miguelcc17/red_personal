# 01 - Arquitectura General

El proyecto "People Network" utiliza una arquitectura de microservicios simplificada basada en contenedores.

## Componentes
- **Backend (Flask)**: Procesa la lógica de negocio, validaciones y conexión con la base de datos de grafos.
- **Frontend (React)**: Interfaz de usuario dinámica con visualizaciones 2D/3D.
- **Base de Datos (Neo4j)**: Almacenamiento orientado a grafos para relaciones complejas.

## Patrones de Diseño
- **Service-Repository**: El backend separa la lógica de acceso a datos de la lógica de negocio.
- **Normalized Graph Model**: Las entidades compartidas (Ciudades, Profesiones) se modelan como nodos para optimizar la red.
