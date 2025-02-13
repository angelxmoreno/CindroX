# 📦 CindroX Module Overview

CindroX is composed of several core modules that provide a streamlined API development experience. This document outlines each module and its purpose within the framework.

---

## **🟢 Core Modules**

| Feature | Module | Description |
|---------|--------|-------------|
| **HTTP Server & Routing** | [Hono](https://hono.dev/) | High-performance, Express-like framework for handling API routes. |
| **Database ORM** | [Drizzle ORM](https://orm.drizzle.team/) | SQL-first ORM for efficient and type-safe database queries. |
| **Caching** | [KeyvHQ](https://www.npmjs.com/package/keyv) | Lightweight, configurable key-value store supporting multiple backends. |
| **Authentication** | [Lucia Auth](https://lucia-auth.com/) | Secure authentication system supporting sessions and tokens. |
| **Validation & Data Sanitization** | [Zod](https://zod.dev/) | Schema-based validation and type safety enforcement. |
| **Logging** | [Pino](https://getpino.io/) | Fast, structured JSON logging for performance monitoring. |
| **Git Hooks** | [Lefthook](https://github.com/evilmartians/lefthook) | Efficient Git hook manager for pre-commit and pre-push validations. |
| **Commit Standardization** | [CommitLint](https://commitlint.js.org/) + [Conventional Commits](https://www.conventionalcommits.org/) | Enforces standardized commit messages following Conventional Commits. |
| **Linting & Formatting** | [Biome](https://biomejs.dev/) | Rust-powered replacement for ESLint & Prettier, enforcing code style consistency. |
| **Testing Framework** | [Bun:test](https://bun.sh/docs/runtime/testing) | Built-in testing framework for fast unit and integration tests. |
| **File Uploads** | [Multer](https://www.npmjs.com/package/multer) | Middleware for handling multipart file uploads. |
| **Dependency Injection** | [Tsyringe](https://www.npmjs.com/package/tsyringe) | Lightweight DI container for better modularity and testing. |
| **Event Manager** | [Emittery](https://www.npmjs.com/package/emittery) | Asynchronous, event-driven system for internal messaging. |
| **Template Generation** | [Plop.js](https://plopjs.com/) | CLI tool for scaffolding controllers and other components. |
| **Email Sending** | [Nodemailer](https://nodemailer.com/) + [MailCrab](https://github.com/tomMoulard/mailcrab) | Handles SMTP-based email sending, with MailCrab for local email capture. |
| **CLI & Shell** | [Commander.js](https://www.npmjs.com/package/commander) | A simple yet powerful command-line interface framework. |

---

## **🔧 Module Configuration**
Each module can be configured as needed. Refer to their respective configuration files and environment variables:

- **Hono** → `src/server.ts`
- **Drizzle ORM** → `drizzle.config.ts`
- **KeyvHQ (Caching)** → `config/cache.ts`
- **Lucia Auth (Authentication)** → `src/auth.ts`
- **Pino (Logging)** → `src/logger.ts`
- **CommitLint & Lefthook** → `.commitlintrc` & `.lefthook.yml`
- **Biome** → `biome.json`
- **Multer (File Uploads)** → `src/upload.ts`
- **Emittery (Events)** → `src/events.ts`
- **Plop.js (Templates)** → `plopfile.ts`
- **Nodemailer (Email)** → `src/mailer.ts`
- **Commander.js (CLI)** → `src/cli.ts`

For full setup instructions, see [Setup Guide](setup.md).

---

## 🚀 **Next Steps**
- Configure **database migrations** with Drizzle ORM.
- Set up **authentication** using Lucia Auth.
- Implement **API endpoints** using Hono.

🔹 **CindroX is designed to be modular and extensible—customize it to fit your project!** 🎯
