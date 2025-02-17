import * as path from "node:path";
import type { Config as DrizzleKitConfig } from "drizzle-kit";
import { drizzle } from "drizzle-orm/mysql2";
import type { MySql2Database } from "drizzle-orm/mysql2/driver";
import type { Logger } from "pino";

export type DatabaseConfig = {
    url: string;
    collation: string;
    timezone: string;
};

const dbPath = path.join(__dirname, "..", "..", "db");

export class DrizzleModuleClass {
    private readonly database: MySql2Database;
    private readonly logger: Logger;
    private readonly config: DatabaseConfig;
    private readonly drizzleKitConfiguration: DrizzleKitConfig;

    constructor(config: DatabaseConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
        this.database = drizzle(this.config.url, {
            logger: {
                logQuery: (query: string, params: unknown[]) => {
                    if (params && params.length > 0) {
                        this.logger.debug(params, query);
                    } else {
                        this.logger.debug(query);
                    }
                },
            },
        });

        this.drizzleKitConfiguration = {
            dialect: "mysql",
            out: path.join(dbPath, "migrations"),
            schema: path.join(dbPath, "schemas"),
            dbCredentials: {
                url: this.config.url,
            },
        };
    }

    get db(): MySql2Database {
        return this.database;
    }

    get drizzleKitConfig(): DrizzleKitConfig {
        return this.drizzleKitConfiguration;
    }
}
