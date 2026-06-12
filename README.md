# EliteBuild ERP — Stack Tecnológico Élite

> **ERP + BIM 3D + IA Predictiva + GIS Satelital** para la gestión integral de proyectos de ingeniería civil de alta complejidad.

---

## 🚀 Stack Tecnológico

### Frontend
- **React 19** + **Vite** — Aplicación SPA ultra-rápida
- **TailwindCSS v3** — Sistema de diseño Dark Mode premium
- **Framer Motion** — Animaciones y transiciones cinematográficas
- **React Three Fiber + Drei** — Visualizador BIM 3D con materiales físicos (WebGL)
- **Three.js** — Motor de renderizado 3D
- **Recharts** — Gráficos financieros y S-Curves
- **Leaflet** — Módulo GIS satelital con telemetría en tiempo real
- **Zustand** — Gestión de estado global
- **Lucide React** — Iconografía consistente

### Backend (Microservicios)
- **Node.js + Express.js** — API REST para Auth y Proyectos
- **Auth Service** (Puerto 3001) — JWT + MFA + Zero-Trust
- **Project Service** (Puerto 3002) — CRUD de obras, APUs y Gantt

### Seguridad
- **AES-256-GCM** — Cifrado de datos financieros at-rest
- **JWT + Zero-Trust Architecture** — Validación de identidad por niveles (AAL1 / AAL2)
- **Blockchain Ledger** — Libro mayor inmutable en PostgreSQL (Append-Only con triggers)

### Infraestructura (Producción)
- **Docker + Docker Compose** — Contenedores aislados por microservicio
- **NGINX** — API Gateway y reverse proxy
- **PostgreSQL + MongoDB + Redis** — Bases de datos según tipo de dato

---

## 📁 Estructura del Proyecto

```
elite-build/
├── frontend/                    # App React + Vite
│   ├── src/
│   │   ├── pages/               # 13 módulos funcionales
│   │   │   ├── Login.jsx        # Auth con MFA y sesión persistente
│   │   │   ├── Dashboard.jsx    # KPIs, Recharts, tiempo real
│   │   │   ├── BIMViewer.jsx    # Visor 3D (React Three Fiber)
│   │   │   ├── GISMap.jsx       # GIS satelital con telemetría
│   │   │   ├── Budgets.jsx      # APUs y presupuestos
│   │   │   ├── Planning.jsx     # Gantt interactivo
│   │   │   └── ...              # + 7 módulos más
│   │   ├── store/
│   │   │   └── useEliteStore.js # Zustand — estado global
│   │   └── components/layouts/  # Sidebar, Topbar
│   └── tailwind.config.js
├── backend/
│   ├── services/
│   │   ├── auth-service/        # Microservicio JWT + Zero-Trust
│   │   └── project-service/     # Microservicio de datos
│   └── shared/
│       ├── crypto.js            # AES-256-GCM
│       ├── schemas.sql          # PostgreSQL schemas
│       └── blockchain_schemas.sql
├── docker/nginx/nginx.conf      # API Gateway
├── docker-compose.yml           # Arquitectura completa
└── package.json
```

---

## ⚡ Inicio Rápido (Desarrollo Local)

### Prerequisitos
- Node.js >= 18
- npm >= 9

### 1. Instalar dependencias del Frontend
```bash
cd frontend
npm install
```

### 2. Instalar dependencias del Backend
```bash
cd backend/services/auth-service && npm install
cd backend/services/project-service && npm install
```

### 3. Iniciar los servicios
```bash
# Terminal 1: Auth Service
cd backend/services/auth-service
npm start

# Terminal 2: Project Service
cd backend/services/project-service
npm start

# Terminal 3: Frontend
cd frontend
npm run dev
```

> El frontend estará disponible en: **http://localhost:5173**

---

## 🔐 Credenciales de Demo

| Rol | Email | Contraseña | MFA |
|---|---|---|---|
| Super Admin | admin@elitebuild.com | `Admin123!` | `123456` |
| Ingeniero Civil | ingeniero@elitebuild.com | `Ingeniero123!` | — |
| Supervisor | supervisor@elitebuild.com | `Super123!` | — |

> **Nota:** El sistema funciona en **modo local offline** aunque los microservicios backend no estén activos.

---

## 🏗️ Módulos Implementados

| Módulo | Descripción |
|---|---|
| 🔐 **Login / MFA** | Autenticación dual (backend + local), sesión persistente JWT |
| 📊 **Dashboard** | KPIs en tiempo real, S-Curves financieras, actividad live |
| 🗂️ **Proyectos** | Kanban, listado de obras, creación de proyectos |
| 🧱 **BIM 3D** | Visor React Three Fiber con materiales físicos y raycasting |
| 💰 **Presupuestos APU** | Análisis de precios unitarios con totalizadores |
| 📅 **Planificación Gantt** | Cronograma interactivo con ruta crítica |
| 👷 **Personal** | Control de asistencia GPS |
| ✅ **Supervisión** | Listas de chequeo de inspección |
| 📄 **Documental** | Gestión de planos y documentos técnicos |
| 🤖 **IA Predictiva** | Curvas de madurez de concreto y análisis de riesgo |
| 📈 **Reportes** | Informes ejecutivos financieros |
| 🗺️ **GIS & Topografía** | Mapa satelital, drones IoT, sensores, geofencing |
| ⚙️ **Configuración** | Parámetros del sistema |

---

## 📄 Licencia

Propietario — © 2026 EliteBuild ERP. Todos los derechos reservados.
