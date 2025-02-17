# Integrations & Next Steps

This document outlines the remaining modules that need to be integrated into **CindroX**, along with their priority order for implementation.

---

## **🟡 Pending Integration**

1. **Validation & Data Sanitization** → [Zod](https://zod.dev/) 🔄
1. **Code Generation** → [Plop](https://plopjs.com/) 🔄
1. **Authentication** → [Lucia Auth](https://lucia-auth.com/) 🔄
1. **Background Jobs** → [BullMQ](https://github.com/taskforcesh/bullmq) 🔄
1. **Email Sending** → [Nodemailer](https://nodemailer.com/) + [MailCrab](https://github.com/tomMoulard/mailcrab) 🔄
1. **File Uploads** → [Multer](https://www.npmjs.com/package/multer) 🔄
1. **CLI & Shell** → [Commander.js](https://www.npmjs.com/package/commander) 🔄

---

## **Completed Integration**

1. **Database ORM** → [Drizzle ORM](https://orm.drizzle.team/) 🔄 *(Next Priority)*

---

## **📌 Next Steps**

Our current **priority order** for remaining integrations:

1. **Drizzle ORM (Database)**
7. **Commander.js (CLI)**
7. **Plop (code generation)**
2. **Zod (Validation)**
6. **Multer (File Uploads)**
3. **Lucia Auth (Authentication)**
4. **BullMQ (Background Jobs)**
5. **Nodemailer + MailCrab (Email)**

---

## Other Todos
1. improve docs such that they reflect what they dev would like to do
2. add a blog tutorial
3. ensure thrown errors are in json
4. create startup script that renders actionMap
5. create UserMailer class
6. integrate email templates
7. move logger setup to config/modules/loggers.ts
8. discuss DrizzleCli and the migrations scripts
9. discuss how to add new models
---


🔹 **CindroX is designed to be modular—each integration enhances its functionality and scalability!** 🚀
