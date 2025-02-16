import { describe, expect, it, spyOn } from "bun:test";
import { LoggerRegistry } from "@config/modules/LoggerRegistry";
import pino from "pino";

describe("LoggerRegistry", () => {
    it("should return the same logger instance for the same module name", () => {
        const parentLogger = pino();
        const spy = spyOn(parentLogger, "child");
        // ✅ Initialize LoggerRegistry
        const registry = new LoggerRegistry(parentLogger);

        // ✅ Get logger for "ModuleA" twice
        const loggerA1 = registry.getLogger("ModuleA");
        const loggerA2 = registry.getLogger("ModuleA");

        // ✅ Expect the same instance to be returned
        expect(loggerA1).toBe(loggerA2);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should create a new logger instance for a different module name", () => {
        const parentLogger = pino();
        const spy = spyOn(parentLogger, "child");
        // ✅ Initialize LoggerRegistry
        const registry = new LoggerRegistry(parentLogger);

        // ✅ Get loggers for two different modules
        const loggerA = registry.getLogger("ModuleA");
        const loggerB = registry.getLogger("ModuleB");

        expect(spy).toHaveBeenCalledWith({ name: "ModuleA" });
        expect(spy).toHaveBeenCalledWith({ name: "ModuleB" });

        // ✅ Ensure different instances are created
        expect(loggerA).not.toBe(loggerB);
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
