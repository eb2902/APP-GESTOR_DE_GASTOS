# 💰 Gestor de Gastos - Aplicación Full Stack

Una aplicación completa para gestionar gastos personales desarrollada con **NestJS** (backend) y **React + Material-UI** (frontend).

## 🚀 Características

### Backend (NestJS)
- ✅ API REST completa con autenticación JWT
- ✅ Base de datos SQLite con TypeORM
- ✅ CRUD para usuarios, categorías y gastos
- ✅ Filtros avanzados y estadísticas
- ✅ Documentación automática con Swagger
- ✅ Validación de datos y manejo de errores

### Frontend (React + MUI)
- ✅ Interfaz moderna con Material-UI
- ✅ Autenticación completa (login/registro)
- ✅ Dashboard con estadísticas visuales
- ✅ Gestión de gastos con filtros
- ✅ Gestión de categorías con colores
- ✅ Diseño responsive y navegación intuitiva

## 🛠 Tecnologías

### Backend
- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para base de datos
- **SQLite** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación API
- **Class Validator** - Validación de datos

### Frontend
- **React 18** - Librería de UI
- **Material-UI (MUI)** - Componentes de diseño
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **TypeScript** - Tipado estático
- **Vite** - Build tool

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd APP-GESTOR_DE_GASTOS
```

### 2. Configurar el Backend
```bash
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run start:dev     # Ejecutar en modo desarrollo
```

El backend estará disponible en: `http://localhost:3001`
Documentación Swagger: `http://localhost:3001/api`

### 3. Configurar el Frontend
```bash
cd frontend
npm install
npm run dev          # Ejecutar en modo desarrollo
```

El frontend estará disponible en: `http://localhost:5173`

## 🎯 Uso de la Aplicación

### 1. Registro e Inicio de Sesión
- Accede a `http://localhost:5173`
- Regístrate con tu email y datos personales
- O inicia sesión si ya tienes cuenta

### 2. Dashboard
- Visualiza estadísticas de tus gastos
- Ve el total general y del mes actual
- Revisa tus gastos más recientes

### 3. Gestión de Categorías
- Crea categorías para organizar tus gastos
- Asigna colores personalizados
- Edita o elimina categorías existentes

### 4. Gestión de Gastos
- Registra nuevos gastos con título, monto y fecha
- Asigna categorías a tus gastos
- Filtra gastos por fecha o categoría
- Edita o elimina gastos existentes

## 🔧 Scripts Disponibles

### Backend
```bash
npm run start:dev    # Desarrollo con hot reload
npm run start:prod   # Producción
npm run build        # Compilar
npm run test         # Ejecutar tests
```

### Frontend
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar para producción
npm run preview      # Vista previa de producción
npm run lint         # Linter
```

## 📡 API Endpoints

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión

### Usuarios
- `GET /users/profile` - Obtener perfil
- `PATCH /users/:id` - Actualizar usuario

### Categorías
- `GET /categories` - Listar categorías
- `POST /categories` - Crear categoría
- `PATCH /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría

### Gastos
- `GET /expenses` - Listar gastos (con filtros)
- `POST /expenses` - Crear gasto
- `GET /expenses/:id` - Obtener gasto
- `PATCH /expenses/:id` - Actualizar gasto
- `DELETE /expenses/:id` - Eliminar gasto
- `GET /expenses/stats/monthly/:year/:month` - Estadísticas mensuales

## 🔒 Autenticación

La aplicación usa JWT (JSON Web Tokens) para la autenticación:
- Los tokens se almacenan en localStorage
- Se incluyen automáticamente en las peticiones HTTP
- Expiración automática y redirección al login

## 📱 Características de la UI

### Diseño Responsive
- Adaptable a móviles, tablets y desktop
- Navegación lateral colapsible en móviles
- Componentes optimizados para touch

### Tema Material-UI
- Paleta de colores consistente
- Iconografía Material Design
- Animaciones y transiciones suaves

### Experiencia de Usuario
- Feedback visual para todas las acciones
- Confirmaciones para acciones destructivas
- Estados de carga y manejo de errores
- Formularios con validación en tiempo real

## 🚀 Despliegue

### Backend
1. Configurar variables de entorno de producción
2. Compilar: `npm run build`
3. Ejecutar: `npm run start:prod`

### Frontend
1. Compilar: `npm run build`
2. Servir archivos estáticos desde `dist/`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema:
- Abre un issue en GitHub
- Revisa la documentación de la API en `/api`
- Consulta los logs de la aplicación

---

**¡Disfruta gestionando tus gastos de
