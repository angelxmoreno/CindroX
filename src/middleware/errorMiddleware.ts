import AppContainer from "@config/container";
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

const logger = AppContainer.getLogger("ErrorMiddleware");

export const errorMiddleware: ErrorHandler = async (err): Promise<Response> => {
    if (err instanceof HTTPException) {
        logger.error(err.name);
        return err.getResponse();
    }

    logger.error(`❌ Unhandled error: ${err}`);
    const err500 = new HTTPException(500, { message: "Unhandled error", cause: err });
    return err500.getResponse();
};
