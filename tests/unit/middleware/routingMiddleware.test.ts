import { describe, expect, it, spyOn } from "bun:test";
import AppContainer from "@config/container";
import { routingMiddleware } from "@middleware/routingMiddleware";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

describe("Routing Middleware", () => {
    it("should return 404 when no matching action is found", () => {
        const logger = AppContainer.getLogger("Router");
        const loggerSpy = spyOn(logger, "warn");

        const mockContext = {
            req: {
                method: "POST",
                path: "/nonexistent",
            },
        } as unknown as Context;

        // ✅ Fix: Remove `await` since it's unnecessary
        expect(() => routingMiddleware(mockContext)).toThrow(HTTPException);
        expect(loggerSpy).toHaveBeenCalledWith("! No action found for POST:/nonexistent");
    });
});
