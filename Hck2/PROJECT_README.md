# TechFlow Task Management - Frontend Application

Aplicación web de gestión de tareas y proyectos construida con React, TypeScript y Tailwind CSS para el Hackathon #2.

## 🚀 Tecnologías Utilizadas

- **React 19** con TypeScript
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP
- **Vite** como bundler y dev server

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

## 🔧 Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd Hck2
```

2. Instala las dependencias:

```bash
npm install
```

3. El archivo `.env` ya está configurado con la URL de la API:

```env
VITE_API_BASE_URL=https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1
```

## 🏃‍♂️ Ejecutar Localmente

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Build para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 📱 Funcionalidades Implementadas

### ✅ Autenticación

- Login de usuarios
- Registro de nuevos usuarios
- Gestión de JWT tokens
- Rutas protegidas
- Logout

### ✅ Dashboard

- Vista general con estadísticas (total de tareas, completadas, pendientes, vencidas)
- Acciones rápidas para crear tareas y ver proyectos
- Barra de progreso general

### ✅ Gestión de Proyectos

- Listar todos los proyectos con paginación
- Crear nuevo proyecto
- Editar proyecto existente
- Eliminar proyecto (con confirmación)
- Buscar proyectos por nombre
- Ver detalles de proyectos

### ✅ Gestión de Tareas

- Listar tareas con múltiples filtros:
  - Por estado (TODO, IN_PROGRESS, COMPLETED)
  - Por prioridad (LOW, MEDIUM, HIGH, URGENT)
  - Por proyecto
- Crear tarea con validación
- Editar tarea
- Eliminar tarea
- Cambiar estado de tarea
- Asignar tarea a miembros del equipo
- Ver fecha de vencimiento

### ✅ Colaboración en Equipo

- Ver miembros del equipo
- Ver tareas asignadas a cada miembro
- Filtrar tareas por usuario

## 🎨 Estructura del Proyecto

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── Loader.tsx
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── Tasks.tsx
│   └── Team.tsx
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── projectService.ts
│   ├── taskService.ts
│   └── teamService.ts
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 🔐 Credenciales de Prueba

Puedes registrar un nuevo usuario o usar la API para crear uno de prueba.

## 🌐 Deploy

La aplicación está desplegada en: [URL del deploy]

## 📝 Notas de Desarrollo

- La aplicación utiliza localStorage para persistir el token JWT
- Todos los endpoints requieren autenticación excepto login y register
- El token se incluye automáticamente en los headers de las peticiones mediante interceptores de Axios
- La UI es completamente responsive y optimizada para móviles

## 👥 Equipo

Desarrollado durante el Hackathon #2 de CS2031

## 📄 Licencia

Este proyecto fue creado con propósitos educativos para el curso CS2031.
