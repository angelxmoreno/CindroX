import { BaseAction } from "@actions/BaseAction";
import { appConfig } from "@config/app";
import type { UsersModel } from "@db/models/UsersModel";
import { userRegisterSchema } from "@validation/action/auth";
import type { Context } from "hono";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

/**
 * RegisterAction creates a new user and returns a JWT.
 *
 * It reads the email, password, and name from the request body, validates the input,
 * checks if a user already exists, and if not, creates the user via UsersModel.
 * (Note: UsersModel.create() handles password hashing internally.)
 * Finally, a JWT is signed with the user's ID and returned along with the user object.
 *
 * Endpoint: POST /auth/register
 */
//z.infer<NonNullable<TSchema>>
@injectable()
export class RegisterAction extends BaseAction<typeof userRegisterSchema> {
    validationSchema = userRegisterSchema;

    constructor(@inject("UsersModel") private usersModel: UsersModel) {
        super();
    }

    async handle(c: Context): Promise<Response> {
        try {
            const { name, email, password } = this.getFormData(c);

            // Check if a user with the given email already exists.
            const existingUser = await this.usersModel.findByEmail(email);
            if (existingUser) {
                return c.json({ message: "User already exists" }, 400);
            }

            // Create the user using UsersModel (password hashing is handled internally).
            const user = await this.usersModel.create({ email, password, name });

            // Sign a JWT with the user's ID.
            const token = jwt.sign({ id: user.id }, appConfig.passport.strategies.jwt.secret, { expiresIn: "1h" });

            // Optionally, you could return a 201 status code for resource creation.
            return c.json({ user, token });
        } catch (error) {
            // Log error as needed and return a 500 response.
            console.error("Registration error:", error);
            return c.json({ message: "Registration failed" }, 500);
        }
    }
}
