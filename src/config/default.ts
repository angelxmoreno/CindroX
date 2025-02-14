import type { LoggerOptions, TransportTargetOptions } from "pino";

const pinoLogFileLevel = Bun.env.LOGGER_FILE_LEVEL ?? null;
const pinoLogFilePath = Bun.env.LOGGER_FILE_PATH ?? null;
const pinoTargets: TransportTargetOptions[] = [{ target: "pino-pretty", options: { colorize: true }, level: "debug" }];
if (pinoLogFileLevel && pinoLogFilePath) {
    pinoTargets.push({ target: "pino/file", options: { destination: pinoLogFilePath }, level: pinoLogFileLevel });
}

const loggerConfig: LoggerOptions = {
    level: Bun.env.LOGGER_LEVEL ?? "info",
    transport: {
        targets: pinoTargets,
    },
};

const defaultConfig = {
    app: {
        name: Bun.env.APP_NAME ?? "sample app",
        environment: Bun.env.NODE_ENV ?? "test",
    },
    database: {
        name: Bun.env.MYSQL_DATABASE ?? "dbName",
        user: Bun.env.MYSQL_USER ?? "mysql-user",
        password: Bun.env.MYSQL_PASSWORD ?? "mysql-password",
        port: Number(Bun.env.MYSQL_PORT ?? 3306),
    },
    logger: loggerConfig,
} as const;

export type AppConfig = typeof defaultConfig;
export default defaultConfig;
