import { ValidationHTTPException } from "@validation/ValidationHTTPException";
import type { Context, Handler } from "hono";
import type { ZodSchema, z } from "zod";

/**
 * Key used to store the authenticated user in the Hono Context.
 */
export const AUTH_IN_USER_KEY = "authUser";

/**
 * Key used to store validated form data in the Hono Context.
 */
export const FORM_DATA_KEY = "form";

/**
 * A helper type that infers the validated data type from a Zod schema,
 * or returns null if no schema is provided.
 */
type ValidatedData<TSchema> = TSchema extends ZodSchema ? z.infer<NonNullable<TSchema>> : null;

/**
 * BaseAction is an abstract class that all actions should extend.
 *
 * It provides a default mechanism for pre-handling (such as validation and middleware)
 * as well as retrieving the authenticated user from the context.
 *
 * Subclasses can override the `useAuth` flag to indicate whether the action requires
 * authentication, provide an optional Zod validation schema for request validation, and
 * define pre-handlers that run in a middleware-like chain before the main handler.
 */
export abstract class BaseAction<TSchema extends ZodSchema | undefined = undefined> {
    // Flag indicating whether this action requires authentication.
    // Defaults to false.
    protected useAuth = false;

    /**
     * Indicates whether the action requires authentication.
     * Subclasses can override the useAuth flag to enforce protection.
     */
    public get isProtected(): boolean {
        return this.useAuth;
    }

    /**
     * Optional Zod validation schema to validate the request body.
     *
     * If provided, the request body will be validated before calling the main handler.
     */
    protected validationSchema?: TSchema;

    /**
     * An array of pre-handler middleware functions executed before the main handle() method.
     *
     * Each pre-handler must follow the signature:
     * (c: Context, next: () => Promise<void>) => Promise<void>
     *
     * This allows you to add additional behavior (such as logging or sanitization)
     * in a composable, middleware-like fashion.
     */
    protected preHandlers: Array<Handler> = [];

    /**
     * Retrieves the authenticated user from the Hono Context.
     *
     * This method assumes that an authentication middleware has stored the user
     * under AUTH_IN_USER_KEY in the context.
     *
     * @param c - The Hono Context.
     * @returns The authenticated user, or undefined if no user is set.
     */
    protected getAuthUser(c: Context): unknown {
        return c.get(AUTH_IN_USER_KEY);
    }

    /**
     * Validates the request body using the provided Zod validation schema.
     *
     * This method attempts to parse the request body. If the body is empty
     * (i.e. JSON parsing fails with "Unexpected end of JSON input"), it throws a
     * ValidationHTTPException with a "Form body is empty" message. For any other
     * JSON parsing errors, it throws a "Invalid JSON body" exception.
     *
     * Once parsed, the data is validated using the schema's safeParse() method.
     * If validation fails, a ValidationHTTPException is thrown with the error details.
     * If successful, the validated data is stored in the context under FORM_DATA_KEY.
     *
     * @param c - The Hono Context.
     * @returns A Promise that resolves when validation is complete.
     * @throws ValidationHTTPException if JSON parsing or validation fails.
     */
    protected async validateRequest(c: Context): Promise<unknown> {
        if (!this.validationSchema) {
            return;
        }
        let parsedBody: unknown;
        try {
            parsedBody = await c.req.json();
        } catch (e) {
            const error = e as { message?: string };
            if (error.message?.includes("Unexpected end of JSON input")) {
                throw new ValidationHTTPException({ message: "Form body is empty" });
            }
            throw new ValidationHTTPException({ message: "Invalid JSON body" });
        }

        const result = this.validationSchema.safeParse(parsedBody);
        if (!result.success) {
            throw new ValidationHTTPException(result.error.flatten());
        }
        // Store the validated data on the context for later use.
        c.set(FORM_DATA_KEY, result.data);
        return result.data;
    }

    /**
     * Retrieves the validated form data from the context.
     *
     * If a validation schema was provided and the request body validated successfully,
     * the validated data is stored in the context under FORM_DATA_KEY.
     *
     * @param c - The Hono Context.
     * @returns The validated data (typed according to the validation schema), or null if none is present.
     */
    public getFormData(c: Context): ValidatedData<TSchema> {
        if (this.validationSchema) {
            return c.get(FORM_DATA_KEY) as z.infer<NonNullable<TSchema>>;
        }
        // Cast null to ValidatedData<TSchema> to satisfy the type.
        return null as ValidatedData<TSchema>;
    }

    /**
     * Executes the action by first running any pre-handlers (middleware-like functions)
     * and then validating the request body (if a validation schema is provided) before
     * calling the action's main handle() method.
     *
     * Pre-handlers are composed in a middleware chain via runPreHandlers().
     *
     * @param c - The Hono Context.
     * @returns A Promise resolving to a Response.
     * @throws ValidationHTTPException if validation fails.
     */
    public async execute(c: Context): Promise<Response> {
        // Run all pre-handlers as a middleware chain.
        await this.runPreHandlers(c);

        // Validate the request body if a validation schema is provided.
        if (this.validationSchema) {
            await this.validateRequest(c);
        }
        // Call the main action handler.
        return this.handle(c);
    }

    /**
     * Abstract method that subclasses must implement to define the action's behavior.
     *
     * @param c - The Hono Context.
     * @returns A Promise resolving to a Response.
     */
    public abstract handle(c: Context): Promise<Response>;

    /**
     * Executes pre-handler middleware functions in sequence.
     *
     * This method simulates a middleware chain by iterating through the preHandlers array.
     * Each middleware function receives the current context and a next function that
     * calls the next middleware in the chain.
     *
     * @param c - The Hono Context.
     * @returns A Promise that resolves when all pre-handlers have been executed.
     */
    protected async runPreHandlers(c: Context): Promise<void> {
        let index = 0;
        const next = async (): Promise<void> => {
            if (index < this.preHandlers.length) {
                const middleware = this.preHandlers[index];
                index++;
                await middleware(c, next);
            }
        };
        await next();
    }

    /**
     * Adds a pre-handler middleware function to the action's pre-handlers chain.
     *
     * @param handler - A Hono middleware function that accepts a Context and Next callback.
     */
    public addPreHandler(handler: Handler): void {
        this.preHandlers.push(handler);
    }
}
