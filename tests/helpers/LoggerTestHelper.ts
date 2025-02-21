import { mock } from "bun:test";
import type { Logger } from "pino";

export class LoggerTestHelper {
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
        } as unknown as Logger;
        return { logger, infoLoggerMock, warnLoggerMock, errorLoggerMock, debugLoggerMock };
    }
}
