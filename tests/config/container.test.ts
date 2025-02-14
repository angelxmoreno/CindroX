import "reflect-metadata";
import { describe, expect, it } from "bun:test";
import AppContainer from "@config/container";

describe("Dependency Injection (AppContainer)", () => {
    it("should resolve Logger from AppContainer", () => {
        const logger = AppContainer.resolve("Logger");
        expect(logger).toBeDefined();
        expect(typeof logger.info).toBe("function");
    });

    it("should resolve EventManager from AppContainer", () => {
        const eventManager = AppContainer.resolve("EventManager");
        expect(eventManager).toBeDefined();
        expect(typeof eventManager.emit).toBe("function");
        expect(typeof eventManager.on).toBe("function");
    });

    it("should throw an error when resolving an unknown dependency", () => {
        // biome-ignore lint/suspicious/noExplicitAny: Explicitly testing resolution of an unknown service
        expect(() => AppContainer.resolve("NonExistentService" as any)).toThrow();
    });
});
