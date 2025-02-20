import { userInsertSchema } from "@validation/model/usersValidation";

/**
 * userLogInSchema validates the payload for user login.
 *
 * It reuses the email and password validations from userInsertSchema.
 */
export const userLogInSchema = userInsertSchema.pick({
    email: true,
    password: true,
});

/**
 * userRegisterSchema validates the payload for user registration.
 *
 * Since registering a user typically requires the same data as inserting a new user,
 * we can reuse the entire userInsertSchema. If needed, you can extend or modify this schema
 * to add extra validations (e.g. confirming password).
 */
export const userRegisterSchema = userInsertSchema;
