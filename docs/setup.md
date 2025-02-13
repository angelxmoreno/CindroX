# 📖 CindroX Setup Guide

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

## **4️⃣ Setup Developer Tooling**
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

## **5️⃣ Setup Infrastructure**
We use **Docker Compose** to manage infrastructure services like PostgreSQL and MailCrab.

### **Start Services**
```sh
docker compose up -d
```

### **Stop Services**
```sh
docker compose down
```

Verify running containers:
```sh
docker ps
```

---

## **6️⃣ Run the API Server**
```sh
bun run src/server.ts
```

Once running, visit **`http://localhost:3000`** to check the API.

---

## **7️⃣ Running Tests**
```sh
bun test
```

---

## **Next Steps**
- Configure **database migrations** with Drizzle ORM.
- Set up **authentication** using Lucia Auth.
- Explore **API endpoints** using Hono.

🚀 **CindroX is now ready to build and scale!** 🎯
