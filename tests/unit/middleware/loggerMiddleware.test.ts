import { describe, expect, it, spyOn } from "bun:test";
import AppContainer from "@config/container";
import { loggerMiddleware } from "@middleware/loggerMiddleware";
import { HonoTestHelper } from "@test-helpers/HonoTestHelper";

describe("Logger Middleware", () => {
    it("should log the request method and path", async () => {
        const logger = AppContainer.getLogger("RequestLogger");
        const infoLoggerSpy = spyOn(logger, "info");
        const helper = new HonoTestHelper();

        const { ctx } = helper.createMockContext({
            method: "GET",
            path: "/test",
        });
        const next = helper.createMockNext();
        await loggerMiddleware(ctx, next);

        expect(infoLoggerSpy).toHaveBeenCalledWith("📥 GET /test");
        expect(infoLoggerSpy).toHaveBeenCalledWith("📤 GET /test - Completed");
    });
});
