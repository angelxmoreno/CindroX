import { describe, expect, it, spyOn } from "bun:test";
import AppContainer from "@config/container";
import { errorMiddleware } from "@middleware/errorMiddleware";
import { HonoTestHelper } from "@test-helpers/HonoTestHelper";
import { HTTPException } from "hono/http-exception";

describe("Error Middleware", () => {
    it("should handle HTTPException and return the correct response", async () => {
        const logger = AppContainer.getLogger("ErrorMiddleware");
        const errorLoggerSpy = spyOn(logger, "error");

        const httpError = new HTTPException(404, { message: "Not Found" });
        const helper = new HonoTestHelper();
        const { ctx } = helper.createMockContext();
        const response = await errorMiddleware(httpError, ctx);
        expect(errorLoggerSpy).toHaveBeenCalledWith(httpError.name);
        expect(response.status).toBe(404);
    });

    it("should handle unknown errors and return a 500 response", async () => {
        const logger = AppContainer.getLogger("ErrorMiddleware");
        const errorLoggerSpy = spyOn(logger, "error");
        const helper = new HonoTestHelper();
        const { ctx } = helper.createMockContext();
        const unknownError = new Error("Unexpected Error");
        const response = await errorMiddleware(unknownError, ctx);

        expect(errorLoggerSpy).toHaveBeenCalledWith(`❌ Unhandled error: ${unknownError}`);
        expect(response.status).toBe(500);
    });
});
