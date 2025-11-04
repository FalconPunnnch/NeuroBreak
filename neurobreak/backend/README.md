# NeuroBreak - Backend

##  Descripción
API REST del proyecto NeuroBreak desarrollada con Node.js, Express y PostgreSQL.

##  Requisitos previos
- Node.js >= 16.x
- PostgreSQL >= 14.x
- npm >= 8.x

##  Instalación

1. Instalar dependencias:
\\\ash
npm install
\\\

2. Configurar variables de entorno:
\\\ash
cp .env.example .env
# Editar .env con tus configuraciones
\\\

3. Crear base de datos:
\\\sql
CREATE DATABASE neurobreak_db;
\\\

4. Ejecutar migraciones:
\\\ash
npm run migrate
\\\

5. Poblar base de datos (opcional):
\\\ash
npm run seed
\\\

##  Ejecutar en desarrollo
\\\ash
npm run dev
\\\

##  Ejecutar tests
\\\ash
npm test
\\\

##  Estructura del proyecto
- **/src/config** - Configuraciones
- **/src/domain** - Lógica de negocio y modelos
- **/src/application** - Controladores, middlewares y rutas
- **/src/infrastructure** - Servicios externos (BD, Email, Auth)
- **/src/utils** - Utilidades generales
- **/tests** - Pruebas unitarias e integración

##  Patrones implementados
- Repository Pattern
- Service Layer
- Singleton (conexión BD, logger)
- Strategy (autenticación)
- Factory (proveedores OAuth)

##  Tecnologías
- Node.js + Express
- PostgreSQL
- JWT para autenticación
- Passport para OAuth
- Jest para testing
