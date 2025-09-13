# APP-GESTOR_DE_GASTOS

Este proyecto es una aplicación de gestión de gastos personales, que consta de una API de backend construida con NestJS y una interfaz de usuario de frontend construida con React.

## Tabla de Contenidos

*   [Características](#características)
*   [Tecnologías Utilizadas](#tecnologías-utilizadas)
*   [Primeros Pasos](#primeros-pasos)
    *   [Prerrequisitos](#prerrequisitos)
    *   [Instalación](#instalación)
    *   [Ejecutando la Aplicación](#ejecutando-la-aplicación)
*   [Endpoints de la API](#endpoints-de-la-api)
*   [Base de Datos](#base-de-datos)

## Características

*   Autenticación de Usuarios (Registro, Inicio de Sesión)
*   Gestión de Gastos (Añadir, Ver, Actualizar, Eliminar)
*   Gestión de Categorías para Gastos (Añadir, Ver, Actualizar, Eliminar)
*   Panel de control para una visión general de los gastos

## Tecnologías Utilizadas

### Backend

*   **Framework**: NestJS
*   **Lenguaje**: TypeScript
*   **Base de Datos**: SQLite
*   **ORM**: TypeORM (probable, dado NestJS y las entidades)
*   **Autenticación**: JWT (JSON Web Tokens)

### Frontend

*   **Framework**: React
*   **Herramienta de Construcción**: Vite
*   **Lenguaje**: TypeScript
*   **Estilos**: CSS
*   **Gestión de Estado**: React Context API (AuthContext)
*   **Enrutamiento**: React Router (probable, dadas las carpetas `pages` y `Layout.tsx`)

## Primeros Pasos

Sigue estas instrucciones para obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

### Prerrequisitos

*   Node.js (se recomienda la versión LTS)
*   npm o yarn

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/your-username/APP-GESTOR_DE_GASTOS.git
    cd APP-GESTOR_DE_GASTOS
    ```

2.  **Configuración del Backend:**
    ```bash
    cd backend
    npm install # o yarn install
    ```

3.  **Configuración del Frontend:**
    ```bash
    cd ../frontend
    npm install # o yarn install
    ```

### Ejecutando la Aplicación

1.  **Ejecuta el Backend:**
    ```bash
    cd backend
    npm run start:dev # o yarn start:dev
    ```
    La API del backend se ejecutará típicamente en `http://localhost:3000`.

2.  **Ejecuta el Frontend:**
    ```bash
    cd ../frontend
    npm run dev # o yarn dev
    ```
    La aplicación de frontend se ejecutará típicamente en `http://localhost:5173` (o en otro puerto si el 5173 está en uso).

## Endpoints de la API

El backend proporciona endpoints de API RESTful para gestionar usuarios, autenticación, categorías y gastos.
(Puedes encontrar más detalles sobre los endpoints específicos examinando los archivos del controlador en `backend/src/`.)

## Base de Datos

La aplicación utiliza SQLite como su base de datos, con el archivo de base de datos ubicado en `backend/expenses.db`.
