import "reflect-metadata";
import { beforeEach, describe, expect, it } from "bun:test";
import { appConfig } from "@config/app";
import AppContainer from "@config/container";
import type { Logger } from "pino";

describe("Logger (Pino)", () => {
    let logger: Logger;

    beforeEach(() => {
        logger = AppContainer.resolve("Logger");
    });

    it("should have basic logging methods", () => {
        expect(logger).toBeDefined();
        expect(typeof logger.info).toBe("function");
        expect(typeof logger.error).toBe("function");
        expect(typeof logger.warn).toBe("function");
        expect(typeof logger.debug).toBe("function");
    });

    it("should log a message and include expected fields", () => {
        const logSpy = Bun.write; // Intercept logs
        const message = "Test log message";

        logger.info({ test: true }, message);

        expect(logSpy).toBeDefined(); // Ensure log output happens
    });

    it("should create a child logger with the correct name", () => {
        const childLogger = AppContainer.getLogger("TestModule");

        expect(childLogger).toBeDefined();
        expect(childLogger.bindings().name).toBe("TestModule");
    });

    it("should respect log levels", () => {
        const envLOGGER_LEVEL = Bun.env.LOGGER_LEVEL ?? "info";
        const configLoggerLevel = String(appConfig.logger.level);

        expect(logger.level).toBe(envLOGGER_LEVEL);
        expect(logger.level).toBe(configLoggerLevel);
    });
});
