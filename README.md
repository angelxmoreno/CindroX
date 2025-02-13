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

---

## 🔧 Core Modules

| Feature | Module |
|---------|--------|
| **HTTP Server & Routing** | Hono |
| **Database ORM** | Drizzle ORM |
| **Caching** | KeyvHQ |
| **Authentication** | Lucia Auth |
| **Validation & Data Sanitization** | Zod |
| **Logging** | Pino |
| **Git Hooks** | Lefthook |
| **Commit Standardization** | CommitLint + Conventional Commits |
| **Linting & Formatting** | Biome |
| **Testing Framework** | Bun:test (built-in) |
| **File Uploads** | Multer |
| **Dependency Injection** | Tsyringe |
| **Event Manager** | Emittery |
| **Template Generation** | Plop.js |
| **Email Sending** | Nodemailer + MailCrab |
| **CLI & Shell** | Commander.js |

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

---

## 📖 Documentation
- [Setup Guide](docs/setup.md)
- [Module Configurations](docs/modules.md)
- [API Reference](docs/api.md)
- [Contributing Guide](docs/contributing.md)

---

## 🤝 Contributing
We welcome contributions! Please refer to the [Contributing Guide](docs/contributing.md) for details on how to contribute.

---

## 🛠️ License
This project is licensed under the **[MIT License](LICENSE)**.

---

🚀 **CindroX** is built for speed, flexibility, and scalability. Start building your API today! 🎯
