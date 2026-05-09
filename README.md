
# 📚 Library Microservices - Monorepo

Este es un proyecto de microservicios desarrollado con **Bun**, **Hono**, **Drizzle ORM** y **PostgreSQL**. La arquitectura está organizada en un monorepo para compartir tipos y lógica de manera eficiente entre servicios.

## 🏗️ Estructura del Proyecto

El monorepo utiliza **Bun Workspaces** para gestionar las dependencias:

- **services/**: Contiene los microservicios independientes.
  - **catalog-service**: Microservicio para la gestión de libros y autores. Implementa un **Bus de Eventos** interno para comunicación asíncrona.
  - **inventory-service**: Microservicio para la gestión de stock (en desarrollo).
- **packages/**: Librerías de código compartido.
  - **shared-types**: Contiene las interfaces de TypeScript comunes (Author, Book, etc.).

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes:

- [Bun](https://bun.sh/) (Runtime y gestor de paquetes)
- [Docker & Docker Compose](https://www.docker.com/) (Para la infraestructura de base de datos)

## 🛠️ Configuración e Instalación

1. **Instalar dependencias del monorepo:**

   Ejecuta desde la raíz:

```bash
   bun install
```

2. **Configurar variables de entorno:**

   Crea un archivo `.env` en la raíz (o dentro de `services/catalog-service`) con los siguientes valores de ejemplo:

```env
   DATABASE_URL=postgres://ctgadmin:123456@localhost:5433/catalog_db
   PORT=3000
```

## 🔌 Cómo ejecutar el proyecto

### 1. Iniciar Base de Datos

Levanta el contenedor de PostgreSQL usando Docker:

```bash
bun db:up
```

### 2. Sincronizar Esquema (Drizzle)

Para que la base de datos tenga las tablas físicas sincronizadas con tu código de TypeScript, ejecuta:

```bash
cd services/catalog-service
bun db:sync
```

### 3. Iniciar el Servicio

Vuelve a la raíz y ejecuta el servicio de catálogo en modo desarrollo:

```bash
bun catalog:dev
```

El servicio estará disponible en `http://localhost:3000`.

## 📜 Scripts Disponibles

Desde la raíz puedes gestionar todo el proyecto:

| Comando | Acción |
|---|---|
| `bun db:up` | Inicia los contenedores de Docker. |
| `bun db:stop` | Detiene los contenedores (mantiene datos). |
| `bun db:down` | Elimina los contenedores de Docker. |
| `bun db:reset` | Borra volúmenes y recrea la base de datos desde cero. |
| `bun catalog:dev` | Inicia el servicio de Catálogo con Hot Reload. |
| `bun inventory:dev` | Inicia el servicio de Inventario con Hot Reload. |

## 📡 Sistema de Eventos

El Catalog Service incluye una implementación de `EventEmitter`. Actualmente, las acciones de creación de libros y autores emiten eventos que pueden ser consumidos internamente para extender la funcionalidad (logs o validaciones) sin acoplar la lógica de la base de datos.