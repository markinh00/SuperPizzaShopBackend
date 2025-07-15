# 🍕 SuperPizzaShop - Backend

**SuperPizzaShop** is a backend API project for a fake Pizza shop developed in **TypeScript** using **Fastify**, **Prisma ORM**, **PostgreSQL**, validations with **Zod**, documentation with **Swagger**, and containerization with **Docker**.

This project is an example of a modern and scalable backend architecture for managing orders for a pizzeria.

---

## 🚀 Technologies

- [Fastify](https://www.fastify.io/): fast and efficient web framework.
- [TypeScript](https://www.typescriptlang.org/): static typing for JavaScript.
- [Prisma](https://www.prisma.io/): ORM for PostgreSQL database.
- [PostgreSQL](https://www.postgresql.org/): relational database.
- [Zod](https://zod.dev/): schema validation.
- [Swagger](https://swagger.io/): interactive API documentation.
- [JWT](https://jwt.io/): authentication with JWT Token
- [Docker](https://www.docker.com/): containerization for a consistent environment.

---

## 🏛️ Architecture - UML

![UML](https://github.com/markinh00/SuperPizzaShopBackend/blob/main/UML.jpg)

---

## ⚙️ Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) LTS
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

---

## 🐳 Running with Docker

Follow these steps to run the project using Docker:

### 1. Clone the repository:

```bash
git clone https://github.com/markinh00/SuperPizzaShopBackend.git
cd SuperPizzaShopBackend
```

### 2. Run the docker container:

```bash
docker-compose up --build
```

### 3. Done!

with this the container will

- create a postgres database
- populate the database with `3 pizzas`, `3 drinks` and `1 admin` with the data bellow:

```json
{
	"name": "admin",
	"email": "admin@example.com",
	"password": "123456"
}
```
- create the application at `http://localhost:8000/`

to see the swagger documentation go to: `http://localhost:8000/docs`

if reseting the database is needed use the command bellow the delete everything and then the command from the second step:

```bash
docker-compose down -v
```
