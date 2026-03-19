# People Network 🚀

Proyecto full stack para la gestión y visualización de una red de personas basada en grafos.
El sistema permite registrar personas, establecer relaciones entre ellas y visualizar la red social o profesional en entornos 2D y 3D (red neuronal).

## ✨ Características
- **CRUD Completo**: Gestión de personas y relaciones.
- **Visualización 2D**: Grafo dinámico con colores por profesión y tipo de relación.
- **Visualización 3D**: Experiencia inmersiva usando Three.js para navegar por la red.
- **Arquitectura Limpia**: Separación en Repositorios, Servicios y Rutas.
- **Validación de Datos**: Esquemas Marshmallow y tipado en frontend.
- **Orquestación**: Listo para desplegar con Docker Compose.

## 🛠️ Tecnologías
- **Backend**: Flask (Python)
- **Base de Datos**: Neo4j (Graph Database)
- **Frontend**: React + Vite
- **Estilos**: Tailwind CSS
- **Visualización**: react-force-graph (2D/3D)
- **Despliegue**: Docker & Docker Compose

## 🚀 Instalación Rápida
1. Clona el repo.
2. Crea un archivo `.env` basándote en `.env.example`.
3. Levanta los servicios:
   ```bash
   docker compose up --build
   ```
4. Poblado inicial:
   ```bash
   docker exec -it people-network-backend python app/seed/seed_data.py
   ```

## 📂 Documentación
Consulta la carpeta `/docs` para más detalles:
- [Arquitectura](./docs/arquitectura.md)
- [Endpoints](./docs/endpoints.md)
- [Modelo de Grafo](./docs/modelo-grafo.md)
- [Flujo Funcional](./docs/flujo-funcional.md)
- [Guía de Instalación](./docs/instalacion.md)

## 📸 Capturas
(Añadir capturas de pantalla aquí una vez desplegado)

---
Desarrollado con ❤️ para la gestión de redes de grafos.
