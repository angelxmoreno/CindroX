import { BaseAction } from "@actions/BaseAction";
import { appConfig } from "@config/app";
import passport from "@config/modules/passport";
import type { SelectUser } from "@db/schemas/users";
import { userLogInSchema } from "@validation/action/auth";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";

/**
 * LoginAction authenticates a user using Passport's Local Strategy.
 *
 * If the credentials are valid, a JWT is signed and returned along with the user object.
 * If authentication fails, an HTTPException with a 401 status is returned.
 *
 * Endpoint: POST /auth/login
 */
export class LoginAction extends BaseAction {
    validationSchema = userLogInSchema;

    async handle(c: Context): Promise<Response> {
        return new Promise((resolve, reject) => {
            // Authenticate using Passport's "local" strategy.
            passport.authenticate(
                "local",
                { session: false },
                (
                    err: Error,
                    user: SelectUser | null,
                    info:
                        | {
                              message?: string;
                          }
                        | string
                        | undefined,
                ) => {
                    if (err || !user) {
                        let infoMessage = "Unknown reason";
                        if (typeof info === "string") {
                            infoMessage = info;
                        } else if (info && typeof info === "object" && typeof info.message === "string") {
                            infoMessage = info.message;
                        }
                        const err401 = new HTTPException(401, {
                            message: infoMessage,
                            cause: err,
                        });
                        reject(err401);
                        return;
                    }
                    // If authentication is successful, sign a JWT with the user id.
                    const token = jwt.sign({ id: user.id }, appConfig.passport.strategies.jwt.secret, {
                        expiresIn: "1h",
                    });
                    resolve(c.json({ user, token }));
                },
            )(c.req, c.res, () => {});
        });
    }
}
