import AppContainer from "@config/container";
import { ProtectRouteMiddleware } from "@config/modules/passport/ProtectRouteMiddleware";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

const logger = AppContainer.getLogger("Router");

export async function routingMiddleware(c: Context, next: Next) {
    const method = c.req.method.toUpperCase();
    const path = c.req.path.toLowerCase();
    const actionName = `${method}:${path}`;

    logger.info(`🔎 Looking up action: ${actionName}`);

    // Find matching action
    const actionInstance = AppContainer.resolveAction(actionName);

    if (!actionInstance) {
        logger.warn(`! No action found for ${actionName}`);
        throw new HTTPException(404, { message: "Not Found" });
    }

    logger.info(`✅ Found action: ${actionName}`);

    // Check if the action instance indicates it is protected.
    if (actionInstance.isProtected) {
        await ProtectRouteMiddleware()(c, async () => {});
    }

    // Execute action
    return await actionInstance.execute(c, next);
}
