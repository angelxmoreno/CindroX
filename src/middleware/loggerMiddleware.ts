import AppContainer from "@config/container";
import type { Context } from "hono";

const logger = AppContainer.createChildLogger("RequestLogger");

export async function loggerMiddleware(c: Context, next: () => Promise<void>) {
    const { method, path } = c.req;
    logger.info(`📥 ${method} ${path}`);
    await next();
    logger.info(`📤 ${method} ${path} - Completed`);
}
