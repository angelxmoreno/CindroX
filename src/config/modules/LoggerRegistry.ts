import type { Logger } from "pino";

export class LoggerRegistry {
    private parentLogger: Logger;
    private loggers = new Map<string, Logger>();

    constructor(parentLogger: Logger) {
        this.parentLogger = parentLogger;
    }

    getLogger(moduleName: string): Logger {
        let logger = this.loggers.get(moduleName);
        if (!logger) {
            logger = this.parentLogger.child({ name: moduleName });
            this.loggers.set(moduleName, logger);
        }
        return logger;
    }
}
