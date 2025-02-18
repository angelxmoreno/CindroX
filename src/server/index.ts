import { appConfig } from "@config/app";
import AppContainer from "@config/container";
import { errorMiddleware } from "@middleware/errorMiddleware";
import { loggerMiddleware } from "@middleware/loggerMiddleware";
import { routingMiddleware } from "@middleware/routingMiddleware";
import { Hono } from "hono";

const logger = AppContainer.getLogger("App");
const server = new Hono();

// Register Middleware
server.use("*", loggerMiddleware);

// Register Routing Middleware
server.all("*", routingMiddleware);

// Global Error Handling
server.onError(errorMiddleware);

const serverConfig = {
    port: appConfig.app.port,
    fetch: server.fetch,
    request: server.request,
};

// Log after server starts
(async () => {
    await Bun.sleep(1); // Small delay to ensure Bun picks up the server
    logger.info(`✅ HTTP Server started on port ${serverConfig.port}`);
})();

export default serverConfig;
