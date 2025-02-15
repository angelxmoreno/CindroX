import { appConfig } from "@config/app";
import AppContainer from "@config/container";
import { errorMiddleware } from "@middleware/errorMiddleware";
import { loggerMiddleware } from "@middleware/loggerMiddleware";
import { routingMiddleware } from "@middleware/routingMiddleware";
import { Hono } from "hono";

const server = new Hono();
const logger = AppContainer.createChildLogger("Server");

// Register Middleware
server.use("*", loggerMiddleware);

// Register Routing Middleware
server.all("*", routingMiddleware);

// Global Error Handling
server.onError(errorMiddleware);

const serverConfig = {
    port: appConfig.app.port,
    fetch: server.fetch,
};

// Log after server starts
Promise.resolve().then(() => {
    logger.info(`✅ HTTP Server started on port ${serverConfig.port}`);
});

export default serverConfig;
