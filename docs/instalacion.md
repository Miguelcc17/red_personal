# Instalación del Proyecto - People Network

## Requisitos Previos
- Docker
- Docker Compose

## Pasos para la Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/usuario/people-network.git
cd people-network
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en el directorio raíz basándote en `.env.example`:
```bash
cp .env.example .env
```
También puedes crear `.env` en `backend/` si deseas ejecutarlo de forma aislada.

### 3. Levantar los servicios con Docker Compose
```bash
docker compose up --build
```
Este comando levantará tres servicios:
- **neo4j**: Base de datos de grafos (puerto 7474 para browser, 7687 para bolt).
- **backend**: API Flask (puerto 5000).
- **frontend**: React con Vite (puerto 5173).

### 4. Cargar datos de ejemplo (Seed)
Una vez que los servicios estén arriba:
```bash
docker exec -it people-network-backend python app/seed/seed_data.py
```
Esto poblará la base de datos con personas y relaciones iniciales.

## Acceso a los Servicios
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Neo4j Browser**: [http://localhost:7474](http://localhost:7474) (usuario: `neo4j`, contraseña: `password`)

## Desarrollo Local (Sin Docker)
Si deseas ejecutarlo fuera de Docker:
1. Asegúrate de tener Neo4j instalado y corriendo.
2. En `backend/`: `pip install -r requirements.txt` y `python run.py`.
3. En `frontend/`: `npm install` y `npm run dev`.
