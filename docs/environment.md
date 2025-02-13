# 📄 Environment Variables Guide

This guide provides an overview of the environment variables used in CindroX and their purposes.

## 🛠 Core Variables

| Variable | Description |
|----------|-------------|
| `CONTAINER_PREFIX` | Prefix for container names to avoid conflicts. |
| `NODE_ENV` | Environment mode (`development` or `production`). |
| `SERVER_PORT` | Port for the API server to listen on. |

## 🗄 Database Configuration

| Variable | Description |
|----------|-------------|
| `MYSQL_ROOT_PASSWORD` | Root password for MariaDB. |
| `MYSQL_DATABASE` | Name of the database. |
| `MYSQL_USER` | Username for the database. |
| `MYSQL_PASSWORD` | Password for the database user. |
| `MYSQL_PORT` | Port to expose MariaDB service. |

## 🔄 Redis Configuration

| Variable | Description |
|----------|-------------|
| `REDIS_PORT` | Port to expose Redis service. |

## 📩 MailCrab Configuration

| Variable | Description |
|----------|-------------|
| `MAILCRAB_UI_PORT` | Port to access MailCrab web UI. |
| `MAILCRAB_SMTP_PORT` | Port for MailCrab SMTP service. |

---

🚀 **Ensure to modify these variables in your `.env` file according to your development or production setup.**
