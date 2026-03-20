# Modelo de Grafo - People Network (Avanzado)

## Nodos Principales
- **Person**: Identidad base del individuo.
- **Country**: Países para análisis demográfico.
- **City**: Ciudades vinculadas a residencia o nacimiento.
- **Gender**: Identidad de género.
- **Profession**: Títulos profesionales reutilizables.
- **Language**: Idiomas hablados.
- **Hobby**: Intereses y actividades.
- **Company**: Empresas del historial laboral.
- **Institution**: Instituciones educativas.
- **Goal**: Metas y objetivos temporales.
- **Tattoo**: Registro simbólico de tatuajes.

## Relaciones Temporales y de Análisis
- **BORN_IN**: Origen geográfico.
- **LIVES_IN**: Residencia actual/pasada (`desde`, `hasta`).
- **WORKS_AS**: Vinculación profesional.
- **SPEAKS**: Dominio lingüístico (`nivel`).
- **ENJOYS**: Afinidad con hobbies (`active`, `categoria`).
- **WORKED_AT**: Trayectoria profesional (`desde`, `hasta`, `cargo`, `modalidad`).
- **STUDIED_AT**: Trayectoria académica (`desde`, `hasta`, `titulo`).
- **HAS_GOAL**: Seguimiento de objetivos (`estado`).
- **HAS_TATTOO**: Registro físico.
- **HAS_GENDER**: Clasificación de identidad.
- **RELATED_TO**: Conexiones personales con contexto (`tipo`, `confianza`, `desde`).

## Propiedades Directas (Nodo Person)
- `nombre`, `apellido`, `nombre_completo`
- `fecha_nacimiento`
- `signo_zodiacal`, `eneagrama`
- `email`, `telefono`
- `vision_largo_plazo`, `mentalidad_competitiva`
- `valores_fundamentales`, `motivadores` (Análisis conductual)

## Ventajas de este Modelo
1. **Normalización**: Permite descubrir que 10 personas viven en la misma ciudad o tienen la misma profesión sin redundancia de texto.
2. **Historia**: Las propiedades `desde` y `hasta` en las relaciones permiten reconstruir la línea de tiempo de cualquier nodo.
3. **Análisis**: Facilita consultas como "Personas que hablen Inglés B2, vivan en Santiago y tengan visión emprendedora".
