import type { SelectUser } from "@db/schemas/users";
import type { Context } from "hono";

export const AUTH_IN_USER_KEY = "authInUser";

/**
 * BaseAction is an abstract class that all actions should extend.
 * It provides a default implementation for whether an action is protected.
 *
 * Subclasses can override the useAuth property or the isProtected getter
 * to indicate that they require authentication.
 */
export abstract class BaseAction {
    // Flag indicating if the action requires authentication.
    // By default, it is set to false.
    protected useAuth = false;

    /**
     * Determines whether the action requires authentication.
     * Subclasses can override this getter if needed.
     *
     * @returns true if authentication is required, false otherwise.
     */
    public get isProtected(): boolean {
        return this.useAuth;
    }

    /**
     * Handles an incoming request.
     *
     * Subclasses must implement this method to define the action's behavior.
     *
     * @param c - The Hono Context.
     * @returns A Promise resolving to a Response.
     */
    public abstract handle(c: Context): Promise<Response>;

    public getAuthUser(c: Context): SelectUser | null {
        return c.get(AUTH_IN_USER_KEY);
    }
}
