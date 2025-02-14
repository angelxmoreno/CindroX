const defaultConfig = {
    app: {
        name: Bun.env.APP_NAME ?? "sample app",
        environment: Bun.env.NODE_ENV ?? "development",
    },
    database: {
        name: Bun.env.MYSQL_DATABASE ?? "dbName",
        user: Bun.env.MYSQL_USER ?? "mysql-user",
        password: Bun.env.MYSQL_PASSWORD ?? "mysql-password",
        port: Number(Bun.env.MYSQL_PORT ?? 3306),
    },
    logger: {
        level: Bun.env.LOGGER_LEVEL ?? "info",
        transport: {
            targets: [
                { target: "pino-pretty", options: { colorize: true }, level: "debug" },
                { target: "pino/file", options: { destination: "./logs/info.log" }, level: "info" },
            ],
        },
    },
} as const;

export type AppConfig = typeof defaultConfig;
export default defaultConfig;
