# Customer Address Nest API

A RESTful API built with **NestJS** for managing users, customers, and addresses. It uses **PostgreSQL** as the database and **JWT** for authentication. Integration tests run in an isolated database with a dedicated `.env.test` configuration file.

## 🚀 Technologies

- NestJS  
- TypeScript  
- PostgreSQL  
- Prisma ORM  
- Jest  

## 📦 Installation

1. Clone the repository:
    ```
    git clone https://github.com/your-username/customer-address-nest-api.git
    cd customer-address-nest-api
    ```

2. Install dependencies with Yarn:
    ```
    yarn install
    ```

3. Generate Prisma client:
   ```
    prisma generate
   ```
   This is already executed by yarn install. But you might want to run it again after changing schema.prisma.

4. Set up environment files:
    - Copy the example files and configure them accordingly:
      ```
        cp .env.example .env
        cp .env.test.example .env.test
      ```

## ⚙️ Running the Application

1. Run database migrations:
   ```
    yarn prisma migrate dev
   ```

2. Start the application:
   ```
    yarn start
   ```

## 🔐 Authentication

1. **Create a user**:
   ```
    POST /user
   ```

2. **Login with credentials**:
   ```
    POST /auth/login
   ```

    - A **JWT token** will be returned.

3. **Use the token** in the header for other requests:
   ```
    Authorization: Bearer <TOKEN>
   ```

## 🧲 Running Tests

### 💡 Prerequisite:
Before running integration tests, apply the migrations to the test database:
   ```
    yarn prisma:test:migrate
   ```

### Available Test Commands:

- Run unit tests:
   ```
    yarn test
   ```

- Run unit tests in watch mode:
   ```
    yarn test:watch
   ```

- Run tests with coverage report:
   ```
    yarn test:cov
   ```

- Debug unit tests with Node Inspector:
   ```
    yarn test:debug
   ```

- Run integration tests:
   ```
    yarn test:e2e
   ``` 

- Watch mode for integration tests:
   ```
    yarn test:e2e-watch
   ```

## 📄 Project Scripts

| Command                    | Description |
|----------------------------|-------------|
| yarn start                 | Starts the application |
| yarn start:dev             | Starts in watch mode (development) |
| yarn start:debug           | Starts with debugging enabled |
| yarn start:prod            | Starts the built application |
| yarn build                 | Compiles the project |
| yarn prisma:test:migrate   | Runs test DB migrations using `.env.test` |
| yarn test                  | Runs unit tests |
| yarn test:watch            | Runs unit tests in watch mode |
| yarn test:cov              | Runs tests with coverage report |
| yarn test:e2e              | Runs integration tests with `.env.test` |
| yarn test:e2e-watch        | Runs integration tests in watch mode |
| yarn lint                  | Lints the code with ESLint + Prettier |
| yarn format                | Formats code using Prettier |
| yarn postinstall           | Generates Prisma client after install |


