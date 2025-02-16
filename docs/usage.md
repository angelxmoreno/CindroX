# 🔧 CindroX Usage Guide

This guide explains how to use core utilities in CindroX, including dependency injection (`AppContainer`), event management (`EventManager`), logging (`Pino`), routing (`Actions`), middleware, and caching (`KeyvHQ`).

---

## **🛠 Dependency Injection with AppContainer**

CindroX uses `Tsyringe` for dependency injection, and `AppContainer` provides a centralized way to resolve dependencies.

### **Registering Dependencies**

All core dependencies are registered in `src/config/container.ts`:

```ts
import "reflect-metadata";
import { container, type DependencyContainer } from "tsyringe";
import pino, { type Logger } from "pino";
import { appConfig } from "@config/app";
import Emittery from "emittery";

const childContainer: DependencyContainer = container.createChildContainer();

childContainer.register("EventManager", { useValue: new Emittery() });
childContainer.register<Logger>("Logger", { useValue: pino({ level: appConfig.logger.level }) });

class AppContainer {
    private static container = childContainer;

    static resolve<T extends keyof AppDependencies>(key: T): AppDependencies[T] {
        return this.container.resolve<AppDependencies[T]>(key);
    }
}

export default AppContainer;
```

### **Using AppContainer**

To resolve dependencies in your code:

```ts
import AppContainer from "@config/container";

const logger = AppContainer.resolve("Logger");
const eventManager = AppContainer.resolve("EventManager");
```

---

## **💬 Event Management with EventManager**

CindroX uses `Emittery` for an event-driven architecture.

### **Registering Event Listeners**

Define event listeners in `src/config/events.ts`:

```ts
import AppContainer from "@config/container";

const eventManager = AppContainer.resolve("EventManager");
const logger = AppContainer.getLogger("Events");

// Register an event listener
eventManager.on("user-registered", (data) => {
    logger.info(`New user registered: ${JSON.stringify(data)}`);
});
```

### **Emitting Events**

To emit an event:

```ts
import AppContainer from "@config/container";

const eventManager = AppContainer.resolve("EventManager");

eventManager.emit("user-registered", { userId: 123, name: "Alice" }).catch(console.error);
```

---

## **💡 Logging with Pino**

CindroX uses `Pino` for high-performance structured logging.

### **Creating a Logger Instance**

Instead of using `console.log`, use `Pino` for logging:

```ts
import AppContainer from "@config/container";

const logger = AppContainer.resolve("Logger");
logger.info("Application started!");
```

### **Using Loggers per Module**

Scoped loggers help organize logs across different modules:

```ts
import AppContainer from "@config/container";

const authLogger = AppContainer.getLogger("AuthService");
authLogger.info("Authentication successful");
```

---

## **📌 Adding New Routes (Actions System)**

CindroX uses an **Action-based routing system** where actions are mapped automatically based on naming conventions. To add a new route:

### **1️⃣ Create an Action**
Create an action in `src/actions/users/createAction.ts`:

```ts
import type { Context } from "hono";
import type { ActionInterface } from "@actions/ActionInterface";
import AppContainer from "@config/container";

export class CreateAction implements ActionInterface {
    private logger = AppContainer.getLogger("CreateUserAction");

    async handle(c: Context) {
        this.logger.info("Handling user creation");
        return c.json({ message: "User created" }, 201);
    }
}
```

### **2️⃣ Register in the Action Map**
Edit `src/config/modules/actionMap.ts`:

```ts
import { CreateAction } from "@actions/users/createAction";

export const actions = new Map([
    ["POST:/users", CreateAction],
]);
```

### **3️⃣ Done!**
Now, sending a `POST /users` request will invoke `CreateAction.handle()`.

---

## **🛠 Creating Middleware**

Middleware allows modifying requests before reaching actions.

Example: A logging middleware in `src/middleware/loggerMiddleware.ts`:

```ts
import type { Context, Next } from "hono";
import AppContainer from "@config/container";

const logger = AppContainer.getLogger("RequestLogger");

export async function loggerMiddleware(c: Context, next: Next) {
    logger.info(`📥 ${c.req.method} ${c.req.path}`);
    await next();
    logger.info(`📤 ${c.req.method} ${c.req.path} - Completed`);
}
```

To apply middleware globally, modify `src/server/index.ts`:

```ts
server.use("*", loggerMiddleware);
```

---

## **🔄 Using the Cache System**

CindroX integrates **KeyvHQ** for caching, supporting multiple backends (memory, Redis, etc.).

### **Accessing the Cache**

```ts
import AppContainer from "@config/container";

const cache = AppContainer.resolve("Cache");

await cache.set("user_123", { name: "Alice" }, 3600); // Store for 1 hour
const user = await cache.get("user_123");
console.log(user);
```

---

## 🚀 **Next Steps**

- Implement event-driven patterns using `EventManager`.
- Use `Pino` logs to track API requests and errors.
- Add more **Actions** to expand the API.
- Leverage caching for performance optimization.

🔹 **CindroX provides modular logging, events, DI, caching, and auto-routing—use them to build scalable applications!**
