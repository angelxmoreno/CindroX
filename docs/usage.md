# 🔧 CindroX Usage Guide

This guide explains how to use core utilities in CindroX, including dependency injection (`AppContainer`), event management (`EventManager`), and logging (`Pino`).

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

### **Using Child Loggers**
Child loggers help scope logs to different modules:

```ts
import AppContainer from "@config/container";

const authLogger = AppContainer.getLogger("AuthService");
authLogger.info("Authentication successful");
```

---

## 🚀 **Next Steps**
- Implement event-driven patterns using `EventManager`.
- Use `Pino` logs to track API requests and errors.
- Ensure all services resolve dependencies via `AppContainer`.

🔹 **CindroX provides modular logging, events, and DI—use them to build scalable applications!**
