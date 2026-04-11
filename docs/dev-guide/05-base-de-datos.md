# 05 - Base de Datos

## Neo4j
- **Driver**: `neo4j-python-driver`.
- **Identificadores**: Usar `elementId()` de Neo4j 5.x para persistencia visual.
- **Normalización**:
  - `(p:Person)`
  - `(c:City)`
  - `(pr:Profession)`
- **Relaciones**:
  - `[:LIVES_IN]`
  - `[:WORKS_AS]`
  - `[:RELATED_TO]` (Amistades, familia, etc.)

## Consultas Cypher
Usar siempre consultas parametrizadas para evitar inyecciones.
`MATCH (p:Person {id: $pid}) RETURN p`
