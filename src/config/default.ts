import path from "node:path";
import type { DatabaseConfig } from "@config/modules/DrizzleModuleClass";
import type { EmailConfig } from "email-templates";
import type { Address } from "nodemailer/lib/mailer";
import type { LoggerOptions, TransportTargetOptions } from "pino";

const nodeEnv = Bun.env.NODE_ENV ?? "test";
const isTestEnv = nodeEnv === "test";

const pinoTargets: TransportTargetOptions[] = [
    {
        target: "pino-pretty",
        options: { colorize: true },
        level: Bun.env.LOGGER_LEVEL ?? "info",
    },
];

const pinoLogFileLevel = Bun.env.LOGGER_FILE_LEVEL ?? Bun.env.LOGGER_LEVEL ?? "info";
const pinoLogFilePath = Bun.env.LOGGER_FILE_PATH ?? null;

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

type MailSettings = {
    transportUrl: string;
    from: Address;
    templatesConfig: EmailConfig;
};
const emailTemplateOptions: MailSettings = {
    transportUrl: Bun.env.MAIL_URL ?? "smtp://localhost:1025",
    from: {
        name: Bun.env.MAIL_FROM_NAME ?? "Admin",
        address: Bun.env.MAIL_FROM_EMAIL ?? "no-reply@local",
    },
    templatesConfig: {
        views: {
            root: path.resolve("src/templates/emails"),
            options: {
                extension: "hbs",
            },
        },
        send: true,
        juice: true, // Auto-inline styles
        juiceResources: {
            preserveImportant: true,
        },
    },
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
        redisUrl: Bun.env.QUEUE_REDIS_URL ?? "redis://redis",
        queues: ["helloQueue", "mailQueue"],
    },

    //@deprecated
    mailer: {
        url: Bun.env.MAIL_URL ?? "smtp://localhost:1025",
        fromEmail: Bun.env.MAIL_FROM_EMAIL ?? "no-reply@local",
        fromName: Bun.env.MAIL_FROM_NAME ?? "Admin",
    },
    emailTemplate: emailTemplateOptions,
} as const;

export type AppConfig = typeof defaultConfig;
export default defaultConfig;
