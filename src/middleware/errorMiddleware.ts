import AppContainer from "@config/container";
import type { Context, ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

const logger = AppContainer.getLogger("ErrorMiddleware");

export const errorMiddleware: ErrorHandler = async (err, c: Context): Promise<Response> => {
    const httpError =
        err instanceof HTTPException ? err : new HTTPException(500, { message: "Unhandled error", cause: err });
    logger.error(`${httpError.status} ${httpError.message}`);

    return c.json(
        {
            status: httpError.status,
            message: httpError.message,
        },
        httpError.status,
    );
};
