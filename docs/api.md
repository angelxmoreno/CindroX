# 📖 CindroX API Reference

This document provides an overview of the available API endpoints in **CindroX**, their expected request/response formats, and usage examples.

---

## **🟢 Base URL**
All API endpoints are served under:
```sh
http://localhost:3000/api
```

---

## **1️⃣ Authentication**
### **🔹 Register a New User**
**Endpoint:**
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": { "id": "123", "email": "user@example.com" }
}
```

### **🔹 User Login**
**Endpoint:**
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": { "id": "123", "email": "user@example.com" }
}
```

---

## **2️⃣ User Management**
### **🔹 Get Current User**
**Endpoint:**
```http
GET /api/user/me
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "123",
  "email": "user@example.com"
}
```

### **🔹 Update User Profile**
**Endpoint:**
```http
PUT /api/user/update
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "message": "User updated successfully"
}
```

---

## **3️⃣ API Health Check**
### **🔹 Check API Status**
**Endpoint:**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "uptime": "43200s"
}
```

---

## **📌 Notes**
- **Authentication** is required for most endpoints.
- All requests and responses use **JSON format**.
- This is a **preliminary API reference**—as features expand, additional endpoints will be documented.

---

## **🚀 Next Steps**
- Implement **role-based access control (RBAC)** for API security.
- Expand **API endpoints** for additional resources (e.g., posts, uploads, notifications).
- Improve **error handling** for consistent API responses.

🔹 **CindroX API is modular—easily extend it for your needs!** 🎯
