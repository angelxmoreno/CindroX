import type { DatabaseConfig } from "@config/modules/DrizzleModuleClass";
import type { LoggerOptions, TransportTargetOptions } from "pino";

const nodeEnv = Bun.env.NODE_ENV ?? "test";
const isTestEnv = nodeEnv === "test";

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

const databaseConfig: DatabaseConfig = {
    url: (isTestEnv ? Bun.env.TEST_DATABASE_URL : Bun.env.DATABASE_URL) ?? "mysql://localhost/test",
    collation: Bun.env.DATABASE_COLLATION ?? "utf8mb4_unicode_ci",
    timezone: Bun.env.DATABASE_TIMEZONE ?? "UTC",
};

const defaultConfig = {
    app: {
        name: Bun.env.APP_NAME ?? "sample app",
        environment: nodeEnv,
        port: Number(Bun.env.SERVER_PORT ?? 3001),
    },
    database: databaseConfig,
    passport: {
        strategies: {
            jwt: {
                secret: Bun.env.JWT_SECRET ?? "secret_key",
            },
        },
    },
    logger: loggerConfig,
    cache: {
        driver: Bun.env.CACHE_DRIVER ?? "memory",
        redisUrl: Bun.env.REDIS_CACHE_URL ?? null,
    },
    bullMq: {
        redisUrl: Bun.env.QUEUE_REDIS_URL ?? "memory",
        queues: ["helloQueue"],
    },
} as const;

export type AppConfig = typeof defaultConfig;
export default defaultConfig;
