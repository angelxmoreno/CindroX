import { describe, expect, test } from "bun:test";
import { BaseAction } from "@actions/BaseAction";
import { HonoTestHelper } from "@test-helpers/HonoTestHelper";
import { ValidationHTTPException } from "@validation/ValidationHTTPException";
import type { Context } from "hono";
import { z } from "zod";

// Define a dummy Zod schema for testing.
const dummySchema = z.object({
    foo: z.string(),
});

/**
 * DummyAction is a simple test implementation of BaseAction.
 * It uses a Zod schema that expects an object with a single property "foo" (a string).
 * Its handle() method returns a JSON response containing:
 *  - The validated data (stored via getFormData)
 *  - A flag set by a pre-handler.
 */
class DummyAction extends BaseAction<typeof dummySchema> {
    // Define a simple validation schema.
    protected validationSchema = dummySchema;
    protected useAuth = false;

    async handle(c: Context): Promise<Response> {
        // Retrieve the validated data stored on the context.
        const validated = this.getFormData(c);
        // Retrieve a flag that might be set by a pre-handler.
        const preFlag = c.get("preFlag");
        return new Response(JSON.stringify({ validated, preFlag }), {
            headers: { "Content-Type": "application/json" },
        });
    }
}

describe("BaseAction", () => {
    const testHelper = new HonoTestHelper();

    test("execute runs pre-handlers and validates request", async () => {
        const action = new DummyAction();
        // Add a pre-handler that sets a flag on the context.
        action.addPreHandler(async (c, next) => {
            c.set("preFlag", true);
            await next();
        });
        // Create a fake context that returns valid JSON.
        const { ctx } = testHelper.createMockContext({
            json: async <T = unknown>(): Promise<T> => ({ foo: "bar" }) as unknown as T,
        });
        const response = await action.execute(ctx);
        const body = await response.json();
        expect(body).toEqual({
            validated: { foo: "bar" },
            preFlag: true,
        });
    });

    test("execute throws validation exception on invalid input", async () => {
        const action = new DummyAction();
        // Create a fake context that returns an empty object (missing required 'foo').
        const { ctx } = testHelper.createMockContext({
            json: async <T = unknown>(): Promise<T> => ({}) as unknown as T,
        });
        try {
            await action.execute(ctx);
            throw new Error("Expected validation to fail");
        } catch (error) {
            // Check that the error is an instance of ValidationHTTPException.
            expect(error).toBeInstanceOf(ValidationHTTPException);
            // Optionally, you could further check the error details:
            // expect((error as ValidationHTTPException).details).toHaveProperty("field", "foo");
        }
    });
});
