import { describe, expect, it } from "bun:test";
import { IndexAction as HealthIndexAction } from "@actions/health/indexAction";
import AppContainer from "@config/container";
import Emittery from "emittery";

describe("AppContainer (Dependency Injection)", () => {
    it("should resolve Logger from AppContainer", () => {
        const logger = AppContainer.resolve("Logger");
        expect(logger).toBeDefined();
        expect(typeof logger.info).toBe("function");
    });

    it("should create a child logger with the correct name", () => {
        const childLogger = AppContainer.getLogger("TestModule");
        expect(childLogger).toBeDefined();
        expect(typeof childLogger.info).toBe("function");
        expect(childLogger.bindings().name).toBe("TestModule");
    });

    it("should resolve EventManager from AppContainer", () => {
        const eventManager = AppContainer.resolve("EventManager");
        expect(eventManager).toBeDefined();
        expect(eventManager).toBeInstanceOf(Emittery);
    });

    it("should resolve Cache from AppContainer", () => {
        const cache = AppContainer.resolve("Cache");
        expect(cache).toBeDefined();
        expect(typeof cache.get).toBe("function");
        expect(typeof cache.set).toBe("function");
    });

    it("should resolve an action from AppContainer", () => {
        const actionInstance = AppContainer.resolveAction("GET:/health");
        expect(actionInstance).toBeDefined();
        expect(actionInstance).toBeInstanceOf(HealthIndexAction);
    });

    it("should return undefined when resolving a non-existent action", () => {
        const actionInstance = AppContainer.resolveAction("GET:/nonexistent");
        expect(actionInstance).toBeUndefined();
    });

    it("should throw an error when resolving an unknown dependency", () => {
        // biome-ignore lint/suspicious/noExplicitAny: Explicitly testing resolution of an unknown service
        expect(() => AppContainer.resolve("NonExistentService" as any)).toThrow();
    });
});
