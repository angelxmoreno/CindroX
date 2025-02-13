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
bun run src/server.ts
```

Once running, visit **`http://localhost:${SERVER_PORT}`** to check the API.

---

## **8️⃣ Running Tests**
```sh
bun test
```

---

## **Next Steps**
- Configure **database migrations** with Drizzle ORM.
- Set up **authentication** using Lucia Auth.
- Explore **API endpoints** using Hono.

🚀 **CindroX is now ready to build and scale!** 🎯
