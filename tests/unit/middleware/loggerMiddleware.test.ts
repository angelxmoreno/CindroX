import { describe, expect, it, spyOn } from "bun:test";
import AppContainer from "@config/container";
import { loggerMiddleware } from "@middleware/loggerMiddleware";
import type { Context } from "hono";

describe("Logger Middleware", () => {
    it("should log the request method and path", async () => {
        // ✅ Get logger and spy on "info"
        const logger = AppContainer.getLogger("RequestLogger");
        const spy = spyOn(logger, "info");

        // ✅ Mock context
        const mockContext = {
            req: {
                method: "GET",
                path: "/test",
            },
        } as unknown as Context;

        // ✅ Mock async next function
        const next = async () => {};

        // ✅ Call middleware
        await loggerMiddleware(mockContext, next);

        // ✅ Validate logs
        expect(spy).toHaveBeenCalledWith("📥 GET /test");
        expect(spy).toHaveBeenCalledWith("📤 GET /test - Completed");

        // ✅ Restore spy after test
        spy.mockRestore();
    });
});
