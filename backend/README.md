# API Gestor de Gastos

API REST desarrollada con NestJS para gestionar gastos personales.

## Características

- ✅ Autenticación JWT
- ✅ CRUD completo para usuarios, categorías y gastos
- ✅ Filtros por fecha y categoría
- ✅ Estadísticas mensuales
- ✅ Documentación automática con Swagger
- ✅ Validación de datos
- ✅ Base de datos SQLite
- ✅ TypeORM para ORM

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en modo desarrollo
npm run start:dev
```

## Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión

### Usuarios
- `GET /users/profile` - Obtener perfil del usuario actual
- `PATCH /users/:id` - Actualizar usuario

### Categorías
- `GET /categories` - Listar categorías
- `POST /categories` - Crear categoría
- `PATCH /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría

### Gastos
- `GET /expenses` - Listar gastos (con filtros opcionales)
- `POST /expenses` - Crear gasto
- `GET /expenses/:id` - Obtener gasto por ID
- `PATCH /expenses/:id` - Actualizar gasto
- `DELETE /expenses/:id` - Eliminar gasto
- `GET /expenses/stats/monthly/:year/:month` - Estadísticas mensuales

## Filtros de Gastos

```bash
# Por rango de fechas
GET /expenses?startDate=2024-01-01&endDate=2024-01-31

# Por categoría
GET /expenses?categoryId=1
```

## Documentación

La documentación completa de la API está disponible en:
http://localhost:3001/api

## Tecnologías

- NestJS
- TypeORM
- SQLite
- JWT
- Swagger
- Class Validator
- Bcrypt

## Estructura del Proyecto

```
src/
├── auth/           # Módulo de autenticación
├── users/          # Módulo de usuarios
├── categories/     # Módulo de categorías
├── expenses/       # Módulo de gastos
├── seeds/          # Datos iniciales
└── main.ts         # Punto de entrada
