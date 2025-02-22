import { mock } from "bun:test";
import { LoggerRegistry } from "@config/modules/LoggerRegistry";
import type { Logger } from "pino";

export class LoggerTestHelper {
    static createMockLoggerRegistry(): LoggerRegistry {
        const { logger } = this.createMockLogger();
        return new LoggerRegistry(logger);
    }

    static createMockLogger(): {
        logger: Logger;
        infoLoggerMock: Logger["info"];
        warnLoggerMock: Logger["warn"];
        errorLoggerMock: Logger["error"];
        debugLoggerMock: Logger["debug"];
    } {
        const infoLoggerMock = mock();
        const warnLoggerMock = mock();
        const errorLoggerMock = mock();
        const debugLoggerMock = mock();

        const logger = {
            info: infoLoggerMock,
            warn: warnLoggerMock,
            error: errorLoggerMock,
            debug: debugLoggerMock,
            child: () => this.createMockLogger().logger,
        } as unknown as Logger;
        return { logger, infoLoggerMock, warnLoggerMock, errorLoggerMock, debugLoggerMock };
    }
}
