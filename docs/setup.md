# 📚 CindroX Setup Guide

This guide will walk you through setting up **CindroX**, ensuring all dependencies and services are properly configured.

---

## **1️⃣ Prerequisites**
Before starting, ensure you have the following installed:

- **[Bun](https://bun.sh/)** (Latest version)
- **[Docker & Docker Compose](https://www.docker.com/)** (For infrastructure services)
- **Git** (For version control)

Check versions:
```sh
bun --version
docker --version
git --version
```

---

## **2️⃣ Clone the Repository**
```sh
git clone https://github.com/angelxmoreno/CindroX/
cd cindrox
```

---

## **3️⃣ Install Dependencies**
```sh
bun install
```

This will install all required dependencies for **CindroX**.

---

## **4️⃣ Set Up Environment Variables**
Copy the example environment file and modify it as needed:
```sh
cp .env.example .env
```
Edit `.env` as needed. See the [Environment Variables Guide](docs/environment.md) for more details on each variable.

---

## **5️⃣ Setup Developer Tooling**
We use **CommitLint, Lefthook, and Biome** to enforce code standards.

### **Verify Setup**
```sh
bun run lint       # Check for linting errors
bun run lint:fix   # Fix formatting issues
```

### **Git Hooks**
Ensure Lefthook is installed properly:
```sh
lefthook run pre-commit
```

---

## **6️⃣ Setup Infrastructure**
We use **Docker Compose** to manage infrastructure services like MariaDB, Redis, and MailCrab.

### **Start Services**
```sh
bun docker:start
```

### **Stop Services**
```sh
bun docker:stop
```

Verify running containers:
```sh
docker ps
```

---

## **7️⃣ Run the API Server**
```sh
bun run src/server/index.ts
```

Once running, visit **`http://localhost:${SERVER_PORT}`** to check the API.

---

## **8️⃣ Running Tests**
```sh
bun test
```

---

## **9️⃣ Working with Events**
CindroX uses **Emittery** for event-driven functionality.

### **Adding a New Event Listener**
1. Open `src/config/events.ts`.
2. Register a new event:
   ```ts
   eventManager.on("user-registered", (data) => {
       logger.info(`New user registered: ${JSON.stringify(data)}`);
   });
   ```
3. Emit the event anywhere in your code:
   ```ts
   eventManager.emit("user-registered", { userId: 123 });
   ```

---

## **🔟 Logging with Pino**
CindroX uses **Pino** for structured logging.

### **Creating & Accessing Loggers**
To create a logger for a module:
```ts
const logger = AppContainer.getLogger("ModuleName");
logger.info("This is a log message");
```

---

## **1️⃣1️⃣ Adding Routes via Actions**
CindroX follows an **Action-based routing system**.

### **Adding a New Action**
1. Create a new file inside `src/actions` (e.g., `src/actions/users/createAction.ts`).
2. Implement the Action:
   ```ts
   import { type Context } from "hono";
   import type { ActionInterface } from "@actions/ActionInterface";
   import AppContainer from "@config/container";
   
   export class CreateUserAction implements ActionInterface {
       private logger = AppContainer.getLogger("CreateUserAction");
   
       async handle(c: Context) {
           this.logger.info("Handling user creation");
           return c.json({ message: "User created!" });
       }
   }
   ```
3. Register the action in `actionsMap.ts`:
   ```ts
   import { CreateUserAction } from "@actions/users/createAction";
   
   actions.set("POST:/users", CreateUserAction);
   ```

---

## **1️⃣2️⃣ Creating a Middleware**
To create a new middleware:
1. Add a new file inside `src/middleware` (e.g., `authMiddleware.ts`).
2. Implement the middleware:
   ```ts
   import { type Context, type Next } from "hono";
   export async function authMiddleware(c: Context, next: Next) {
       const authHeader = c.req.header("Authorization");
       if (!authHeader) {
           return c.text("Unauthorized", 401);
       }
       await next();
   }
   ```
3. Register it in `server/index.ts`:
   ```ts
   server.use("*", authMiddleware);
   ```

---

## **1️⃣3️⃣ Accessing the Cache**
CindroX supports **KeyvHQ** for caching.

### **Using the Cache**
```ts
const cache = AppContainer.resolve("Cache");
await cache.set("key", "value", 10000);
const value = await cache.get("key");
console.log(value); // "value"
```

---

## **Next Steps**
- Configure **database migrations** with Drizzle ORM.
- Set up **authentication** using Lucia Auth.
- Explore **API endpoints** using Hono.

🚀 **CindroX is now ready to build and scale!** 🎯
