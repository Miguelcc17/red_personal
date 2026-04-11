# 08 - Seguridad

## Variables de Entorno
- Nunca commitear archivos `.env`.
- Usar `.env.example` como plantilla.
- Definir `SECRET_KEY` única para el backend.

## Base de Datos
- Las credenciales se inyectan vía Docker.
- Usar autenticación activa en Neo4j.

## CORS
- Configurado en `backend/app/__init__.py` para permitir peticiones desde el origen del frontend en desarrollo.
