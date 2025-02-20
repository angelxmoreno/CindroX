import { usersTable } from "@db/schemas/users";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import type { ZodString } from "zod";

const refinements = {
    name: (schema: ZodString) => schema.max(100),
    email: (schema: ZodString) => schema.email({ message: "Invalid email address" }).max(200).trim().toLowerCase(),
    password: (schema: ZodString) =>
        schema
            .min(8, { message: "Password must be at least 8 characters" })
            .refine((val) => /[A-Z]/.test(val), { message: "Password must include an uppercase letter" })
            .refine((val) => /[a-z]/.test(val), { message: "Password must include a lowercase letter" })
            .refine((val) => /[0-9]/.test(val), { message: "Password must include a number" })
            .refine((val) => /[\W_]/.test(val), { message: "Password must include a special character" }),
};

export const userInsertSchema = createInsertSchema(usersTable, refinements);
export const userUpdateSchema = createUpdateSchema(usersTable, refinements);
