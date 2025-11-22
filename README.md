# Tactology Global NestJS Project Documentation

## Project Overview

This project is built with **NestJS**, **TypeORM**, and **GraphQL**. It provides endpoints for managing users, authentication, and departments (with sub-departments).

Key features:

- JWT-based authentication.
- Department management with optional sub-departments.
- GraphQL API with playground.
- Database seeding for creating an initial admin user.
- Rate limiting with throttler.
- Configurable via environment variables.

---

## 1. Project Setup

### 1.1 Prerequisites

- Node.js ≥ 20
- PostgreSQL (or compatible SQL database)
- `npm` or `yarn`
- Optional: `ts-node` for running scripts

### 1.2 Clone the Repository

```bash
git clone <your-repo-url>
cd tactologyglobal-owolabitosin
```

### 1.3 Install Dependencies

```bash
npm install
# or
yarn install
```

### 1.4 Environment Variables

Create a `.env` file in the root directory:

```env
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=tactology_db

# JWT Authentication
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=3600s

# Admin seeding
ADMIN_USERNAME=admin@tactology.com
ADMIN_PASSWORD=DefaultAdmin123!

# Application environment
NODE_ENV=development
```

---

## 2. Database Setup

### 2.1 Configure TypeORM

Ensure your `DatabaseModule` is set to connect using `.env` variables:

```ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // disable in production
});
```

### 2.2 Run Migrations / Synchronize

- In development, `synchronize: true` will automatically create tables.
- In production, use migrations instead.

---

## 3. Database Seeding

The project includes a **Seeder** for creating an initial admin user.

### 3.1 Seed Script

Run the seeding script:

```bash
npm run seed:admin
```

Expected output:

```
✅ Admin user created
```

If the admin user already exists:

```
⚠️ Admin user already exists — skipped
```

### 3.2 Seed Service

- `SeedService` orchestrates the seeding.
- `AdminUserSeeder` creates an admin with credentials from `.env`.

---

## 4. Running the Application

### 4.1 Development

```bash
npm run start:dev
```

- The application runs at: `http://localhost:3000`

### 4.2 Production

```bash
npm run build
npm run start:prod
```

---

## 5. GraphQL API

### 5.1 Playground

- Available at: `http://localhost:3000/graphql`
- Test queries, mutations, and subscriptions here.

---

## 6. Department Management GraphQL Endpoints

### 6.1 Create Department

```graphql
mutation {
  createDepartment(
    input: {
      name: "Finance"
      subDepartments: [{ name: "Accounts" }, { name: "Audit" }]
    }
  ) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

- `subDepartments` should be null if none is provided. Empty array values are not allowed.
- Validation: `name` min length 2.

### 6.2 Update Department

```graphql
mutation updateDepartment($id: ID!, $input: UpdateDepartmentInput!) {
  updateDepartment(id: $id, input: $input) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

### 6.3 Delete Department

```graphql
mutation deleteDepartment($id: Int!) {
  deleteDepartment(id: $id)
}
```

- Deletes the department and all sub-departments.

### 6.4 Fetch Departments

```graphql
query getDepartments {
  getDepartments {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

---

## 7. Authentication

### 7.1 Login Mutation

```graphql
mutation {
  login(
    input: {
      username: "adminuser@tactology.com"
      password: "52417@_tactologyAdmin"
    }
  ) {
    accessToken
    user {
      id
      username
    }
  }
}
```

- Returns a JWT token.
- Use this token for protected endpoints with:

```json
{
  "Authorization": "Bearer <token>"
}
```

---

## 8. Postman GraphQL Setup

1. Open Postman → New → Request.
2. Select **POST**.
3. Enter GraphQL endpoint: `http://localhost:3000/graphql`
4. Select **GraphQL** tab.
5. Enter query/mutation in **Query** section.
6. Set variables in **GraphQL Variables** section.
   Example:

   ```json
   {
     "input": {
       "id": 1,
       "name": "Finance Updated"
     }
   }
   ```

7. Add JWT token in **Headers** if required:

   ```
   Authorization: Bearer <token>
   ```

---

## 9. Notes

- All protected endpoints require `@GqlAuthGuard` unless marked with `@PublicRoute()` decorator.
- Rate limiting is applied globally via `GqlThrottlerGuard`.
- Environment variables must be set correctly for database and JWT auth.
- Admin user seeding is required for initial login.
