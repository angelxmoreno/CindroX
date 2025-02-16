import { describe, expect, it, spyOn } from "bun:test";
import AppContainer from "@config/container";
import { errorMiddleware } from "@middleware/errorMiddleware";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

describe("Error Middleware", () => {
    it("should handle HTTPException and return the correct response", () => {
        const logger = AppContainer.getLogger("ErrorMiddleware");
        const spy = spyOn(logger, "error");

        const httpError = new HTTPException(404, { message: "Not Found" });
        // ✅ Mock context
        const mockContext = {
            req: {
                method: "GET",
                path: "/test",
            },
        } as unknown as Context;

        const response = errorMiddleware(httpError, mockContext) as Response;
        expect(spy).toHaveBeenCalledWith(httpError.name);
        expect(response.status).toBe(404);
    });

    it("should handle unknown errors and return a 500 response", () => {
        const logger = AppContainer.getLogger("ErrorMiddleware");
        const spy = spyOn(logger, "error");
        // ✅ Mock context
        const mockContext = {
            req: {
                method: "GET",
                path: "/test",
            },
        } as unknown as Context;

        const unknownError = new Error("Unexpected Error");
        const response = errorMiddleware(unknownError, mockContext) as Response;

        expect(spy).toHaveBeenCalledWith(`❌ Unhandled error: ${unknownError}`);
        expect(response.status).toBe(500);
    });
});
