import passport from "@config/modules/passport";
import type { Request, Response } from "express";
import type { Context, Next } from "hono";

/**
 * HonoRequestWithBody extends Hono's request type by adding an optional body property.
 */
interface HonoRequestWithBody {
    body?: unknown;
}

/**
 * PassportHonoAdapterMiddleware adapts Passport.js initialization for a Hono application.
 *
 * This middleware ensures that if a request body exists, it is parsed and attached to the request.
 * If parsing fails (e.g., because the request body is empty), an empty object is assigned.
 * Then, it calls passport.initialize() using the Hono request and response objects.
 *
 * Usage:
 *   import { PassportHonoAdapterMiddleware } from "@middleware/PassportHonoAdapterMiddleware";
 *   app.use(PassportHonoAdapterMiddleware());
 *
 * @returns A Hono-compatible middleware function.
 */
export function PassportHonoAdapterMiddleware() {
    return async (c: Context, next: Next) => {
        // Cast the request to include a body property.
        const reqWithBody = c.req as HonoRequestWithBody;
        if (!reqWithBody.body) {
            try {
                reqWithBody.body = await c.req.json();
            } catch (error) {
                // If parsing fails (e.g., empty body), assign an empty object.
                reqWithBody.body = {};
            }
        }
        const reqWithHeaders = {
            ...reqWithBody,
            headers: {
                ...c.req.raw.headers,
            },
        };

        await new Promise<void>((resolve, reject) => {
            passport.initialize()(
                reqWithHeaders as unknown as Request,
                c.res as unknown as Response,
                (err: unknown) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                },
            );
        });

        return next();
    };
}
