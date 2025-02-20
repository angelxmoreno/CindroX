# Framework Architecture Overview

This document provides a detailed overview of our current framework architecture. Use it as context for discussing future features—next up is integrating BullMQ.

## 1. Runtime and Environment

- **Platform:** The framework runs on Bun, using modern JavaScript/TypeScript features.
- **Package Management & Testing:** Utilizes Bun's built-in package management and `bun test` for unit and integration tests.

## 2. Web Framework

- **Hono:** A lightweight web framework that handles routing, middleware, and the request/response cycle.

## 3. Dependency Injection

- **tsyringe:** Used for dependency injection. The DI container is configured in `src/config/container.ts` and resolves services such as `UsersModel`, Logger, etc.

## 4. Authentication

- **Passport.js:** Integrated for authentication with both local and JWT strategies.
- **Strategy Files:** Located in `src/config/modules/passport/` (e.g., `local.ts`, `jwt.ts`, `PassportHonoAdapterMiddleware.ts`, and `ProtectRouteMiddleware.ts`).

## 5. Actions and Routing

- **Actions:** All actions extend an abstract `BaseAction` (in `src/actions/BaseAction.ts`) which provides common functionality:
    - Pre-handlers (middleware-style functions) that run before the main handler.
    - Optional request validation using Zod. Validated data is stored in the context.
    - A `getAuthUser` method to retrieve the authenticated user.
- **Routing:** Routes are mapped to actions via an action map in `src/config/modules/actionMap.ts` and dispatched by `src/middleware/routingMiddleware.ts`.

## 6. CLI and Scaffolding

- **CLI:** The CLI entry point is at `src/cli.ts`, and Plop generators are used for scaffolding new components.
- **Plop Generators:** Located in `src/plop-generators/` with templates in `src/templates/cook/` for generating commands (e.g., `CookCommandCommand.ts`, `CookMiddlewareCommand.ts`) and middleware.

## 7. Database and ORM

- **Drizzle ORM:** Used for database interactions.
- **Migrations:** SQL migration files reside in `src/db/migrations/` (with meta files).
- **Models and Schemas:** Models extend an abstract `AbstractMySqlModel` in `src/db/models/` (e.g., `UsersModel.ts`). Table definitions (schemas) are in `src/db/schemas/`.
- **Drizzle-zod:** Integrated to generate Zod schemas from Drizzle models. Model validation schemas are in `src/validation/model/`.

## 8. Validation

- **Zod:** Used for runtime validation and type inference.
- **Validation in Actions:** BaseAction optionally accepts a Zod validation schema. It runs pre-handlers and validates the request body before executing the main action. Validation schemas for actions are in `src/validation/action/`.
- **Custom Errors:** A `ValidationHTTPException` is defined in `src/validation/ValidationHTTPException.ts` to standardize error responses.

## 9. Middleware

- **General Middleware:** Error, logger, and routing middleware are in `src/middleware/`.

## 10. Logging and Caching

- **Logger & Cache Modules:** Located in `src/config/modules/` (e.g., `LoggerRegistry.ts` and `cache.ts`), these modules are resolved via the DI container.

## 11. Testing

- **Test Structure:** Tests are organized under the `tests/` directory into unit and integration tests.
- **Test Helpers:**
    - `DatabaseTestHelper.ts` – Handles database setup/cleanup and user creation.
    - `CommandTestHelper.ts` – For testing CLI commands.
    - `HonoTestHelper.ts` – For mocking Hono contexts and middleware.

## 12. Future Feature: BullMQ Integration

The next feature to be integrated is **BullMQ** for job queuing and background processing. This will involve:

- Creating a new module (e.g., `BullMQModule.ts`) under `src/config/modules/` to encapsulate BullMQ configuration and connection management.
- Registering BullMQ in the DI container so that actions and services can easily access the job queue.
- Potentially creating new CLI commands (using Plop generators) for managing and monitoring job queues.
- Writing tests and updating documentation to cover the new job processing features.

## Usage Context for ChatGPT

Please use this overview as context when discussing the integration of BullMQ. The framework is designed for APIs and leverages Hono for routing, Drizzle ORM for database operations, Passport.js for authentication, and Zod for validation. It features a robust CLI with Plop generators for scaffolding and comprehensive testing utilities.
