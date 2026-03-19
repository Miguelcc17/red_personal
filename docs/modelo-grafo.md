# Modelo de Grafo - People Network

## Nodos: Person
Cada persona es un nodo con etiqueta `:Person`.
Propiedades:
- `id` (string): Identificador único (UUID).
- `nombre`, `apellido` (string): Nombres.
- `edad` (integer): Edad de la persona.
- `genero` (string): Género.
- `ciudad`, `pais` (string): Ubicación.
- `profesion` (string): Cargo o profesión.
- `email`, `telefono` (string): Contacto.
- `descripcion` (string): Resumen biográfico.
- `intereses` (list<string>): Lista de intereses.
- `created_at`, `updated_at` (datetime): Fechas de sistema.

## Relaciones: RELATED_TO
Las conexiones entre personas se representan mediante la relación `[:RELATED_TO]`.
Propiedades:
- `id` (string): Identificador único.
- `tipo_relacion` (string): amigo, familiar, compañero_trabajo, pareja, conocido, socio.
- `descripcion` (string): Explicación del vínculo.
- `nivel_confianza` (integer): Escala de 1 a 5.
- `fecha_inicio` (string): Fecha en que se conocieron.
- `created_at`, `updated_at` (datetime): Fechas de sistema.

## Ejemplos de Consultas Cypher
- Listar todas las personas:
  `MATCH (p:Person) RETURN p`
- Crear una persona:
  `CREATE (p:Person {id: '1', nombre: 'Juan', ...}) RETURN p`
- Crear relación entre Juan y Maria:
  `MATCH (p1:Person {id: '1'}), (p2:Person {id: '2'}) CREATE (p1)-[r:RELATED_TO {tipo_relacion: 'amigo'}]->(p2) RETURN r`
- Obtener el grafo completo para visualización:
  `MATCH (p1:Person)-[r:RELATED_TO]->(p2:Person) RETURN p1, r, p2`
