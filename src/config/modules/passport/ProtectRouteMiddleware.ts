import { AUTH_IN_USER_KEY } from "@actions/BaseAction";
import passport from "@config/modules/passport";
import type { Request, Response } from "express";
import type { Context, Next } from "hono";

/**
 * ProtectRouteMiddleware adapts Passport's JWT authentication middleware
 * for use in a Hono application.
 *
 * This middleware parses the request body if needed and then calls
 * passport.authenticate('jwt', { session: false }) to verify the JWT.
 * If authentication fails, it prevents access to the route.
 *
 * On success, the authenticated user is attached to the context (c.user) for further processing.
 *
 * Usage:
 *   import { ProtectRouteMiddleware } from "path/to/ProtectRouteMiddleware";
 *   app.get("/protected", ProtectRouteMiddleware(), handler);
 *
 * @returns A Hono-compatible middleware function.
 */
export function ProtectRouteMiddleware() {
    return async (c: Context, next: Next) => {
        // Use Passport's JWT strategy to authenticate.
        await new Promise<void>((resolve, reject) => {
            passport.authenticate("jwt", { session: false }, (err: unknown, user: unknown, _info: unknown) => {
                if (err || !user) {
                    reject(err || new Error("Unauthorized"));
                } else {
                    c.set(AUTH_IN_USER_KEY, user);
                    resolve();
                }
            })(c.req as unknown as Request, c.res as unknown as Response, (err?: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // Proceed to the next middleware.
        return next();
    };
}
