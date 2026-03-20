# Modelo de Grafo - People Network

## Nodos: Person
Cada persona es un nodo con etiqueta `:Person`.
Propiedades:
- `id` (string): Identificador único (UUID).
- `nombre`, `apellido` (string): Nombres.
- `edad` (integer): Edad de la persona.
- `genero` (string): Género (opcional).
- `ciudad`, `pais` (string): Ubicación.
- `profesion` (string): Cargo o profesión.
- `email`, `telefono` (string): Contacto.
- `descripcion` (string): Resumen biográfico.
- `intereses` (list<string>): Lista de intereses.

### Campos de Análisis Detallado
- `hobbies` (JSON string/list): Lista de objetos con `name` y `active` (booleano).
- `colores_favoritos` (list<string>): Lista de colores.
- `signo_zodiacal` (string): Signo del zodiaco.
- `tiene_tatuajes` (boolean): Si posee tatuajes.
- `tatuajes_descripcion` (string): Detalle de los tatuajes.
- `historial_trabajos` (JSON string/list): Lista de objetos con `company`, `role` y `period`.

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
