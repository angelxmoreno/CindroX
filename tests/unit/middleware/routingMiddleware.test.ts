import { describe, expect, it, spyOn } from "bun:test";
import AppContainer from "@config/container";
import { routingMiddleware } from "@middleware/routingMiddleware";
import { HonoTestHelper } from "@test-helpers/HonoTestHelper";
import { HTTPException } from "hono/http-exception";

describe("Routing Middleware", () => {
    it("should return 404 when no matching action is found", () => {
        const logger = AppContainer.getLogger("Router");
        const warnLoggerSpy = spyOn(logger, "warn");
        const helper = new HonoTestHelper();

        const { ctx } = helper.createMockContext({
            method: "POST",
            path: "/nonexistent",
        });
        expect(() => routingMiddleware(ctx)).toThrow(HTTPException);
        expect(warnLoggerSpy).toHaveBeenCalledWith("! No action found for POST:/nonexistent");
    });
});
