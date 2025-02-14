# 🚀 CindroX Framework

CindroX is a **fast, API-first framework** built with **Bun, Hono, and Drizzle ORM**, designed for **React and mobile apps**. It features **modular caching, authentication, event-driven architecture, and CLI automation**, providing a streamlined developer experience.

---

## 📦 Installation

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/angelxmoreno/CindroX/
cd cindrox
```

### **2️⃣ Install Dependencies**
```sh
bun install
```

### **3️⃣ Set Up Environment Variables**
Copy the example environment file and modify it as needed:
```sh
cp .env.example .env
```
Edit `.env` as needed. See the [Environment Variables Guide](docs/environment.md) for more details on each variable.

---

## 🛠 Core Modules

| Feature | Module |
|---------|--------|
| **HTTP Server & Routing** | [Hono](https://hono.dev/) |
| **Database ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Caching** | [KeyvHQ](https://www.npmjs.com/package/keyv) |
| **Authentication** | [Lucia Auth](https://lucia-auth.com/) |
| **Validation & Data Sanitization** | [Zod](https://zod.dev/) |
| **Logging** | [Pino](https://getpino.io/) |
| **Git Hooks** | [Lefthook](https://github.com/evilmartians/lefthook) |
| **Commit Standardization** | [CommitLint](https://commitlint.js.org/) + [Conventional Commits](https://www.conventionalcommits.org/) |
| **Linting & Formatting** | [Biome](https://biomejs.dev/) |
| **Testing Framework** | Bun:test (built-in) |
| **File Uploads** | [Multer](https://github.com/expressjs/multer) |
| **Dependency Injection** | [Tsyringe](https://github.com/microsoft/tsyringe) |
| **Event Manager** | [Emittery](https://github.com/sindresorhus/emittery) |
| **Template Generation** | [Plop.js](https://plopjs.com/) |
| **Email Sending** | [Nodemailer](https://nodemailer.com/) + [MailCrab](https://github.com/marlonb/mailcrab) |
| **CLI & Shell** | [Commander.js](https://github.com/tj/commander.js) |

---

## ⚡ Usage

### **Start the API Server**
```sh
bun run src/server.ts
```

### **Run Linting & Formatting**
```sh
bun run lint       # Check for linting errors
bun run lint:fix   # Fix formatting issues
```

### **Run Tests**
```sh
bun test
```

### **Run with Docker**
To start the services using Docker:
```sh
bun docker:start
```

To stop all services:
```sh
bun docker:stop
```

---

## 📚 Documentation
- [Setup Guide](docs/setup.md)
- [Module Configurations](docs/modules.md)
- [API Reference](docs/api.md)
- [Environment Variables Guide](docs/environment.md)
- [Usage](docs/usage.md)
- [Contributing Guide](docs/contributing.md)

---

## 🤝 Contributing
We welcome contributions! Please refer to the [Contributing Guide](docs/contributing.md) for details on how to contribute.

---

## 🛠️ License
This project is licensed under the **[MIT License](LICENSE)**.

---

🚀 **CindroX** is built for speed, flexibility, and scalability. Start building your API today! 🎯
