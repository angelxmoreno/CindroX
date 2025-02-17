import "reflect-metadata";
import { describe, expect, it } from "bun:test";
import { appConfig } from "@config/app";

describe("App Configuration", () => {
    it("should have default values", () => {
        expect(appConfig.app.name).toBe("CindroX Sample API server");
        expect(appConfig.app.environment).toBe(Bun.env.NODE_ENV ?? "test");
    });
});
