
# 📚 Library Microservices - Monorepo

Este es un proyecto de microservicios desarrollado con **Bun**, **Hono**, **Drizzle ORM** y **PostgreSQL**. La arquitectura está organizada en un monorepo para compartir tipos y lógica de manera eficiente entre servicios.

## 🏗️ Estructura del Proyecto

- **services/**: Contiene los microservicios independientes.
  - **catalog-service**: Microservicio para la gestión de libros y autores. Implementa un **Bus de Eventos** interno para comunicación asíncrona.
  - **inventory-service**: Microservicio para la gestión de stock (en desarrollo).

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes:

- [Bun](https://bun.sh/) (Runtime y gestor de paquetes)
- [Docker & Docker Compose](https://www.docker.com/) (Para la infraestructura de base de datos)

### 1. Iniciar los Servicios
ejecutar el siguiente comando

```bash
docker compose up --build
```

El servicio catalog estará disponible en `http://localhost:3000`.
El servicio inventory estará disponible en `http://localhost:3001`.


## 📡 Sistema de Eventos

El Catalog Service incluye una implementación de `EventEmitter`. Actualmente, las acciones de creación de libros y autores emiten eventos que pueden ser consumidos internamente para extender la funcionalidad (logs o validaciones) sin acoplar la lógica de la base de datos.
