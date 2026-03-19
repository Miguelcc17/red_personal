# Flujo Funcional - People Network

## Casos de Uso Principales

### 1. Gestión de Personas
- **Creación**: El usuario rellena un formulario en la vista `/persons`. Los datos son validados en el frontend y enviados al backend. El backend genera un UUID y guarda el nodo en Neo4j.
- **Listado**: Se consultan todos los nodos con la etiqueta `:Person` y se muestran en tarjetas.
- **Eliminación**: Al eliminar una persona, se utiliza la sentencia `DETACH DELETE` en Cypher para asegurar que todas sus relaciones se eliminen junto con el nodo.

### 2. Gestión de Relaciones
- **Creación**: El usuario selecciona dos personas y define su vínculo. El backend realiza un `MATCH` para localizar a ambas personas y crea un arco `RELATED_TO` entre ellas.
- **Listado**: Se consultan los arcos existentes y se muestran los nombres de las personas involucradas consultando los extremos de la relación.

### 3. Visualización de Red (2D/3D)
- **Carga de Datos**: El frontend solicita `/api/graph`. El backend responde con una estructura `nodes: [], links: []`.
- **Renderizado 2D**: Utiliza `react-force-graph-2d`. Los nodos se agrupan por profesión (color) y los enlaces por tipo de relación (color).
- **Interacción**: Al hacer clic en un nodo, se abre un panel lateral con todos los detalles de la persona consultados directamente del estado del grafo en el cliente.
- **Renderizado 3D**: Utiliza Three.js a través de `react-force-graph-3d`. Permite rotación, zoom y una vista inmersiva tipo red neuronal.

### 4. Búsqueda y Filtros
- En la lista de personas, un campo de búsqueda en tiempo real filtra los resultados por nombre o profesión basándose en el estado cargado.
- En la vista de relaciones, se pueden ver los detalles específicos de cada conexión.
