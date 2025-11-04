#  NeuroBreak

**Plataforma de microactividades de bienestar para estudiantes universitarios**

---

##  Descripción

NeuroBreak es una aplicación web que permite a estudiantes realizar microactividades de bienestar organizadas en tres categorías:
-  **Mente**: Actividades de concentración y claridad mental
-  **Creatividad**: Estimulación del pensamiento creativo
-  **Cuerpo**: Ejercicios físicos rápidos

### Características principales
 Autenticación multi-proveedor (Email, Google, Microsoft, Apple)  
 Catálogo de microactividades con filtros  
 Timer para ejecución de actividades  
 Registro de estado de ánimo post-actividad  
 Dashboard de métricas personales  
 Panel administrativo para gestión de contenido  

---

##  Arquitectura

### Stack Tecnológico
- **Frontend**: React 18 + Bootstrap 5
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL 14+

### Patrones de Diseño Implementados
- Repository Pattern
- Service Layer
- Singleton (apiClient, database)
- Factory (AuthProvider)
- Strategy (AuthService)
- Facade (Controllers)
- Observer (AuthContext)

### Principios Aplicados
- SOLID
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- Ley de Demeter

---

##  Instalación y Configuración

### Prerrequisitos
- Node.js >= 16.x
- PostgreSQL >= 14.x
- npm >= 8.x

### 1. Clonar el repositorio
\\\ash
git clone <repository-url>
cd neurobreak
\\\

### 2. Configurar Frontend
\\\ash
cd frontend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm start
\\\

### 3. Configurar Backend
\\\ash
cd backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
\\\

### 4. Configurar Base de Datos
\\\ash
# Crear base de datos
psql -U postgres
CREATE DATABASE neurobreak_db;
\q

# Ejecutar migraciones
cd backend
npm run migrate

# (Opcional) Poblar con datos de prueba
npm run seed
\\\

### 5. Ejecutar el proyecto
\\\ash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
\\\

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

---

##  Estructura del Proyecto

\\\
neurobreak/
 frontend/          # Aplicación React
    src/
       core/              # Modelos y lógica de dominio
       infrastructure/    # Servicios externos
       presentation/      # Componentes y páginas
       state/            # Gestión de estado
       utils/            # Utilidades
    package.json

 backend/           # API REST Node.js
    src/
       domain/           # Lógica de negocio
       application/      # Controladores y rutas
       infrastructure/   # BD, email, storage
       utils/           # Utilidades
    package.json

 database/          # Scripts SQL
    schema/
    migrations/

 docs/             # Documentación
     architecture/
     design/
     api/
\\\

---

##  Documentación

### Historias de Usuario
22 historias de usuario implementadas. Ver: [docs/user_stories/user_stories.md](docs/user_stories/user_stories.md)

### Arquitectura
Documento completo de arquitectura. Ver: [docs/architecture/architecture_document.md](docs/architecture/architecture_document.md)

### API
Documentación de endpoints REST. Ver: [docs/api/](docs/api/)

---

##  Testing

### Frontend
\\\ash
cd frontend
npm test
\\\

### Backend
\\\ash
cd backend
npm test
\\\

---
